import httpx
from fastapi import HTTPException

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
GAINESVILLE_BOUNDS = "-82.50,29.80,-82.10,29.45"  # west, north, east, south


async def get_location_id(location_name: str):
    params = {
        "q": location_name,
        "format": "json",
        "bounded": 1,
        "viewbox": GAINESVILLE_BOUNDS,
        "extratags": 1,
        "addressdetails": 1,
    }

    headers = {"User-Agent": "Gator Gems"}

    async with httpx.AsyncClient() as client:
        res = await client.get(NOMINATIM_URL, params=params, headers=headers)

    data = res.json()

    if not data:
        raise HTTPException(status_code=404, detail="No location found")

    buildings = [
        r
        for r in data
        if r.get("class") == "building"
        or "building" in (r.get("type", "") or "")
        or (r.get("category") == "building")
        or ("building" in r.get("display_name", "").lower())
    ]

    if not buildings:
        raise HTTPException(status_code=404, detail="No building found")

    first = buildings[0]

    return {
        "name": first.get("display_name"),
        "lat": first.get("lat"),
        "lon": first.get("lon"),
        "osm_id": first.get("osm_id"),
        "osm_type": first.get("osm_type"),
        "location_id": f"{first.get('osm_type')}:{first.get('osm_id')}",
    }
