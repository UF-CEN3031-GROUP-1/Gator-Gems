from sqlmodel import Session

from app.database.connections import get_session


def test_get_session_generator():
    gen = get_session()
    session = next(gen)
    assert isinstance(session, Session)
    gen.close()
