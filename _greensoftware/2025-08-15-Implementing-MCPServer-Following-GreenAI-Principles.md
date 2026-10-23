---
title: 'Develop MCPServer with a focus on eco-friendly technology practices.'
date: 2025-08-15
permalink: posts/2025/08/blog-post-1/
collection: posts
tags:
  - AI Engineering
  - Green AI
  - MCP Implementation
  - Azure Solutions
  - Sustainability
  - Carbon Emission
  - Green AI Metrics 
---


The field of AI Engineering is rapidly evolving and expanding to explore new possibilities. This growth is marked by frequent updates to models, integrations, upgrades, and methodologies, occurring daily and monthly. These advancements are essential for keeping pace with the dynamic nature of AI technologies and their applications.

In the past few year, several key concepts have emerged in artificial intelligence. Agentic AI focuses on autonomous decision-making, while MCP (Model-Context Protocol) enhances model-context interaction. Explainable AI (XAI) prioritizes transparency in AI decisions, and multimodal AI integrates data from various sources. Additionally, there is an increasing emphasis on sustainable AI development, promoting environmentally friendly practices within the industry.

Given the buzz around the MCP Protocol, I want to share my insights as a Green AI practitioner on implementing sustainable AI practices in MCP server implementation. I will outline a few best practices and strategies that can enhance efficiency while minimizing environmental impact.
Before procedding futher, lets understand MCP and Green AI.
### What is MCP?
An MCP server, or Model Context Protocol server, acts as a bridge between AI models and external resources, enabling them to access and utilize tools, data, and other functionalities in a secure and standardized way. It essentially allows AI models to interact with the real world, going beyond simple text generation to perform actions and access information. 

### What is Green AI?
Green AI refers to an approach that aims to minimize the environmental impact of artificial intelligence systems across their entire lifecycle. This concept emphasizes the importance of standardizing measurements and metrics, which fosters transparency and builds confidence in AI technologies. By focusing on these aspects, Green AI encourages ongoing improvements in sustainability within the field of artificial intelligence.

To effectively implement Green AI, we need to focus on two key aspects: 

1. Embracing Green Software coding practices that prioritize sustainability.
2. Harnessing the power of eco-friendly Infrastructure, such as green cloud solutions.


<img src="/images/posts/mcp_greenai/mcp_green.png" style="width:600px;height:500px; border-radius: 15px;box-shadow: 0px 0px 5px 5px #000000;">

By prioritizing these areas, we can drive innovation while minimizing our environmental impact!

## Embracing Green Software coding practices that prioritize sustainability.

