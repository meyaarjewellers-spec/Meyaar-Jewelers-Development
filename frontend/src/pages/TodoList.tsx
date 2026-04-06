import Header from "@/components/Header";
import { useCart } from "@/contexts/CartContext";

export default function TodoList() {
  const { itemCount } = useCart();

  const sections = [
    {
      title: "🗄️ Database & Backend",
      completed: [
        "Supabase setup with PostgreSQL",
        "23-table database schema",
        "Product seeding system (15 products)",
        "Category management (Necklaces, Bracelets, Earrings)",
        "Product images in Supabase Storage",
        "Admin client for secure operations",
        "Branding data storage",
        "Contact form backend with email service",
      ],
      pending: [
        "Ratings & Reviews table",
        "Orders & Order Items tables",
        "Payment history tracking",
        "Admin dashboard database",
      ],
    },
    {
      title: "🔐 Authentication",
      completed: [
        "Supabase Auth setup",
        "Authentication context",
        "Migrate from Firebase to Supabase",
      ],
      pending: [
        "Complete user registration flow",
        "Login/Logout full implementation",
        "Password reset functionality",
        "Social login (Google, Apple)",
        "Email verification",
      ],
    },
    {
      title: "🛍️ Product Management",
      completed: [
        "Product catalog with 15 handcrafted items",
        "Dynamic product fetching from database",
        "Product images uploaded to Supabase Storage",
        "Category pages (Necklaces, Bracelets, Earrings)",
        "Product detail pages",
        "Quick View modal",
        "Related products display",
        "Remove all hardcoded data",
      ],
      pending: [
        "Product rating system",
        "User reviews functionality",
        "Search functionality",
        "Product filtering & sorting",
        "Wishlist feature",
      ],
    },
    {
      title: "🛒 Shopping Cart & Checkout",
      completed: [
        "Shopping cart context",
        "Add to cart functionality",
        "Quantity selector",
        "Cart items display",
        "Remove from cart",
        "Cart persistence (localStorage)",
        "Order summary",
        "Checkout page layout",
        "Guest checkout option",
      ],
      pending: [
        "Payment processing (Stripe integration)",
        "Tax calculation (Stripe Tax API)",
        "Promo code validation",
        "Order confirmation",
        "Order history for users",
        "Shipping calculations",
      ],
    },
    {
      title: "💳 Payments & Tax",
      completed: [
        "Tax calculation by ZIP code (hardcoded rates)",
        "Tax UI with ZIP code input",
      ],
      pending: [
        "Stripe Payment API integration",
        "Stripe Tax API for accurate tax rates",
        "Payment gateway setup",
        "Transaction processing",
        "Payment confirmation emails",
        "Refund handling",
      ],
    },
    {
      title: "📧 Email & Communication",
      completed: [
        "Contact form setup",
        "Gmail SMTP configuration (Nodemailer)",
        "Contact email to admin",
        "Confirmation email to users",
      ],
      pending: [
        "Order confirmation emails",
        "Shipping notification emails",
        "Password reset emails",
        "Newsletter functionality",
      ],
    },
    {
      title: "🎨 UI/UX & Components",
      completed: [
        "Responsive header with navigation",
        "Footer with links & social media",
        "Hero section",
        "Featured categories display",
        "Product cards with images",
        "Quick View modal",
        "Quantity selector",
        "Cart items list with images",
        "Order total sidebar",
        "Policy pages (Privacy, Terms, Return, Shipping)",
        "About & Contact pages",
        "Smooth scroll-to-top navigation",
        "Dual logo system (with background + transparent)",
        "Benefits section with icons",
        "Testimonials section",
        "Newsletter signup",
        "Instagram feed integration",
      ],
      pending: [
        "Admin dashboard",
        "Product rating display",
        "Size guide modal",
        "Mobile menu optimization",
        "Wishlist UI",
        "User profile page",
        "Order history page",
      ],
    },
    {
      title: "📱 Pages & Routes",
      completed: [
        "Home page",
        "Category pages (Necklaces, Bracelets, Earrings)",
        "Product detail page",
        "Contact page",
        "About page",
        "Privacy policy page",
        "Terms & conditions page",
        "Return policy page",
        "Shipping policy page",
        "Checkout page",
      ],
      pending: [
        "User profile/account page",
        "Order history page",
        "Admin dashboard",
        "Admin product management",
        "Admin orders management",
        "Search results page",
      ],
    },
    {
      title: "🎯 Marketing & Engagement",
      completed: [
        "Instagram logo link to profile",
        "Newsletter signup component",
        "First-time visitor popup",
        "Testimonials section",
        "Benefits/Features section",
      ],
      pending: [
        "Email newsletter system",
        "Promo codes & discounts",
        "Seasonal promotions",
        "Referral program",
        "Social media integration",
      ],
    },
    {
      title: "⚙️ Infrastructure & DevOps",
      completed: [
        "Vite build setup",
        "Express backend server",
        "Environment variables (.env.local)",
        "TypeScript configuration",
        "Tailwind CSS setup",
        "Radix UI components",
      ],
      pending: [
        "Production deployment",
        "CI/CD pipeline",
        "Error monitoring",
        "Performance optimization",
        "Security headers",
        "Rate limiting",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header cartItemCount={itemCount} />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">📋 Project TODO List</h1>
          <p className="text-gray-600">
            Track completed features and pending implementation items
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((section, idx) => (
            <div key={idx} className="border-l-4 border-amber-900 pl-6">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">
                {section.title}
              </h2>

              {/* Completed Items */}
              {section.completed.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-green-700 mb-3">
                    ✅ Completed
                  </h3>
                  <ul className="space-y-2">
                    {section.completed.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center text-gray-700 line-through"
                      >
                        <span className="mr-3">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pending Items */}
              {section.pending.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-blue-700 mb-3">
                    ⏳ Pending/TODO
                  </h3>
                  <ul className="space-y-2">
                    {section.pending.map((item, i) => (
                      <li key={i} className="flex items-center text-gray-700">
                        <span className="mr-3">▫</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-12 p-8 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-bold mb-4">📊 Progress Summary</h3>
          {(() => {
            const totalCompleted = sections.reduce(
              (sum, s) => sum + s.completed.length,
              0
            );
            const totalPending = sections.reduce(
              (sum, s) => sum + s.pending.length,
              0
            );
            const total = totalCompleted + totalPending;
            const percentage = ((totalCompleted / total) * 100).toFixed(0);

            return (
              <div className="space-y-4">
                <p className="text-gray-700">
                  <span className="font-bold text-green-600">
                    {totalCompleted}
                  </span>{" "}
                  / <span className="font-bold">{total}</span> features
                  completed
                </p>
                <div className="w-full bg-gray-300 rounded-full h-4">
                  <div
                    className="bg-green-600 h-4 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <p className="text-gray-700">
                  <span className="font-bold text-lg">{percentage}%</span>{" "}
                  Complete
                </p>
              </div>
            );
          })()}
        </div>
      </main>
    </div>
  );
}
