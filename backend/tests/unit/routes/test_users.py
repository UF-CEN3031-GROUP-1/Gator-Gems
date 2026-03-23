from fastapi.security import HTTPAuthorizationCredentials
from fastapi.testclient import TestClient
from sqlmodel import Session

from app.models.users import User


def test_create_user_success(
    session: Session, client: TestClient, user: User, raw_user_password: str
):
    # Act
    response = client.post(
        f"/users/{user.email_address}",
        json={
            "firstName": user.first_name,
            "lastName": user.last_name,
            "password": raw_user_password,
        },
    )

    # Verify
    assert response.status_code == 200
    assert response.json() == {
        "message": f"User with email {user.email_address} created successfully.",
    }
    assert session.get(User, user.email_address) == user


def test_create_user_existing_email(
    session: Session, client: TestClient, user: User, raw_user_password: str
):
    # Setup
    session.add(user)
    session.commit()

    # Act
    response = client.post(
        f"/users/{user.email_address}",
        json={
            "firstName": user.first_name,
            "lastName": user.last_name,
            "password": raw_user_password,
        },
    )

    # Verify
    assert response.status_code == 400
    assert response.json() == {"detail": "User already exists"}


def test_delete_user_success(
    session: Session, client: TestClient, user: User, jwt: HTTPAuthorizationCredentials
):
    # Setup
    session.add(user)
    session.commit()

    # Act
    response = client.delete(
        f"/users/{user.email_address}",
        headers={"Authorization": f"Bearer {jwt.credentials}"},
    )

    # Verify
    assert response.status_code == 200
    assert response.json() == {
        "message": f"User with email {user.email_address} deleted successfully.",
    }

    assert session.get(User, user.email_address) is None


def test_delete_user_not_found(
    session: Session, client: TestClient, user: User, jwt: HTTPAuthorizationCredentials
):
    # Act
    response = client.delete(
        f"/users/{user.email_address}",
        headers={"Authorization": f"Bearer {jwt.credentials}"},
    )

    # Verify
    assert response.status_code == 404
    assert response.json() == {"detail": "User not found"}


def test_get_user_success(
    session: Session, client: TestClient, user: User, jwt: HTTPAuthorizationCredentials
):
    # Setup
    session.add(user)
    session.commit()

    # Act
    response = client.get(
        f"/users/{user.email_address}",
        headers={"Authorization": f"Bearer {jwt.credentials}"},
    )

    # Verify
    assert response.status_code == 200
    assert response.json() == user.model_dump(by_alias=True)


def test_get_user_not_found(
    client: TestClient, user: User, jwt: HTTPAuthorizationCredentials
):
    # Act
    response = client.get(
        f"/users/{user.email_address}",
        headers={"Authorization": f"Bearer {jwt.credentials}"},
    )

    # Verify
    assert response.status_code == 404
    assert response.json() == {"detail": "User not found"}


def test_login_user_success(
    session: Session,
    client: TestClient,
    user: User,
    jwt: HTTPAuthorizationCredentials,
    basic_auth: HTTPAuthorizationCredentials,
):
    # Setup
    session.add(user)
    session.commit()

    # Act
    response = client.get(
        f"/users/{user.email_address}/login",
        headers={"Authorization": f"Basic {basic_auth.credentials}"},
    )

    # Verify
    assert response.status_code == 200
    assert response.json()["access_token"] == jwt.credentials
