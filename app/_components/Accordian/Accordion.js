'use client';
/*
  FileName - Accordion.js
  Desc -  This file defines a reusable Accordion component that renders a list of collapsible items, each containing a question and answer. Users can click on a question to reveal its answer. The state is managed to control which items are open or closed.
*/

import { useState } from 'react';
import Image from 'next/image';
import './Accordion.css';
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
            width={20}
            height={20}
          />
        </span>
      </div>
      {/* Updated to use animation with CSS max-height transitions */}
      <div 
        className="accordion-content"
        style={{ 
          maxHeight: isOpen ? '500px' : '0',
          opacity: isOpen ? 1 : 0,
          transition: 'max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease',
          overflow: 'hidden',
          padding: isOpen ? '0 1.25rem 1.25rem' : '0 1.25rem 0',
        }}
      >
        {content}
      </div>
    </div>
  );
};

export default function Accordion() {
  const [openIndex, setOpenIndex] = useState(-1);
  
  const handleItemClick = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };
  
  // Updated FAQ content to match the screenshots
  const accordionItems = [
    {
      title: 'How does it work?',
      content:
        'You can either submit a referral request specific to a job posting, ' +
        'or share a Job ID or Job URL. We will send the request to the referrers in the company of your choosing.',
    },
    {
      title: 'Are interviews guaranteed by the referrers?',
      content:
        'No, referrals increase your chances of getting an interview, but don\'t guarantee one. ' +
        'The decision ultimately depends on the company\'s hiring team and your qualifications matching their requirements.',
    },
    {
      title: 'What happens after getting referred?',
      content:
        'After a successful referral, your application enters the company\'s hiring process. ' +
        'The hiring team will review your profile, and if it matches their requirements, they will contact you for interviews. ' +
        'You can track your referral status on your Nectworks dashboard.',
    },
    {
      title: 'How long does it take to get referred?',
      content:
        'Most referrals happen within 48-72 hours after your request is submitted. ' +
        'However, the time can vary depending on the referrer\'s availability and the number of requests they receive.',
    },
    {
      title: 'Where can I reach Nectworks if I have another question?',
      content:
        'You can reach us through our support email at support@nectworks.com or use the chat feature on our website during business hours. ' +
        'We typically respond within 24 hours on weekdays.',
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