from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from jwt import InvalidTokenError
from pydantic import BaseModel

from app.core.security.constants import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    ALGORITHM,
    SECRET_KEY,
)

bearer_token = HTTPBearer(scheme_name="Authorization")


class JwtToken(BaseModel):
    access_token: str
    token_type: str


def validate_jwt_token(email_address: str, token=Depends(bearer_token)):
    try:
        token = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username = token["sub"]
        if not email_address == username:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid Access.",
            )

    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return JwtToken(access_token=encoded_jwt, token_type="bearer")
