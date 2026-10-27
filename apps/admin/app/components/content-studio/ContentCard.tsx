import type { ManagedContent } from './types';

export default function ContentCard({
  item,
  type,
  onEdit,
  onDelete,
}: {
  item: ManagedContent;
  type: 'news' | 'video';
  onEdit: () => void;
  onDelete: () => void;
}) {
  const youtubeThumbnail = item.youtubeId
    ? `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`
    : null;
  const previewUrl = type === 'news' ? item.imageUrl : youtubeThumbnail;

  return (
    <article className="overflow-hidden rounded-lg border border-[#ebe8ef] bg-white shadow-[0_6px_18px_rgba(56,34,70,.04)]">
      <div className="relative aspect-video overflow-hidden bg-[#f2eff4]">
        {type === 'video' && item.videoType === 'UPLOAD' && item.videoUrl ? (
          <video
            className="h-full w-full object-cover"
            controls
            preload="metadata"
            src={item.videoUrl}
          />
        ) : previewUrl ? (
          <img
            className="h-full w-full object-cover"
            src={previewUrl}
            alt={type === 'news' ? item.title : `${item.title} video thumbnail`}
          />
        ) : (
          <div className="grid h-full place-items-center text-xs font-bold text-[#aaa5b1]">
            {type === 'video' ? 'No video preview' : 'No image added'}
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide text-[#595363] shadow-sm">
          {item.status}
        </span>
      </div>
      <div className="p-4">
        <h2 className="line-clamp-2 min-h-[40px] text-sm font-bold leading-5">{item.title}</h2>
        <p className="mt-2 line-clamp-2 min-h-[32px] text-[11px] leading-4 text-[#777283]">
          {type === 'news'
            ? item.summary || 'No article summary added.'
            : item.description || 'No video description added.'}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-[#ebe8ef] pt-3">
          <span className="text-[10px] text-[#aaa5b1]">
            {new Date(item.createdAt).toLocaleDateString('en-IN')}
          </span>
          <div className="flex gap-2">
            <button
              className="rounded border border-[#dedbe3] px-3 py-2 text-[11px] font-bold"
              onClick={onEdit}
              type="button"
            >
              Edit
            </button>
            <button
              className="rounded border border-[#f1c8d7] px-3 py-2 text-[11px] font-bold text-[#c5225b]"
              onClick={onDelete}
              type="button"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
