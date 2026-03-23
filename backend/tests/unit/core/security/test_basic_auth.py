import pytest
from fastapi import HTTPException
from fastapi.security import HTTPBasicCredentials
from sqlmodel import Session

from app.core.security.basic_auth import validate_basic_auth, verify_password
from app.models.users import User


def test_user_does_not_exist(session: Session):
    with pytest.raises(HTTPException) as error:
        validate_basic_auth(
            email_address="nonexistant@test.com",
            credentials=HTTPBasicCredentials(
                username="nonexistant@test.com", password="password"
            ),
            session=session,
        )
    assert isinstance(error.value, HTTPException)
    assert error.value.detail == "Incorrect username or password"
    assert error.value.status_code == 401


def test_user_invalid_password(session: Session, user: User):
    session.add(user)
    session.commit()

    with pytest.raises(HTTPException) as error:
        validate_basic_auth(
            email_address=user.email_address,
            credentials=HTTPBasicCredentials(
                username=user.email_address, password="incorrect-password"
            ),
            session=session,
        )
    assert isinstance(error.value, HTTPException)
    assert error.value.detail == "Incorrect username or password"
    assert error.value.status_code == 401


def test_user_emails_do_not_match(session: Session, user: User, raw_user_password: str):
    session.add(user)
    session.commit()

    with pytest.raises(HTTPException) as error:
        validate_basic_auth(
            email_address="incorrect-email@test.com",
            credentials=HTTPBasicCredentials(
                username=user.email_address, password=raw_user_password
            ),
            session=session,
        )
    assert isinstance(error.value, HTTPException)
    assert error.value.detail == "Invalid Access."
    assert error.value.status_code == 403


def test_user_auth_success(session: Session, user: User, raw_user_password: str):
    session.add(user)
    session.commit()

    assert (
        validate_basic_auth(
            email_address=user.email_address,
            credentials=HTTPBasicCredentials(
                username=user.email_address, password=raw_user_password
            ),
            session=session,
        )
        is None
    )


def test_verify_password_not_hashed():
    assert (
        verify_password(
            "not-hashed",
            credentials=HTTPBasicCredentials(
                username="valid-email@test.com", password="not-hashed"
            ),
        )
        is False
    )
