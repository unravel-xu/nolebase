import process from 'node:process'
import { BiDirectionalLinks } from '@nolebase/markdown-it-bi-directional-links'
import { UnlazyImages } from '@nolebase/markdown-it-unlazy-img'
import { InlineLinkPreviewElementTransform } from '@nolebase/vitepress-plugin-inline-link-preview/markdown-it'

import { transformHeadMeta } from '@nolebase/vitepress-plugin-meta'
import { calculateSidebar } from '@nolebase/vitepress-plugin-sidebar'
// import { calculateSidebar as originalCalculateSidebar } from "@nolebase/vitepress-plugin-sidebar"
// import { buildEndGenerateOpenGraphImages } from '@nolebase/vitepress-plugin-og-image/vitepress'
import MarkdownItFootnote from 'markdown-it-footnote'
import MarkdownItMathjax3 from 'markdown-it-mathjax3'
import { defineConfig } from 'vitepress'

import { discordLink, githubRepoLink, siteDescription, siteName } from '../metadata'
import head from './head'

// function calculateSidebarWithDefaultOpen(targets, base) { 
//   const result = originalCalculateSidebar(targets, base) 
//   if (Array.isArray(result)) { 
//     result.forEach(item => { 
//       item.collapsed = false
//     }) 
//   } else { 
//     Object.values(result).forEach(items => { 
//       items.forEach(item => { 
//         item.collapsed = false
//       }) 
//     }) 
//   } 
//   return result 
// } 

export default defineConfig({
  vue: {
    template: {
      transformAssetUrls: {
        video: ['src', 'poster'],
        source: ['src'],
        img: ['src'],
        image: ['xlink:href', 'href'],
        use: ['xlink:href', 'href'],
        NolebaseUnlazyImg: ['src'],
      },
    },
  },
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: '主页', link: '/zh-CN/' },
      { text: 'AI', link: '/zh-CN/AI/' },
      { text: '网站', link: '/zh-CN/Website/' },
      { text: '最近更新', link: '/zh-CN/toc' },
    ],
    socialLinks: [
      { icon: 'github', link: githubRepoLink },
      { icon: 'discord', link: discordLink },
    ],
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                },
              },
            },
          },
        },
        // Add title ang tags field in frontmatter to search
        // You can exclude a page from search by adding search: false to the page's frontmatter.
        _render(src, env, md) {
          // without `md.render(src, env)`, the some information will be missing from the env.
          let html = md.render(src, env)
          let tagsPart = ''
          let headingPart = ''
          let contentPart = ''
          let fullContent = ''
          const sortContent = () => [headingPart, tagsPart, contentPart] as const
          let { frontmatter, content } = env

          if (!frontmatter)
            return html

          if (frontmatter.search === false)
            return ''

          contentPart = content ||= src

          const headingMatch = content.match(/^# .*/m)
          const hasHeading = !!(headingMatch && headingMatch[0] && headingMatch.index !== undefined)

          if (hasHeading) {
            const headingEnd = headingMatch.index! + headingMatch[0].length
            headingPart = content.slice(0, headingEnd)
            contentPart = content.slice(headingEnd)
          }
          else if (frontmatter.title) {
            headingPart = `# ${frontmatter.title}`
          }

          const tags = frontmatter.tags
          if (tags && Array.isArray(tags) && tags.length)
            tagsPart = `Tags: #${tags.join(', #')}`

          fullContent = sortContent().filter(Boolean).join('\n\n')

          html = md.render(fullContent, env)

          return html
        },
      },
    },
    darkModeSwitchLabel: '切换主题',
    outline: { label: '页面大纲', level: 'deep' },
    editLink: {
      pattern: `${githubRepoLink}/tree/main/:path`,
      text: '编辑本页面',
    },
    sidebar: {
      '/zh-CN/AI/DRL/Deep RL Course/': [
        {
          items: [
            { text: '前言', link: '/zh-CN/AI/DRL/Deep RL Course/' },
          ]
        },
        {
          text: 'UNIT1. 深度强化学习简介',
          collapsed: true,
          items: [
            { text: '介绍', link: '/zh-CN/AI/DRL/Deep RL Course/UNIT1/介绍' },
            { text: '什么是强化学习？', link: '/zh-CN/AI/DRL/Deep RL Course/UNIT1/什么是强化学习？' },
            { text: '强化学习框架', link: '/zh-CN/AI/DRL/Deep RL Course/UNIT1/强化学习框架' },
            { text: '任务类型', link: '/zh-CN/AI/DRL/Deep RL Course/UNIT1/任务类型' },
            { text: '探索和利用的权衡', link: '/zh-CN/AI/DRL/Deep RL Course/UNIT1/探索和利用的权衡' },
            { text: '两种解决强化学习问题的方法', link: '/zh-CN/AI/DRL/Deep RL Course/UNIT1/两种解决强化学习问题的方法' },
            { text: '强化学习中的“深度”', link: '/zh-CN/AI/DRL/Deep RL Course/UNIT1/强化学习中的“深度”' },
            { text: '小结', link: '/zh-CN/AI/DRL/Deep RL Course/UNIT1/小结' },
            { text: '术语表', link: '/zh-CN/AI/DRL/Deep RL Course/UNIT1/术语表' },
            { text: '训练第一个DRL Agent', link: '/zh-CN/AI/DRL/Deep RL Course/UNIT1/训练第一个 DRL Agent' },
            { text: 'Quiz&总结&额外阅读材料', link: '/zh-CN/AI/DRL/Deep RL Course/UNIT1/Quiz&总结&额外阅读材料' },
          ]
        },
        {
          text: 'BONUS UNIT1. 用DRL玩HUGGY游戏',
          collapsed: true,
          items: [
            { text: '介绍', link: '/zh-CN/AI/DRL/Deep RL Course/BONUS UNIT1/介绍' },
            { text: '什么是强化学习？', link: '/zh-CN/AI/DRL/Deep RL Course/BONUS UNIT1/Huggy 介绍' },
            { text: '强化学习框架', link: '/zh-CN/AI/DRL/Deep RL Course/BONUS UNIT1/训练 Huggy' },
          ]
        },
      ]
    },
    //   calculateSidebarWithDefaultOpen([
    //     'zh-CN/AI/DRL/Deep RL Course'
    // ], ''),
    footer: {
      message: '用 <span style="color: #e25555;">&#9829;</span> 撰写',
      copyright:
    '<a class="footer-cc-link" target="_blank" href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> © 2022-PRESENT Nólëbase 的创作者们',
    },
  },
  title: siteName,
  description: siteDescription,
  ignoreDeadLinks: true,
  head,
  locales: {
    root: {
      lang: 'zh-CN',
      label: '中文',
      dir: '/zh-CN',
      link: '/zh-CN',
    },
  },
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'one-dark-pro',
    },
    math: true,
    config: (md) => {
      md.use(MarkdownItFootnote)
      md.use(MarkdownItMathjax3)
      md.use(BiDirectionalLinks({
        dir: process.cwd(),
      }))
      md.use(UnlazyImages(), {
        imgElementTag: 'NolebaseUnlazyImg',
      })
      md.use(InlineLinkPreviewElementTransform)
    },
  },
  async transformHead(context) {
    let head = [...context.head]

    const returnedHead = await transformHeadMeta()(head, context)
    if (typeof returnedHead !== 'undefined')
      head = returnedHead

    return head
  },
  // async buildEnd(siteConfig) {
  //   await buildEndGenerateOpenGraphImages({
  //     baseUrl: targetDomain,
  //     category: {
  //       byLevel: 2,
  //     },
  //   })(siteConfig)
  // },
})
