from datetime import datetime, timedelta
from typing import TypedDict

from fastapi import FastAPI, Form, status
from fastapi.responses import RedirectResponse, HTMLResponse

from services.database import JSONDatabase

app = FastAPI()


class Quote(TypedDict):
    name: str
    message: str
    time: str


database: JSONDatabase[list[Quote]] = JSONDatabase("data/database.json")


@app.on_event("startup")
def on_startup() -> None:
    """Initialize database when starting API server."""
    if "quotes" not in database:
        print("Adding quotes entry to database")
        database["quotes"] = []


@app.on_event("shutdown")
def on_shutdown() -> None:
    """Close database when stopping API server."""
    database.close()


@app.post("/quote")
def post_message(name: str = Form(), message: str = Form()) -> RedirectResponse:
    """
    Process a user submitting a new quote.
    You should not modify this function except for the return value.
    """
    now = datetime.now().replace(microsecond=0)

    quote = Quote(name=name, message=message, time=now.isoformat())
    database["quotes"].append(quote)
    print("Posted")

    # You may modify the return value as needed to support other functionality
    return HTMLResponse(status_code=200)


@app.get("/getQuotes")
def get_message():
    print("get got getted")
    return database["quotes"]

@app.get("/getQuotesByAge")
def get_quotes_by_age(max_age: int = 7):
    """
    Retrieve quotes posted within the specified maximum age (in days).
    """
    if max_age == 0:
        return database["quotes"]
    
    filtered_quotes = []

    # Calculate the cutoff date based on the maximum age
    cutoff_date = datetime.now() - timedelta(days=max_age)

    # Filter quotes based on the cutoff date
    for quote in database["quotes"]:
        quote_time = datetime.fromisoformat(quote["time"])
        if quote_time >= cutoff_date:
            filtered_quotes.append(quote)

    return filtered_quotes
# TODO: add another API route with a query parameter to retrieve quotes based on max age
