export type Stats = {
  publishedArticles: number;
  drafts: number;
  videos: number;
  upcomingEvents: number;
  registrations: number;
  users: number;
};

export type Registration = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  companyName: string;
  createdAt: string;
  event: { title: string; startsAt: string };
};

export const initialStats: Stats = {
  publishedArticles: 0,
  drafts: 0,
  videos: 0,
  upcomingEvents: 0,
  registrations: 0,
  users: 0,
};
