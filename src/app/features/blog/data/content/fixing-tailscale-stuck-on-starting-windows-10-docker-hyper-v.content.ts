import { ContentBlock } from '../../models/blog.models';

/**
 * Article Content: Fixing "Tailscale Stuck on Starting…" on Windows 10 (Docker Desktop / Hyper-V Systems)
 */
export const content: ContentBlock[] = [
  {
    type: 'component',
    data: {
      componentName: 'social-media-links',
      backgroundVariant: 'dark',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'If you\'ve installed Tailscale on Windows 10/11 and when it starts it just says:',
      className: 'lead',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '"Starting…"',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '…you\'re at the right place.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'This issue commonly shows up on machines running Docker Desktop, Hyper-V, WSL2, or other virtual networking components. The service appears to be running, but the Tailscale VPN never actually connects.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'This post walks through:',
    },
  },
  {
    type: 'list',
    data: {
      style: 'unordered',
      items: [
        'The exact symptoms',
        'Why it happens',
        'The full fix that worked',
        'Why Docker and Hyper-V systems are more prone to it',
      ],
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'What is Tailscale?',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Tailscale is a VPN service that creates a secure private network between your devices using WireGuard. Unlike traditional VPNs, Tailscale provides zero-config networking that just works - that is, when it starts properly.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The Tailscale VPN allows you to access your devices from anywhere, set up exit nodes for secure browsing, and connect your entire infrastructure without complex firewall configurations.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'The Symptoms',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'On the affected Windows 10 machine after you install Tailscale:',
    },
  },
  {
    type: 'list',
    data: {
      style: 'unordered',
      items: [
        'The Tailscale tray icon says "Starting…" indefinitely',
        '<code>Get-Service Tailscale</code> shows Running',
        '<code>tailscale up</code> in PowerShell hangs with no output',
        'No "Tailscale Tunnel" adapter appears in Network Connections',
        'Restarting the service does nothing',
        'Stopping Docker Desktop doesn\'t fix it',
      ],
    },
  },
  {
    type: 'adsense',
    data: {},
  },
  {
    type: 'paragraph',
    data: {
      text: 'Meanwhile, Tailscale works perfectly on other machines.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'What\'s Actually Broken?',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Tailscale on Windows relies on a virtual network adapter (Wintun driver).',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'In this failure state:',
    },
  },
  {
    type: 'list',
    data: {
      style: 'unordered',
      items: [
        'The Windows service starts',
        'The CLI runs',
        'But the tunnel adapter never gets created',
      ],
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Without that adapter, Tailscale has nothing to bind to - so it just sits there.',
    },
  },
  {
    type: 'component',
    data: {
      componentName: 'email-cta',
      darkThemeBg: 'primary',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'This is usually caused by a corrupted Windows NDIS/network binding stack. Machines that run:',
    },
  },
  {
    type: 'list',
    data: {
      style: 'unordered',
      items: [
        'Docker Desktop',
        'Hyper-V',
        'WSL2',
        'Old VPN clients',
        'Virtual switches',
      ],
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '…are more likely to hit this issue.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'The Fix',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'This fully resets Windows networking and forces the virtual driver stack to rebuild.',
    },
  },
  {
    type: 'component',
    data: {
      componentName: 'alert-warning',
      title: 'Important Note',
      content: 'This temporarily removes and reinstalls network adapters. That\'s expected behavior and part of the fix.',
      icon: 'warning',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'Step 1 – Uninstall Tailscale',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Go to:',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Settings → Apps → Tailscale → Uninstall</strong>',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Reboot.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'Step 2 – Deep Reset the Windows Network Stack',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Open PowerShell as Administrator and run:',
    },
  },
  {
    type: 'code',
    data: {
      language: 'powershell',
      code: `netsh winsock reset
netsh int ip reset
netcfg -d`,
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'You may see an "Access is denied" during <code>netsh int ip reset</code>, that\'s fine.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The important command is:',
    },
  },
  {
    type: 'code',
    data: {
      language: 'powershell',
      code: 'netcfg -d',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'This does the heavy lifting:',
    },
  },
  {
    type: 'list',
    data: {
      style: 'unordered',
      items: [
        'Removes WAN miniports',
        'Removes network adapters',
        'Clears binding corruption',
        'Rebuilds the NDIS stack',
        'Resets Hyper-V switch bindings',
      ],
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'You will see adapters being removed in the output, hat\'s normal.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'When it finishes, reboot immediately.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'Step 3 – Confirm Network Is Working',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'After reboot:',
    },
  },
  {
    type: 'code',
    data: {
      language: 'powershell',
      code: 'ipconfig',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Make sure:',
    },
  },
  {
    type: 'list',
    data: {
      style: 'unordered',
      items: [
        'You get a valid LAN IP (e.g., 192.168.x.x)',
        'Internet access works',
      ],
    },
  },
  {
    type: 'adsense',
    data: {},
  },
  {
    type: 'paragraph',
    data: {
      text: 'If networking is normal, continue.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'Step 4 – Download Tailscale and Reinstall Properly',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Now it\'s time to reinstall Tailscale. Download Tailscale from the official website and follow these steps:',
    },
  },
  {
    type: 'list',
    data: {
      style: 'ordered',
      items: [
        'Download the latest Tailscale installer from <a href="https://tailscale.com/download" target="_blank" rel="noopener noreferrer">tailscale.com/download</a>',
        'Right-click the installer → Run as Administrator',
        'Let the Tailscale installation complete',
        'Reboot again',
      ],
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Do not start Docker Desktop yet.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'Step 5 – Verify the Tunnel Adapter Exists',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Before opening the tray app, go to:',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Control Panel → Network and Sharing Center → Change Adapter Settings</strong>',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'You should now see:',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Tailscale/Tailscale Tunnel</strong>',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'If you see it, the driver installed correctly.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'Step 6 – Bring Tailscale Up',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Open PowerShell (Admin):',
    },
  },
  {
    type: 'code',
    data: {
      language: 'powershell',
      code: 'tailscale up',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The <code>tailscale up</code> command initializes your connection. You should now:',
    },
  },
  {
    type: 'list',
    data: {
      style: 'unordered',
      items: [
        'See browser login open',
        'Successfully authenticate',
        'Get a 100.x.x.x IP address',
      ],
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'You can confirm with:',
    },
  },
  {
    type: 'code',
    data: {
      language: 'powershell',
      code: 'tailscale ip',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'At this point, Tailscale should work normally.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Now you can start Docker Desktop again.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Why This Works',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<code>netcfg -d</code> forces Windows to completely rebuild the network binding stack.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'On Docker / Hyper-V systems, it\'s common for:',
    },
  },
  {
    type: 'list',
    data: {
      style: 'unordered',
      items: [
        'Old virtual adapters',
        'VPN remnants',
        'Corrupted bindings',
        'Incomplete driver registrations',
      ],
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '…to prevent new virtual drivers from attaching properly.',
    },
  },
  {
    type: 'adsense',
    data: {},
  },
  {
    type: 'paragraph',
    data: {
      text: 'The Tailscale service starts, but the Wintun adapter never registers.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Resetting the stack clears the corruption and allows the driver to install cleanly.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'What You Do NOT Need',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'You do not need:',
    },
  },
  {
    type: 'list',
    data: {
      style: 'unordered',
      items: [
        'The Docker Desktop Tailscale extension',
        'A Tailscale container',
        'Host networking mode',
        'Special Docker configuration',
        'Hyper-V changes',
      ],
    },
  },
  {
    type: 'component',
    data: {
      componentName: 'email-cta',
      darkThemeBg: 'primary',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Tailscale should run on Windows itself — not inside Docker.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Configuring Tailscale Exit Nodes',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Once your Tailscale install is working properly, you can configure a Tailscale exit node to route all your internet traffic through another device on your network. This is useful for secure browsing from public WiFi or accessing region-specific content.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'To set up an exit node, use:',
    },
  },
  {
    type: 'code',
    data: {
      language: 'powershell',
      code: 'tailscale up --advertise-exit-node',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Then enable it in the Tailscale admin console. Other devices can then route through this machine as their exit node.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'If It Still Doesn\'t Work',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'After you reinstall Tailscale, check if the Wintun driver exists:',
    },
  },
  {
    type: 'code',
    data: {
      language: 'powershell',
      code: 'pnputil /enum-drivers | findstr /i wintun',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'If nothing appears, Windows may be blocking the driver from installing.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'At that point, you\'re likely dealing with Group Policy restrictions, antivirus interference, or other system-level blocks that prevent unsigned or third-party drivers from loading.',
    },
  },
  {
    type: 'component',
    data: {
      componentName: 'social-media-links',
      backgroundVariant: 'dark',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Frequently Asked Questions',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'Why does Tailscale get stuck on "Starting…" on Windows?',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Tailscale relies on a virtual network adapter called the Wintun driver. When the Windows NDIS network stack becomes corrupted—often from Docker Desktop, Hyper-V, WSL2, or old VPN clients—the adapter fails to initialize. The service runs, but with no tunnel adapter to bind to, Tailscale never actually connects.',
    },
  },
  {
    type: 'adsense',
    data: {},
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'Will netcfg -d break my network connection?',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Temporarily, yes. The <code>netcfg -d</code> command removes all network adapters and rebuilds the network stack. After rebooting, Windows automatically reinstalls your network drivers and restores connectivity. This is a clean reset, not permanent damage.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'Do I need to uninstall Docker Desktop to fix Tailscale?',
    },
  },
  {
    type: 'component',
    data: {
      componentName: 'email-cta',
      darkThemeBg: 'primary',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'No. You can keep Docker Desktop installed. The issue isn\'t Docker itself—it\'s the corrupted network stack that accumulated over time. After resetting the stack and reinstalling Tailscale, both will work normally together.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'Can I run Tailscale inside Docker instead of on Windows?',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'You can, but it\'s not recommended for most users. Running Tailscale in a container requires host networking mode or complex routing configurations. It\'s simpler and more reliable to run Tailscale natively on Windows, where it integrates properly with the system network stack.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'What does the Wintun driver do?',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Wintun is a high-performance virtual network driver for Windows. Tailscale uses it to create the "Tailscale Tunnel" adapter that routes traffic through the Tailscale VPN network. If Wintun doesn\'t load, Tailscale has no way to send or receive packets.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'Why does this issue affect Docker and Hyper-V systems more?',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Docker Desktop and Hyper-V create their own virtual network adapters and switches. Over time, repeated installs/uninstalls, driver updates, and binding changes can corrupt the Windows network stack. Systems that only run standard network hardware rarely encounter this corruption.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'What if the Tailscale Tunnel adapter still doesn\'t appear after reinstalling?',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'If the tunnel adapter doesn\'t show up in Network Connections after you install Tailscale, check if the Wintun driver loaded with <code>pnputil /enum-drivers | findstr /i wintun</code>. If it\'s missing, Windows may be blocking unsigned or third-party drivers due to Group Policy, Secure Boot settings, or antivirus software.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'How do I download Tailscale for Windows?',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'To download Tailscale, visit <a href="https://tailscale.com/download" target="_blank" rel="noopener noreferrer">tailscale.com/download</a> and select the Windows installer. Always download Tailscale from the official website to ensure you get the latest stable version.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'Is this fix safe to run on a production machine?',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'It\'s safe, but disruptive. The <code>netcfg -d</code> command rebuilds the network stack, which temporarily disconnects all network access and requires multiple reboots. On a production machine, schedule this during maintenance windows. Test on a development or staging machine first if possible.',
    },
  },
];
