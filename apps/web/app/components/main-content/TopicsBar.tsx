import { TOPICS } from './types';

export default function TopicsBar({
  topic,
  onTopicChange,
}: {
  topic: string;
  onTopicChange: (topic: string) => void;
}) {
  return (
    <section
      className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none"
      aria-label="Filter news by topic"
    >
      {TOPICS.map((item) => (
        <button
          key={item}
          type="button"
          className={`rounded-lg border px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-all ${topic === item ? 'border-transparent bg-[#1e1b4b] text-white shadow-md' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-[#1e1b4b]'}`}
          onClick={() => onTopicChange(item)}
        >
          {item}
        </button>
      ))}
    </section>
  );
}
