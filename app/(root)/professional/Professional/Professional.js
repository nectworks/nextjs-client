/**
 * File name: Professional.js
 * Description: This page is professionals tutorial about our product.
 */
import './Professional.css';
import FirstImage from '@/public/Professional/professionalHeroImg.webp';
import Link from 'next/link';
import Placeholder1 from '@/public/Professional/placeholder_1.webp';
import scrollToTop from '@/Utils/scrollToTop';
const Professional = () => {
    return (
        <div className="professional_whole_page">
            <div className="mobile-image"></div>

            <div className="Professional_heading_first">
                <p>
                    Set up your professional
                    <span className="Professional_heading_first_span">Nectworks</span>
                    account
                </p>
            </div>
            <p className="Professional_subheading_first">
                Become a part of the job referral revolution
            </p>
            <div className="placeholders_mobile_first">
                <img
                    src={Placeholder1.src}
                    alt="Image Not Found"
                    className="placeholder_mobile_first"
                    width={350}
                    height={260}
                />
            </div>
            <div className="center-image">
                <img
                    src={FirstImage.src}
                    alt="Image Not Found"
                    className="professionalHeroImg"
                />
            </div>

            <div className="containers">
                <div className="content_first professionalHeading">
                    <h3 className="content_heading">
                        How a professional Nectworks account works?<br></br>
                        <br></br>
                    </h3>
                    <p className="content_paragraphs first_paragraph">
                        How it works? Fairly simple. If a candidate finds a suitable
                        position at your company that he/she is interested in, they can
                        submit a referral through our platform which may involve providing
                        their contact information, their profile and a resume.<br></br>
                        <br></br> All you have to do is refer.<br></br>
                        <br></br> Let us take you through how you can set up your
                        professional Nectworks account.
                    </p>
                </div>
            </div>

            <div className="containers">
                <div className="content_first">
                    <h3 className="second_content_heading">
                        1. Verify your professional email
                    </h3>{' '}
                    <br></br>
                    <p className="content_paragraphs">
                        In order to avail the perks of having a professional account, it is
                        mandatory to verify your professional email in our platform.
                        <br></br>
                        <br></br> Add your email and your company name, verify with an OTP
                        and you are set.<br></br>
                        <br></br> This gives you the ability to post available openings at
                        your company to attract candidates for referrals and to unlock
                        features we have in store for the future.
                    </p>
                    <div className="placeholders_mobile">
                        <img
                            src={Placeholder1.src}
                            alt="Image Not Found"
                            className="placehoder_mobile"
                            width={350}
                            height={260}
                        />
                    </div>
                </div>

                <div className="placeholders">
                    <img
                        src={Placeholder1.src}
                        alt="Image Not Found"
                        className="placehoder-img"
                    />
                </div>
            </div>
            <div className="containers">
                <div className="placeholders">
                    <img
                        src={Placeholder1.src}
                        alt="Image Not Found"
                        className="placehoder-img"
                    />
                </div>
                <div className="content_first">
                    <h3 className="second_content_heading_left">
                        2. Add your username <br></br>
                    </h3>
                    <p className="content_paragraphs_left">
                        Select an unique username with a character count of 3-20, for your
                        profile that will show up in your public profile URL. This username
                        ties your activity as both a professional and a job seeker at
                        Nectworks.<br></br>
                        <br></br>
                        Once set, you can share your public profile on your social media
                        channels to attract referral requests from potential candidates.
                        <br></br>
                        <br></br>
                        Such requests will contain a job ID, job URL, personal information
                        and a resume. <br></br>
                        <br></br>
                    </p>
                    <div className="placeholders_mobile">
                        <img
                            src={Placeholder1.src}
                            alt="Image Not Found"
                            className="placehoder_mobile"
                            width={350}
                            height={260}
                        />
                    </div>
                </div>
            </div>
            <div className="containers">
                <div className="content_first">
                    <h3 className="second_content_heading">
                        3. Let people know you are<br></br>
                        <br></br>
                    </h3>
                    <p className="content_paragraphs">
                        Once your username and professional email is added, head over to my
                        profile and add your personal details.<br></br>
                        <br></br>
                        You can add details such as a brief intro, your academic and
                        professional details and your skills. These details will reflect in
                        your public profile.
                        <br></br>
                        <br></br>
                        This gives a job seeker an idea on who you are at the company they
                        seek a referral in. <br></br>
                        <br></br>
                    </p>
                    <div className="placeholders_mobile">
                        <img
                            src={Placeholder1.src}
                            alt="Image Not Found"
                            className="placehoder_mobile"
                            width={350}
                            height={260}
                        />
                    </div>
                </div>
                <div className="placeholders">
                    <img
                        src={Placeholder1.src}
                        alt="Image Not Found"
                        className="placehoder-img"
                    />
                </div>
            </div>
            <div className="containers">
                <div className="placeholders">
                    <img
                        src={Placeholder1.src}
                        alt="Image Not Found"
                        className="placehoder-img"
                    />
                </div>
                <div className="content_first">
                    <h3 className="second_content_heading_left">
                        4. Add job postings <br></br>
                        <br></br>
                    </h3>
                    <p className="content_paragraphs_left">
                        Post available job openings at your company in our post a job
                        section in order to attract referrals for the particular role.
                        <br></br>
                        <br></br>
                        Add details like the job title, location, work type, job roles and
                        responsibilities, job ID etc.<br></br>
                        <br></br>
                        This gives job seekers an overview on the role they are seeking
                        referrals on and once a referral is requested, you will find it in
                        your dashboard.<br></br>
                        <br></br>
                    </p>
                </div>
            </div>
            <div className="professional-banner-container">
                <div className="text-left">
                    <h3>Have more queries</h3>
                    <p>
                        Head over to our FAQ page or post a query at Contact Us and we will
                        get back to you.
                    </p>
                </div>
                <div className="btn-right">
                    <Link href="/faq">
                        <button className="professional-btn" onClick={scrollToTop}>
                            FAQ
                        </button>
                    </Link>
                    <Link href="/contact-us">
                        <button className="professional-btn" onClick={scrollToTop}>
                            Contact Us
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Professional;
