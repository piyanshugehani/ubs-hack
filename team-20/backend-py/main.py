from flask import Flask, request, jsonify
import os
import re
from flask_cors import CORS
import google.generativeai as genai
import json
import fitz  # PyMuPDF for PDF processing
import tempfile
from PIL import Image
import easyocr  # Adding EasyOCR for text extraction
import cloudinary
import cloudinary.uploader
import cloudinary.api
from datetime import datetime

# Initialize Flask app
app = Flask(__name__)
CORS(app)

reader = easyocr.Reader(['en'])

# API keys configuration
GEMINI_API_KEY = "AIzaSyCKbDmj-zI4USoHyuewqugW4h0y71J8epY"
genai.configure(api_key=GEMINI_API_KEY)

# Configure Cloudinary
cloudinary.config( 
  cloud_name = "dwkhritln", 
  api_key = "771497445827423", 
  api_secret = "3F37iia2cNByx3sLxiYcso5Fit8" 
)


def upload_to_cloudinary(file_path, folder="syllabi"):
    """
    Upload file to Cloudinary and return the URL
    """
    try:
        # Extract original file name without extension
        base_name = os.path.splitext(os.path.basename(file_path))[0]
        
        # Generate a unique public_id using original filename and timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        public_id = f"{folder}/{timestamp}_{base_name}"
        
        # Upload the file with specific options
        upload_result = cloudinary.uploader.upload(
            file_path,
            resource_type="raw",  # Changed from "auto" to "raw" for PDFs
            public_id=public_id,
            overwrite=True,
            format="pdf"  # Explicitly specify PDF format
        )
        
        # Return the secure URL
        return upload_result.get('secure_url')
    except Exception as e:
        print(f"Error uploading to Cloudinary: {str(e)}")
        return None

def extract_text_from_pdf_with_ocr(pdf_path):
    """
    Extract text from a PDF document using both PyMuPDF and EasyOCR.
    PyMuPDF extracts machine-readable text, while EasyOCR helps with scanned content.
    """
    # First try PyMuPDF for text extraction (faster for machine-readable PDFs)
    pymupdf_text = extract_text_from_pdf(pdf_path)
    
    # Generate images for EasyOCR processing
    image_paths = convert_pdf_to_images(pdf_path)
    ocr_text = ""
    
    # Use EasyOCR on each page image
    for img_path in image_paths:
        try:
            results = reader.readtext(img_path)
            page_text = " ".join([text for (bbox, text, prob) in results])
            ocr_text += page_text + "\n\n"
        except Exception as e:
            print(f"Error processing image with EasyOCR: {str(e)}")
    
    # Clean up temporary image files
    for img_path in image_paths:
        try:
            os.remove(img_path)
        except:
            pass
    
    # Combine texts, prioritizing PyMuPDF if it found substantial content
    if len(pymupdf_text) > 100:  # If PyMuPDF found reasonable content
        combined_text = pymupdf_text
        # Append OCR text if it adds significant content
        if len(ocr_text) > 100 and ocr_text != pymupdf_text:
            combined_text += "\n\nOCR Additional Text:\n" + ocr_text
    else:
        # If PyMuPDF found little text, use OCR text
        combined_text = ocr_text
    
    return combined_text

def extract_text_from_pdf(pdf_path):
    """
    Extract text from a PDF document using PyMuPDF.
    """
    text = ""
    try:
        # Open the PDF
        doc = fitz.open(pdf_path)
        
        # Extract text from each page
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text += page.get_text()
        
        doc.close()
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {str(e)}")
        return ""

def convert_pdf_to_images(pdf_path):
    """
    Convert the first few pages of a PDF to images for Gemini to process.
    Returns a list of image file paths.
    """
    image_paths = []
    try:
        doc = fitz.open(pdf_path)
        
        # Process up to first 3 pages (Gemini has input limitations)
        max_pages = min(3, len(doc))
        
        for page_num in range(max_pages):
            page = doc.load_page(page_num)
            
            # Render page to an image (higher resolution for better OCR)
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
            
            # Save the image to a temporary file
            temp_img_path = tempfile.mktemp(suffix=".png")
            pix.save(temp_img_path)
            
            image_paths.append(temp_img_path)
        
        doc.close()
        return image_paths
    except Exception as e:
        print(f"Error converting PDF to images: {str(e)}")
        return []

