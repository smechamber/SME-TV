import Link from 'next/link';
import Breadcrumbs from '../../components/Breadcrumbs';

const activities = [
  'Live streaming',
  'Interviews',
  'Conferences interactive & mentoring sessions',
  'Talk shows',
  'Webinars',
  'Workshops',
  'Executive training & education programs',
  'Seminars',
  'Debates and deliberations',
  'Sharing of knowledge, experience & expertise',
  'Experts & achievers talk',
  'Motivational and inspirational talks',
  'Lecture series',
  'Roundtables',
  'Branding & promotional activities',
  'Publishing post-event reports in SMEConnect magazine, digital media, periodicals and magazines',
];

export const metadata = {
  title: 'Activities | SME TV',
  description:
    'Explore SME TV activities: live streams, interviews, events, learning programs, media and industry engagement.',
};

export default function ActivitiesPage() {
  return (
    <main className="mx-auto w-full max-w-[1180px] px-4 py-8 sm:px-6 sm:py-10">
      <Breadcrumbs items={[{ label: 'Activities' }]} />
      <div className="relative overflow-hidden rounded-2xl bg-[#211b2d] px-6 py-10 text-white shadow-lg sm:px-10 sm:py-14 lg:px-14">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/10 sm:-right-8 sm:-top-36 sm:h-96 sm:w-96" />
        <div className="pointer-events-none absolute -right-4 top-8 h-44 w-44 rounded-full border border-rose-300/20 sm:right-16 sm:top-12 sm:h-64 sm:w-64" />
        <div className="relative max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-300/25 bg-rose-300/10 px-3 py-1.5 text-[10px] font-bold tracking-[.18em] text-rose-200">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-300" /> SME TV · ACTIVITIES
          </span>
          <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Ideas into action.
            <br />
            <span className="text-rose-300">SMEs moving forward.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            We create platforms for India’s SME community to connect, learn, share expertise and be
            heard—from live conversations and mentoring to training, promotion and industry
            engagement.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/events"
              className="inline-flex items-center rounded-lg bg-[#d92867] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#bd1f57]"
            >
              Explore events{' '}
              <span className="ml-3" aria-hidden="true">
                →
              </span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-lg border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Talk to our team
            </Link>
          </div>
        </div>
      </div>

      <section className="mt-12 sm:mt-16" aria-labelledby="activities-heading">
        <div className="mb-6 border-b border-[#eeeaf0] pb-5">
          <span className="text-[10px] font-extrabold tracking-[.16em] text-[#d92867]">
            HOW WE BRING THE SME COMMUNITY TOGETHER
          </span>
          <h2
            id="activities-heading"
            className="mt-2 text-2xl font-extrabold tracking-tight text-[#1b1930] sm:text-3xl"
          >
            Our activities
          </h2>
        </div>
        <ul className="divide-y divide-[#eeeaf0] rounded-xl border border-[#eeeaf0] bg-white px-5 shadow-sm sm:px-8">
          {activities.map((activity) => (
            <li
              key={activity}
              className="flex items-start gap-3 py-4 text-sm leading-6 text-[#393443] sm:text-base"
            >
              <span
                className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#d92867]"
                aria-hidden="true"
              />
              <span>{activity}</span>
            </li>
          ))}
        </ul>
      </section>
      <section
        className="mt-12 overflow-hidden rounded-xl border border-[#e8dfea] bg-[#faf7fb] sm:mt-16"
        aria-labelledby="follow-through-heading"
      >
        <div className="grid md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="p-6 sm:p-9">
            <span className="text-[10px] font-extrabold tracking-[.16em] text-[#d92867]">
              A CHANNEL FOR YOUR VOICE
            </span>
            <h2
              id="follow-through-heading"
              className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-[#1b1930] sm:text-3xl"
            >
              Taking SME concerns to the right places
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#5f5a68] sm:text-base">
              Suggestions, issues and recommendations received at the platform will be sent to
              appropriate industries, SMEs, financial and educational institutions, regulatory
              bodies, government agencies, government departments, embassies and other appropriate
              authorities for further action and implementation through the SME Chamber of India.
            </p>
          </div>
          <div className="flex flex-col justify-center bg-[#542c71] p-6 text-white sm:p-8">
            <span className="text-3xl" aria-hidden="true">
              ↗
            </span>
            <p className="mt-3 text-lg font-bold leading-snug">
              A platform for ideas, connections and practical next steps.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-bold text-rose-200 hover:text-white"
            >
              Connect with us <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
