import { Component, input, computed, output, inject, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionKey } from '../file-browser/file-browser';

@Component({
  selector: 'app-compose-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="preview-header">
      <span class="preview-label">Preview</span>
    </div>

    <div class="preview-scroll" (mouseup)="onMouseUp($event)">
      @if (!parsed()) {
        <div class="preview-empty">
          @if (content()) {
            <span class="parse-error">⚠ Invalid JSON</span>
          } @else {
            <span>No file open</span>
          }
        </div>
      } @else if (section() === 'blog' && parsed()?.content) {
        <!-- ── Blog article ── -->
        <div class="article-wrap">

          <!-- Hero image -->
          @if (parsed()?.heroImage?.src) {
            <img class="hero-img" [src]="parsed().heroImage.src" [alt]="parsed().heroImage.alt || ''" />
          } @else {
            <div class="hero-placeholder">
              {{ parsed()?.heroImage?.alt || 'Hero Image' }}
            </div>
          }

          <!-- Meta -->
          <div class="article-meta">
            @if (parsed()?.category) {
              <span class="category-badge">{{ parsed().category }}</span>
            }
            <h1 class="article-title">{{ parsed()?.title }}</h1>
            @if (parsed()?.description) {
              <p class="article-desc">{{ parsed().description }}</p>
            }
            <div class="article-byline">
              <span>{{ parsed()?.author?.name }}</span>
              @if (parsed()?.publishedDate) {
                <span class="byline-sep">·</span>
                <span>{{ parsed().publishedDate }}</span>
              }
              @if (parsed()?.readTime || parsed()?.readingTime) {
                <span class="byline-sep">·</span>
                <span>{{ parsed()?.readTime || parsed()?.readingTime }} min read</span>
              }
            </div>
          </div>

          <div class="content-blocks">
            @for (block of parsed()?.content; track $index) {
              <div class="block">
                @switch (block?.type) {

                  @case ('paragraph') {
                    <p class="block-para"
                       contenteditable="true"
                       (input)="onBlockTextInput($index, $event)"
                       (keydown.enter)="$event.preventDefault()"
                       [innerHTML]="block.data?.text"
                    ></p>
                  }

                  @case ('heading') {
                    @if (block.data?.level === 2) {
                      <h2 class="block-h" contenteditable="true"
                          (input)="onBlockTextInput($index, $event)"
                          (keydown.enter)="$event.preventDefault()">{{ block.data.text }}</h2>
                    }
                    @else if (block.data?.level === 3) {
                      <h3 class="block-h" contenteditable="true"
                          (input)="onBlockTextInput($index, $event)"
                          (keydown.enter)="$event.preventDefault()">{{ block.data.text }}</h3>
                    }
                    @else if (block.data?.level === 4) {
                      <h4 class="block-h" contenteditable="true"
                          (input)="onBlockTextInput($index, $event)"
                          (keydown.enter)="$event.preventDefault()">{{ block.data.text }}</h4>
                    }
                    @else {
                      <h5 class="block-h" contenteditable="true"
                          (input)="onBlockTextInput($index, $event)"
                          (keydown.enter)="$event.preventDefault()">{{ block.data?.text }}</h5>
                    }
                  }

                  @case ('blockquote') {
                    <blockquote class="block-quote">
                      <p contenteditable="true"
                         (input)="onBlockTextInput($index, $event)"
                         (keydown.enter)="$event.preventDefault()"
                         [innerHTML]="block.data?.text"></p>
                      @if (block.data?.citation) {
                        <cite>
                          @if (block.data?.citationUrl) {
                            <a [href]="block.data.citationUrl" target="_blank">— {{ block.data.citation }}</a>
                          } @else {
                            — {{ block.data.citation }}
                          }
                        </cite>
                      }
                    </blockquote>
                  }

                  @case ('list') {
                    @if (block.data?.style === 'ordered') {
                      <ol class="block-list">
                        @for (item of block.data?.items; track $index) {
                          <li [innerHTML]="item"></li>
                        }
                      </ol>
                    } @else {
                      <ul class="block-list">
                        @for (item of block.data?.items; track $index) {
                          <li [innerHTML]="item"></li>
                        }
                      </ul>
                    }
                  }

                  @case ('code') {
                    <div class="block-code">
                      <div class="code-header">
                        @if (block.data?.language) {
                          <span class="code-lang">{{ block.data.language }}</span>
                        }
                        @if (block.data?.filename) {
                          <span class="code-filename">{{ block.data.filename }}</span>
                        }
                        <span class="code-copy-btn">⧉ Copy</span>
                      </div>
                      <pre><code>{{ block.data?.code }}</code></pre>
                    </div>
                  }

                  @case ('image') {
                    <figure class="block-figure">
                      @if (block.data?.src) {
                        <img [src]="block.data.src" [alt]="block.data?.alt || ''" />
                      } @else {
                        <div class="img-placeholder">📷 {{ block.data?.alt || 'Image' }}</div>
                      }
                      @if (block.data?.caption) {
                        <figcaption>{{ block.data.caption }}</figcaption>
                      }
                      @if (block.data?.credit) {
                        <figcaption class="img-credit">
                          Photo by
                          @if (block.data?.creditUrl) {
                            <a [href]="block.data.creditUrl" target="_blank">{{ block.data.credit }}</a>
                          } @else {
                            {{ block.data.credit }}
                          }
                        </figcaption>
                      }
                    </figure>
                  }

                  @case ('gallery') {
                    <div class="block-gallery" [ngClass]="'gallery-cols-' + galleryColumns(block.data?.images)">
                      @for (img of block.data?.images; track $index) {
                        <div class="gallery-thumb">
                          @if (img?.src) {
                            <img [src]="img.src" [alt]="img?.alt || ''" loading="lazy" />
                            <div class="gallery-overlay">⊕</div>
                          } @else {
                            <div class="gallery-thumb-ph">📷</div>
                          }
                          @if (img?.caption) {
                            <div class="gallery-caption">{{ img.caption }}</div>
                          }
                        </div>
                      }
                      @if (!block.data?.images?.length) {
                        <div class="block-placeholder">⊞ Gallery — no images yet</div>
                      }
                    </div>
                  }

                  @case ('divider') {
                    <hr class="block-hr" />
                  }

                  @case ('cta') {
                    <div class="block-cta" [ngClass]="'cta-' + (block.data?.variant || 'primary')">
                      <strong>{{ block.data?.title }}</strong>
                      <p>{{ block.data?.description }}</p>
                      <a class="cta-link">{{ block.data?.buttonText }}</a>
                    </div>
                  }

                  @case ('affiliate') {
                    <div class="block-affiliate-card">
                      <div class="aff-badge">★ Affiliate Link</div>
                      @if (block.data?.image) {
                        <div class="aff-img-wrap">
                          <img [src]="block.data.image" [alt]="block.data?.imageAlt || block.data?.name || ''" loading="lazy" />
                        </div>
                      } @else {
                        <div class="aff-img-ph">📦 No product image</div>
                      }
                      <div class="aff-body">
                        <div class="aff-name">{{ block.data?.name }}</div>
                        @if (block.data?.rating) {
                          <div class="aff-stars-row">
                            @for (n of [1,2,3,4,5]; track n) {
                              <span [class]="n <= block.data.rating ? 'star-filled' : 'star-empty'">★</span>
                            }
                            @if (block.data?.reviewCount) {
                              <span class="aff-reviews">({{ block.data.reviewCount }} reviews)</span>
                            }
                          </div>
                        }
                        <p class="aff-desc">{{ block.data?.description }}</p>
                        @if (block.data?.features?.length) {
                          <ul class="aff-features">
                            @for (f of block.data.features; track $index) {
                              <li><span class="aff-check">✓</span> {{ f }}</li>
                            }
                          </ul>
                        }
                        <div class="aff-footer">
                          @if (block.data?.price) {
                            <span class="aff-price">{{ block.data.price }}</span>
                          }
                          <span class="aff-btn">{{ block.data?.buttonText || 'Check Price on Amazon' }} ↗</span>
                        </div>
                        <div class="aff-disclosure">ⓘ As an Amazon Associate I earn from qualifying purchases.</div>
                      </div>
                    </div>
                  }

                  @case ('video') {
                    <div class="block-video">
                      @if (block.data?.title) {
                        <div class="video-title">{{ block.data.title }}</div>
                      }
                      @if (block.data?.description) {
                        <p class="video-desc">{{ block.data.description }}</p>
                      }
                      <div class="video-frame-ph">
                        <div class="video-play-btn">▶</div>
                        <div class="video-url-label">{{ block.data?.url || 'Video URL not set' }}</div>
                      </div>
                    </div>
                  }

                  @case ('audio') {
                    <div class="block-audio">
                      <div class="audio-play-btn">▶</div>
                      <div class="audio-info">
                        @if (block.data?.title) {
                          <div class="audio-title">{{ block.data.title }}</div>
                        }
                        @if (block.data?.description) {
                          <div class="audio-sub">{{ block.data.description }}</div>
                        } @else if (block.data?.src || block.data?.embedUrl) {
                          <div class="audio-sub">{{ block.data.src || block.data.embedUrl }}</div>
                        }
                        <div class="audio-bar"><div class="audio-progress"></div></div>
                      </div>
                    </div>
                  }

                  @case ('adsense') {
                    <div class="block-adsense">
                      <span class="adsense-label">Advertisement</span>
                      <div class="adsense-inner">Ad Unit · {{ block.data?.adSlot || 'slot not set' }}</div>
                    </div>
                  }

                  @case ('moviePoster') {
                    <div class="block-movie-poster">
                      @if (block.data?.src) {
                        <img [src]="block.data.src" [alt]="block.data?.alt || 'Movie Poster'" />
                      } @else {
                        <div class="movie-poster-ph">
                          <div class="poster-icon">🎬</div>
                          <div>{{ block.data?.alt || 'Movie Poster' }}</div>
                        </div>
                      }
                      @if (block.data?.caption) {
                        <div class="poster-caption">{{ block.data.caption }}</div>
                      }
                    </div>
                  }

                  @case ('movieRatings') {
                    <div class="block-movie-ratings">
                      <div class="mr-top">
                        <div class="mr-poster-wrap">
                          @if (block.data?.posterSrc) {
                            <img [src]="block.data.posterSrc" [alt]="block.data?.posterAlt || ''" />
                          } @else {
                            <div class="mr-poster-ph">🎬</div>
                          }
                        </div>
                        <div class="mr-info">
                          <div class="mr-title">{{ block.data?.title }} <span class="mr-year">({{ block.data?.year }})</span></div>
                          @if (block.data?.ratingsDate) {
                            <div class="mr-date">Ratings as of {{ block.data.ratingsDate }}</div>
                          }
                          @if (block.data?.ratings?.length) {
                            <div class="mr-ratings">
                              @for (r of block.data.ratings; track $index) {
                                <div class="mr-row">
                                  <span class="mr-source">{{ r.source }}</span>
                                  <div class="mr-bar-wrap">
                                    <div class="mr-bar" [style.width]="getRatingPct(r) + '%'"></div>
                                  </div>
                                  <span class="mr-score">{{ r.score ?? r.value ?? r.rating ?? '' }}</span>
                                </div>
                              }
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  }

                  @case ('businessRatings') {
                    <div class="block-biz-ratings">
                      @if (block.data?.ratings?.length) {
                        @for (r of block.data.ratings; track $index) {
                          <div class="biz-row">
                            <span class="biz-source">{{ r.source }}</span>
                            <div class="biz-stars">
                              @for (n of [1,2,3,4,5]; track n) {
                                <span [class]="n <= r.rating ? 'star-filled' : 'star-empty'">★</span>
                              }
                            </div>
                            <span class="biz-score">{{ r.rating?.toFixed(1) }}</span>
                            @if (r.reviewCount) {
                              <span class="biz-reviews">({{ r.reviewCount }})</span>
                            }
                          </div>
                        }
                      } @else {
                        <div class="block-placeholder">⭐ Business Ratings — no data yet</div>
                      }
                    </div>
                  }

                  @case ('see-also') {
                    <div class="block-see-also">
                      <div class="sa-header">
                        <span class="sa-icon">🔗</span>
                        <span class="sa-title">{{ block.data?.title || 'See Also' }}</span>
                      </div>
                      <ul class="sa-list">
                        @for (item of block.data?.items; track $index) {
                          <li class="sa-item">
                            <span class="sa-arrow">→</span>
                            <span>{{ item?.title || item?.id || '...' }}</span>
                          </li>
                        }
                        @if (!block.data?.items?.length) {
                          <li class="sa-item sa-empty">No items added yet</li>
                        }
                      </ul>
                    </div>
                  }

                  @case ('related-tools') {
                    <div class="block-related">
                      <div class="rel-header">
                        <span class="rel-icon">🔧</span>
                        <span class="rel-title">{{ block.data?.title || 'Related Tools' }}</span>
                      </div>
                      @if (block.data?.toolIds?.length) {
                        <div class="rel-chips">
                          @for (id of block.data.toolIds; track $index) {
                            <span class="rel-chip">{{ id }}</span>
                          }
                        </div>
                      } @else {
                        <div class="rel-auto">Auto · limit {{ block.data?.limit || 3 }}</div>
                      }
                    </div>
                  }

                  @case ('related-resources') {
                    <div class="block-related">
                      <div class="rel-header">
                        <span class="rel-icon">📚</span>
                        <span class="rel-title">{{ block.data?.title || 'Related Resources' }}</span>
                      </div>
                      @if (block.data?.resourceIds?.length) {
                        <div class="rel-chips">
                          @for (id of block.data.resourceIds; track $index) {
                            <span class="rel-chip">{{ id }}</span>
                          }
                        </div>
                      } @else {
                        <div class="rel-auto">Auto · limit {{ block.data?.limit || 3 }}</div>
                      }
                    </div>
                  }

                  @case ('tool-showcase') {
                    <div class="block-tool-showcase">
                      <div class="ts-icon">🛠</div>
                      <div class="ts-body">
                        <div class="ts-label">Tool Showcase</div>
                        <div class="ts-tool-id">{{ block.data?.toolId }}</div>
                        @if (block.data?.customDescription) {
                          <p class="ts-desc">{{ block.data.customDescription }}</p>
                        }
                      </div>
                    </div>
                  }

                  @case ('component') {
                    @switch (block.data?.componentName) {
                      @case ('youtube-player') {
                        <div class="block-video">
                          @if (block.data?.title) {
                            <div class="video-title">{{ block.data.title }}</div>
                          }
                          @if (block.data?.description) {
                            <p class="video-desc">{{ block.data.description }}</p>
                          }
                          <div class="video-frame-ph yt-frame">
                            <div class="yt-logo">▶ YouTube</div>
                            <div class="video-play-btn">▶</div>
                            <div class="video-url-label">videoId: {{ block.data?.videoId }}</div>
                          </div>
                        </div>
                      }
                      @case ('email-cta') {
                        <div class="block-component-banner email-cta-banner">
                          <span>📧</span>
                          <div>
                            <strong>Email Signup CTA</strong>
                            <div class="comp-sub">Subscribe to newsletter</div>
                          </div>
                        </div>
                      }
                      @case ('social-media-links') {
                        <div class="block-component-banner social-banner">
                          <span>🔗</span>
                          <div>
                            <strong>Social Media Links</strong>
                            <div class="comp-sub">Follow on social media</div>
                          </div>
                        </div>
                      }
                      @case ('alert-primary') {
                        <div class="block-alert alert-info">
                          <span class="alert-icon">ℹ</span>
                          <div><strong>{{ block.data?.title || 'Information' }}</strong>
                            @if (block.data?.content || block.data?.message) {
                              <div class="alert-msg">{{ block.data?.content || block.data?.message }}</div>
                            }
                          </div>
                        </div>
                      }
                      @case ('alert-success') {
                        <div class="block-alert alert-success">
                          <span class="alert-icon">✓</span>
                          <div><strong>{{ block.data?.title || 'Success' }}</strong>
                            @if (block.data?.content || block.data?.message) {
                              <div class="alert-msg">{{ block.data?.content || block.data?.message }}</div>
                            }
                          </div>
                        </div>
                      }
                      @case ('alert-warning') {
                        <div class="block-alert alert-warning">
                          <span class="alert-icon">⚠</span>
                          <div><strong>{{ block.data?.title || 'Warning' }}</strong>
                            @if (block.data?.content || block.data?.message) {
                              <div class="alert-msg">{{ block.data?.content || block.data?.message }}</div>
                            }
                          </div>
                        </div>
                      }
                      @case ('alert-danger') {
                        <div class="block-alert alert-danger">
                          <span class="alert-icon">✕</span>
                          <div><strong>{{ block.data?.title || 'Error' }}</strong>
                            @if (block.data?.content || block.data?.message) {
                              <div class="alert-msg">{{ block.data?.content || block.data?.message }}</div>
                            }
                          </div>
                        </div>
                      }
                      @case ('related-blog-posts') {
                        <div class="block-related">
                          <div class="rel-header">
                            <span class="rel-icon">📰</span>
                            <span class="rel-title">Related Blog Posts</span>
                          </div>
                          <div class="rel-auto">{{ block.data?.posts?.length || 0 }} posts specified</div>
                        </div>
                      }
                      @default {
                        <div class="block-placeholder">⚙ Component: {{ block.data?.componentName }}</div>
                      }
                    }
                  }

                  @default {
                    <div class="block-placeholder unknown">Unknown block type: {{ block?.type }}</div>
                  }
                }
              </div>
            }
          </div>
        </div>

      } @else {
        <!-- ── Resource / Artist or blog without content ── -->
        <div class="meta-card">
          @for (field of metaFields(); track field.key) {
            <div class="meta-row">
              <span class="meta-key">{{ field.key }}</span>
              <span class="meta-val"
                    [class.meta-val-editable]="field.editable"
                    [attr.contenteditable]="field.editable ? 'true' : null"
                    (input)="field.editable && onMetaFieldInput(field.key, $event)"
                    (keydown.enter)="$event.preventDefault()"
                    [innerHTML]="field.value"></span>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: #fff;
      color: #222;
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 15px;
      overflow: hidden;
      border-left: 1px solid #ddd;
    }

    .preview-header {
      display: flex;
      align-items: center;
      padding: 0 12px;
      height: 36px;
      background: #f5f5f5;
      border-bottom: 1px solid #ddd;
      flex-shrink: 0;
    }

    .preview-label {
      font-family: 'Consolas', monospace;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #888;
    }

    .preview-scroll {
      flex: 1;
      overflow-y: auto;
    }

    .preview-empty {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #aaa;
      font-family: 'Consolas', monospace;
      font-size: 13px;
    }

    .parse-error { color: #e00; }

    /* ── Article layout ── */
    .article-wrap {
      max-width: 680px;
      margin: 0 auto;
      padding: 24px 20px 60px;
    }

    .hero-img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 6px;
      margin-bottom: 20px;
    }

    .hero-placeholder {
      width: 100%;
      height: 160px;
      background: #eee;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #aaa;
      font-family: sans-serif;
      font-size: 13px;
      margin-bottom: 20px;
    }

    .article-meta { margin-bottom: 28px; }

    .category-badge {
      display: inline-block;
      background: #0066cc;
      color: #fff;
      font-family: sans-serif;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 2px 8px;
      border-radius: 3px;
      margin-bottom: 10px;
    }

    .article-title {
      font-size: 26px;
      font-weight: 700;
      line-height: 1.25;
      margin: 0 0 10px;
      color: #111;
    }

    .article-desc {
      font-size: 16px;
      color: #555;
      line-height: 1.5;
      margin: 0 0 12px;
      font-family: sans-serif;
    }

    .article-byline {
      font-family: sans-serif;
      font-size: 13px;
      color: #888;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .byline-sep { color: #ccc; }

    /* ── Content blocks ── */
    .block { margin-bottom: 18px; }

    .block-para {
      margin: 0;
      line-height: 1.7;
      color: #333;
    }

    .block-h {
      font-weight: 700;
      color: #111;
      margin: 0;
      line-height: 1.3;
    }

    h2.block-h { font-size: 22px; }
    h3.block-h { font-size: 19px; }
    h4.block-h { font-size: 16px; }
    h5.block-h { font-size: 14px; }

    /* Blockquote */
    .block-quote {
      border-left: 4px solid #0066cc;
      margin: 0;
      padding: 8px 16px;
      background: #f8f8f8;
      border-radius: 0 4px 4px 0;
    }
    .block-quote p { margin: 0 0 6px; color: #444; font-style: italic; }
    .block-quote cite { font-size: 13px; color: #888; font-style: normal; font-family: sans-serif; }
    .block-quote cite a { color: #0066cc; text-decoration: none; }

    /* List */
    .block-list {
      padding-left: 24px;
      line-height: 1.7;
      color: #333;
    }
    .block-list li { margin-bottom: 4px; }

    /* Code */
    .block-code {
      background: #1e1e1e;
      border-radius: 6px;
      overflow: hidden;
    }
    .code-header {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #2d2d2d;
      padding: 5px 12px;
    }
    .code-lang {
      background: #00bcd4;
      color: #fff;
      font-family: 'Consolas', monospace;
      font-size: 10px;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 3px;
      text-transform: uppercase;
    }
    .code-filename {
      color: #aaa;
      font-family: 'Consolas', monospace;
      font-size: 11px;
      flex: 1;
    }
    .code-copy-btn {
      color: #666;
      font-family: 'Consolas', monospace;
      font-size: 11px;
      cursor: pointer;
      margin-left: auto;
    }
    .block-code pre {
      margin: 0;
      padding: 14px;
      overflow-x: auto;
    }
    .block-code code {
      color: #d4d4d4;
      font-family: 'Consolas', monospace;
      font-size: 12px;
      line-height: 1.6;
    }

    /* Image */
    .block-figure { margin: 0; }
    .block-figure img { width: 100%; border-radius: 4px; }
    .block-figure figcaption {
      font-size: 12px;
      color: #888;
      text-align: center;
      margin-top: 6px;
      font-family: sans-serif;
    }
    .img-credit { font-style: italic; }
    .img-credit a { color: #0066cc; text-decoration: none; }
    .img-placeholder {
      background: #eee;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      color: #aaa;
      font-family: sans-serif;
      font-size: 13px;
    }

    /* Gallery */
    .block-gallery {
      display: grid;
      gap: 6px;
    }
    .gallery-cols-1 { grid-template-columns: 1fr; }
    .gallery-cols-2 { grid-template-columns: 1fr 1fr; }
    .gallery-cols-3 { grid-template-columns: 1fr 1fr 1fr; }

    .gallery-thumb {
      position: relative;
      overflow: hidden;
      border-radius: 4px;
      aspect-ratio: 4/3;
      background: #eee;
      cursor: zoom-in;
    }
    .gallery-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .gallery-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 20px;
      opacity: 0;
      transition: opacity 0.15s;
    }
    .gallery-thumb:hover .gallery-overlay { opacity: 1; }
    .gallery-thumb-ph {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: #bbb;
    }
    .gallery-caption {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0,0,0,0.55);
      color: #fff;
      font-size: 11px;
      font-family: sans-serif;
      padding: 3px 6px;
    }

    /* Divider */
    .block-hr {
      border: none;
      border-top: 1px solid #ddd;
      margin: 8px 0;
    }

    /* CTA */
    .block-cta {
      background: #f0f7ff;
      border: 1px solid #b3d4f5;
      border-radius: 8px;
      padding: 16px 20px;
    }
    .block-cta strong { font-size: 16px; color: #111; font-family: sans-serif; }
    .block-cta p { color: #555; margin: 6px 0 10px; font-family: sans-serif; font-size: 14px; }
    .cta-link {
      display: inline-block;
      background: #0066cc;
      color: #fff;
      padding: 6px 16px;
      border-radius: 4px;
      font-family: sans-serif;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
    }

    /* Affiliate */
    .block-affiliate-card {
      position: relative;
      border: 2px solid #e91e8c;
      border-radius: 12px;
      padding: 20px 18px 16px;
      background: #fafafa;
      margin-top: 10px;
    }
    .aff-badge {
      position: absolute;
      top: -11px;
      right: 14px;
      background: linear-gradient(135deg, #e91e8c, #ff4db8);
      color: #fff;
      font-family: sans-serif;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 10px;
      border-radius: 20px;
    }
    .aff-img-wrap {
      width: 100%;
      max-width: 260px;
      margin: 0 auto 14px;
      background: #fff;
      border-radius: 6px;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .aff-img-wrap img { max-height: 200px; max-width: 100%; object-fit: contain; display: block; }
    .aff-img-ph {
      height: 80px;
      background: #eee;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #aaa;
      font-family: sans-serif;
      font-size: 13px;
      margin-bottom: 14px;
    }
    .aff-body { display: flex; flex-direction: column; gap: 8px; }
    .aff-name { font-size: 17px; font-weight: 700; color: #111; font-family: sans-serif; }
    .aff-stars-row { display: flex; align-items: center; gap: 2px; font-family: sans-serif; }
    .star-filled { color: #f59e0b; font-size: 16px; }
    .star-empty { color: #ddd; font-size: 16px; }
    .aff-reviews { font-size: 12px; color: #888; margin-left: 4px; }
    .aff-desc { margin: 0; color: #555; font-family: sans-serif; font-size: 13px; line-height: 1.5; }
    .aff-features {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .aff-features li { display: flex; align-items: flex-start; gap: 6px; font-family: sans-serif; font-size: 13px; color: #444; }
    .aff-check { color: #00bcd4; font-weight: 700; flex-shrink: 0; }
    .aff-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 10px;
      border-top: 1px solid #eee;
      flex-wrap: wrap;
      gap: 8px;
    }
    .aff-price { font-size: 20px; font-weight: 700; color: #e91e8c; font-family: sans-serif; }
    .aff-btn {
      background: #0066cc;
      color: #fff;
      padding: 6px 14px;
      border-radius: 4px;
      font-family: sans-serif;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }
    .aff-disclosure {
      font-family: sans-serif;
      font-size: 11px;
      color: #aaa;
      background: #f5f5f5;
      border-radius: 4px;
      padding: 6px 10px;
      line-height: 1.4;
    }

    /* Video */
    .block-video { font-family: sans-serif; }
    .video-title { font-weight: 700; font-size: 15px; color: #111; margin-bottom: 4px; }
    .video-desc { color: #666; font-size: 13px; margin: 0 0 8px; }
    .video-frame-ph {
      background: #111;
      border-radius: 6px;
      aspect-ratio: 16/9;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      position: relative;
    }
    .yt-logo {
      position: absolute;
      top: 8px;
      left: 10px;
      background: #ff0000;
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 3px;
    }
    .video-play-btn {
      width: 48px;
      height: 48px;
      background: rgba(255,255,255,0.15);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 18px;
    }
    .video-url-label { color: #666; font-size: 11px; font-family: 'Consolas', monospace; }

    /* Audio */
    .block-audio {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #1a1a2e;
      border-radius: 8px;
      padding: 12px 16px;
      font-family: sans-serif;
    }
    .audio-play-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #00bcd4;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      flex-shrink: 0;
      cursor: pointer;
    }
    .audio-info { flex: 1; min-width: 0; }
    .audio-title { color: #fff; font-size: 13px; font-weight: 600; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .audio-sub { color: #888; font-size: 11px; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: 'Consolas', monospace; }
    .audio-bar { height: 4px; background: #333; border-radius: 2px; }
    .audio-progress { width: 0%; height: 100%; background: #00bcd4; border-radius: 2px; }

    /* AdSense */
    .block-adsense {
      border: 1px dashed #f0c040;
      background: #fff8e8;
      border-radius: 4px;
      padding: 4px 10px 8px;
      text-align: center;
      font-family: sans-serif;
    }
    .adsense-label { font-size: 9px; color: #aaa; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 2px; }
    .adsense-inner { font-size: 12px; color: #a06000; }

    /* Movie Poster */
    .block-movie-poster {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      font-family: sans-serif;
    }
    .block-movie-poster img {
      max-width: 200px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    .movie-poster-ph {
      width: 160px;
      height: 240px;
      background: #222;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: #888;
      font-size: 12px;
    }
    .poster-icon { font-size: 32px; }
    .poster-caption { font-size: 12px; color: #888; text-align: center; }

    /* Movie Ratings */
    .block-movie-ratings {
      background: #f8f8f8;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 14px;
      font-family: sans-serif;
    }
    .mr-top { display: flex; gap: 14px; }
    .mr-poster-wrap { flex-shrink: 0; }
    .mr-poster-wrap img { width: 70px; border-radius: 4px; display: block; }
    .mr-poster-ph {
      width: 70px;
      height: 100px;
      background: #ddd;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }
    .mr-info { flex: 1; min-width: 0; }
    .mr-title { font-weight: 700; font-size: 14px; color: #111; margin-bottom: 2px; }
    .mr-year { font-weight: 400; color: #888; }
    .mr-date { font-size: 11px; color: #aaa; margin-bottom: 10px; }
    .mr-ratings { display: flex; flex-direction: column; gap: 6px; }
    .mr-row { display: flex; align-items: center; gap: 8px; }
    .mr-source { font-size: 11px; color: #666; width: 90px; flex-shrink: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .mr-bar-wrap { flex: 1; height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden; }
    .mr-bar { height: 100%; background: #e91e8c; border-radius: 4px; transition: width 0.3s; }
    .mr-score { font-size: 11px; color: #333; font-weight: 600; width: 36px; text-align: right; flex-shrink: 0; }

    /* Business Ratings */
    .block-biz-ratings {
      background: #f8f8f8;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-family: sans-serif;
    }
    .biz-row { display: flex; align-items: center; gap: 8px; }
    .biz-source { font-size: 12px; color: #555; font-weight: 600; width: 80px; flex-shrink: 0; }
    .biz-stars { display: flex; gap: 1px; }
    .biz-score { font-size: 13px; font-weight: 700; color: #333; }
    .biz-reviews { font-size: 11px; color: #888; }

    /* See Also */
    .block-see-also {
      background: #f8f8f8;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 12px 16px;
      font-family: sans-serif;
    }
    .sa-header {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 8px;
    }
    .sa-icon { font-size: 16px; }
    .sa-title { font-weight: 700; font-size: 14px; color: #111; }
    .sa-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
    .sa-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #0066cc; }
    .sa-arrow { color: #888; }
    .sa-empty { color: #aaa; font-style: italic; }

    /* Related Tools / Resources */
    .block-related {
      background: #f8f8f8;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 12px 16px;
      font-family: sans-serif;
    }
    .rel-header {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 8px;
    }
    .rel-icon { font-size: 16px; }
    .rel-title { font-weight: 700; font-size: 14px; color: #111; }
    .rel-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .rel-chip {
      background: #e8f0fe;
      color: #1a56db;
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 12px;
      border: 1px solid #b3c9f7;
    }
    .rel-auto { font-size: 12px; color: #888; font-style: italic; }

    /* Tool Showcase */
    .block-tool-showcase {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      border: 1px solid #00bcd4;
      border-radius: 8px;
      padding: 14px 16px;
      background: #f0feff;
      font-family: sans-serif;
    }
    .ts-icon { font-size: 28px; flex-shrink: 0; }
    .ts-label { font-size: 10px; color: #00bcd4; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px; }
    .ts-tool-id { font-weight: 700; font-size: 14px; color: #111; margin-bottom: 4px; }
    .ts-desc { margin: 0; font-size: 12px; color: #555; }

    /* Component banners */
    .block-component-banner {
      display: flex;
      align-items: center;
      gap: 10px;
      border-radius: 8px;
      padding: 12px 16px;
      font-family: sans-serif;
      font-size: 13px;
    }
    .block-component-banner span:first-child { font-size: 20px; }
    .email-cta-banner { background: #fff3e0; border: 1px solid #ffcc80; }
    .social-banner { background: #e8f5e9; border: 1px solid #a5d6a7; }
    .comp-sub { font-size: 11px; color: #888; margin-top: 2px; }

    /* Alerts */
    .block-alert {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      border-radius: 6px;
      padding: 10px 14px;
      font-family: sans-serif;
      font-size: 13px;
    }
    .alert-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
    .alert-msg { color: #555; font-size: 12px; margin-top: 2px; }
    .alert-info { background: #e3f2fd; border: 1px solid #90caf9; color: #1565c0; }
    .alert-success { background: #e8f5e9; border: 1px solid #a5d6a7; color: #2e7d32; }
    .alert-warning { background: #fff8e1; border: 1px solid #ffe082; color: #f57f17; }
    .alert-danger { background: #ffebee; border: 1px solid #ef9a9a; color: #c62828; }

    /* Placeholders for anything unhandled */
    .block-placeholder {
      background: #f5f5f5;
      border: 1px dashed #ccc;
      border-radius: 4px;
      padding: 8px 14px;
      color: #888;
      font-family: 'Consolas', monospace;
      font-size: 12px;
    }
    .unknown { background: #fff0f0; border-color: #f0a0a0; color: #c00; }

    /* ── Resource / Artist meta card ── */
    .meta-card {
      padding: 20px;
      font-family: sans-serif;
      font-size: 13px;
    }

    .meta-row {
      display: flex;
      gap: 10px;
      padding: 6px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .meta-key {
      width: 140px;
      flex-shrink: 0;
      color: #888;
      font-weight: 600;
      font-size: 12px;
    }

    .meta-val {
      flex: 1;
      color: #222;
      word-break: break-word;
    }

    /* ── Inline editing ── */
    [contenteditable] {
      outline: none;
      border-radius: 3px;
      cursor: text;
      transition: background 0.12s, box-shadow 0.12s;
    }

    [contenteditable]:hover {
      background: rgba(0, 102, 204, 0.05);
    }

    [contenteditable]:focus {
      background: rgba(0, 102, 204, 0.07);
      box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.22);
    }

    .meta-val-editable { cursor: text; }
  `],
})
export class ComposePreview {
  content = input<string>('');
  section = input<SectionKey>('blog');

  previewClick = output<{ text: string; offset: number }>();
  previewSelect = output<string>();
  contentChange = output<string>();

  private el = inject(ElementRef<HTMLElement>);

  parsed = computed<any>(() => {
    const raw = this.content();
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });

  /** Flat key-value rows for resources / artists */
  metaFields = computed<{ key: string; value: string; editable: boolean }[]>(() => {
    const obj = this.parsed();
    if (!obj || typeof obj !== 'object') return [];

    const SKIP = new Set(['content', 'metaKeywords', 'keywords', 'youtubeVideos']);
    return Object.entries(obj)
      .filter(([k]) => !SKIP.has(k))
      .map(([k, v]) => ({
        key: k,
        value: Array.isArray(v)
          ? (v as any[]).join(', ')
          : typeof v === 'object' && v !== null
          ? JSON.stringify(v)
          : String(v ?? ''),
        editable: typeof v === 'string',
      }));
  });

  /** Returns '1', '2', or '3' grid columns based on image count */
  galleryColumns(images: any[]): string {
    const len = images?.length ?? 0;
    if (len <= 1) return '1';
    if (len === 2) return '2';
    return '3';
  }

  /** Normalises a rating entry to a 0–100 percentage for the progress bar */
  getRatingPct(r: any): number {
    if (r == null) return 0;
    if (r.percentage != null) return Math.min(Number(r.percentage), 100);
    if (r.score != null) {
      const s = Number(r.score);
      // Already a percent-style number (e.g. 85)
      if (s > 10) return Math.min(s, 100);
      // 0–10 scale → convert
      return Math.min(s * 10, 100);
    }
    if (r.value != null) return Math.min(Number(r.value), 100);
    if (r.rating != null) return Math.min(Number(r.rating) * 20, 100);
    return 0;
  }

  /** Scroll the preview to the first occurrence of `text`. */
  scrollToText(text: string): void {
    if (!text) return;
    const container = (this.el.nativeElement as HTMLElement).querySelector('.preview-scroll');
    if (!container) return;
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    let node: Node | null;
    while ((node = walker.nextNode())) {
      if ((node.textContent ?? '').includes(text)) {
        (node as Text).parentElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        break;
      }
    }
  }

  /** Find `text` in the rendered preview DOM and select it with the browser selection. */
  selectPreviewText(text: string): void {
    if (!text) return;
    const container = (this.el.nativeElement as HTMLElement).querySelector('.preview-scroll');
    if (!container) return;
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    let node: Node | null;
    while ((node = walker.nextNode())) {
      const content = node.textContent ?? '';
      const idx = content.indexOf(text);
      if (idx !== -1) {
        const range = document.createRange();
        range.setStart(node, idx);
        range.setEnd(node, idx + text.length);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
        (node as Text).parentElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        break;
      }
    }
  }

  onBlockTextInput(blockIndex: number, event: Event): void {
    const el = event.target as HTMLElement;
    const newText = el.innerText;
    const obj = structuredClone(this.parsed());
    if (!obj?.content?.[blockIndex]?.data) return;
    obj.content[blockIndex].data.text = newText;
    this.contentChange.emit(JSON.stringify(obj, null, 2));
  }

  onMetaFieldInput(key: string, event: Event): void {
    const el = event.target as HTMLElement;
    const newValue = el.innerText;
    const obj = structuredClone(this.parsed());
    if (!obj || typeof obj[key] !== 'string') return;
    obj[key] = newValue;
    this.contentChange.emit(JSON.stringify(obj, null, 2));
  }

  onMouseUp(event: MouseEvent): void {
    // Don't sync clicks/selections inside editable elements back to Monaco
    if ((event.target as HTMLElement)?.isContentEditable) return;

    setTimeout(() => {
      const sel = window.getSelection();
      const selectedText = sel?.toString() ?? '';

      if (selectedText.trim()) {
        this.previewSelect.emit(selectedText);
        return;
      }

      let text = '';
      let offset = 0;

      const caretRange = (document as any).caretRangeFromPoint?.(event.clientX, event.clientY);
      const caretPos   = !caretRange ? (document as any).caretPositionFromPoint?.(event.clientX, event.clientY) : null;

      const node: Node | null = caretRange?.startContainer ?? caretPos?.offsetNode ?? null;
      const rawOffset: number = caretRange?.startOffset ?? caretPos?.offset ?? 0;

      if (node?.nodeType === Node.TEXT_NODE && node.parentElement) {
        const parent = node.parentElement;
        let acc = 0;
        for (const child of Array.from(parent.childNodes)) {
          if (child === node) { offset = acc + rawOffset; break; }
          acc += child.textContent?.length ?? 0;
        }
        text = parent.textContent?.trim() ?? '';
      }

      if (text) {
        this.previewClick.emit({ text, offset });
      }
    }, 0);
  }

  seealsoIds(items: any[]): string {
    if (!Array.isArray(items)) return '';
    return items.map((i) => i?.id ?? '?').join(', ');
  }
}
