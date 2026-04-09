from datetime import datetime

from pydantic import ConfigDict, EmailStr
from pydantic import Field as PydanticField
from pydantic.alias_generators import to_camel
from sqlmodel import Field, SQLModel


class Review(SQLModel, table=True):
    model_config = ConfigDict(alias_generator=to_camel)
    id: int = Field(default=None, primary_key=True)
    stars: int = PydanticField(ge=1, le=10)
    notes: str
    visit_again: bool
    location_id: str
    created_by: EmailStr = Field(foreign_key="user.email_address")
    created_at: datetime = Field(default_factory=datetime.utcnow)
