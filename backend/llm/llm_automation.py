
from browser_use.llm.openai.chat import ChatOpenAI
from browser_use.llm.google.chat import ChatGoogle
from browser_use.llm.groq.chat import ChatGroq
from browser_use.llm.deepseek.chat import ChatDeepSeek
from browser_use.llm.ollama.chat import ChatOllama
from browser_use.llm.azure.chat import ChatAzureOpenAI
from browser_use.llm.aws.chat_anthropic import ChatAnthropicBedrock
from browser_use.llm.aws.chat_bedrock import ChatAWSBedrock

def get_llm_instance(provider: str, temperature: float = 0.7):
    if provider == "openai":
        return ChatOpenAI(model="gpt-4o", temperature=temperature)
    elif provider == "google":
        return ChatGoogle(model="gemini-2.0-flash", temperature=temperature)
    elif provider == "groq":
        return ChatGroq(model="mixtral-8x7b-32768", temperature=temperature)
    elif provider == "deepseek":
        return ChatDeepSeek(model="deepseek-coder", temperature=temperature)
    elif provider == "ollama":
        return ChatOllama(model="llama2")
    elif provider == "aws":
        return ChatAWSBedrock(model="amazon.titan-text-express-v1", temperature=temperature)
    elif provider == "anthropic":
        return ChatAnthropicBedrock(model="anthropic.claude-v2", temperature=temperature)
    else:
        raise ValueError(f"Unsupported provider: {provider}")