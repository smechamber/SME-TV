import type { EventItem, HomepageItem, Story, Video } from '../../home-data';

export function isStory(item: HomepageItem): item is Story {
  return 'slug' in item;
}

export function isVideo(item: HomepageItem): item is Video {
  return 'videoType' in item || 'thumbnail' in item || 'videoUrl' in item || 'youtubeId' in item;
}

export function isEvent(item: HomepageItem): item is EventItem {
  return 'startsAt' in item;
}

export function videoThumbnail(video: Video) {
  const youtubeId = youtubeIdForVideo(video);
  if (video.videoType === 'YOUTUBE' && youtubeId)
    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  if (video.thumbnail) return video.thumbnail;
  if (youtubeId) return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
  return undefined;
}

export function youtubeIdForVideo(video: Video) {
  for (const value of [video.youtubeId, video.videoUrl]) {
    const normalized = value?.trim();
    if (!normalized) continue;
    const match = normalized.match(
      /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/,
    );
    const id = match?.[1] ?? normalized;
    if (/^[\w-]{11}$/.test(id)) return id;
  }
  return undefined;
}

export function mixedMeta(item: HomepageItem) {
  if (isStory(item)) return item.category?.name ?? 'ARTICLE';
  return isVideo(item) ? 'VIDEO' : 'EVENT';
}

export function mixedImage(item: HomepageItem) {
  return isStory(item) ? item.imageUrl : isVideo(item) ? videoThumbnail(item) : item.imageUrl;
}

export function mixedHref(item: HomepageItem) {
  return isStory(item) ? `/news/${item.slug}` : isEvent(item) ? `/events/${item.slug}` : '/videos';
}
