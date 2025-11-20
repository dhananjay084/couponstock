// src/app/privacy/page.jsx
import React from "react";
import HeadingText from "../../components/Minor/HeadingText";

const PrivacyPage = () => {
  const htmlContent = `
    <div style="line-height: 1.8; font-size: 16px; color: #333;">
      
      <p>We are committed to protecting and respecting your privacy. This policy (together with our website terms and conditions) sets out the basis on which any personal data we collect from you, or that you provide to us, will be processed. Please read it carefully to understand how we use your information.</p>

      <p>If we change our privacy policy, updates will be posted on this page with immediate effect. Continued use of the website will signify your agreement to those changes.</p>

      <p>If you have questions, please <a href="/contact" style="color:#0070f3;">contact us</a>.</p>

      <h2 style="margin-top: 35px; font-size: 22px; font-weight: 600;">Information We Collect</h2>
      <ul>
        <li><strong>Basic Details:</strong> Email address, name, or info shared via the contact form.</li>
        <li><strong>Usage Information:</strong> Pages visited, coupons clicked, time spent, referral links.</li>
        <li><strong>Device & Technical Data:</strong> Browser type, OS, IP address, device identifiers.</li>
        <li><strong>Engagement Data:</strong> Survey responses, feedback, newsletter subscriptions.</li>
      </ul>
      <p>We do not knowingly collect personal details from individuals under 18 years of age.</p>

      <h2 style="margin-top: 35px; font-size: 22px; font-weight: 600;">How We Use Your Information</h2>
      <ul>
        <li>Provide access to coupons, deals, and promotional offers.</li>
        <li>Improve user experience and personalize the website.</li>
        <li>Analyze site performance and user behavior.</li>
        <li>Send newsletters or updates (if subscribed).</li>
        <li>Detect and prevent fraud or misuse.</li>
        <li>Fulfill legal obligations.</li>
      </ul>

      <h2 style="margin-top: 35px; font-size: 22px; font-weight: 600;">Sharing of Information</h2>
      <p>Your information may be shared only under the following circumstances:</p>
      <ul>
        <li><strong>Service Providers:</strong> Hosting, analytics, emails, or support services.</li>
        <li><strong>Affiliate Partners:</strong> To track coupon clicks and validate purchases.</li>
        <li><strong>Legal Requirement:</strong> If requested by law enforcement or regulatory authorities.</li>
        <li><strong>Business Transfers:</strong> In case of mergers or acquisitions.</li>
        <li><strong>Aggregated Data:</strong> Only anonymized statistics.</li>
      </ul>
      <p><strong>We do not sell personal information for monetary value.</strong></p>

      <h2 style="margin-top: 35px; font-size: 22px; font-weight: 600;">Cookies & Tracking</h2>
      <p>We use cookies to improve functionality and personalize your experience.</p>
      <ul>
        <li>Remember your preferences.</li>
        <li>Analyze traffic and usage patterns.</li>
        <li>Serve relevant advertisements.</li>
      </ul>

      <h2 style="margin-top: 35px; font-size: 22px; font-weight: 600;">Your Rights Under GDPR (EU/EEA)</h2>
      <ul>
        <li><strong>Access</strong> – Request a copy of your data.</li>
        <li><strong>Rectification</strong> – Correct your data.</li>
        <li><strong>Erasure</strong> – Request deletion.</li>
        <li><strong>Restriction</strong> – Limit processing.</li>
        <li><strong>Portability</strong> – Download your data.</li>
        <li><strong>Object</strong> – Opt-out of certain processing.</li>
        <li><strong>Withdraw Consent</strong> – Anytime.</li>
      </ul>

      <h2 style="margin-top: 35px; font-size: 22px; font-weight: 600;">Your Rights Under CCPA/CPRA (California)</h2>
      <ul>
        <li><strong>Know</strong> – What data is collected.</li>
        <li><strong>Delete</strong> – Remove your data.</li>
        <li><strong>Opt-Out</strong> – Of sale/sharing of info.</li>
        <li><strong>Non-Discrimination</strong> – Equal service.</li>
        <li><strong>Correct</strong> – Fix inaccurate data.</li>
      </ul>

      <h2 style="margin-top: 35px; font-size: 22px; font-weight: 600;">Compliance with Indian IT Laws</h2>
      <p>We follow the IT Act 2000 and SPDI Rules.</p>
      <ul>
        <li>No sensitive personal data collected without consent.</li>
        <li>Data used only for the intended purpose.</li>
        <li>Security practices implemented.</li>
      </ul>

      <h2 style="margin-top: 35px; font-size: 22px; font-weight: 600;">Data Security & Retention</h2>
      <p>Your information is stored securely and protected from unauthorized access.</p>

      <h2 style="margin-top: 35px; font-size: 22px; font-weight: 600;">Email Subscriptions</h2>
      <p>If you subscribe, you may receive newsletters or deal alerts. You can unsubscribe anytime.</p>

      <h2 style="margin-top: 35px; font-size: 22px; font-weight: 600;">Changes to This Policy</h2>
      <p>Updates will be posted on this page with a revised “last updated” timestamp.</p>

      <h2 style="margin-top: 35px; font-size: 22px; font-weight: 600;">Contact Us</h2>
      <p>If you have privacy concerns, please reach out.</p>
      <address style="margin-top: 10px; font-style: normal;">
        📧 <a href="https://octaadsmedia.com/contact-us/" 
              target="_blank" 
              style="color:#0070f3; font-weight:600;">
              Contact Octaads Media
            </a><br />
        📍 Octaads Media
      </address>

    </div>
  `;

  return (
    <div className=" px-4 py-10">
      <HeadingText
        title="MYCOUPONSTOCK IS OWNED AND OPERATED BY OCTAADS MEDIA"
        content={htmlContent}
        isHtml={true}
      />
    </div>
  );
};

export default PrivacyPage;
