// src/app/privacy/page.jsx
import React from "react";
import Image from "next/image";
import Banner from "../../components/Minor/Banner";
import HeadingText from "../../components/Minor/HeadingText";
import bannerImage from "../../assets/banner-image.webp";

const PrivacyPage = () => {
  return (
    <div>
      <Banner
        Text="Every day we the most interesting things"
        ColorText="discuss"
        BgImage={bannerImage.src}
      />

      <HeadingText
        title="MYCOUPONSTOCK IS OWNED AND OPERATED BY OCTAADS MEDIA. BY USING THE WEBSITE, YOU AGREE TO THE TERMS AND CONDITIONS OF THIS POLICY. IF YOU DO NOT AGREE WITH THE TERMS AND CONDITIONS OF THIS POLICY, PLEASE DO NOT PROCEED FURTHER TO USE THIS WEBSITE."
        content={`
<p class="has-black-color has-text-color">We are committed to protecting and respecting your privacy. This policy (together with our website terms and conditions that apply to your use of our website) sets in place the fundamentals based on which any personal data we collect from you or that you provide us will be processed. Please read the following points carefully to understand our views and practices regarding your personal data and how we will treat it.</p>

<p class="has-black-color has-text-color">If we change our privacy policy, then we will post the changes on this page with immediate effect and may place notices on other pages of the website. This will help you become aware of the information we collect and how we use it at all times. Continued use of the website will pertain to your agreement to any such changes. If you have any doubts regarding this policy or on how we use and process your personal information, please contact us by sending us an e-mail at <strong><a href="https://mycouponstock.com/contact/">Shahnawazkhan@mycouponstock.com</a></strong></p>

<p class="has-black-color has-text-color">We are the sole owners of the data collected on the website. We commit to not selling, sharing, or renting this information to others in ways different from those disclosed in this statement. We may collect and process the following data about you:</p>

<p class="has-black-color has-text-color">This includes information provided at the time of subscribing to our newsletter, posting discounts and other material, or contacting us. We may also store a record of correspondence when you contact us. We may ask for your information purely for surveys that we use for research purposes, although you may choose not to participate in such surveys.</p>

<p class="has-black-color has-text-color">Web logs of your visits to our website include, but are not limited to, traffic data, location data, other communication data, and the resources that you access.</p>

<h6 class="wp-block-heading has-text-color" style="color:#00263a"><strong>INFORMATION WE MAY COLLECT FROM YOU</strong></h6>

<ul class="wp-block-list">
<li>We may collect either your contact information, relationship information, location information, analytics information, or all of them.</li>
<li>We may also store a record of your correspondence when you contact us.</li>
<li>We may ask for your information purely for surveys that we use for research purposes, although you may choose not to participate in such surveys.</li>
</ul>

<!-- Add the remaining HTML content here, same as your original code -->

`}
        isHtml={true}
      />
    </div>
  );
};

export default PrivacyPage;