### MCP Server file before implementing Green AI Coding standards
Here is an example MCP Server file:
```
    from mcp.server.fastmcp import FastMCP
    from typing import List
    import psutil
    import time
    import os
    import logging
    import asyncio
    from functools import lru_cache
    from pydantic_ai import Agent
    from pydantic_ai.models.anthropic import AnthropicModel
    from pydantic_ai.providers.anthropic import AnthropicProvider
    from dotenv import load_dotenv

    # In-memory mock database with 20 leave days to start
    student_leaves = {
        "S001": {"balance": 18, "history": ["2024-12-25", "2025-01-01"]},
        "S002": {"balance": 20, "history": []}
    }

    # Create MCP server
    mcp = FastMCP("LeaveManager", stateless_http=True,  host="localhost", port=8000)

    # Setup logging for resource monitoring
    logging.basicConfig(filename="greenai.log", level=logging.INFO)

    load_dotenv()

    ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", None) 

    model = AnthropicModel(
        'HuggingFaceH4/mistral-7b-anthropic', provider=AnthropicProvider(api_key=ANTHROPIC_API_KEY)
    )
    server_agent = Agent(
        model
    )

    # tool
    @mcp.tool()
    async def poet(theme: str) -> str:
        """Poem generator"""
        r = await server_agent.run(f'write a poem about {theme}')
        return r.output

    # Green AI: async weather fetch with lazy import
    @mcp.tool()
    async def fetch_weather(city: str) -> str:
        """Fetch current weather for a city (async, lazy import)"""
        try:
            import httpx
            async with httpx.AsyncClient() as client:
                response = await client.get(f"https://api.weather.com/{city}")
                return response.text
        except Exception as e:
            import logging
            logging.error(f"Weather API error: {e}")
            return f"Weather API error: {e}"


    # Resource: Leave history
    @mcp.tool()
    def get_leave_history(student_id: str) -> str:
        """Get leave history for the student"""
        data = student_leaves.get(student_id)
        if data:
            history = ', '.join(data['history']) if data['history'] else "No leaves taken."
            return f"Leave history for {student_id}: {history}"
        return "Student ID not found."

    # Resource: PDF file
    @mcp.resource("pdf://Generative_AI")
    def get_pdf() -> bytes:
        """Return the contents of the Generative_AI_1705404080.pdf file as bytes."""
        pdf_path = os.path.join(os.path.dirname(__file__), "data", "Generative_AI_1705404080.pdf")
        with open(pdf_path, "rb") as f:
            return f.read()
        
    @mcp.prompt()
    def extract_text_from_pdf(resource: str) -> list[str]:
        """Extracts text from a PDF resource."""
        # Placeholder: Replace with actual PDF extraction logic
        return [f"Extracted text from {resource}:  Placeholder text."]

    # Resource: Greeting
    @mcp.resource("greeting://{name}")
    def get_greeting(name: str) -> str:
        """Get a personalized greeting"""
        return f"Hello, {name}! How can I assist you with leave management today?"

    @mcp.resource("greenai://info")
    def greenai_info():
        """Report on green AI practices and resource usage."""
        process = psutil.Process(os.getpid())
        mem_info = process.memory_info()
        cpu_percent = psutil.cpu_percent(interval=0.1)
        uptime = time.time() - process.create_time()
        return {
            "green_ai_practices": [
                "Efficient model selection",
                "Caching and batching where possible",
                "Responsible data handling",
                "Resource monitoring"
            ],
            "resource_usage": {
                "memory_rss_mb": round(mem_info.rss / (1024 * 1024), 2),
                "cpu_percent": cpu_percent,
                "uptime_seconds": int(uptime)
            }
        }

    if __name__ == "__main__":
        mcp.run(transport="streamable-http")
```


### MCP Server file after implementing Green AI Coding standards


Here are code changes for optimizations to support Green AI in MCP server:
-   Adaptive Model Selection
    Dynamically choose smaller, faster models for non-critical tasks and only use large models when necessary.Uses smaller models for non-critical tasks (e.g., poetry).
-   Request Throttling
    Limit the rate of expensive API calls (e.g., weather) to avoid unnecessary energy and cost.Weather API calls are rate-limited per city to avoid unnecessary requests.
-   Idle Resource Cleanup
    Periodically clear caches and close unused resources to free memory. Caching size for PDF is configurable via the PDF_CACHE_SIZE environment variable.

-   Batch Processing
If multiple requests for weather or PDF extraction are expected, process them in batches.Use fetch_weather_batch to efficiently get weather for multiple cities in one call.
-   Energy/Carbon Reporting
Add a resource that estimates energy or carbon usage based on server metrics. The greenai://energy resource estimates server energy and carbon usage.

-   Environment-Aware Scheduling
Schedule heavy tasks for off-peak hours if possible. The heavy_task tool restricts heavy computations to off-peak hours for energy efficiency.

-   Periodic cache cleanup: 
The PDF cache is cleaned up based on a configurable timeout, freeing memory from idle resources.

-   Async I/O and lazy imports: 
Reduces blocking and memory usage for weather and PDF resources.

-   Logging: 
Resource usage and errors are logged for monitoring and future optimization.

