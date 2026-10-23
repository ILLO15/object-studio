@echo off
rem Opens Object Studio from this folder. Needs Python (python.org) installed.
cd /d "%~dp0"
start "" http://localhost:8765/
python -m http.server 8765 || py -m http.server 8765
