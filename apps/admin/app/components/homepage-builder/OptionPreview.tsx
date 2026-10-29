import type { Option } from './types';
import { optionImage } from './optionImage';

export default function OptionPreview({ item, className }: { item: Option; className: string }) {
  const image = optionImage(item);
  if (item.type === 'VIDEO' && item.videoType === 'UPLOAD' && item.videoUrl) {
    return (
      <video
        className={className}
        src={item.videoUrl}
        poster={image}
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
      />
    );
  }
  return image ? <img className={className} src={image} alt="" /> : <span className={className} />;
}