```
    import torch
import platform
import psutil
import time
import os
import logging
import asyncio

from mcp.server.fastmcp import FastMCP
from typing import List
from dotenv import load_dotenv
from datetime import datetime

from transformers import AutoTokenizer, AutoModel


load_dotenv()
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY", None)


model_name = "microsoft/Phi-3-mini-4k-instruct"
tokenizer = AutoTokenizer.from_pretrained(model_name, token=HUGGINGFACE_API_KEY, use_fast=True, trust_remote_code=True)
model = AutoModel.from_pretrained(model_name, 
                                  torch_dtype=torch.float16, 
                                  low_cpu_mem_usage=True,
                                  use_safetensors=True,
                                  resume_download=True,  
                                    force_download=False,
                                    local_files_only=False,
                                    token=HUGGINGFACE_API_KEY, 
                                    trust_remote_code=True).eval()


# In-memory mock database with 20 leave days to start
student_leaves = {
    "S001": {"balance": 18, "history": ["2024-12-25", "2025-01-01"]},
    "S002": {"balance": 20, "history": []}
}

# Create MCP server
mcp = FastMCP("LeaveManager", stateless_http=True,  host="0.0.0.0", port=8000)

# Setup logging for resource monitoring
logging.basicConfig(filename="greenai.log", level=logging.INFO)

# Green AI: Adaptive model selection for poetry
@mcp.tool()
async def poet(theme: str) -> str:
    def generate_poem():
        input_ids = tokenizer.encode(theme, return_tensors="pt")
        output = model.generate(
            input_ids, 
            max_new_tokens=50,
            num_return_sequences=1,
            do_sample=True
        )
        return tokenizer.decode(output[0], skip_special_tokens=True)
    
    try:
        # Run in executor with timeout
        loop = asyncio.get_event_loop()
        result = await asyncio.wait_for(
            loop.run_in_executor(None, generate_poem),
            timeout=30  # 30 second timeout
        )
        return result
    except asyncio.TimeoutError:
        return "Poem generation timed out. Please try a simpler theme."

# Green AI: async weather fetch with lazy import and request throttling
import time as _time
_last_weather_call = {}
WEATHER_THROTTLE_SECONDS = int(os.getenv("WEATHER_THROTTLE_SECONDS", "10"))


# Green AI: Batch weather processing
@mcp.tool()
async def fetch_weather_batch(cities: List[str]) -> dict:
    """Batch fetch weather for multiple cities (async, lazy import, throttled)"""
    import httpx
    results = {}
    now = _time.time()
    async with httpx.AsyncClient() as client:
        for city in cities:
            last_call = _last_weather_call.get(city)
            if last_call and now - last_call < WEATHER_THROTTLE_SECONDS:
                results[city] = f"Weather API call for {city} throttled. Try again in {int(WEATHER_THROTTLE_SECONDS - (now - last_call))} seconds."
                continue
            try:
                response = await client.get(f"https://api.weather.com/{city}")
                _last_weather_call[city] = _time.time()
                results[city] = response.text
            except Exception as e:
                import logging
                logging.error(f"Weather API error: {e}")
                results[city] = f"Weather API error: {e}"
    return results

# Green AI: Energy/Carbon reporting
@mcp.resource("greenai://energy")
def energy_report():
    """Estimate energy and carbon usage based on server metrics."""
    import platform
    import psutil
    import os
    # Simple estimation: energy = uptime * avg_cpu_percent * factor
    process = psutil.Process(os.getpid())
    uptime = time.time() - process.create_time()
    cpu_percent = psutil.cpu_percent(interval=0.1)
    # Assume 50W server, 0.5 kg CO2/kWh
    energy_kwh = (uptime * cpu_percent / 100 * 50) / 3600000
    carbon_kg = energy_kwh * 0.5
    return {
        "uptime_seconds": int(uptime),
        "avg_cpu_percent": cpu_percent,
        "estimated_energy_kwh": round(energy_kwh, 4),
        "estimated_carbon_kg": round(carbon_kg, 4),
        "platform": platform.platform()
    }

# Green AI: Environment-aware scheduling (example: restrict heavy tasks to off-peak hours)
def is_off_peak():
    import datetime
    hour = datetime.datetime.now().hour
    # Assume off-peak is 10pm-6am
    return hour >= 22 or hour < 6

@mcp.tool()
async def heavy_task(data: str) -> str:
    """Run a heavy task only during off-peak hours."""
    if not is_off_peak():
        return "Heavy tasks are restricted to off-peak hours (10pm-6am) for energy efficiency."
    # ...perform heavy computation...
    await asyncio.sleep(2)  # Simulate heavy work
    return f"Heavy task completed for: {data}"


# Resource: Leave history
@mcp.tool()
def get_leave_history(student_id: str) -> str:
    """Get leave history for the student"""
    data = student_leaves.get(student_id)
    if data:
        history = ', '.join(data['history']) if data['history'] else "No leaves taken."
        return f"Leave history for {student_id}: {history}"
    return "Student ID not found."



# Green AI: async PDF loading and caching with periodic cleanup
import functools
pdf_cache = {}
PDF_CACHE_SIZE = int(os.getenv("PDF_CACHE_SIZE", "1"))
PDF_CACHE_TIMEOUT = int(os.getenv("PDF_CACHE_TIMEOUT", "600"))  # seconds
pdf_cache_times = {}

async def cleanup_pdf_cache():
    now = _time.time()
    expired = [k for k, t in pdf_cache_times.items() if now - t > PDF_CACHE_TIMEOUT]
    for k in expired:
        pdf_cache.pop(k, None)
        pdf_cache_times.pop(k, None)

@mcp.resource("pdf://Generative_AI")
async def get_pdf() -> bytes:
    """Return the contents of the Generative_AI_1705404080.pdf file as bytes (async, cached, periodic cleanup)."""
    await cleanup_pdf_cache()
    pdf_path = os.path.join(os.path.dirname(__file__), "data", "Generative_AI_1705404080.pdf")
    if pdf_path in pdf_cache:
        return pdf_cache[pdf_path]
    loop = asyncio.get_event_loop()
    with open(pdf_path, "rb") as f:
        data = await loop.run_in_executor(None, f.read)
    if len(pdf_cache) >= PDF_CACHE_SIZE:
        oldest = min(pdf_cache_times, key=pdf_cache_times.get)
        pdf_cache.pop(oldest, None)
        pdf_cache_times.pop(oldest, None)
    pdf_cache[pdf_path] = data
    pdf_cache_times[pdf_path] = _time.time()
    return data
    
@mcp.prompt()
def extract_text_from_pdf(resource: str) -> list[str]:
    """Extracts text from a PDF resource."""
    # Placeholder: Replace with actual PDF extraction logic
    return [f"Extracted text from {resource}:  Placeholder text."]

# Resource: Greeting
@mcp.resource("greeting://{name}")
def get_greeting(name: str) -> str:
    """Get a personalized greeting"""
    return f"Hello, {name}! How can I assist you with leave management today?"


@mcp.resource("greenai://info")
def greenai_info():
    """Report on green AI practices, resource usage, power consumption, and carbon emissions."""
    try:
        process = psutil.Process(os.getpid())
        mem_info = process.memory_info()
        cpu_percent = psutil.cpu_percent(interval=0.1)
        uptime = time.time() - process.create_time()
        
        # Power and carbon calculations
        power_metrics = calculate_power_consumption(cpu_percent, mem_info)
        carbon_metrics = calculate_carbon_emissions(power_metrics, uptime)
        
        # Additional system metrics
        disk_usage = psutil.disk_usage('/')
        
        return {
            "timestamp": datetime.now().isoformat(),
            "green_ai_practices": [
                "Efficient model selection (prefer smaller models when possible)",
                "Caching and batching to reduce redundant computations",
                "Responsible data handling and privacy protection",
                "Real-time resource monitoring and optimization",
                "Power-aware computing and carbon footprint tracking",
                "Using CPU vs GPU based on efficiency requirements",
                "Implementing timeouts to prevent resource waste",
                "Optimizing for renewable energy usage windows"
            ],
            "resource_usage": {
                "memory_rss_mb": round(mem_info.rss / (1024 * 1024), 2),
                "memory_vms_mb": round(mem_info.vms / (1024 * 1024), 2),
                "cpu_percent": cpu_percent,
                "uptime_seconds": int(uptime),
                "uptime_readable": f"{int(uptime // 3600)}h {int((uptime % 3600) // 60)}m",
                "disk_free_gb": round(disk_usage.free / (1024**3), 2),
                "process_threads": process.num_threads()
            },
            "power_consumption": power_metrics,
            "carbon_emissions": carbon_metrics,
            "recommendations": generate_green_recommendations(mem_info, cpu_percent, uptime, power_metrics),
            "sustainability_score": calculate_sustainability_score(cpu_percent, mem_info, uptime)
        }
    except Exception as e:
        return {
            "error": f"Failed to gather resource info: {str(e)}",
            "timestamp": datetime.now().isoformat()
        }

def calculate_power_consumption(cpu_percent, mem_info):
    """Calculate estimated power consumption based on system usage."""
    
    # Base power consumption estimates (in watts)
    # These are approximate values - actual consumption varies by hardware
    BASE_CPU_POWER = 15  # Idle CPU power
    MAX_CPU_POWER = 65   # Maximum CPU power under full load
    RAM_POWER_PER_GB = 3 # Power per GB of RAM
    BASE_SYSTEM_POWER = 20 # Motherboard, storage, etc.
    
    # Calculate CPU power based on utilization
    cpu_power = BASE_CPU_POWER + (cpu_percent / 100) * (MAX_CPU_POWER - BASE_CPU_POWER)
    
    # Calculate RAM power based on usage
    memory_gb = mem_info.rss / (1024**3)
    ram_power = memory_gb * RAM_POWER_PER_GB
    
    # Total estimated power
    total_power = cpu_power + ram_power + BASE_SYSTEM_POWER
    
    return {
        "cpu_power_watts": round(cpu_power, 2),
        "ram_power_watts": round(ram_power, 2),
        "base_system_watts": BASE_SYSTEM_POWER,
        "total_estimated_watts": round(total_power, 2),
        "power_efficiency_score": calculate_power_efficiency(cpu_percent, memory_gb)
    }

def calculate_carbon_emissions(power_metrics, uptime_seconds):
    """Calculate estimated carbon emissions based on power consumption."""
    
    # Carbon intensity varies by region and energy source
    # Global average: ~475g CO2/kWh (varies from ~50g for renewables to ~900g for coal)
    CARBON_INTENSITY_GLOBAL = 475  # grams CO2 per kWh
    CARBON_INTENSITY_RENEWABLE = 50  # grams CO2 per kWh (wind/solar)
    CARBON_INTENSITY_COAL = 900  # grams CO2 per kWh
    
    # Energy consumption in kWh
    power_kw = power_metrics["total_estimated_watts"] / 1000
    uptime_hours = uptime_seconds / 3600
    energy_kwh = power_kw * uptime_hours
    
    # Carbon emissions for different energy sources
    carbon_global = energy_kwh * CARBON_INTENSITY_GLOBAL  # grams CO2
    carbon_renewable = energy_kwh * CARBON_INTENSITY_RENEWABLE
    carbon_coal = energy_kwh * CARBON_INTENSITY_COAL
    
    return {
        "energy_consumed_kwh": round(energy_kwh, 6),
        "carbon_emissions_g": {
            "global_average": round(carbon_global, 3),
            "renewable_energy": round(carbon_renewable, 3),
            "coal_energy": round(carbon_coal, 3)
        },
        "carbon_emissions_kg": {
            "global_average": round(carbon_global / 1000, 6),
            "renewable_energy": round(carbon_renewable / 1000, 6),
            "coal_energy": round(carbon_coal / 1000, 6)
        },
        "equivalent_metrics": {
            "tree_seconds_offset": round(carbon_global / 21000, 2),  # 21kg CO2/year per tree
            "km_driven_equivalent": round(carbon_global / 120, 3),   # ~120g CO2/km average car
            "smartphone_charges": round(energy_kwh / 0.005, 1)       # ~5Wh per smartphone charge
        }
    }

def calculate_power_efficiency(cpu_percent, memory_gb):
    """Calculate power efficiency score (0-100)."""
    # Higher score = more efficient (doing more work per watt)
    base_efficiency = 100
    
    # Penalize high resource usage without proportional work
    if cpu_percent > 80:
        base_efficiency -= 30
    elif cpu_percent > 50:
        base_efficiency -= 15
    
    if memory_gb > 4:
        base_efficiency -= 20
    elif memory_gb > 2:
        base_efficiency -= 10
    
    return max(0, base_efficiency)

def calculate_sustainability_score(cpu_percent, mem_info, uptime):
    """Calculate overall sustainability score (0-100)."""
    score = 100
    
    memory_gb = mem_info.rss / (1024**3)
    
    # Penalize resource waste
    if cpu_percent > 70:
        score -= 25
    if memory_gb > 3:
        score -= 20
    if uptime > 7200:  # 2 hours
        score -= 15
    
    # Bonus for efficient usage
    if cpu_percent < 30 and memory_gb < 1:
        score += 10
    
    return max(0, min(100, score))

def generate_green_recommendations(mem_info, cpu_percent, uptime, power_metrics):
    """Generate green AI recommendations based on current usage."""
    recommendations = []
    
    memory_gb = mem_info.rss / (1024**3)
    power_watts = power_metrics["total_estimated_watts"]
    
    # Memory recommendations
    if memory_gb > 3:
        recommendations.append("🧠 High memory usage detected - consider model optimization or quantization")
    elif memory_gb > 2:
        recommendations.append("💡 Consider using memory-efficient models or batch processing")
    
    # CPU recommendations
    if cpu_percent > 80:
        recommendations.append("⚡ High CPU usage - optimize computations or use GPU acceleration")
    elif cpu_percent > 50:
        recommendations.append("🔧 Moderate CPU load - monitor for optimization opportunities")
    
    # Power recommendations
    if power_watts > 80:
        recommendations.append("🌱 High power consumption - consider energy-efficient algorithms")
    
    # Runtime recommendations
    if uptime > 3600:  # 1 hour
        recommendations.append("⏰ Long-running process - implement periodic resource cleanup")
    
    # Carbon recommendations
    recommendations.append("🌍 Consider running compute-intensive tasks during low-carbon grid hours")
    recommendations.append("♻️ Use renewable energy sources when possible")
    
    # General efficiency
    if not any("High" in rec or "Moderate" in rec for rec in recommendations):
        recommendations.append("✅ Resource usage looks optimal! Keep up the green practices!")
    
    return recommendations

# Additional utility function for carbon-aware scheduling
def get_carbon_awareness_info():
    """Provide information about carbon-aware computing practices."""
    return {
        "best_practices": [
            "Schedule compute-intensive tasks during low-carbon grid hours",
            "Use cloud regions powered by renewable energy",
            "Implement demand shifting for non-urgent tasks",
            "Monitor and report carbon footprint regularly",
            "Choose energy-efficient hardware and algorithms"
        ],
        "low_carbon_hours": "Typically 10 AM - 4 PM when solar power is abundant",
        "high_carbon_hours": "Typically 6 PM - 10 PM during peak demand"
    }

# Example usage with carbon-aware decision making
def should_run_intensive_task():
    """Simple heuristic to determine if now is a good time for intensive computing."""
    current_hour = datetime.now().hour
    
    # Prefer daytime hours (solar power availability)
    if 10 <= current_hour <= 16:
        return True, "Good time - likely high renewable energy availability"
    elif 18 <= current_hour <= 22:
        return False, "Peak demand hours - consider postponing if not urgent"
    else:
        return True, "Acceptable time for moderate compute tasks"

if __name__ == "__main__":
    mcp.run(transport="streamable-http")
        
```
## Harnessing the power of eco-friendly Infrastructure, such as green cloud solutions.

