import Breadcrumbs from '../../components/Breadcrumbs';

export const metadata = {
  title: 'Partnership | SME TV',
  description:
    'Explore partnership opportunities with SME TV to support and connect the Indian SME community.',
};

export default function PartnershipPage() {
  return (
    <main className="mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-6">
      <Breadcrumbs items={[{ label: 'Partnership' }]} />

      <section className="rounded-2xl border border-[#e7e4eb] bg-white px-5 py-8 shadow-[0_12px_35px_rgba(30,27,75,0.05)] sm:px-12 sm:py-12">

        <header className="mb-8 border-b border-[#eeeaf0] pb-7 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#211b2b] sm:text-4xl">
            Partnership
          </h1>
        </header>

        <div className="space-y-6 text-justify text-sm leading-8 text-[#4f4a58] sm:text-base">

          <p>
            SME TV is exploring partnerships to organise activities, promote
            exclusive information for the benefit of SMEs and create greater
            awareness about business opportunities and industry developments.
          </p>

          <p>
            We welcome partnerships and collaborations with:
          </p>

          <ul className="list-disc space-y-3 pl-6 marker:text-[#d92867]">
            <li>
              Leading media houses, TV channels, corporates, financial and
              educational institutions, research and marketing organisations,
              foreign organisations, regulatory authorities and corporations.
            </li>

            <li>
              Associations, Chambers, trade promotional bodies and councils.
            </li>

            <li>
              Industrialists, business tycoons, thought leaders, NGOs and
              Government agencies.
            </li>
          </ul>

        </div>
      </section>
    </main>
  );
}