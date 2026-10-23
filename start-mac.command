#!/bin/bash
# Opens Object Studio from this folder. Uses the Python that ships with macOS developer tools.
cd "$(dirname "$0")"
(sleep 1; open http://localhost:8765/) &
python3 -m http.server 8765
