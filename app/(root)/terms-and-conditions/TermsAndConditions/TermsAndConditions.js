'use client';

/*
    FileName: TermsandConditions.js
    Description: Contains brief information about terms and the
    conditions
*/

import './TermsAndConditions.css';

const TermsAndConditions = () => {
  // function to scroll into a section
  function scrollToSection(e) {
    e.preventDefault();

    // get the target element to scroll into view
    const targetId = e.target.dataset.sectionId;
    const targetElement = document.getElementById(targetId);

    // get top attribute of the body element and target element
    const bodyRect = document.body.getBoundingClientRect().top;
    const targetEleRect = targetElement.getBoundingClientRect().top;
    const headerOffset = 100;

    // calculate the current position to bring the view into the screen
    const scrollPos = targetEleRect - bodyRect - headerOffset;

    window.scrollTo({
      top: scrollPos,
      behaviour: 'smooth',
    });
  }

  return (
    <div className="TandC_outer_container">
      <div className="TandC_header_container">
        <h2>Terms & Conditions</h2>
        <span className="heading_terms">Last modified November 30, 2023</span>
      </div>

      <div className="TandC_info_wrapper_container">
        <div className="TandC_shortcut_container">
          <div
            className="TandC_shortcut"
            data-section-id="info_section_one"
            onClick={scrollToSection}
          >
            Acceptance
          </div>
          <div
            className="TandC_shortcut"
            data-section-id="info_section_two"
            onClick={scrollToSection}
          >
            Third-party sites
          </div>
          <div
            className="TandC_shortcut"
            data-section-id="info_section_three"
            onClick={scrollToSection}
          >
            Your nectworks account
          </div>
          <div
            className="TandC_shortcut"
            data-section-id="info_section_four"
            onClick={scrollToSection}
          >
            Cookies
          </div>
          <div
            className="TandC_shortcut"
            data-section-id="info_section_five"
            onClick={scrollToSection}
          >
            Content
          </div>
          <div
            className="TandC_shortcut"
            data-section-id="info_section_six"
            onClick={scrollToSection}
          >
            Retricted contents
          </div>
          <div
            className="TandC_shortcut"
            data-section-id="info_section_seven"
            onClick={scrollToSection}
          >
            Content Posting Policy
          </div>
          <div
            className="TandC_shortcut"
            data-section-id="info_section_eight"
            onClick={scrollToSection}
          >
            Contents owner
          </div>
          <div
            className="TandC_shortcut"
            data-section-id="info_section_nine"
            onClick={scrollToSection}
          >
            Report/Block
          </div>
          <div
            className="TandC_shortcut"
            data-section-id="info_section_ten"
            onClick={scrollToSection}
          >
            Intellectual property policy
          </div>
          <div
            className="TandC_shortcut"
            data-section-id="info_section_eleven"
            onClick={scrollToSection}
          >
            The use of your information
          </div>
          <div
            className="TandC_shortcut"
            data-section-id="info_section_twelve"
            onClick={scrollToSection}
          >
            How the platform works
          </div>
          <div
            className="TandC_shortcut"
            data-section-id="info_section_thirteen"
            onClick={scrollToSection}
          >
            Product/Pricing
          </div>
          <div
            className="TandC_shortcut"
            data-section-id="info_section_fourteen"
            onClick={scrollToSection}
          >
            Payment terms & conditions
          </div>
          <div
            className="TandC_shortcut"
            data-section-id="info_section_fifteen"
            onClick={scrollToSection}
          >
            User termination policy/Legal action
          </div>
          <div
            className="TandC_shortcut"
            data-section-id="info_section_sixteen"
            onClick={scrollToSection}
          >
            Corrections
          </div>
          <div
            className="TandC_shortcut"
            data-section-id="info_section_seventeen"
            onClick={scrollToSection}
          >
            Miscellaneous
          </div>
        </div>

        <div className="TandC_info_container">
          <div className="TandC_info_section">
            <p>
              The following constitutes the User Agreement and is legally
              binding, applying to your usage of the Nectworks Application. This
              agreement has been written in English (India), and in case of any
              conflict between translated versions and the English version, the
              English version shall prevail.
            </p>
          </div>
          <div className="TandC_info_section" id="info_section_one">
            <h3 className="TandC_section_header">1. Acceptance:</h3>

            <p>
              By accessing and/or using any of the Services, you agree to be
              bound by this Agreement, whether you are a &quot;Visitor&quot;
              (meaning you browse the Services, including via various remote
              devices, or use the Services without registering) or a
              &quot;Member&quot; (meaning you have registered with Nectworks).
              The term &quot;user&quot; encompasses both Visitors and Members.
              Your download or use of the Services, regardless of your initial
              intent, constitutes acceptance of these terms. You agree to abide
              by all applicable laws, rules, regulations, and the terms of this
              Agreement. Furthermore, during the registration process, you must
              indicate your acceptance of this agreement as a consideration for
              becoming a member and/or using the services. Afterward, you may
              create your account, if necessary, per the terms herein. We retain
              the sole discretion to modify or revise these terms and policies
              at any time, and you agree to be bound by such modifications or
              revisions. Hence, it is crucial to review this agreement
              regularly. If you disagree with being bound by this agreement and
              abiding by all applicable laws (defined below), you are not
              authorized to use the applicable services. You should delete the
              software enabling access to the services and discontinue their
              use.
            </p>
          </div>
          <div className="TandC_info_section" id="info_section_two">
            <h3 className="TandC_section_header">2. Third-Party Sites:</h3>

            <p>
              These terms apply to all users of the services. The service may
              contain links to third-party websites not owned or controlled by
              us. For instance, companies&quot; websites, social media accounts,
              pages of recruiters and job seekers, etc. We have no control over
              and assume no responsibility for any third-party websites&quot;
              content, privacy policies, or practices. Additionally, we will not
              and cannot censor or edit the content of any third-party site. By
              using the service, you expressly relieve us from any liability
              arising from your use of any third-party website. Consequently, we
              encourage you to be aware when you leave the service and read the
              terms and conditions and privacy policy of each other website you
              visit.
            </p>
          </div>
          <div className="TandC_info_section" id="info_section_three">
            <h3 className="TandC_section_header">3. Your Nectworks Account:</h3>

            <p>
              To use all the features of the app, you may be directed to create
              an account. When creating your account, you must provide accurate
              and complete information. You are solely responsible for the
              activity on your account, and you must keep your account
              credentials secured. You must notify us immediately of any
              security breach or unauthorized use of your account. Although we
              will not be liable for your losses caused by any unauthorized use
              of your account, you may be responsible for our losses or the
              losses of others due to such unauthorized use. All information
              collected through accounts or otherwise through the services is
              collected and used in accordance with the privacy policy.
            </p>
          </div>
          <div className="TandC_info_section" id="info_section_four">
            <h3 className="TandC_section_header">4. Cookies:</h3>

            <p>
              We employ the use of cookies. By accessing Nectworks, you agreed
              to use cookies in agreement with the Nectworks Technology&apos;s
              Privacy Policy. Most interactive websites use cookies to let us
              retrieve the user&apos;s details for each visit. Cookies are used
              by our website to enable the functionality of certain areas to
              make it easier for people visiting our website. Some of our
              affiliate/advertising partners may also use cookies.
            </p>
          </div>
          <div className="TandC_info_section" id="info_section_five">
            <h3 className="TandC_section_header">5. Contents:</h3>

            <p>
              Content includes texts, messages, files, images, photos, video,
              sounds, sound recordings, works of authorship, applications,
              graphics, audio-visual combinations, interactive features, and
              other materials you may view, access, or contribute to the
              services. As an account holder in Nectworks, you may submit
              content to the services, like photos, videos, documents, texts,
              messages, etc. You understand that we do not guarantee any
              confidentiality with respect to any content you submit. We do not
              claim any ownership rights in the content you transmit, submit,
              display, or publish (&quot;post&quot;) on, through, or with the
              Services. After posting your content on, through, or in connection
              with the Services, you continue to retain any such rights that you
              may have in your content, subject to a worldwide, non-exclusive,
              royalty-free, sub-licensable, and transferable license granted
              herein.
              <br></br>
              <br></br>
              By posting any Content on, through, or in connection with the
              Services, you hereby grant to us the right to use, modify, delete
              from, add to, combine with other content, publicly perform,
              publicly display, reproduce, prepare derivative works of, display,
              publish, adapt, make available online or electronically transmit,
              sell, distribute, and otherwise exploit such Content through all
              means and manners now or later known, including, without
              limitation, on, through, or in connection with the Services. You
              also hereby grant each user of the service a non-exclusive license
              to access your content through the services and to use, reproduce,
              distribute, display, publish, make available online or
              electronically transmit, and perform such content as permitted
              through the functionality of the services and under these terms.
              You shall be solely responsible for your content and the
              consequences of submitting and publishing your content on the
              services. You affirm, represent, and warrant that you own or have
              the necessary licenses, rights, consents, and permissions to
              publish the content you submit, and you license to us all patent,
              trademark, trade secret, copyright, or other proprietary rights in
              and to such content for publication on the Services pursuant to
              these Terms, royalty-free.
            </p>
          </div>
          <div className="TandC_info_section" id="info_section_six">
            <h3 className="TandC_section_header">6. Restricted Contents:</h3>

            <p>
              You shall not host, display, upload, modify, publish, transmit,
              update, or share any information that is grossly harmful,
              disparaging, relating to or encouraging money laundering or
              gambling, invasive of another&quot;s privacy, racial or ethnically
              objectionable, impersonates another person, contains software
              viruses or any other computer code, file, or program designed to
              interrupt, destroy, or limit the functionality of any software
              resource, or threatens the unity, integrity, defense, security, or
              sovereignty of India.
            </p>
          </div>
          <div className="TandC_info_section" id="info_section_seven">
            <h3 className="TandC_section_header">7. Content Posting Policy:</h3>

            <p>
              You shall not post/upload/transmit/share any contents that:
              <br></br> <br></br>
              1. Violates the Agreement, Community Guidelines, and other terms
              and policies that apply to your platform use. <br></br>
              2. Is unlawful, discriminatory, fraudulent, harassing, fake, Spam,
              scam, infringing, etc.
            </p>
          </div>
          <div className="TandC_info_section" id="info_section_eight">
            <h3 className="TandC_section_header">
              8. Contents Owner (Content Regulations in Nectworks):
            </h3>

            <p>
              Any user content will be considered non-confidential and
              non-proprietary. You shall be solely responsible for your content
              and the consequences of submitting and publishing your content on
              the Services. We do not endorse any content submitted to the
              Services by any user or any opinion, recommendation, or advice
              expressed therein, and any use or reliance on any content obtained
              through the Service is at your own risk. We reserve the right to
              remove content that violates The Agreement, Community Guidelines,
              Google Policy of Restricted Contents and other policies that apply
              to your use of the Service.
            </p>
          </div>
          <div className="TandC_info_section" id="info_section_nine">
            <h3 className="TandC_section_header">9. Report/Block:</h3>

            <p>
              One can report any contents in the application with a reason for
              reporting, like Spam, Scam, etc., and submit a proof of screenshot
              or video. We will review that content immediately, and if it
              violates any policy, we will immediately remove that content and
              take strict action against the user.
              <br></br>
              <br></br>
              <span className="TandC_section_label">
                Note: Prohibition of Soliciting Money for Jobs or Referrals
              </span>
              <br></br>
              <br></br>
              Users or professionals utilizing our platform are strictly
              prohibited from soliciting money in exchange for job opportunities
              or referrals. Our platform is intended solely for the purposes of
              job referrals, mentorship, and guidance. Any user found to be in
              violation of this platform&quot;s conditions by soliciting money
              for job offers or referrals will be subject to legal action. Such
              legal action may include the filing of a FIR with the appropriate
              law enforcement authorities. We are committed to maintaining the
              integrity and purpose of our platform, and we expect all users to
              adhere to these guidelines. Violations of this policy will not be
              tolerated and will be dealt with in accordance with the law.
            </p>
          </div>
          <div className="TandC_info_section" id="info_section_ten">
            <h3 className="TandC_section_header">
              10. Intellectual Property Policy:
            </h3>

            <p>
              We respect the intellectual property of others and require that
              our members do so as well. Therefore, you hereby agree and warrant
              that you shall not host, display, upload, modify, publish,
              transmit, update, or share any Content that infringes upon a third
              person&quot;s copyright, patent, design, or other proprietary or
              intellectual property rights. Any such infringing Content is
              subject to removal or blocking in accordance with the rules below.
              We operate a clear copyright policy about any Content alleged to
              infringe the copyright of a third party, and we will terminate
              user access to the Services if a user has been determined to be a
              repeat infringer. A repeat infringer is a member who has been
              notified of infringing activity more than twice. The Content on
              the Services, and the trademarks, service marks, and logos
              (&quot;Marks&quot;) on the Service, are owned by or licensed to
              us, and you do not gain any right, license, or ownership over the
              same.
            </p>
          </div>
          <div className="TandC_info_section" id="info_section_eleven">
            <h3 className="TandC_section_header">
              11. The Use Of Your Information:
            </h3>

            <p>
              We may collect your personal & non-personal information like Your
              name, phone number, email ID, designation, location, company name,
              college name, etc., to personalize your product experience on the
              Nectworks App. We may use your phone number and email ID to
              contact you via SMS, Email, or Direct Call. We may also contact
              you for feedback about your experience with Nectworks and for
              taking part in various events and research organized by the
              Nectworks team according to these Terms & Conditions.
            </p>
          </div>
          <div className="TandC_info_section" id="info_section_twelve">
            <h3 className="TandC_section_header">
              12. How the Platform Works:
            </h3>

            <p>
              To participate, you can visit the referral page on Nectworks App
              (&quot;App&quot;) and follow the on-screen instructions to
              participate in the Referral Program and start referring your
              friend/hiring manager looking for a job or to hire for their own
              company. If you want to post a job, you should be:
              <br></br>
              <br></br>
              1. Be new to the Nectworks App and have a valid company email.
              <br></br>
              2. Should be a Human Resource personnel or a hiring
              manager/CXO/Owner<br></br>
              3. Should not be an HR Consultant<br></br>
              4. Should not belong to a Network Marketing company<br></br>
              5. Once you click on the &quot;Share profile&quot; button, you
              will be provided a link and a unique invitation code (can be your
              unique username). You can then share this with as many friends and
              colleagues as you wish. Individuals who receive your referral are
              &quot;Referees&quot; and they can ask you for job referrals.
              <br></br>
              <br></br>
              <span className="TandC_section_label">Privacy Policy:</span>
              <br></br>
              <br></br>
              The personal information collected, processed, and used as part of
              the Program will be used in accordance with Company&apos;s Privacy
              Policy. As the provider of the referral service, we will receive
              the personal information you choose to disclose in connection with
              this Program.
              <br></br>
              <br></br>
              <span className="TandC_section_label">
                Other Terms of the Program:
              </span>
              <br></br>
              <br></br>
              All Nectworks promotions are run for a limited time only, and we
              reserve the rights to modify or amend these Terms and Conditions
              at any time and/or the methods through which rewards are earned;
              Nectworks shall not be liable for your loss due to incomplete,
              unreadable, inaccurate, unreliable, or unintelligible entries of
              payment information, regardless of your chosen redeeming method;
              <br></br>
              <br></br>
              <span className="TandC_section_label">
                In addition, you may not:
              </span>
              <br></br>
              <br></br>
              1. Tamper with the Program<br></br>
              2. Act in an unfair or disruptive manner, or<br></br>
              3. Use any system, bot, or other device or artifice to participate
              or receive any benefit in the Program. Should such an attempt be
              made, the company reserves the right to seek remedies and damages
              to the fullest extent of the law, including criminal prosecution.
              <br></br>
            </p>
          </div>
          <div className="TandC_info_section" id="info_section_thirteen">
            <h3 className="TandC_section_header">13. Product & Pricing:</h3>

            <p>
              Nectworks is an employee referral and hiring platform focused on
              solving the unique problem of the long hiring process, especially
              for Startups and MNC&apos;s. Nectworks is free of cost for job
              seekers for job search. Professionals can charge a fee for their
              services if job seekers want to seek mentorship or guidance from
              them. However, Nectworks will charge a nominal fee to the
              professionals or recruiters for 1:1 calls scheduled from our
              platform or any other services.
            </p>
          </div>
          <div className="TandC_info_section" id="info_section_fourteen">
            <h3 className="TandC_section_header">
              14. Payment Terms and Conditions:
            </h3>

            <p>
              &apos;Nectworks&apos; may offer products and services for purchase
              on the App (“In-App Purchase”). By making an in-app purchase, you
              agree to the payment terms that may apply, which are disclosed at
              the point of purchase, and as such, the payment terms are
              incorporated herein by reference.
              <br></br>
              <br></br>{' '}
              <span className="TandC_section_label">
                In-App Purchases can be made by the following methods
                (&quot;Payment Method&quot;):
              </span>
              <br></br>
              <br></br>
              Making a purchase through a third-party platform such as the Apple
              App Store or Google Play Store (&quot;Third-Party Store&quot;). As
              soon as you make an In-App Purchase, you authorize us to charge
              your chosen Payment Method. If we cannot receive payment through
              the selected Payment Method, then you agree to pay all sums due
              upon demand by us. (In-App purchase development is still in
              progress).
              <br></br>
              <br></br>
              The subscription is not canceled when an account is deleted, or an
              application is deleted from a device. You will be notified of any
              changes to the pricing of the Premium Services to which you have
              subscribed and given the opportunity to cancel. If we change these
              prices and you do not cancel the subscription, you will be charged
              at Nectworks&apos;s then-current subscription pricing.
              <br></br>
              <br></br>
              <span className="TandC_section_label">Cancellation Policy:</span>
              <br></br>
              <br></br>
              If you have purchased a subscription through a Third-Party Store,
              such as the Apple App Store or the Google Play Store, you will
              need to access your account with that Third-Party Store and follow
              instructions to change or cancel their subscription. If you cancel
              your subscription, you may continue to use the paid services until
              the end of the period you last paid for, but (i) you will not
              (except as outlined in the subsection entitled “Refunds” below) be
              eligible for a prorated refund, (iii) you will then no longer be
              able to use the Premium Services or In-App Purchases enabled by
              their subscription.
              <br></br>
              <br></br>
              <span className="TandC_section_label">Refunds:</span>
              <br></br>
              <br></br>
              Generally, all charges for purchases are non-refundable, and there
              are no refunds or credits for partially used periods. You may
              cancel your subscription without penalty or obligation. Your
              estate shall be entitled to a refund of that portion of any
              subscription payment you had made, which is allocated to the
              period after your death if you die before the end of your
              subscription period. If you become disabled (so that you cannot
              use Nectworks) before the end of your subscription period, you are
              entitled to a refund of that portion of your subscription payment
              transferable to the period after your disability by providing the
              company notice in the same manner that you request a refund. We
              shall make such a refund using the same means of payment as used
              by you in the initial transaction. In any case, you will not be
              charged any fees due to the refund. You who purchased through a
              payment platform other than those listed above should request a
              refund directly from the third-party merchant through which you
              made the purchase. You cannot cancel an order for digital content
              not delivered on a physical medium if you have given your explicit
              prior consent and have acknowledged that you will lose your
              cancellation rights.
            </p>
          </div>
          <div className="TandC_info_section" id="info_section_fifteen">
            <h3 className="TandC_section_header">
              15. User Termination Policy/Legal Action:
            </h3>

            <p>
              We may terminate a user&apos;s access to the Service if found
              violating this agreement. We reserve the right to decide whether
              Content violates these agreements for any reason, including
              copyright infringement, Spam, Scam, Unprofessional Behavior, etc.
              We may at any time, without prior notice and in our sole
              discretion, remove such Content and/or terminate a user&apos;s
              account for sending/posting such material in violation of these
              agreements.
              <br></br>
              <br></br>
              As long as the website and the information and services on the
              website are provided free of charge, we will not be liable for any
              loss or damage of any nature.
            </p>
          </div>
          <div className="TandC_info_section" id="info_section_sixteen">
            <h3 className="TandC_section_header">16. Corrections</h3>

            <p>
              There may be information on the Site that contains typographical
              errors, inaccuracies, or omissions, including descriptions,
              pricing, availability, and various other information. We reserve
              the right to correct any errors, inaccuracies, or omissions and to
              change or update the information on the Site at any time, without
              prior notice.
            </p>
          </div>
          <div className="TandC_info_section" id="info_section_seventeen"></div>
          <h3 className="TandC_section_header">17. Miscellaneous</h3>

          <p>
            These Terms of Use and any policies or operating rules posted by us
            on the Site or in respect to the Site constitute the entire
            agreement and understanding between you and us. Our failure to
            exercise or enforce any right or provision of these Terms of Use
            shall not operate as a waiver of such right or provision. These
            Terms of Use fully operate permissible by law. We may assign any or
            all our rights and obligations to others at any time. We shall not
            be responsible or liable for any loss, damage, delay, or failure to
            act caused by any cause beyond our reasonable control. If any
            provision or part of a provision of these Terms of Use is determined
            to be unlawful, void, or unenforceable, that provision or part of
            the provision is deemed severable from these Terms of Use and does
            not affect the validity and enforceability of any remaining
            provisions. There is no joint venture, partnership, employment, or
            agency relationship created between you and us because of these
            Terms of Use or use of the Site. You agree that these Terms of Use
            will not be construed against us by virtue of having drafted them.
            You hereby waive all defenses you may have based on the electronic
            form of these Terms of Use and the lack of signing by the parties
            hereto to execute these Terms of Use.
            <br></br>
            <br></br>
            Contact Us:<br></br>
            Email us at
            <a
              className="TandC_section_highlight"
              href="mailto:support@nectworks.com"
            >
              &nbsp;support@nectworks.com
            </a>
            .&nbsp;If you have any queries.
          </p>
        </div>
      </div>
    </div>
  );
};
export default TermsAndConditions;
