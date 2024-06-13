/*
   File: gaEvents.js
   Description: This file contains custom events sent to google analytics.

   The custom events are:
   (1). view_resume: a professional has viewed a resume of the seeker,
   (2). view_document: a user's achievement or project related documents
        were viewed,
   (3). refer_candidate: a professional has successfully referred a seeker,
   (4). search_seekers: professional used the search feature to search
        for a seeker,
   (5). help: a user has submitted a issue via help page,
   (6). contact_us: user has submitted a query in contact-us page,
   (7). profile_steps: a user has completed a checkout step while adding
        information in their profile page,
*/

import ReactGA from 'react-ga4';

// define all the custom events sent to google analytics
const viewResume = {
  category: 'button',
  action: 'view_resume',
  label: 'user viewed a resume',
};

const viewDocument = {
  /* this event is sent when a user opens a document
   related to achivement or project */
  category: 'button',
  action: 'view_document',
  label: 'user viewed a document',
};

const referCandidate = {
  category: 'referral',
  action: 'refer_candidate',
  label: 'seeker was referred',
};

const searchSeekers = {
  category: 'referral',
  action: 'search_seekers',
};

const helpRequest = {
  category: 'form_submission',
  action: 'help_request',
};

const contactUs = {
  category: 'form_submission',
  action: 'contact_us_request',
};

const profileInfoSteps = {
  category: 'profile',
  action: 'profile_info_steps',
};

// map event names to respective event objects.
const allEvents = {
  view_resume: viewResume,
  view_document: viewDocument,
  refer_candidate: referCandidate,
  search_seekers: searchSeekers,
  help: helpRequest,
  contact_us: contactUs,
  profile_steps: profileInfoSteps,
};

// function to send the event
function sendGAEvent(eventName, data = null) {
  // get the event based on the event name
  const event = allEvents[eventName];

  // if the event was not found, return
  if (!event) return;

  // send the event
  ReactGA.event({ ...event, ...data });
}

export default sendGAEvent;
