import dotenv from "dotenv";
dotenv.config();
import { Router } from "express";
import { GoogleGenAI } from "@google/genai";

const router = Router();

const genAI = new GoogleGenAI({
    apiKey: `${process.env.GEMINI_API_KEY}`,
});

router.post("/generate-quiz", async (req, res) => {
    const { topic, numberOfQuestions } = req.body;

    if (!topic || !numberOfQuestions) {
        return res
            .status(400)
            .json({ message: "Topic or Number of Question are requires." });
    }

    const numOfQues = parseInt(numberOfQuestions);

    if (isNaN(numOfQues) || numOfQues <= 0 || numOfQues > 10) {
        return res
            .status(400)
            .json({ message: "Number Of Question must be in range 1 - 10 " });
    }

    try {
        const response = await genAI.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `Generate ${numOfQues} multiple Choice quiz questions on the topic ${topic}
            Each question should have :
                1. A "question" string.
                2. An "options" array of 4 strings
                3. An "answer" string which must be one of the strings from the "options"

                provide the output as a valid JSON array of objects Which can i directly JSON.parse(). for example:
                "[
                    {
                        "question": "What is the capital of France?",
                        "options": ["Berlin","Madrid","Paris","Rome"],
                        "answer":"Paris"
                    },
                    {
                        "question": "Which planet is known as the Red Planet?",
                        "options": ["Earth", "Mars", "Jupiter", "Saturn"],
                        "answer":"Mars"
                    }
                ]" Dont give any more char than this formate`,
        });
        const text = response.text;
        const cleanText = text
            .replace(/```json\s*/, "") // remove opening ```json
            .replace(/```/, "") // remove closing ```
            .trim();

        let questionArray;
        try {
            questionArray = JSON.parse(cleanText);

            if (!Array.isArray(questionArray) || questionArray.length === 0) {
                throw new Error(
                    "Api did not return a valid array of questions "
                );
            }

            questionArray.forEach((q) => {
                if (
                    !q.question ||
                    !Array.isArray(q.options) ||
                    q.options.length !== 4 ||
                    !q.answer
                ) {
                    throw new Error(
                        "Invalis question structure received from api"
                    );
                }
                if (!q.options.includes(q.answer)) {
                    throw new Error(`Answer is not present in options `);
                }
            });
        } catch (error) {
            console.error("Error Parsing JSON from API", error);
            console.error("Response from gemini", text);
            return res.status(500).json({ message: error, rawResponse: text });
        }

        res.json(questionArray);
    } catch (error) {
        console.error("Error while calling gemini API", error);
        res.status(500).json({ message: error.message });
    }
});

export default router;
