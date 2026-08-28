/**
 * Complaint persistence layer.
 *
 * Priority:
 *   1. Supabase  (public.civic_complaints)  — durable, works on serverless
 *   2. Mongo     (existing Complaint model) — if USE_MONGO=true
 *   3. In-memory JSON store                 — local dev fallback
 *
 * All methods return plain complaint objects in the same shape the frontend
 * already expects (the `payload` jsonb column IS that object).
 */

const { supabase, isSupabaseActive } = require('./supabaseClient');
const { isUsingMongo, getMemoryDb, persistMemoryDb } = require('../../database/connection');
const { seedComplaints } = require('../seed/seedData');

const TABLE = 'civic_complaints';

const useSupabase = () => {
  try { return isSupabaseActive() && !!supabase; } catch { return false; }
};

// ---- shape helpers -----------------------------------------------------------

const toRow = (c) => ({
  ticket_id: c.ticketId,
  title: c.title || null,
  description: c.description || null,
  category: c.category || null,
  ward: c.location?.ward || null,
  status: c.status || 'AI_TRIAGED',
  severity: c.aiAnalysis?.severity || null,
  risk_score: Number.isFinite(c.aiAnalysis?.riskScore) ? c.aiAnalysis.riskScore : null,
  image_url: c.imageUrl || null,
  latitude: Number.isFinite(Number(c.location?.latitude)) ? Number(c.location.latitude) : null,
  longitude: Number.isFinite(Number(c.location?.longitude)) ? Number(c.location.longitude) : null,
  payload: c,
  updated_at: new Date().toISOString(),
});

const fromRow = (row) => {
  const p = row.payload || {};
  return {
    ...p,
    _id: p._id || row.id,
    ticketId: p.ticketId || row.ticket_id,
    status: row.status || p.status,
    createdAt: p.createdAt || row.created_at,
    updatedAt: row.updated_at || p.updatedAt,
  };
};

// ---- in-memory helpers -----------------------------------------------------

const initMemory = () => {
  const db = getMemoryDb();
  if (!db.complaints || db.complaints.length === 0) {
    db.complaints = JSON.parse(JSON.stringify(seedComplaints));
    persistMemoryDb();
  }
  return db;
};

// ---- public API ------------------------------------------------------------

/** Ensure the Supabase table has the demo seed rows (idempotent). */
const ensureSeed = async () => {
  if (!useSupabase()) return;
  try {
    const { count, error } = await supabase
      .from(TABLE)
      .select('ticket_id', { count: 'exact', head: true });
    if (error) { console.warn('[complaintStore] seed check error:', error.message); return; }
    if ((count || 0) > 0) return;
    const rows = seedComplaints.map(toRow);
    const { error: insErr } = await supabase.from(TABLE).upsert(rows, { onConflict: 'ticket_id' });
    if (insErr) console.warn('[complaintStore] seed insert error:', insErr.message);
    else console.log(`[complaintStore] seeded ${rows.length} complaints into Supabase`);
  } catch (e) {
    console.warn('[complaintStore] ensureSeed failed:', e.message);
  }
};

/** List all complaints (newest first). */
const list = async () => {
  if (useSupabase()) {
    await ensureSeed();
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('[complaintStore] list error, falling back to seed:', error.message);
      return JSON.parse(JSON.stringify(seedComplaints));
    }
    return (data || []).map(fromRow);
  }
  if (isUsingMongo()) {
    const Complaint = require('../models/Complaint');
    const docs = await Complaint.find().sort({ createdAt: -1 });
    return docs.map((d) => d.toObject());
  }
  return [...initMemory().complaints];
};

/** Find one by ticketId or _id. */
const findByTicket = async (idOrTicket) => {
  const key = String(idOrTicket || '');
  if (useSupabase()) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .or(`ticket_id.eq.${key},ticket_id.eq.${key.toUpperCase()}`)
      .limit(1);
    if (error) { console.warn('[complaintStore] findByTicket error:', error.message); return null; }
    if (data && data[0]) return fromRow(data[0]);
    // maybe they passed the uuid
    const { data: byId } = await supabase.from(TABLE).select('*').eq('id', key).limit(1);
    return byId && byId[0] ? fromRow(byId[0]) : null;
  }
  if (isUsingMongo()) {
    const Complaint = require('../models/Complaint');
    const doc = await Complaint.findOne({ $or: [{ ticketId: key.toUpperCase() }, { ticketId: key }] });
    return doc ? doc.toObject() : null;
  }
  const db = initMemory();
  return db.complaints.find(
    (c) => c.ticketId?.toUpperCase() === key.toUpperCase() || c._id === key
  ) || null;
};

/** Insert a new complaint. Returns the stored object. */
const create = async (complaint) => {
  if (useSupabase()) {
    const { data, error } = await supabase
      .from(TABLE)
      .insert(toRow(complaint))
      .select()
      .single();
    if (error) {
      console.error('[complaintStore] create error:', error.message);
      throw new Error(error.message);
    }
    return fromRow(data);
  }
  if (isUsingMongo()) {
    const Complaint = require('../models/Complaint');
    const doc = await Complaint.create(complaint);
    return doc.toObject();
  }
  const db = initMemory();
  const withId = { ...complaint, _id: complaint._id || 'cmp_' + Date.now() };
  db.complaints.unshift(withId);
  persistMemoryDb();
  return withId;
};

/**
 * Apply a mutation to an existing complaint and persist it.
 * `mutator(complaint)` should mutate the object in place (or return a new one).
 * Returns the updated object, or null if not found.
 */
const update = async (idOrTicket, mutator) => {
  const existing = await findByTicket(idOrTicket);
  if (!existing) return null;
  const next = mutator(existing) || existing;
  next.updatedAt = new Date().toISOString();

  if (useSupabase()) {
    const { data, error } = await supabase
      .from(TABLE)
      .update(toRow(next))
      .eq('ticket_id', next.ticketId)
      .select()
      .single();
    if (error) {
      console.error('[complaintStore] update error:', error.message);
      throw new Error(error.message);
    }
    return fromRow(data);
  }
  if (isUsingMongo()) {
    const Complaint = require('../models/Complaint');
    const doc = await Complaint.findOneAndUpdate(
      { $or: [{ _id: next._id }, { ticketId: next.ticketId }] },
      next,
      { new: true }
    );
    return doc ? doc.toObject() : null;
  }
  const db = initMemory();
  const i = db.complaints.findIndex(
    (c) => c._id === next._id || c.ticketId === next.ticketId
  );
  if (i === -1) return null;
  db.complaints[i] = next;
  persistMemoryDb();
  return next;
};

module.exports = { list, findByTicket, create, update, ensureSeed };
