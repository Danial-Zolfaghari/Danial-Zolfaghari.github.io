#!/usr/bin/env python3
"""Check the deployed static portfolio before merging or publishing."""
from __future__ import annotations

import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, unquote
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://danial-zolfaghari.github.io"
REQUIRED = [
    "index.html", "work/index.html", "foundation/index.html",
    "insights/index.html", "insights/process-aware-network-telemetry/index.html",
    "updates/index.html", "assets/engineering-hub.css", "assets/engineering-releases.js",
    "assets/index-BhDQvKz6.js",
]

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.canonical = []
        self.title_count = 0
        self.h1_count = 0
        self.jsonld = []
        self._json_script = False
    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag == "a" and values.get("href"):
            self.links.append(values["href"])
        if tag == "link" and values.get("rel") == "canonical":
            self.canonical.append(values.get("href"))
        if tag == "title":
            self.title_count += 1
        if tag == "h1":
            self.h1_count += 1
        if tag == "script" and values.get("type") == "application/ld+json":
            self._json_script = True
    def handle_endtag(self, tag):
        if tag == "script":
            self._json_script = False
    def handle_data(self, data):
        if self._json_script:
            self.jsonld.append(data)

def local_path(link):
    if link.startswith(("#", "mailto:", "tel:", "javascript:")):
        return None
    url = urlparse(link)
    if url.netloc and url.netloc not in ("danial-zolfaghari.github.io",):
        return None
    path = unquote(url.path)
    if not path.startswith("/"):
        return None
    relative = path.lstrip("/")
    if not relative or relative.endswith("/"):
        relative += "index.html"
    elif "." not in relative.split("/")[-1]:
        relative += "/index.html"
    return relative

errors = []
for file in REQUIRED:
    if not (ROOT / file).is_file():
        errors.append(f"Missing required file: {file}")

html_files = sorted(ROOT.rglob("index.html"))
for file in html_files:
    parser = Page()
    content = file.read_text(encoding="utf-8")
    parser.feed(content)
    rel = str(file.relative_to(ROOT))
    if rel not in ("insights/index.html", "insights/process-aware-network-telemetry/index.html", "updates/index.html"):
        if 'src="/assets/index-BhDQvKz6.js?v=engineering-hub-20261022"' not in content:
            errors.append(f"{rel}: missing versioned SPA bundle reference")
    if parser.title_count != 1 or parser.h1_count != 1:
        errors.append(f"{rel}: expected exactly one title and one h1")
    if len(parser.canonical) != 1:
        errors.append(f"{rel}: expected one canonical")
    else:
        expected = BASE + ("/" if rel == "index.html" else "/" + rel.removesuffix("index.html"))
        if parser.canonical[0] != expected:
            errors.append(f"{rel}: canonical mismatch; expected {expected}")
    for link in parser.links:
        target = local_path(link)
        if target and not (ROOT / target).is_file():
            errors.append(f"{rel}: broken internal link to {link}")
    for block in parser.jsonld:
        try:
            json.loads(block)
        except json.JSONDecodeError as e:
            errors.append(f"{rel}: invalid JSON-LD: {e}")
release_html = (ROOT / "updates/index.html").read_text(encoding="utf-8")
for repo in ("ProcDomainSniffer", "TunnelGate", "DZ-Operations-Console", "ELK-Checker", "Round-Robin"):
    expected = f'href="https://github.com/Danial-Zolfaghari/{repo}/releases"'
    if expected not in release_html:
        errors.append(f"Missing no-JS GitHub release link: {repo}")

for rel in ("insights/index.html", "updates/index.html"):
    content = (ROOT / rel).read_text(encoding="utf-8")
    if "دانیال ذوالفقاری" not in content:
        errors.append(f"{rel}: missing Persian alternate identity")

sitemap = ROOT / "sitemap.xml"
if not sitemap.exists():
    errors.append("Missing sitemap.xml")
else:
    doc = ET.parse(sitemap)
    urls = {item.text for item in doc.iter() if item.tag.endswith("loc")}
    for rel in ("insights/", "insights/process-aware-network-telemetry/", "updates/"):
        if BASE + "/" + rel not in urls:
            errors.append(f"Missing sitemap entry: /{rel}")

print(f"Validated {len(html_files)} HTML pages and {len(REQUIRED)} required paths")
if errors:
    print("\n".join("ERROR: " + error for error in errors))
    raise SystemExit(1)
print("PASS: canonical, HTML structure, JSON-LD, links, Persian identity, sitemap")
