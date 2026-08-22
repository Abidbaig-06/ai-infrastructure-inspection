# REST API Specification: AI Infrastructure Inspection Agent

Base URL: `http://localhost:5000/api`

---

## 1. AI Inspection & Prioritization Agent

### `POST /ai-agent/inspect`
Runs multimodal Computer Vision defect detection, risk scoring, and historical asset linking.
- **Request Body**:
  ```json
  {
    "imageUrl": "https://...",
    "title": "Severe Pothole on Lakshmipuram Main Road",
    "description": "Deep asphalt cratering with sub-base erosion",
    "category": "Road Hazard & Pothole",
    "location": {
      "ward": "Ward 04 - Lakshmipuram",
      "latitude": 16.3125,
      "longitude": 80.4280
    }
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "inspectionId": "INSP-GNT-4819",
      "compositeRiskScore": 94,
      "severity": "CRITICAL",
      "pavementConditionIndex": 42,
      "visionDefects": [
        {
          "defectType": "Alligator Cracking & Asphalt Spalling",
          "confidence": 0.98,
          "dimensions": "Length: 2.8m, Depth: 14.5cm",
          "ircCodeStandard": "IRC:82-2015 Pavement Maintenance Standard"
        }
      ],
      "engineeringRecommendations": {
        "recommendedAction": "Immediate Full-Depth Patching & GSB Replacement",
        "statutorySLA": "4 Hours Max",
        "estimatedCostUSD": 872
      }
    }
  }
  ```

### `GET /ai-agent/prioritize?monthlyBudgetUSD=25000&availableCrewsCount=4`
Computes the resource-aware Multi-Criteria Decision Analysis (MCDA) maintenance schedule.
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "planId": "MPLAN-GNT-2026-911",
      "budgetSummary": {
        "totalMonthlyBudgetUSD": 25000,
        "totalAllocatedBudgetUSD": 6680,
        "budgetUtilizationPct": 26.7
      },
      "resourceSummary": {
        "availableCrews": 4,
        "scheduledWorksCount": 4,
        "estimatedTotalRiskMitigated": 348
      },
      "prioritizedQueue": [...]
    }
  }
  ```

### `GET /ai-agent/history/:assetId`
Retrieves historical maintenance and contractor intervention records for an infrastructure asset.

### `GET /ai-agent/assets`
Lists all tracked Guntur infrastructure assets.

---

## 2. Public Grievances & Work Orders

### `GET /complaints`
Retrieves all complaints with optional filtering (`ward`, `category`, `severity`, `status`).

### `POST /complaints`
Registers a new citizen complaint with immediate AI triage scoring.

### `POST /complaints/:id/resolve`
Records field resolution with after-repair photographs and citizen feedback.

### `GET /work-orders` & `POST /work-orders`
Retrieves or creates statutory Municipal Maintenance Work Orders (`WO-2026-XXXX`).

### `GET /analytics`
Aggregated department KPIs, ward risk rankings, and AI model performance telemetry.
