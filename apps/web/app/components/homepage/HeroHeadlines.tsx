import type { HomepageItem, Video } from '../../home-data';
import { isVideo } from './helpers';
import { HeroVideoPanel } from './HeroVideoPanel';
import { LatestCarousel } from './LatestCarousel';

export default function HeroHeadlines({
  items,
  featuredVideoId,
}: {
  items: HomepageItem[];
  featuredVideoId?: string | null;
}) {
  const mainVideo =
    featuredVideoId === undefined
      ? items.find(isVideo)
      : items.find((item): item is Video => item.id === featuredVideoId && isVideo(item));
  const latestItems = mainVideo ? items.filter((item) => item !== mainVideo) : items;

  if (!mainVideo && featuredVideoId === undefined) return null;
  if (!mainVideo && !latestItems.length) return null;

  return (
    <section
      className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8"
      aria-label="Hero and latest content"
    >
      <HeroVideoPanel video={mainVideo} />
      <LatestCarousel items={latestItems} />
    </section>
  );
}
