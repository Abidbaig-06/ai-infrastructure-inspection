# Engineering Formulas & Mathematical Models

## 1. Multi-Factor Composite Risk Index Formula

The AI agent computes a normalized risk score $R \in [0, 100]$ using a multi-criteria weighted sum:

$$R = (S \times w_s) + (T \times w_t) + (W \times w_w) + (H \times w_h) + (A \times w_a)$$

Where:
- $S$: **Structural Defect Severity Score** ($0 - 100$, derived from Computer Vision defect dimensions & cavity volume), $w_s = 0.35$.
- $T$: **Traffic & Pedestrian Exposure Factor** ($0 - 100$, derived from Guntur ward PCU load), $w_t = 0.25$.
- $W$: **Weather & Monsoon Inundation Multiplier** ($0 - 100$, drainage runoff index), $w_w = 0.15$.
- $H$: **Historical Recurrence Rating** ($0 - 100$, failure frequency in the past 24 months), $w_h = 0.15$.
- $A$: **Asset Criticality Index** ($0 - 100$, proximity to hospitals, schools, railway junctions), $w_a = 0.10$.

### Severity Tier Classification
- **CRITICAL**: $R \ge 85$ $\implies$ Statutory SLA: $< 4\text{ Hours}$ (Emergency Deployment).
- **HIGH**: $65 \le R < 85$ $\implies$ Statutory SLA: $< 24\text{ Hours}$.
- **MEDIUM**: $40 \le R < 65$ $\implies$ Statutory SLA: $< 72\text{ Hours}$.
- **LOW**: $R < 40$ $\implies$ Scheduled Routine Maintenance.

---

## 2. Resource-Aware Maintenance Knapsack Optimization (MCDA)

To maximize the total public safety risk mitigated under bounded municipal budgets:

$$\max \sum_{i=1}^{N} R_i \cdot x_i \quad \text{subject to} \quad \sum_{i=1}^{N} C_i \cdot x_i \le B_{\text{monthly}} \quad \text{and} \quad \sum x_i \le K_{\text{crews}} \times S_{\text{shifts}}$$

Where:
- $R_i$: Risk Score of incident $i$.
- $C_i$: Estimated repair cost in USD.
- $x_i \in \{0, 1\}$: Binary decision variable (1 = Dispatched, 0 = Deferred to next cycle).
- $B_{\text{monthly}}$: Available budget ($10,000 to $60,000 USD).
- $\text{ROI Efficiency Ratio} = \frac{R_i}{\max(C_i, 100)} \times 100$.

---

## 3. Civil Engineering Standards Referenced
- **IRC:82-2015**: Code of Practice for Maintenance of Bituminous Surfaces of Highways (Indian Roads Congress).
- **IRC:37-2018**: Guidelines for the Design of Flexible Pavements.
- **ASTM D6433**: Standard Practice for Roads and Parking Lots Pavement Condition Index (PCI) Surveys.
- **CEA Regulations 2010**: Central Electricity Authority (Measures relating to Safety and Electric Supply).
