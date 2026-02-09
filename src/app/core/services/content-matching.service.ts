import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tool } from '../models/tool.interface';
import { ArticlePreview } from '../../features/blog/models/blog.models';
import { ResourcePreview } from '../../features/resources/models/resource.models';
import { ToolsService } from './tools.service';
import { BlogService } from '../../features/blog/services/blog.service';
import { ResourcesService } from '../../features/resources/services/resources.service';

/**
 * ContentMatchingService
 * Provides algorithmic matching for cross-linking related content
 * Uses tag-based similarity scoring to find related tools, articles, and resources
 */
@Injectable({
  providedIn: 'root'
})
export class ContentMatchingService {
  constructor(
    private toolsService: ToolsService,
    private blogService: BlogService,
    private resourcesService: ResourcesService
  ) {}

  /**
   * Calculate Jaccard similarity coefficient between two tag sets
   * Returns a value between 0 (no similarity) and 1 (identical)
   */
  calculateTagSimilarity(tags1: string[], tags2: string[]): number {
    if (!tags1 || !tags2 || tags1.length === 0 || tags2.length === 0) {
      return 0;
    }

    // Normalize tags to lowercase for comparison
    const set1 = new Set(tags1.map(t => t.toLowerCase().trim()));
    const set2 = new Set(tags2.map(t => t.toLowerCase().trim()));

    // Calculate intersection (common tags)
    const intersection = [...set1].filter(t => set2.has(t));

    // Calculate union (all unique tags)
    const union = new Set([...set1, ...set2]);

    // Jaccard similarity = |intersection| / |union|
    return intersection.length / union.size;
  }

  /**
   * Find related tools based on tags and category
   * Returns tools sorted by relevance score
   */
  findRelatedTools(
    tags: string[],
    category?: string,
    limit: number = 3
  ): Tool[] {
    const allTools = this.toolsService.getAllTools();

    if (!tags || tags.length === 0) {
      // If no tags provided, return featured tools
      return allTools
        .filter(t => t.featured)
        .slice(0, limit);
    }

    // Score each tool based on relevance
    const scored = allTools.map(tool => ({
      tool,
      score: this.calculateToolRelevanceScore(tool, tags, category)
    }));

    // Sort by score (highest first) and return top matches
    return scored
      .filter(item => item.score > 0) // Only include tools with some relevance
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.tool);
  }

  /**
   * Find related articles based on tags and category
   * Returns articles sorted by relevance score
   */
  findRelatedArticles(
    tags: string[],
    category?: string,
    excludeId?: string,
    limit: number = 3
  ): Observable<ArticlePreview[]> {
    return this.blogService.getAllArticles().pipe(
      map(articles => {
        // Filter out the current article if excludeId is provided
        const filtered = articles.filter(a => a.id !== excludeId && a.display !== false);

        if (!tags || tags.length === 0) {
          // If no tags, return featured articles
          return filtered
            .filter(a => a.featured)
            .slice(0, limit);
        }

        // Score each article based on relevance
        const scored = filtered.map(article => ({
          article,
          score: this.calculateArticleRelevanceScore(article, tags, category)
        }));

        // Sort by score and return top matches
        return scored
          .filter(item => item.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, limit)
          .map(item => item.article);
      })
    );
  }

  /**
   * Find related resources based on tags
   * Returns resources sorted by relevance score
   */
  findRelatedResources(
    tags: string[],
    limit: number = 3
  ): Observable<ResourcePreview[]> {
    return this.resourcesService.getAllResources().pipe(
      map(resources => {
        // Filter out non-displayed resources
        const filtered = resources.filter(r => r.display !== false);

        if (!tags || tags.length === 0) {
          // If no tags, return featured resources
          return filtered
            .filter(r => r.featured)
            .slice(0, limit);
        }

        // Score each resource based on tag similarity
        const scored = filtered.map(resource => ({
          resource,
          score: this.calculateTagSimilarity(resource.tags, tags)
        }));

        // Sort by score and return top matches
        return scored
          .filter(item => item.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, limit)
          .map(item => item.resource);
      })
    );
  }

  /**
   * Get comprehensive related content for any item
   * Returns tools, articles, and resources all in one call
   */
  getRelatedContent(
    itemType: 'article' | 'tool' | 'resource',
    itemId: string,
    tags: string[],
    category?: string
  ): Observable<{
    tools: Tool[];
    articles: ArticlePreview[];
    resources: ResourcePreview[];
  }> {
    return forkJoin({
      tools: of(this.findRelatedTools(tags, category, 3)),
      articles: this.findRelatedArticles(tags, category, itemId, 3),
      resources: this.findRelatedResources(tags, 3)
    });
  }

  /**
   * Calculate relevance score for a tool
   * Combines tag similarity (70% weight) and category match (30% weight)
   */
  private calculateToolRelevanceScore(
    tool: Tool,
    targetTags: string[],
    targetCategory?: string
  ): number {
    let score = 0;

    // Tag similarity (70% weight)
    const tagScore = this.calculateTagSimilarity(
      tool.tags || [],
      targetTags
    );
    score += tagScore * 0.7;

    // Category match (30% weight)
    if (targetCategory && tool.category === targetCategory) {
      score += 0.3;
    }

    return score;
  }

  /**
   * Calculate relevance score for an article
   * Combines tag similarity (60% weight) and category match (40% weight)
   */
  private calculateArticleRelevanceScore(
    article: ArticlePreview,
    targetTags: string[],
    targetCategory?: string
  ): number {
    let score = 0;

    // Tag similarity (60% weight)
    const tagScore = this.calculateTagSimilarity(
      article.tags || [],
      targetTags
    );
    score += tagScore * 0.6;

    // Category match (40% weight)
    if (targetCategory && article.category === targetCategory) {
      score += 0.4;
    }

    return score;
  }
}
