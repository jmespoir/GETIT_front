import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, ChevronDown } from 'lucide-react';
import api from '../../../api/axios';
import { API, LECTURE_TRACK, MY_QNA_PAGE } from '../../../constants';
import { groupQnaByQuestion } from '../../../utils/qnaGroup';

function threadLastAtMs(group) {
  const times = [group.question?.createdAt, ...group.answers.map((a) => a.createdAt)].filter(Boolean);
  if (times.length === 0) return 0;
  return Math.max(...times.map((t) => new Date(t).getTime()));
}

function previewLine(text, fallback) {
  if (!text || typeof text !== 'string') return fallback;
  const t = text.replace(/\s+/g, ' ').trim();
  if (!t) return fallback;
  const max = 160;
  return t.length <= max ? t : `${t.slice(0, max)}…`;
}

const FILTER = { ALL: 'ALL', UNANSWERED: 'UNANSWERED', ANSWERED: 'ANSWERED' };

export default function MyQna() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState(FILTER.ALL);
  const [expandedKey, setExpandedKey] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .get(API.PATHS.LECTURES, { params: { size: 100 } })
      .then((res) => {
        const content = res.data?.content ?? [];
        if (cancelled || content.length === 0) {
          setRows([]);
          return null;
        }
        return Promise.all(
          content.map((item) =>
            api.get(API.PATHS.LECTURE_DETAIL(item.lectureId)).then((r) => ({
              lectureId: r.data.lectureId,
              title: r.data.title || '',
              type: r.data.type,
            }))
          )
        ).then((lectures) => {
          if (cancelled) return null;
          return Promise.all(
            lectures.map((lec) =>
              api
                .get(API.PATHS.LECTURE_QNA_ME(lec.lectureId))
                .then((r) => ({ ...lec, messages: Array.isArray(r.data) ? r.data : [] }))
                .catch(() => ({ ...lec, messages: [] }))
            )
          );
        });
      })
      .then((withMessages) => {
        if (cancelled) return;
        if (!withMessages) {
          setRows([]);
          return;
        }
        const out = [];
        for (const lec of withMessages) {
          if (!lec.messages.length) continue;
          const groups = groupQnaByQuestion(lec.messages);
          for (const g of groups) {
            const qnaKey = g.question.qnaId ?? g.question.id;
            out.push({
              rowKey: `${lec.lectureId}-${qnaKey}`,
              lectureId: lec.lectureId,
              lectureTitle: lec.title,
              trackType: lec.type,
              preview: previewLine(g.question.content, MY_QNA_PAGE.PREVIEW_FALLBACK),
              lastAt: threadLastAtMs(g),
              unanswered: g.answers.length === 0,
              thread: { question: g.question, answers: g.answers },
            });
          }
        }
        out.sort((a, b) => b.lastAt - a.lastAt);
        setRows(out);
      })
      .catch(() => {
        if (!cancelled) setError(MY_QNA_PAGE.LOAD_ERROR);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredRows = useMemo(() => {
    if (filter === FILTER.ALL) return rows;
    if (filter === FILTER.UNANSWERED) return rows.filter((r) => r.unanswered);
    return rows.filter((r) => !r.unanswered);
  }, [rows, filter]);

  const trackLabel = (type) => (type === LECTURE_TRACK.STARTUP ? MY_QNA_PAGE.TRACK_STARTUP : MY_QNA_PAGE.TRACK_SW);

  const toggleExpand = (rowKey) => {
    setExpandedKey((prev) => (prev === rowKey ? null : rowKey));
  };

  const filterOptions = [
    { id: FILTER.ALL, label: MY_QNA_PAGE.FILTER_ALL, activeClass: 'bg-cyan-600/25 border-cyan-400/60 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.2)]' },
    { id: FILTER.UNANSWERED, label: MY_QNA_PAGE.FILTER_UNANSWERED, activeClass: 'bg-amber-500/20 border-amber-400/60 text-amber-100 shadow-[0_0_12px_rgba(251,191,36,0.15)]' },
    { id: FILTER.ANSWERED, label: MY_QNA_PAGE.FILTER_ANSWERED, activeClass: 'bg-emerald-600/25 border-emerald-400/55 text-emerald-100 shadow-[0_0_12px_rgba(52,211,153,0.15)]' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#0a061e] text-white pt-24 pb-20 px-6 font-sans flex items-center justify-center">
        <p className="text-gray-400">{MY_QNA_PAGE.LOADING}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[#0a061e] text-white pt-24 pb-20 px-6 font-sans flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0a061e] text-white pt-24 pb-20 px-6 font-sans">
      <div className="max-w-3xl mx-auto mb-6 flex items-center gap-4">
        <button type="button" onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <MessageCircle size={22} className="text-green-400" />
            {MY_QNA_PAGE.TITLE}
          </h2>
          <p className="text-sm text-gray-400">{MY_QNA_PAGE.SUBTITLE}</p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="max-w-3xl mx-auto bg-[#110b29] border border-white/10 p-6 rounded-2xl">
          <p className="text-gray-500">{MY_QNA_PAGE.EMPTY}</p>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-4">
            {filterOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setFilter(opt.id);
                  setExpandedKey(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-sm font-bold border-2 transition-all ${
                  filter === opt.id
                    ? opt.activeClass
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {filteredRows.length === 0 ? (
            <div className="bg-[#110b29] border border-white/10 p-6 rounded-2xl">
              <p className="text-gray-500">{MY_QNA_PAGE.FILTER_EMPTY}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRows.map((row) => {
                const isOpen = expandedKey === row.rowKey;
                const { thread } = row;
                return (
                  <div
                    key={row.rowKey}
                    className="bg-[#110b29] border border-white/10 rounded-2xl p-4"
                  >
                    <div className="flex gap-3 items-start">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span className="text-sm font-bold text-cyan-300 truncate">{row.lectureTitle || '-'}</span>
                          <span className="text-[11px] uppercase tracking-wide text-gray-500 shrink-0 px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                            {trackLabel(row.trackType)}
                          </span>
                        </div>
                        <div className="mb-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold border-2 ${
                              row.unanswered
                                ? 'bg-amber-500/20 border-amber-400/70 text-amber-100 ring-1 ring-amber-400/30'
                                : 'bg-emerald-500/20 border-emerald-400/65 text-emerald-100 ring-1 ring-emerald-400/25'
                            }`}
                          >
                            {row.unanswered ? MY_QNA_PAGE.UNANSWERED : MY_QNA_PAGE.ANSWERED}
                          </span>
                        </div>
                        <p className="text-sm text-gray-200 line-clamp-3 whitespace-pre-wrap">{row.preview}</p>
                        <div className="mt-3 text-xs text-gray-500">
                          {MY_QNA_PAGE.LAST_ACTIVITY}
                          {': '}
                          {row.lastAt ? new Date(row.lastAt).toLocaleString() : '-'}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleExpand(row.rowKey)}
                        className={`shrink-0 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-3 py-2.5 sm:px-3.5 rounded-xl border-2 font-bold text-xs sm:text-sm transition-all shadow-lg min-w-[4.5rem] sm:min-w-0 ${
                          isOpen
                            ? 'border-violet-400/80 bg-violet-600/30 text-violet-50 ring-2 ring-violet-400/35 hover:bg-violet-600/40'
                            : 'border-cyan-400/80 bg-gradient-to-b from-cyan-500/35 to-cyan-700/30 text-cyan-50 ring-2 ring-cyan-400/40 hover:from-cyan-500/45 hover:to-cyan-700/40 hover:brightness-110 active:scale-[0.98]'
                        }`}
                        aria-expanded={isOpen}
                        aria-label={isOpen ? MY_QNA_PAGE.THREAD_TOGGLE_COLLAPSE : MY_QNA_PAGE.THREAD_TOGGLE_EXPAND}
                      >
                        <ChevronDown size={22} className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        <span className="leading-tight text-center">
                          {isOpen ? MY_QNA_PAGE.COLLAPSE_BUTTON_SHORT : MY_QNA_PAGE.EXPAND_BUTTON_SHORT}
                        </span>
                      </button>
                    </div>

                    {isOpen && thread && (
                      <div className="mt-4 pt-4 border-t border-white/10 space-y-3 max-h-72 overflow-y-auto">
                        <div className="space-y-2">
                          <p className="text-sm text-gray-200 whitespace-pre-wrap">{thread.question.content}</p>
                          <p className="text-xs text-gray-500">
                            {MY_QNA_PAGE.ROLE_YOU}
                            {' · '}
                            {thread.question.createdAt ? new Date(thread.question.createdAt).toLocaleString('ko-KR') : ''}
                          </p>
                        </div>
                        {thread.answers.length > 0 ? (
                          <div className="pl-4 space-y-2 border-l-2 border-cyan-500/30">
                            {thread.answers.map((answer) => (
                              <div key={answer.id}>
                                <p className="text-sm text-gray-200 whitespace-pre-wrap">{answer.content}</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {MY_QNA_PAGE.ROLE_ADMIN}
                                  {' · '}
                                  {answer.createdAt ? new Date(answer.createdAt).toLocaleString('ko-KR') : ''}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold bg-amber-500/15 border border-amber-400/50 text-amber-100">
                            {MY_QNA_PAGE.UNANSWERED}
                          </span>
                        )}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => navigate(`/lecture/${row.lectureId}#qna`)}
                      className="mt-3 text-xs text-cyan-400/90 hover:text-cyan-300 hover:underline"
                    >
                      {MY_QNA_PAGE.OPEN_IN_LECTURE}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
