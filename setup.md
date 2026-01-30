# Setup Instructions

This project consists of a Python backend using Google ADK and a Next.js frontend.

## Prerequisites

- Python 3.10+
- Node.js 18+
- Google Cloud Project or API Key for Gemini (optional for UI testing, required for actual answers)

## Backend Setup

1.  Navigate to the root directory.
2.  Install dependencies:
    ```bash
    pip install google-adk
    ```
    (It is recommended to use a virtual environment).

3.  Configure API Key:
    - Create a `.env` file in `backend_agent/` or export the variable:
    ```bash
    export GOOGLE_API_KEY="your_api_key"
    ```

4.  Run the backend server:
    ```bash
    adk web . --port 8000 --allow_origins "*"
    ```
    The server will start at `http://localhost:8000`.

## Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:3000`.

## Usage

1.  Open `http://localhost:3000` in your browser.
2.  Select your persona and preferred language in the popup.
3.  Ask questions in the chat box. The backend agent will stream answers based on `about_me.md`.

## Notes

- The backend expects to find `about_me.md` in the root directory.
- The frontend assumes the backend is running on `http://localhost:8000`.
