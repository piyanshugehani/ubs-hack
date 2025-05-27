import os
from flask import Flask, request, jsonify
import pymongo
import google.generativeai as genai
from dotenv import load_dotenv
import json
from app import recommend_slots
from app import recommend_volunteers_to_school
from google.ai.generativelanguage_v1beta.types import content

# Load environment variables
load_dotenv()

# Initialize Flask App
app = Flask(__name__)

# Set up Gemini API (load from env or fallback to provided key)
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

# Connect to MongoDB
client = pymongo.MongoClient(os.getenv('MONGODB_URI', "mongodb://localhost:27017"))
db = client["volunteer_matching_db"]

# Collections
volunteers_col = db["volunteers"]
schools_col = db["schools"]
slots_col = db["slots"]

def get_volunteer_data(volunteer_id: int):
    """Fetch volunteer details and booked sessions."""
    volunteer = volunteers_col.find_one({"volunteer_id": volunteer_id})
    if not volunteer:
        return "No volunteer found with the given ID."
    
    slots = list(slots_col.find({"volunteer_id": volunteer_id}))
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
    school = schools_col.find_one({"school_id": school_id})
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
    unassigned_slots = list(slots_col.find({"school_id": school_id, "assignedOrNot": False}))
    if not unassigned_slots:
        return "No unassigned slots found for the given school."
    
    return [
        {
            "slot_id": slot["slot_id"],
            "chapter": slot["chapter_data"]["title"],
            "topics": slot["chapter_data"]["topics"],
            "time": slot["time"]
        }
        for slot in unassigned_slots
    ]

def process_natural_language_query(query: str, user_context=None):
    """Process natural language query to determine intent and extract parameters."""
    # Updated system prompt with allowed actions
    system_prompt = """
You are an assistant helping to interpret queries for a volunteer-school matching system.
Extract the following information from the user's query:
1. Is the user a volunteer or a school representative?
2. What is the user ID (if mentioned)?
3. What is the specific action or information they're looking for?

For volunteers, allowed actions are:
    "get_info" (for general inquiries) or "recommend_slots" (for slot recommendations).

For schools, allowed actions are:
    "get_info", "get_unassigned_slots", or "recommend_volunteers".

Return ONLY a JSON object (without any additional explanation) that follows this format exactly:
{
    "user_type": "volunteer|school|unknown",
    "user_id": <integer or null>,
    "intent": "<brief description of what they want>",
    "action": "<one of the allowed actions>"
}
"""

    # Include user context if available
    context_info = ""
    if user_context:
        context_info = f"User context: {user_context}"
        print("User context received:", user_context)
    
    prompt_text = f"{system_prompt}\n\nUser query: {query}\n{context_info}"
    
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content([{"role": "user", "parts": [prompt_text]}])
    
    print("Raw response from Gemini:", response.text)
    
    raw_text = response.text.strip()
    print("Raw response text after stripping:", raw_text)
    
    if raw_text.startswith("```") and raw_text.endswith("```"):
        raw_text = raw_text.strip("```").strip()
    print("Sanitized response text:", raw_text)
    if raw_text.lower().startswith("json"):
        raw_text = raw_text[4:].strip()
        print("Sanitized response text after removing 'json':", raw_text)
    
    if raw_text.startswith("```") and raw_text.endswith("```"):
        raw_text = raw_text.strip("```").strip()
    print("Final sanitized response text:", raw_text)
    
    try:
        intent_data = json.loads(raw_text)
        print("Parsed intent data:", intent_data)
        # Post-process: If a volunteer receives an action not allowed, adjust it.
        if intent_data["user_type"] == "volunteer" and intent_data["action"] == "get_unassigned_slots":
            print("Overriding action for volunteer from get_unassigned_slots to get_info.")
            intent_data["action"] = "get_info"
        if user_context and "user_id" in user_context and not intent_data.get("user_id"):
            intent_data["user_id"] = user_context["user_id"]
        print("Final intent data:", intent_data)
        return intent_data
    except Exception as e:
        print(f"Error parsing intent data: {e}")
        return {
            "user_type": "unknown",
            "user_id": user_context.get("user_id") if user_context else None,
            "intent": "unclear",
            "action": "other"
        }

