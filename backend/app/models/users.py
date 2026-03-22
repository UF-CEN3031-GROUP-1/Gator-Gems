from pydantic import ConfigDict, EmailStr
from pydantic.alias_generators import to_camel
from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    model_config = ConfigDict(alias_generator=to_camel)

    email_address: EmailStr = Field(..., primary_key=True)
    first_name: str
    last_name: str
    _password: str
