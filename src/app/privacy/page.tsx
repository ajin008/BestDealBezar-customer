// app/privacy/page.tsx
import React from "react";
import Link from "next/link";
import {
  Calendar,
  Mail,
  Home,
  ArrowLeft,
  Shield,
  Eye,
  Database,
  Cookie,
  Bell,
  Lock,
} from "lucide-react";

export const metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for BestDealBazar - How we collect, use, and protect your data",
};

export default function PrivacyPage() {
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
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 md:w-10 md:h-10 text-brand" />
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              Privacy Policy
            </h1>
          </div>
          <p className="text-navy/70 text-lg mb-4">
            Your privacy matters to us. Learn how we collect, use, and protect
            your information.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-navy/60">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>Last updated: {lastUpdated}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4" />
              <span>privacy@bestdealbazar.com</span>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-brand/20 via-surface to-transparent mt-6" />
        </div>

        {/* Content sections */}
        <div className="space-y-8 md:space-y-10">
          {/* Section 1 */}
          <section className="bg-white/50 rounded-xl p-6 md:p-8">
            <div className="flex items-start gap-3">
              <Eye className="w-6 h-6 text-brand flex-shrink-0 mt-1" />
              <div>
                <h2
                  className="text-xl md:text-2xl font-bold text-navy mb-3"
                  style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                >
                  1. Information We Collect
                </h2>
                <p className="text-navy/80 leading-relaxed mb-3">
                  We collect information to provide better services to our
                  customers. The types of information we collect include:
                </p>
                <ul className="list-disc list-inside space-y-2 text-navy/80 leading-relaxed ml-2">
                  <li>
                    <strong>Personal Information:</strong> Name, email address,
                    phone number, delivery address
                  </li>
                  <li>
                    <strong>Account Information:</strong> Login credentials,
                    order history, preferences
                  </li>
                  <li>
                    <strong>Payment Information:</strong> Payment method details
                    (processed securely via third-party providers)
                  </li>
                  <li>
                    <strong>Usage Data:</strong> How you interact with our
                    Platform, browsing behavior
                  </li>
                  <li>
                    <strong>Device Information:</strong> IP address, browser
                    type, device identifiers
                  </li>
                  <li>
                    <strong>Location Data:</strong> To verify delivery
                    eligibility within Kozhikode district
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-white/50 rounded-xl p-6 md:p-8">
            <div className="flex items-start gap-3">
              <Database className="w-6 h-6 text-brand flex-shrink-0 mt-1" />
              <div>
                <h2
                  className="text-xl md:text-2xl font-bold text-navy mb-3"
                  style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                >
                  2. How We Use Your Information
                </h2>
                <p className="text-navy/80 leading-relaxed mb-3">
                  We use the collected information for the following purposes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-navy/80 leading-relaxed ml-2">
                  <li>Process and deliver your orders</li>
                  <li>Communicate order updates and delivery status</li>
                  <li>Personalize your shopping experience</li>
                  <li>Improve our products and services</li>
                  <li>Process payments and prevent fraud</li>
                  <li>Send promotional offers (with your consent)</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white/50 rounded-xl p-6 md:p-8">
            <div className="flex items-start gap-3">
              <Lock className="w-6 h-6 text-brand flex-shrink-0 mt-1" />
              <div>
                <h2
                  className="text-xl md:text-2xl font-bold text-navy mb-3"
                  style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                >
                  3. Data Security
                </h2>
                <p className="text-navy/80 leading-relaxed mb-3">
                  We implement industry-standard security measures to protect
                  your personal information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-navy/80 leading-relaxed ml-2">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure servers with firewall protection</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and authentication protocols</li>
                  <li>Data minimization principles</li>
                </ul>
                <p className="text-navy/80 leading-relaxed mt-3">
                  While we strive to protect your data, no method of
                  transmission over the internet is 100% secure.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-white/50 rounded-xl p-6 md:p-8">
            <div className="flex items-start gap-3">
              <Cookie className="w-6 h-6 text-brand flex-shrink-0 mt-1" />
              <div>
                <h2
                  className="text-xl md:text-2xl font-bold text-navy mb-3"
                  style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                >
                  4. Cookies & Tracking Technologies
                </h2>
                <p className="text-navy/80 leading-relaxed mb-3">
                  We use cookies and similar technologies to enhance your
                  browsing experience:
                </p>
                <ul className="list-disc list-inside space-y-2 text-navy/80 leading-relaxed ml-2">
                  <li>
                    <strong>Essential Cookies:</strong> Required for basic
                    Platform functionality
                  </li>
                  <li>
                    <strong>Preference Cookies:</strong> Remember your settings
                    and preferences
                  </li>
                  <li>
                    <strong>Analytics Cookies:</strong> Help us understand how
                    users interact with our Platform
                  </li>
                  <li>
                    <strong>Marketing Cookies:</strong> Used to deliver relevant
                    advertisements
                  </li>
                </ul>
                <p className="text-navy/80 leading-relaxed mt-3">
                  You can control cookie preferences through your browser
                  settings. However, disabling cookies may affect Platform
                  functionality.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-white/50 rounded-xl p-6 md:p-8">
            <div className="flex items-start gap-3">
              <Bell className="w-6 h-6 text-brand flex-shrink-0 mt-1" />
              <div>
                <h2
                  className="text-xl md:text-2xl font-bold text-navy mb-3"
                  style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                >
                  5. Information Sharing & Disclosure
                </h2>
                <p className="text-navy/80 leading-relaxed mb-3">
                  We do not sell your personal information. We may share your
                  information in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 text-navy/80 leading-relaxed ml-2">
                  <li>
                    <strong>Service Providers:</strong> Delivery partners,
                    payment processors, and IT services
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> To comply with
                    applicable laws and regulations
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In case of merger,
                    acquisition, or asset sale
                  </li>
                  <li>
                    <strong>With Your Consent:</strong> When you explicitly
                    authorize us to share
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-white/50 rounded-xl p-6 md:p-8">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-brand flex-shrink-0 mt-1" />
              <div>
                <h2
                  className="text-xl md:text-2xl font-bold text-navy mb-3"
                  style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                >
                  6. Your Rights & Choices
                </h2>
                <p className="text-navy/80 leading-relaxed mb-3">
                  You have the following rights regarding your personal
                  information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-navy/80 leading-relaxed ml-2">
                  <li>
                    <strong>Access:</strong> Request a copy of your personal
                    data
                  </li>
                  <li>
                    <strong>Correction:</strong> Update or correct inaccurate
                    information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your account
                    and data
                  </li>
                  <li>
                    <strong>Opt-out:</strong> Unsubscribe from marketing
                    communications
                  </li>
                  <li>
                    <strong>Data Portability:</strong> Receive your data in a
                    structured format
                  </li>
                </ul>
                <p className="text-navy/80 leading-relaxed mt-3">
                  To exercise these rights, contact us at
                  privacy@bestdealbazar.com.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section className="bg-white/50 rounded-xl p-6 md:p-8">
            <div className="flex items-start gap-3">
              <Database className="w-6 h-6 text-brand flex-shrink-0 mt-1" />
              <div>
                <h2
                  className="text-xl md:text-2xl font-bold text-navy mb-3"
                  style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                >
                  7. Data Retention
                </h2>
                <p className="text-navy/80 leading-relaxed">
                  We retain your personal information for as long as necessary
                  to fulfill the purposes outlined in this Privacy Policy,
                  unless a longer retention period is required or permitted by
                  law. When no longer needed, we securely delete or anonymize
                  your information.
                </p>
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section className="bg-white/50 rounded-xl p-6 md:p-8">
            <div className="flex items-start gap-3">
              <Eye className="w-6 h-6 text-brand flex-shrink-0 mt-1" />
              <div>
                <h2
                  className="text-xl md:text-2xl font-bold text-navy mb-3"
                  style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                >
                  8. Children&apos;s Privacy
                </h2>
                <p className="text-navy/80 leading-relaxed">
                  Our Platform is not intended for children under 18 years of
                  age. We do not knowingly collect personal information from
                  children. If you believe a child has provided us with personal
                  information, please contact us immediately.
                </p>
              </div>
            </div>
          </section>

          {/* Section 9 */}
          <section className="bg-white/50 rounded-xl p-6 md:p-8">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-brand flex-shrink-0 mt-1" />
              <div>
                <h2
                  className="text-xl md:text-2xl font-bold text-navy mb-3"
                  style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                >
                  9. Third-Party Links
                </h2>
                <p className="text-navy/80 leading-relaxed">
                  Our Platform may contain links to third-party websites. We are
                  not responsible for the privacy practices or content of these
                  external sites. We encourage you to review their privacy
                  policies before providing any personal information.
                </p>
              </div>
            </div>
          </section>

          {/* Section 10 */}
          <section className="bg-white/50 rounded-xl p-6 md:p-8">
            <div className="flex items-start gap-3">
              <Bell className="w-6 h-6 text-brand shrink-0 mt-1" />
              <div>
                <h2
                  className="text-xl md:text-2xl font-bold text-navy mb-3"
                  style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                >
                  10. Updates to This Privacy Policy
                </h2>
                <p className="text-navy/80 leading-relaxed">
                  We may update this Privacy Policy from time to time. Changes
                  will be posted on this page with an updated &quot;Last
                  updated&quot; date. For significant changes, we will notify
                  you via email or a prominent notice on our Platform.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-r from-brand/5 to-surface/30 rounded-2xl p-6 md:p-8 mt-4">
            <h2
              className="text-xl md:text-2xl font-bold text-navy mb-4"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              Questions About Privacy?
            </h2>
            <p className="text-navy/80 leading-relaxed mb-4">
              If you have any questions, concerns, or requests regarding this
              Privacy Policy or our data practices, please contact our Privacy
              Team:
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-navy/80">
                📧 <strong>Email:</strong> privacy@bestdealbazar.com
              </p>
              <p className="text-navy/80">
                📞 <strong>Phone:</strong> +91 12345 67890
              </p>
              <p className="text-navy/80">
                🏢 <strong>Address:</strong> Kozhikode, Kerala, India
              </p>
            </div>
            <div className="mt-4 p-3 bg-brand/10 rounded-lg">
              <p className="text-xs text-navy/70">
                <strong>Response Time:</strong> We aim to respond to all
                privacy-related inquiries within 48 hours.
              </p>
            </div>
          </section>
        </div>

        {/* Footer note */}
        <div className="mt-12 pt-6 text-center text-xs text-navy/50 border-t border-surface">
          <p>
            By using BestDealBazar, you consent to the collection and use of
            your information as described in this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
