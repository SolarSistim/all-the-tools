/**
 * Tool Interface
 * Defines the structure for each utility tool in the application
 */

export type ToolCategory = 'math' | 'converter' | 'text' | 'generator' | 'color' | 'time' | 'image' | 'hardware' | 'ocr' | 'music' | 'social' | 'scientific' | 'other';

export interface Tool {
  /** Unique identifier for the tool */
  id: string;

  /** Display name of the tool */
  name: string;

  /** Short description of what the tool does */
  description: string;

  /** Longer description for the tool detail page (optional) */
  longDescription?: string;

  /** Category classification */
  category: ToolCategory;

  /** Material icon name or custom icon identifier */
  icon: string;

  /** Route path (relative to /tools/) */
  route: string;

  /** Whether to feature this tool on the home page */
  featured: boolean;

  /** Tags for search and filtering */
  tags?: string[];

  /** Whether the tool is currently available/implemented */
  available?: boolean;

  /** Whether this tool has a tutorial available on the blog */
  hasTutorial?: boolean;

  /** Specific tutorial article ID (more precise than hasTutorial flag) */
  tutorialArticleId?: string;

  /** Related article IDs (tutorials, guides, etc.) */
  relatedArticles?: string[];

  /** Related tool IDs (similar or complementary tools) */
  relatedTools?: string[];

  /** Related resource IDs (external resources) */
  relatedResources?: string[];
}

/**
 * Tool category metadata for UI display
 */
export interface ToolCategoryMeta {
  id: ToolCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
}
