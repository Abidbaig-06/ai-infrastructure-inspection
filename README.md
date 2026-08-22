# 🏛️ AI Infrastructure Inspection & Maintenance Prioritization Agent

> **Domain:** Infrastructure / Computer Vision / Predictive AI / Municipal Public Works  
> **Deployment City:** Guntur Municipal Corporation (GMC), Andhra Pradesh (`16.3067° N, 80.4365° E`)  
> **Core Objective:** Autonomous inspection agent combining visual defect detection, multimodal reports, GIS location mapping, maintenance history retrieval, and resource-aware prioritization.

---

## 📁 Repository Architecture

```
ai-infrastructure-inspection
│
├── ai-agents/                   # Autonomous AI Inspection & Optimization Engine
│   ├── visionDefectDetector.js      # Computer Vision defect bounding boxes & measurements
│   ├── multimodalAnalyzer.js        # Multimodal fusion & composite risk scoring (0-100)
│   ├── riskPrioritizationPlanner.js # Resource-aware budget/crew knapsack optimizer
│   ├── historicalAssetRetrieval.js  # Asset history, chronic recurrence & warranty tracking
│   └── index.js                     # Unified AI Agent export interface
│
├── backend/                     # Express REST API Server
│   ├── controllers/                 # Request handlers (AI Agent, Complaints, Auth, Orders)
│   ├── routes/                      # REST Route definitions
│   ├── uploads/                     # Uploaded evidence photo storage
│   ├── server.js                    # Express application entry point
│   └── package.json                 # Backend dependencies & scripts
│
├── database/                    # Dual-Mode Persistent Database Layer
│   ├── models/                      # Mongoose Schema definitions (Complaint, WorkOrder, User)
│   ├── seed/                        # Pre-seeded Guntur grievances, demo officers & work orders
│   ├── connection.js                # Resilient MongoDB + JSON zero-setup database engine
│   └── data_storage.json            # Local persistent fallback database
│
├── docs/                        # Complete Engineering Documentation
│   ├── PROBLEM_STATEMENT_9.md       # Direct mapping of all 8 prototype features
│   ├── ARCHITECTURE.md              # System design diagrams and data flow
│   ├── API_SPECIFICATION.md         # Full REST API endpoint reference
│   └── ENGINEERING_FORMULAS.md      # Multi-factor risk formulas & IRC standards
│
├── frontend/                    # Single-Page Web Application (React 18 + Vite)
│   ├── src/
│   │   ├── components/              # Citizen & Officer components (Satellite Map, Canvas)
│   │   ├── pages/                   # Unified Landing Page, AI Agent Workbench, Analytics
│   │   ├── context/                 # AuthContext & GrievanceContext global state providers
│   │   ├── services/                # API client & sample hazard presets for Guntur
│   │   └── styles/                  # Tailwind CSS, glassmorphism & printable stylesheet
│   ├── public/                      # Static assets
│   ├── index.html                   # HTML entry root
│   ├── vite.config.js               # Vite bundler configuration
│   ├── tailwind.config.js           # Civic design tokens & color palette
│   └── package.json                 # Frontend dependencies
│
├── .gitignore                   # Version control exclusions
└── README.md                    # Project documentation & quickstart guide
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js**: v18+ (tested on v20.18.0)
- **npm**: v9+

### 2. Start Backend API Server
```bash
cd backend
npm install
node server.js
```
*Server starts on `http://localhost:5000` with instant dual-mode database initialization.*

### 3. Start Frontend Client
```bash
cd frontend
npm install
npm run dev
```
*Client starts on `http://127.0.0.1:5173/`.*

---

## 🌟 Prototype Features (Problem Statement 9 Mapping)

1. **Image-Based Defect Detection (`ai-agents/visionDefectDetector.js`)**: Real-time Computer Vision bounding box overlays tagging alligator cracking, asphalt depth, sub-base cavities, and sagging conductors.
2. **Multimodal Analysis of Images and Reports (`ai-agents/multimodalAnalyzer.js`)**: Neural fusion combining visual evidence, citizen symptom reports, and Guntur GIS risk context.
3. **Risk and Severity Ranking (`ai-agents/multimodalAnalyzer.js`)**: Dynamic 0-100 composite risk score categorized into `CRITICAL (<4h)`, `HIGH (<24h)`, `MEDIUM (<72h)`, `LOW`.
4. **Location-Based Issue Mapping (`frontend/src/components/agent/RealLifeSatelliteMap.jsx`)**: Upper-view real-life aerial satellite imagery showing actual buildings and pulsing red dots on registered complaints in Guntur.
5. **Maintenance-History Retrieval (`ai-agents/historicalAssetRetrieval.js`)**: Historical contractor repair logs, failure recurrence warnings, and warranty tracking.
6. **Resource-Aware Maintenance Prioritization (`ai-agents/riskPrioritizationPlanner.js`)**: Interactive budget slider ($10k-$60k) and crew capacity optimizer maximizing Risk Mitigated per Dollar Spent (ROI).
7. **Evidence-Linked Engineering Reports (`frontend/src/components/agent/EngineeringDossierModal.jsx`)**: Printable statutory engineering dossier with defect photos, Bill of Quantities (BOQ), and IRC:82 standards compliance.
8. **Inspection & Maintenance Analytics (`frontend/src/pages/AnalyticsPage.jsx`)**: Pavement Condition Index (PCI 0-100) distribution across Guntur wards and statutory SLA compliance rate (94.8%).

---

## 🔗 Single Access URL
👉 **[http://127.0.0.1:5173/](http://127.0.0.1:5173/)**
