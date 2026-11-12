import Link from 'next/link';
import Breadcrumbs from '../../components/Breadcrumbs';

export const metadata = {
  title: 'About SME TV',
  description: 'Learn about SME TV and its work with India’s SME community.',
};

const quickLinks = [
  { label: 'Activities', href: '/activities' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Upcoming Events', href: '/events' },
  { label: 'Watch SME TV', href: '/videos' },
];

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-6">
      <Breadcrumbs items={[{ label: 'About' }]} />

      <section className="mt-5 rounded-2xl border border-[#e7e4eb] bg-white px-5 py-8 shadow-[0_12px_35px_rgba(30,27,75,0.06)] sm:px-10 sm:py-10 lg:px-14">
        {/* Heading */}
        <div className="mx-auto mb-8 max-w-5xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#d92867]">
            Who We Are
          </span>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#211b2b] sm:text-4xl">
            About SME TV
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#77717e] sm:text-base">
            The Digital Voice of SMEs, connecting businesses, entrepreneurs and industry leaders.
          </p>
        </div>

        {/* About Content */}
        <div className="mx-auto max-w-5xl space-y-6 text-[15px] leading-8 text-[#4f4a58] sm:text-base">
          <p className="text-justify">
            <b>SME TV</b> is an interactive &amp; branding platform, initiated by the SME Chamber of
            India &amp; Federation of Indian SME Associations to provide a unique opportunity for
            SMEs &amp; stakeholders to share views, knowledge, experience, ideas, concepts,
            invention, innovation, achievements, success stories, branding &amp; promotion of unique
            or invented products or services, governments new policy, schemes, incentives, benefits,
            rules, regulations, organise live workshops, executive training &amp; education
            programs, seminar, conferences, webcast, webinars, mentoring sessions, debates and
            deliberate on various topics, current affairs, useful government policies and
            ordinances, various business &amp; industrial critical issues.
            </p>  

          <p className="text-justify">
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

      {/* Quick Links */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 border-t border-[#eeeaf0] pt-6 text-sm font-semibold text-[#d92867]">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="transition-colors hover:text-[#a91d50] hover:underline"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </main>
  );
}
