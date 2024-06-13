'use client';
/*
  FileName - Accordion.js
  Desc -  This file defines a reusable Accordion component that renders a list of collapsible items, each containing a question and answer. Users can click on a question to reveal its answer. The state is managed to control which items are open or closed.
*/
import { useState } from 'react';
import Image from 'next/image';
import './Accordion.css'; // Import your custom CSS file for styling
import accordianArrow from '../../../public/accordianArrow.svg';

export const AccordionItem = ({ title, content, isOpen, onClick }) => {
  return (
    <div className={`accordion-item ${isOpen ? 'open' : ''}`} onClick={onClick}>
      <div className="accordion-title">
        <span className="title-text">{title}</span>
        <span>
          <Image
            alt="arrow icon"
            src={accordianArrow}
            className={`accordian-item-icon 
            ${isOpen ? 'accordian-item-active-icon' : ''}`}
          />
        </span>
      </div>
      {isOpen && <div className="accordion-content">{content}</div>}
    </div>
  );
};

export default function Accordion() {
  const [openIndex, setOpenIndex] = useState(-1);
  const handleItemClick = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };
  const accordionItems = [
    {
      title: 'How does it work?',
      content:
        'You can either submit a referral request specific to a job posting,' +
        'or share a Job ID or Job URL. We will send the request to the referrers in the company of your choosing.',
    },
    {
      title: 'Are interviews guaranteed by the referrers?',
      content:
        'No, while a referrer may guarantee that your application will ' +
        'be reviewed by a hiring manager, it is not guaranteed that you will land an interview.' +
        ' But, referrals will increase your chances to land one.',
    },
    {
      title: 'What happens after getting referred?',
      content:
        'Once you get referred, you might receive an email with' +
        ' further instructions for the next process.',
    },
    {
      title: 'How long does it take to get referred?',
      content:
        'Once a referral request is submitted, ' +
        'your request will be sent to the referrer. ' +
        'Referrers typically take 3 to 6 days to submit your referral.',
    },
    {
      title: 'Where can I reach Nectworks if I have another question?',
      content:
        'If you have any other queries that you wish to get resolved, let us know at Contact Us',
    },
  ];

  return (
    <div className="accordion-container">
      <div className="accordion">
        {accordionItems.map((item, index) => (
          <AccordionItem
            key={index}
            title={item.title}
            content={item.content}
            isOpen={index === openIndex}
            onClick={() => handleItemClick(index)}
          />
        ))}
      </div>
    </div>
  );
}
