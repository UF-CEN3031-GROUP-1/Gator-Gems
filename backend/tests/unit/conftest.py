import pytest

from sqlmodel import StaticPool, create_engine, Session

from app.main import app
from fastapi.testclient import TestClient

from app.database.connections import get_session
from app.database.schema import create_db_and_tables
from fastapi.security import HTTPAuthorizationCredentials
from app.core.security.jwt_auth import create_access_token
import os
from unittest import mock
from app.core.security.basic_auth import hash_password
from app.models.users import User

MOCK_USER_RAW_PASSWORD = "mockpassword"


@pytest.fixture(name="env_vars", scope="function", autouse=True)
def env_vars_fixture(monkeypatch):
    with mock.patch.dict(os.environ, clear=True):
        monkeypatch.setenv("PASSWORD_SALT", "1234567890")
        yield


@pytest.fixture(name="session", scope="function")
def session_fixture():
    test_engine = create_engine(
        "sqlite://",  # In-memory SQLite database
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    create_db_and_tables(test_engine)

    with Session(test_engine) as session:
        yield session

    test_engine.dispose()


@pytest.fixture(name="client", scope="function")
def client_fixture(session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()


@pytest.fixture(name="user", scope="function")
def user_fixture(env_vars):
    yield User(
        email_address="mock@gmail.com",
        first_name="Mock",
        last_name="User",
        password=hash_password(MOCK_USER_RAW_PASSWORD),
    )  # Create a new User instance for each test


@pytest.fixture(name="raw_user_password", scope="function")
def raw_user_password_fixture():
    yield MOCK_USER_RAW_PASSWORD  # Provide the raw password for testing


@pytest.fixture(name="jwt", scope="function")
def jwt_token_fixture(client, user):
    yield HTTPAuthorizationCredentials(
        scheme="Bearer",
        credentials=create_access_token({"sub": user.email_address}).access_token,
    )
