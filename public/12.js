document.addEventListener("DOMContentLoaded", () => {
    const quizOptionsContainer = document.getElementById(
        "quizOptionsContainer"
    );
    const QuestionContainer = document.getElementById("QuestionContainer");
    const resultContainer = document.getElementById("resultContainer");

    const quizTopicInput = document.getElementById("quizTopic");
    const noOfQuestionInput = document.getElementById("noOfQuestion");
    const startQuizBtn = document.getElementById("startQuizBtn");
    const loadingIndicator = document.getElementById("loadingIndicator");

    const quizProgressDisplay = document.getElementById("quizProgress");
    const questionText = document.getElementById("questionText");
    const ChoiceList = document.getElementById("ChoiceList");
    const nextQuestionBtn = document.getElementById("nextQuestion");

    const scoreDisplay = document.getElementById("score");
    const restart = document.getElementById("restart");

    let questions = [];
    let curQuesIdx = 0;
    let curSelectedOption = null;
    let score = 0;
    let questionAnswered = false;

    function showSection(sectionToShow) {
        [quizOptionsContainer, QuestionContainer, resultContainer].forEach(
            (section) => {
                section.classList.add("hidden");
            }
        );
        if (sectionToShow) {
            sectionToShow.classList.remove("hidden");
            sectionToShow.classList.remove("fade-out");
            sectionToShow.classList.add("fade-in");
        }
    }

    function startQuiz() {
        curQuesIdx = 0;
        curSelectedOption = null;
        score = 0;
        questionAnswered = false;
        showSection(QuestionContainer);
        displayQuestion(curQuesIdx);
    }

    quizOptionsContainer.addEventListener("submit", async (e) => {
        e.preventDefault();
        const topic = quizTopicInput.value.trim();
        const numOfQes = parseInt(noOfQuestionInput.value);
        if (!topic) {
            alert("Please enter a valid topic.");
            return;
        }
        if (isNaN(numOfQes) || numOfQes <= 0 || numOfQes > 10) {
            alert("Please Enter No Of QUestion In Range 1-10");
            return;
        }

        startQuizBtn.disabled = true;
        loadingIndicator.classList.remove("hidden");

        try {
            const response = await fetch("/api/generate-quiz", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    topic: topic,
                    numberOfQuestions: numOfQes,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                    message:
                        "Failed to fetch questions. Server return an error",
                }));
                throw new Error(
                    errorData.message ||
                        `HTTP Error! Status : ${response.status}`
                );
            }
            const fetchedQuestions = await response.json();

            if (fetchedQuestions && fetchedQuestions.length > 0) {
                questions = fetchedQuestions;
                startQuiz();
            } else {
                alert("Could not fetch questions");
                showSection(quizOptionsContainer);
            }
        } catch (error) {
            console.error("Errot Fetching Quiz Questions ", error);
            alert(
                "Failed to generate quiz. Please check the console for more details"
            );
            showSection(quizOptionsContainer);
        } finally {
            startQuizBtn.disabled = false;
            loadingIndicator.classList.add("hidden");
        }
    });

    restart.addEventListener("click", () => {
        quizTopicInput.value = "";
        noOfQuestionInput.value = "";
        showSection(quizOptionsContainer);
    });

    function DisplayScore() {
        scoreDisplay.innerText = `${score} / ${questions.length}`;
    }

    function displayQuestion(index) {
        questionAnswered = false;
        if (index >= questions.length) {
            showSection(resultContainer);
            DisplayScore();
        } else {
            quizProgressDisplay.textContent = `Question ${index + 1} of ${
                questions.length
            }`;

            questionText.innerText = questions[index].question;
            ChoiceList.innerHTML = "";
            curSelectedOption = null;

            questions[index].options.forEach((option) => {
                const li = document.createElement("li");
                li.textContent = option;
                ChoiceList.appendChild(li);
            });

            nextQuestionBtn.disabled = true;
            if (index === questions.length - 1) {
                nextQuestionBtn.textContent = "Finish Quiz";
            } else {
                nextQuestionBtn.textContent = "Next Question";
            }
        }
    }

    ChoiceList.addEventListener("click", (e) => {
        if (questionAnswered || e.target.tagName != "LI") {
            return;
        }
        curSelectedOption = e.target;
        let allChoices = ChoiceList.querySelectorAll("li");
        allChoices.forEach((choice) => {
            choice.classList.remove("selected");
        });
        curSelectedOption.classList.add("selected");
        nextQuestionBtn.disabled = false;
    });

    nextQuestionBtn.addEventListener("click", () => {
        if (questionAnswered) return;
        if (!curSelectedOption) {
            alert("Please select an option");
            return;
        }

        questionAnswered = true;
        nextQuestionBtn.disabled = true;

        const correctAnswer = questions[curQuesIdx].answer;

        ChoiceList.querySelectorAll("li").forEach((li) => {
            li.classList.remove("selected");
            li.style.pointerEvents = "none";
        });

        if (correctAnswer === curSelectedOption.innerText) {
            score++;
            curSelectedOption.classList.add("right");
        } else {
            curSelectedOption.classList.add("wrong");
            ChoiceList.querySelectorAll("li").forEach((li) => {
                if (li.textContent === correctAnswer) {
                    li.classList.add("right");
                }
            });
        }

        setTimeout(() => {
            curQuesIdx++;
            if (curQuesIdx < questions.length) {
                displayQuestion(curQuesIdx);
                questionAnswered = false;
                curSelectedOption = null;
            } else {
                showSection(resultContainer);
                scoreDisplay.innerText = `${score} / ${questions.length}`;
            }
        }, 1500);
    });
});
