import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  ChevronDown,
  RefreshCw,
  HelpCircle,
  MapPin,
  Scan,
  Sliders,
  History,
  FileCheck,
  Zap,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const QUICK_QUESTIONS = [
  {
    icon: '🛰️',
    label: 'How does the Map work?',
    query: 'How does the Aerial Satellite Map work?'
  },
  {
    icon: '🔴',
    label: 'What do Red & Yellow dots mean?',
    query: 'What is the difference between Red and Yellow dots on the map?'
  },
  {
    icon: '🔍',
    label: 'How to inspect a defect?',
    query: 'How do I inspect a defect and open AI Vision detection?'
  },
  {
    icon: '📄',
    label: 'How to generate Dossier?',
    query: 'How do I generate a Statutory Municipal Dossier?'
  },
  {
    icon: '🕒',
    label: 'Asset Maintenance History?',
    query: 'How does Asset Maintenance History work?'
  },
  {
    icon: '🎛️',
    label: 'Resource Prioritization?',
    query: 'What is Resource-Aware Prioritization and how do I use it?'
  },
  {
    icon: '🏛️',
    label: 'What is Infraspection?',
    query: 'What is the purpose of Infraspection and what does this platform do?'
  }
];

// Knowledge base answer generator
const generateAssistantResponse = (question) => {
  const q = question.toLowerCase();

  if (q.includes('map') || q.includes('aerial') || q.includes('satellite')) {
    return `🛰️ **Aerial Satellite Map Guide**:
• **Interactive GIS**: Displays real-time geocoded infrastructure hazards and public grievances across Guntur Municipal Corporation (GMC).
• **Touch to Inspect**: Touch or click any **Red or Yellow Dot**. The map smoothly glides and places the preview box in the **dead-center of your screen**.
• **Map Layers**: Use the top-left switch to toggle between **Aerial Satellite**, **Streets**, and **OpenStreetMap**.
• **Inspect**: Press the **"AI Vision & Defect Detection"** button in the preview box to launch the deep-dive analysis modal.`;
  }

  if (q.includes('red') || q.includes('yellow') || q.includes('dot') || q.includes('color') || q.includes('severity')) {
    return `🔴 **Red vs Yellow Hazard Markers**:
• 🔴 **Red Dots (Critical / High Risk)**:
  - Severe infrastructure failures (e.g. 15cm road craters, ruptured water mains, dangling 440V live electrical cables).
  - Risk Score: **70–100 / 100**.
  - Statutory SLA: Emergency response within **4 to 24 hours**.

• 🟡 **Yellow / Amber Dots (Medium Risk)**:
  - Standard maintenance issues (e.g. solid waste debris, non-functional streetlamps, surface wear).
  - Risk Score: **40–69 / 100**.
  - Statutory SLA: Resolution within **48 to 72 hours**.`;
  }

  if (q.includes('inspect') || q.includes('vision') || q.includes('defect') || q.includes('modal') || q.includes('ai vision')) {
    return `🔍 **AI Vision & Defect Detection**:
1. **Select a Defect**: Touch any Red/Yellow dot on the map or click **"Inspect Issue ➔"** on the evidence feed cards below the map.
2. **Open Analysis**: Click the **"AI Vision & Defect Detection"** button inside the centered popup.
3. **What AI analyzes**:
   - **Computer Vision Tag**: Detects asphalt fractures, pipe cavities, live wire snaps, or waste volume.
   - **AI Hazard Risk Index**: Computes composite risk (0–100) based on severity, traffic density, and monsoon ingress.
   - **IRC Standard Directives**: Recommends compliant machinery (Hot-box unit, compactor, scissor lift) and BOQ budget estimate.
   - **Field Actions**: Directly dispatch field crews or create engineering work orders.`;
  }

  if (q.includes('dossier') || q.includes('statutory') || q.includes('report') || q.includes('pdf')) {
    return `📄 **Statutory Municipal Dossier**:
• **What it is**: An official, evidence-linked engineering assessment report compliant with **IRC & CPHEEO municipal engineering standards**.
• **How to Generate**:
  1. Click the **"Generate Statutory Dossier"** button at the top-right of your workspace.
  2. Review the technical assessment, defect dimensions, forensic audit trail, and officer digital verification.
  3. Click **"Print / Export Statutory PDF"** for physical signing or archival submission.`;
  }

  if (q.includes('history') || q.includes('asset') || q.includes('maintenance')) {
    return `🕒 **Asset Maintenance History**:
• Click the **"Asset Maintenance History"** tab at the top.
• **Select Assets**: Switch between **Road Corridor R-104**, **Water Main Trunk W-009**, **Electrical Grid E-044**, and **Drainage D-018**.
• **Insights Provided**:
  - Asset Health Index & Degradation curve.
  - Previous repair work orders and contractor audit logs.
  - Predictive maintenance schedule to prevent structural collapses.`;
  }

  if (q.includes('priorit') || q.includes('resource') || q.includes('budget') || q.includes('slider')) {
    return `🎛️ **Resource-Aware Prioritization**:
• Click the **"Resource-Aware Prioritization"** tab in the top navigation bar.
• **Multi-Factor Risk Engine**: Adjust simulation sliders for:
  - 🌧️ **Monsoon Weather Ingress**
  - 🚗 **Traffic Density Weight**
  - 🏫 **School / Hospital Proximity**
  - 💰 **Available Municipal Budget Allocation**
• The neural engine automatically recalculates and ranks which infrastructure defects must be repaired first to maximize public safety.`;
  }

  if (q.includes('infraspection') || q.includes('purpose') || q.includes('about') || q.includes('what is')) {
    return `🏛️ **About Infraspection Platform**:
Infraspection is an AI-powered municipal infrastructure inspection and autonomous triage system designed for **Guntur Municipal Corporation (GMC)**.
• **Key Capabilities**:
  1. **Citizen Grievance Ingestion**: AI multi-angle image verification for pothole, water, electrical, and sanitation reports.
  2. **Real-Life Satellite GIS**: Dynamic map visualization of active city defects.
  3. **Computer Vision & Risk Indexing**: Automated damage measurement and IRC standard compliance.
  4. **Rapid Field Dispatch**: Assigns response crews with equipment checklists in seconds.`;
  }

  if (q.includes('crew') || q.includes('dispatch') || q.includes('work order')) {
    return `👷 **Dispatching Field Crews & Work Orders**:
• Inside any defect modal, click **"Dispatch Field Crew"** to assign a specialized unit (e.g. GMC-RAPID-01, GMC-ELEC-03) with live ETA tracking.
• Click **"Issue Work Order"** to generate an official contractor scope of work with safety checklists and material budgets.`;
  }

  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('help')) {
    return `👋 **Hello! How can I guide you today?**
I can explain any section of the **Infraspection Workspace**:
• How to use the **Aerial Satellite Map**
• What **Red vs Yellow dots** represent
• How to run **AI Vision Defect Detection**
• How to generate **Statutory Dossiers**
• How to use **Asset History** & **Prioritization**

Feel free to pick one of the quick chips above or type your question!`;
  }

  // Default helpful response
  return `🤖 **Infraspection Guide Assistant**:
I can assist you with understanding any feature on this page:
• **Aerial Satellite Map**: Touch any red/yellow dot to center the preview box, then click "AI Vision & Defect Detection".
• **Top Navigation Tabs**: Switch between **Aerial Satellite**, **Asset Maintenance History**, and **Resource-Aware Prioritization**.
• **Statutory Dossier**: Click the top-right button to create official municipal technical reports.

*You can ask me specific questions like "What do the colors mean?", "How does AI analyze risk?", or "How do I dispatch a crew?"*`;
};

