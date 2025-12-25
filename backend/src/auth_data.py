from enum import StrEnum
from pydantic import BaseModel

class Provider(StrEnum):
    GITHUB = "github"
    GOOGLE = "google"

class AuthEmail(BaseModel):
    email: str
    password: str
