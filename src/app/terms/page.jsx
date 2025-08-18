// src/app/terms/page.jsx
import React from 'react';
import Banner from '../../components/Minor/Banner';
import HeadingText from '../../components/Minor/HeadingText';
import bannerImage from '@/assets/banner-image.webp';

const TermsPage = () => {
  return (
    <div>
      <Banner
        Text="Every day we the most interesting things"
        ColorText="discuss"
        BgImage={bannerImage.src}
      />

      <HeadingText
        title="Mycouponstck Terms & Conditions"
        content={`

<p class="has-black-color has-text-color has-link-color wp-elements-77f7e837cf9f43bd9d82b9bbc484c45e">By using the <strong><a href="https://mycouponstock.com/">MyCouponstock</a></strong> application, you agree that you have read and understand this Agreement (‘Agreement‘) and that your membership in the Web shall confirm its terms and conditions. Failure to do so will result in your account being permanently locked, and you will no longer be eligible to claim any rewards or cashback collected in your <strong><a href="https://mycouponstock.com/contact/">MyCouponstock account.</a></strong></p>

<p class="has-vivid-red-color has-text-color has-link-color wp-elements-3b4e0f157d07fd91f2b961d6825c4b7e"><strong>“You agree to not do any fraud activity by communicating false information to the customers, and if anything of the sort happens, strict legal action will be taken against you.”</strong></p>

<ol class="wp-block-list">
<li>You agree to receive an OTP for verifying your mobile at the time of registration. The MyCouponstock web will verify your mobile number by sending an OTP (one-time password) to the mobile number provided, which will be automatically read by the app upon receiving the OTP message to complete the registration process.</li>

<li>You cannot register with multiple mobile numbers from a single mobile device with a single email id. Registering from multi-SIM devices using multiple numbers is strictly prohibited.</li>

<li>Mycouponstock cannot be used with Android emulators. All devices are being verified at multiple levels while availing of the offers. If found to be used with emulators or some other automated system, your account for your mobile number and device will be permanently locked.</li>

<li>Members agree to comply with the terms of all MyCouponstock and its advertiser and partner offers, promotions, and programs at all times.</li>

<li>No member is allowed to use or create a fake ID or provide any fake profile information for earning money.</li>

<li>The member agrees to promptly notify support@mycouponstock.com of any change in the member’s mobile number or address (mail or email) or personal profile by updating his or her personal information in the Profile section of mycouponstock.</li>

<li>Mycouponstock reserves the right to change this agreement and/or any part thereof at any time as required by the local laws of the land, the internet usage policy, the telecom regulatory policy, the Android user’s usage policy, and the Pocket Money Privacy Policy. Members understand the most recent version of this agreement will be located on the MyCouponstock website and/or mobile application in the Member Services area under Terms of Service.</li>

<li>Any return or shipping terms of third-party websites are not the responsibility of MyCouponstock. The consumer will not receive any cashback on their purchases if they return the order from the specific cashback store.</li>
</ol>

<h4 class="wp-block-heading has-luminous-vivid-orange-color has-text-color has-link-color wp-elements-a83d956dd29045d36dfa5d7c6e92da5e"><strong>Contact Us</strong></h4>

<h5 class="wp-block-heading has-text-color has-link-color wp-elements-41dcc433f703257b3e714b0566d0f5ce" style="color:#003655">Let’s get in touch</h5>

<p class="has-black-color has-text-color has-link-color wp-elements-b717c442c8a9b3b825dcb35dd7ec9d4a"><strong>Represented by:</strong> Shahnawaz Khan</p>

<p class="has-black-color has-text-color has-link-color wp-elements-6406c73c8203755e102915d088b37600"><strong><a href="https://octaadsmedia.com/contact-us/" target="_blank" rel="noopener" data-processed="1">Registration Number:</a></strong> 20AAHFO6442PIZO</p>

<p class="has-black-color has-text-color has-link-color wp-elements-5c7df5980f29922619647c671b046e8e"><strong>Email: Shahnawazkhan@mycouponstock.com</strong></p>

<p class="has-black-color has-text-color has-link-color wp-elements-7cf540a2b3a805bf93787da5de44df1c"><strong>Address:</strong>&nbsp;C/O Mahesh Sureka, Near Kali Mandir, Madigodam, Manaitand, Dhanbad, Jharkhand, 82601.</p>
`}
        isHtml={true}
      />
    </div>
  );
};

export default TermsPage;
