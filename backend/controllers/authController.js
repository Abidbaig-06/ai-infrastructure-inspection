const User = require('../../database/models/User');
const { isUsingMongo, getMemoryDb, persistMemoryDb } = require('../../database/connection');
const { seedUsers } = require('../../database/seed/seedData');

const initMemoryUsers = () => {
  const db = getMemoryDb();
  if (!db.users || db.users.length === 0) {
    db.users = JSON.parse(JSON.stringify(seedUsers));
    persistMemoryDb();
  }
};

// @desc Get available Demo Officer Profiles for 1-click test login
exports.getDemoOfficers = async (req, res) => {
  try {
    return res.json({
      success: true,
      data: seedUsers.map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        department: u.department,
        badgeNumber: u.badgeNumber,
        avatar: u.avatar,
        assignedWards: u.assignedWards
      }))
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving demo officers' });
  }
};

// @desc Login officer / agent
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (isUsingMongo()) {
      let user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        // Find matching seed user or create on the fly for demo
        const demo = seedUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (demo) {
          user = await User.create(demo);
        } else {
          user = await User.create({
            name: email.split('@')[0].toUpperCase(),
            email: email.toLowerCase(),
            password: password || 'demo',
            role: role || 'DISPATCH_OFFICER',
            department: 'Municipal Operations',
            badgeNumber: 'OFF-' + Math.floor(1000 + Math.random() * 9000),
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            assignedWards: ['All Wards']
          });
        }
      }

      return res.json({
        success: true,
        token: 'jwt-civicpulse-token-' + user._id,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          badgeNumber: user.badgeNumber,
          avatar: user.avatar,
          assignedWards: user.assignedWards
        }
      });
    } else {
      initMemoryUsers();
      let user = getMemoryDb().users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        user = {
          _id: 'usr_' + Date.now(),
          name: email.split('@')[0],
          email: email.toLowerCase(),
          role: role || 'DISPATCH_OFFICER',
          department: 'Municipal Operations Command',
          badgeNumber: 'OFF-' + Math.floor(1000 + Math.random() * 9000),
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          assignedWards: ['All Wards']
        };
        getMemoryDb().users.push(user);
        persistMemoryDb();
      }

      return res.json({
        success: true,
        token: 'jwt-civicpulse-token-' + user._id,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          badgeNumber: user.badgeNumber,
          avatar: user.avatar,
          assignedWards: user.assignedWards
        }
      });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};
