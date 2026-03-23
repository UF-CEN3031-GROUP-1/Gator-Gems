import pytest
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from sqlmodel import Session

from app.core.security.jwt_auth import validate_jwt_token
from app.models.users import User


def test_invalid_token():
    with pytest.raises(HTTPException) as error:
        validate_jwt_token(
            email_address="test@test.com",
            token=HTTPAuthorizationCredentials(
                scheme="Bearer", credentials="invalid-token"
            ),
        )
    assert isinstance(error.value, HTTPException)
    assert error.value.detail == "Could not validate credentials"
    assert error.value.status_code == 401


def test_user_emails_do_not_match(
    session: Session, user: User, jwt: HTTPAuthorizationCredentials
):
    session.add(user)
    session.commit()
    with pytest.raises(HTTPException) as error:
        validate_jwt_token(email_address="incorrect-email@test.com", token=jwt)
    assert isinstance(error.value, HTTPException)
    assert error.value.detail == "Invalid Access."
    assert error.value.status_code == 403


def test_user_auth_success(
    session: Session, user: User, jwt: HTTPAuthorizationCredentials
):
    session.add(user)
    session.commit()

    assert validate_jwt_token(email_address=user.email_address, token=jwt) is None
