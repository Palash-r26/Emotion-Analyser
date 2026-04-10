from flask import Flask, render_template, Response, jsonify, stream_with_context
import cv2
from deepface import DeepFace
import time
import threading
import webbrowser

app = Flask(__name__)

global_emotion = "Detecting..."
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

frame_skip = 5
frame_count = 0

def generate_frames():
    capture = cv2.VideoCapture(0)
    global global_emotion, frame_count

    try:
        while True:
            success, frame = capture.read()
            if not success:
                break

            frame = cv2.flip(frame, 1)
            frame_count += 1
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray, 1.3, 5)

            for i, (x, y, w, h) in enumerate(faces):
                face_roi_color = frame[y:y+h, x:x+w]

                # Detect emotion every few frames
                if frame_count % frame_skip == 0:
                    try:
                        resized_face = cv2.resize(face_roi_color, (224, 224))
                        result = DeepFace.analyze(resized_face, actions=["emotion"], enforce_detection=False)
                        detected_emotion = result[0]["dominant_emotion"]
                        
                        if i == 0:  # Only for the first face
                            global_emotion = detected_emotion
                    except Exception as e:
                        print(f"Emotion detection error: {e}")

                # Draw bounding box and emotion label
                cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 255), 2)
                cv2.putText(
                    frame,
                    f"Emotion: {global_emotion}",
                    (x, y - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.8,
                    (0, 255, 0),
                    2,
                )

            # Encode the frame to JPEG
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()

            # Stream the frame
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    finally:
        capture.release()
        print("Camera released.")

@app.route('/')
def index():
    return render_template('r.html')

@app.route('/analyze')
def analyze():
    return render_template('r1.html')

@app.route('/video_feed')
def video_feed():
    return Response(
        stream_with_context(generate_frames()),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )

@app.route('/current_emotion')
def current_emotion():
    return jsonify({'emotion': global_emotion})

if __name__ == "__main__":
    def open_browser():
        time.sleep(1)
        webbrowser.open("http://127.0.0.1:5000")
    threading.Thread(target=open_browser).start()
    app.run(debug=False)
