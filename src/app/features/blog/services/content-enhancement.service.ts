import { Injectable } from '@angular/core';
import { Article, ContentBlock } from '../models/blog.models';

/**
 * ContentEnhancementService
 * Automatically enhances article content by adding cross-link blocks
 * Inserts related tools, resources, and other cross-link blocks at the end of articles
 */
@Injectable({
  providedIn: 'root'
})
export class ContentEnhancementService {
  /**
   * Automatically enhance article content with cross-link blocks
   * Adds related-tools and related-resources blocks if not already present
   */
  enhanceArticleContent(article: Article): Article {
    const enhancedContent = [...article.content];

    // Check if article already has related-tools block
    const hasToolsBlock = enhancedContent.some(
      block => block.type === 'related-tools'
    );

    // If no tools block and article has tags, add auto-generated related-tools
    if (!hasToolsBlock && article.tags && article.tags.length > 0) {
      enhancedContent.push({
        type: 'related-tools',
        data: {
          auto: true,
          limit: 3,
          title: 'Tools You Might Find Useful'
        }
      } as ContentBlock);
    }

    // Check if article already has related-resources block
    const hasResourcesBlock = enhancedContent.some(
      block => block.type === 'related-resources'
    );

    // If no resources block and article has tags, add auto-generated related-resources
    if (!hasResourcesBlock && article.tags && article.tags.length > 0) {
      enhancedContent.push({
        type: 'related-resources',
        data: {
          auto: true,
          limit: 3,
          title: 'External Resources'
        }
      } as ContentBlock);
    }

    return {
      ...article,
      content: enhancedContent
    };
  }

  /**
   * Check if article content already has a specific block type
   */
  hasBlockType(article: Article, blockType: string): boolean {
    return article.content.some(block => block.type === blockType);
  }

  /**
   * Insert a content block at a specific position
   */
  insertBlockAt(article: Article, block: ContentBlock, position: number): Article {
    const content = [...article.content];
    content.splice(position, 0, block);

    return {
      ...article,
      content
    };
  }

  /**
   * Remove all blocks of a specific type
   */
  removeBlockType(article: Article, blockType: string): Article {
    return {
      ...article,
      content: article.content.filter(block => block.type !== blockType)
    };
  }
}
