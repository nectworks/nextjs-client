'use client';

/*
  File: ProfileHeaderWrapper.js
  Description: A structured wrapper component for ProfileHeader to standardize its usage
  across all pages with consistent styling and behavior.
*/

import { memo } from 'react';
import ProfileHeader from '@/app/_components/Profile/ProfileHeader/ProfileHeader';
import './ProfileHeaderWrapper.css';

const ProfileHeaderWrapper = ({ className }) => {
  return (
    <div className={`profile-header-wrapper ${className || ''}`}>
      <ProfileHeader />
    </div>
  );
};

// Using memo to prevent unnecessary re-renders
export default memo(ProfileHeaderWrapper);