def enhance_syllabus_data(model, data, context_text):
    """
    Enhance syllabus data by filling missing fields using Gemini
    """
    try:
        # Enhance top-level description if missing
        if not data.get("description"):
            description_prompt = f"""
            Generate a concise course description (2-3 sentences) based on this context:
            Course: {data.get('title', 'Unknown Course')}
            Grade: {data.get('grade', 'Unknown Grade')}
            Context: {context_text[:1000]}
            Focus on the overall course objectives and importance.
            """
            response = model.generate_content(description_prompt)
            data["description"] = response.text.strip()

        # Enhance subjects
        for subject in data.get("subjects", []):
            if not subject.get("description"):
                subject_prompt = f"""
                Generate a concise subject description (2-3 sentences) for:
                Subject: {subject.get('title', 'Unknown Subject')}
                Course: {data.get('title', 'Unknown Course')}
                Context: {context_text[:1000]}
                Focus on the subject's key learning outcomes.
                """
                response = model.generate_content(subject_prompt)
                subject["description"] = response.text.strip()

            # Enhance chapters
            for chapter in subject.get("chapters", []):
                # Fill missing description
                if not chapter.get("description"):
                    chapter_prompt = f"""
                    Generate a concise chapter description (2-3 sentences) for:
                    Chapter: {chapter.get('title', 'Unknown Chapter')}
                    Subject: {subject.get('title', 'Unknown Subject')}
                    Context: {context_text[:1000]}
                    Focus on specific topics and learning objectives.
                    """
                    response = model.generate_content(chapter_prompt)
                    chapter["description"] = response.text.strip()

                # Fill missing required_skills if empty
                if not chapter.get("required_skills"):
                    skills_prompt = f"""
                    List 3-4 key required skills for:
                    Chapter: {chapter.get('title', 'Unknown Chapter')}
                    Subject: {subject.get('title', 'Unknown Subject')}
                    Return as JSON array of strings.
                    """
                    response = model.generate_content(skills_prompt)
                    try:
                        skills = json.loads(response.text)
                        chapter["required_skills"] = {"skills": skills}
                    except:
                        chapter["required_skills"] = {"skills": []}

                # Estimate numberOfHours if missing
                if not chapter.get("numberOfHours"):
                    hours_prompt = f"""
                    Estimate the number of teaching hours needed for:
                    Chapter: {chapter.get('title', 'Unknown Chapter')}
                    Subject: {subject.get('title', 'Unknown Subject')}
                    Return only a number between 1 and 20.
                    """
                    response = model.generate_content(hours_prompt)
                    try:
                        hours = int(response.text.strip())
                        chapter["numberOfHours"] = min(max(hours, 1), 20)
                    except:
                        chapter["numberOfHours"] = 5  # default value

        return data

    except Exception as e:
        print(f"Error enhancing syllabus data: {str(e)}")
        return data

def get_structured_syllabus_from_pdf(pdf_path, extracted_text):
    """
    Use Gemini API to extract and enhance structured syllabus information
    """
    try:
        # Update model to use newer version
        model = genai.GenerativeModel('gemini-2.0-flash-lite') 
        
        # Convert first pages of PDF to images
        image_paths = convert_pdf_to_images(pdf_path)
        if not image_paths:
            # If image conversion failed, use text-only model
            return get_text_only_structured_syllabus(model, extracted_text)
        
        # Load images for Gemini
        images = [Image.open(img_path) for img_path in image_paths]
        
        # Define the structured output format for Gemini
        structured_format = {
            "school_id": None,
            "title": None,  # Main course name
            "description": None,  # Course description
            "grade": None,  # Year or semester
            "subjects": [{
                "title": "Module/Unit Name",
                "description": "Module description with duration",
                "chapters": [{
                    "title": "Topic Name",
                    "description": "Detailed topic description",
                    "year": "2024",
                    "required_skills": {
                        "skills": [
                            "Prerequisite knowledge",
                            "Required background",
                            "Basic concepts needed"
                        ]
                    },
                    "weightage": 25,
                    "assignedOrNot": "unassigned",
                    "session_daterange": {
                        "start": None,
                        "end": None
                    },
                    "numberOfHours": None
                }]
            }]
        }
        
        # Create the prompt for Gemini
        prompt = f"""
        Extract structured syllabus information from this course document.
        
        PDF Text: {extracted_text[:10000]}
        
        Create a JSON response following these guidelines:
        1. Title: Main course name
        2. Subjects: Main modules/units of the course
        3. Chapters: Individual topics within each module
        4. Include teaching hours, credits, and examination scheme if available
        
        Important elements to identify:
        1. Course name and code
        2. Course objectives and outcomes
        3. Module/Unit names with their allocated hours
        4. Detailed topics under each module
        5. Teaching scheme and examination pattern
        6. Prerequisites for each module/topic
        
        Use this format strictly:
        {json.dumps(structured_format, indent=2)}
        
        Ensure each module and topic has:
        - Clear description of content
        - Learning objectives
        - Required prerequisites
        - Estimated teaching hours
        
        Return ONLY valid JSON without explanations.
        """
        
        # Get response from Gemini using both text and images
        response = model.generate_content([prompt] + images)
        
        # Clean up temporary image files
        for img_path in image_paths:
            try:
                os.remove(img_path)
            except:
                pass
        
        # Process response
        response_text = response.text
        
        # Find JSON in response (in case Gemini adds explanatory text)
        json_match = re.search(r'```json\s*([\s\S]*?)\s*```', response_text)
        if json_match:
            json_str = json_match.group(1)
        else:
            json_str = response_text
        
        # Try to clean and parse JSON
        json_str = json_str.strip().replace('\n', ' ')
        structured_data = json.loads(json_str)

        # After getting initial structured_data, enhance it
        enhanced_data = enhance_syllabus_data(model, structured_data, extracted_text)
        
        return enhanced_data
        
    except Exception as e:
        print(f"Gemini API error: {str(e)}")
        return extract_syllabus_details(extracted_text)

