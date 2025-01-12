from fastapi import FastAPI
from dotenv import load_dotenv
import dropbox
import time
from dropbox.exceptions import ApiError
import zipfile
import io
import os
import cohere

load_dotenv()
ACCESS_TOKEN = os.getenv('COHERE_API')
DROPBOX_TOKEN = os.getenv('DROPBOX_TOKEN')
FOLDER_PATH = '/Apps/Mind Monitor'

# Initialize Dropbox client
dbx = dropbox.Dropbox(DROPBOX_TOKEN)
co = cohere.ClientV2(api_key=ACCESS_TOKEN)

app = FastAPI()

# A place to store the last analysis result (this can be extended to store more if needed)
latest_analysis_result = None

def analyze_file_with_cohere(csv_data):
    """Send CSV data to Cohere for analysis."""
    res = co.chat(
        model="command-r-plus-08-2024",
        messages=[
            {
                "role": "user",
                "content": f"Analyzing the EEG waves displayed in the following CSV file recorded over a period of time, can you rank the top 3 most likely emotions the person wearing the Muse headband was feeling in descending order of accuracy? The emotions we are using are: anger, sadness, anxiety, joy, embarrassment, relaxation. {csv_data}",
            }
        ],
    )
    return res.message.content[0].text

def get_correct_output(csv_data):
    response = analyze_file_with_cohere(csv_data)
    return response

def list_files_in_folder():
    """List files in Dropbox folder."""
    try:
        files = []
        result = dbx.files_list_folder(FOLDER_PATH)
        files.extend(result.entries)

        while result.has_more:
            result = dbx.files_list_folder_continue(result.cursor)
            files.extend(result.entries)

        # Sort files by "client_modified" timestamp
        files = sorted(files, key=lambda file: file.client_modified, reverse=True)
        return files
    except ApiError as e:
        print(f"Error listing folder contents: {e}")
        return []

def download_file(file_path):
    """Download a file from Dropbox."""
    try:
        _, file_content = dbx.files_download(file_path)
        return file_content.content
    except ApiError as e:
        print(f"Error downloading file {file_path}: {e}")
        return None

def unzip_file(zip_data):
    """Unzip the file data and return CSV content."""
    with zipfile.ZipFile(io.BytesIO(zip_data), 'r') as zip_ref:
        csv_filename = zip_ref.namelist()[0]
        with zip_ref.open(csv_filename) as csv_file:
            return csv_file.read().decode('utf-8')

async def monitor_dropbox_folder():
    """Monitor Dropbox for new files and update analysis result."""
    global latest_analysis_result
    previous_file_count = 0

    while True:
        files = list_files_in_folder()

        if files:
            current_file_count = len(files)
            if current_file_count > previous_file_count:
                latest_file = files[0]  # Most recent file
                print(f"Processing new file: {latest_file.name}")

                zip_data = download_file(latest_file.path_display)
                if zip_data:
                    csv_data = unzip_file(zip_data)
                    latest_analysis_result = get_correct_output(csv_data)  # Store the result

                    print(f"Analysis result: {latest_analysis_result}")

                previous_file_count = current_file_count

        # Wait before checking again
        time.sleep(10)

@app.get("/latest-analysis")
async def get_latest_analysis():
    """Endpoint for frontend to pull the latest analysis result."""
    if latest_analysis_result:
        return {"analysis_result": latest_analysis_result}
    else:
        return {"message": "No new analysis results available."}

@app.on_event("startup")
async def start_monitoring():
    import asyncio
    asyncio.create_task(monitor_dropbox_folder())  # Start monitoring Dropbox folder in the background
