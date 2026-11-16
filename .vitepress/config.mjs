import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'TextEdit+ SDK',
  description: 'Build extensions for the TextEdit+ mobile code editor.',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: [/^https?:\/\/localhost/],
  srcExclude: ['**/README.md'],

  // Base path matching repository name for GitHub Pages.
  base: '/TextEditPlusDocs/',

  head: [
    ['meta', { name: 'theme-color', content: '#4ea1ff' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1' }]
  ],

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/getting-started' },
      { text: 'API', link: '/api/themes' },
      { text: 'Skills', link: '/skills' },
      { text: 'Catalog', link: '/catalog-submission' },
      { text: 'App', link: 'https://play.google.com/store/apps/details?id=com.krk.texteditplus' }
    ],
    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Overview',         link: '/' },
          { text: 'Getting Started',  link: '/getting-started' },
          { text: 'Extension Anatomy',link: '/anatomy' },
          { text: 'Agent Skills (SKILL.md)', link: '/skills' }
        ]
      },
      {
        text: 'API Reference',
        items: [
          { text: 'Themes',           link: '/api/themes' },
          { text: 'Languages',        link: '/api/languages' },
          { text: 'Markers (Diagnostics)', link: '/api/markers' },
          { text: 'AI Extensions',    link: '/api/ai' },
          { text: 'Toast / Dialog',   link: '/api/dialog' },
          { text: 'Commands',         link: '/api/commands' },
          { text: 'Settings',         link: '/api/settings' },
          { text: 'Sidebar',          link: '/api/sidebar' },
          { text: 'File System',      link: '/api/fs' },
          { text: 'Lifecycle',        link: '/api/lifecycle' }
        ]
      },
      {
        text: 'Publishing',
        items: [
          { text: 'Submit to Catalog', link: '/catalog-submission' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/grrhn/TextEditPlusDocs' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 KRK'
    },
    search: { provider: 'local' }
  }
});
