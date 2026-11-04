import Link from 'next/link';

export const metadata = {
  title: 'About SME TV',
  description: 'Learn about SME TV and its work with India’s SME community.',
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-[1180px] px-4 py-8 sm:px-6 sm:py-10">
      <p className="text-[10px] font-extrabold tracking-[.16em] text-[#d92867]">ABOUT SME TV</p>
      <h1 className="my-3 text-4xl font-black leading-tight tracking-[-.05em] text-[#1b1930] sm:text-5xl">
        About SME TV
      </h1>
      <div className="max-w-7xl space-y-5 text-sm leading-7 text-[#5f5a68] sm:text-base">
        <p>
          SME TV is an interactive &amp; branding platform, initiated by the SME Chamber of India
          &amp; Federation of Indian SME Associations to provide a unique opportunity for SMEs &amp;
          stakeholders to share views, knowledge, experience, ideas, concepts, invention,
          innovation, achievements, success stories, branding &amp; promotion of unique or invented
          products or services, government&apos;s new policy, schemes, incentives, benefits, rules,
          regulations, organise live workshops, executive training &amp; education programs,
          seminar, conferences, webcast, webinars, mentoring sessions, debates and deliberate on
          various topics, current affairs, useful government policies and ordinances, various
          business &amp; industrial critical issues.
        </p>
        <p>
          The objective of SME TV is to provide an opportunity for entrepreneurs, industrialists,
          business tycoons, SMEs thought leaders, academicians, economists, visionaries,
          technocrats, inventors, subject experts, start-ups, members of family-owned business,
          women entrepreneurs, professionals from various fields, policy makers, government
          officials, heads of regulatory bodies, financial &amp; other institutions, politicians,
          who are having the interest to take up the issues to the appropriate authorities and put
          in efforts for business, industrial &amp; SME growth as well as securing &amp; protecting
          their interest of various Business &amp; Industrial sector.
        </p>
      </div>

      <section
        id="contact"
        className="mt-10 rounded-xl border border-[#eeeaf0] bg-white p-6 shadow-sm sm:p-8"
      >
        <p className="text-[10px] font-extrabold tracking-[.16em] text-[#d92867]">GET IN TOUCH</p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#1b1930]">
          Connect with us
        </h2>
        <address className="mt-4 not-italic text-sm leading-7 text-[#5f5a68]">
          <strong className="text-[#1b1930]">Registered &amp; Head Office</strong>
          <br />
          Samruddhi Venture Park, Office No. 1, 3rd Floor,
          <br />
          Marol MIDC Industrial Estate, Andheri (E), Mumbai - 400093
          <br />
          <a
            className="font-semibold text-[#d92867] hover:underline"
            href="mailto:director@smechamber.com"
          >
            director@smechamber.com
          </a>
          <br />
          <a className="font-semibold text-[#d92867] hover:underline" href="tel:+917506046755">
            7506046755
          </a>
          <br />
          <a className="font-semibold text-[#d92867] hover:underline" href="tel:+912269511111">
            +91-22-6951 1111 / 2832 7219 / 20
          </a>
        </address>
        <p className="mt-5 text-sm text-[#5f5a68]">
          Explore SME TV&apos;s{' '}
          <a
            className="font-semibold text-[#d92867] hover:underline"
            href="https://smetv.in/"
            target="_blank"
            rel="noreferrer"
          >
            official website
          </a>
          .
        </p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-[#d92867]">
          <Link className="hover:underline" href="/activities">
            Activities
          </Link>
          <a
            className="hover:underline"
            href="https://smetv.in/partnership/"
            target="_blank"
            rel="noreferrer"
          >
            Partnership
          </a>
          <a
            className="hover:underline"
            href="https://smetv.in/initiated-by/"
            target="_blank"
            rel="noreferrer"
          >
            Initiated By
          </a>
        </div>
        <p className="mt-4 text-sm text-[#5f5a68]">
          <Link className="font-semibold text-[#d92867] hover:underline" href="/events">
            Upcoming events
          </Link>{' '}
          |{' '}
          <Link className="font-semibold text-[#d92867] hover:underline" href="/videos">
            Watch SME TV
          </Link>
        </p>
      </section>
    </main>
  );
}