def handle_action(intent_data, query: str):
    """Handle the specific action based on intent analysis."""
    user_type = intent_data.get("user_type", "unknown")
    user_id = intent_data.get("user_id")
    action = intent_data.get("action", "get_info")
    
    if user_type == "volunteer" and user_id:
        if action == "get_info":
            context_data = get_volunteer_data(user_id)
        elif action == "recommend_slots":
            context_data = recommend_slots(user_id)
        else:
            return f"Action '{action}' is not supported for volunteers."
    
    elif user_type == "school" and user_id:
        if action == "get_info":
            context_data = get_school_data(user_id)
        elif action == "get_unassigned_slots":
            context_data = get_unassigned_slots_for_school(user_id)
        elif action == "recommend_volunteers":
            context_data = recommend_volunteers_to_school(user_id)
        else:
            return f"Action '{action}' is not supported for schools."
    else:
        context_data = None
    
    print("Retrieved context data:", context_data)
    
    if not context_data or isinstance(context_data, str):
        return (
            f"Could not retrieve details for user_type: {user_type} and user_id: {user_id}.\n"
            "Please ensure you have registered and provided the correct ID."
        )
    
    formatted_context = f"User Type: {user_type}\nUser ID: {user_id}\nContext Data:\n{context_data}"
    
    prompt = f"""
You are a chatbot assisting in a volunteer-school matching program.

Here is the context data retrieved from the database:
{formatted_context}

The user has asked the following query:
"{query}"

Detected intent: {intent_data.get('intent')}
Action to take: {action}

Based on the context data and the query, provide a detailed and helpful response.
If the context data contains the required information, use it to answer the query.
If the context data is insufficient, ask clarifying questions or explain what is missing.
"""
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(prompt)
    return response.text

# Flask Routes
@app.route("/chat", methods=["POST"])
def handle_chat():
    """API endpoint to handle natural language queries."""
    data = request.json
    query = data.get("query")
    user_context = data.get("user_context", {})
    
    if not query:
        return jsonify({"error": "query is required"}), 400
    
    intent_data = process_natural_language_query(query, user_context)
    response_text = handle_action(intent_data, query)
    
    return jsonify({
        "response": response_text,
        "processed_intent": intent_data
    })

def generate_report_md(volunteerData):
    """Generates a structured volunteer report in Markdown format using Gemini AI."""
    try:
        # Define response schema for Volunteer Report
        generation_config = {
            "temperature": 0.1,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 8192,
            "response_mime_type": "application/json",
        }

        # Initialize the Gemini model
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config=generation_config,
            system_instruction="""Generate a structured volunteer report in Markdown format. 
            The report should include:
            - Volunteer Profile (Name, Email, Phone, Skills, Languages, Preferences)
            - Volunteer Metrics (Hours Taught, Rating, Student Retention, Gamification Points)
            - Availability (Days and Time Slots)
            - A conclusion summarizing the volunteer’s impact and future contributions.

            Ensure the report is detailed and includes all the provided data. Format the response as a complete Markdown document.""",
        )

        # Start a chat session
        chat_session = model.start_chat(history=[])

        # Format the volunteer data into a structured message
        formatted_message = {"role": "user", "parts": [{"text": str(volunteerData)}]}

        # Generate AI response
        response = chat_session.send_message(formatted_message["parts"])

        # Log the raw response
        print("Raw response from Gemini:", response.text)

        # Return the response text
        return response.text
    
    except Exception as e:
        return str(e)

@app.route("/generate_report", methods=["POST"])
def generate_report():
    """API endpoint to generate a volunteer report."""
    try:
        # Get JSON input
        data = request.json

        # Validate input
        if not data or "volunteerData" not in data:
            return jsonify({"error": "Missing volunteerData in request"}), 400

        # Generate report
        report_md = generate_report_md(data["volunteerData"])

        return jsonify({"report": report_md}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
