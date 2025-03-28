import { GitChangelog, GitChangelogMarkdownSection } from '@nolebase/vitepress-plugin-git-changelog/vite'
import { PageProperties, PagePropertiesMarkdownSection } from '@nolebase/vitepress-plugin-page-properties/vite'
import { ThumbnailHashImages } from '@nolebase/vitepress-plugin-thumbnail-hash/vite'
import UnoCSS from 'unocss/vite'

import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
// import Inspect from 'vite-plugin-inspect'

import { creators, githubRepoLink } from './metadata'

export default defineConfig(async () => {
  return {
    assetsInclude: ['**/*.mov'],
    optimizeDeps: {
      // vitepress is aliased with replacement `join(DIST_CLIENT_PATH, '/index')`
      // This needs to be excluded from optimization
      exclude: [
        'vitepress',
        '@nolebase/vitepress-plugin-index',
      ],
    },
    plugins: [
      // Inspect(),
      GitChangelog({
        repoURL: () => githubRepoLink,
        mapAuthors: creators,
      }),
      GitChangelogMarkdownSection({
        excludes: [
          'zh-CN/toc.md',
          'zh-CN/index.md',
        ],
      }),
      PageProperties(),
      PagePropertiesMarkdownSection({
        excludes: [
          'zh-CN/toc.md',
          'zh-CN/index.md',
        ],
      }),
      ThumbnailHashImages(),
      Components({
        include: [/\.vue$/, /\.md$/],
        dirs: '.vitepress/theme/components',
        dts: '.vitepress/components.d.ts',
      }),
      UnoCSS(),
    ],
    ssr: {
      noExternal: [
        '@nolebase/vitepress-plugin-enhanced-readabilities',
        '@nolebase/vitepress-plugin-highlight-targeted-heading',
        '@nolebase/vitepress-plugin-inline-link-preview',
        '@nolebase/vitepress-plugin-index',
      ],
    },
  }
})
