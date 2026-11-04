import Breadcrumbs from '../../components/Breadcrumbs';

export const metadata = {
  title: 'Founder | SME TV',
  description:
    'Meet Mr. Chandrakant Salunkhe, Founder of SME Chamber of India and a longstanding supporter of India’s SME sector.',
};

export default function FounderPage() {
  return (
    <main className="mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-6">
      <Breadcrumbs items={[{ label: 'Founder' }]} />
      <section className="rounded-2xl border border-[#e7e4eb] bg-white px-5 py-8 shadow-[0_12px_35px_rgba(30,27,75,0.08)] sm:px-12 sm:py-12">
        <header className="border-b border-[#eeeaf0] pb-7 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d92867]">
            Founder, SME Chamber of India
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#211b2b] sm:text-4xl">
            Mr. Chandrakant Salunkhe
          </h1>
        </header>
        <div className="mx-auto max-w-5xl space-y-5 pt-7 text-sm leading-7 text-[#4f4a58] sm:text-base">
          <p>
            As a successful entrepreneur, influencer, mentor, SME and business rights activist,
            Mr. Chandrakant Salunkhe has been providing guidance and support for the last 35 years
            to the SME sector, manufacturing industries, young entrepreneurs and start-ups. He
            helps them explore emerging business opportunities and has been at the forefront of
            resolving issues and grievances, advocating for policy framework changes and their
            implementation, imparting knowledge and skills for better business growth, and
            strengthening and empowering entrepreneurs and enterprises for global competitiveness.
          </p>
          <p>
            Mr. Chandrakant Salunkhe founded the SME Chamber of India in 1993 to integrate SMEs and
            provide a unique platform to enhance business contacts and growth. The Chamber provides
            value-added business advisory services for business transformation, diversification
            and expansion. It helps identify business partners, channel finance and investment,
            build international collaborations, promote exports, improve manufacturing excellence,
            quality and productivity, and prepare businesses for contract manufacturing, joint
            ventures, technology transfers, private equity and external commercial borrowings.
          </p>
          <p>
            The Chamber also supports supply and procurement, helps businesses improve their
            creditworthiness and credibility to attract strategic partners and investors,
            encourages them to enter the capital market, and takes their issues and grievances to
            the appropriate authorities.
          </p>
        </div>
      </section>
    </main>
  );
}
