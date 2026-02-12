"""
Run before: pip install -r requirements.txt
Exits with a clear message if Python is 3.14+ (no binary wheels → build fails on Windows).
"""
import sys

if sys.version_info >= (3, 14) or sys.version_info < (3, 9):
    print("ERROR: This backend requires Python 3.9, 3.10, 3.11, or 3.12.")
    print("Current:", sys.version)
    print()
    print("Python 3.14 has no pre-built wheels for NumPy/FAISS; pip will try to")
    print("build from source and fail without a C compiler.")
    print()
    print("Fix: use a venv with Python 3.12:")
    print("  py -3.12 -m venv venv")
    print("  venv\\Scripts\\activate")
    print("  pip install -r requirements.txt")
    sys.exit(1)
print("Python", sys.version.split()[0], "— OK for backend.")
sys.exit(0)
