import { Link } from "wouter";
import { useEffect } from "react";

export default function PrivacyPolicy() {
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

        <h1 className="text-5xl font-serif font-bold mb-3 tracking-wide">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-12 font-light">Last updated: April 2, 2026</p>

        <div className="prose prose-sm max-w-none text-foreground text-justify space-y-8">
          <p className="text-base leading-relaxed">
            At Meyaar Jewelers, we are committed to protecting your privacy and ensuring you have a transparent, trustworthy experience when shopping with us. This Privacy Policy explains how we collect, use, share, and safeguard your information when you visit our website, make purchases, or interact with our brand. Whether you're browsing our handcrafted jewelry collection or completing a transaction, understanding how we handle your data is important to us.
          </p>

          <p className="text-base leading-relaxed">
            Please take time to review this policy. By using meyaarjewelers.com and our services, you consent to the practices described here. If you do not agree with how we manage your information, we respectfully ask that you refrain from using our services.
          </p>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Policy Updates and Modifications</h2>
            <p className="text-base leading-relaxed">
              As our business evolves and regulations change, we may need to update this Privacy Policy. We will notify you of any material changes by posting the updated version on our site and updating the date at the top. We encourage you to review this policy periodically to stay informed about how we protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Information Collection and Usage</h2>
            <p className="text-base leading-relaxed">
              We collect information from multiple sources to enhance your shopping experience, process your orders, and communicate with you about our handcrafted jewelry. The information we gather depends on how you interact with us—whether you're browsing our collections, making a purchase, or signing up for updates.
            </p>
            <p className="text-base leading-relaxed">
              Beyond the specific uses outlined below, we use your information to respond to inquiries, comply with legal requirements, enforce our terms, prevent fraud, and protect the rights and safety of our customers and business.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Categories of Information We Collect</h2>
            <p className="text-base leading-relaxed">
              Different interactions with our site result in different types of information collection. Here's what we may gather:
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Information You Provide Directly</h3>
            <p className="text-base leading-relaxed mb-3">
              When you interact with us, you may voluntarily provide:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>Contact information such as your name, email address, phone number, and mailing address</li>
              <li>Shipping and billing details needed to fulfill your jewelry orders</li>
              <li>Account credentials and security information if you create a customer profile</li>
              <li>Items in your shopping cart, wishlist, or items you've viewed on our site</li>
              <li>Messages you send through our contact forms or customer service channels</li>
              <li>Preferences regarding our communications and jewelry collections</li>
            </ul>
            <p className="text-base leading-relaxed mt-3">
              While some of this information is optional, certain details are necessary to process your orders and provide customer service. If you choose not to provide required information, we may not be able to complete your purchase or respond to your inquiry.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Information Collected Automatically</h3>
            <p className="text-base leading-relaxed">
              When you browse our site, our systems automatically record certain data about your visit. This includes your IP address, browser type, device information, pages visited, time spent on each page, referring website, and general location information. We use technologies such as cookies and web analytics tools to gather this data, which helps us understand how visitors use our site and improve your experience.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Information from External Sources</h3>
            <p className="text-base leading-relaxed mb-3">
              We may receive information about you from:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>Payment processors and financial institutions that help us securely process your transactions</li>
              <li>Shipping and delivery partners who provide tracking and fulfillment services</li>
              <li>Analytics providers who help us understand site performance and user behavior</li>
              <li>Third-party platforms where you interact with our brand, such as social media</li>
            </ul>
            <p className="text-base leading-relaxed mt-3">
              We treat information obtained from third parties with the same care as information you provide directly. However, we are not responsible for how these third parties collect or handle their own data.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">How We Use Your Information</h2>
            <ul className="space-y-3 text-base">
              <li>
                <strong>Order Fulfillment and Customer Service.</strong> Your information helps us process orders, arrange shipment of your handcrafted jewelry, manage returns or exchanges, and provide support when you have questions or concerns.
              </li>
              <li>
                <strong>Communication and Updates.</strong> We use your contact information to send you order confirmations, shipping updates, and respond to customer inquiries. If you opt in, we may also send information about new collections, special offers, or events.
              </li>
              <li>
                <strong>Site Improvement and Analytics.</strong> By analyzing how customers interact with our site and which products attract the most interest, we can continuously improve your shopping experience and better showcase our jewelry.
              </li>
              <li>
                <strong>Fraud Prevention and Security.</strong> We monitor transactions and site activity to detect unusual patterns or potential security issues that could harm you or our business.
              </li>
              <li>
                <strong>Legal Compliance.</strong> When necessary, we use your information to comply with applicable laws, regulations, and legal processes.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Cookies and Tracking Technologies</h2>
            <p className="text-base leading-relaxed">
              Our site uses cookies and similar tracking tools to enhance functionality and gather insights. These technologies help us remember your preferences, keep you logged in, analyze traffic patterns, and personalize your experience. Some cookies are essential for site operations, while others help us improve marketing and understand what features matter most to you.
            </p>
            <p className="text-base leading-relaxed mt-3">
              You can control cookies through your browser settings and choose to accept or reject them. However, disabling certain cookies may affect site functionality or prevent you from completing purchases. We may also work with partners who use cookies to help us better understand our audience and deliver relevant content.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">When We Share Your Information</h2>
            <p className="text-base leading-relaxed mb-3">
              We only share your information with trusted partners when necessary to provide our services or when you've given us permission. This includes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>Shipping and logistics companies that deliver your orders</li>
              <li>Payment processors who securely handle payment transactions</li>
              <li>Email service providers who help us send communications you've requested</li>
              <li>Customer support platforms that help us assist you better</li>
              <li>Analytics services that help us understand site performance</li>
              <li>Marketing partners, only if you've opted in to receive promotional content</li>
            </ul>
            <p className="text-base leading-relaxed mt-3">
              We do not sell your personal information for marketing purposes. Any partners we work with are contractually required to protect your information and use it only for the services we've contracted them to provide. In cases of business transactions such as a merger or acquisition, your information may be transferred as part of that transaction, and we will notify you of any significant changes.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Customer Reviews and User-Generated Content</h2>
            <p className="text-base leading-relaxed">
              If you leave a review or share content about your Meyaar Jewelers purchase, please be aware that this information becomes public. Anyone visiting our site can see reviews, photos, or other content you've shared. We do not control how public comments are used by others. If you have concerns about content you've posted, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">External Links and Third-Party Sites</h2>
            <p className="text-base leading-relaxed">
              Our website may include links to external sites, such as social media platforms or partner websites. We are not responsible for the privacy practices or content of these sites. Before sharing information on external platforms, we encourage you to review their privacy policies, as they may have different standards than ours.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Protecting Children's Privacy</h2>
            <p className="text-base leading-relaxed">
              Meyaar Jewelers is designed for adult shoppers. We do not knowingly collect or solicit information from children under 13. If we become aware that a child has provided us with personal information, we will take steps to delete it promptly. If you are the parent or guardian of a child and believe your child has shared information with us, please reach out immediately.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Data Security and Retention</h2>
            <p className="text-base leading-relaxed">
              We implement industry-standard security measures to protect your information from unauthorized access. This includes encryption, secure servers, and restricted access protocols. However, no online system is completely secure, and we cannot guarantee absolute protection. We recommend never sharing sensitive information through unsecured channels.
            </p>
            <p className="text-base leading-relaxed mt-3">
              We retain your information for as long as necessary to fulfill our services, comply with legal obligations, and resolve disputes. Once your information is no longer needed, we securely delete or anonymize it.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Your Privacy Rights and Choices</h2>
            <p className="text-base leading-relaxed mb-3">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="space-y-3 text-base">
              <li>
                <strong>Access Your Information.</strong> You can request details about what personal information we maintain about you.
              </li>
              <li>
                <strong>Correct Your Information.</strong> If you believe information we have is inaccurate, you can request corrections.
              </li>
              <li>
                <strong>Request Deletion.</strong> You can ask us to delete your personal information, subject to certain legal exceptions.
              </li>
              <li>
                <strong>Opt Out of Communications.</strong> You can unsubscribe from marketing emails anytime using the link in our messages. This will not affect transactional communications about your orders.
              </li>
              <li>
                <strong>Data Portability.</strong> You can request a copy of your data in a portable format.
              </li>
              <li>
                <strong>Withdraw Consent.</strong> For information we process based on your consent, you can withdraw it at any time.
              </li>
            </ul>
            <p className="text-base leading-relaxed mt-4">
              To exercise any of these rights, contact us using the information below. We will verify your identity before responding. You also have the right to lodge a complaint with your local data protection authority if you have concerns about our practices.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">International Data Transfers</h2>
            <p className="text-base leading-relaxed">
              If you are located outside the United States, please be aware that your information may be processed and stored in the United States, where privacy laws may differ from your home country. By using our site or services, you acknowledge and accept that your information may be transferred internationally and processed according to this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Contact Us</h2>
            <p className="text-base leading-relaxed">
              If you have questions about this Privacy Policy, concerns about how we handle your information, or wish to exercise your privacy rights, please reach out to us:
            </p>
            <p className="text-base leading-relaxed mt-3">
              Email:{" "}
              <a href="mailto:contact@meyaarjewelers.com" className="text-amber-700 hover:underline font-medium">
                contact@meyaarjewelers.com
              </a>
            </p>
            <p className="text-base leading-relaxed">
              We aim to respond to all privacy inquiries within 30 days. If you're not satisfied with our response, you may have additional remedies available under applicable laws.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
