from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from pwdlib import PasswordHash
from app.models.users import User
from typing import Annotated
from app.database.connections import SessionDep
import os

security = HTTPBasic()
password_hash = PasswordHash.recommended()


def get_password_salt():
    salt = os.environ.get("PASSWORD_SALT")
    if not salt:
        return None
    return salt.encode()


def hash_password(password: str) -> str:
    return password_hash.hash(password, salt=get_password_salt())


def verify_password(password: str, credentials: HTTPBasicCredentials):
    try:
        return password_hash.verify(credentials.password, password)
    except Exception:
        return False


def validate_basic_auth(
    email_address: str,
    credentials: Annotated[HTTPBasicCredentials, Depends(security)],
    session: SessionDep,
):
    user = session.get(User, credentials.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    if not verify_password(user.password, credentials):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    if not credentials.username == email_address:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid Access.",
            headers={"WWW-Authenticate": "Bearer"},
        )
