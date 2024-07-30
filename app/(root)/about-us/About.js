/*
    FileName - About.js
    Desc - This file defines the AboutUs component that renders the About Us
    section of the webpage. It uses various images, styles, and context to
    display content related to the purpose and motivation behind the website.
    The component updates the global state using the dispatch function from
    the context.
*/
import Image from 'next/image';
import AboutFirstSectionBG from '@/public/AboutUs/About_first_section_Bg.webp';
import AboutBGPic1 from '@/public/AboutUs/About_Bg_Pic1.webp';
import AboutBGPic2 from '@/public/AboutUs/About_Bg_Pic2.webp';
import AboutBGPic3 from '@/public/AboutUs/About_Bg_Pic3.webp';
import AboutBGPic4 from '@/public/AboutUs/About_Bg_Pic4.webp';
import AboutBGPic5 from '@/public/AboutUs/About_Bg_Pic5.webp';
import AboutBGPic6 from '@/public/AboutUs/About_Bg_Pic6.webp';
import AboutBgVector1 from '@/public/AboutUs/About_Bg_vector-1.svg';
import AboutBgVector2 from '@/public/AboutUs/About_Bg_vector-2.svg';
import AboutBgVector3 from '@/public/AboutUs/About_Bg_vector-3.svg';
import AboutBgVector4 from '@/public/AboutUs/About_Bg_vector-4.svg';
import AboutBgVector5 from '@/public/AboutUs/About_Bg_vector-5.svg';
import AboutImgThirdSection from '@/public/AboutUs/About_Img_Third_Section.webp';
import './About.css';

export default function AboutUs() {
  return (
    <>
      <div className="aboutContainer">
        <div className="aboutHeadingContent">
          <p className="typing-demo">
            Hi! <span>We are</span>
          </p>
          <h1 className="AboutFontSizeHeading changeAboutFontSizeHeading">
            <span className="colorRevolutionizingLike">Revolutionizing</span>
            Job Referrals
          </h1>
        </div>
        <div className="aboutFirstSection">
          <Image
            alt="Image"
            src={AboutFirstSectionBG}
            className="AboutFirstSectionBGStyle"
          />
          <Image alt="img" src={AboutBGPic1} className="AboutBgPic1Style" />
          <Image alt="img" src={AboutBGPic2} className="AboutBgPic2Style" />
          <Image alt="img" src={AboutBGPic3} className="AboutBgPic3Style" />
          <Image alt="img" src={AboutBGPic4} className="AboutBgPic4Style" />
          <Image alt="img" src={AboutBGPic5} className="AboutBgPic5Style" />
          <Image alt="img" src={AboutBGPic6} className="AboutBgPic6Style" />
          <Image
            alt="img"
            src={AboutBgVector1}
            className="AboutBgVector1Style"
          />
          <Image
            alt="img"
            src={AboutBgVector2}
            className="AboutBgVector2Style"
          />
          <Image
            alt="img"
            src={AboutBgVector3}
            className="AboutBgVector3Style"
          />
          <Image
            alt="img"
            src={AboutBgVector4}
            className="AboutBgVector4Style"
          />
          <Image
            alt="img"
            src={AboutBgVector5}
            className="AboutBgVector5Style"
          />
        </div>
        <hr className="aboutHorizontalLine" />
        <div className="aboutUsSecondSection">
          <h1 className="AboutFontSizeHeading">About Us</h1>
          <p className="AboutFontSizePara">
            Nectworks is revolutionizing the job referral process for both job
            seekers and referrers. By harnessing the power of referrals,
            we&apos;re helping job seekers get connected with top companies and
            opportunities, while empowering referrers to play a more active role
            in the hiring process.
          </p>
        </div>
        <div className="aboutUsThirdSection">
          <Image src={AboutImgThirdSection} alt="img" />
          <div className="aboutUsThirdSectionContent">
            <h1 className="AboutFontSizeHeading">Why we do this?</h1>
            <p className="aboutUsThirdSectionContentPara1 AboutFontSizePara">
              We feel the frustration you go through when it comes to looking
              for a job. We’ve been there too.
            </p>
            <p className="aboutUsThirdSectionContentPara2 AboutFontSizePara">
              At Nectworks, we manifest this frustration into a product that
              benefits both referrers and seekers to refer and seek jobs under
              one umbrella.
            </p>
          </div>
        </div>
        <div className="aboutUsSecondSection">
          <h1 className="AboutFontSizeHeading_2">
            Enhancing the referral workflow through innovative solutions that
            would streamline and simplify the referral process
          </h1>
          <p className="AboutFontSizePara_1">
            Our user-friendly software platform empower employees to
            effortlessly submit referrals, while our automated tracking system
            ensures that no potential candidates slip through the cracks.
          </p>
          <p className="AboutFontSizePara_1">
            By centralizing and digitizing referrals, our tools save precious
            time and effort for both employees and recruiters, optimizing the
            recruitment process benefitting both employees and recruiters.
          </p>
        </div>
        <div className="aboutUsFourthSection">
          <div className="textWithImage">
            <p style={{ display: 'inline-block', marginRight: '10px' }}>
              What we aim to achieve
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="72"
              viewBox="0 0 70 4"
              fill="none"
              style={{ display: 'inline-block' }}
            >
              <path
                d="M2 2H70"
                stroke="#0057B1"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h1 className="AboutFontSizeHeading_3">
            Nectworks tools actively promote employee engagement in the
            recruitment journey.
          </h1>

          <div className="aboutUsFourthSectionContentContainer">
            <div>
              <p className="aboutUsThirdSectionContentPara_4 AboutFontSizePara">
                By involving employees in the referral organizations cultivate a
                sense of ownership, collaboration, and active involvement.
              </p>
              <p className="aboutUsThirdSectionContentPara_4 AboutFontSizePara">
                Employees gain a greater sense of value and empowerment when
                their insights and connections contribute to identifying top
                talent.
              </p>
            </div>

            <div className="fourth_para">
              <p className="aboutUsThirdSectionContentPara3 AboutFontSizePara">
                This heightened engagement leads to increased job satisfaction,
                enhanced employee retention rates, and a more vibrant and
                positive work environment.
              </p>
              <div className="container_about">
                <h2 className="text-about">TheRevolution</h2>
                <div className="rectangle"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
