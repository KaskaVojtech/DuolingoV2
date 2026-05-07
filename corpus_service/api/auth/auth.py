import os
from fastapi import Security, HTTPException, status
from fastapi.security import APIKeyHeader

API_KEY_HEADER = APIKeyHeader(name="X-Api-Key", auto_error=False)

VALID_API_KEYS = set(filter(None, [
    os.environ.get("API_KEY_CORPUS"),    
    os.environ.get("API_KEY_BACKEND"),   
    os.environ.get("API_KEY_SENTENCE_PROCESSOR"),      
]))

def verify_api_key(api_key: str = Security(API_KEY_HEADER)) -> str:
    if not api_key or api_key not in VALID_API_KEYS:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key",
            headers={"WWW-Authenticate": "ApiKey"},
        )
    return api_key