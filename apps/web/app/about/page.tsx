import Image from 'next/image';
import Link from 'next/link';
import Breadcrumbs from '../../components/Breadcrumbs';

export const metadata = {
  title: 'About SME TV',
  description: 'Learn about SME TV and its work with India’s SME community.',
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-6">
       <Breadcrumbs items={[{ label: 'About' }]} />
      <section className="rounded-2xl border border-[#e7e4eb] bg-white px-5 py-8 shadow-[0_12px_35px_rgba(30,27,75,0.08)] sm:px-12 sm:py-12">
        <div className="border-b border-[#eeeaf0] pb-7 text-center">
          <Image
            src="https://smetv.in/wp-content/uploads/2024/12/smetv-2048x956.png"
            alt="SME TV - Digital Voice of SMEs"
            width={300}
            height={140}
            unoptimized
            priority
            className="mx-auto h-auto w-[150px] sm:w-[150px]"
          />
        </div>
        <div className="mx-auto max-w-6xl space-y-5 pt-7 text-sm leading-7 text-[#4f4a58] sm:text-base">
          <p>
            <b>SME TV</b> is an interactive &amp; branding platform, initiated by the SME Chamber of India
            &amp; Federation of Indian SME Associations to provide a unique opportunity for SMEs
            &amp; stakeholders to share views, knowledge, experience, ideas, concepts, invention,
            innovation, achievements, success stories, branding &amp; promotion of unique or
            invented products or services, governments new policy, schemes, incentives, benefits,
            rules, regulations, organise live workshops, executive training &amp; education
            programs, seminar, conferences, webcast, webinars, mentoring sessions, debates and
            deliberate on various topics, current affairs, useful government policies and
            ordinances, various business &amp; industrial critical issues.
          </p>
          <p>
            The objective of SME TV is to provide an opportunity for entrepreneurs, industrialists,
            business tycoons, SMEs thought leaders, academicians, economists, visionaries,
            technocrats, inventors, subject experts, start-ups, members of family-owned business,
            women entrepreneurs, professionals from various fields, policy makers, government
            officials, heads of regulatory bodies, financial &amp; other institutions, politicians,
            who are having the interest to take up the issues to the appropriate authorities and put
            in efforts for business, industrial &amp; SME growth as well as securing &amp;
            protecting their interest of various Business &amp; Industrial sector.
          </p>
        </div>
      </section>

      <div className="mt-7 flex flex-wrap justify-center gap-x-10 gap-y-2 text-sm font-semibold text-[#d92867]">
        <Link className="hover:underline" href="/activities">
          Activities
        </Link>
        <Link className="hover:underline" href="/contact">
          Contact Us
        </Link>
        <Link className="hover:underline" href="/events">
          Upcoming events
        </Link>
        <Link className="hover:underline" href="/videos">
          Watch SME TV
        </Link>
      </div>
    </main>
  );
}
