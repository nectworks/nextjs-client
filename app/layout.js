import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Nectworks - Job Referrals and more',
  description: 'Centralize all candidates in one place for effortless referral, analysis, and streamlined hiring. Boost your recruitment process with our user-friendly platform.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
