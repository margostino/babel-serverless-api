import os
import tomllib

from dotenv import load_dotenv
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.tools import StructuredTool, tool
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

load_dotenv()

config = {}
babel_config = {}
root_config = {}

# MODEL = "gpt-4-0125-preview"
MODEL = "gpt-4"

with open("config.toml", "rb") as f:
    config = tomllib.load(f)
    babel_config = config["babel"]
    root_config = babel_config["root"]
    babel_description_path = f"{config['babel']['root']['path']}/{config['babel']['root']['description_file']}"
    with open(babel_description_path, "r", encoding="utf-8") as f:
        babel_description = f.read()

inbox_description = root_config["inbox"]["description"]
areas_description = root_config["areas"]["description"]
projects_description = root_config["projects"]["description"]
resources_description = root_config["resources"]["description"]
archive_description = root_config["archive"]["description"]

topic_classifier_prompt = PromptTemplate.from_template(
    f"""
    You are a smart topic classifier. Your job is to classify the input into a category. 
    You should use each category description to help you classify the input.
    The categories are:
    - Inbox: {inbox_description}
    - Areas: {areas_description}
    - Projects: {projects_description}
    - Resources: {resources_description}
    - Archive: {archive_description}
    
    Output format:
    A given input can belong to multiple categories.
    You should return only the category or categories separated by comma.

    Example input: "What's the plan for today?"
    Example output: "Inbox"

    Example input: "What's in my To Do list today?"
    Example output: "Inbox"

    Example input: "Tell me my most recent ideas."
    Example output: "Inbox"

    Example input: "How should I prepare a Job interview?"
    Example output: "Areas"

    Example input: "Tell me about the status of my trip to NY."
    Example output: "Projects"

    Example input: "How should I clone a Git repository?"
    Example output: "Resources"

    Example input: "Tell me about some inspirational websites."
    Example output: "Resources"

    Example input: "How should I perform a JVM profiling?"
    Example output: "Resources"

    Example input: "How do access to the bash session of a docker container?"
    Example output: "Resources"

    Example input: "Is there anything in the vault about old good memories"
    Example output: "Archive"
    
    Input: {input}
    Output:

    """
)

topic_classifier_llm_chain = LLMChain(
    llm=ChatOpenAI(model=MODEL), prompt=topic_classifier_prompt
)

topic_classifier_tool = StructuredTool.from_function(
    func=topic_classifier_llm_chain.run,
    name="TopicClassifier",
    description="useful tool to classify input topics",
)


class BabelCategory(BaseModel):
    input_category: str = Field(
        description="should be a Babal category: Inbox, Areas, Projects, Resources, Archive"
    )


@tool("get_babel_info", args_schema=BabelCategory)
def get_babel_info(input_category: str) -> str:
    """
    Get Babel information for a given category.
    """
    category_folder = root_config[input_category.lower()]["name"].upper()
    category_files_path = f"{root_config['path']}/{category_folder}"

    all_content = ""
    for subdir, dirs, files in os.walk(category_files_path):
        for file in files:
            filepath = os.path.join(subdir, file)
            try:
                file_path_metadata = filepath.replace(root_config["path"], "")
                with open(filepath, "r", encoding="utf-8") as f:
                    all_content += (
                        f"File: {file_path_metadata}\nContent: {f.read()}\n\n"
                    )
            except Exception as e:
                print(f"Error reading {filepath}: {e}")

    return all_content


assistant_prompt = PromptTemplate.from_template(
    """
    Role: You are a smart personal assistant. Your job is to assist me with my questions and decisions. 
    You can use my knowledge database called Babel, which is a collection of my notes, ideas, and resources stored in my local filesystem.
    
    For a given input, you should follow these steps:
    1- Classify the input into one or more categories (inbox, areas, projects, resources, archive). You should explain why you classified the input into each category.
    2- For each categories, you should fetch the Babel information of each.
    3- You should analyse the fethed information, think about it and give your best answer. You should format the output in a way that is easy to understand. If you do not have enough information, you should answer "there is not enough information".
    
    Question: {input}
    Thought:{agent_scratchpad}    
    """
)
llm = ChatOpenAI(model=MODEL, temperature=0)
tools = [topic_classifier_tool, get_babel_info]
agent = create_openai_tools_agent(llm, tools, prompt=assistant_prompt)
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,
    max_iterations=100,
    max_execution_time=300,
    return_intermediate_steps=True,
    handle_parsing_errors=True,
)

# input = "What is the Babel?"
# input = "what i have in my quick notes?"
# input = "Do i have any plan for tomorrow?"
# input = "tell me about my new recent ideas"
# input = "tell me about my quick notes?"
# input = "What's the plan for today?"
input = "Suggest me what to do today based on my To-Do list. Only one thing and tell me why."
response = agent_executor.invoke(
    {"input": input, "chat_history": []},
    config={"callbacks": []},
)
print(response["output"])
