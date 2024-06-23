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

export const initialState = JSON.parse(localStorage.getItem('dashboard')) || {};

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

      // incoming experience is new experience
      if (index >= allCurrExperience.length) {
        allCurrExperience.push(payload.experience);
      } else {
        // currently editing the previously added experience
        allCurrExperience[index] = payload.experience;
      }

      const newState = {
        ...state,
        experience: allCurrExperience,
      };

      updateDataLocally(newState);
      return newState;
    }

    case 'UPDATE_EDUCATION': {
      const allCurrEducation = state?.education || [];
      const index = payload.index;

      // incoming education is new education
      if (index >= allCurrEducation.length) {
        allCurrEducation.push(payload.education);
      } else {
        // else editing the previously added education
        allCurrEducation[index] = payload.education;
      }

      const newState = {
        ...state,
        education: allCurrEducation,
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

      // incoming education is new achievements
      if (index >= allCurrAchievements.length) {
        allCurrAchievements.push(payload.achievements);
      } else {
        // else editing the previously added achievements
        allCurrAchievements[index] = payload.achievements;
      }

      const newState = {
        ...state,
        achievements: allCurrAchievements,
      };

      updateDataLocally(newState);
      return newState;
    }

    case 'UPDATE_PROJECTS': {
      const allCurrProjects = state?.projects || [];
      const index = payload.index;

      // incoming experience is new experience
      if (index >= allCurrProjects.length) {
        allCurrProjects.push(payload.projects);
      } else {
        // currently editing the previously added experience
        allCurrProjects[index] = payload.projects;
      }

      const newState = {
        ...state,
        projects: allCurrProjects,
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
  // get the current dashboard data
  const oldDashboardData = JSON.parse(localStorage.getItem('dashboard'));

  // update the data with new changes.
  const newDashboardData = {
    ...oldDashboardData,
    ...updatedData,
  };

  // save the data to localStorage
  localStorage.setItem('dashboard', JSON.stringify(newDashboardData));
}
