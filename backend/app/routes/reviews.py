from datetime import datetime
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import select

from app.core.locations import get_location_id
from app.core.security.jwt_auth import get_email_from_token, get_is_admin_from_token
from app.database.connections import SessionDep
from app.models.reviews import Review

router = APIRouter()


class CreateReview(BaseModel):
    stars: int
    notes: str
    visit_again: bool
    location_name: str


class UpdateReview(BaseModel):
    stars: Optional[int] = None
    notes: Optional[str] = None
    visit_again: Optional[bool] = None


@router.get("/reviews", description="Get all reviews", tags=["reviews"])
def get_reviews(session: SessionDep):
    reviews = session.exec(select(Review)).all()
    return reviews


@router.post("/reviews", description="Create a new review", tags=["reviews"])
async def create_review(
    review: CreateReview,
    session: SessionDep,
    user_email: Annotated[str, Depends(get_email_from_token)],
):
    location_data = await get_location_id(review.location_name)
    db_review = Review(
        stars=review.stars,
        notes=review.notes,
        visit_again=review.visit_again,
        address=location_data["name"],
        location_id=location_data["location_id"],
        lat=float(location_data["lat"]),
        lon=float(location_data["lon"]),
        created_by=user_email,
        created_at=datetime.now(),
    )

    session.add(db_review)
    session.commit()
    session.refresh(db_review)

    return {"message": f"review with ID {db_review.id} created successfully."}


@router.put(
    "/reviews/{review_id}", description="Update an existing review", tags=["reviews"]
)
def update_review(
    review_id: int,
    review: UpdateReview,
    session: SessionDep,
    user_email: Annotated[str, Depends(get_email_from_token)],
    is_admin: Annotated[bool, Depends(get_is_admin_from_token)],
):
    db_review = session.get(Review, review_id)

    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")

    if db_review.created_by != user_email:
        raise HTTPException(
            status_code=403, detail="Not authorized to update this review"
        )

    if review.stars is not None:
        db_review.stars = review.stars
    if review.notes is not None:
        db_review.notes = review.notes
    if review.visit_again is not None:
        db_review.visit_again = review.visit_again

    db_review.created_at = datetime.now()

    session.commit()
    session.refresh(db_review)

    return {"message": f"Review {review_id} updated successfully."}


@router.delete(
    "/reviews/{review_id}", description="Delete an existing review", tags=["reviews"]
)
def delete_review(
    review_id: int,
    session: SessionDep,
    user_email: Annotated[str, Depends(get_email_from_token)],
):
    db_review = session.get(Review, review_id)

    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")

    if db_review.created_by != user_email:
        raise HTTPException(
            status_code=403, detail="Not authorized to delete this review"
        )

    session.delete(db_review)
    session.commit()

    return {"message": f"Review {review_id} deleted successfully."}
