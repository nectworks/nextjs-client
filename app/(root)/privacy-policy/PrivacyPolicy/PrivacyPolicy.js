'use client';
/*
    FileName: PrivacyPage.js
    Description: Contains brief information about how we are going to use users data
*/

import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  // function to scroll into a section
  function scrollToSection(e) {
    e.preventDefault();

    // get the target element to scroll into view
    const targetId = e.target.dataset.sectionId;
    const targetElement = document.getElementById(targetId);

    // get top attribute of the body element and target element
    const bodyRect = document.body.getBoundingClientRect().top;
    const targetEleRect = targetElement.getBoundingClientRect().top;
    const headerOffset = 150;

    // calculate the current position to bring the view into the screen
    const scrollPos = targetEleRect - bodyRect - headerOffset;

    window.scrollTo({
      top: scrollPos,
      behaviour: 'smooth',
    });
  }

  return (
    <div className="privacy_outer_container">
      <div className="privacy_header_container">
        <h2>Privacy Policy</h2>
        <span>Last modified November 30, 2023</span>
      </div>

      <div className="privacy_info_wrapper_container">
        <div className="privacy_shortcut_container">
          <div
            className="privacy_shortcut"
            data-section-id="info_section_one"
            onClick={scrollToSection}
          >
            Introduction
          </div>
          <div
            className="privacy_shortcut"
            data-section-id="info_section_two"
            onClick={scrollToSection}
          >
            Third Party Tools, SDKs, Services used
          </div>
          <div
            className="privacy_shortcut"
            data-section-id="info_section_three"
            onClick={scrollToSection}
          >
            Policy for DNC/NDNC
          </div>
          <div
            className="privacy_shortcut"
            data-section-id="info_section_four"
            onClick={scrollToSection}
          >
            Use of information collected
          </div>
          <div
            className="privacy_shortcut"
            data-section-id="info_section_five"
            onClick={scrollToSection}
          >
            How your information may be disclosed
          </div>
          <div
            className="privacy_shortcut"
            data-section-id="info_section_six"
            onClick={scrollToSection}
          >
            International users
          </div>
          <div
            className="privacy_shortcut"
            data-section-id="info_section_seven"
            onClick={scrollToSection}
          >
            Notification of changes
          </div>
          <div
            className="privacy_shortcut"
            data-section-id="info_section_eight"
            onClick={scrollToSection}
          >
            Contact us
          </div>
        </div>

        <div className="privacy_info_container">
          <div className="privacy_info_section" id="info_section_one">
            <h3 className="privacy_section_header">Introduction</h3>
            <p>
              We take your personal data seriously. We understand clearly that
              you and your personal information is one of our most important
              assets. We encourage you to read the privacy policies carefully.
              This Privacy Policy describes the practices by the “Nectworks” web
              application. It explains the storage, disclosure, use, other
              processing of your data (Personal & Non-Personal, and usage and
              sharing of contents). Hence, before you start using this
              application or giving information about you, kindly review this
              Privacy Policy.
            </p>

            <p>
              <h4 className="privacy_section_label">
                Information we collect through Web App Disclosure:
              </h4>
              <span className="privacy_section_label">A. Storage: </span> You
              can upload files from your device such as your Resume, Profile
              Picture, any document for verification of your profile, etc.{' '}
              <br></br>
              <span className="privacy_section_label">B. Contacts: </span> We
              enable you to invite your friends through SMS, and WhatsApp.
            </p>

            <p>
              <h4 className="privacy_section_label">
                Other Information we collect during your usage of Nectworks web
                app:{' '}
              </h4>
              When you create your profile, we ask your personal data like phone
              number, email ID, date of birth, etc in order to make your profile
              uniquely identifiable. Due to the communications standards on the
              Internet, when you visit the Website, we automatically receive the
              URL of the site from which you came and the site to which you are
              going when you leave. We also receive information about your
              computer, including your IP address, or proxy server you used to
              access the World Wide Web, email patterns as well as name of your
              internet service provider (ISP). This information is used to
              analyse trends to improve our services. The Website uses temporary
              cookies to store certain data (that is not sensitive personal data
              or information) that is used by us and our service providers for
              the technical administration of the Website, research and
              development, and for administration. In the course of serving
              advertisements or optimizing services to you, we may allow
              authorized third parties to place or recognize a unique cookie on
              your browser. We do not store personally identifiable information
              in the cookies. This policy only applies to our site. In case you
              leave our site, via a link or otherwise, you will be subject to
              the policy of the other website. We have no control over that
              policy or the terms of that website and you should check their
              policy before continuing to access the site. These other sites may
              place their own cookies or other files on your computer, collect
              data or solicit personal information from you, for which we are
              not responsible or liable. Accordingly, we do not make any
              representations or take any responsibility concerning the privacy
              practices or policies of such third parties or terms of use of
              such websites, nor do we guarantee the accuracy, integrity, or
              quality of the information, data, text, software, sound,
              photographs, graphics, videos, messages or other materials
              available on such websites. The Website may enable you to
              communicate with other users or to post information to be accessed
              by others, whereupon other users may collect such data. We hereby
              expressly disclaim any liability for any misuse of such
              information that is made available by visitors in such a manner.
            </p>
          </div>

          <div className="privacy_info_section" id="info_section_two">
            <h3 className="privacy_section_header">
              Third Party Tools, SDKs, Services used
            </h3>
            <p>
              <span className="privacy_section_label">MongoDB SDK: </span> Help
              us to develop and distribute App. Track Performance and Analytics.
              <br></br>
              <br></br>
            </p>
          </div>

          <div className="privacy_info_section" id="info_section_three">
            <h3 className="privacy_section_header">Policy for DND / NDNC</h3>
            <p>
              By using the Website and/or registering yourself at Nectworks.com
              you authorize us to contact you via E-mail or phone call or SMS
              and offer you our services, imparting product knowledge, offer
              promotional offers running on website & offers offered by the
              associated third parties, for which reasons, personally
              identifiable information may be collected. And irrespective of the
              fact if also you have registered yourself under DND or DNC or NCPR
              service, you still authorize us to give you a call from Nectworks
              for the above mentioned purposes till 365 days of your
              registration with us. This Privacy Policy covers Nectworks&apos;s
              treatment of personally identifiable information that Nectworks
              collects when you are on the Nectworks site, and when you use
              Nectworks&apos;s services. This policy also covers
              Nectworks&apos;s treatment of personally identifiable information
              that Nectworks&apos;s business partner shares with Nectworks.
              Nectworks may also receive personally identifiable information
              from our business partners. When you registered with Nectworks, we
              ask for your first name, last name, contact no, email, company
              name & job title. Once you register with Nectworks and sign in to
              our services, you are not anonymous to us. Also, during
              registration, you may be requested to register your mobile phone
              and email id, pager, or other device to receive text messages, and
              other services to your wireless device. By registration you
              authorize us to send SMS/E-mail alerts to you for your login
              details and any other service requirements or some advertising
              messages/emails from us.
            </p>
          </div>

          <div className="privacy_info_section" id="info_section_four">
            <h3 className="privacy_section_header">
              Use of the Information Collected
            </h3>
            <p>
              <span className="privacy_section_label">A.</span> To provide the
              best-personalized services to you.
            </p>
            <p>
              <span className="privacy_section_label">B.</span> To facilitate
              you to provide all the information required in the recruitment/job
              search.
            </p>
            <p>
              <span className="privacy_section_label">C.</span> Helps in
              research and statistical analysis of users to make business
              decisions.
            </p>
            <p>
              <span className="privacy_section_label">D.</span> To improve and
              develop our Platform and conduct product development.
            </p>
            <p>
              <span className="privacy_section_label">E.</span> To help us
              detect abuse, fraud, and illegal activity on the Platform and
              communicate to you.
            </p>
          </div>

          <div className="privacy_info_section" id="info_section_five">
            <h3
              className="privacy_section_header

                "
            >
              How your information may be disclosed
            </h3>
            <p>
              <span className="privacy_section_label">A.</span> Personal
              Information: In general, we use the data internally to serve our
              Users and enable them to take maximum advantage of the
              Application. We do not disclose your Personal Information to any
              third party. <br></br>
              <br></br>
              <span className="privacy_section_label">B.</span> Non-Personal
              Information: We may disclose Non-Personal Information to our
              trusted partners who shall comply with this privacy policy and the
              relevant privacy laws. We do not combine Non-Personal Information
              with Personal Information (such as combining your name with your
              unique User Device number).
            </p>
          </div>

          <div className="privacy_info_section" id="info_section_six">
            <h3 className="privacy_section_header">International Users:</h3>
            <p>
              Your personal and non-personal information may be stored and
              processed in any country where we provide our services as
              described in the Privacy Policy. By agreeing to our Privacy Policy
              and using our application you consent to transfer your personal
              and non-personal information to us despite the fact that different
              countries have different data protection rules. If you object to
              your personal/non-personal information being processed as
              described in this policy, please do no use this application.
            </p>
          </div>

          <div className="privacy_info_section" id="info_section_seven">
            <h3 className="privacy_section_header">Notification of Changes:</h3>
            <p>
              We reserve the right to change, alter this Privacy Policy at any
              time. It is your responsibility to keep checking it and stay
              updated on a regular basis. Your continued use of this application
              following the posting of any changes/modifications to the Privacy
              Policy constitutes your acceptance of the revised Privacy Policy.
            </p>
          </div>

          <div className="privacy_info_section" id="info_section_eight">
            <h3 className="privacy_section_header">Contact Us:</h3>
            <p>
              Please remember to help keep the Site secure by never sharing your
              username or password. If you think your password may have been
              compromised, please change it immediately or contact Nectworks for
              additional assistance. Nectworks may send you email communications
              periodically detailing new features or promotions on the Site. You
              may unsubscribe from these messages by using the link at the
              bottom of the email. We may also send you email messages about the
              status of your account or any notices as required by law. You may
              not opt-out of receiving these administrative emails so long as
              you continue to use this voluntary service. If you have any
              concerns regarding this privacy policy, please email us at{' '}
              <a
                className="privacy_section_highlight"
                href="mailto:support@nectworks.com"
              >
                &nbsp;support@nectworks.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PrivacyPolicy;
