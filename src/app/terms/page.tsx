// app/terms/page.tsx
import React from "react";
import Link from "next/link";
import { Calendar, Mail, Home, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and conditions for using BestDealBazar services in Kozhikode district",
};

export default function TermsPage() {
  const lastUpdated = "April 24, 2026";

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <div className="container mx-auto px-4 py-6 md:py-12 max-w-4xl">
        {/* Navigation back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-navy/70 hover:text-brand transition-colors mb-6 md:mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm">Back to Home</span>
        </Link>

        {/* Header section */}
        <div className="mb-8 md:mb-12">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-4"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
          >
            Terms & Conditions
          </h1>
          <div className="flex items-center gap-4 text-sm text-navy/60">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>Last updated: {lastUpdated}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4" />
              <span>legal@bestdealbazar.com</span>
            </div>
          </div>
          <div className="h-px bg-linear-to-r from-brand/20 via-surface to-transparent mt-6" />
        </div>

        {/* Content sections */}
        <div className="space-y-8 md:space-y-10">
          {/* Section 1 */}
          <section>
            <h2
              className="text-xl md:text-2xl font-bold text-navy mb-3"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              1. Acceptance of Terms
            </h2>
            <p className="text-navy/80 leading-relaxed mb-3">
              By accessing and using BestDealBazar (the &quot;Platform&quot;),
              you agree to be bound by these Terms & Conditions. If you do not
              agree with any part of these terms, please do not use our
              services.
            </p>
            <p className="text-navy/80 leading-relaxed">
              These terms apply to all users, including customers, vendors, and
              visitors of the Platform.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2
              className="text-xl md:text-2xl font-bold text-navy mb-3"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              2. Eligibility
            </h2>
            <p className="text-navy/80 leading-relaxed mb-3">
              To use our services, you must:
            </p>
            <ul className="list-disc list-inside space-y-2 text-navy/80 leading-relaxed ml-2">
              <li>Be at least 18 years of age</li>
              <li>Provide accurate and complete registration information</li>
              <li>
                Reside within Kozhikode district (our current delivery zone)
              </li>
              <li>Have the legal capacity to enter into binding contracts</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2
              className="text-xl md:text-2xl font-bold text-navy mb-3"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              3. Products & Pricing
            </h2>
            <p className="text-navy/80 leading-relaxed mb-3">
              We strive to provide accurate product descriptions, pricing, and
              availability information. However:
            </p>
            <ul className="list-disc list-inside space-y-2 text-navy/80 leading-relaxed ml-2">
              <li>Prices are subject to change without notice</li>
              <li>Product images are for illustration purposes only</li>
              <li>We reserve the right to limit quantities or cancel orders</li>
              <li>
                In case of pricing errors, we will notify you before processing
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2
              className="text-xl md:text-2xl font-bold text-navy mb-3"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              4. Orders & Payments
            </h2>
            <p className="text-navy/80 leading-relaxed mb-3">
              All orders are subject to acceptance and availability. By placing
              an order:
            </p>
            <ul className="list-disc list-inside space-y-2 text-navy/80 leading-relaxed ml-2">
              <li>You authorize us to charge your selected payment method</li>
              <li>We will send order confirmation via email/SMS</li>
              <li>We reserve the right to cancel orders suspected of fraud</li>
              <li>Payment must be completed before order processing</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2
              className="text-xl md:text-2xl font-bold text-navy mb-3"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              5. Delivery Policy
            </h2>
            <p className="text-navy/80 leading-relaxed mb-3">
              We currently deliver exclusively within Kozhikode district.
              Delivery terms include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-navy/80 leading-relaxed ml-2">
              <li>Estimated delivery times are provided but not guaranteed</li>
              <li>
                You must provide accurate delivery address and contact
                information
              </li>
              <li>Failed delivery attempts may result in order cancellation</li>
              <li>Delivery fees, if applicable, will be shown at checkout</li>
              <li>Minimum order amount may apply for free delivery</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2
              className="text-xl md:text-2xl font-bold text-navy mb-3"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              6. Returns & Refunds
            </h2>
            <p className="text-navy/80 leading-relaxed mb-3">
              Our return policy includes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-navy/80 leading-relaxed ml-2">
              <li>
                Perishable items cannot be returned unless damaged/spoiled
              </li>
              <li>
                Non-perishable items can be returned within 7 days of delivery
              </li>
              <li>Items must be unused and in original packaging</li>
              <li>Refunds will be processed within 5-7 business days</li>
              <li>Contact customer support for return authorization</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section>
            <h2
              className="text-xl md:text-2xl font-bold text-navy mb-3"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              7. User Responsibilities
            </h2>
            <p className="text-navy/80 leading-relaxed mb-3">
              As a user, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-navy/80 leading-relaxed ml-2">
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Notify us immediately of any unauthorized account access</li>
              <li>
                Not use the Platform for any illegal or unauthorized purpose
              </li>
              <li>Not interfere with or disrupt our services</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section>
            <h2
              className="text-xl md:text-2xl font-bold text-navy mb-3"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              8. Limitation of Liability
            </h2>
            <p className="text-navy/80 leading-relaxed">
              To the maximum extent permitted by law, BestDealBazar shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages, including without limitation, loss of profits,
              data, use, goodwill, or other intangible losses, resulting from
              your use of the Platform.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2
              className="text-xl md:text-2xl font-bold text-navy mb-3"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              9. Modifications to Terms
            </h2>
            <p className="text-navy/80 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes
              will be effective immediately upon posting to the Platform. Your
              continued use of the Platform after any changes constitutes
              acceptance of the modified terms. We will notify users of material
              changes via email or website notice.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2
              className="text-xl md:text-2xl font-bold text-navy mb-3"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              10. Governing Law
            </h2>
            <p className="text-navy/80 leading-relaxed">
              These terms shall be governed by and construed in accordance with
              the laws of India, without regard to its conflict of law
              provisions. Any disputes arising under these terms shall be
              subject to the exclusive jurisdiction of the courts in Kozhikode,
              Kerala.
            </p>
          </section>

          {/* Contact Section */}
          <section className="bg-surface/30 rounded-2xl p-6 md:p-8 mt-8">
            <h2
              className="text-xl md:text-2xl font-bold text-navy mb-4"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              Have Questions?
            </h2>
            <p className="text-navy/80 leading-relaxed mb-4">
              If you have any questions about these Terms & Conditions, please
              contact us:
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-navy/80">
                📧 <strong>Email:</strong> legal@bestdealbazar.com
              </p>
              <p className="text-navy/80">
                📞 <strong>Phone:</strong> +91 12345 67890
              </p>
              <p className="text-navy/80">
                🏢 <strong>Address:</strong> Kozhikode, Kerala, India
              </p>
            </div>
          </section>
        </div>

        {/* Footer note */}
        <div className="mt-12 pt-6 text-center text-xs text-navy/50 border-t border-surface">
          <p>
            By using BestDealBazar, you acknowledge that you have read,
            understood, and agree to these Terms & Conditions.
          </p>
        </div>
      </div>
    </div>
  );
}
