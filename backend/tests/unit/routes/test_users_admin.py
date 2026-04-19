from fastapi.testclient import TestClient

from app.core.security.jwt_auth import create_access_token
from app.models.users import User


def test_delete_user_admin_success(session, client: TestClient, user: User):
    admin = user
    admin.is_admin = True
    session.add(admin)
    session.commit()

    target = User(
        email_address="target@test.com",
        first_name="T",
        last_name="User",
        password=admin.password,
    )
    session.add(target)
    session.commit()
    token = create_access_token({"sub": admin.email_address}).access_token
    client.cookies.set("jwt_token", token)

    response = client.delete(f"/admin/users/{target.email_address}")
    assert response.status_code == 200
    assert response.json() == {
        "message": f"User with email {target.email_address} deleted successfully."
    }


def test_delete_user_not_found_admin(session, client: TestClient, user: User):
    admin = user
    admin.is_admin = True
    session.add(admin)
    session.commit()
    token = create_access_token({"sub": admin.email_address}).access_token
    client.cookies.set("jwt_token", token)

    response = client.delete("/admin/users/nope@test.com")
    assert response.status_code == 404
    assert response.json() == {"detail": "User not found"}


def test_get_user_forbidden_when_not_admin(session, client: TestClient, user: User):
    session.add(user)
    session.commit()
    token = create_access_token({"sub": user.email_address}).access_token
    client.cookies.set("jwt_token", token)

    response = client.get(f"/admin/users/{user.email_address}")
    assert response.status_code == 403
    assert response.json() == {"detail": "You do not have permission"}


def test_get_all_users_admin_success(session, client: TestClient, user: User):
    admin = user
    admin.is_admin = True
    session.add(admin)
    # add another user
    other = User(
        email_address="other@test.com",
        first_name="O",
        last_name="User",
        password=admin.password,
    )
    session.add(other)
    session.commit()

    token = create_access_token({"sub": admin.email_address}).access_token
    client.cookies.set("jwt_token", token)

    response = client.get("/admin/users")
    assert response.status_code == 200
    assert any(u["emailAddress"] == admin.email_address for u in response.json())


def test_get_all_users_forbidden_non_admin(session, client: TestClient, user: User):
    session.add(user)
    session.commit()
    token = create_access_token({"sub": user.email_address}).access_token
    client.cookies.set("jwt_token", token)

    response = client.get("/admin/users")
    assert response.status_code == 403
    assert response.json() == {"detail": "You do not have permission"}
