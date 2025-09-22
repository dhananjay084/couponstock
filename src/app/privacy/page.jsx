// src/app/privacy/page.jsx
import React from "react";
import Image from "next/image";
import Banner from "../../components/Minor/Banner";
import HeadingText from "../../components/Minor/HeadingText";
import bannerImage from "../../assets/banner-image.webp";

const PrivacyPage = () => {
  return (
    <div>
      {/* <Banner
        Text="Great deals aren’t luck they’re a"
        ColorText="lifestyle"
        BgImage='https://assets.indiadesire.com/images/Flipkart%20BBD%202025.jpg'
      /> */}

      <HeadingText
        title="MYCOUPONSTOCK IS OWNED AND OPERATED BY OCTAADS MEDIA. BY USING THE WEBSITE, YOU AGREE TO THE TERMS AND CONDITIONS OF THIS POLICY. IF YOU DO NOT AGREE WITH THE TERMS AND CONDITIONS OF THIS POLICY, PLEASE DO NOT PROCEED FURTHER TO USE THIS WEBSITE."
        content={`
          <p>We are committed to protecting and respecting your privacy. This policy (together with our website terms and conditions) sets out the basis on which any personal data we collect from you, or that you provide to us, will be processed. Please read it carefully to understand how we use your information.</p>

          <p>If we change our privacy policy, updates will be posted on this page with immediate effect. Continued use of the website will signify your agreement to those changes.</p>

          <p>If you have questions, please <a href="/contact">contact us</a>.</p>

          <h2>Information We Collect</h2>
          <p>When you interact with MyCouponStock, we may collect the following types of data:</p>
          <ul>
            <li><strong>Basic Details:</strong> Email address, name (if provided), or other info shared via our contact form.</li>
            <li><strong>Usage Information:</strong> Pages visited, coupons clicked, time spent, referral links.</li>
            <li><strong>Device & Technical Data:</strong> Browser type, OS, IP address, device identifiers.</li>
            <li><strong>Engagement Data:</strong> Survey responses, feedback, newsletter subscriptions.</li>
          </ul>
          <p>We do not knowingly collect personal details from individuals under 18 years of age.</p>

          <h2>How We Use Your Information</h2>
          <ul>
            <li>Provide access to coupons, deals, and promotional offers.</li>
            <li>Improve user experience through personalization.</li>
            <li>Analyze site performance and user engagement.</li>
            <li>Communicate updates, newsletters, or offers (if subscribed).</li>
            <li>Detect and prevent fraud or misuse.</li>
            <li>Fulfill legal or regulatory obligations.</li>
          </ul>

          <h2>Sharing of Information</h2>
          <p>Your information may be shared in the following ways:</p>
          <ul>
            <li><strong>Service Providers:</strong> For hosting, analytics, emails, or tech support.</li>
            <li><strong>Affiliate Partners & Advertisers:</strong> To track coupon clicks and validate purchases.</li>
            <li><strong>Legal Compliance:</strong> If required by law or legal process.</li>
            <li><strong>Business Transfers:</strong> In case of mergers, acquisitions, or restructuring.</li>
            <li><strong>Aggregated Data:</strong> Shared in anonymized form without identifying individuals.</li>
          </ul>
          <p><strong>We do not sell personal information for direct monetary value.</strong></p>

          <h2>Cookies & Tracking</h2>
          <p>We use cookies and similar technologies to:</p>
          <ul>
            <li>Remember your settings and preferences.</li>
            <li>Understand site usage and improve performance.</li>
            <li>Deliver relevant advertising.</li>
          </ul>
          <p>You can manage cookies via your browser settings. Disabling them may affect certain features.</p>

          <h2>Your Rights Under GDPR (EU/EEA Users)</h2>
          <p>If you are in the EU or EEA, you have the following rights:</p>
          <ul>
            <li><strong>Right to Access</strong>: Request a copy of your personal data.</li>
            <li><strong>Right to Rectification</strong>: Correct inaccurate data.</li>
            <li><strong>Right to Erasure</strong>: Ask us to delete your data.</li>
            <li><strong>Right to Restriction</strong>: Limit how we process your data.</li>
            <li><strong>Right to Portability</strong>: Receive your data in a structured format.</li>
            <li><strong>Right to Object</strong>: Opt out of certain types of processing.</li>
            <li><strong>Right to Withdraw Consent</strong>: Where processing is based on consent.</li>
          </ul>
          <p>To exercise your rights, please <a href="/contact">contact us</a>.</p>

          <h2>Your Rights Under CCPA/CPRA (California Users)</h2>
          <p>As a California resident, you are entitled to:</p>
          <ul>
            <li><strong>Right to Know</strong>: Learn what personal data we collect and use.</li>
            <li><strong>Right to Delete</strong>: Request deletion of your data, with exceptions.</li>
            <li><strong>Right to Opt-Out</strong>: Refuse the "sale" or "sharing" of your personal info.</li>
            <li><strong>Right to Non-Discrimination</strong>: No unfair treatment for exercising your rights.</li>
            <li><strong>Right to Correct</strong>: Request corrections to inaccurate data.</li>
          </ul>
          <p>Submit your request via our <a href="/contact">Contact Page</a> with "CCPA Request" in the subject.</p>

          <h2>Compliance with Indian Laws</h2>
          <p>We comply with the Information Technology Act, 2000 and SPDI Rules:</p>
          <ul>
            <li>We do not collect sensitive personal data without consent.</li>
            <li>Such data will only be used for its intended purpose and not shared without consent, unless legally required.</li>
            <li>We implement reasonable security practices to safeguard data.</li>
          </ul>

          <h2>Data Security & Retention</h2>
          <p>Your data is stored securely. We use appropriate safeguards to prevent unauthorized access, loss, or misuse.</p>
          <p>If you create an account, use a strong password and do not share it.</p>

          <h2>Email Subscriptions & Direct Mail</h2>
          <p>If you subscribe to our newsletter:</p>
          <ul>
            <li>You may receive emails with coupons, deals, or updates.</li>
            <li>You can unsubscribe at any time via the link in our emails or by <a href="/contact">contacting us</a>.</li>
          </ul>

          <h2>Changes to This Policy</h2>
          <p>We may revise this Privacy Policy. Updates will be posted here with a new "last updated" date.</p>
          <p>By continuing to use our services, you agree to the revised policy. If you have questions, please <a href="/contact">contact us</a>.</p>

          <h2>Contact Us</h2>
          <p>If you have privacy concerns or want to exercise your rights, please <a href="/contact">contact us</a>.</p>
          <address>
            📧 <a href="/contact">/contact</a><br />
            📍 Octaads Media
          </address>
        `}
        isHtml={true}
      />
    </div>
  );
};

export default PrivacyPage;
