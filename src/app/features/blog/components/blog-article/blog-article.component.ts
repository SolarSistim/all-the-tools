import { Component, OnInit, OnDestroy, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Article, ArticlePreview } from '../../models/blog.models';
import { BlogService } from '../../services/blog.service';
import { MetaService } from '../../../../core/services/meta.service';
import { StructuredDataService } from '../../../../core/services/structured-data.service';
import { HeroImageComponent } from '../hero-image/hero-image.component';
import { ArticleContentComponent } from '../article-content/article-content.component';
import { AuthorSignatureComponent } from '../author-signature/author-signature.component';
import { SocialShareButtonsComponent } from '../social-share-buttons/social-share-buttons.component';
import { ReadingTimePipe } from '../../pipes/reading-time.pipe';
import { CtaEmailList } from '../../../reusable-components/cta-email-list/cta-email-list';

/**
 * Blog Article Component
 * Parent component that displays a complete blog article
 */
@Component({
  selector: 'app-blog-article',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    HeroImageComponent,
    ArticleContentComponent,
    AuthorSignatureComponent,
    SocialShareButtonsComponent,
    ReadingTimePipe,
    CtaEmailList,
  ],
  templateUrl: './blog-article.component.html',
  styleUrls: ['./blog-article.component.scss'],
})
export class BlogArticleComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private blogService = inject(BlogService);
  private metaService = inject(MetaService);
  private structuredDataService = inject(StructuredDataService);
  private destroyRef = inject(DestroyRef);

  article: Article | null = null;
  relatedArticles: ArticlePreview[] = [];
  readingTime: number = 0;
  articleUrl: string = '';
  loading = true;
  fontSize: 'small' | 'medium' | 'large' = 'small';

  private readonly FONT_SIZE_STORAGE_KEY = 'blog-article-font-size';

  ngOnInit(): void {
    // Load saved font size preference from localStorage
    this.loadFontSizePreference();

    // Get article from resolver data
    const article = this.route.snapshot.data['article'] as Article | null;

    if (article) {
      this.article = article;
      this.readingTime = this.blogService.calculateReadingTime(article);
      this.articleUrl = this.blogService.getArticleUrl(article.slug);
      this.updateMetaTags();
      this.updateStructuredData();
      this.loadRelatedArticles();
      this.loading = false;
    } else {
      this.router.navigate(['/blog']);
    }

    // Watch for route changes (if navigating between articles)
    this.route.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      const newArticle = data['article'] as Article | null;
      if (newArticle && newArticle.id !== this.article?.id) {
        this.article = newArticle;
        this.readingTime = this.blogService.calculateReadingTime(newArticle);
        this.articleUrl = this.blogService.getArticleUrl(newArticle.slug);
        this.updateMetaTags();
        this.updateStructuredData();
        this.loadRelatedArticles();
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.structuredDataService.removeStructuredData();
  }


  private loadRelatedArticles(): void {
    if (!this.article) return;

    this.blogService.getRelatedArticles(this.article, 3).subscribe({
      next: (articles) => {
        this.relatedArticles = articles;
      },
    });
  }

  private updateMetaTags(): void {
    if (!this.article) return;

    const config = {
      title: `${this.article.title} | All The Things Blog`,
      description: this.article.metaDescription || this.article.description,
      keywords: this.article.metaKeywords || this.article.tags,
      image:
        this.article.ogImage ||
        this.article.heroImage.src ||
        this.blogService.getConfig().defaultOgImage,
      url: this.articleUrl,
      type: 'article',
    };

    this.metaService.updateTags(config);
  }

  private updateStructuredData(): void {
    if (!this.article) return;

    this.structuredDataService.addArticle({
      headline: this.article.title,
      description: this.article.metaDescription || this.article.description,
      image:
        this.article.ogImage ||
        this.article.heroImage.src ||
        this.blogService.getConfig().defaultOgImage,
      url: this.articleUrl,
      author: {
        name: this.article.author.name,
        url: this.article.author.socialLinks?.website,
      },
      datePublished: new Date(this.article.publishedDate).toISOString(),
      dateModified: this.article.updatedDate
        ? new Date(this.article.updatedDate).toISOString()
        : new Date(this.article.publishedDate).toISOString(),
      keywords: this.article.tags,
    });

    // Add breadcrumbs
    this.structuredDataService.addBreadcrumbs([
      { name: 'Home', url: 'https://www.allthethings.dev' },
      { name: 'Blog', url: 'https://www.allthethings.dev/blog' },
      { name: this.article.title, url: this.articleUrl },
    ]);
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  setFontSize(size: 'small' | 'medium' | 'large'): void {
    this.fontSize = size;
    this.saveFontSizePreference(size);
  }

  private loadFontSizePreference(): void {
    try {
      const savedSize = localStorage.getItem(this.FONT_SIZE_STORAGE_KEY);
      if (savedSize && (savedSize === 'small' || savedSize === 'medium' || savedSize === 'large')) {
        this.fontSize = savedSize;
      }
    } catch (error) {
      // LocalStorage might not be available (e.g., in SSR or private browsing mode)
      console.warn('Unable to load font size preference from localStorage:', error);
    }
  }

  private saveFontSizePreference(size: 'small' | 'medium' | 'large'): void {
    try {
      localStorage.setItem(this.FONT_SIZE_STORAGE_KEY, size);
    } catch (error) {
      // LocalStorage might not be available (e.g., in SSR or private browsing mode)
      console.warn('Unable to save font size preference to localStorage:', error);
    }
  }
}
