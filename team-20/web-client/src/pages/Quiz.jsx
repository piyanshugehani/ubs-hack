import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
const QuizApp = ({ sessionId }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch quiz data from your backend
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        const response = await axios.post(`http://localhost:5000/student/quiz`, {
          sessionId
        });
        
        const data = JSON.parse(response.data);
        setQuestions(data.questions);
        setUserAnswers(new Array(data.questions.length).fill(null));
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [sessionId]);

  const handleAnswerSelection = (selectedOption) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = selectedOption;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
      setShowResults(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let newScore = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctanswer) {
        newScore += 1;
      }
    });
    setScore(newScore);
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswers(new Array(questions.length).fill(null));
    setScore(0);
    setShowResults(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-80 text-lg">Loading quiz questions...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-80 text-lg text-red-600">Error: {error}</div>;
  }

  if (questions.length === 0) {
    return <div className="flex justify-center items-center h-80 text-lg">No questions available.</div>;
  }

  if (showResults) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Quiz Results</h2>
        <p className="text-center text-lg mb-6">You scored {score} out of {questions.length}</p>
        
        <div className="space-y-4 mb-6">
          {questions.map((question, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg ${userAnswers[index] === question.correctanswer 
                ? 'bg-green-50 border-l-4 border-green-500' 
                : 'bg-red-50 border-l-4 border-red-500'}`}
            >
              <p className="font-medium mb-2">Q{question.qNo}: {question.question}</p>
              <p className="text-sm">
                Your answer: {userAnswers[index] !== null ? 
                  `Option ${userAnswers[index]} - ${question.options[`option${userAnswers[index]}`]}` : 
                  'Not answered'}
              </p>
              <p className="text-sm text-green-700">
                Correct answer: Option {question.correctanswer} - {question.options[`option${question.correctanswer}`]}
              </p>
            </div>
          ))}
        </div>
        
        <button 
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
          onClick={handleRetakeQuiz}
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  const currentQuizQuestion = questions[currentQuestion];
  
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Quiz</h2>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-green-500 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-right text-sm text-gray-600 mt-2">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-medium mb-4">{currentQuizQuestion.question}</h3>
        
        <div className="space-y-3">
          {[1, 2, 3, 4].map((optionNum) => (
            <div 
              key={optionNum}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                userAnswers[currentQuestion] === optionNum 
                  ? 'bg-blue-50 border-blue-500' 
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => handleAnswerSelection(optionNum)}
            >
              <span className="flex justify-center items-center w-8 h-8 bg-gray-100 rounded-full mr-4 font-medium">
                {optionNum}
              </span>
              <span>{currentQuizQuestion.options[`option${optionNum}`]}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between gap-4">
        <button 
          className={`py-2 px-4 rounded-lg font-medium ${
            currentQuestion === 0 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
          onClick={handlePreviousQuestion}
          disabled={currentQuestion === 0}
        >
          Previous
        </button>
        <button 
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
          onClick={handleNextQuestion}
        >
          {currentQuestion < questions.length - 1 ? 'Next' : 'Finish Quiz'}
        </button>
      </div>
    </div>
  );
};

export default QuizApp;
