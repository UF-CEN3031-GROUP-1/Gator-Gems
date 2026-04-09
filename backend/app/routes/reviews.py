from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.core.security.jwt_auth import get_email_from_token
from app.database.connections import SessionDep
from app.models.reviews import Review

router = APIRouter()


class CreateReview(BaseModel):
    stars: int
    notes: str
    visit_again: bool
    location_id: str


@router.post("/reviews", description="Create a new review")
def create_review(
    review: CreateReview,
    session: SessionDep,
    user_email: Annotated[str, Depends(get_email_from_token)],
):
    db_review = Review(
        stars=review.stars,
        notes=review.notes,
        visit_again=review.visit_again,
        location_id=review.location_id,
        created_by=user_email,
        created_at=datetime.utcnow(),
    )

    session.add(db_review)
    session.commit()
    session.refresh(db_review)

    return {"message": f"review with ID {db_review.id} created successfully."}
