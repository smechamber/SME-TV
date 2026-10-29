import type { Option } from './types';

export function optionImage(item: Option) {
  if (item.imageUrl ?? item.thumbnail) return item.imageUrl ?? item.thumbnail;
  const videoReference = item.youtubeId ?? item.videoUrl;
  const youtubeId =
    videoReference?.match(
      /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/))([\w-]{11})/,
    )?.[1] ?? (videoReference && /^[\w-]{11}$/.test(videoReference) ? videoReference : undefined);
  return youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : undefined;
}
