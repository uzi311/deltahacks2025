from fastapi import FastAPI
from dotenv import load_dotenv
import dropbox
import asyncio
from dropbox.exceptions import ApiError
import zipfile
import io
import os
import cohere
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

load_dotenv()
ACCESS_TOKEN = os.getenv('COHERE_API')
DROPBOX_TOKEN = os.getenv('DROPBOX_TOKEN')
FOLDER_PATH = '/Apps/Mind Monitor'

# Initialize Dropbox client
dbx = dropbox.Dropbox(DROPBOX_TOKEN)
co = cohere.ClientV2(api_key=ACCESS_TOKEN)


# A place to store the last analysis result (this can be extended to store more if needed)
latest_analysis_result = None

def analyze_file_with_cohere(csv_data):
    """Send CSV data to Cohere for analysis."""
    res = co.chat(
        model="command-r-plus-08-2024",
        messages=[
            {
                "role": "user",
                "content": f"""
Analyzing the EEG waves displayed in the following CSV file recorded over a period of time, 
can you list the probability of each emotion the person wearing the Muse headband was feeling in the dataset? 
The emotions we are using are: anger, sadness, anxiety, joy, embarrassment, calmness. 
Return the list of probabilities in the given order of emotions, ensuring the probabilities follow a realistic normal distribution 
(i.e., the probabilities should sum to 1, representing 100%). 

Ensure the distribution reflects realistic emotional states based on EEG data
The output should look like [x, x, x, x, x, x], where each x is a number representing the probability of its respective emotion 
as a percentage, with all x values summing up to 100%. 

After that, separated by a special character #, can you give a 2 paragraph detailed and accurate summary of the emotions 
the patient was feeling, highlighting dominant emotions and fluctuations in emotional states? 

{csv_data}

Ignore all empty results, have good accuracy but making sure a response is given in a timely manner.
"""

            }
        ],
    )
    return res.message.content[0].text

def get_correct_output(csv_data):
    response = analyze_file_with_cohere(csv_data)
    while response[0] != "[":
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
        await asyncio.sleep(5)

@asynccontextmanager
async def lifespan(app: FastAPI):
    import asyncio
    asyncio.create_task(monitor_dropbox_folder())  # Start monitoring Dropbox folder in the background
    yield

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/latest-analysis")
async def get_latest_analysis():
    """Endpoint for frontend to pull the latest analysis result."""
    if latest_analysis_result:
        return {"analysis_result": latest_analysis_result}
    else:
        return {"message": "No new analysis results available."}




