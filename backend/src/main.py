import os
from typing import Union
from fastapi import FastAPI, HTTPException
from supabase import create_client, Client
from dotenv import load_dotenv
from .auth_data import AuthEmail, Provider
from .services.auth import AuthService

load_dotenv()

app = FastAPI()

url: Union[str, None] = os.getenv("SUPABASE_URL") or ""
key: Union[str, None] = os.getenv("SUPABASE_KEY") or ""
supabase: Client = create_client(url, key)

# service
authService = AuthService(supabase)

@app.get("/api/v1/health")
def health():
  return {"message": "Up and running"}

@app.post("/api/v1/auths/signup")
async def sign_up(data: AuthEmail):
    res = authService.sign_up_with_email(data.email, data.password)
    return {"data": res}

@app.post("/api/v1/auths/signin")
async def sign_in_email(data: AuthEmail):
    res = authService.sign_in_with_email(data.email, data.password)
    return {"data": res}

@app.post("/api/v1/auths/signin/oauth/{provider}")
async def sign_in_oauth(provider: str):
    res = ""
    if provider == Provider.GOOGLE:
        res = authService.sign_in_with_oauth_google()
    elif provider == Provider.GITHUB:
        res = authService.sign_in_with_oauth_github()
    else:
        raise HTTPException(status_code=400, detail="Invalid Provider")
    return {"data": res}

@app.post("/api/v1/auths/signout")
async def signout():
    authService.sign_out()
    return {"message": "Sign out successfully"}

@app.get("/api/v1/auths/sessions")
async def session():
    res = authService.session()
    return {"data": res}

