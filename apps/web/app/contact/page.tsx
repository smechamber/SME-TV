import Breadcrumbs from '../../components/Breadcrumbs';

export const metadata = {
  title: 'Contact Us | SME TV',
  description:
    'Get in touch with SME TV for queries, partnerships, collaborations and business opportunities.',
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-6">
      <Breadcrumbs items={[{ label: 'Contact Us' }]} />

      <section className="rounded-2xl border border-[#e7e4eb] bg-white px-5 py-8 shadow-[0_12px_35px_rgba(30,27,75,0.05)] sm:px-12 sm:py-12">

        {/* Header */}
        <header className="mb-9 border-b border-[#eeeaf0] pb-7 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d92867]">
            Get In Touch
          </span>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#211b2b] sm:text-4xl">
            Contact Us
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#77717e] sm:text-base">
            We would love to hear from you. Reach out to SME TV for queries,
            partnerships, collaborations and business opportunities.
          </p>
        </header>

        {/* Contact Details */}
        <div className="mx-auto max-w-3xl">

          <h2 className="mb-6 text-xl font-bold text-[#211b2b] sm:text-2xl">
            Registered &amp; Head Office
          </h2>

          {/* Address */}
          <div className="flex gap-4 border-b border-[#eeeaf0] pb-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fce8f0] text-[#d92867]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
            </div>

            <div>
              <h3 className="font-semibold text-[#211b2b]">Office Address</h3>
              <p className="mt-2 text-sm leading-7 text-[#66616d] sm:text-base">
                Samruddhi Venture Park, Office No. 1, 3rd Floor,
                <br />
                Marol MIDC Industrial Estate, Andheri (E),
                <br />
                Mumbai - 400093
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex gap-4 border-b border-[#eeeaf0] py-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fce8f0] text-[#d92867]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </div>

            <div>
              <h3 className="font-semibold text-[#211b2b]">Email Address</h3>
              <a
                href="mailto:director@smechamber.com"
                className="mt-2 inline-block text-sm text-[#d92867] transition-colors hover:text-[#b51c51] sm:text-base"
              >
                director@smechamber.com
              </a>
            </div>
          </div>

          {/* Phone */}
          <div className="flex gap-4 pt-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fce8f0] text-[#d92867]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.11L8.1 9.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.58 2.8.7a2 2 0 0 1 1.72 2.04Z" />
              </svg>
            </div>

            <div>
              <h3 className="font-semibold text-[#211b2b]">Contact Numbers</h3>

              <div className="mt-2 flex flex-col gap-2 text-sm sm:text-base">
                <a
                  href="tel:+917506046755"
                  className="text-[#66616d] transition-colors hover:text-[#d92867]"
                >
                  +91 7506046755
                </a>

                <a
                  href="tel:+912269511111"
                  className="text-[#66616d] transition-colors hover:text-[#d92867]"
                >
                  +91-22-6951 1111
                </a>

                <a
                  href="tel:+912228327219"
                  className="text-[#66616d] transition-colors hover:text-[#d92867]"
                >
                  +91-22-2832 7219 / 20
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Links */}
        <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 border-t border-[#eeeaf0] pt-7 text-sm font-semibold">
          <a
            href="/about"
            className="text-[#d92867] transition-colors hover:text-[#b51c51]"
          >
            About SME TV →
          </a>

          <a
            href="https://smetv.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#d92867] transition-colors hover:text-[#b51c51]"
          >
            Official Website →
          </a>
        </div>

      </section>
    </main>
  );
}