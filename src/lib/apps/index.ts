import { Platform } from '$lib/platforms';

import conversations from './conversations.svg';
import dino from './dino.svg';
import gajim from './gajim.svg';
import kaidan from './kaidan.svg';
import monal from './monal.svg';
import siskin from './siskin.png';
import snikket from './snikket.svg';

export interface Application {
  name: string;
  description: string;
  platforms: Platform[];
  url: string;
  icon: string;
}

export const applications: Application[] = [
  {
    name: 'Conversations',
    description:
      'The gold standard for Android. A highly secure, open-source client with flawless support for OMEMO encryption, file sharing, and push notifications.',
    platforms: [Platform.Android],
    url: 'https://f-droid.org/en/packages/eu.siacs.conversations/',
    icon: conversations,
  },
  {
    name: 'Monal',
    description:
      'The best modern XMPP client for the Apple ecosystem. It offers a native feel, excellent battery optimization, and seamless push notifications for iOS and macOS.',
    platforms: [Platform.macOS, Platform.iOS],
    url: 'https://apps.apple.com/us/app/monal-xmpp-chat/id317711500',
    icon: monal,
  },
  {
    name: 'Dino',
    description:
      'A beautifully clean, lightweight, and modern desktop client built for Linux. It focuses on a simple UI that feels immediately familiar to everyday users.',
    platforms: [Platform.Linux],
    url: 'https://dino.im/',
    icon: dino,
  },
  {
    name: 'Gajim',
    description:
      'A powerful, long-standing desktop client that recently received a massive UI overhaul, making it highly accessible and modern for Windows and Linux users.',
    platforms: [Platform.Windows, Platform.Linux],
    url: 'https://gajim.org/',
    icon: gajim,
  },
  {
    name: 'Kaidan',
    description:
      'A very simple, user-friendly, and modern chat client built with Qt that focuses on providing an uncluttered chat experience across all platforms.',
    platforms: [Platform.Windows, Platform.Linux, Platform.macOS, Platform.Android],
    url: 'https://kaidan.im/',
    icon: kaidan,
  },
  {
    name: 'Siskin IM',
    description:
      'A lightweight and elegant iOS-specific client that brings modern XMPP features like audio/video calls and OMEMO to iPhones and iPads.',
    platforms: [Platform.iOS],
    url: 'https://apps.apple.com/us/app/siskin-im/id1153516838',
    icon: siskin,
  },
  {
    name: 'Snikket',
    description:
      'A turnkey, privacy-focused client and hosting bundle designed to make secure group chat simple for communities, with clean apps for desktop and mobile.',
    platforms: [Platform.Android, Platform.iOS, Platform.Linux, Platform.Windows, Platform.macOS],
    url: 'https://snikket.org/',
    icon: snikket,
  },
];
