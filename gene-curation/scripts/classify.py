#!/usr/bin/env python3
"""Points -> ClinGen classification (SOP v10). Advisory only; the GCEP may override with rationale.

Usage:
  python3 classify.py <genetic 0-12> <experimental 0-6> [years_since_first_report] [replicated:Y/N] [contradictory:Y/N]
Example:
  python3 classify.py 12 6 11 Y N   ->  Definitive
"""
import sys

def classify(genetic, experimental, years=0.0, replicated=True, contradictory=False):
    g = min(max(genetic, 0), 12)
    e = min(max(experimental, 0), 6)
    total = g + e
    if contradictory:
        return total, "Disputed / Refuted (valid contradictory evidence — review with GCEP)"
    if g == 0:
        return total, ("No Known Disease Relationship"
                       + (" (experimental evidence only; no human genetic evidence)" if e > 0 else ""))
    if total <= 6:
        return total, "Limited"
    if total <= 11:
        return total, "Moderate"
    # total 12-18
    if years is not None and years >= 3 and replicated:
        return total, "Definitive"
    return total, "Strong (re-evaluate for Definitive after 3 yr with no contradictory evidence)"

if __name__ == "__main__":
    a = sys.argv[1:]
    if len(a) < 2:
        print(__doc__); sys.exit(1)
    g = float(a[0]); e = float(a[1])
    yrs = float(a[2]) if len(a) > 2 else 0.0
    rep = (a[3].upper().startswith("Y")) if len(a) > 3 else True
    con = (a[4].upper().startswith("Y")) if len(a) > 4 else False
    total, cls = classify(g, e, yrs, rep, con)
    print(f"Genetic {min(g,12)}/12 + Experimental {min(e,6)}/6 = {min(total,18)}/18")
    print(f"Years since first report: {yrs} | replicated (research+clinical): {rep} | contradictory: {con}")
    print(f"=> {cls}")
