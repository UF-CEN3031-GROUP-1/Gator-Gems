from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Response
from pydantic import BaseModel

from app.core.security.basic_auth import hash_password, validate_basic_auth
from app.core.security.jwt_auth import (
    create_access_token,
    validate_jwt_token,
)
from app.database.connections import SessionDep
from app.models.users import User

router = APIRouter()


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

    db_user = User(
        email_address=email_address,
        first_name=user.firstName,
        last_name=user.lastName,
        password=hash_password(user.password),
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return {"message": f"User with email {db_user.email_address} created successfully."}


@router.delete(
    "/users/{email_address}",
    description="Delete an existing user",
    dependencies=[Depends(validate_jwt_token)],
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
    dependencies=[Depends(validate_jwt_token)],
)
def get_user(
    email_address: Annotated[str, Path(title="Email address of the user to retrieve")],
    session: SessionDep,
):
    user = session.get(User, email_address)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@router.get(
    "/users/{email_address}/login",
    description="Login a user",
    dependencies=[Depends(validate_basic_auth)],
)
def login_user(
    email_address: Annotated[str, Path(title="Email address to login")],
    response: Response,
):
    token = create_access_token(data={"sub": email_address})
    response.set_cookie(
        key="jwt_token",
        value=token.access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=24 * 60 * 60,
    )  # Set cookie to expire in 24 hours
    # TODO - set secure=True and samesite='strict' in production
    return {
        "message": "Login successful",
        "access_token": token.access_token,
        "token_type": token.token_type,
    }
