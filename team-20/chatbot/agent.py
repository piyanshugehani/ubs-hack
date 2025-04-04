import time
from langchain.agents import initialize_agent, Tool
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage
import json
import ast

# from .new_extract import generate_openai,ask_image
import requests
import pymongo
import os
import dotenv
dotenv.load_dotenv()

# Define helper functions to interact with the Flask API

client = pymongo.MongoClient(os.getenv('MONGODB_URI'))
db = client["volunteer_matching_db"]

# Collections
volunteers_col = db["volunteers"]
schools_col = db["schools"]
slots_col = db["slots"]

def get_volunteer_data(volunteer_id: int):
    """Fetch volunteer details and booked sessions."""
    volunteer = volunteers_col.find_one({"volunteer_id": 1})
    if not volunteer:
        return "No volunteer found with the given ID."
    
    slots = list(slots_col.find({"volunteer_id": 1}))
    return {
        "name": volunteer["name"],
        "availability": volunteer["availability"],
        "booked_sessions": [{
            "slot_id": slot["slot_id"],
            "chapter": slot["chapter_data"]["title"],
            "topics": slot["chapter_data"]["topics"],
            "status": slot["assignedOrNot"]
        } for slot in slots]
    }

def get_school_data(school_id: int):
    """Fetch school details and list of available volunteers."""
    school = schools_col.find_one({"school_id": 1})
    if not school:
        return "No school found with the given ID."
    
    available_volunteers = list(volunteers_col.find({"availability": {"$exists": True, "$ne": []}}))
    return {
        "name": school["name"],
        "location": school["location"],
        "requirements": school["requirements"],
        "available_volunteers": [{
            "name": vol["name"],
            "email": vol["email"],
            "skills": vol["skills"],
            "availability": vol["availability"]
        } for vol in available_volunteers]
    }

def get_unassigned_slots_for_school(school_id: int):
    """Fetch unassigned slots for a given school."""
    unassigned_slots = list(slots_col.find({ "assignedOrNot": "unassigned"}))
    if not unassigned_slots:
        return "No unassigned slots found for the given school."
    
    return [
        {
            "slot_id": slot["slot_id"],
            "chapter": slot["chapter_data"]["title"],
            "topics": slot["chapter_data"]["topics"],
            "skills_required": slot["chapter_data"]["required_skills"],
            "language": slot["language"],
        }
        for slot in unassigned_slots
    ]


tools = [

    Tool(
        name="Get_Volunteer_Data",
        func=get_volunteer_data,
        description="Fetches volunteer details and booked sessions. Input: volunteer_id (int)"
    ),
    Tool(
        name="Get_School_Data",
        func=get_school_data,
        description="Fetches school details and list of available volunteers. Input: school_id (int)"
    ),
    Tool(
        name="Get_Unassigned_Slots_for_School",
        func=get_unassigned_slots_for_school,
        description="Fetches unassigned slots for a given school. Input: school_id (int)"
    ),
  
    
]

# Initialize LangChain Agent

def initialize_agent_with_tools():
    """
    Initializes a LangChain agent with tools for the Flask API.
    """
    
    chat_model = ChatOpenAI(model="gpt-4o-mini", temperature=0.3)
    agent = initialize_agent(tools, chat_model, agent="zero-shot-react-description", verbose=True)
    #change prompt in the agent
    # agent.prompt = "Answers the user's query with absolute precision."
    return agent

if __name__ == "__main__":
    
    
    #test tools
    # print(get_volunteer_data(1))
    # print(get_school_data(1))
    print(get_unassigned_slots_for_school(1))
    