export const InfraspectionAIAssistantBot = () => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: `👋 **Welcome to Infraspection!**\n\nI am your **AI Guide Assistant**. I can explain how to use the Aerial Satellite Map, inspect defects with AI Vision, generate statutory dossiers, or navigate any feature on this platform.\n\n*What would you like assistance with?*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate natural AI thinking delay
    setTimeout(() => {
      const botReplyText = generateAssistantResponse(query);
      const botMsg = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: botReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        sender: 'bot',
        text: `🔄 Chat reset. How can I assist you with using the Infraspection platform?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  if (!currentUser) return null;

  return (
    <>
      {/* Floating Action Button (Bottom Right) - Premium Circular Robot Badge */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-3">
        {!isOpen && (
          <div className="relative group">
            {/* Robot Mascot Button */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="relative w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 group focus:outline-none drop-shadow-xl"
              title="Infraspection AI Guide Assistant"
            >
              <img
                src="/ai_robot_avatar.png"
                alt="AI Guide"
                className="w-14 h-14 rounded-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] group-hover:-translate-y-0.5 transition-transform duration-200"
              />
            </button>

            {/* Hover Tooltip */}
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap charcoal-glass px-2.5 py-1 rounded-xl text-[11px] font-semibold text-white border border-white/20 shadow-lg">
              Infraspection AI Guide
            </div>
          </div>
        )}
      </div>

      {/* Floating Chat Modal Window */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] max-h-[620px] h-[82vh] charcoal-glass rounded-3xl border border-white/25 shadow-2xl flex flex-col overflow-hidden text-zinc-100 animate-in fade-in slide-in-from-bottom-6 duration-200"
          style={{ transform: 'translateZ(0)' }}
        >
          {/* Top Specular Light Highlight */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

          {/* Header */}
          <div className="p-4 px-5 flex items-center justify-between border-b border-white/10 shrink-0 bg-black/40">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex items-center justify-center filter drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]">
                <img
                  src="/ai_robot_avatar.png"
                  alt="AI Guide"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white font-display">Infraspection AI Guide</h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    ONLINE
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 font-mono">Autonomous Platform Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 rounded-xl charcoal-pill hover:border-white/50 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Reset conversation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl charcoal-pill hover:border-white/50 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Suggestions Carousel */}
          <div className="p-2.5 bg-black/60 border-b border-white/10 shrink-0 overflow-x-auto no-scrollbar flex items-center gap-2 text-xs">
            {QUICK_QUESTIONS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(item.query)}
                className="whitespace-nowrap px-3 py-1.5 rounded-xl charcoal-pill border border-white/15 hover:border-white text-zinc-300 hover:text-white transition-all text-[11px] font-medium flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="p-4 overflow-y-auto space-y-4 flex-1 overscroll-contain text-xs" style={{ WebkitOverflowScrolling: 'touch' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 shrink-0 mt-0.5 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
                    <img
                      src="/ai_robot_avatar.png"
                      alt="Bot"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                <div
                  className={`max-w-[84%] rounded-2xl p-3.5 space-y-1 shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-white text-black font-medium border border-white'
                      : 'bg-zinc-900/90 border border-white/15 text-zinc-200'
                  }`}
                >
                  <div className="whitespace-pre-line leading-relaxed text-[12px]">
                    {msg.text}
                  </div>
                  <span
                    className={`text-[9px] font-mono block text-right pt-1 ${
                      msg.sender === 'user' ? 'text-zinc-600' : 'text-zinc-500'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className="w-7 h-7 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-white shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" />
                </div>
                <div className="bg-zinc-900/90 border border-white/15 px-3.5 py-2.5 rounded-2xl text-zinc-400 text-xs flex items-center gap-1.5 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-[10px] ml-1">Analyzing workspace knowledge...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-black/80 border-t border-white/15 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask how to use any feature or map tool..."
                className="flex-1 bg-zinc-900/90 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className={`p-2.5 rounded-xl font-bold transition-all flex items-center justify-center cursor-pointer ${
                  inputValue.trim()
                    ? 'white-gloss-btn text-black shadow-lg hover:scale-105'
                    : 'bg-white/10 text-zinc-600 border border-white/10 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