Cloud providers are actively promoting a “Green Cloud” approach, which focuses on using renewable energy to power infrastructure and services while optimizing for lower carbon footprints. These providers not only host systems in data centers that run on renewable resources, but they also offer customers tools and incentives to create more sustainable applications.

As an Azure Cloud practitioner, I will deploy the containerized MCP Server using Azure Container App.

Also, it's worth noting that Microsoft Azure is committed to sustainability, featuring carbon-neutral data centers, ambitious renewable energy goals, and tools to monitor and reduce carbon emissions.
####    All Azure VM Instances Are Green:

All Azure virtual machine instances benefit from Microsoft's carbon-neutral infrastructure and renewable energy commitments. This includes:

-   General Purpose VMs (A, B, D series)
-   Compute Optimized VMs (F series)
-   Memory Optimized VMs (E, M series)
-   Storage Optimized VMs (L series)
-   GPU VMs (N series)
-   High Performance Compute (H series)
-   ARM-based Azure Cobalt VMs - Utilize Microsoft's in-house designed ARM processors with Azure Cobalt VMs

####    Special Sustainable Regions
Arizona Region: The Arizona region is specifically mentioned as a sustainable datacenter <US West 3>region.


Now that, completed the deployment of MCP Server in US West 3 region and the server is accessible at <URL>


