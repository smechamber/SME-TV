import Link from 'next/link';

export const metadata = {
  title: 'Contact SME TV',
  description: 'Get in touch with SME TV.',
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-[900px] px-4 py-8 sm:px-6 sm:py-12">
      <section className="rounded-2xl border border-[#e7e4eb] bg-white p-6 shadow-[0_12px_35px_rgba(30,27,75,0.08)] sm:p-10">
        <p className="text-[10px] font-extrabold tracking-[.16em] text-[#d92867]">GET IN TOUCH</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-.04em] text-[#1b1930] sm:text-4xl">
          Contact Us
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#6e6b7c] sm:text-base">
          We would love to hear from you. Reach out to SME TV for queries, partnerships,
          collaborations and business opportunities.
        </p>
        <address className="mt-7 not-italic text-sm leading-7 text-[#4f4a58] sm:text-base">
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
        <div className="mt-7 flex flex-wrap gap-4 text-sm font-semibold text-[#d92867]">
          <Link className="hover:underline" href="/about">
            About SME TV
          </Link>
          <a className="hover:underline" href="https://smetv.in/" target="_blank" rel="noreferrer">
            Official website
          </a>
        </div>
      </section>
    </main>
  );
}
