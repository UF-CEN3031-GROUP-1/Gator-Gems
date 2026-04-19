from fastapi import HTTPException
from fastapi.testclient import TestClient
from sqlmodel import select

from app.models.reviews import Review


def test_get_my_reviews(session, client: TestClient, user):
    session.add(user)
    session.commit()
    r1 = Review(
        stars=5,
        notes="mine",
        visit_again=True,
        address="a",
        location_id="node:1",
        lat=1.0,
        lon=1.0,
        created_by=user.email_address,
    )
    session.add(r1)
    session.commit()
    session.refresh(r1)

    from app.core.security.jwt_auth import create_access_token

    token = create_access_token({"sub": user.email_address}).access_token
    client.cookies.set("jwt_token", token)

    response = client.get("/reviews/me")
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_delete_review_not_found(session, client: TestClient, user):
    from app.core.security.jwt_auth import create_access_token

    session.add(user)
    session.commit()
    token = create_access_token({"sub": user.email_address}).access_token
    client.cookies.set("jwt_token", token)

    response = client.delete("/reviews/999999")
    assert response.status_code == 404
    assert response.json() == {"detail": "Review not found"}


def test_update_review_stars_and_visit_again(session, client: TestClient, user):
    session.add(user)
    session.commit()
    review = Review(
        stars=1,
        notes="old",
        visit_again=False,
        address="addr",
        location_id="node:10",
        lat=0.0,
        lon=0.0,
        created_by=user.email_address,
    )
    session.add(review)
    session.commit()
    session.refresh(review)

    from app.core.security.jwt_auth import create_access_token

    token = create_access_token({"sub": user.email_address}).access_token
    client.cookies.set("jwt_token", token)

    response = client.put(
        f"/reviews/{review.id}", json={"stars": 9, "visit_again": True}
    )
    assert response.status_code == 200
    updated = session.get(Review, review.id)
    assert updated.stars == 9
    assert updated.visit_again is True


def test_get_reviews_empty(session: TestClient, client: TestClient):
    response = client.get("/reviews")
    assert response.status_code == 200
    assert response.json() == []


def test_create_review_success(monkeypatch, session, client, user, jwt):
    session.add(user)
    session.commit()

    async def mock_get_location_id(name: str):
        return {
            "name": "Mock Place",
            "lat": "29.65",
            "lon": "-82.32",
            "osm_id": "123",
            "osm_type": "node",
            "location_id": "node:123",
        }

    monkeypatch.setattr("app.routes.reviews.get_location_id", mock_get_location_id)

    client.cookies.set("jwt_token", jwt.credentials)

    payload = {
        "location_name": "Some Place",
        "stars": 8,
        "notes": "Nice place",
        "visit_again": True,
    }

    response = client.post("/reviews", json=payload)

    assert response.status_code == 200
    assert "created successfully" in response.json()["message"]

    reviews = session.exec(select(Review)).all()
    assert len(reviews) == 1
    assert reviews[0].created_by == user.email_address


def test_create_review_location_not_found(monkeypatch, session, client, user, jwt):
    session.add(user)
    session.commit()

    async def mock_get_location_id(name: str):
        raise HTTPException(status_code=404, detail="No location found")

    monkeypatch.setattr("app.routes.reviews.get_location_id", mock_get_location_id)
    client.cookies.set("jwt_token", jwt.credentials)

    payload = {
        "location_name": "Nowhere",
        "stars": 5,
        "notes": "Nope",
        "visit_again": False,
    }

    response = client.post("/reviews", json=payload)
    assert response.status_code == 404
    assert response.json() == {"detail": "No location found"}


def test_update_review_success(session, client, user, jwt):
    session.add(user)
    session.commit()
    review = Review(
        stars=5,
        notes="old",
        visit_again=True,
        address="addr",
        location_id="node:1",
        lat=29.0,
        lon=-82.0,
        created_by=user.email_address,
    )
    session.add(review)
    session.commit()
    session.refresh(review)
    client.cookies.set("jwt_token", jwt.credentials)
    response = client.put(f"/reviews/{review.id}", json={"notes": "updated"})
    assert response.status_code == 200
    assert response.json()["message"] == f"Review {review.id} updated successfully."
    updated = session.get(Review, review.id)
    assert updated.notes == "updated"


def test_update_review_not_found(session, client, user, jwt):
    session.add(user)
    session.commit()
    client.cookies.set("jwt_token", jwt.credentials)
    response = client.put("/reviews/9999", json={"notes": "x"})
    assert response.status_code == 404
    assert response.json() == {"detail": "Review not found"}


def test_update_review_not_authorized(session, client, user, jwt):
    session.add(user)
    session.commit()
    other_review = Review(
        stars=5,
        notes="other",
        visit_again=False,
        address="addr",
        location_id="node:2",
        lat=29.0,
        lon=-82.0,
        created_by="someone@else.com",
    )
    session.add(other_review)
    session.commit()
    session.refresh(other_review)
    client.cookies.set("jwt_token", jwt.credentials)
    response = client.put(f"/reviews/{other_review.id}", json={"notes": "bad"})
    assert response.status_code == 403
    assert response.json() == {"detail": "Not authorized to update this review"}


def test_delete_review_success_by_creator(session, client, user, jwt):
    session.add(user)
    session.commit()
    review = Review(
        stars=6,
        notes="todelete",
        visit_again=True,
        address="addr",
        location_id="node:3",
        lat=29.0,
        lon=-82.0,
        created_by=user.email_address,
    )
    session.add(review)
    session.commit()
    session.refresh(review)

    client.cookies.set("jwt_token", jwt.credentials)
    response = client.delete(f"/reviews/{review.id}")
    assert response.status_code == 200
    assert response.json() == {"message": f"Review {review.id} deleted successfully."}

    assert session.get(Review, review.id) is None


def test_delete_review_forbidden(session, client, user, jwt):
    session.add(user)
    session.commit()
    review = Review(
        stars=4,
        notes="other",
        visit_again=False,
        address="addr",
        location_id="node:4",
        lat=29.0,
        lon=-82.0,
        created_by="someone@else.com",
    )
    session.add(review)
    session.commit()
    session.refresh(review)

    client.cookies.set("jwt_token", jwt.credentials)
    response = client.delete(f"/reviews/{review.id}")
    assert response.status_code == 403
    assert response.json() == {"detail": "Not authorized to delete this review"}


def test_delete_review_as_admin(session, client, user):
    from app.core.security.jwt_auth import create_access_token

    admin = user
    admin.is_admin = True
    session.add(admin)
    session.commit()

    token = create_access_token({"sub": admin.email_address}).access_token
    client.cookies.set("jwt_token", token)

    review = Review(
        stars=3,
        notes="by someone",
        visit_again=False,
        address="addr",
        location_id="node:5",
        lat=29.0,
        lon=-82.0,
        created_by="someone@else.com",
    )
    session.add(review)
    session.commit()
    session.refresh(review)

    response = client.delete(f"/reviews/{review.id}")
    assert response.status_code == 200
    assert response.json() == {"message": f"Review {review.id} deleted successfully."}
