import { Link } from "wouter";
import { useEffect } from "react";

export default function ShippingPolicy() {
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

        <h1 className="text-5xl font-serif font-bold mb-3 tracking-wide">Shipping Policy</h1>
        <p className="text-sm text-muted-foreground mb-12 font-light">Last updated: April 2, 2026</p>

        <div className="prose prose-sm max-w-none text-foreground text-justify space-y-8">
            <section>
              <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Overview</h2>
            <p className="text-base leading-relaxed">
              At Meyaar Jewelers, we are committed to delivering your handcrafted jewelry safely and on time. This Shipping Policy outlines our shipping methods, delivery times, handling procedures, and what to do if you have concerns about your order.
            </p>
            <p className="text-base leading-relaxed">
              All items are carefully packaged to ensure they arrive in perfect condition. Please review this policy to understand our shipping practices and procedures.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Shipping Methods</h2>
            <p className="text-base leading-relaxed mb-3">
              We offer the following shipping options at checkout:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li><strong>Standard Shipping:</strong> 5-10 business days</li>
              <li><strong>Expedited Shipping:</strong> 2-3 business days</li>
              <li><strong>Overnight Shipping:</strong> 1 business day</li>
            </ul>
            <p className="text-base leading-relaxed mt-3">
              Shipping costs vary based on the method selected, order value, and destination. All costs will be clearly displayed before you complete your purchase.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Processing Time</h2>
            <p className="text-base leading-relaxed">
              Orders are processed Monday through Friday (excluding holidays). Processing typically takes 2-5 business days from the time you place your order. Custom or made-to-order pieces may require additional processing time, which will be communicated at checkout.
            </p>
            <p className="text-base leading-relaxed">
              Once your order is processed and shipped, you will receive a tracking number via email. Shipping times begin from the date your package leaves our facility, not from the order date.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Domestic Shipping (United States)</h2>
            <p className="text-base leading-relaxed mb-3">
              We ship to all states within the continental United States using USPS or UPS:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>Standard Shipping: 5-10 business days</li>
              <li>Expedited Shipping: 2-3 business days</li>
              <li>Overnight Shipping: 1 business day (arrives by 10 AM)</li>
              <li>All packages are insured and require a signature upon delivery</li>
              <li>You will receive a tracking number to monitor your shipment</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">International Shipping</h2>
            <p className="text-base leading-relaxed mb-3">
              We ship internationally to select countries. International orders are subject to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>Customs duties, taxes, and import fees (customer responsibility)</li>
              <li>Longer delivery times (typically 15-30 business days depending on destination)</li>
              <li>Customs clearance delays beyond our control</li>
              <li>All packages are fully insured and tracked</li>
              <li>Some countries may have restrictions on jewelry shipments</li>
            </ul>
            <p className="text-base leading-relaxed mt-3">
              For international orders, please contact us at contact@meyaarjewelers.com to confirm shipping to your location and receive an accurate shipping quote.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Packaging and Handling</h2>
            <p className="text-base leading-relaxed">
              All handcrafted jewelry is carefully packaged using protective materials including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>Padded jewelry boxes or protective cases</li>
              <li>Anti-theft and tamper-evident packaging</li>
              <li>Secure cushioning to prevent movement during transit</li>
              <li>Discreet, unmarked outer packaging</li>
              <li>Included care instructions and authenticity details</li>
            </ul>
            <p className="text-base leading-relaxed mt-3">
              We take great care in packaging, but jewelry in transit is at your risk until delivery is confirmed.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Tracking Your Order</h2>
            <p className="text-base leading-relaxed mb-3">
              Once your order ships, you will receive:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>An email confirmation with your tracking number</li>
              <li>A direct link to track your package in real-time</li>
              <li>Estimated delivery window</li>
              <li>Delivery status updates (out for delivery, delivered, etc.)</li>
            </ul>
            <p className="text-base leading-relaxed mt-3">
              Please use your tracking number to monitor your shipment. If you do not receive a tracking email within 24 hours of placing your order, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Delivery and Signature</h2>
            <p className="text-base leading-relaxed">
              Delivery addresses are verified at checkout. Packages are delivered to the address provided during purchase. A signature may be required upon delivery to ensure safe receipt of your jewelry.
            </p>
            <p className="text-base leading-relaxed">
              If no one is available to sign, the carrier will typically leave a notice. You can arrange redelivery or pickup according to the carrier's instructions.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Delayed or Lost Packages</h2>
            <p className="text-base leading-relaxed mb-3">
              If your package does not arrive within the estimated timeframe:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>Contact us with your tracking number</li>
              <li>We will investigate with the shipping carrier</li>
              <li>Claims typically take 5-10 business days to resolve</li>
              <li>If deemed lost, we will either ship a replacement or process a refund</li>
            </ul>
            <p className="text-base leading-relaxed mt-3">
              Please allow at least 3 business days beyond the estimated delivery date before reporting a package as lost.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Address Changes</h2>
            <p className="text-base leading-relaxed">
              Once an order is placed, we cannot change the shipping address. If you need to change your address, please contact us immediately. If the order has already shipped, the carrier may be able to redirect it, but this is not guaranteed.
            </p>
            <p className="text-base leading-relaxed">
              Please verify your address carefully before completing your purchase.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Shipping Insurance</h2>
            <p className="text-base leading-relaxed">
              All shipped packages are fully insured against loss and damage. In the rare event a package is damaged or lost in transit, we will:
            </p>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>File an insurance claim with the carrier</li>
              <li>Either send a replacement item or refund the full amount</li>
              <li>Cover all costs associated with the replacement or refund</li>
            </ul>
            <p className="text-base leading-relaxed mt-3">
              Please report damaged packages within 7 days of delivery with photographic evidence.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Weekend and Holiday Shipping</h2>
            <p className="text-base leading-relaxed">
              Orders placed on weekends or holidays will be processed on the next business day. Shipping times do not include weekends or holidays. For example, if you order on Friday, processing begins Monday, and shipping times are calculated from there.
            </p>
            <p className="text-base leading-relaxed">
              During peak shopping seasons (holidays, sales events), processing and shipping times may be extended.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Special Requests and Gift Shipping</h2>
            <p className="text-base leading-relaxed">
              We offer special gift wrapping and presentation options at checkout. If you would like a gift message included, provide the text during checkout and we will include it with your order.
            </p>
            <p className="text-base leading-relaxed">
              Gift orders can be shipped directly to a recipient at a different address. Simply provide the recipient's address during checkout.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Freight and Bulk Orders</h2>
            <p className="text-base leading-relaxed">
              For large or bulk orders, please contact us at contact@meyaarjewelers.com for a custom shipping quote. We can arrange special handling and freight options for orders exceeding standard shipping limits.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Customs and Import Duties (International)</h2>
            <p className="text-base leading-relaxed">
              For international orders, the recipient is responsible for any customs duties, import taxes, VAT, or similar fees assessed by the destination country. These fees are determined by customs authorities and are beyond our control.
            </p>
            <p className="text-base leading-relaxed">
              Customs clearance may cause delays beyond the estimated delivery window. We are not responsible for additional fees or delays caused by customs processing.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-semibold mt-12 mb-6 border-b border-amber-200 pb-4">Contact and Support</h2>
            <p className="text-base leading-relaxed">
              If you have questions about shipping or concerns about your order, please contact us:
            </p>
            <ul className="list-none space-y-2 text-base mt-3">
              <li>
                <strong>Email:</strong>{" "}
                <a href="mailto:contact@meyaarjewelers.com" className="text-amber-700 hover:underline font-medium">
                  contact@meyaarjewelers.com
                </a>
              </li>
              <li>
                <strong>Response Time:</strong> We aim to respond to all shipping inquiries within 24-48 business hours
              </li>
            </ul>
          </section>

          <section className="bg-amber-50 border border-amber-200 p-6 rounded-lg mt-12">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Thank you for choosing Meyaar Jewelers. We take pride in getting your handcrafted jewelry to you safely and on time. We appreciate your patience and understanding as we carefully prepare and ship each order.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
