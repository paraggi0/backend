from fastapi import FastAPI
from app.api.v1.api import api_router

app = FastAPI(title="Manufacturing Query API")
app.include_router(api_router, prefix="/api/query")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Query API"}