## Carbon Emission Estimates

-   Energy Consumption: Tracks kWh usage over time
-   Multiple Carbon Scenarios:
    -   Global average grid (~475g CO2/kWh)
    -   Renewable energy (~50g CO2/kWh)
    -   Coal-powered grid (~900g CO2/kWh)
-   Equivalent Metrics:
    -   Tree-seconds needed to offset emissions
    -   Equivalent km driven in a car
    -   Smartphone charges worth of energy

## Power Consumption Tracking

-   CPU Power: Estimates based on utilization percentage
-   RAM Power: Calculates power based on memory usage
-   Total System Power: Includes base system components
-   Power Efficiency Score: Rates how efficiently power is being used


## Green AI Features

-   Sustainability Score: Overall environmental impact rating (0-100)
-   Carbon-Aware Scheduling: Recommends optimal times for compute tasks
-   Smart Recommendations: Context-aware suggestions for reducing environmental impact

### Stats and Metrics from Local Machine:

```
{
  "contents": [
    {
      "uri": "greenai://info",
      "mimeType": "text/plain",
      "text": "{\n  \"timestamp\": \"2025-08-21T22:49:05.994540\",\n  \"green_ai_practices\": [\n    \"Efficient model selection (prefer smaller models when possible)\",\n    \"Caching and batching to reduce redundant computations\",\n    \"Responsible data handling and privacy protection\",\n    \"Real-time resource monitoring and optimization\",\n    \"Power-aware computing and carbon footprint tracking\",\n    \"Using CPU vs GPU based on efficiency requirements\",\n    \"Implementing timeouts to prevent resource waste\",\n    \"Optimizing for renewable energy usage windows\"\n  ],\n  \"resource_usage\": {\n    \"memory_rss_mb\": 173.66,\n    \"memory_vms_mb\": 409380.41,\n    \"cpu_percent\": 13.3,\n    \"uptime_seconds\": 27,\n    \"uptime_readable\": \"0h 0m\",\n    \"disk_free_gb\": 118.03,\n    \"process_threads\": 6\n  },\n  \"power_consumption\": {\n    \"cpu_power_watts\": 21.65,\n    \"ram_power_watts\": 0.51,\n    \"base_system_watts\": 20,\n    \"total_estimated_watts\": 42.16,\n    \"power_efficiency_score\": 100\n  },\n  \"carbon_emissions\": {\n    \"energy_consumed_kwh\": 0.000324,\n    \"carbon_emissions_g\": {\n      \"global_average\": 0.154,\n      \"renewable_energy\": 0.016,\n      \"coal_energy\": 0.292\n    },\n    \"carbon_emissions_kg\": {\n      \"global_average\": 0.000154,\n      \"renewable_energy\": 0.000016,\n      \"coal_energy\": 0.000292\n    },\n    \"equivalent_metrics\": {\n      \"tree_seconds_offset\": 0.0,\n      \"km_driven_equivalent\": 0.001,\n      \"smartphone_charges\": 0.1\n    }\n  },\n  \"recommendations\": [\n    \"🌍 Consider running compute-intensive tasks during low-carbon grid hours\",\n    \"♻️ Use renewable energy sources when possible\",\n    \"✅ Resource usage looks optimal! Keep up the green practices!\"\n  ],\n  \"sustainability_score\": 100\n}"
    }
  ]
}
```
### Stats and Metrics from Azure APP Services:
<img src="/images/posts/mcp_greenai/azure_mcp_server.png" style="width:2600px;height:500px; border-radius: 15px;box-shadow: 0px 0px 5px 5px #000000;">

