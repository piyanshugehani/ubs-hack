"""
Install an additional SDK for JSON schema support Google AI Python SDK

$ pip install google.ai.generativelanguage
"""

import os
import google.generativeai as genai
from google.ai.generativelanguage_v1beta.types import content
import dotenv
from dotenv import load_dotenv

genai.configure(api_key=os.environ["GEMINI_API_KEY"])
def create_mcq_questions(transcript):
    """
    Create MCQ questions from the transcript using Google Gemini API.
    """
    # Set the API key for Google Gemini
 
    generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_schema": content.Schema(
        type = content.Type.OBJECT,
        required = ["questions"],
        properties = {
        "questions": content.Schema(
            type = content.Type.ARRAY,
            items = content.Schema(
            type = content.Type.OBJECT,
            required = ["qNo", "question", "correctanswer", "options"],
            properties = {
                "qNo": content.Schema(
                type = content.Type.NUMBER,
                ),
                "question": content.Schema(
                type = content.Type.STRING,
                ),
                "correctanswer": content.Schema(
                type = content.Type.NUMBER,
                ),
                "options": content.Schema(
                type = content.Type.OBJECT,
                required = ["option1", "option2", "option3", "option4"],
                properties = {
                    "option1": content.Schema(
                    type = content.Type.STRING,
                    ),
                    "option2": content.Schema(
                    type = content.Type.STRING,
                    ),
                    "option3": content.Schema(
                    type = content.Type.STRING,
                    ),
                    "option4": content.Schema(
                    type = content.Type.STRING,
                    ),
                },
                ),
            },
            ),
        ),
        },
    ),
    "response_mime_type": "application/json",
    }

    model = genai.GenerativeModel(
    model_name="gemini-1.5-pro",
    generation_config=generation_config,
    system_instruction="Create MCQ questions for the student based on the transcript given in the lecture.",
    )

    chat_session = model.start_chat(
    history=[
    ]
    )

    response = chat_session.send_message(transcript)

    return response.text


def update_quiz_in_mongo(quiz_data):
    """
    Update the quiz in MongoDB.
    """
    # Assuming you have a MongoDB client and database set up
    from pymongo import MongoClient

    client = MongoClient(os.getenv["MONGO_URI"])
    db = client.get_database("your_database_name")
    quizzes_collection = db.get_collection("quizzes")

    # Update the quiz in the collection
    quizzes_collection.update_one(
        {"quiz_id": quiz_data["quiz_id"]},
        {"$set": quiz_data}
    )
    
    
    
def get_transcript_from_mongo(session_id):
    """
    Get the transcript from MongoDB based on session ID.
    """
    # Assuming you have a MongoDB client and database set up
    from pymongo import MongoClient

    client = MongoClient(os.getenv["MONGO_URI"])
    db = client.get_database("transcripts_db")
    transcripts_collection = db.get_collection("transcripts")

    # Get the transcript from the collection
    transcript = transcripts_collection.find_one({"session_id": session_id})

    return transcript["transcript"] if transcript else None



