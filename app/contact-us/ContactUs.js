'use client';

import './ContactUs.css';
import emailIcon from '../../public/SignIn/emailIcon.svg';
import linkedinIcon from '../../public/ContactUs/linkedinIcon.svg';
import greenTick from '../../public/ContactUs/greenTick.svg';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { publicAxios } from '../../config/axiosInstance';
import sendGAEvent from '../../Utils/gaEvents';

function ContactUs() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const [promptMessage, setPromptMessage] = useState('');
  const [openPopup, setOpenPopup] = useState(false);

  // Add state variables for alert messages
  const [firstNameAlert, setFirstNameAlert] = useState('');
  const [lastNameAlert, setLastNameAlert] = useState('');
  const [emailAlert, setEmailAlert] = useState('');
  const [messageAlert, setMessageAlert] = useState('');

  function messageInputControl(e) {
    const messageLength = e.target.value.length;
    const alertMessageContainer = e.target.nextSibling;
    if (alertMessageContainer) {
      alertMessageContainer.innerText = '';
      if (messageLength === 0) {
        alertMessageContainer.innerText = 'Add your message';
      } else if (messageLength >= 500) {
        alertMessageContainer.innerText = 'Max characters reached';
      }
    }
    setMessage(e.target.value.substring(0, 500));
  }

  async function handleSubmit(e) {
    sendGAEvent('contact_us');

    e.preventDefault();
    setPromptMessage('');

    // Reset all alert messages before validating
    setFirstNameAlert('');
    setLastNameAlert('');
    setEmailAlert('');
    setMessageAlert('');

    if (!firstName || !lastName || !email || !message) {
      if (!firstName) setFirstNameAlert('Add your first name');
      if (!lastName) setLastNameAlert('Add your last name');
      if (!email) setEmailAlert('Add your email ID');
      if (!message) setMessageAlert('Add your message');
      return;
    }

    try {
      await publicAxios.post('/others/contact-us', {
        firstName,
        lastName,
        email,
        phone,
        message,
      });

      setOpenPopup(true);
    } catch (err) {
      const { error } = err.response.data;
      setPromptMessage(error.message);
    }
  }

  return (
    <div className="contact_us_outer_container">
      {openPopup && (
        <div className="contact_us_confirm_container">
          <div className="contact_us_confirm_window">
            <div className="contact_us_confirm_window_header">
              <h2>Thank you for your message</h2>
              <Image src={greenTick} alt="message submitted" />
            </div>

            <p className="contact_us_confirm_window_content">
              We have received your feedback and we will get in touch with you.
            </p>

            <Link href="/">
              <button>Go Home</button>
            </Link>
          </div>
        </div>
      )}

      <h1>Contact Us</h1>
      <h4>Got any question? Write to us, and we&apos;ll get back to you.</h4>

      <div className="contact_us_inner_container">
        <div className="contact_us_left_container">
          <div>
            <p style={{ marginBottom: '2.8rem' }}>
              Fill in your details we&apos;ll get back to you within a few
              hours.
            </p>

            <p>
              Or mail us at, <br />
              <span style={{ display: 'inline-flex', marginTop: '1rem' }}>
                <Image
                  className="contact_us_email_icon contact_us_icon"
                  src={emailIcon}
                  alt="Email Icon"
                />
                <a className="tag" href="mailto:support@nectworks.com">
                  support@nectworks.com
                </a>
              </span>
            </p>
          </div>

          <div className="contact_us_bottom_icons">
            <span style={{ fontSize: '1.25rem', color: '#D0E7FF' }}>
              Find us on
            </span>
            <a
              href="https://www.linkedin.com/company/nectworks/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={linkedinIcon}
                className="contact_us_icon"
                alt="LinkedIn Icon"
              />
            </a>
          </div>
        </div>

        <div className="contact_us_right_container">
          <form onSubmit={handleSubmit}>
            <div className="first_row contact_us_form_row">
              <div className="contact_us_form_control">
                <label htmlFor="last_name">
                  First Name <span>*</span>
                </label>
                <br />
                <input
                  type="text"
                  id="first_name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {firstNameAlert && (
                  <span className="contact_us_form_control_alert">
                    {firstNameAlert}
                  </span>
                )}
              </div>

              <div className="contact_us_form_control">
                <label htmlFor="last_name">
                  Last Name <span>*</span>
                </label>
                <br />
                <input
                  type="text"
                  id="last_name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {lastNameAlert && (
                  <span className="contact_us_form_control_alert">
                    {lastNameAlert}
                  </span>
                )}
              </div>
            </div>

            <div className="second_row contact_us_form_row">
              <div className="contact_us_form_control">
                <label htmlFor="email_id">
                  Email ID <span>*</span>
                </label>
                <br />
                <input
                  type="text"
                  id="email_id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailAlert && (
                  <span className="contact_us_form_control_alert">
                    {emailAlert}
                  </span>
                )}
              </div>

              <div className="contact_us_form_control">
                <label htmlFor="mobile">Mobile Number</label>
                <br />
                <input
                  type="text"
                  id="mobile"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="third_row contact_us_form_row">
              <div className="contact_us_form_control">
                <label htmlFor="message">
                  Message <span>*</span>
                </label>
                <br />
                <textarea
                  rows={10}
                  cols={50}
                  placeholder={
                    'I want to create an account. ' +
                    'Where can I find the option?'
                  }
                  value={message}
                  onChange={messageInputControl}
                />
                {messageAlert && (
                  <span className="contact_us_form_control_alert">
                    {messageAlert}
                  </span>
                )}
              </div>
            </div>

            <button type="submit">Send</button>
          </form>
        </div>
      </div>

      {promptMessage && (
        <div className="contact_us_prompt_message">{promptMessage}</div>
      )}
    </div>
  );
}

export default ContactUs;