```
{
  "contents": [
    {
      "uri": "greenai://info",
      "mimeType": "text/plain",
      "text": "{\n  \"timestamp\": \"2025-08-24T03:38:08.340646\",\n  \"green_ai_practices\": [\n    \"Efficient model selection (prefer smaller models when possible)\",\n    \"Caching and batching to reduce redundant computations\",\n    \"Responsible data handling and privacy protection\",\n    \"Real-time resource monitoring and optimization\",\n    \"Power-aware computing and carbon footprint tracking\",\n    \"Using CPU vs GPU based on efficiency requirements\",\n    \"Implementing timeouts to prevent resource waste\",\n    \"Optimizing for renewable energy usage windows\"\n  ],\n  \"resource_usage\": {\n    \"memory_rss_mb\": 7612.32,\n    \"memory_vms_mb\": 9029.25,\n    \"cpu_percent\": 10.0,\n    \"uptime_seconds\": 590,\n    \"uptime_readable\": \"0h 9m\",\n    \"disk_free_gb\": 28.55,\n    \"process_threads\": 10\n  },\n  \"power_consumption\": {\n    \"cpu_power_watts\": 20.0,\n    \"ram_power_watts\": 22.3,\n    \"base_system_watts\": 20,\n    \"total_estimated_watts\": 62.3,\n    \"power_efficiency_score\": 80\n  },\n  \"carbon_emissions\": {\n    \"energy_consumed_kwh\": 0.01022,\n    \"carbon_emissions_g\": {\n      \"global_average\": 4.855,\n      \"renewable_energy\": 0.511,\n      \"coal_energy\": 9.198\n    },\n    \"carbon_emissions_kg\": {\n      \"global_average\": 0.004855,\n      \"renewable_energy\": 0.000511,\n      \"coal_energy\": 0.009198\n    },\n    \"equivalent_metrics\": {\n      \"tree_seconds_offset\": 0.0,\n      \"km_driven_equivalent\": 0.04,\n      \"smartphone_charges\": 2.0\n    }\n  },\n  \"recommendations\": [\n    \"🧠 High memory usage detected - consider model optimization or quantization\",\n    \"🌍 Consider running compute-intensive tasks during low-carbon grid hours\",\n    \"♻️ Use renewable energy sources when possible\"\n  ],\n  \"sustainability_score\": 80\n}"
    }
  ]
}
```
<img src="/images/posts/mcp_greenai/mcp_inspector.png" style="width:2600px;height:500px; border-radius: 15px;box-shadow: 0px 0px 5px 5px #000000;">

