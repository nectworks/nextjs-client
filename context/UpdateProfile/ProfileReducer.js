'use client';

/*
   File: ProfileReducer.js
   Description: This file has a reducer function defined to
   update our state provided by our ProfileContext.js file.
*/

/*
  dashboard: {
    about: {
      bio: '',
      additionInfo: '',
    },
    experience: [
      {
        jobTitle: '',
        employmentType: '',
        companyName: '',
        workType: '',
        startMonth: '',
        startYear: num,
        endMonth: '',
        endYear: num,
        industry: '',
        skills: [],
        description: ''
      },
    ],
    education: [
      {
        university: '',
        degree: '',
        fieldOfStudy: '',
        startYear: num,
        endYear: num,
        grade: '',
        description: ''
      }
    ],
    skills: [],
    socials: {},
    achievements: [
      {
        heading: '',
        description: '',
        link: '',
        document: url
      }
    ],
    projects: [
      {
        heading: '',
        description: '',
        skills: [],
        link: ''
        document: url
      }
    ]
  }
*/

// all the subsections in the profile page in order.
const allSubSections = [
  'about',
  'experience',
  'education',
  'socials',
  'skills',
  'achievements',
  'projects',
];

function readDashboardState() {
  if (typeof window === 'undefined') return {};

  try {
    return JSON.parse(localStorage.getItem('dashboard')) || {};
  } catch {
    return {};
  }
}

export const initialState = readDashboardState();

// function to update current state
export function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case 'UPDATE_ABOUT': {
      updateDataLocally(payload);

      return {
        ...state,
        about: payload.about,
      };
    }

    case 'UPDATE_EXPERIENCE': {
      const allCurrExperience = state?.experience || [];
      const index = payload.index;
      const experience =
        index >= allCurrExperience.length
          ? [...allCurrExperience, payload.experience]
          : allCurrExperience.map((item, currIndex) =>
              currIndex === index ? payload.experience : item
            );

      const newState = {
        ...state,
        experience,
      };

      updateDataLocally(newState);
      return newState;
    }

    case 'UPDATE_EDUCATION': {
      const allCurrEducation = state?.education || [];
      const index = payload.index;
      const education =
        index >= allCurrEducation.length
          ? [...allCurrEducation, payload.education]
          : allCurrEducation.map((item, currIndex) =>
              currIndex === index ? payload.education : item
            );

      const newState = {
        ...state,
        education,
      };

      updateDataLocally(newState);
      return newState;
    }

    case 'UPDATE_SOCIALS': {
      const newState = {
        ...state,
        socials: payload.socials,
      };

      updateDataLocally(newState);
      return newState;
    }

    case 'UPDATE_SKILLS': {
      const newState = {
        ...state,
        skills: payload.skills,
      };

      updateDataLocally(newState);
      return newState;
    }

    case 'UPDATE_ACHIEVEMENTS': {
      const allCurrAchievements = state?.achievements || [];
      const index = payload.index;
      const achievements =
        index >= allCurrAchievements.length
          ? [...allCurrAchievements, payload.achievements]
          : allCurrAchievements.map((item, currIndex) =>
              currIndex === index ? payload.achievements : item
            );

      const newState = {
        ...state,
        achievements,
      };

      updateDataLocally(newState);
      return newState;
    }

    case 'UPDATE_PROJECTS': {
      const allCurrProjects = state?.projects || [];
      const index = payload.index;
      const projects =
        index >= allCurrProjects.length
          ? [...allCurrProjects, payload.projects]
          : allCurrProjects.map((item, currIndex) =>
              currIndex === index ? payload.projects : item
            );

      const newState = {
        ...state,
        projects,
      };

      updateDataLocally(newState);
      return newState;
    }

    case 'REMOVE_SECTION': {
      const sectionToRemove = allSubSections[payload.step];

      // remove the section and save the new state
      const newState = { ...state };
      delete newState[sectionToRemove];

      localStorage.setItem('dashboard', JSON.stringify(newState));
      return newState;
    }

    case 'CLEAR_STATE': {
      localStorage.removeItem('dashboard');
      return {};
    }

    default: {
      return state;
    }
  }
}

/* 
function to save data to localStorage this function is called from children components
*/
export function updateDataLocally(updatedData) {
  if (typeof window === 'undefined') return;

  // get the current dashboard data
  const oldDashboardData = readDashboardState();

  // update the data with new changes.
  const newDashboardData = {
    ...oldDashboardData,
    ...updatedData,
  };

  // save the data to localStorage
  localStorage.setItem('dashboard', JSON.stringify(newDashboardData));
}
