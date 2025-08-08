# llm/llm_chat.py
import os
from openai import OpenAI as OpenAIClient
import google.generativeai as genai
import anthropic
import requests

def chat_completion(provider: str, prompt: str, temperature: float = 0.7) -> str:
    try:
        provider = provider.lower()

        # === OpenAI ===
        if provider == "openai":
            print(f"I am running chat {provider}")
            client = OpenAIClient(api_key=os.getenv("OPENAI_API_KEY"))
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                temperature=temperature,
            )
            return response.choices[0].message.content

        # === Google Gemini ===
        elif provider == "google":
            print(f"I am running chat {provider}")
            genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
            model = genai.GenerativeModel("gemini-2.0-flash")
            response = model.generate_content(prompt)
            return response.text

        # === DeepSeek ===
        elif provider == "deepseek":
            headers = {
                "Authorization": f"Bearer {os.getenv('DEEPSEEK_API_KEY')}",
                "Content-Type": "application/json",
            }
            data = {
                "model": "deepseek-coder",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": temperature,
            }
            print(f"I am running chat {provider}")
            r = requests.post("https://api.deepseek.com/chat/completions", headers=headers, json=data)
            r.raise_for_status()
            return r.json()["choices"][0]["message"]["content"]

        # === Anthropic (Claude) ===
        elif provider == "anthropic":
            client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
            print(f"I am running chat {provider}")
            response = client.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=1024,
                messages=[{"role": "user", "content": prompt}],
            )
            return response.content[0].text

        else:
            return f"❌ Unsupported provider: {provider}"

    except Exception as e:
        return f"❌ LLM error: {str(e)}"