def get_text_only_structured_syllabus(model, extracted_text):
    """
    Use text-only Gemini model when image processing fails.
    """
    structured_format = {
        "school_id": "string or null",
        "title": "string or null",
        "description": "string or null",
        "grade": "string or null",
        "subjects": [{
            "title": "string",
            "description": "string or null",
            "chapters": [{
                "title": "string",
                "description": "string or null",
                "year": "string or null",
                "required_skills": "object or null",
                "weightage": "number or null",
                "assignedOrNot": "string (assigned/unassigned)",
                "session_daterange": "object or null",
                "numberOfHours": "number or null"
            }]
        }]
    }
    
    prompt = f"""
    Extract the structured syllabus information from this PDF text.
    
    PDF Text: {extracted_text[:15000]}
    
    Analyze the syllabus content and create a structured JSON response with the following format:
    {json.dumps(structured_format, indent=2)}
    
    Focus on extracting:
    1. Course title/name
    2. Course description
    3. Grade level
    4. Subject areas
    5. Chapters or units within each subject
    6. Any additional metadata available
    
    Return ONLY valid JSON without any explanations.
    """
    
    response = model.generate_content(prompt)
    response_text = response.text
    
    # Find JSON in response
    json_match = re.search(r'```json\s*([\s\S]*?)\s*```', response_text)
    if (json_match):
        json_str = json_match.group(1)
    else:
        json_str = response_text
    
    try:
        # Clean and parse JSON
        json_str = json_str.strip().replace('\n', ' ')
        structured_data = json.loads(json_str)
        return structured_data
    except:
        # Fallback to regex extraction
        return extract_syllabus_details(extracted_text)

def extract_syllabus_details(text):
    """
    Fallback function to parse extracted text and return structured syllabus details.
    """
    syllabus_data = {
        "school_id": None,
        "title": None,
        "description": None,
        "grade": None,
        "subjects": []
    }
    
    # Extract course name
    title_match = re.search(r'Course Name\s*:\s*(.+)', text)
    if title_match:
        syllabus_data["title"] = title_match.group(1).strip()
    
    # Extract course code
    code_match = re.search(r'Course Code\s*:\s*(\w+)', text)
    if code_match:
        syllabus_data["description"] = f"Course Code: {code_match.group(1)}"
    
    # Extract grade (assuming it is mentioned as something like 'Grade X' or 'Year Y')
    grade_match = re.search(r'(Grade|Year)\s*(\d+)', text)
    if grade_match:
        syllabus_data["grade"] = f"{grade_match.group(1)} {grade_match.group(2)}"
    
    # Extract subjects and chapters
    subjects = re.split(r'\d+\.\d+\s+', text)  # Splitting based on numbered topics
    for subject in subjects:
        if "Topics" in subject:  # Ensure it's a subject entry
            subject_data = {
                "title": subject.split("Topics")[-1].strip(),
                "description": None,
                "chapters": []
            }
            
            # Extract chapters
            chapters = re.findall(r'(\d+\.\d+)\s+([A-Za-z0-9 ,\-()]+)', subject)
            for chap in chapters:
                chapter_data = {
                    "title": chap[1].strip(),
                    "description": None,
                    "year": None,
                    "required_skills": {},
                    "weightage": None,
                    "assignedOrNot": "unassigned",
                    "session_daterange": {},
                    "numberOfHours": None
                }
                subject_data["chapters"].append(chapter_data)
            
            syllabus_data["subjects"].append(subject_data)
    
    return syllabus_data

@app.route('/extract_syllabus', methods=['POST'])
def extract_syllabus():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save the file temporarily
    temp_pdf_path = tempfile.mktemp(suffix=".pdf")
    file.save(temp_pdf_path)

    try:
        # Upload to Cloudinary
        cloudinary_url = upload_to_cloudinary(temp_pdf_path)
        
        # Extract text from PDF using combined approach with OCR
        extracted_text = extract_text_from_pdf_with_ocr(temp_pdf_path)

        if not extracted_text:
            return jsonify({"error": "Failed to extract text from PDF"}), 500

        # Use Gemini to parse syllabus details
        syllabus_details = get_structured_syllabus_from_pdf(temp_pdf_path, extracted_text)
        
        # Add the Cloudinary URL to the response
        if cloudinary_url:
            syllabus_details["file_url"] = cloudinary_url

        return jsonify(syllabus_details), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred during extraction: {str(e)}"}), 500

    finally:
        # Cleanup temporary file
        try:
            os.remove(temp_pdf_path)
        except:
            pass

if __name__ == '__main__':
    app.run(debug=True, port=5000)