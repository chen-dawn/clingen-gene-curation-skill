#!/usr/bin/env python3
"""Ontology / literature lookups so IDs are never guessed. Stdlib only (urllib).

Usage:
  python3 lookups.py hpo OMIM:614261         # HPO phenotype annotations for a disease (OMIM id)
  python3 lookups.py mondo "microcephaly-capillary malformation"   # MONDO id + label
  python3 lookups.py term HP:0000253         # look up one HPO term's label
  python3 lookups.py pmid "AuthorLastName" 2013 "Nat Genet"        # find a PMID by citation
"""
import json, sys, urllib.request, urllib.parse

UA = {"User-Agent": "clingen-gene-curation-skill/1.0"}

def _get(url):
    return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30))

def hpo_disease(omim):
    # ontology.jax.org disease annotation endpoint
    d = _get(f"https://ontology.jax.org/api/network/annotation/{omim}")
    cats = d.get("categories") or {}
    rows = []
    for _, items in cats.items():
        for it in (items or []):
            rows.append((it.get("id",""), it.get("name","")))
    # fallback flat structure
    for it in (d.get("phenotypes") or []):
        rows.append((it.get("id",""), it.get("name","")))
    seen=set()
    for hid, name in rows:
        if hid and hid not in seen:
            seen.add(hid); print(f"{hid}\t{name}")
    if not seen:
        print(json.dumps(d)[:1500])

def hpo_term(hid):
    d = _get(f"https://ontology.jax.org/api/hp/terms/{hid}")
    print(f"{d.get('id',hid)}\t{d.get('name','')}")

def mondo(q):
    url = "https://www.ebi.ac.uk/ols4/api/search?" + urllib.parse.urlencode(
        {"q": q, "ontology": "mondo", "rows": 5})
    for r in _get(url).get("response", {}).get("docs", []):
        print(f"{r.get('obo_id','')}\t{r.get('label','')}")

def pmid(author, year, journal):
    term = f"{author}[Author] AND {year}[pdat] AND {journal}[Journal]"
    url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?" + urllib.parse.urlencode(
        {"db": "pubmed", "term": term, "retmode": "json", "retmax": 5})
    ids = _get(url).get("esearchresult", {}).get("idlist", [])
    print("PMIDs:", ", ".join(ids) if ids else "(none — refine citation)")

if __name__ == "__main__":
    a = sys.argv[1:]
    if not a: print(__doc__); sys.exit(1)
    cmd = a[0]
    try:
        if cmd == "hpo": hpo_disease(a[1])
        elif cmd == "term": hpo_term(a[1])
        elif cmd == "mondo": mondo(" ".join(a[1:]))
        elif cmd == "pmid": pmid(a[1], a[2], " ".join(a[3:]))
        else: print(__doc__)
    except Exception as e:
        print(f"lookup failed ({e}). Check the id/query, or verify manually in the browser.")
