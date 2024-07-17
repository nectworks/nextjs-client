import { publicAxios } from '@/config/axiosInstance';

export async function generateMetadata({ params }) {
  const username = params.username;
  try {
    const res = await publicAxios.get(`/getUser/${username}`);
    console.log('res in layout', res.data.user);
    const userData = res.data.user;

    const profileRes = await publicAxios.get(
      `/profile/profile-info/${username}`
    );
    console.log('profile data', profileRes.data.data);
    const profileData = profileRes.data.data;

    const baseUrl =
      process.env.NEXT_PUBLIC_CLIENT_URL || 'https://nectworks.com';

    return {
      title: `${userData.firstName} ${userData.lastName}'s Profile | Nectworks`,
      description:
        profileData?.about?.bio ||
        `View ${userData.firstName} ${userData.lastName}'s professional profile on Nectworks`,
      openGraph: {
        title: `${userData.firstName} ${userData.lastName} | Professional Profile`,
        description:
          `${userData?.userDetails?.jobTitle} @ ${userData?.userDetails?.companyName}` ||
          `Connect with ${userData.firstName} ${userData.lastName} on Nectworks`,
        url: `${baseUrl}/user/${username}`,
        siteName: 'Nectworks',
        images: [
          {
            url: userData.profile || `${baseUrl}/nectworksOgImage.webp`,
            width: 1200,
            height: 630,
            alt: `${userData.firstName} ${userData.lastName}'s profile picture`,
          },
        ],
        locale: 'en_US',
        type: 'profile',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${userData.firstName} ${userData.lastName} | Nectworks Profile`,
        description:
          `${userData?.userDetails?.jobTitle} @ ${userData?.userDetails?.companyName}` ||
          `Professional profile of ${userData.firstName} ${userData.lastName}`,
        images: [userData.profile || `${baseUrl}/nectworksOgImage.webp`],
      },
    };
  } catch (error) {
    console.error('Error fetching user data for metadata:', error);
    return {
      title: 'User Profile | Nectworks',
      description: 'View professional profiles on Nectworks',
    };
  }
}

export default function Layout({ children }) {
  return children;
}
