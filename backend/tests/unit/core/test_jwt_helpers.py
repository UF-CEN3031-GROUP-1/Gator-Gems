from fastapi.testclient import TestClient

from app.core.security.jwt_auth import create_access_token


def test_create_access_token_structure():
    token = create_access_token({"sub": "a@b.com"})
    assert token.token_type == "bearer"
    assert isinstance(token.access_token, str)


def test_get_email_from_token_invalid_cookie(client: TestClient):
    client.cookies.set("jwt_token", "invalid-token")
    response = client.get("/users/me")
    assert response.status_code == 401
    assert response.json() == {"detail": "Could not validate credentials"}


def test_get_is_admin_from_token_invalid_cookie(client: TestClient):
    client.cookies.set("jwt_token", "invalid-token")
    response = client.get("/admin/users")
    assert response.status_code == 401
    assert response.json() == {"detail": "Could not validate credentials"}
