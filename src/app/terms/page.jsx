// src/app/terms/page.jsx
import React from "react";
import HeadingText from "../../components/Minor/HeadingText";

const TermsPage = () => {
  return (
    <div className="w-full flex justify-center py-12 px-4 md:px-6 lg:px-10">

        <HeadingText
          title="MyCouponStock Terms & Conditions"
          content={`
          <div style="line-height: 1.75; font-size: 16px; color:#333;">
          
          <h2 style="margin-top: 30px;">Welcome to MyCouponStock</h2>
          <p>
            MyCouponStock ("we", "us", or "our") provides users with access to a digital coupon marketplace in India through 
            <a href="https://mycouponstock.com" target="_blank" style="color:#0056D2;"> www.mycouponstock.com</a> and related services ("Services").
          </p>
          <p>
            By using our Services, you agree to these Terms and Conditions. If you do not agree, please discontinue use of the Services.
          </p>
          <p>
            For privacy-related concerns, please see our 
            <a href="/privacy" style="color:#0056D2;"> Privacy Policy</a>. 
            If you have any questions, feel free to <a href="/contact" style="color:#0056D2;">contact us</a>.
          </p>

          <h2 style="margin-top: 35px;">Unauthorized Use</h2>
          <p>You may not reproduce, distribute, sell, publish, or exploit any part of our website or Services without explicit permission.</p>

          <h2 style="margin-top: 35px;">Introduction</h2>
          <p>
            We offer coupons and discounts created by third-party merchants. These offers are subject to availability and expiration. 
            Users are encouraged to check back frequently.
          </p>

          <h2 style="margin-top: 35px;">Definitions</h2>
          <ul>
            <li><strong>"Login":</strong> Enables users to register and access special features.</li>
            <li><strong>"User":</strong> Any individual visiting or using the site.</li>
          </ul>

          <h2 style="margin-top: 35px;">Participation & Registration</h2>
          <p>Certain features require registration. You must:</p>
          <ul>
            <li>Provide accurate and current information</li>
            <li>Maintain your credentials securely</li>
            <li>Report any unauthorized use</li>
          </ul>

          <h2 style="margin-top: 35px;">Password & Account Security</h2>
          <p>You are solely responsible for your account and password.</p>

          <h2 style="margin-top: 35px;">User-Generated Content</h2>
          <p>Prohibited submissions include:</p>
          <ul>
            <li>Pornographic or offensive content</li>
            <li>Hate speech</li>
            <li>Illegal or abusive content</li>
            <li>Political, religious, or spam-based submissions</li>
          </ul>

          <h2 style="margin-top: 35px;">Membership Terms</h2>
          <ul>
            <li>Membership is granted upon acceptance of these Terms.</li>
            <li>Running paid ads redirecting to MyCouponStock is prohibited.</li>
            <li>Violations may lead to suspension or permanent ban.</li>
          </ul>

          <h2 style="margin-top: 35px;">Declaration</h2>
          <p>Purchases must be for personal use only. Misuse may result in suspension.</p>

          <h2 style="margin-top: 35px;">License to MyCouponStock</h2>
          <p>You grant us a royalty-free license to use submitted content for platform operations.</p>

          <h2 style="margin-top: 35px;">Acceptable Use</h2>
          <ul>
            <li>No bots or automated tools</li>
            <li>No hacking attempts</li>
            <li>No misleading content</li>
            <li>No unauthorized redistribution</li>
          </ul>

          <h2 style="margin-top: 35px;">Accuracy of Offers</h2>
          <p>We do not guarantee availability or accuracy of offers.</p>

          <h2 style="margin-top: 35px;">Trademarks</h2>
          <p>All trademarks belong to Octaads Media and cannot be used without permission.</p>

          <h2 style="margin-top: 35px;">Intellectual Property</h2>
          <p>All content is owned or licensed. Copying without permission will lead to legal action.</p>

          <h2 style="margin-top: 35px;">Cashback Services</h2>
          <p>Cashback is only paid after confirmation from Retailers.</p>

          <h2 style="margin-top: 35px;">Reward Program</h2>
          <p>Rewards may be redeemed as gift cards or wallet credits.</p>

          <h2 style="margin-top: 35px;">Disclaimer & Limitations</h2>
          <h3>Disclaimer</h3>
          <p>Services are offered “as is.”</p>
          <h3>Limitation of Liability</h3>
          <p>We are not liable for any damages resulting from use of Services.</p>

          <h2 style="margin-top: 35px;">Restricted Access</h2>
          <p>We may suspend access for misuse or breach.</p>

          <h2 style="margin-top: 35px;">Changes to the Agreement</h2>
          <p>We may modify Terms. Continued use means acceptance.</p>

          <h2 style="margin-top: 35px;">Governing Law</h2>
          <p>Governed by Indian laws and jurisdiction.</p>

          <h2 style="margin-top: 35px;">Contact Us</h2>
          <p>If you have questions, <a href="/contact" style="color:#0056D2;">contact us</a>.</p>

          <address style="margin-top: 20px; line-height: 1.7;">
            <strong>Represented by:</strong> Shahnawaz Khan<br />
            <strong>Registration Number:</strong> 20AAHFO6442PIZO<br />
            <strong>Email:</strong> Shahnawazkhan@mycouponstock.com<br />
            <strong>Address:</strong> C/O Mahesh Sureka, Near Kali Mandir, Madigodam, Manaitand, Dhanbad, Jharkhand, 82601
          </address>

          </div>
        `}
        isHtml={true}
      />
    </div>
  );
};

export default TermsPage;
