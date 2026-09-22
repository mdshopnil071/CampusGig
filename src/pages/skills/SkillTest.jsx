import React, { useState } from 'react';
import { SKILL_QUIZZES } from '../../data/skillQuizzes';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { useAuth } from '../../context/AuthContext';
import { FiAward, FiCheckCircle, FiXCircle, FiRotateCcw, FiArrowRight, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const SkillTest = () => {
  const { user } = useAuth();
  const [selectedQuizId, setSelectedQuizId] = useState('react');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [testStarted, setTestStarted] = useState(false);

  const activeQuiz = SKILL_QUIZZES[selectedQuizId];
  const questions = activeQuiz.questions;
  const currentQ = questions[currentQuestionIdx];

  const handleSelectOption = (optIdx) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIdx]: optIdx,
    }));
  };

  const handleNext = () => {
    if (selectedAnswers[currentQuestionIdx] === undefined) {
      toast.error('Please select an option to proceed.');
      return;
    }

    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const resetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setQuizFinished(false);
    setTestStarted(false);
  };

  const score = calculateScore();
  const passed = score >= activeQuiz.passingScore;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Breadcrumb items={[{ label: 'Skill Assessments' }]} />

      {/* Intro Header */}
      <div className="bg-base-100 rounded-3xl p-6 sm:p-8 border border-base-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
          <FiAward className="w-4 h-4" /> Campus Verification Engine
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-neutral">
          Peer Skill MCQ Assessments
        </h1>
        <p className="text-xs text-base-content/70 leading-relaxed">
          Prove your technical competencies to potential buyers. Score 80% or higher to earn an official verified badge on your profile and increase hiring conversion.
        </p>

        {/* Skill Selector Tabs */}
        {!testStarted && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            {Object.keys(SKILL_QUIZZES).map((key) => {
              const quiz = SKILL_QUIZZES[key];
              const isSelected = selectedQuizId === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedQuizId(key);
                    resetQuiz();
                  }}
                  className={`p-4 rounded-2xl border text-center transition ${
                    isSelected
                      ? 'bg-primary text-white border-primary shadow-md font-bold'
                      : 'bg-base-200/50 hover:bg-base-200 border-base-200 text-neutral'
                  }`}
                >
                  <span className="text-2xl block mb-1">{quiz.icon}</span>
                  <span className="text-xs block font-bold capitalize">{key}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Quiz Container */}
      {!testStarted ? (
        <div className="bg-base-100 rounded-3xl p-6 sm:p-10 border border-base-200 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center text-3xl mx-auto">
            {activeQuiz.icon}
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-neutral">
              {activeQuiz.title}
            </h2>
            <p className="text-xs text-base-content/70 max-w-md mx-auto">
              {activeQuiz.description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto text-xs bg-base-200/50 p-4 rounded-2xl border border-base-200">
            <div>
              <span className="text-[10px] text-base-content/50 uppercase block font-bold">Questions</span>
              <span className="font-extrabold text-neutral">{questions.length} MCQs</span>
            </div>
            <div>
              <span className="text-[10px] text-base-content/50 uppercase block font-bold">Passing Mark</span>
              <span className="font-extrabold text-primary">{activeQuiz.passingScore}%</span>
            </div>
            <div>
              <span className="text-[10px] text-base-content/50 uppercase block font-bold">Award</span>
              <span className="font-extrabold text-amber-500">Gold Badge</span>
            </div>
          </div>

          <button
            onClick={() => setTestStarted(true)}
            className="btn btn-primary btn-md rounded-2xl px-8 font-bold text-white shadow-md hover:shadow-lg gap-2"
          >
            Start Assessment Now <FiArrowRight />
          </button>
        </div>
      ) : !quizFinished ? (
        /* Active Question Card */
        <div className="bg-base-100 rounded-3xl p-6 sm:p-8 border border-base-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between text-xs font-bold text-base-content/60 border-b border-base-200 pb-3">
            <span>
              Question {currentQuestionIdx + 1} of {questions.length}
            </span>
            <span className="badge badge-ghost badge-sm">{activeQuiz.title}</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-neutral leading-snug">
            {currentQ.question}
          </h3>

          <div className="space-y-2.5">
            {currentQ.options.map((opt, optIdx) => {
              const isChosen = selectedAnswers[currentQuestionIdx] === optIdx;
              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition flex items-center justify-between ${
                    isChosen
                      ? 'bg-primary/10 border-primary text-primary font-bold shadow-xs'
                      : 'bg-base-200/40 hover:bg-base-200 border-base-200 text-neutral'
                  }`}
                >
                  <span>{opt}</span>
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] shrink-0 ml-3 ${
                      isChosen
                        ? 'border-primary bg-primary text-white font-bold'
                        : 'border-base-300'
                    }`}
                  >
                    {isChosen && '✓'}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-base-200">
            <button
              type="button"
              onClick={resetQuiz}
              className="btn btn-ghost btn-xs text-error"
            >
              Exit Test
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary btn-sm rounded-xl px-6 font-bold text-white gap-2 shadow-sm"
            >
              {currentQuestionIdx === questions.length - 1 ? 'Finish & Grade' : 'Next Question'}
              <FiArrowRight />
            </button>
          </div>
        </div>
      ) : (
        /* Quiz Results Showcase */
        <div className="bg-base-100 rounded-3xl p-6 sm:p-10 border border-base-200 shadow-xl text-center space-y-6">
          <div
            className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-md ${
              passed ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
            }`}
          >
            {passed ? '🏆' : '📚'}
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-neutral">
              {passed ? 'Congratulations! You Passed!' : 'Nice Effort! Almost There.'}
            </h2>
            <p className="text-xs text-base-content/70 max-w-sm mx-auto">
              {passed
                ? `You scored ${score}%. The "${activeQuiz.badge}" badge has been unlocked on your public student profile!`
                : `You scored ${score}%. You need ${activeQuiz.passingScore}% to earn the verified badge. You can review and retake anytime.`}
            </p>
          </div>

          {/* Certificate Badge Card */}
          {passed && (
            <div className="p-5 bg-gradient-to-r from-amber-50 to-cyan-50/50 dark:from-amber-950/20 dark:to-cyan-950/20 rounded-2xl border border-amber-200 dark:border-amber-700/40 max-w-sm mx-auto text-left space-y-2">
              <div className="flex items-center gap-2 text-amber-700 font-extrabold text-xs">
                <FiShield /> Certified Verification Credential
              </div>
              <div className="font-extrabold text-sm text-neutral">{activeQuiz.badge}</div>
              <div className="text-[11px] text-base-content/60">
                Issued to: <span className="font-bold">{user?.full_name || 'Campus Student'}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={resetQuiz}
              className="btn btn-outline btn-sm rounded-xl gap-1.5"
            >
              <FiRotateCcw /> Retake Assessment
            </button>
            <button
              onClick={() => {
                resetQuiz();
                setSelectedQuizId('python');
              }}
              className="btn btn-primary btn-sm rounded-xl text-white font-bold"
            >
              Try Next Skill
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
