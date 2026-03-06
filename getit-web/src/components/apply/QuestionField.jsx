import React from 'react';

const DEFAULT_MAX_LENGTH = 1000;

const QuestionField = ({ question, value, onChange }) => {
  const type = question.type || 'text';
  const isSingle = type === 'single';
  const isAgreement = type === 'agreement';
  const options = question.options || [];
  const maxLen = question.maxLength ?? DEFAULT_MAX_LENGTH;
  const agreed = value === 'agreed';

  return (
    <div className="space-y-4 text-left">
      <label className="block text-lg font-bold text-gray-200 ml-1 leading-relaxed">
        {question.label}
      </label>

      {isSingle ? (
        <div className="flex flex-wrap gap-3" role="radiogroup" aria-label={question.label}>
          {options.map((opt) => (
            <label
              key={opt}
              className={`flex items-center gap-3 px-5 py-4 rounded-2xl border cursor-pointer transition-all ${
                value === opt
                  ? 'bg-cyan-500/20 border-cyan-500 text-white'
                  : 'bg-black/40 border-white/10 text-gray-300 hover:border-white/20'
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(question.id, opt)}
                className="sr-only"
              />
              <span className="font-medium">{opt}</span>
            </label>
          ))}
        </div>
      ) : isAgreement ? (
        <label className="flex items-start gap-3 p-5 rounded-2xl border border-white/10 bg-black/40 cursor-pointer hover:border-white/20 transition-all">
          <input
            type="checkbox"
            name={question.id}
            checked={agreed}
            onChange={(e) => onChange(question.id, e.target.checked ? 'agreed' : '')}
            className="mt-1 w-5 h-5 rounded border-white/30 bg-black/40 text-cyan-500 focus:ring-cyan-500"
          />
          <span className="text-gray-300 leading-relaxed">{question.agreeLabel}</span>
        </label>
      ) : (
        <>
          <textarea
            className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 min-h-[180px] focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-gray-300 resize-none leading-relaxed"
            placeholder="답변을 입력해주세요..."
            value={value ?? ''}
            maxLength={maxLen}
            onChange={(e) => onChange(question.id, e.target.value)}
          />
          <div className="text-right text-xs text-gray-500 font-mono">
            {(value || '').length} / {maxLen}자
          </div>
        </>
      )}
    </div>
  );
};

export default QuestionField;
