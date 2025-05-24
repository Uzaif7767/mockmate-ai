import { useState, useEffect } from "react";
import { db } from "@/config/firebase.config";
import { collection, getDocs } from "firebase/firestore";

const Aptitude = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      const querySnapshot = await getDocs(collection(db, "/questions.json"));
      setQuestions(querySnapshot.docs.map((doc) => doc.data()));
      setLoading(false);
    };
    fetchQuestions();
  }, []);
  
  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch("/questions.json"); // JSON file fetch ho rahi hai
      const data = await response.json();
      setQuestions(data);
      setLoading(false);
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    if (timeLeft === 0) {
      nextQuestion();
    }

    return () => clearInterval(timer);
  }, [timeLeft]);

  const checkAnswer = (answer: string) => {
    if (answer === questions[currentIndex].correct) {
      setScore(score + 1);
    }
    setSelectedAnswer(answer);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setTimeLeft(10);
    } else {
      alert(`Quiz Over! Your Score: ${score}/${questions.length}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
      {loading ? (
        <p>Loading Questions...</p>
      ) : questions.length > 0 ? (
        <>
          <h2 className="text-lg font-semibold">{questions[currentIndex].question}</h2>
          <div className="mt-4">
            {questions[currentIndex].options.map((option, index) => (
              <button
                key={index}
                onClick={() => checkAnswer(option)}
                className={`block w-full p-2 my-2 border rounded ${
                  selectedAnswer === option
                    ? option === questions[currentIndex].correct
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-600">Time left: {timeLeft}s</p>
          <button
            onClick={nextQuestion}
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Next Question
          </button>
        </>
      ) : (
        <p>No questions available.</p>
      )}
    </div>
  );
};

export default Aptitude;
