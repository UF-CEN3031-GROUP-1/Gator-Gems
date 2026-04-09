from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, HTTPException, Path
from pydantic import BaseModel

from app.database.connections import SessionDep
from app.models.reviews import Review

router = APIRouter()


class CreateReview(BaseModel):
    id: int
    stars: int
    notes: str
    visit_again: bool
    location_id: str
    created_by: str
    created_at: datetime


@router.post("/reviews/{id}", description="Create a new review")
def create_review(
    id: Annotated[int, Path(title="ID of the review to create")],
    review: CreateReview,
    session: SessionDep,
):
    existing_review = session.get(Review, id)
    if existing_review:
        raise HTTPException(status_code=400, detail="review already exists")

    db_review = Review(
        id=id,
        stars=review.stars,
        notes=review.notes,
        visit_again=review.visit_again,
        location_id=review.location_id,
        created_by=review.created_by,
        created_at=review.created_at,
    )

    session.add(db_review)
    session.commit()
    session.refresh(db_review)

    return {"message": f"review with ID {db_review.id} created successfully."}
