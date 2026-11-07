import React from 'react';
import Breadcrumbs from '../../components/Breadcrumbs';

export const metadata = {
  title: 'Founder | SME TV',
  description:
    'Meet Mr. Chandrakant Salunkhe, Founder of SME Chamber of India and a longstanding supporter of India’s SME sector.',
};

export default function FounderPage() {
  const macroGroupCompanies = [
    'Salunkhe Packaging Pvt. Ltd.',
    'Macro Corporate Services Pvt. Ltd.',
    'SME Industrial Park India Pvt. Ltd.',
    'Salunkhe Exports Pvt. Ltd.',
    'SME Credit Check Pvt. Ltd.',
    'Geoptech Solutions Pvt. Ltd.',
  ];

  const registeredOrganisations = [
    'SME Chamber of India (Small and Medium Business Development Chamber of India)',
    'Manufacturers & Exporters Association of India (MEAI)',
    'Federation of Indian SME Associations (FISA)',
    'India International Trade Centre (Investment and Trade Promotion Organisation – recognized and supported by the Government of India and the Government of Maharashtra)',
    'Maharashtra Industry Development Association (MIDA)',
    'Global Manufacturing Capability Centre',
    'National SME Manufacturing Mission',
    'SME Industrial Parks of India',
    'SME Export Promotion Council',
    'SME Legal Council',
    'Start-Ups Council of India',
    'SME Electronics Product Export Promotion Council',
    'SME Investment Promotion Council',
    'Gujarat Industry Development Association (GIDA)',
    'SME Business Management Institute',
    'Packaging Industry Association of India (PIAI)',
    'World SME Trade Centre',
    'SME Technology Development Council',
    'SME Insurance Promotion Council',
    'Women Entrepreneurs Development Council (WEDC)',
  ];

  const internationalCouncils = [
    'India – Japan SME Business Council',
    'India – US SME Business Council',
    'Europe - India SME Business Council',
    'India – South Korea SME Business Council',
    'India – GCC SME Business Council',
    'India - Canada SME Business Council',
    'India - UK SME Business Council',
    'India - China Business Council',
    'India - Poland Business Council',
    'India - Hungary Business Council',
    'India - Africa SME Business Council',
    'India - Germany SME Business Council',
    'India - Romania Business Council',
    'India – Bulgaria Business Council',
  ];

  const brandsAndPlatforms = [
    'India SME Excellence Awards',
    'Pride of Maharashtra Awards',
    'Maharashtra Business Excellence Awards',
    'SMEtv & SME E-News | SMEConnect Magazine',
    'SME Business Forum',
    'Pride of Gujarat Awards (14th Edition)',
    'www.doingbusinessinMaharashtra.com (Portal)',
    'Entrepreneurship Development Council (jointly with Educational Institutes)',
    '“SMEtalks” & “SMECoach” Platforms',
  ];

  const goldenMoments = [
    'Mr. Salunkhe was invited by Mr. Narendra Modi, Hon’ble Prime Minister on 27th December 2019, to present suggestions, recommendations, various issues and grievances related to SME & manufacturing sectors as well as initiatives and efforts taken by him for the empowerment of SME sector for better performance & global competitiveness.',
    'The then Hon’ble Prime Minister, Mr. Atal Bihari Vajpayee had attended SME & Entrepreneurship Awards function organised Mr. Salunkhe on 1st May, 2002 at New Delhi and recommended to the Prime Minister to change the criteria and definitions of Small-Scale Industrial sector to give unique recognition as MSMEs.',
    'The former Deputy Prime Minister & BPJ Leader, Mr. L.K. Advani had attended SME & Entrepreneurship Awards function on 1st May, 2003 at New Delhi.',
    'Mr. Salunkhe has inaugurated the “Industrial & Commercial Bank of China” – ICBC Bank, India Branch on 15th September 2011 at Mumbai. ICBC is the world’s largest Chinese Bank, with a brand value of more than US$ 55 billion. ICBC Bank ranks 1st amongst the most valuable financial brands in the world.',
    'Mr. Salunkhe was on lead to organise the first ever & a mega event on “Global Investors Meet” - Advantage Maharashtra, jointly with the Government of Maharashtra in 1996 at Mumbai. Attended by the then Prime minister, Mr. H.D. Deve Gowda and the then Chief Minister of Maharashtra, Late Mr. Manohar Joshi and 500 plus foreign delegates, who attended 3 days event.',
    'Key note Speaker at “European SME Congress” organized by European commission in October 2016 at Katowice, Poland.',
    'Key note Speaker at “SME Assembly” organized by the European commission in November 2013 at Vilnius, Lithuania.',
    'Speaker at “World Trade Symposium” annual conference organized by the Financial Times in June 2016 at London.',
    'Speaker at G-20 Conference on SME sector at Riyadh, Saudi Arabia, 2014.',
  ];

  const effortsAndContributions = [
    'Mr. Salunkhe was appointed as the Chairman of Law & Order of “Federation of Association of Maharashtra”, and he was on the forefront with the Commissioner of Police, Mumbai to weed out goons & anti-social elements, which were affecting the businesses and industries in Mumbai region and they have deteriorated law and order situations in Mumbai from April to November, 1998.',
    'Member of RBI Empowered Committee for SMEs and SLIC for the various States for the last 15 years.',
    'Member of the working group to study “MSME Development Act, 2006” for advocating to change the definitions of MSME sector constituted on 8th January 2020 by the Ministry and previously 2002, 2005 & 2006.',
    'Active Member of the Industry and Task Force, Maharashtra, under the Chairmanship of the then Chief Minister (2002 – 2007).',
    'Member of the National Advisory Board of MSME, Government of India (2011-2013).',
    'Board of Director of Bharat Heavy Plates and Vessels Ltd. (2002 – 2004).',
    'Board of Director of Asia Mergers and Acquisitions Association.',
    'Mr. Salunkhe has taken lead to provide collateral free loans to micro and small enterprises in 2002 and SIDBI. Thereafter, Mr. Salunkhe has also pursued for the enhancement of collateral free loans from Rs.25 lakhs to Rs.50 lakhs and from Rs.50 lakhs to Rs.1 crore and subsequently, from Rs.1 crore to Rs.2 crores.',
    'Mr. Salunkhe has also suggested and advocated to the Prime Minister to enhance collateral free loans up to Rs. 5 crores for SME sector.',
    'He has been active Member of the various Government Committees, Study Groups and expert groups to present new concepts and new ideas and given inputs on Industry, Finance and SME Sector for the last 20 years.',
    'He has been regularly participating in the national and international conferences as a speaker and sharing his views on the current affairs through various medias, TV channels, Business magazines, newspapers and webinars, conferences, round table, debates and various other events & business meetings.',
  ];

  return (
    <main className="mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-6">
      <Breadcrumbs items={[{ label: 'Founder' }]} />

      <section className="rounded-2xl border border-[#e7e4eb] bg-white px-5 py-8 shadow-[0_12px_35px_rgba(30,27,75,0.08)] sm:px-12 sm:py-12">
        {/* Header Profile Section (Exact Unchanged UI) */}
        <header className="border-b border-[#eeeaf0] pb-10">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:text-left">
            {/* Image Box */}
            <div className="relative h-64 w-64 flex-shrink-0 overflow-hidden rounded-2xl border border-[#e7e4eb] bg-slate-100 shadow-md sm:h-72 sm:w-72">
              <img
                src="https://smechamberofindia.com/images/team/DKP_6600.png"
                alt="Mr. Chandrakant Salunkhe"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <span className="inline-block rounded-full bg-[#fce8f0] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#d92867]">
                Founder, SME Chamber of India
              </span>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#211b2b] sm:text-4xl">
                Mr. Chandrakant Salunkhe
              </h1>
              <p className="mt-2 text-base font-medium text-[#7c7585]">
                Serial &amp; Successful Entrepreneur, Influencer, Mentor, Business Rights Activist
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs sm:text-sm font-semibold text-[#4f4a58] md:justify-start">
                <div className="rounded-lg bg-[#f8f6fa] px-4 py-2">
                  <span className="block text-lg font-bold text-[#d92867]">35+</span>
                  Years of Leadership
                </div>
                <div className="rounded-lg bg-[#f8f6fa] px-4 py-2">
                  <span className="block text-lg font-bold text-[#d92867]">1993</span>
                  Founded SME Chamber
                </div>
                <div className="rounded-lg bg-[#f8f6fa] px-4 py-2">
                  <span className="block text-lg font-bold text-[#d92867]">1991</span>
                  Macro Group Established
                </div>
              </div>

              <div className="mt-6">
                <a
                  href="mailto:president@smechamber.com"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#d92867] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#b51c51]"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  president@smechamber.com
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body strictly matching the provided structure & text */}
        <div className="mx-auto max-w-7xl text-justify space-y-6 pt-8 text-sm leading-7 text-[#4f4a58] sm:text-base">
          <p>
            As a serial &amp; successful entrepreneur, influencer, mentor, business rights activist, having practical experience in the business management, commerce background, Mr. Chandrakant Salunkhe has spent 9 years working in the family business, he has established his own business group “Macro Group of Companies” in 1991, situated in Mumbai, India and involved in the manufacturing and export of Industrial Packaging Machinery, equipments and material, industrial products, food processing products, industrial equipments and supporting various Industries &amp; SMEs for the upgradation of their business and packaging units by adopting advanced packaging technology, patented and advanced industrial technologies for quality productivity and global competitiveness.
          </p>

          <p>
            With a passionate vision, mission, dynamic &amp; indomitable entrepreneurial leadership qualities, Mr. Chandrakant Salunkhe has founded “SME Chamber of India” in 1993 to empower small &amp; medium entrepreneurs and enterprises for better business growth, integration for enhancement of business connections and explore various business opportunities in India and abroad. Under his dynamic leadership, SME Chamber of India has been constantly striving for various activities for the benefit of SME Sector, manufacturing industries, exporters, allied industrial &amp; business sectors and specially providing hand holding and support to start-ups, young entrepreneurs and members of family-owned businesses.
          </p>

          <p>
            The Chamber has been providing value addition services for enhancement of quality productivity, entering into emerging markets for exports, channelising finance and investment for sustainable business growth, establishing cooperation with the foreign companies for collaborations, excellence in the manufacturing, contract manufacturing, joint ventures, technology transfers, new products design &amp; development, innovations, inventions, connectivity with the large corporates for supply and procurement, franchise, distribution, marketing, improve creditworthiness and credibility to attract strategic partners &amp; investors, encouraging them to enter into capital market for alternative finance, setting up new &amp; additional manufacturing units and actively involve SMEs for accomplishment of dream project of Hon’ble Prime Minister to march towards “Viksit Bharat”, make India as a manufacturing hub and achieve largest economy in the world.
          </p>

          <p>
            Mr. Chandrakant Salunkhe he has been on the forefront to take up various issues and grievances of SMEs &amp; manufacturing industries with the appropriate authorities, Prime Minister, Union Ministers, Government officials, heads of regulatory authorities &amp; financial institutions for policy frame work change and its speedy implementation as well as to secure the interest of SME &amp; manufacturing sectors and focus on level playing field in “Ease of Doing Business”, promote and encourage enterprises to avail various benefits &amp; advantages of the Government schemes and policies. Mr. Salunkhe is putting more efforts by educating and creating awareness amongst entrepreneurs for developing quality and competitive products to brand at the national and international levels to enter into emerging markets.
          </p>

          <p>
            Mr. Chandrakant Salunkhe has strongly advocated to set up “SME Stock Exchange”, TReDS – Electronic platform for Trade Receivables, National Skill Development Corporation, Change of the Definition &amp; Act of small-scale industries into MSME Act, set up of exclusive SME Ministry and Departments in the various State Governments, SME Desks/Divisions in the Indian Embassies to enter into the concerned markets, Start-up India platform to boost start-ups to convert into unicorns and collateral free financial facilities for SME sector upto Rs.5 crores.
          </p>

          <p>
            Mr. Salunkhe has converted his vision &amp; passion to set up various organisations, platforms &amp; brands to provide opportunities to the entrepreneurs from the respective fields to connect, communicate &amp; commercialise their business ideas, enhance business &amp; export growth and avail specific advantages created by the various Governments Departments. He has taken lead to set up SME Industrial Parks of India for providing end to end solutions to the SMEs to set up manufacturing units in the various of India, especially in Tier 2 and Tier 3 cities.
          </p>

          <p>
            Mr. Salunkhe has been strongly advocating for the enhancement of credit flow towards SME sectors, manufacturing industries and exports from the various financial institutions and advocating and interacting with the RBI, SEBI, CCI, Ministry of Finance and other Government Departments to resolve issues &amp; grievances.
          </p>

          <p>
            Mr. Salunkhe has been travelling extensively for the business co-operation with the various international organisations, Government Departments, FIs, Investment Boards, Industrial Parks, and various Chambers of Commerce from USA, Canada, UK, Israel, various European Countries, Japan, Australia, New Zealand, South Korea, Hong Kong, China, Turkey, Malaysia, Thailand, Indonesia, Vietnam, Egypt, Singapore, Bahrain, UAE, South Africa, Oman, Mauritius, Qatar, Taiwan, Sri Lanka and all GCC Countries.
          </p>

          <p>
            Mr. Salunkhe is regularly participating as an eminent speaker in the various business conferences, round tables, Government events, meetings, global events and other business activities on his favourite topics on SME &amp; Start-up empowerment, manufacturing, banking, finance, international trade, technology, packaging, innovations, inventions, marketing, international collaborations, industrial transformation, family businesses and other activities. He has been always writing articles and sharing his views in the business newspapers and giving his views and thoughts on specific topics and current affairs with the national TV channels and business channels.
          </p>

          <p>
            He has been Jury for selecting successful entrepreneurs for their remarkable achievements and outstanding contributions in the business and industrial areas from across the sectors and Mr. Salunkhe is providing platform to these successful entrepreneurs to share their thoughts and success stories for the encouragement of existing entrepreneurs, start-ups and young entrepreneurs to follow their path to achieve success in their own ventures. He is inviting valuable suggestions, inputs and recommendations related to SME sector and manufacturing industries for further implementation and execution.
          </p>

          <div className="pt-4 space-y-3">
            <h2 className="text-xl font-bold text-[#211b2b]">Mr. Salunkhe has also founded his own companies as under:</h2>
            <h3 className="text-lg font-bold text-[#d92867]">Macro Group of Companies</h3>
            <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {macroGroupCompanies.map((company, index) => (
                <li key={index} className="flex items-center gap-2 rounded-lg border border-[#e7e4eb] bg-[#faf9fc] px-4 py-2.5 font-medium text-[#211b2b]">
                  <span className="text-[#d92867]">◉</span> {company}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 space-y-3">
            <h2 className="text-xl font-bold text-[#211b2b]">Mr. Salunkhe has initiated the following organisations (Registered under the Companies Act):</h2>
            <ul className="space-y-2">
              {registeredOrganisations.map((org, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <span className="mt-1 text-[#d92867]">◉</span>
                  <span>{org}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 space-y-3">
            <h2 className="text-xl font-bold text-[#211b2b]">
              International Business Forums of India <span className="text-sm font-normal text-[#7c7585]">(Officially endorsed and supported by the concerned countries Embassies in India &amp; Indian Embassies abroad) :</span>
            </h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
              {internationalCouncils.map((council, index) => (
                <div key={index} className="rounded-lg border border-[#e7e4eb] bg-white p-3 font-medium text-[#211b2b] shadow-sm">
                  {council}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <h2 className="text-xl font-bold text-[#211b2b]">Brands and platforms initiated by Shri Salunkhe :</h2>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {brandsAndPlatforms.map((item, index) => (
                <li key={index} className="flex items-center gap-2 rounded-lg border border-[#f0ebf5] bg-[#faf9fc] px-4 py-2.5 font-medium text-[#211b2b]">
                  <span className="text-[#d92867]">🏆</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 space-y-3">
            <h2 className="text-xl font-bold text-[#211b2b]">Golden moments :</h2>
            <ul className="space-y-3">
              {goldenMoments.map((moment, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1.5 flex h-2 w-2 flex-shrink-0 rounded-full bg-[#d92867]"></span>
                  <span>{moment}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 space-y-3">
            <h2 className="text-xl font-bold text-[#211b2b]">Efforts &amp; Contributions by Mr. Chandrakant Salunkhe:</h2>
            <ul className="space-y-3">
              {effortsAndContributions.map((effort, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1.5 flex h-2 w-2 flex-shrink-0 rounded-full bg-[#d92867]"></span>
                  <span>{effort}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}