from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[3]
DEFAULT_DB_PATH = PROJECT_ROOT / "data" / "fraud.db"

API_HOST = "0.0.0.0"
API_PORT = 8000
