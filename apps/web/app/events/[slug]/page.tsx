import Link from 'next/link';
import { notFound } from 'next/navigation';
import RegistrationForm from './RegistrationForm';
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
type EventItem = { id: string; slug: string; title: string; description: string; startsAt: string; location?: string };
export default async function EventDetailPage({ params }: { params: { slug: string } }) { let event: EventItem | undefined; try { const response = await fetch(`${API}/api/events`, { next: { revalidate: 30 } }); const payload = await response.json() as { data?: EventItem[] }; event = payload.data?.find(item => item.slug === params.slug); } catch {} if (!event) notFound(); return <main className="site-width event-detail"><Link className="back-link" href="/events">? All events</Link><span className="eyebrow">SME TV EVENT</span><h1>{event.title}</h1><p className="event-detail-meta">{new Date(event.startsAt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })} · {event.location ?? 'Location to be announced'}</p><div className="event-detail-copy">{event.description}</div><RegistrationForm eventId={event.id} /></main>; }
