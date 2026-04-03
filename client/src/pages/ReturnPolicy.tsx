import { Link } from "wouter";
import { useEffect } from "react";

export default function ReturnPolicy() {
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

        <h1 className="text-5xl font-serif font-bold mb-3 tracking-wide">Return & Refund Policy</h1>
        <p className="text-sm text-muted-foreground mb-12 font-light">Last updated: April 2, 2026</p>

        <div className="prose prose-sm max-w-none text-foreground text-justify space-y-8">
            <section>
              <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Overview</h2>
            <p className="text-base leading-relaxed">
              At Meyaar Jewelers, we stand behind the quality of our handcrafted jewelry. We want you to be completely satisfied with your purchase. This Return & Refund Policy outlines the conditions, procedures, and timelines for returning items and requesting refunds.
            </p>
            <p className="text-base leading-relaxed">
              Please read this policy carefully before making a purchase. If you have questions about our return process, please contact us at contact@meyaarjewelers.com.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Return Window</h2>
            <p className="text-base leading-relaxed">
              You have <strong>30 days from the date of purchase</strong> to return eligible items for a refund or exchange. The return period is calculated from the date your order was placed, not the date you received it.
            </p>
            <p className="text-base leading-relaxed">
              Items returned after 30 days will not be accepted, and we will not process refunds for late returns.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Eligible Items for Return</h2>
            <p className="text-base leading-relaxed">
              The following items are eligible for return or exchange:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>Jewelry pieces that are unworn and in original condition</li>
              <li>Items with original packaging and all materials intact</li>
              <li>Products with no visible wear, damage, or alterations</li>
              <li>Jewelry that has not been professionally cleaned or modified</li>
              <li>Items returned with original receipt or proof of purchase</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Non-Returnable Items</h2>
            <p className="text-base leading-relaxed">
              The following items cannot be returned or exchanged:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>Custom-made or personalized jewelry pieces</li>
              <li>Items that have been worn, used, or damaged</li>
              <li>Jewelry with visible signs of wear or scratches</li>
              <li>Items missing original packaging, tags, or documentation</li>
              <li>Products that have been professionally cleaned or altered</li>
              <li>Handcrafted pieces with natural variations that were visible at purchase</li>
              <li>Sale or discounted items marked as "final sale"</li>
              <li>Items returned outside the 30-day window</li>
            </ul>
            <p className="text-base leading-relaxed mt-3">
              Please note: Handcrafted jewelry may have natural variations in color, texture, and patina. These natural characteristics are not considered defects and do not qualify for returns.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Return Process</h2>
            <p className="text-base leading-relaxed mb-3">
              To initiate a return, follow these steps:
            </p>
            <ol className="list-decimal list-inside space-y-3 text-base">
              <li>
                <strong>Contact Us:</strong> Email contact@meyaarjewelers.com within 30 days of your purchase with your order number and reason for return.
              </li>
              <li>
                <strong>Receive Instructions:</strong> We will review your request and provide return shipping instructions and a return address.
              </li>
              <li>
                <strong>Pack Securely:</strong> Place the item in its original packaging with all tags and documentation. Use a secured shipping method with tracking.
              </li>
              <li>
                <strong>Ship Your Item:</strong> Send the package to the return address provided. We recommend using tracked delivery to monitor your shipment.
              </li>
              <li>
                <strong>Quality Check:</strong> Once received, we will inspect the item to verify it meets our return conditions.
              </li>
              <li>
                <strong>Process Refund:</strong> If approved, we will process your refund within 5-7 business days of receiving and inspecting the item.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Return Shipping</h2>
            <p className="text-base leading-relaxed">
              <strong>Domestic Returns:</strong> Customers are responsible for return shipping costs. We recommend using a tracked shipping method to ensure your package arrives safely.
            </p>
            <p className="text-base leading-relaxed">
              <strong>International Returns:</strong> International customers are responsible for return shipping costs. Customs duties and import taxes may apply, which are the responsibility of the customer.
            </p>
            <p className="text-base leading-relaxed">
              <strong>Defective Items:</strong> If an item arrives damaged or defective due to our shipping or quality control error, we will provide a prepaid return shipping label and cover all costs.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Refund Details</h2>
            <p className="text-base leading-relaxed mb-3">
              Once your return is received and approved:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>Original purchase price will be refunded</li>
              <li>Refunds will be issued to the original payment method</li>
              <li>Processing time is 5-7 business days after inspection</li>
              <li>Please allow additional 2-5 business days for your bank or credit card company to process and display the refund</li>
              <li>Shipping costs are non-refundable unless the issue was on our end</li>
              <li>Return shipping costs are non-refundable unless the item arrived damaged</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Refund for Damaged or Defective Items</h2>
            <p className="text-base leading-relaxed">
              If you receive a damaged, defective, or incorrect item:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>Contact us immediately with photos of the damage or defect</li>
              <li>We will provide a prepaid return shipping label</li>
              <li>Once we receive and inspect the item, we will either send a replacement or process a full refund</li>
              <li>Shipping costs will be covered in cases of damage or error on our part</li>
            </ul>
            <p className="text-base leading-relaxed mt-3">
              Please report damaged items within 7 days of receipt to ensure we can assist you promptly.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Exchanges</h2>
            <p className="text-base leading-relaxed">
              We offer exchanges for items that meet our return criteria. To request an exchange:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>Email us within 30 days of purchase with details of the exchange</li>
              <li>Follow the return process for sending back your original item</li>
              <li>Once we receive and approve your return, we will ship the replacement item</li>
              <li>If the new item costs more, you will be charged the price difference</li>
              <li>If the new item costs less, a refund for the difference will be issued</li>
              <li>You are responsible for return shipping; we cover shipping for the replacement item</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Sale and Discounted Items</h2>
            <p className="text-base leading-relaxed">
              Items marked as "final sale" or purchased during clearance events cannot be returned or exchanged. These will be clearly indicated at checkout. Please review all sale terms before completing your purchase.
            </p>
            <p className="text-base leading-relaxed">
              Items purchased at a discount or with promotional codes may still be returned within 30 days, but the refund will be based on the discounted price paid, not the original retail price.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Handcrafted Jewelry Considerations</h2>
            <p className="text-base leading-relaxed">
              Meyaar Jewelers specializes in handcrafted, artisan-made jewelry. Each piece is unique and may exhibit:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>Natural color variations and patterns</li>
              <li>Unique textures and finishes</li>
              <li>Slight variations in sizing due to hand-craftsmanship</li>
              <li>Natural patina development over time</li>
              <li>Individual artisan characteristics and imperfections</li>
            </ul>
            <p className="text-base leading-relaxed mt-3">
              These characteristics are features of handcrafted jewelry, not defects. Items will not be returned due to these natural variations. If you have concerns about color, size, or appearance, please contact us before purchasing.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Jewelry Care and Maintenance</h2>
            <p className="text-base leading-relaxed">
              Proper care ensures your handcrafted jewelry lasts for years. We recommend:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>Storing jewelry in a cool, dry place away from moisture</li>
              <li>Avoiding exposure to harsh chemicals and extreme temperatures</li>
              <li>Removing jewelry during activities like swimming or exercising</li>
              <li>Cleaning gently with a soft cloth and mild soap</li>
              <li>Having professional cleaning or maintenance done only by authorized jewelers</li>
              <li>Checking clasps, settings, and connections regularly</li>
            </ul>
            <p className="text-base leading-relaxed mt-3">
              Damage from improper care or maintenance is not covered under our return policy.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Lost or Stolen Returns</h2>
            <p className="text-base leading-relaxed">
              If your return package is lost or stolen in transit, Meyaar Jewelers is not responsible. We strongly recommend using a tracked shipping method with insurance. If your package does not arrive at our facility within a reasonable timeframe, contact us with your tracking information and we will investigate.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Questions and Support</h2>
            <p className="text-base leading-relaxed">
              If you have any questions about our return and refund policy, or if you need assistance with a return, please contact us:
            </p>
            <ul className="list-none space-y-2 text-base mt-3">
              <li>
                <strong>Email:</strong>{" "}
                <a href="mailto:contact@meyaarjewelers.com" className="text-amber-700 hover:underline font-medium">
                  contact@meyaarjewelers.com
                </a>
              </li>
              <li>
                <strong>Response Time:</strong> We aim to respond to all inquiries within 24-48 business hours
              </li>
            </ul>
          </section>

          <section className="bg-amber-50 border border-amber-200 p-6 rounded-lg mt-12">
            <p className="text-sm text-muted-foreground leading-relaxed">
              We appreciate your business and want you to love your Meyaar Jewelers purchase. If you have any concerns about your order, please reach out promptly so we can help resolve the issue.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
