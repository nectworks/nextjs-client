import inter from '@/lib/font/Inter';
import './globals.css';
import Wrapper from './wrapper';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Wrapper>{children}</Wrapper>
        <div className="info-box" id="info-box"></div>
      </body>
    </html>
  );
}
