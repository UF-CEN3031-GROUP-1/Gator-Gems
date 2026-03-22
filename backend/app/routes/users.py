from fastapi import APIRouter, HTTPException, Path, Depends, status
from typing import Annotated
import secrets
from pydantic import BaseModel

from app.database.connections import SessionDep
from app.models.users import User
from fastapi.security import HTTPBasic, HTTPBasicCredentials

router = APIRouter()
security = HTTPBasic()


class CreateUser(BaseModel):
    firstName: str
    lastName: str


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
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return {"message": f"User with email {db_user.email_address} created successfully."}


@router.delete("/users/{email_address}", description="Delete an existing user")
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
    credentials: Annotated[HTTPBasicCredentials, Depends(security)],
):
    current_username_bytes = credentials.username.encode("utf8")
    correct_username_bytes = b"stanleyjobson"
    is_correct_username = secrets.compare_digest(
        current_username_bytes, correct_username_bytes
    )
    current_password_bytes = credentials.password.encode("utf8")
    correct_password_bytes = b"swordfish"
    is_correct_password = secrets.compare_digest(
        current_password_bytes, correct_password_bytes
    )
    if not (is_correct_username and is_correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )


@router.get(
    "/user/login",
    description="Login a user",
    dependencies=[Depends(validate_credentials)],
)
def login_user():
    pass
