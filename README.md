# Emotion-Analyser
A real-time Emotion Detection Web Application built as a Minor Project-II for B.Tech Computer Science & Design (MITS), Semester 2 using HTML, CSS, JavaScript (Frontend) and Python Flask with OpenCV and DeepFace library (Backend).This project captures real-time webcam input, detects facial emotions such as Happy, Sad, Neutral, Fear, or Angry using the DeepFace library, and displays the detected emotion on the web interface. Additionally, the background color of the webpage changes according to the detected emotion and suggests a YouTube song link based on the user's emotion.

## Project Overview
This web application captures real-time webcam input from the user's browser, sends the data to a Python Flask backend, and uses the DeepFace library for facial emotion recognition. The detected emotion is then displayed on the web page.

## Features

- Real-time webcam capture using browser.
- Live face detection and emotion recognition using the DeepFace library in the Flask backend.
- Frontend (HTML, CSS, JavaScript) connected to Python Flask backend for seamless real-time communication.
- Dynamic background color change on the webpage based on the detected emotion.
- Emotion-based YouTube song suggestions.

## Tech Stack
**Frontend:**
- HTML
- CSS
- JavaScript
  
**Backend:**
- Python (Flask)
- DeepFace 
- OpenCV 

## Workflow

1. User opens homepage.
2. User clicks the "Analyze Emotion" button.
3. JavaScript sends a request to the Python (Flask) backend.
4. Backend triggers the webcam feed using OpenCV.
5. Emotion is continuously analyzed for 7 seconds in the backend.
6. Detected emotion is sent back to JavaScript (frontend).
7. JavaScript loads the HTML page with the received emotion data.
8. Display results on the web page along with song suggestions based on the detected emotion.

## How to Use
1. Clone this repository to your local machine:
   
3. Install required Python libraries from the backend folder:

   ```bash
   pip install -r requirements.txt
   ```

   i.e.

   ```bash
   pip install flask
   pip install opencv-python
   pip install deepface
   ```

4. Run the Flask backend server:

   ```bash
   python app.py
   ```

5. Open the `index.html` file located in the `/frontend` folder using any modern web browser (e.g., Chrome).

6. Allow webcam access when prompted by the browser.

7. Click the "Analyze Emotion" button on the homepage.

8. The system will:

   * Capture real-time webcam feed.
   * Send the frame to the backend for analysis.
   * Detect the emotion using **DeepFace**.
   * Change the **background color** based on the detected emotion.
   * Suggest a **YouTube song link** matching your mood.
   
## Folder Structure
Emotion-Analyser-Project/
├── frontend/
│   ├── index 1.html 
│   ├── index 2.html
│   ├── style.css
│   └── script.js
├── app.py
├── face5.mp4
├── Emotion Analyser Report file by Palash.pdf
└── README.md

## Project Report

Check [`Emotion Analyser Report file by Palash.pdf`](./Emotion%20Analyser%20Report%20file%20by%20Palash.pdf) for full documentation.

## Output Screenshots
1. front page.png
2. Result page.png


## Real-Life Applications
1. Human-Computer Interaction
2. Restaurants and homes
3. Doctors and Therapists
4. Security and Surveillance
5. E-learning platforms

## Authors
* [Palash Rai](https://github.com/Palash-r26)
* Prarthana Sharma
* Sarvesh Baghel

## License
This project is licensed under the MITS License.
