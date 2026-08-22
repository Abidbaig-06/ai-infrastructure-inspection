# System Architecture: AI Infrastructure Inspection & Maintenance Prioritization

## High-Level System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React 18 + Vite)                      │
│                                                                        │
│   ┌────────────────────────────────┐  ┌────────────────────────────┐   │
│   │   Public Citizen Portal        │  │  Officer Satellite Center  │   │
│   │   • Photo & Description Form   │  │  • Real-Life Satellite Map │   │
│   │   • Guntur GPS Pin Drop        │  │  • Red Dot Defect Spotting │   │
│   │   • Instant AI Polish          │  │  • Priority MCDA Scheduler │   │
│   └───────────────┬────────────────┘  └─────────────┬──────────────┘   │
└───────────────────┼─────────────────────────────────┼──────────────────┘
                    │ REST API Calls                  │ REST API Calls
                    ▼                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       BACKEND (Node.js + Express)                      │
│                                                                        │
│   • /api/complaints   • /api/ai-agent/inspect   • /api/ai-agent/prioritize│
│   • /api/work-orders  • /api/auth               • /api/analytics        │
└───────────────────┬─────────────────────────────────┬──────────────────┘
                    │                                 │
                    ▼                                 ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│           AI AGENTS ENGINE           │  │       DATABASE ENGINE        │
│                                      │  │                              │
│ • visionDefectDetector.js (CV Bounding)│  │ • Mongoose / MongoDB         │
│ • multimodalAnalyzer.js (Risk Index) │  │ • Resilient JSON Persistence │
│ • riskPrioritizationPlanner.js (MCDA)│  │ • Guntur Municipal Seed Data │
│ • historicalAssetRetrieval.js (Logs) │  │ • Work Orders & History Logs │
└──────────────────────────────────────┘  └──────────────────────────────┘
```

## Directory Structure
```
ai-infrastructure-inspection
│
├── ai-agents/                   # Autonomous AI Inspection & Optimization Engine
│   ├── visionDefectDetector.js      # Computer Vision defect bounding boxes & measurements
│   ├── multimodalAnalyzer.js        # Multimodal fusion & composite risk scoring (0-100)
│   ├── riskPrioritizationPlanner.js # Resource-aware budget/crew knapsack optimizer
│   ├── historicalAssetRetrieval.js  # Asset history, chronic recurrence & warranty tracking
│   └── index.js                     # Unified AI Agent interface
│
├── backend/                     # Express REST API Server
│   ├── controllers/                 # Request handlers (AI Agent, Complaints, Auth, Orders)
│   ├── routes/                      # Route definitions
│   ├── uploads/                     # Uploaded evidence storage
│   ├── server.js                    # Express app entry point
│   └── package.json                 # Backend dependencies
│
├── database/                    # Dual-Mode Persistent Database Layer
│   ├── models/                      # Mongoose Schema definitions (Complaint, WorkOrder, User)
│   ├── seed/                        # Pre-seeded Guntur grievances, officers & work orders
│   ├── connection.js                # Resilient MongoDB + JSON zero-setup fallback engine
│   └── data_storage.json            # Local persistent store
│
├── docs/                        # Project Specifications & Formulas
│   ├── PROBLEM_STATEMENT_9.md       # 8-feature prototype mapping
│   ├── ARCHITECTURE.md              # System design diagrams
│   ├── API_SPECIFICATION.md         # API route documentation
│   └── ENGINEERING_FORMULAS.md      # Mathematical models & IRC standards
│
├── frontend/                    # Single-Page Application (React 18 + Vite)
│   ├── src/
│   │   ├── components/              # Citizen & Officer UI components (Satellite Map, Canvas)
│   │   ├── pages/                   # Unified Landing Page, AI Agent Workbench, Analytics
│   │   ├── context/                 # AuthContext & GrievanceContext state providers
│   │   ├── services/                # API client helper & Guntur hazard presets
│   │   └── styles/                  # Tailwind CSS, glassmorphism & printable stylesheet
│   ├── public/                      # Static assets
│   ├── index.html                   # HTML root
│   ├── vite.config.js               # Vite build configuration
│   └── package.json                 # Frontend dependencies
│
├── .gitignore                   # Version control exclusions
└── README.md                    # Quickstart guide & documentation
```
