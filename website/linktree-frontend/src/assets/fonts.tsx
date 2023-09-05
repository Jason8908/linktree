import localFont from "next/font/local";

export const neue = localFont({ 
    src: [
      {
        path: '../assets/fonts/neue/NeueHaasDisplayBlack.ttf',
        weight: '400',
        style: 'normal'
      },
      {
        path: '../assets/fonts/neue/NeueHaasDisplayBold.ttf',
        weight: '700',
        style: 'normal'
      },
      {
        path: '../assets/fonts/neue/NeueHaasDisplayLight.ttf',
        weight: '100',
        style: 'normal'
      }
    ]
});