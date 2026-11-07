@echo off
REM QuantBuild one-click launcher (port 8001)
REM port 8000 may be used by other apps on this machine, so QuantBuild uses 8001.
cd /d "C:\Users\Gagan\OneDrive\Documents\Default Project\quantbuild"
python run.py --port 8001
pause
