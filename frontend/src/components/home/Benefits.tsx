export default function Benefits() {
  const benefits = [
    {
      icon: (
        <svg className="w-16 h-16 text-amber-900" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="6" r="3.5" />
          <rect x="6" y="12" width="5" height="5" rx="1.5" />
          <rect x="13" y="12" width="5" height="5" rx="1.5" />
        </svg>
      ),
      title: "Global Presence",
      subtitle: "International Tracked Shipping",
    },
    {
      icon: (
        <svg className="w-16 h-16 text-amber-900" viewBox="0 -1 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M12.31 16.826C12.2864 17.9963 11.3464 18.9278 10.2052 18.9118C9.06401 18.8957 8.14927 17.9382 8.15697 16.7676C8.16467 15.5971 9.09191 14.6522 10.2332 14.652C10.7897 14.6578 11.3212 14.8901 11.7106 15.2978C12.1001 15.7055 12.3157 16.2552 12.31 16.826V16.826Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M22.2014 16.826C22.1778 17.9963 21.2378 18.9278 20.0966 18.9118C18.9554 18.8957 18.0407 17.9382 18.0484 16.7676C18.0561 15.5971 18.9833 14.6522 20.1246 14.652C20.6811 14.6578 21.2126 14.8901 21.602 15.2978C21.9915 15.7055 22.2071 16.2552 22.2014 16.826V16.826Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17.0571 11.559H18.5571M18.5571 16.826V11.559H17.0571V16.826H18.5571ZM22.189 16.0762L24.2224 9.08937C24.2675 8.43728 23.976 7.642 23.4204 7.05042L22.327 8.07731C22.6025 8.37065 22.7519 8.7712 22.7342 9.18603L23.4835 9.218M17.8031 6.127V7.627H21.2849C21.6768 7.62448 22.0522 7.7847 22.327 8.07731M17.8031 12.309H23.893M6.382 6.075V15.75M7.42037 5H16.7657M1 7.75H4.05175M1.975 10.75H3.925M2.56975 13.75H3.925" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
