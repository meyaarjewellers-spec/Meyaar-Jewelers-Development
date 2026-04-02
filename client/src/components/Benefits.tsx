export default function Benefits() {
  const benefits = [
    {
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="18" r="2" />
          <circle cx="19" cy="18" r="2" />
          <path d="M5 10L6 4H18L20 10M6 14H20V10H6" />
          <path d="M2 10H6" />
          <path d="M2 6H5" />
          <path d="M2 14H4" />
        </svg>
      ),
      title: "Global Presence",
      subtitle: "International Tracked Shipping",
    },
    {
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
          <circle cx="18" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M17 11l1 1 2-2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      ),
      title: "Exceptional Service",
      subtitle: "Loved By Over 10,000 Discerning Customers",
    },
    {
      icon: "↻",
      title: "Effortless Returns",
      subtitle: "Complimentary 30-Day Returns",
    },
    {
      icon: "★",
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
              <div className="h-24 w-full flex items-center justify-center text-amber-900">
                {typeof benefit.icon === "string" ? (
                  <span className="text-6xl leading-none">{benefit.icon}</span>
                ) : (
                  benefit.icon
                )}
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
