# Quiz Master

## Description

Quiz Master is an interactive web application that allows users to test their knowledge on various topics. Users can specify a topic and the number of questions they want to answer. The application then generates a quiz using the Gemini API, presents the questions one by one, and provides a score at the end.

## Features

* **Customizable Quizzes**: Users can choose the topic and the number of questions (1-10) for their quiz.
* **Dynamic Question Generation**: Questions are generated in real-time using the Gemini API based on the user's chosen topic.
* **Interactive Quiz Interface**:
    * Displays one question at a time.
    * Shows progress (e.g., "Question 1 of 10").
    * Allows users to select an answer from multiple choices.
    * Provides immediate feedback on whether the selected answer is correct or incorrect after moving to the next question.
    * Disables already answered questions.
* **Scoring**: Displays the final score after the quiz is completed.
* **Restart Option**: Allows users to start a new quiz with different options.
* **Loading Indicator**: Shows a loading spinner while the quiz is being generated.
* **Responsive Design**: The application is designed to work on different screen sizes.

## Technologies Used

* **Frontend**:
    * HTML5
    * CSS3
    * JavaScript (ES6+)
* **Backend**:
    * Node.js
    * Express.js
* **API**:
    * Google Gemini API (for generating quiz questions)
* **Libraries/Modules**:
    * `dotenv` for managing environment variables.
    * `cors` for enabling Cross-Origin Resource Sharing.
    * `@google/genai` for interacting with the Gemini API.


## Screenshots

You can add screenshots of your application here to give users a visual idea of how it looks and works.

1.  **Quiz Setup Screen:**
    * *Description*: Shows the initial screen where users input the quiz topic and number of questions.
    * ![image](https://github.com/user-attachments/assets/1b26c6bb-5fbc-4c41-b955-08660b119ec0)

2.  **Quiz in Progress:**
    * *Description*: Shows a question being displayed with multiple choice options.
    * ![image](https://github.com/user-attachments/assets/e1886413-fd07-4987-8488-d931e8a859b2)

3.  **Answer Feedback (Optional but Recommended):**
    * *Description*: Shows how feedback is displayed (e.g., correct/incorrect styling on an option after clicking "Next Question").
    * ![image](https://github.com/user-attachments/assets/c75e2b31-c58a-463e-9cff-15681d54c735)


4.  **Quiz Results Screen:**
    * *Description*: Shows the final score after completing the quiz.
    * ![image](https://github.com/user-attachments/assets/72afd174-ed69-409e-89ba-565195d139f2)




## API Endpoints

* **POST `/api/generate-quiz`**:
    * **Description**: Generates quiz questions based on the provided topic and number of questions.
    * **Request Body**:
        ```json
        {
            "topic": "string",
            "numberOfQuestions": "number"
        }
        ```
    * **Response**:
        * **Success (200 OK)**: Returns a JSON array of question objects.
            ```json
            [
                {
                    "question": "What is the capital of France?",
                    "options": ["Berlin", "Madrid", "Paris", "Rome"],
                    "answer": "Paris"
                },
                // ... more questions
            ]
            ```
        * **Error (400 Bad Request)**: If `topic` or `numberOfQuestions` is missing or invalid.
            ```json
            {
                "message": "Topic or Number of Question are requires."
            }
            ```
            ```json
            {
                "message": "Number Of Question must be in range 1 - 10 "
            }
            ```
        * **Error (500 Internal Server Error)**: If there's an issue with the Gemini API or parsing its response.
            ```json
            {
                "message": "Error message from server or API"
            }
            ```




## How It Works

1.  **User Interface (Frontend - `12.html`, `12.css`, `12.js`)**:
    * The user enters a topic and the number of questions on the initial setup screen (`12.html`).
    * When "Start Quiz" is clicked, `12.js` sends an asynchronous POST request to the backend API (`/api/generate-quiz`) with the user's preferences.
    * A loading indicator is shown while waiting for the API response.
    * Upon receiving the questions, `12.js` dynamically populates the quiz interface, displaying one question at a time.
    * User selections are tracked, and feedback is provided.
    * The score is calculated and displayed on the results screen.

2.  **Backend (Server - `server.js`, `routes/quiz.routes.js`)**:
    * `server.js` sets up the Express application, serves the static frontend files (HTML, CSS, JS), and defines the API routes.
    * The `/api` routes are handled by `routes/quiz.routes.js`.
    * The `/generate-quiz` route in `quiz.routes.js` receives the topic and number of questions from the frontend.
    * It then calls the Google Gemini API using the `@google/genai` library, prompting it to generate multiple-choice questions in a specific JSON format.
    * The backend validates and parses the response from the Gemini API.
    * The formatted array of questions is sent back to the frontend.

