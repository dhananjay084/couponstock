import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | MyCouponStock",
  description:
    "Learn what data MyCouponStock collects, how it is used, shared, and the rights available to users under GDPR, UK GDPR, CCPA/CPRA, and India's DPDP Act.",
};

const Card = ({ id, title, children }) => (
  <section id={id} className="pro-card bg-white p-5 sm:p-6">
    <h2 className="text-lg font-extrabold tracking-tight text-[#2E1B59] sm:text-xl">
      {title}
    </h2>
    <div className="mt-3 space-y-3 text-sm leading-relaxed text-[#4A3C6A]">
      {children}
    </div>
  </section>
);

export default function PrivacyPage() {
  const lastUpdated = "17 April 2026";

  return (
    <main className="site-shell pb-10">
      <section className="mx-4 mt-4 overflow-hidden rounded-[26px] border border-[#E3D9FF] bg-[linear-gradient(120deg,#231147_0%,#3A1D78_45%,#5D31BD_100%)] px-5 py-7 text-white shadow-[0_20px_45px_rgba(36,16,82,0.3)] sm:mx-6 sm:px-8">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          Privacy Policy
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-white/85">
          MyCouponStock - Operated by <span className="font-semibold">Octaads Media</span>.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold">
            Last Updated {lastUpdated}
          </span>
          <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold">
            Response time: 30 days
          </span>
        </div>
        <p className="mt-4 max-w-3xl text-xs text-white/80">
          NOTE: <span className="font-semibold">Bold text</span> throughout this document
          indicates newly added or updated content per the compliance review.
        </p>
      </section>

      <div className="section-wrap mt-6 space-y-4 px-4 sm:space-y-5">
        <Card id="data-controller" title="1. Data Controller Information">
          <p>
            <span className="font-semibold">MyCouponStock</span> is owned and operated by:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <span className="font-semibold">Company Name:</span> Octaads Media
            </li>
            <li>
              <span className="font-semibold">Website:</span> www.mycouponstock.com
            </li>
            <li>
              <span className="font-semibold">Business Address:</span> 1, Plot, Coworkkeys, 2nd Floor,
              38, Golf Course Rd, near VATIKA TOWER, Saraswati Kunj, Suncity, Sector 54, Gurugram,
              Haryana 122011
            </li>
            <li>
              <span className="font-semibold">Contact Email:</span> support@mycouponstock.com
            </li>
            <li>
              <span className="font-semibold">Data Protection Officer (DPO) Email:</span>{" "}
              support@mycouponstock.com
            </li>
            <li>
              <span className="font-semibold">Response Time:</span> We aim to respond to all privacy
              requests within 30 days.
            </li>
          </ul>
        </Card>

        <Card id="introduction" title="2. Introduction">
          <p>
            <span className="font-semibold">MYCOUPONSTOCK</span> is owned and operated by Octaads
            Media. We are committed to protecting and respecting your privacy. This Privacy Policy
            explains what personal data we collect, how we use it, with whom we share it, and what
            rights you have - regardless of where you are located.
          </p>
          <p>
            Please read this policy carefully. By continuing to use mycouponstock.com, you agree to
            the practices described herein. If we update this policy, changes will be posted on this
            page with a revised <span className="font-semibold">"Last Updated"</span> date.
          </p>
        </Card>

        <Card id="information-we-collect" title="3. Information We Collect">
          <p>We may collect the following categories of personal data:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <span className="font-semibold">Directly Provided Data:</span> Name, email address, or
              other details you share via contact forms, newsletter sign-ups, or surveys.
            </li>
            <li>
              <span className="font-semibold">Usage & Behavioral Data:</span> Pages visited, coupons
              and deals clicked, time spent on pages, referral sources.
            </li>
            <li>
              <span className="font-semibold">Device & Technical Data:</span> Browser type, operating
              system, IP address, device identifiers, and screen resolution.
            </li>
            <li>
              <span className="font-semibold">Engagement Data:</span> Survey responses, feedback
              submissions, newsletter preferences.
            </li>
            <li>
              <span className="font-semibold">Cookie & Tracking Data:</span> Data collected via
              cookies, pixel tags, and similar technologies (see Cookie Policy).
            </li>
          </ul>
        </Card>

        <Card id="legal-basis" title="4. Legal Basis for Processing (GDPR)">
          <p>
            For users in the EU/EEA and UK, we process your personal data under the following legal
            bases:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <span className="font-semibold">Consent:</span> When you subscribe to our newsletter,
              accept cookies, or submit a contact form.
            </li>
            <li>
              <span className="font-semibold">Legitimate Interests:</span> For analytics, fraud
              prevention, security monitoring, and improving our services - where these interests are
              not overridden by your rights.
            </li>
            <li>
              <span className="font-semibold">Contractual Necessity:</span> To provide you access to
              coupons, deals, and services you request.
            </li>
            <li>
              <span className="font-semibold">Legal Obligation:</span> Where we are required to
              process data to comply with applicable law.
            </li>
          </ul>
        </Card>

        <Card id="use" title="5. How We Use Your Information">
          <ul className="list-disc space-y-1 pl-5">
            <li>Provide access to coupons, deals, and promotional offers.</li>
            <li>Personalize and improve user experience on the website.</li>
            <li>Analyze site performance and user behavior.</li>
            <li>Send newsletters or deal alerts (only if you have subscribed).</li>
            <li>Detect, investigate, and prevent fraudulent activity or misuse.</li>
            <li>Comply with applicable legal obligations.</li>
            <li>Track affiliate link clicks and validate purchases through partner networks.</li>
          </ul>
        </Card>

        <Card id="sharing" title="6. Sharing of Information">
          <p>Your information may be shared only under the following circumstances:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <span className="font-semibold">Service Providers:</span> Third-party providers who
              assist with hosting, analytics, email delivery, and customer support - bound by
              confidentiality obligations.
            </li>
            <li>
              <span className="font-semibold">Affiliate & Ad Partners:</span> To track coupon clicks,
              validate purchases, and serve relevant advertising. Partners include{" "}
              <span className="font-semibold">Google Analytics</span>,{" "}
              <span className="font-semibold">Google Ads</span>, and affiliate networks.
            </li>
            <li>
              <span className="font-semibold">Legal Requirements:</span> If required by law
              enforcement, regulatory authorities, or a valid legal process.
            </li>
            <li>
              <span className="font-semibold">Business Transfers:</span> In the event of a merger,
              acquisition, or sale of assets, user data may be transferred as part of that
              transaction.
            </li>
            <li>
              <span className="font-semibold">Aggregated/Anonymized Data:</span> We may share
              statistical, non-identifiable data for research or business purposes.
            </li>
          </ul>
          <p className="font-semibold">
            Important: We do not sell personal information for monetary value. However, sharing data
            with advertising or affiliate partners may constitute a 'sale' or 'share' under CCPA.
            See Section 16 for California rights.
          </p>
        </Card>

        <Card id="affiliate" title="7. Affiliate Disclosure">
          <p>
            MyCouponStock is an affiliate marketing website. We may earn commissions when users click
            affiliate links or make purchases through our partner merchants. This comes at no
            additional cost to you.
          </p>
          <p>
            We may receive compensation from financial partners, retailers, apps, or service
            providers featured on this website.
          </p>
          <p>
            This disclosure complies with the US Federal Trade Commission (FTC) guidelines, ASA
            guidelines (UK), EU Directive 2005/29/EC, and the Consumer Protection Act (India). All
            sponsored or affiliate content will be clearly labeled as{" "}
            <span className="font-semibold">'Ad'</span>,{" "}
            <span className="font-semibold">'Sponsored'</span>, or{" "}
            <span className="font-semibold">'Affiliate'</span> where required by applicable law.
          </p>
        </Card>

        <Card id="cookies" title="8. Cookies & Tracking">
          <p>
            We use cookies and similar tracking technologies. Please read our separate Cookie Policy
            for full details. In summary:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <span className="font-semibold">Essential Cookies:</span> Required for the website to
              function.
            </li>
            <li>
              <span className="font-semibold">Analytics Cookies:</span> Help us understand how
              visitors interact with our site (e.g., Google Analytics).
            </li>
            <li>
              <span className="font-semibold">Advertising / Affiliate Cookies:</span> Track affiliate
              clicks and serve relevant ads.
            </li>
            <li>
              <span className="font-semibold">Preference Cookies:</span> Remember your settings and
              preferences.
            </li>
          </ul>
          <p className="font-semibold">
            EU/UK Cookie Consent: Users will be presented with a cookie consent banner before any
            non-essential cookies are activated. You may accept, reject, or manage preferences at any
            time.
          </p>
        </Card>

        <Card id="retention" title="9. Data Retention">
          <p>
            We retain your personal data only as long as necessary for the purposes described in
            this policy:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <span className="font-semibold">Analytics Data:</span> Retained for up to 26 months,
              then anonymized or deleted.
            </li>
            <li>
              <span className="font-semibold">Email Subscriptions:</span> Retained until you
              unsubscribe. Suppression records may be kept to prevent re-sending.
            </li>
            <li>
              <span className="font-semibold">Contact Form Enquiries:</span> Retained for up to 12
              months, then securely deleted.
            </li>
            <li>
              <span className="font-semibold">Affiliate Tracking Data:</span> Retained for the
              duration required by partner network agreements (typically 30-90 days).
            </li>
            <li>
              <span className="font-semibold">Legal Compliance Records:</span> May be retained for up
              to 7 years where required by law.
            </li>
          </ul>
          <p>When data is no longer required, it is securely deleted or anonymized.</p>
        </Card>

        <Card id="transfers" title="10. International Data Transfers">
          <p>
            MyCouponStock operates globally. Your personal data may be transferred to, stored in, or
            processed in countries outside your home country - including countries that may not have
            equivalent data protection laws.
          </p>
          <p>Where such transfers occur, we ensure adequate safeguards are in place, including:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Standard Contractual Clauses (SCCs) approved by the European Commission.</li>
            <li>Use of hosting and processing partners with certified security frameworks.</li>
            <li>Adequacy decisions by relevant data protection authorities, where applicable.</li>
          </ul>
        </Card>

        <Card id="third-party" title="11. Third-Party Services">
          <p>We work with third-party services that may collect data directly or through cookies:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Google Analytics: Web analytics (data may be transferred to the USA).</li>
            <li>Google Ads: Advertising and remarketing.</li>
            <li>
              Affiliate Networks: Including CJ Affiliate, Rakuten, Impact, ShareASale, and similar
              platforms.
            </li>
            <li>Email Service Providers: For newsletter delivery.</li>
            <li>Hosting Providers: For server infrastructure and CDN services.</li>
          </ul>
          <p>Each of these services operates under its own privacy policy.</p>
        </Card>

        <Card id="security" title="12. Data Security">
          <p>
            We implement appropriate technical and organizational measures to protect your personal
            data against unauthorized access, loss, or destruction, including:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <span className="font-semibold">Encryption:</span> Data is encrypted in transit using
              TLS/SSL protocols.
            </li>
            <li>
              <span className="font-semibold">Secure Servers:</span> Hosted on trusted,
              security-certified infrastructure.
            </li>
            <li>
              <span className="font-semibold">Access Control:</span> Restricted access to personal
              data on a need-to-know basis.
            </li>
            <li>
              <span className="font-semibold">Regular Audits:</span> Periodic security reviews and
              vulnerability assessments.
            </li>
          </ul>
          <p>
            Despite these measures, no transmission over the internet is completely secure. We cannot
            guarantee absolute security.
          </p>
        </Card>

        <Card id="children" title="13. Children's Privacy">
          <p>
            We do not knowingly collect personal data from children under 13 years of age (USA -
            COPPA) or under 16 years of age (EU - GDPR). If you are a parent or guardian and believe
            your child has provided personal information, please contact us immediately and we will
            take steps to delete the information.
          </p>
        </Card>

        <Card id="gdpr-rights" title="14. Your Rights Under GDPR (EU/EEA)">
          <p>
            If you are in the EU or EEA, you have the following rights under the General Data
            Protection Regulation:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Access - Request a copy of your personal data.</li>
            <li>Rectification - Correct inaccurate or incomplete data.</li>
            <li>Erasure - Request deletion of your data.</li>
            <li>Restriction - Limit how we process your data.</li>
            <li>Portability - Receive your data in a portable format.</li>
            <li>Object - Opt-out of certain processing activities.</li>
            <li>Withdraw Consent - Revoke consent at any time.</li>
          </ul>
          <p className="font-semibold">
            Right to Lodge a Complaint: You have the right to lodge a complaint with your local data
            protection authority.
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>France: CNIL - www.cnil.fr</li>
            <li>Germany: BfDI - www.bfdi.bund.de</li>
            <li>Spain: AEPD - www.aepd.es</li>
            <li>Portugal: CNPD - www.cnpd.pt</li>
          </ul>
        </Card>

        <Card id="uk-rights" title="15. Your Rights Under United Kingdom (UK GDPR)">
          <p>
            If you are located in the United Kingdom, your privacy rights are governed by the UK
            GDPR and the Data Protection Act 2018. You hold the same rights as EU residents listed in
            Section 14.
          </p>
          <p className="font-semibold">
            To lodge a complaint, contact the UK's data protection authority:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Information Commissioner's Office (ICO)</li>
            <li>Website: ico.org.uk</li>
            <li>Helpline: 0303 123 1113</li>
          </ul>
        </Card>

        <Card id="ccpa" title="16. Your Rights Under California, USA (CCPA / CPRA)">
          <p>California residents have the following rights under CCPA and CPRA:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Right to Know: What personal information we collect, use, and share (12-month disclosure).</li>
            <li>Right to Delete - Remove your personal data.</li>
            <li>
              Right to Opt-Out: Of the sale or sharing of your personal information. See the{" "}
              <span className="font-semibold">"Do Not Sell or Share My Personal Information"</span>{" "}
              link on our website.
            </li>
            <li>Right to Correct: Fix inaccurate personal information.</li>
            <li>Right to Non-Discrimination - Equal service regardless of rights exercised.</li>
          </ul>
          <p className="font-semibold">Categories of Data Collected (12-Month Disclosure)</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Identifiers: Email address, IP address, device ID.</li>
            <li>Internet Activity: Browsing behavior, coupon clicks.</li>
            <li>Geolocation: Approximate location via IP address.</li>
            <li>Commercial Information: Purchase inferences via affiliate tracking.</li>
          </ul>
        </Card>

        <Card id="india" title="17. Your Rights India - Digital Personal Data Protection Act, 2023 (DPDP Act)">
          <p>
            We comply with the Digital Personal Data Protection Act, 2023 (DPDP Act) and the
            Information Technology Act, 2000, and its SPDI Rules.
          </p>
          <p className="font-semibold">
            As a Data Fiduciary under the DPDP Act, Octaads Media:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Processes personal data only on the basis of free, informed, specific, and unconditional
              consent.
            </li>
            <li>Maintains accuracy of personal data and limits processing to specified purposes.</li>
            <li>Implements reasonable security safeguards.</li>
            <li>Erases data when the purpose is fulfilled or consent is withdrawn.</li>
          </ul>
          <p className="font-semibold">Your Rights under the DPDP Act:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Right to access information about personal data and its processing.</li>
            <li>Right to correction and erasure of personal data.</li>
            <li>Right to grievance redressal - contact: support@mycouponstock.com</li>
            <li>Right to nominate a person to exercise rights on your behalf.</li>
          </ul>
        </Card>

        <Card id="sensitive" title="18. Sensitive Data">
          <p>
            We do not intentionally collect or process sensitive personal data, including health
            information, biometric data, racial or ethnic origin, religious beliefs, political
            opinions, or sexual orientation.
          </p>
          <p>
            We do not collect sensitive financial information such as bank account details or credit
            card numbers. Financial transactions are handled directly by third-party merchant partners.
          </p>
        </Card>

        <Card id="financial-gaming" title="19. Financial & Gaming Content Disclaimer">
          <p className="font-semibold">
            Where mycouponstock.com features promotions related to financial products (credit cards,
            loans, BNPL, investment apps, crypto):
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Not Financial Advice: Content is for informational purposes only and does not constitute financial advice.</li>
            <li>Risk Disclosure: Financial products involve risk. Past performance is not indicative of future results.</li>
            <li>Third-Party Responsibility: We are not responsible for the terms or accuracy of third-party financial partner offers.</li>
            <li>No Guarantee: We make no guarantee of approval, rates, or outcomes.</li>
            <li>Not an Offer to Lend: This website is not an offer to lend money or provide financial services.</li>
            <li>Compensation Disclosure: We may receive compensation from financial partners featured on this website.</li>
          </ul>
          <p className="font-semibold">Gaming & Gambling:</p>
          <p>
            MyCouponStock is a coupon and deals aggregation platform. We do not promote, endorse, or
            feature any gambling, gaming, betting, fantasy sports, or sweepstakes-related content on
            this website. We accept no liability for losses incurred from gambling or gaming
            activities. Gaming offers may not be available in all jurisdictions.
          </p>
        </Card>

        <Card id="changes" title="20. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page
            with an updated <span className="font-semibold">'Last Updated'</span> date. Continued use
            of the website after changes constitutes your acceptance.
          </p>
        </Card>

        <Card id="contact" title="21. Contact Us">
          <p>
            If you have questions about this policy or wish to exercise your rights, contact us:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <span className="font-semibold">Company:</span> MyCouponStock (operated by Octaads Media)
            </li>
            <li>
              <span className="font-semibold">Email:</span> support@mycouponstock.com
            </li>
            <li>
              <span className="font-semibold">Address:</span> 1, Plot, Coworkkeys, 2nd Floor, 38, Golf
              Course Rd, near VATIKA TOWER, Saraswati Kunj, Suncity, Sector 54, Gurugram, Haryana
              122011
            </li>
          </ul>
          <p>
            Prefer web form? Visit{" "}
            <Link href="/contact" className="font-semibold text-[#5B3CC4] hover:underline">
              Contact Us
            </Link>
            .
          </p>
        </Card>
      </div>
    </main>
  );
}
