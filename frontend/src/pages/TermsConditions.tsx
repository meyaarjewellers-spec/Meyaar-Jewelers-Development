import { Link } from "wouter";
import { useEffect } from "react";

export default function TermsConditions() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-8 lg:px-32 py-20 max-w-5xl">
        <Link href="/">
          <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer mb-8 inline-block underline">
            ← Back to Home
          </span>
        </Link>

        <h1 className="text-5xl font-serif font-bold mb-3 tracking-wide">Terms & Conditions</h1>
        <p className="text-sm text-muted-foreground mb-12 font-light">Last updated: April 2, 2026</p>

        <div className="prose prose-sm max-w-none text-foreground text-justify space-y-8">
            <section>
              <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Overview</h2>
            <p className="text-base leading-relaxed">
              Welcome to Meyaar Jewelers. Throughout this website, the terms "we," "us," "our," and "Meyaar Jewelers" refer to our company and services. By visiting our website and engaging with our products and services, you agree to be bound by these Terms and Conditions ("Terms").
            </p>
            <p className="text-base leading-relaxed">
              These Terms apply to all users of our site, including browsers, shoppers, vendors, and contributors. If you do not agree with any part of these Terms, please do not use our website or purchase our products.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Section 1: Use of Our Online Store</h2>
            <p className="text-base leading-relaxed">
              By accessing and using this website, you confirm that you are at least the legal age of majority in your state, province, or country of residence, or that you have obtained parental or guardian consent.
            </p>
            <p className="text-base leading-relaxed mb-3">
              You agree to use our site only for lawful purposes and in a way that does not infringe upon the rights of others or restrict their use and enjoyment. Prohibited behavior includes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>Using our products, services, or website for illegal purposes</li>
              <li>Violating any applicable laws, rules, or regulations in your jurisdiction</li>
              <li>Transmitting viruses, malware, or any harmful code</li>
              <li>Attempting to gain unauthorized access to our systems</li>
              <li>Interfering with the normal operation of our website</li>
            </ul>
            <p className="text-base leading-relaxed mt-3">
              Violation of these Terms may result in immediate termination of your access to the website and any ongoing transactions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Section 2: General Conditions</h2>
            <p className="text-base leading-relaxed">
              We reserve the right to refuse service to anyone, at any time, for any reason. We maintain the right to make changes to our website, pricing, policies, and products without prior notice.
            </p>
            <p className="text-base leading-relaxed">
              You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of our website, our services, or our products without explicit written permission from Meyaar Jewelers. All payment information submitted through our site is securely encrypted using industry-standard security protocols.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Section 3: Product Information and Accuracy</h2>
            <p className="text-base leading-relaxed">
              We make every effort to ensure that product details, descriptions, pricing, and images are accurate and current. However, we cannot guarantee perfection and do not assume responsibility for errors or inaccuracies. Specifically:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>Product colors may vary depending on your device's screen display settings</li>
              <li>Handcrafted jewelry may have natural variations in appearance</li>
              <li>Product descriptions, dimensions, or materials may contain minor inaccuracies</li>
              <li>Information on our website may not always be updated in real-time</li>
              <li>Use of this site and all products are at your own risk</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Section 4: Pricing and Modifications</h2>
            <p className="text-base leading-relaxed">
              Prices for our handcrafted jewelry and services may change at any time without notice. We reserve the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>Limit or modify product offerings</li>
              <li>Discontinue any product or service at any time</li>
              <li>Correct pricing errors, both on our site and in pending orders</li>
              <li>Update or remove content from our website without notice</li>
              <li>Impose conditions on the use of our services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Section 5: Product Availability and Inventory</h2>
            <p className="text-base leading-relaxed">
              Our handcrafted jewelry pieces may be available exclusively online, and certain items may have limited quantities. Some products are made to order and may involve extended production times.
            </p>
            <p className="text-base leading-relaxed">
              We reserve the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>Limit purchases by individual customer or region</li>
              <li>Refuse sales to specific customers or groups</li>
              <li>Discontinue or modify any product at any time</li>
              <li>Limit the quantity of items purchased per order</li>
            </ul>
            <p className="text-base leading-relaxed mt-3">
              All returns and exchanges are subject to our Return Policy. Handcrafted items may be non-returnable or subject to restocking fees.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Section 6: Orders and Billing</h2>
            <p className="text-base leading-relaxed">
              We may refuse or cancel any order at our sole discretion. When placing an order, you agree to provide accurate, current, and complete billing and contact information. You are responsible for maintaining the confidentiality of your account information.
            </p>
            <p className="text-base leading-relaxed">
              We may decline orders that we suspect are for resale, fraud, or unusual purchasing patterns. We also reserve the right to cancel orders that appear to violate these Terms or our policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Section 7: Third-Party Services and Links</h2>
            <p className="text-base leading-relaxed">
              Our website may include integrations with or links to third-party services, payment processors, social media platforms, and external websites. We are not responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>The content, accuracy, or reliability of third-party services</li>
              <li>Any damages or losses resulting from your use of third-party services</li>
              <li>Their privacy practices or terms of service</li>
              <li>Their security or data handling practices</li>
            </ul>
            <p className="text-base leading-relaxed mt-3">
              Your use of third-party services is entirely at your own risk. We recommend reviewing their terms and privacy policies before engaging with them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Section 8: User Feedback, Reviews, and Submissions</h2>
            <p className="text-base leading-relaxed">
              If you submit feedback, product reviews, suggestions, or any other content to us:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>We may use this content for any purpose without compensation to you</li>
              <li>We are not obligated to acknowledge, respond to, or implement your feedback</li>
              <li>We may publish your review or content on our site or in our marketing materials</li>
              <li>You retain ownership of your content but grant us a perpetual, royalty-free license to use it</li>
            </ul>
            <p className="text-base leading-relaxed mt-3">
              You agree not to post unlawful, offensive, defamatory, misleading, or inappropriate content. We reserve the right to remove any reviews or submissions that violate these standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Section 9: Personal Information</h2>
            <p className="text-base leading-relaxed">
              Your use of our website and any personal information you provide are governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding data collection, use, and protection.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Section 10: Errors and Inaccuracies</h2>
            <p className="text-base leading-relaxed">
              We reserve the right to correct errors, omissions, or inaccuracies in product information, pricing, product descriptions, or availability at any time without prior notice. We also reserve the right to cancel orders containing pricing errors or inaccurate information.
            </p>
            <p className="text-base leading-relaxed">
              If an order is canceled due to an error or inaccuracy, we will issue a full refund using the original payment method.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Section 11: Prohibited Uses</h2>
            <p className="text-base leading-relaxed">
              You may not use our website, services, or products for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>Illegal activities or in violation of any laws</li>
              <li>Harassment, bullying, or abusive conduct toward others</li>
              <li>Spamming, phishing, or attempting to hack our systems</li>
              <li>Infringing on intellectual property rights or trademarks</li>
              <li>Collecting or sharing personal information without consent</li>
              <li>Creating automated bots or scrapers</li>
              <li>Reselling products without authorization</li>
              <li>Distributing viruses or malicious code</li>
            </ul>
            <p className="text-base leading-relaxed mt-3">
              We reserve the right to terminate access to our website for any violation of these prohibitions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Section 12: Disclaimer of Warranties</h2>
            <p className="text-base leading-relaxed">
              All products and services offered through our website are provided on an "as is" and "as available" basis without any warranties of any kind, express or implied.
            </p>
            <p className="text-base leading-relaxed">
              We do not guarantee:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>Uninterrupted or error-free website service</li>
              <li>The accuracy, completeness, or reliability of all information</li>
              <li>That any defects in the site will be corrected</li>
              <li>The quality, durability, or fitness of our handcrafted jewelry for a particular purpose</li>
              <li>Any stated results or outcomes from product use</li>
            </ul>
            <p className="text-base leading-relaxed mt-3">
              Handcrafted jewelry may have natural variations, and we cannot guarantee uniformity or perfection.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Section 13: Limitation of Liability</h2>
            <p className="text-base leading-relaxed">
              In no event shall Meyaar Jewelers, its owners, employees, or agents be liable for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>Any indirect, incidental, special, or consequential damages</li>
              <li>Loss of profits, revenue, data, or business opportunities</li>
              <li>Any damages arising from the use or misuse of our products</li>
              <li>Any damages arising from service interruptions or technical failures</li>
              <li>Issues related to third-party services or external links</li>
            </ul>
            <p className="text-base leading-relaxed mt-3">
              Our liability is limited to the maximum extent permitted by applicable law. In jurisdictions that do not allow limitation of liability, this clause may not apply.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Section 14: Indemnification</h2>
            <p className="text-base leading-relaxed">
              You agree to indemnify and hold harmless Meyaar Jewelers, its owners, employees, and agents from any claims, damages, or liabilities arising from:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>Your breach or violation of these Terms</li>
              <li>Your misuse of our website or products</li>
              <li>Your infringement of third-party intellectual property rights</li>
              <li>Any content you submit or create</li>
              <li>Your violation of any applicable laws</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Section 15: Termination and Account Suspension</h2>
            <p className="text-base leading-relaxed">
              We may terminate your access to our website and services at any time, with or without notice, if we determine that you have violated these Terms, engaged in unlawful activity, or otherwise acted in a manner detrimental to our business.
            </p>
            <p className="text-base leading-relaxed">
              Upon termination, all rights and permissions granted to you will cease immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Section 16: Governing Law and Jurisdiction</h2>
            <p className="text-base leading-relaxed">
              These Terms and Conditions are governed by and construed in accordance with the laws of the United States, and you agree to submit to the exclusive jurisdiction of the courts in that location. If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Section 17: Changes to These Terms</h2>
            <p className="text-base leading-relaxed">
              We reserve the right to update, modify, or change these Terms at any time. When we make material changes, we will update the "Last updated" date at the top of this page. Your continued use of the website following any such changes constitutes your acceptance of the updated Terms.
            </p>
            <p className="text-base leading-relaxed">
              We encourage you to review these Terms periodically to stay informed of any updates.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Section 18: Contact Us</h2>
            <p className="text-base leading-relaxed">
              If you have any questions, concerns, or disputes regarding these Terms and Conditions, please contact us at:
            </p>
            <ul className="list-none space-y-2 text-base mt-3">
              <li>
                <strong>Email:</strong>{" "}
                <a href="mailto:contact@meyaarjewelers.com" className="text-amber-700 hover:underline font-medium">
                  contact@meyaarjewelers.com
                </a>
              </li>
              <li>
                <strong>Business Name:</strong> Meyaar Jewelers
              </li>
            </ul>
            <p className="text-base leading-relaxed mt-3">
              We will make every effort to resolve your concerns within a reasonable timeframe.
            </p>
          </section>

          <section className="bg-amber-50 border border-amber-200 p-6 rounded-lg mt-12">
            <p className="text-sm text-muted-foreground leading-relaxed">
              By using Meyaar Jewelers and our website, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
