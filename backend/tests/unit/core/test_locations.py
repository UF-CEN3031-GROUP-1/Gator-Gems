import asyncio

import httpx
import pytest
from fastapi import HTTPException

from app.core.locations import NOMINATIM_URL, get_location_id


class DummyResponse:
    def __init__(self, data):
        self._data = data

    def json(self):
        return self._data


class DummyClient:
    def __init__(self, data):
        self.data = data

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc, tb):
        return False

    async def get(self, url, params=None, headers=None):
        assert url == NOMINATIM_URL
        return DummyResponse(self.data)


def test_get_location_id_success(monkeypatch):
    data = [
        {
            "display_name": "Some Building",
            "lat": "29.65",
            "lon": "-82.32",
            "osm_id": "1",
            "osm_type": "node",
            "class": "building",
        }
    ]

    async def run():
        monkeypatch.setattr(httpx, "AsyncClient", lambda: DummyClient(data))
        res = await get_location_id("Somewhere")
        assert res["name"] == "Some Building"
        assert res["location_id"] == "node:1"

    asyncio.run(run())


def test_get_location_id_not_found(monkeypatch):
    data = []

    async def run():
        monkeypatch.setattr(httpx, "AsyncClient", lambda: DummyClient(data))
        with pytest.raises(HTTPException) as err:
            await get_location_id("Nowhere")
        assert err.value.status_code == 404

    asyncio.run(run())


def test_get_location_id_bad_first_entry(monkeypatch):
    data = [{}]

    async def run():
        monkeypatch.setattr(httpx, "AsyncClient", lambda: DummyClient(data))
        with pytest.raises(HTTPException) as err:
            await get_location_id("Bad")
        assert err.value.status_code == 404

    asyncio.run(run())
