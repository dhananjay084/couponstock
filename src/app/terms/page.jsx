import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | MyCouponStock",
  description:
    "Terms and conditions for using MyCouponStock, including affiliate disclosures, permitted use, limitations of liability, and governing law.",
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

export default function TermsPage() {
  const lastUpdated = "17 April 2026";

  return (
    <main className="site-shell pb-10">
      <section className="mx-4 mt-4 overflow-hidden rounded-[26px] border border-[#E3D9FF] bg-[linear-gradient(120deg,#231147_0%,#3A1D78_45%,#5D31BD_100%)] px-5 py-7 text-white shadow-[0_20px_45px_rgba(36,16,82,0.3)] sm:mx-6 sm:px-8">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          Terms & Conditions
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-white/85">
          MyCouponStock — Operated by <span className="font-semibold">Octaads Media</span>.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold">
            Last Updated {lastUpdated}
          </span>
        </div>
      </section>

      <div className="section-wrap mt-6 space-y-4 px-4 sm:space-y-5">
        <Card id="acceptance" title="1. Acceptance of Terms">
          <p>
            By accessing or using MyCouponStock (the{" "}
            <span className="font-semibold">"Website"</span>), you agree to be bound by these Terms &
            Conditions, our{" "}
            <Link href="/privacy" className="font-semibold text-[#5B3CC4] hover:underline">
              Privacy Policy
            </Link>
            , and our Cookie Policy.
          </p>
          <p>
            These Terms constitute a legally binding agreement between you and Octaads Media, the
            owner and operator of MyCouponStock.
          </p>
        </Card>

        <Card id="about" title="2. About MyCouponStock">
          <p>
            MyCouponStock.com is an affiliate marketing and deal-aggregation website. We curate and
            publish discount codes, coupons, cashback offers, and promotional deals from third-party
            merchants. We do not sell products or services directly.
          </p>
          <p>
            We may earn affiliate commissions when users click links or complete purchases through
            our website. See Section 5 for full affiliate disclosure.
          </p>
        </Card>

        <Card id="eligibility" title="3. Eligibility & Age Restrictions">
          <p>By using this Website, you represent that you are at least 18 years of age.</p>
          <p>
            We do not knowingly provide services to individuals under 13 (USA) or under 16 (EU/UK).
          </p>
          <p className="font-semibold">Age-Restricted Content:</p>
          <p>
            Where the Website features promotions for gambling, gaming, alcohol, or financial
            products, you must be of the legal age required in your jurisdiction (18+ or 21+,
            depending on your location and local law).
          </p>
          <p>
            If you are accessing this Website from a jurisdiction where such content is prohibited,
            you do so at your own risk and must comply with your local laws.
          </p>
        </Card>

        <Card id="permitted-use" title="4. Permitted Use of the Website">
          <p>You may use this Website for lawful, personal, non-commercial purposes only.</p>
          <p>You agree NOT to:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Copy, reproduce, distribute, or republish our content without prior written permission.</li>
            <li>Use automated tools, such as bots, scrapers, or crawlers, to extract data.</li>
            <li>Attempt to gain unauthorized access to our servers or databases.</li>
            <li>Submit false, misleading, or fraudulent information.</li>
            <li>Use the Website in any way that violates applicable laws.</li>
            <li>Transmit harmful, offensive, or spam content.</li>
            <li>Engage in any activity that disrupts or damages the Website.</li>
          </ul>
        </Card>

        <Card id="affiliate" title="5. Affiliate Links & Commissions">
          <p className="font-semibold">Affiliate Disclosure:</p>
          <p>
            MyCouponStock participates in affiliate marketing programs. We may earn a commission
            when you click a link or make a purchase through a partner merchant. This comes at no
            additional cost to you.
          </p>
          <p>
            Our affiliate partnerships include networks such as CJ Affiliate, Rakuten, Impact, and
            ShareASale, as well as direct merchant programs.
          </p>
          <p>
            This disclosure complies with the FTC's 16 CFR Part 255 (USA), ASA guidelines (UK), EU
            Directive 2005/29/EC on unfair commercial practices, and the Consumer Protection Act
            (India).
          </p>
          <p>
            All sponsored or affiliate content will be clearly labeled as{" "}
            <span className="font-semibold">'Ad'</span>,{" "}
            <span className="font-semibold">'Sponsored'</span>, or{" "}
            <span className="font-semibold">'Affiliate'</span> where required by applicable law.
          </p>
        </Card>

        <Card id="accuracy" title="6. Accuracy of Coupon Information">
          <p>We make reasonable efforts to ensure coupons and offers are accurate and up-to-date. However, we cannot guarantee:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>That any coupon or deal is valid or active at the time of use.</li>
            <li>The accuracy of discount amounts, expiry dates, or terms stated.</li>
            <li>That third-party merchants will honour the deals listed.</li>
          </ul>
          <p>Offers are subject to change without notice. We recommend verifying deal terms directly with the merchant.</p>
        </Card>

        <Card id="ip" title="7. Intellectual Property">
          <p>
            All content on MyCouponStock — including text, graphics, logos, icons, images, and software — is the property of Octaads Media or its licensors and is protected by applicable intellectual property laws.
          </p>
          <p>
            You may not reproduce, distribute, modify, or create derivative works from our content without prior written consent. Limited personal, non-commercial use is permitted.
          </p>
          <p>
            Third-party trademarks and logos displayed on this Website are the property of their respective owners. Their inclusion does not imply endorsement or affiliation.
          </p>
        </Card>

        <Card id="liability" title="8. Limitation of Liability">
          <p>
            To the maximum extent permitted by law, Octaads Media shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use this Website.
          </p>
          <p>This includes but is not limited to:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Loss resulting from expired or invalid coupon codes.</li>
            <li>Losses arising from purchases made through affiliate links.</li>
            <li>Losses arising from participation in financial products, gambling, or gaming promoted on this site.</li>
            <li>Damages resulting from unauthorized access to your data caused by third-party actions.</li>
          </ul>
          <p>
            Nothing in these Terms limits our liability for death, personal injury, fraud caused by our negligence, or any liability that cannot be excluded by law.
          </p>
        </Card>

        <Card id="disclaimers" title="9. Disclaimers">
          <p>
            The Website and all content are provided on an{" "}
            <span className="font-semibold">'as is'</span> and{" "}
            <span className="font-semibold">'as available'</span> basis without warranty of any kind, express or implied.
          </p>
          <p>We do not warrant that the Website will be uninterrupted, error-free, or free of viruses.</p>
        </Card>

        <Card id="financial-gaming" title="10. Financial & Gaming Content">
          <p className="font-semibold">Not Financial Advice:</p>
          <p>
            Any content relating to financial products (credit cards, loans, BNPL, investment apps, or cryptocurrency) is for informational purposes only and does not constitute financial, investment, or legal advice. Always seek independent financial advice before making financial decisions.
          </p>
          <p>
            Financial products involve risk. We make no guarantee of any financial outcome. This Website is not an offer to lend money or provide credit. APR and interest rate information is indicative only and subject to each provider's terms.
          </p>
          <p>We may receive compensation from financial partners featured on this Website.</p>
          <p className="font-semibold">Gaming & Gambling Content:</p>
          <p>
            MyCouponStock is a coupon and deals aggregation platform. We do not promote, endorse, or feature any gambling, gaming, betting, fantasy sports, or sweepstakes-related content on this website. We accept no liability for losses incurred from gambling or gaming activities.
          </p>
        </Card>

        <Card id="third-party-links" title="11. Third-Party Links">
          <p>
            This Website contains links to third-party websites. These links are provided for your convenience. We do not endorse or accept responsibility for the content, privacy practices, or terms of any third-party website.
          </p>
        </Card>

        <Card id="ugc" title="12. User-Generated Content">
          <p>
            If you submit content (e.g., comments, reviews, feedback), you grant Octaads Media a non-exclusive, royalty-free, worldwide licence to use and display that content in connection with our services.
          </p>
          <p>We reserve the right to remove any content that we deem inappropriate or in breach of these Terms.</p>
        </Card>

        <Card id="termination" title="13. Termination">
          <p>
            We reserve the right to suspend or terminate your access to the Website at any time, with or without notice, for conduct that violates these Terms or is harmful to us, our users, or third parties.
          </p>
        </Card>

        <Card id="law" title="14. Governing Law & Dispute Resolution">
          <p>
            These Terms are governed by the laws of India, Gurgaon, without regard to conflict of law principles.
          </p>
          <p className="font-semibold">For EU users:</p>
          <p>
            Nothing in these Terms affects your rights as a consumer under EU law. You may bring claims before local courts or use the EU's Online Dispute Resolution (ODR) platform: https://commission.europa.eu/index_en
          </p>
          <p className="font-semibold">For UK users:</p>
          <p>Your statutory rights under UK consumer law are unaffected by these Terms.</p>
        </Card>

        <Card id="changes" title="15. Changes to These Terms">
          <p>
            We reserve the right to update or modify these Terms at any time. Changes will be posted on this page with a revised{" "}
            <span className="font-semibold">"Last Updated"</span> date. Continued use of the website after changes constitutes acceptance of the updated Terms.
          </p>
        </Card>

        <Card id="contact" title="16. Contact Us">
          <p>For any questions regarding these Terms:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <span className="font-semibold">Company:</span> MyCouponStock (operated by Octaads Media)
            </li>
            <li>
              <span className="font-semibold">Email:</span> support@mycouponstock.com
            </li>
            <li>
              <span className="font-semibold">Address:</span> 1, Plot, Coworkkeys, 2nd Floor, 38, Golf Course Rd, near VATIKA TOWER, Saraswati Kunj, Suncity, Sector 54, Gurugram, Haryana 122011
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
