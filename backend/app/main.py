from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.logging import setup_logging
from app.database.schema import create_db_and_tables
from app.routes import health, users

setup_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]

app = FastAPI(lifespan=lifespan)

app.include_router(health.router)
app.include_router(users.router)
app.add_middleware(
    CORSMiddleware,  # ty: ignore
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
