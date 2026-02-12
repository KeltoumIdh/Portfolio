from fastapi.testclient import TestClient

from src.main import app


def test_health():
  client = TestClient(app)
  res = client.get("/")
  assert res.status_code == 200
  assert "status" in res.json()

