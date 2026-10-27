export type Article = {
  id: string;
  title: string;
  summary: string;
  imageUrl?: string;
  content?: string;
  slug: string;
  category?: { name?: string };
  publishedAt?: string;
};
export type Video = {
  id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  youtubeId?: string;
  thumbnail?: string;
  videoType: 'UPLOAD' | 'YOUTUBE';
};
export type EventItem = {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  location?: string;
};
export type Tab = 'Home' | 'News' | 'Watch' | 'Events' | 'Profile';
export type Registration = {
  name: string;
  designation: string;
  companyName: string;
  businessActivity: string;
  specificInterest: string;
  email: string;
  mobile: string;
  city: string;
  state: string;
  consent: boolean;
};
export const emptyRegistration: Registration = {
  name: '',
  designation: '',
  companyName: '',
  businessActivity: '',
  specificInterest: '',
  email: '',
  mobile: '',
  city: '',
  state: '',
  consent: false,
};
