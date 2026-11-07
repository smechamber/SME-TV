import Breadcrumbs from '../../components/Breadcrumbs';

export const metadata = {
  title: 'Our Activities | SME TV',
  description: 'Explore the activities and initiatives of SME TV.',
};

const activities = [
  'Live streaming',
  'Interviews',
  'Conferences, interactive and mentoring sessions',
  'Talk shows',
  'Webinars',
  'Workshops',
  'Executive training and education programs',
  'Seminars',
  'Debates and deliberations',
  'Sharing of knowledge, experience and expertise',
  'Experts and achievers talk',
  'Motivational and inspirational talks',
  'Lecture series',
  'Roundtables',
  'Branding and promotional activities',
  'Publishing post-event reports in SMEConnect magazine, digital media, periodicals and magazines',
];

export default function OurActivitiesPage() {
  return (
    <main className="min-h-screen bg-[#faf9fb]">
      <div className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Our Activities' }]} />

        <section className="mt-6 rounded-2xl border border-[#eeeaf0] bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-10">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d92867]">
                What We Do
              </span>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#211b2b] sm:text-4xl">
                Our Activities
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#6b6571]">
                SME TV undertakes various activities to connect, inform,
                educate and empower the SME community.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 border-b border-[#eeeaf0] py-5"
                >
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#d92867]" />

                  <p className="text-[15px] leading-7 text-[#4f4a58]">
                    {activity}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}