# Excel Smart Model Refinery (ESMR)

Transform your Excel data with AI-powered cleaning and analysis. ESMR uses advanced language models to refine, structure, and extract insights from your spreadsheet data.

## Features

### Data Cleaning (T5-Base)
- Clean and structure your Excel data using the T5-Base model
- Upload Excel files or paste text directly
- Export cleaned data as CSV or JSON

### RAG (Pegasus)
- Use Retrieval-Augmented Generation to ask questions about your data
- Get AI-generated insights based on your Excel data or text
- Perfect for summarization and information extraction

## How to Use

1. **Data Cleaning Tab**:
   - Upload an Excel file or paste text
   - Process the data with the T5-Base model
   - Export the cleaned data as CSV or JSON

2. **RAG Tab**:
   - Provide context information by uploading an Excel file or pasting text
   - Ask specific questions about your data
   - Get AI-generated responses based on your context

## Technologies Used

- Gradio for the web interface
- Hugging Face Transformers for AI models
- T5-Base for text cleaning
- Pegasus for retrieval-augmented generation

## License

MIT
\`\`\`

## Step 4: Add These Files to Your GitHub Repository

Now, add these files to your GitHub repository:

```bash
# Clone your repository (if you haven't already)
git clone https://github.com/yllvar/esmr.xyz.git
cd esmr.xyz

# Create the files
# (Create app.py, requirements.txt, and README.md with the content provided above)

# Add the files to git
git add app.py requirements.txt README.md

# Commit the changes
git commit -m "Add Gradio app for Hugging Face Spaces"

# Push to GitHub
git push origin main