Azure provides a cloud service for viewing and analyzing carbon optimization in emission data. To access it, type "Carbon Optimization" in the search bar.

<img src="/images/posts/mcp_greenai/azure_carbon_emission_dashboard.png" style="width:2600px;height:500px; border-radius: 15px;box-shadow: 0px 0px 5px 5px #000000;">


## Conclusion:

To integrate Green AI practices into your `green-mcp-server.py`, focus on energy efficiency and resource optimization with the following key actions:

1. **Efficient Model Usage**: Choose smaller models when high accuracy isn't critical, and consider model quantization or distillation.
   
   Examples of  Small Language Models (LLMs): 
   These are lighter than GPT-4/5 but still decent for text generation and reasoning.
   -    Mistral 7B – strong performance for its size, open source.
   -   LLaMA 2 7B / 13B – Meta’s models, widely used, good balance of size/quality.
  <br>
<img src="/images/posts/mcp_greenai/Llama-2-7b-chat-hf.png" style="width:600px;height:500px; border-radius: 15px;box-shadow: 0px 0px 5px 5px #000000;">

   -   Gemma (2B, 7B) – Google’s small efficient models.
   -   Phi-3 (3.8B, 7B, 14B) – Microsoft’s “small but mighty” models optimized for reasoning.
   -   GPT-4o Mini – lightweight version of GPT-4o, designed for cheaper, faster inference.

1. **Resource Monitoring**: Log CPU, memory, and API usage. If possible, track energy consumption.
   
2. **Batch Processing**: Reduce API calls by batching requests to external services.
 ```
   import requests

    user_ids = [1, 2, 3]
    response = requests.post(
        "https://api.example.com/users/batch",
        json={"ids": user_ids}   # send multiple IDs in one call
    )

    results = response.json()
    print(results)  # contains all 3 users’ data
    This way, you reduce 3 calls → 1 call.
   ```

1. **Caching**: Store frequent results (e.g., weather data) to minimize redundant computations.

2. **Responsible Data Handling**: Load only necessary parts of large files and limit the retention of large objects in memory.

3. **Transparency**: Set up a `/greenai/info` endpoint to report on energy use and green practices.


While I mentioned the MCP server, implementing these strategies will greatly enhance the sustainability of your AI applications.

Prioritising sustainable practices ensures that your AI initiatives are effective and ethically responsible, contributing to operational excellence and environmental stewardship.
    
Source is available at : https://github.com/uday-bkv/Green-MCP
