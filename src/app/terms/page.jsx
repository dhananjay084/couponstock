// src/app/terms/page.jsx
import React from 'react';
import Banner from '../../components/Minor/Banner';
import HeadingText from '../../components/Minor/HeadingText';
import bannerImage from '@/assets/banner-image.webp';

const TermsPage = () => {
  return (
    <div>
      {/* <Banner
             Text="Great deals aren’t luck they’re a"
             ColorText="lifestyle"
             BgImage='https://assets.indiadesire.com/images/Flipkart%20BBD%202025.jpg'
           /> */}

      <HeadingText
        title="MyCouponStock Terms & Conditions"
        content={`
          <h2>Welcome to MyCouponStock</h2>
          <p>
            MyCouponStock ("we", "us", or "our") provides users with access to a digital coupon marketplace in India through <a href="https://mycouponstock.com">www.mycouponstock.com</a> and related services ("Services").
          </p>
          <p>
            By using our Services, you agree to these Terms and Conditions. If you do not agree, please discontinue use of the Services.
          </p>
          <p>
            For privacy-related concerns, please see our <a href="/privacy">Privacy Policy</a>. If you have any questions, feel free to <a href="/contact">contact us</a>.
          </p>

          <h2>Unauthorized Use</h2>
          <p>
            You may not reproduce, distribute, sell, publish, or exploit any part of our website or Services without explicit permission.
          </p>

          <h2>Introduction</h2>
          <p>
            We offer coupons and discounts created by third-party merchants. These offers are subject to availability and expiration. Users are encouraged to check back frequently.
          </p>

          <h2>Definitions</h2>
          <ul>
            <li><strong>"Login":</strong> Enables users to register and access special features.</li>
            <li><strong>"User":</strong> Any individual visiting or using the site.</li>
          </ul>

          <h2>Participation & Registration</h2>
          <p>Certain features require registration. You must:</p>
          <ul>
            <li>Provide accurate and current information</li>
            <li>Maintain your credentials securely</li>
            <li>Report any unauthorized use</li>
          </ul>

          <h2>Password & Account Security</h2>
          <p>
            You are solely responsible for your account and password. We are not liable for any misuse or unauthorized access resulting from your failure to protect your credentials.
          </p>

          <h2>User-Generated Content</h2>
          <p>By submitting content, you confirm you have the rights to do so and that it complies with applicable laws. Prohibited content includes:</p>
          <ul>
            <li>Pornography, explicit or offensive material</li>
            <li>Hate speech, abusive or violent content</li>
            <li>Illegal, defamatory, or malicious content</li>
            <li>Political, religious, or spam-based content</li>
          </ul>

          <h2>Membership Terms</h2>
          <ul>
            <li>Membership is granted through registration and acceptance of these Terms.</li>
            <li>Running paid ads (e.g. Google, Facebook) redirecting to MyCouponStock is strictly prohibited.</li>
            <li>Violators may be suspended or permanently banned without notice.</li>
          </ul>

          <h2>Declaration</h2>
          <p>
            Purchases made must be for personal use only. Any suspected misuse (e.g. reselling, fraudulent activities) will result in account suspension or termination without prior notice.
          </p>

          <h2>License to MyCouponStock</h2>
          <p>
            You grant us a non-exclusive, royalty-free license to use your submitted content for the operation of our Services.
          </p>

          <h2>Acceptable Use</h2>
          <p>Prohibited activities include:</p>
          <ul>
            <li>Sharing credentials or creating multiple accounts</li>
            <li>Using bots or automation tools</li>
            <li>Introducing malware or hacking attempts</li>
            <li>Misleading or illegal content uploads</li>
            <li>Commercial use or redistribution of our content</li>
          </ul>

          <h2>Accuracy of Offers</h2>
          <p>
            MyCouponStock does not guarantee the availability or accuracy of offers. Merchants may change or discontinue them at their discretion.
          </p>

          <h2>Trademarks</h2>
          <p>
            All trademarks and brand features of MyCouponStock are the property of Octaads Media and may not be used without permission.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            All content, including user-submitted material, is either owned by or licensed to MyCouponStock. Unauthorized copying or redistribution is strictly prohibited and may invite legal action.
          </p>

          <h2>Cashback Services</h2>
          <p>
            Registered users can earn cashback from Retailers for qualifying purchases. Cashback is payable only after the Retailer confirms the transaction and the return window has expired.
          </p>
          <p>
            If the Retailer does not confirm the purchase, no cashback will be paid.
          </p>

          <h2>Reward Program</h2>
          <p>
            Some partners offer Rewards instead of cashback. These can be redeemed only as gift cards or wallet credits—not as cash transfers.
          </p>

          <h2>Disclaimer & Limitations</h2>
          <h3>Disclaimer</h3>
          <p>
            Services are provided "as is." We make no guarantees or warranties.
          </p>
          <h3>Release</h3>
          <p>
            We are not responsible for your interactions with merchants.
          </p>
          <h3>Limitation of Liability</h3>
          <p>
            We are not liable for any damages (direct, indirect, incidental, etc.) related to your use of the Services.
          </p>

          <h2>Restricted Access</h2>
          <p>
            We reserve the right to restrict or revoke access at any time. If misuse or a breach is detected, we may immediately suspend your account.
          </p>

          <h2>Changes to the Agreement</h2>
          <p>
            We may modify this agreement periodically. Material changes will be effective 3 days after posting. Non-material changes may take effect immediately.
          </p>
          <p>
            Continued use of the Service constitutes acceptance of any changes. If you do not agree, you may stop using our Services and <a href="/contact">contact us</a>.
          </p>

          <h2>Governing Law</h2>
          <p>
            These Terms are governed by Indian law. You agree to the non-exclusive jurisdiction of Indian courts for resolving disputes.
          </p>

          <h2>Contact Us</h2>
          <p>If you have questions or need help, <a href="/contact">contact us</a>.</p>

          <address>
            <strong>Represented by:</strong> Shahnawaz Khan<br />
            <strong>Registration Number:</strong> 20AAHFO6442PIZO<br />
            <strong>Email:</strong> Shahnawazkhan@mycouponstock.com<br />
            <strong>Address:</strong> C/O Mahesh Sureka, Near Kali Mandir, Madigodam, Manaitand, Dhanbad, Jharkhand, 82601
          </address>
        `}
        isHtml={true}
      />
    </div>
  );
};

export default TermsPage;
