import os

def check_required_api_key(provider: str) -> bool:
    env_keys = {
        "openai": "OPENAI_API_KEY",
        "anthropic": "ANTHROPIC_API_KEY",
        "azure": "AZURE_OPENAI_KEY",
        "google": "GOOGLE_API_KEY",
        "deepseek": "DEEPSEEK_API_KEY",
        "groq": "GROQ_API_KEY",
        "novita": "NOVITA_API_KEY",
        "ollama": "OLLAMA_API_KEY",
    }
    env_var = env_keys.get(provider.lower())
    if not env_var:
        raise ValueError(f"Unknown provider: {provider}")
    
    api_key = os.getenv(env_var)
    return bool(api_key)