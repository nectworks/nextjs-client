import localFont from 'next/font/local';

const inter = localFont({
  src: [
    {
      path: '../../public/font/Inter/Inter-VariableFont_slnt,wght.ttf',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
});

export default inter;
