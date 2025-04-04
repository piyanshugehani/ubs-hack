from pymongo import MongoClient
import os
from bson import ObjectId
from datetime import datetime
import google.generativeai as genai
# from google.generativeai import content
import dotenv
from dotenv import load_dotenv
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


database_url = os.getenv("MONGODB_URI")
client = MongoClient(database_url)
db = client["test"]
volunteers_col = db["volunteers"]
slots_col = db["slots"]

def generate_volunteer_report(volunteer_data):
    """
    Generates a professional markdown report for a volunteer based on their data.
    
    Args:
        volunteer_data (dict): Dictionary containing volunteer information
    
    Returns:
        str: Formatted markdown report
    """
    # Extract data from the volunteer dictionary
    name = volunteer_data.get("name", "Not Available")
    email = volunteer_data.get("email", "Not Available")
    phone = volunteer_data.get("phone", "Not Available")
    volunteer_id = volunteer_data.get("volunteer_id", "Not Available")
    
    skills_count = len(volunteer_data.get("skills", []))
    languages_count = len(volunteer_data.get("languages", []))
    locations_count = len(volunteer_data.get("locations", []))
    
    hours_taught = volunteer_data.get("hours_taught", 0)
    rating = volunteer_data.get("rating", 0)
    student_retention = volunteer_data.get("student_retention", 0)
    gamification_points = volunteer_data.get("gamification_points", 0)
    
    availability = volunteer_data.get("availability", "Not Available")
    max_hours_per_week = volunteer_data.get("max_hours_per_week", "Not Available")
    available = volunteer_data.get("available", "Not Available")
    location_type_preference = volunteer_data.get("location_type_preference", "Not Available")
    
    created_at = volunteer_data.get("createdAt", "Not Available")
    updated_at = volunteer_data.get("updatedAt", "Not Available")
    
    # Format dates if they are datetime objects
    if isinstance(created_at, datetime):
        created_at = created_at.strftime("%B %d, %Y")
    if isinstance(updated_at, datetime):
        updated_at = updated_at.strftime("%B %d, %Y")
    
    # Generate current date for report
    current_date = datetime.now().strftime("%B %d, %Y")
    
    # Build the markdown report
    report = f"""# Volunteer Performance Report

## Executive Summary

**{name}** has been an active volunteer since {created_at.split('T')[0] if isinstance(created_at, str) else created_at}, maintaining an exceptional performance rating of **{rating}/5.0** with {hours_taught} hours of teaching completed. With a student retention rate of {student_retention}%, {name.split()[0]} demonstrates outstanding engagement capabilities and commitment to educational excellence.

## Volunteer Profile

**Contact Information**
| Detail | Value |
|--------|-------|
| Name | {name} |
| Email | {email} |
| Phone | {phone} |
| ID | {volunteer_id} |

**Qualifications**
- **Skills**: {skills_count} verified skills in teaching database
- **Languages**: Proficient in {languages_count} languages
- **Service Locations**: Available in {locations_count} registered locations

## Performance Metrics

**Key Indicators**
| Metric | Value | Industry Benchmark |
|--------|-------|-------------------|
| Hours Taught | {hours_taught} | 100 |
| Rating | {rating}/5.0 | 4.2/5.0 |
| Student Retention | {student_retention}% | 85% |
| Gamification Points | {gamification_points} | 400 |

## Availability & Preferences

**Schedule Details**
- **Availability Pattern**: {availability}
- **Maximum Commitment**: {max_hours_per_week} hours per week
- **Current Status**: {"Available for assignment" if available == "yes" else "Not available"}
- **Preferred Mode**: {location_type_preference.capitalize()} teaching

## Account Timeline

- **Onboarding Date**: {created_at.split('T')[0] if isinstance(created_at, str) else created_at}
- **Last Profile Update**: {updated_at.split('T')[0] if isinstance(updated_at, str) else updated_at}
- **Account Status**: Active volunteer

## Recommendations

Based on {name.split()[0]}'s exceptional performance metrics and consistent availability, we recommend:

1. Consider for specialized advanced courses
2. Potential mentor role for new volunteers
3. Eligible for quarterly performance recognition

---

*This report was automatically generated on {current_date}*
"""
    
    return report


# Usage example:
def generate_report_md(volunteerId):
    """Generates a structured volunteer report in Markdown format."""
    try:
        # Fetch volunteer data from MongoDB
        volunteerData = volunteers_col.find_one({"volunteer_id": volunteerId})
        if not volunteerData:
            return "No volunteer found with the given ID."
        
        # Generate the markdown report using our template function
        report = generate_volunteer_report(volunteerData)
        
        return report
    
    except Exception as e:
        return str(e)
