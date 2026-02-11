import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'All The Things - Your Swiss Army Knife of Web Utilities'
  },
  {
    path: 'tools',
    loadComponent: () => import('./features/tools/tools').then(m => m.ToolsComponent),
    title: 'Online Toolbox of Free Web Utilities — All The Tools'
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about').then(m => m.AboutComponent),
    title: 'About - All The Things'
  },
  {
    path: 'privacy',
    loadComponent: () => import('./features/privacy/privacy').then(m => m.PrivacyComponent),
    title: 'Privacy Policy - All The Things'
  },
  {
    path: 'terms',
    loadComponent: () => import('./features/terms/terms').then(m => m.TermsComponent),
    title: 'Terms of Service - All The Things'
  },
  {
    path: 'disclaimer',
    loadComponent: () => import('./features/disclaimer/disclaimer').then(m => m.Disclaimer),
    title: 'Disclaimer - All The Things'
  },
  {
    path: 'accessibility',
    loadComponent: () => import('./features/accessibility/accessibility').then(m => m.AccessibilityComponent),
    title: 'Accessibility Statement - All The Things'
  },
  {
    path: 'changelog',
    loadComponent: () => import('./features/changelog/changelog').then(m => m.Changelog),
    title: 'Changelog - All The Things'
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact-form/contact-form').then(m => m.ContactForm),
    title: 'Contact Us - All The Things'
  },
  {
    path: 'tools/percentage-calculator',
    loadComponent: () => import('./features/tools/math-and-calculators/percentage-calculator/percentage-calculator').then(m => m.PercentageCalculatorComponent),
    title: 'Percentage Calculator - All The Things'
  },
  {
    path: 'tools/percentage-calculator/:variant',
    loadComponent: () => import('./features/tools/math-and-calculators/percentage-calculator/percentage-calculator').then(m => m.PercentageCalculatorComponent),
    title: 'Percentage Calculator - All The Things'
  },
  {
    path: 'presskit',
    loadComponent: () => import('./features/presskit/presskit').then(m => m.Presskit),
    title: 'All The Tools - Presskit'
  },
  {
    path: 'tools/tip-calculator',
    loadComponent: () => import('./features/tools/math-and-calculators/tip-calculator/tip-calculator').then(m => m.TipCalculator),
    title: 'Tip Calculator - All The Things'
  },
  {
    path: 'tools/bmi-calculator',
    loadComponent: () => import('./features/tools/math-and-calculators/body-mass-index-calculator/body-mass-index-calculator').then(m => m.BodyMassIndexCalculator),
    title: 'BMI Calculator - All The Things'
  },
  {
    path: 'tools/roman-numeral-converter',
    loadComponent: () => import('./features/tools/math-and-calculators/roman-numeral-converter/roman-numeral-converter').then(m => m.RomanNumeralConverter),
    title: 'Roman Numeral Converter - All The Things'
  },
  {
    path: 'tools/base-number-converter',
    loadComponent: () => import('./features/tools/math-and-calculators/base-number-converter/base-number-converter').then(m => m.BaseNumberConverterComponent),
    title: 'Base Number Converter - All The Things'
  },
  {
    path: 'tools/base-number-converter/:pair',
    loadComponent: () => import('./features/tools/math-and-calculators/base-number-converter/base-number-converter').then(m => m.BaseNumberConverterComponent),
    title: 'Base Number Converter - All The Things'
  },
  {
    path: 'tools/unit-converter',
    loadComponent: () => import('./features/tools/converters/unit-converter/unit-converter').then(m => m.UnitConverter),
    title: 'Unit Converter - All The Things'
  },
  {
    path: 'tools/unit-converter/:pair',
    loadComponent: () => import('./features/tools/converters/unit-converter/unit-converter').then(m => m.UnitConverter),
    title: 'Unit Converter - All The Things'
  },
  {
    path: 'tools/word-counter',
    loadComponent: () => import('./features/tools/text-tools/word-counter/word-counter').then(m => m.WordCounter),
    title: 'Word Counter - All The Things'
  },
  {
    path: 'tools/case-converter',
    loadComponent: () => import('./features/tools/text-tools/case-converter/case-converter').then(m => m.CaseConverter),
    title: 'Case Converter - All The Things'
  },
  {
    path: 'tools/ascii-character-reference',
    loadComponent: () => import('./features/tools/text-tools/ascii-character-reference/ascii-character-reference').then(m => m.AsciiCharacterReference),
    title: 'ASCII Character Reference Table - Complete ASCII Code Chart - All The Things'
  },
  {
    path: 'tools/lorem-ipsum',
    loadComponent: () => import('./features/tools/generators/lorem-ipsum/lorem-ipsum').then(m => m.LoremIpsum),
    title: 'Lorem Ipsum Generator - All The Things'
  },
  {
    path: 'tools/password-generator',
    loadComponent: () => import('./features/tools/generators/password-generator/password-generator').then(m => m.PasswordGenerator),
    title: 'Password Generator - All The Things'
  },
  {
    path: 'tools/qr-code-generator',
    loadComponent: () => import('./features/tools/generators/qr-code-generator/qr-code-generator').then(m => m.QrCodeGenerator),
    title: 'QR Code Generator - All The Things'
  },
  {
    path: 'tools/uuid-generator',
    loadComponent: () => import('./features/tools/generators/uuid-generator/uuid-generator').then(m => m.UuidGenerator),
    title: 'UUID Generator - All The Things'
  },
  {
    path: 'tools/color-picker',
    loadComponent: () => import('./features/tools/color-tools/color-picker/color-picker').then(m => m.ColorPicker),
    title: 'Color Picker - All The Things'
  },
  {
    path: 'tools/gradient-generator',
    loadComponent: () => import('./features/tools/color-tools/gradient-generator/gradient-generator').then(m => m.GradientGenerator),
    title: 'Gradient Generator - All The Things'
  },
  {
    path: 'tools/timestamp-converter',
    loadComponent: () => import('./features/tools/time-and-date/timestamp-converter/timestamp-converter').then(m => m.TimestampConverter),
    title: 'Timestamp Converter - All The Things'
  },
  {
    path: 'tools/time-zone-converter',
    loadComponent: () => import('./features/tools/time-and-date/timezone-converter/timezone-converter').then(m => m.TimezoneConverter),
    title: 'Timezone Converter - All The Things'
  },
  {
    path: 'tools/timer-stopwatch-clock',
    loadComponent: () => import('./features/tools/time-and-date/timer-stopwatch/timer-stopwatch').then(m => m.TimerStopwatch),
    title: 'Online Timer & Stopwatch - Free Web Clock Tool | All The Things'
  },
  {
    path: 'tools/timer-stopwatch-clock/timer',
    loadComponent: () => import('./features/tools/time-and-date/timer-stopwatch/timer-stopwatch').then(m => m.TimerStopwatch),
    title: 'Online Countdown Timer - Free Timer Tool | All The Things'
  },
  {
    path: 'tools/timer-stopwatch-clock/stopwatch',
    loadComponent: () => import('./features/tools/time-and-date/timer-stopwatch/timer-stopwatch').then(m => m.TimerStopwatch),
    title: 'Online Stopwatch with Laps - Free Stopwatch Tool | All The Things'
  },
  {
    path: 'tools/icon-generator',
    loadComponent: () => import('./features/tools/image-tools/icon-generator/icon-generator').then(m => m.IconGenerator),
    title: 'Icon Generator - All The Things'
  },
  {
    path: 'tools/photo-filter-studio',
    loadComponent: () => import('./features/tools/image-tools/photo-filter-studio/photo-filter-studio').then(m => m.PhotoFilterStudio),
    title: 'Photo Filter Studio - All The Things'
  },
  {
    path: 'tools/currency-converter',
    loadComponent: () => import('./features/tools/converters/currency-converter/currency-converter').then(m => m.CurrencyConverter),
    title: 'Currency Converter - All The Things'
  },
  {
    path: 'tools/currency-converter/:pair',
    loadComponent: () => import('./features/tools/converters/currency-converter/currency-converter').then(m => m.CurrencyConverter),
    title: 'Currency Converter - All The Things'
  },
  {
    path: 'tools/roku-compatibility',
    loadComponent: () => import('./features/tools/hardware/roku-compatibility-checker/roku-compatibility-checker').then(m => m.RokuCompatibilityChecker),
    title: 'Roku Compatibility - All The Things'
  },
  {
    path: 'tools/barcode-reader',
    loadComponent: () => import('./features/tools/ocr-tools/barcode-reader/barcode-reader').then(m => m.BarcodeReader),
    title: 'Barcode Reader - All The Things'
  },
  {
    path: 'tools/on-reward-scanner',
    loadComponent: () => import('./features/tools/ocr-tools/on-reward-scanner/on-reward-scanner').then(m => m.OnRewardScanner),
    title: 'On! Reward Code Scanner - All The Things'
  },
  {
    path: 'tools/social-media-launchpad',
    loadComponent: () => import('./features/tools/social-media/social-launchpad/components/social-launchpad/social-launchpad').then(m => m.SocialLaunchpadComponent),
    title: 'Social Media Launchpad - All The Things'
  },
  {
    path: 'tools/spotify-playlist-export',
    loadComponent: () => import('./features/tools/music-and-audio/spotify-playlist-exporter/spotify-playlist-exporter').then(m => m.SpotifyPlaylistExporter),
    title: 'Spotify Playlist Exporter - All The Things'
  },
  {
    path: 'tools/spotify/callback',
    loadComponent: () => import('./features/tools/music-and-audio/spotify-playlist-exporter/spotify-callback.component').then(m => m.SpotifyCallbackComponent),
    title: 'Spotify Authentication - All The Things'
  },
  {
    path: 'tools/morse-code-converter',
    loadComponent: () => import('./features/tools/music-and-audio/morse-code-converter/morse-code-converter.component').then(m => m.MorseCodeConverterComponent),
    title: 'Morse Code Converter - All The Things'
  },
  {
    path: 'tools/scientific/periodic-table-of-elements',
    loadComponent: () => import('./features/tools/scientific/periodic-table-of-elements/periodic-table-of-elements').then(m => m.PeriodicTableOfElements),
    title: 'Interactive Periodic Table of Elements - All The Tools'
  },
  {
    path: 'blog',
    loadChildren: () => import('./features/blog/blog.routes').then(m => m.BLOG_ROUTES),
  },
  {
    path: 'resources',
    loadChildren: () => import('./features/resources/resources.routes').then(m => m.RESOURCES_ROUTES),
  },
  {
    path: '3d-artist-spotlight',
    loadChildren: () => import('./features/in-the-verse-artist-list/artists.routes').then(m => m.ARTISTS_ROUTES),
  },
  {
    path: '404',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: '404 - Page Not Found | AllTheTools.dev'
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: '404 - Page Not Found | AllTheTools.dev'
  }
];
