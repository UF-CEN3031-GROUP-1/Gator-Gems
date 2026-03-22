from fastapi import APIRouter, HTTPException, Path, Depends, status
from typing import Annotated
import secrets
from pydantic import BaseModel
import jwt
from datetime import datetime, timedelta, timezone
from app.database.connections import SessionDep
from app.models.users import User
from fastapi.security import (
    HTTPBasic,
    HTTPBasicCredentials,
    OAuth2PasswordBearer,
    OAuth2PasswordRequestForm,
    HTTPBearer,
)
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash

router = APIRouter()
security = HTTPBasic()
password_hash = PasswordHash.recommended()
bearer_token = HTTPBearer(scheme_name="Authorization")

# TODO: genearte secret key
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


class CreateUser(BaseModel):
    firstName: str
    lastName: str
    password: str


@router.post("/users/{email_address}", description="Create a new user")
def create_user(
    email_address: Annotated[str, Path(title="Email address of the user to create")],
    user: CreateUser,
    session: SessionDep,
):
    existing_user = session.get(User, email_address)
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    hashed_password = password_hash.hash(user.password)

    db_user = User(
        email_address=email_address,
        first_name=user.firstName,
        last_name=user.lastName,
        password=hashed_password,
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return {"message": f"User with email {db_user.email_address} created successfully."}


def validate_token(token=Depends(bearer_token)):
    try:
        jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.delete(
    "/users/{email_address}",
    description="Delete an existing user",
    dependencies=[Depends(validate_token)],
)
def delete_user(
    email_address: Annotated[str, Path(title="Email address of the user to delete")],
    session: SessionDep,
):
    existing_user = session.get(User, email_address)
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    session.delete(existing_user)
    session.commit()

    return {
        "message": f"User with email {existing_user.email_address} deleted successfully."
    }


@router.get(
    "/users/{email_address}",
    description="Get user details by email address",
    response_model=User,
    dependencies=[Depends(validate_token)],
)
def get_user(
    email_address: Annotated[str, Path(title="Email address of the user to retrieve")],
    session: SessionDep,
):
    user = session.get(User, email_address)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


def validate_credentials(
    credentials: Annotated[HTTPBasicCredentials, Depends(security)], session: SessionDep
):
    current_username = credentials.username
    user = session.get(User, current_username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    if not password_hash.verify(credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )


def create_access_token(data: dict, expires_delta: int | None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_delta or 15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


class Token(BaseModel):
    access_token: str
    token_type: str


@router.get(
    "/users/{email_address}/login",
    description="Login a user",
    dependencies=[Depends(validate_credentials)],
)
def login_user(
    email_address: Annotated[str, Path(title="Email address to login")],
):
    access_token = create_access_token(
        data={"sub": email_address},
        expires_delta=ACCESS_TOKEN_EXPIRE_MINUTES,
    )
    return Token(access_token=access_token, token_type="bearer")
