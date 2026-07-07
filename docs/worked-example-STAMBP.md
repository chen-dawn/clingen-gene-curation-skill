# Worked example — STAMBP → Microcephaly–Capillary Malformation syndrome (MIC-CAP)

A concrete, blow-by-blow record of what the skill actually did on a real curation, so you can
see what "running the skill" produces. Gene: **STAMBP** (aka *AMSH*), evaluated for the
**Cerebral Palsy GCEP**. Disease entity: **MIC-CAP**, MONDO:0013659 / OMIM #614261, **autosomal
recessive**. Final classification: **Definitive (18/18)**.

> This documents one run for teaching purposes. Numbers follow ClinGen SOP v10.1; a GCEP must
> review and approve any real curation.

---

## Inputs (Step 0–1)

Nine papers were dropped in a folder and organized into `Literature/`:

| Paper | PMID | Role |
|---|---|---|
| McDonell 2013 (Nat Genet) | 23542699 | Founding report — 10 individuals / 9 families; LCL functional studies |
| Naseer 2016 | 27531570 | 2 consanguineous brothers |
| Wu 2019 | 31638258 | Chinese boy, comp-het |
| Shchagina 2020 (Bull RSMU) | *no PMID* | 3 Russian individuals (one with co-occurring galactosemia) |
| Shchugareva 2020 | 32929933 | Russian boy |
| Hu 2022 (Front Neurosci) | 36033615 | Case + **cortical-organoid** model & rescue |
| Anand 2022 (Epileptic Disord) | 35770778 | Indian infant; pan-airway malacia |
| Ishii 2001 (Mol Cell Biol) | 11713295 | *Stambp*-null mouse (cited; primary not in folder) |
| Suzuki 2011 (BBRC) | 21531206 | Same AMSH-null mouse, re-analyzed |

Each PDF was converted to text and read in full.

## Lumping / splitting (Step 2)

STAMBP causes a progressive neurodegenerative disorder with capillary malformations. Per the
ClinGen Lumping & Splitting criteria there was **no difference in molecular mechanism (biallelic
loss of function), inheritance (AR), or the phenotype spectrum**, so all reports were **lumped**
into one entity — MIC-CAP. Two nuances were flagged: one patient (Hu 2022) had **no capillary
malformation** (phenotype expansion), and the spastic-quadriparesis motor picture **overlaps
cerebral palsy** but sits inside a broader progressive syndrome (why the CP GCEP is looking at it).

## Genetic evidence (Steps 3–4)

One row per individual; recessive scoring (sum both variants, homozygous ×2, cap 3/proband).
Representative scored probands:

| Proband | Variants | Points |
|---|---|---|
| McDonell P4.1 | p.Arg424* homozygous (maternal isodisomy) | **3.0** (cap) |
| Shchagina ST5.1 | c.204-5C>G + *de novo* p.Thr223Asnfs*6 | 2.5 |
| McDonell P6.1 | p.Lys378Asnfs*2 + p.Thr313Ile (functional) | 2.0 |
| Hu proband | p.Cys282Trpfs*11 + p.Gly307Glu (fails rescue) | 2.0 |
| McDonell P1.1 / P3.1 / P8.1 / Wu | missense + null (0.1 + 1.5 = 1.6 → **GCI rounds to 1.5**) | 1.5 |
| McDonell P7.1 | p.Arg38Cys + c.203+5G>A (protein absent) | 1.0 |
| McDonell P5.1 | deep-intronic pseudoexon, homozygous | 1.0 |
| Shchagina ST1.1 / Shchugareva | p.Tyr63Cys homozygous (recurrent) | 0.5 |
| Naseer IV-1 | p.Lys303Arg homozygous, **consanguineous, no functional data** | 0 (downgraded) |

McDonell 2013 **alone exceeds the 12-point cap**, so genetic evidence = **12/12 (max)**. Three
families (McDonell Fam 1, Naseer, Shchagina ST1) add segregation — but each has only 2 affected
individuals, so under the SOP's "AR family needs ≥3 affected" rule none is aggregated into the LOD.

## Experimental evidence (Step 5) — 6/6 (max)

- **Function (2):** JAMM-family deubiquitinase in ESCRT sorting; interacts with STAM/CHMP3/Grb2;
  expressed in developing human brain (Allen Brain Atlas).
- **Functional Alteration (2):** patient LCLs — reduced STAMBP, ubiquitin-conjugate aggregation,
  ↑apoptosis, insensitive RAS-MAPK / PI3K-AKT-mTOR signaling.
- **Models & Rescue (4):** *Stambp*-null mouse (CA1 neuron loss, death P19–23); STAMBP-KO cortical
  organoids (impaired NSC proliferation); WT rescues LCLs & organoids while G307E/T313I do not;
  and an **in-vivo AAV9 gene-replacement rescue** in a CNS-conditional-KO mouse.

## Total & classification (Step 6)

Genetic 12 + Experimental 6 = **18/18** → **Definitive** (first reported 2013 → >3 yr; replicated
in research and clinical settings; no valid contradictory evidence).

## Ontology & workbook (Steps 7–8)

HPO codes were pulled from the disease's authoritative annotation set; MONDO:0013659 from OLS;
all PMIDs verified. The GCI workbook was built with copy-paste columns for every form plus review
columns (a one-line summary per patient, phenotype names, scores, rationale).

## The adversarial cross-check (Step 9) — what it caught

One AI reviewer per row re-read the source paper. Real corrections that resulted:

- **Swapped ethnicity** between McDonell P8.1 and P9.1 (Table 1 column mis-read) — fixed.
- **Missing phenotype:** Wu's spastic quadriparesis was reported but not recorded — added.
- **Inferred data flagged:** Anand's cDNA `c.296C>G` and transcript were **not stated in the
  paper** (only "p.Ala99Gly, exon 4") — marked as inferred.
- **"Cited vs shown":** McDonell's biochemical-function and protein-interaction claims are cited
  from earlier papers, not demonstrated in that paper — reworded and down-weighted.
- **Same model line:** Suzuki 2011 uses the *same* AMSH-null mouse as Ishii 2001 — counted once
  (as "supporting"), not double-scored.
- **Overstated rescue trimmed:** the AAV9 rescue is *partial* (survival extended, animals still
  die); an organoid marker "reduction" was only a non-significant trend.

None changed the outcome (genetic still caps at 12, experimental at 6 → Definitive), but the
record is now accurate.

## QC & deliverables (Steps 10–12)

- **Step 10 — QC:** a final pass over unique proband labels, scoring caps, ontology ids,
  provenance, and the classification.
- **Step 11 — Evidence summary:** the Definitive statement per the v7.1 template, saved as its
  own file (`STAMBP_MICCAP_evidence_summary.md`) to paste into the GCI.
- **Step 12 — PowerPoint (built last):** one slide per patient (clinical + variants + PMID +
  points) and one per experiment (methods, findings, PMID, points, figure placeholder).

The **scoring workbook** itself is built back at Step 8 (before the cross-check) and corrected
afterward, so it is ready by the time the summary and deck are produced.
