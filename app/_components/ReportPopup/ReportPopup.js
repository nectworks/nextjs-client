'use client';
/*
   File: ReportPopup.js
   Description: This component contains the `report` popup window
*/

import './ReportPopup.css';
import crossIcon from '@/public/SignUpConfirmPopup/crossIcon.svg';
import showBottomMessage from '@/Utils/showBottomMessage';
import { useState } from 'react';
import Image from 'next/image';
import ClipLoader from 'react-spinners/ClipLoader';
import usePrivateAxios from '@/Utils/usePrivateAxios';

function ReportPopup({ setShowReportPopup, referral, reportedReferral }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const privateAxios = usePrivateAxios();

  // function to submit report to server
  async function submitReport() {
    if (title.length === 0 && description.length === 0) {
      showBottomMessage('Select action or add a description.');
      return;
    }

    if (!referral || !referral._id) {
      showBottomMessage("Can't report right now.");
      return;
    }
    setIsLoading(true);

    try {
      const res = await privateAxios.post('/refer/private/report', {
        title,
        description,
        referralId: referral._id,
      });

      if (res.status === 200) {
        reportedReferral();

        setShowReportPopup(false);
        showBottomMessage('Successfully reported the referral');
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      showBottomMessage("Couldn't submit report.");
    }
  }

  return (
    <div className="report_popup_container">
      <div className="report_popup_window">
        <div className="report_popup_header">
          <h3>Report</h3>
          <Image
            onClick={() => setShowReportPopup(false)}
            src={crossIcon}
            alt="close report window"
          />
          <p>
            If you see an issue with this profile, let us know here, and
            we&apos;ll check it out.
          </p>
        </div>

        <div className="report_popup_body">
          <h3>Select Action</h3>

          <div className="report_option">
            <input
              type="radio"
              name="misinformation"
              checked={title === 'Misinformation'}
              onChange={() => setTitle('Misinformation')}
              disabled={isLoading}
            />
            <div>
              <h3>Misinformation</h3>
              <p>Incorrect or misleading information in the job posting.</p>
            </div>
          </div>

          <div className="report_option">
            <input
              type="radio"
              name="spam"
              checked={title === 'Spam'}
              onChange={() => setTitle('Spam')}
              disabled={isLoading}
            />
            <div>
              <h3>Spam</h3>
              <p>Repeated or irrelevant information provided.</p>
            </div>
          </div>

          <div className="report_description_container">
            <h3>Description</h3>
            <textarea
              name="description"
              cols="50"
              rows="10"
              maxLength={1000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            ></textarea>
          </div>

          <button onClick={submitReport} disabled={isLoading}>
            {isLoading ? <ClipLoader size={20} /> : 'Send Report'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportPopup;
