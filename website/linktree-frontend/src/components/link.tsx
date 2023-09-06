'use client';

import settings from '../settings.json';

import { neue } from '../assets/fonts';
import { Open_Sans } from 'next/font/google';
const sans = Open_Sans({ weight: "600", subsets: ["latin"] });

interface LinkProps {
    label: string;
    link: string;
}

export default function Link({ label, link }: LinkProps) {

    return (
        <a className={`aLink`} href={link} target='_blank'>
            <button className={`btnLink ${sans.className}`}>
                {label}
            </button>
        </a>
    )
}