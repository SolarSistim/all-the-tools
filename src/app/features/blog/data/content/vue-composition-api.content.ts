import { ContentBlock } from '../../models/blog.models';

export const content: ContentBlock[] = [
  {
    type: 'paragraph',
    data: {
      text: 'The Composition API provides better code organization and reusability.',
    },
  },
  {
    type: 'code',
    data: {
      language: 'javascript',
      code: `import { ref, computed } from 'vue';\n\nconst count = ref(0);\nconst doubled = computed(() => count.value * 2);`,
    },
  },
];
