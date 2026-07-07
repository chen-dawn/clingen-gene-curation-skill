#!/usr/bin/env python3
"""Extract text from every PDF in a folder to .txt files (macOS lacks poppler, so the
Read tool can't render PDFs; pdfplumber works without system deps).

Usage:  python3 extract_pdfs.py <pdf_folder> [out_dir]
Requires: pip install pdfplumber
"""
import os, sys

def main():
    if len(sys.argv) < 2:
        print("usage: extract_pdfs.py <pdf_folder> [out_dir]"); sys.exit(1)
    src = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(src, "_txt")
    os.makedirs(out, exist_ok=True)
    import pdfplumber
    for root, _, files in os.walk(src):
        for f in sorted(files):
            if not f.lower().endswith(".pdf"):
                continue
            path = os.path.join(root, f)
            try:
                with pdfplumber.open(path) as pdf:
                    txt = "\n".join((p.extract_text() or "") for p in pdf.pages)
                name = os.path.splitext(f)[0].replace(" ", "_") + ".txt"
                with open(os.path.join(out, name), "w") as w:
                    w.write(txt)
                print(f"{f}: {len(txt)} chars, {len(pdf.pages)} pages")
            except Exception as e:
                print(f"{f}: ERROR {e}")
    print(f"\ntext written to {out}")

if __name__ == "__main__":
    main()
