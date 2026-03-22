import pytest

from sqlmodel import StaticPool, create_engine, Session

from app.main import app
from fastapi.testclient import TestClient

from app.database.connections import get_session
from app.database.schema import create_db_and_tables
from tests.mocks.users import MOCK_USER, MOCK_USER_RAW_PASSWORD
from app.models.users import User
from fastapi.security import HTTPAuthorizationCredentials
from app.core.security.jwt_auth import create_access_token


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
def user_fixture():
    yield User(
        email_address=MOCK_USER.email_address,
        first_name=MOCK_USER.first_name,
        last_name=MOCK_USER.last_name,
        password=MOCK_USER.password,
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
