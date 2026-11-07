import Breadcrumbs from '../../components/Breadcrumbs';

export const metadata = {
  title: 'Opportunities | SME TV',
  description:
    'Explore opportunities with SME TV to share knowledge, expertise, ideas and achievements with the SME community.',
};

const opportunities = [
  'SMEs and Start-Ups',
  'Business Tycoons and Corporate Leaders',
  'CEOs of Banks and Financial Institutions',
  'Women Entrepreneurs',
  'Thought Leaders and Industry Experts',
  'Stakeholders and Policy Makers',
];

const contributions = [
  'Knowledge, expertise and professional experience',
  'Business views, ideas and innovative concepts',
  'Unique products, inventions and innovations',
  'Exemplary achievements and success stories',
  'Business challenges, issues and suggestions',
];

export default function OpportunitiesPage() {
  return (
    <main className="min-h-screen bg-[#faf9fb]">
      <div className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Opportunities' }]} />

        <section className="mt-6 rounded-2xl border border-[#eeeaf0] bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-10">
          <div className="mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-10 text-center">
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d92867]">
                Be a Part of the Change
              </span>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#211b2b] sm:text-4xl">
                Opportunities
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#6b6571]">
                Share your knowledge, experience and ideas to educate, empower
                and transform the SME community.
              </p>
            </div>

            {/* Introduction */}
            <div className="mb-10">
              <p className="text-justify text-[15px] leading-8 text-[#4f4a58]">
                SME TV offers opportunities to share your knowledge,
                expertise, experience, views, ideas, concepts, invention,
                innovation, exemplary achievements and unique ideas to educate
                and transform SMEs, Start-Ups, women entrepreneurs and their
                workforce. Our objective is to improve their knowledge,
                abilities and capabilities to transform their businesses
                towards greater profitability, improved quality, enhanced
                productivity and better-quality services. We also aim to
                inspire and build confidence amongst existing and prospective
                entrepreneurs.
              </p>
            </div>

            {/* Who Can Participate */}
            <div className="mb-10">
              <div className="mb-5">
                <span className="text-xs font-bold uppercase tracking-widest text-[#d92867]">
                  Get Involved
                </span>
                <h2 className="mt-2 text-2xl font-bold text-[#211b2b]">
                  Who Can Participate?
                </h2>
                <p className="mt-2 text-[15px] leading-7 text-[#6b6571]">
                  SME TV provides a platform for individuals and organisations
                  across the business ecosystem.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                {opportunities.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 border-b border-[#eeeaf0] py-4"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fceaf1] text-sm font-semibold text-[#d92867]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="text-[15px] font-medium text-[#4f4a58]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* What You Can Share */}
            <div className="mb-10 border-t border-[#eeeaf0] pt-9">
              <span className="text-xs font-bold uppercase tracking-widest text-[#d92867]">
                Share Your Ideas
              </span>
              <h2 className="mt-2 text-2xl font-bold text-[#211b2b]">
                What Can You Contribute?
              </h2>

              <p className="mt-2 text-[15px] leading-7 text-[#6b6571]">
                Use the SME TV platform to share valuable insights, showcase
                achievements and bring important business matters into focus.
              </p>

              <div className="mt-5 space-y-3">
                {contributions.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#d92867]" />
                    <p className="text-[15px] leading-7 text-[#4f4a58]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Section */}
            <div className="rounded-xl bg-[#fdf5f8] px-6 py-7 sm:px-8">
              <h2 className="text-xl font-bold text-[#211b2b]">
                Empowering the SME Community
              </h2>

              <p className="mt-3 text-justify text-[15px] leading-8 text-[#4f4a58]">
                SME TV also provides an opportunity to present business-related
                issues and difficulties, attracting the attention of policy
                makers and stakeholders for immediate redressal and appropriate
                solutions. Through this platform, we aim to empower
                entrepreneurs, encourage innovation and help create a level
                playing field in today's competitive business environment.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}