import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subject, takeUntil } from 'rxjs';
import { TimerStopwatchMode } from './models/timer-stopwatch.models';
import { TimerComponent } from './components/timer/timer.component';
import { StopwatchComponent } from './components/stopwatch/stopwatch.component';
import { MetaService } from '../../../../core/services/meta.service';
import { CtaEmailList } from '../../../reusable-components/cta-email-list/cta-email-list';
import { AdsenseComponent } from '../../../blog/components/adsense/adsense.component';

@Component({
  selector: 'app-timer-stopwatch',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    TimerComponent,
    StopwatchComponent,
    CtaEmailList,
    AdsenseComponent
  ],
  templateUrl: './timer-stopwatch.html',
  styleUrl: './timer-stopwatch.scss'
})
export class TimerStopwatch implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private metaService = inject(MetaService);
  private destroy$ = new Subject<void>();

  // Current mode based on URL
  currentMode = signal<TimerStopwatchMode>('timer');

  // Tab links
  tabs = [
    { label: 'Timer', icon: 'hourglass_empty', mode: 'timer' as TimerStopwatchMode, path: '/tools/timer-stopwatch-clock/timer' },
    { label: 'Stopwatch', icon: 'av_timer', mode: 'stopwatch' as TimerStopwatchMode, path: '/tools/timer-stopwatch-clock/stopwatch' }
  ];

  // Active tab index
  activeTabIndex = computed(() => this.currentMode() === 'timer' ? 0 : 1);

  ngOnInit(): void {
    // Determine mode from URL
    this.route.url.pipe(takeUntil(this.destroy$)).subscribe(segments => {
      const lastSegment = segments[segments.length - 1]?.path;

      if (lastSegment === 'stopwatch') {
        this.currentMode.set('stopwatch');
      } else {
        // Default to timer for base route or /timer
        this.currentMode.set('timer');
      }

      this.updateMetaTags();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onTabChange(index: number): void {
    const tab = this.tabs[index];
    this.router.navigate([tab.path]);
  }

  scrollToTool(): void {
    const tabNavigation = document.querySelector('.tab-navigation');
    if (tabNavigation) {
      tabNavigation.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  private updateMetaTags(): void {
    const isTimer = this.currentMode() === 'timer';

    const config = isTimer ? {
      title: 'Online Countdown Timer - Free Timer with Presets & Audio Alerts',
      description: 'Free online countdown timer with customizable presets, audio notifications, and a clean interface. Set hours, minutes, and seconds. Save your favorite timer presets.',
      keywords: ['online timer', 'countdown timer', 'free timer', 'timer with alarm', 'pomodoro timer', 'kitchen timer', 'web timer', 'timer presets'],
      url: 'https://www.allthethings.dev/tools/timer-stopwatch-clock/timer',
      image: 'https://www.allthethings.dev/meta-images/og-online-timer.png'
    } : {
      title: 'Online Stopwatch with Laps - Free Stopwatch & Lap Timer',
      description: 'Free online stopwatch with lap recording, edit notes, and local storage. Track split times, record laps, and save your timing data. Perfect for workouts, races, and timing.',
      keywords: ['online stopwatch', 'lap timer', 'split timer', 'free stopwatch', 'workout timer', 'race timer', 'lap counter', 'timing tool'],
      url: 'https://www.allthethings.dev/tools/timer-stopwatch-clock/stopwatch',
      image: 'https://www.allthethings.dev/meta-images/og-online-stopwatch.png'
    };

    this.metaService.updateTags({
      ...config,
      jsonLd: this.metaService.buildToolJsonLd({
        name: config.title,
        description: config.description,
        url: config.url,
        image: config.image
      })
    });
  }
}
