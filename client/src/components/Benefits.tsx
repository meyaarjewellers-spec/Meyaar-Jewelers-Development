export default function Benefits() {
  const benefits = [
    {
      icon: (
        <svg className="w-16 h-16 text-amber-900" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.5 13a3.5 3.5 0 0 1 3.5 3.5v3a3.5 3.5 0 0 1-3.5 3.5h-5A3.5 3.5 0 0 1 0 19.5v-3A3.5 3.5 0 0 1 3 13h6.5M19.5 13a3.5 3.5 0 0 0-3.5 3.5v3a3.5 3.5 0 0 0 3.5 3.5h5a3.5 3.5 0 0 0 3.5-3.5v-3a3.5 3.5 0 0 0-3-3.5h-6.5M12 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
        </svg>
      ),
      title: "Global Presence",
      subtitle: "International Tracked Shipping",
    },
    {
      icon: (
        <svg className="w-16 h-16 text-amber-900" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 18.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M9 18.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
          <path d="M20 13H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2zm0-2V9H4v2h16zm-15-4V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
      ),
      title: "Exceptional Service",
      subtitle: "Loved By Over 10,000 Discerning Customers",
    },
    {
      icon: (
        <svg className="w-16 h-16 text-amber-900" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
          <path d="M8 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Effortless Returns",
      subtitle: "Complimentary 30-Day Returns",
    },
    {
      icon: (
        <svg className="w-16 h-16 text-amber-900" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      title: "Heritage Quality",
      subtitle: "Satisfaction Guaranteed",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="h-px w-12 bg-amber-900 mx-auto md:hidden"></div>
              <div className="h-24 w-full flex items-center justify-center">
                {benefit.icon}
              </div>
              <h3 className="font-serif text-xl font-semibold text-amber-900">
                {benefit.title}
              </h3>
              <p className="text-xs font-semibold text-amber-600 tracking-widest uppercase">
                {benefit.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
