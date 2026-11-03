import Link from 'next/link';
import { notFound } from 'next/navigation';
import RegistrationForm from './RegistrationForm';
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
type EventItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  startsAt: string;
  location?: string;
};
export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  let event: EventItem | undefined;
  try {
    const response = await fetch(`${API}/api/events`, { next: { revalidate: 30 } });
    const payload = (await response.json()) as { data?: EventItem[] };
    event = payload.data?.find((item) => item.slug === params.slug);
  } catch {}
  if (!event) notFound();
  return (
    <main className="mx-auto w-full max-w-[850px] px-4 py-10 sm:px-6 sm:py-16">
      <Link className="mb-6 inline-block text-xs font-bold text-[#d92867] hover:underline" href="/events">
        ? All events
      </Link>
      <span className="text-[10px] font-extrabold tracking-[.16em] text-[#d92867]">SME TV EVENT</span>
      <h1 className="mt-3 text-4xl font-black leading-tight tracking-[-.05em] text-[#1b1930] sm:text-5xl">{event.title}</h1>
      <p className="mt-4 text-sm text-[#6e6b7c]">
        {new Date(event.startsAt).toLocaleString('en-IN', {
          dateStyle: 'long',
          timeStyle: 'short',
        })}{' '}
        · {event.location ?? 'Location to be announced'}
      </p>
      <div className="my-6 whitespace-pre-wrap text-base leading-8 text-[#302b36]">{event.description}</div>
      <RegistrationForm eventId={event.id} />
    </main>
  );
}
