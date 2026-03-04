import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/appStore';
import { MESSAGES } from '../../../constants';
import applyQuestionsData from '../../../resources/Apply/ApplyQuestions.json';
import ApplyHeader from './components/ApplyHeader';
import QuestionField from './components/QuestionField';
import SubmitButton from './components/SubmitButton';

const applyQuestions = applyQuestionsData;

const Apply = () => {
  const navigate = useNavigate();
  const { generationText } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const initialAnswers = useMemo(
    () => Object.fromEntries(applyQuestions.map((q) => [q.id, ''])),
    []
  );
  const [answers, setAnswers] = useState(initialAnswers);

  const questions = useMemo(
    () =>
      applyQuestions.map((q) => ({
        ...q,
        label: q.label.replace('{{generationText}}', generationText),
      })),
    [generationText]
  );

  const handleValueChange = (id, value) => setAnswers(prev => ({ ...prev, [id]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(answers).some(val => val.trim() === "")) return alert(MESSAGES.APPLY_ALL_REQUIRED);
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(MESSAGES.APPLY_SUCCESS);
      navigate('/');
    }, 1000);

  }
  return (
    <div className="min-h-screen w-full bg-[#110b29] py-20 px-6 text-white">
      <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-md shadow-2xl">
        <ApplyHeader />
        <form onSubmit={handleSubmit} className="space-y-12">
          {questions.map((q) => (
            <QuestionField key={q.id} question={q} value={answers[q.id]} onChange={handleValueChange} />
          ))}
          <SubmitButton isLoading={isLoading} />
        </form>
      </div>
    </div>
  );
};

export default Apply;