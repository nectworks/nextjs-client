import dynamic from 'next/dynamic';

const ReferCandidates = dynamic(() => import('./ReferralCandidates/ReferCandidates'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div>Loading referral dashboard...</div>
    </div>
  )
});

const ReferPage = () => {
  return <ReferCandidates />;
};

export default ReferPage;