import Breadcrumbs from '../../components/Breadcrumbs';

export const metadata = {
  title: 'Initiated By | SME TV',
  description:
    'SME TV is initiated by SME Chamber of India and the Federation of Indian SME Associations.',
};

export default function InitiatedByPage() {
  return (
    <main className="mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-6">
      <Breadcrumbs items={[{ label: 'Initiated By' }]} />

      <section className="rounded-2xl border border-[#e7e4eb] bg-white px-5 py-8 shadow-[0_12px_35px_rgba(30,27,75,0.06)] sm:px-12 sm:py-12">
        <header className="mb-9 border-b border-[#eeeaf0] pb-7 text-center">
  <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#211b2b] sm:text-4xl">
    Initiated By
  </h1>

  <p className="mx-auto mt-2 max-w-2xl text-center text-sm leading-6 text-[#77717e] sm:text-base">
    SME TV is an initiative supported by leading organizations
    dedicated to the growth and development of India's SME sector.
  </p>
</header> 

        <div className="space-y-8 text-sm leading-7 text-[#4f4a58] sm:text-base">

          {/* SME Chamber of India */}
          <article className="rounded-xl border border-[#eeeaf0] bg-white p-5 transition-shadow duration-300 hover:shadow-[0_8px_25px_rgba(30,27,75,0.05)] sm:p-8">

<div className="mb-7 flex w-fit mx-auto min-h-[140px] items-center justify-center rounded-xl border border-[#f0edf2] bg-[#fcfbfd] p-6 shadow-[0_4px_16px_rgba(30,27,75,0.07)]">              <img
                src="https://smechamberofindia.org/images/SME_LOGO.svg"
                alt="SME Chamber of India"
                width="300"
                height="120"
                className="h-auto max-h-28 w-auto object-contain"
              />
            </div>

            <h2 className="text-xl font-bold tracking-tight text-[#211b2b] sm:text-2xl">
              SME Chamber of India
            </h2>

            <div className="mt-4 space-y-4 text-justify">
              <p>
                SME Chamber of India has been providing support &amp; assistance to SMEs for the last 32 years, for identifying emerging business, export &amp; investment opportunities in India &amp; global markets, Joint Ventures, Technology Transfers, Import Facilitation, Government Services &amp; liaison, supply &amp; procurement to Corporates &amp; MNCs, Channelising Finance, Venture Capital, Private Equity, Marketing, Branding, Setting up of new businesses &amp; manufacturing Industries in India and other countries. Avail Govt. incentives &amp; schemes, business transformation, restructuring NPAs and sick businesses. The Chamber is on the forefront to resolve various issues of SMEs and is regularly coordinating &amp; working with various Governments, RBI, financial institutions, SEBI, other Regulatory authorities, Indian &amp; Foreign diplomats, missions and other agencies.
              </p>

              <p>
                The Chamber organises various trade promotional activities for executive training programs for imparting knowledge, awareness, business skills and regular interactions with heads of Regulatory authorities, Corporates &amp; MNCs, Credit Rating agencies, Government officials &amp; financial institutions on the various policies, schemes, advantages, incentives &amp; Implementation strategies of various policies as well as providing SME-talk platforms &amp; SME-Connect magazines to brand &amp; promote success stories of SMEs, recognizing their achievements, innovations &amp; inventions, unique efforts by presenting “India SME Excellence Awards” for the last 23 years.
              </p>

              <p>
                We are regularly sharing business alerts &amp; enquires for new businesses, supply, advanced technology, PE investment, strategic tie-ups &amp; partnership with Indian &amp; overseas companies, mergers &amp; acquisitions, ECB investments, Franchise &amp; distributorship, collaborations, contract manufacturing tie-ups and other business, export &amp; investment opportunities.
              </p>
            </div>

            <div className="mt-6 border-t border-[#f0edf2] pt-5">
              <p className="font-semibold text-[#d92867]">
                For further details visit{' '}
                <a
                  href="https://www.smechamberofindia.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 transition-colors hover:text-[#b51c51]"
                >
                  www.smechamberofindia.com
                </a>
              </p>
            </div>
          </article>

          {/* Federation of Indian SME Associations */}
          <article className="rounded-xl border border-[#eeeaf0] bg-white p-5 transition-shadow duration-300 hover:shadow-[0_8px_25px_rgba(30,27,75,0.05)] sm:p-8">

            <div className="mb-7 flex w-fit mx-auto min-h-[140px] items-center justify-center rounded-xl border border-[#f0edf2] bg-[#fcfbfd] p-6 shadow-[0_4px_16px_rgba(30,27,75,0.07)]">
              <img
                src="https://smeassociationsofindia.com/images/logo.png"
                alt="Federation of Indian SME Associations"
                width="300"
                height="120"
                className="h-auto max-h-28 w-auto object-contain"
              />
            </div>

            <h2 className="text-xl font-bold tracking-tight text-[#211b2b] sm:text-2xl">
              Federation of Indian SME Associations
            </h2>

            <p className="mt-4 text-justify">
              Federation of Indian SME Associations is a national apex body, acting as a single point of contact for various Organizations, Associations, Chambers, Councils, Forums, Institutions, Confederations, Consortiums, Trade Promotional Councils, Agencies, Foundations, Incubators, Business Hubs, Co-operative Business Groups, NGOs and other business &amp; trade organizations, who are putting efforts for the growth of Indian SMEs and also protecting their business interests.
            </p>

            <div className="mt-6 border-t border-[#f0edf2] pt-5">
              <p className="font-semibold text-[#d92867]">
                For more info log on to{' '}
                <a
                  href="https://smeassociationsofindia.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 transition-colors hover:text-[#b51c51]"
                >
                  www.smeassociationsofindia.com
                </a>
              </p>
            </div>
          </article>

        </div>
      </section>
    </main>
  );
}