# ClinGen Scoring Reference — SOP v10.1

> **Source of truth:** ClinGen Gene Curation SOP **version 10.1** (`gene_curation_sop_version_10_1`).
> Always confirm values against the SOP PDF version actually in use — caps and defaults have
> changed across SOP versions. Values below are transcribed from SOP v10.1 (Figures 2 & 8).

## Genetic evidence — case-level (per variant)

| Variant type | Default | Range |
|---|---|---|
| Predicted / proven null — nonsense, frameshift, **canonical ±1/2 splice**, single/multi-exon or whole-gene deletion | **1.5** | 0–2 |
| Other variant — missense, in-frame indel, **non-canonical / deep-intronic splice**, GOF/dominant-negative | **0.1** | 0–1.5 |

**Upgrades / downgrades** (document rationale in GCI):
- Missense + supportive functional data → ~0.5 (robust function can go higher within range).
- De novo (parentage confirmed) → upgrade (null example: 1.5 → 2.0).
- Downgrade: nonspecific/heterogeneous phenotype, insufficient prior testing, null unlikely
  to trigger NMD (last exon / C-terminus), unconfirmed parentage.
- A variant later found common in controls → score **0**.

**Autosomal recessive:** score each variant independently, then **SUM**. Homozygous
variant is scored then **×2** (both alleles). **Per-proband cap = 3.** Consanguineous
homozygous: consider downgrading / requiring functional evidence (runs of homozygosity).

**GCI increments** 0, 0.1, 0.25, 0.5, 0.75, 1.0 … For AR the GCI sums the two variant
scores; per SOP Example 1 the sum is **rounded down** to the nearest increment for entry
(0.1+1.5 = 1.6 → 1.5; 0.1+1.0 = 1.1 → 1.0). (Note: SOP Examples are internally
inconsistent on this — confirm with your GCEP.)

**Worked examples (from SOP):** homozygous nonsense = 1.5×2 = 3.0; homozygous missense +
functional = (0.1+0.4)×2 = 1.0; homozygous nonsense + functional = (1.5+0.4)×2 = 3.8 →
GCI caps at 3.

**Category cap: genetic evidence = 12 points** (case-level + segregation + case-control).

## Siblings

Affected sibs each *may* be scored as separate probands (allowed), but their variants are
identical-by-descent → redundant. **Conservative practice:** score **one proband per
family** for variant evidence and count the additional affected sibs as **segregation**.

## Segregation (estimated LOD)

Autosomal recessive (both parents carriers):
`Z = log10[ 1 / ( (0.25)^(#affected−1) × (0.75)^(#unaffected) ) ]`
- 1 affected sib beyond proband, 0 unaffected → 0.60
- 1 affected + 1 unaffected at-risk sib → 0.73
Sum eLOD across families; map to points via the SOP segregation figure. Dominant/X-linked
use `Z = log10[ 1 / 0.5^segregations ]`.

**Family inclusion rule (SOP v10.1 / GCI Family form):** in the final aggregate LOD only
include **AD/X-linked families with ≥ 4 segregations**, and **AR families with ≥ 3 affected
individuals**. Record for each family: # affected WITH genotype, # unaffected WITHOUT the
biallelic genotype (required for recessive), any **inconsistent segregations** (affected
without / unaffected with the genotype — explain), and whether the family is **consanguineous**.
Prefer a **published LOD** when the authors report one (don't recompute it).

## Experimental evidence (max 6)

| Category (cap) | Evidence types | Defaults |
|---|---|---|
| **Function (2)** | Biochemical Function; Protein Interactions; Expression | 0.5 each (0–2) |
| **Functional Alteration (2)** | Patient cells; Non-patient cells | patient 1.0 (0–2), non-patient 0.5 (0–1) |
| **Models & Rescue (4)** | Non-human model organism (2, 0–4); Cell-culture model (1, 0–2); Rescue in human (2)/non-human model (2)/cell culture (1)/patient cells (1) | as noted |

Total experimental caps at **6** even though category caps sum to 8.

## Case-control evidence (feeds the same 12-pt Genetic cap)

Scored **per study, 0–6 points**, weighed on **power** (# cases/controls vs disease
prevalence), **bias/confounding** (matched by demographics? by genetic ancestry? equivalently
evaluated for the phenotype? other differing variables?), **detection method** (cases &
controls genotyped/sequenced the same way), and **statistical significance** (OR magnitude
consistent with a monogenic effect; p-value / 95% CI not crossing 1.0). **Study type
(single-variant vs aggregate) is required to score.** A single-variant, well-matched, highly
significant study can reach 6; aggregate/population-control or poorly matched studies score
lower; non-significant matched studies may **contradict**.

Record (GCI Case-Control form): case & control cohort labels; # cases with variant / # cases
sequenced (→ case frequency); # controls with variant / # controls sequenced; test statistic,
value, p-value, CI; the four bias questions. **Do not double-count**: an individual scored as
case-level cannot also count within a case-control study. Case-control also caps at **12**
(the whole Genetic Evidence category).

## Classification thresholds

| Class | Requirement |
|---|---|
| Definitive | Total ≥12; first assertion >3 yr ago; replicated in research **and** clinical settings; no valid contradictory evidence |
| Strong | Total 12 but <3 yr since first assertion |
| Moderate | 7–11 |
| Limited | 1–6 |
| No Known Disease Relationship | experimental only, no human genetic evidence |
| Disputed / Refuted | valid contradictory evidence |

GCEPs may up/down-grade one level with documented rationale.
