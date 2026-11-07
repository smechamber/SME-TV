import Breadcrumbs from '../../components/Breadcrumbs';

export const metadata = {
  title: 'Our Partners | SME TV',
  description: 'Explore the organizations and platforms that partner with SME TV.',
};

const partners = [
  { name: 'Manufacturers & Exporters Association of India', url: 'https://meaiindia.com/', image: 'https://smetv.in/wp-content/uploads/2026/03/MEAI.jpg' },
  { name: 'Maharashtra Industry Development Association', url: 'https://www.midaorg.com/', image: 'https://smetv.in/wp-content/uploads/2024/08/MIDA-300x120-1.jpg' },
  { name: 'Gujarat Industry Development Association', url: 'https://www.gidaorg.com/', image: 'https://smetv.in/wp-content/uploads/2024/08/GIDA-300x120-1.jpg' },
  { name: 'SME Export Promotion Council', url: 'https://www.smeexports.com/', image: 'https://smetv.in/wp-content/uploads/2024/08/SMEEPC-300x120-1.jpg' },
  { name: 'SME Business Management Institute', url: 'https://www.smeinstituteofindia.com/', image: 'https://smetv.in/wp-content/uploads/2024/08/SME-Business-Management-300x120-1.jpg' },
  { name: 'SME Industrial Parks', url: 'https://www.smeindustrialparks.com/', image: 'https://smetv.in/wp-content/uploads/2024/08/SME-Industrial-Park1-300x120-1.jpg' },
  { name: 'SME Credit Check', url: 'https://www.smecreditcheck.com/', image: 'https://smetv.in/wp-content/uploads/2024/08/SME-credit-chek-300x120-1.jpg' },
  { name: 'Start-Ups Council of India', url: 'https://startupscouncilofindia.com/', image: 'https://smetv.in/wp-content/uploads/2024/08/Start-Ups-300x120-1.jpg' },
  { name: 'SME Technology Development Council', url: 'https://smetechcouncil.com/', image: 'https://smetv.in/wp-content/uploads/2024/08/SME-Technology-300x120-1.jpg' },
  { name: 'SME Investment Council', url: 'https://smeinvestmentcouncil.com/', image: 'https://smetv.in/wp-content/uploads/2024/08/SME-Investment-300x120-1.jpg' },
  { name: 'SMETalks', url: 'https://smetalks.com/', image: 'https://smetv.in/wp-content/uploads/2024/08/SMETalks-300x121-1.jpg' },
  { name: 'SMECoach', url: 'https://smecoach.in/', image: 'https://smetv.in/wp-content/uploads/2024/08/SMECoach-300x121-1.jpg' },
  { name: 'SME Business Forum', url: 'https://smebusinessforum.com/', image: 'https://smetv.in/wp-content/uploads/2024/08/SME-Business-Forum-300x120-1.jpg' },
  { name: 'SMEConnect', url: 'https://www.smeconnect.in/', image: 'https://smetv.in/wp-content/uploads/2024/08/SME-Connect-300x121-1.jpg' },
  { name: "Women's Entrepreneurs Development Council of India", url: 'https://wedcindia.com/', image: 'https://smetv.in/wp-content/uploads/2024/08/WEDC-300x120-1.jpg' },
  { name: 'International Business Forum', url: 'https://internationalbizforum.com/', image: 'https://smetv.in/wp-content/uploads/2024/08/IBF-300x120-1.jpg' },
];

export default function PartnershipPage() {
  return (
    <main className="mx-auto w-full max-w-[1320px] px-4 py-6 sm:px-6">

      <Breadcrumbs items={[{ label: 'Partners' }]} />

      <section className="rounded-2xl border border-[#e7e4eb] bg-white px-5 py-8 shadow-[0_12px_35px_rgba(30,27,75,0.05)] sm:px-8 sm:py-10">

        {/* Header */}
        <header className="mb-9 border-b border-[#eeeaf0] pb-7 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#211b2b] sm:text-4xl">
            Our Partners
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#77717e] sm:text-base">
            Meet the organizations and platforms working to support and connect India's SME community.
          </p>
        </header>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {partners.map((partner) => (
            <a
              key={partner.url}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={partner.name}
              title={partner.name}
              className="group flex h-[160px] items-center justify-center rounded-lg border border-[#d7e1eb] bg-white p-5 shadow-[0_2px_5px_rgba(30,60,90,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c8a0b1] hover:shadow-[0_6px_18px_rgba(30,27,75,0.09)]"
            >
              <img
                src={partner.image}
                alt={partner.name}
                loading="lazy"
                className="max-h-[120px] max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
              />
            </a>
          ))}

        </div>
      </section>
    </main>
  );
}