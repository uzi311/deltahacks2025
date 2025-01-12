import pandas as pd
import json

# Load the data
file_path = 'mind.csv'  # Path to your CSV file
data = pd.read_csv(file_path)

# Extract relevant columns and calculate relative values
columns = ['Delta_TP9', 'Delta_AF7', 'Delta_AF8', 'Delta_TP10', 
           'Theta_TP9', 'Theta_AF7', 'Theta_AF8', 'Theta_TP10',
           'Alpha_TP9', 'Alpha_AF7', 'Alpha_AF8', 'Alpha_TP10',
           'Beta_TP9', 'Beta_AF7', 'Beta_AF8', 'Beta_TP10',
           'Gamma_TP9', 'Gamma_AF7', 'Gamma_AF8', 'Gamma_TP10']

brainwave_types = ['Delta', 'Theta', 'Alpha', 'Beta', 'Gamma']

# Clean up timestamps to include only the time
timestamps = pd.to_datetime(data['TimeStamp']).dt.strftime('%H:%M:%S.%f').str[:-3]

# Sum sensors for each brainwave type
relative_values = {
    brainwave: (
        data.filter(like=brainwave).sum(axis=1) / 
        data[columns].sum(axis=1)
    ).tolist()  # Convert to list for JSON serialization
    for brainwave in brainwave_types
}

# Create a JSON-like structure
output_data = {
    "timestamps": timestamps.tolist(),
    "relative_values": relative_values
}

# Output the data as JSON
print(json.dumps(output_data, indent=4))
