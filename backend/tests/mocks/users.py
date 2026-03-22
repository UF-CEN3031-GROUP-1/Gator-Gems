from app.models.users import User
from app.core.security.basic_auth import hash_password

MOCK_USER_RAW_PASSWORD = "mockpassword"

MOCK_USER = User(
    email_address="mock@gmail.com",
    first_name="Mock",
    last_name="User",
    password=hash_password(MOCK_USER_RAW_PASSWORD),
)
