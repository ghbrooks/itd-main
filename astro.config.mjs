import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';
import rehypeExternalLinks from 'rehype-external-links';
import { unified } from '@astrojs/markdown-remark';

// https://astro.build/config
// Historical WordPress URLs. Posts lived at /<slug>; they now live under /blog/.
// Static output means these become meta-refresh stubs, which is what GitHub
// Pages can serve; swap for host-level 301s when the DNS moves.
const legacyRedirects = {
    '/is-talent-a-thing': '/blog/is-talent-a-thing',
    '/virtual-presentation-skills-course': '/blog/virtual-presentation-skills-course',
    '/virtual-teamwork-training-course-5-top-tips-to-improve-your-teams-performance': '/blog/virtual-teamwork-training-course-5-top-tips-to-improve-your-teams-performance',
    '/assertiveness-course-how-could-this-training-help-you': '/blog/assertiveness-course-how-could-this-training-help-you',
    '/working-from-home-time-management-tips': '/blog/working-from-home-time-management-tips',
    '/how-does-service-excellence-training-improve-the-customer-experience': '/blog/how-does-service-excellence-training-improve-the-customer-experience',
    '/what-is-nudge-theory-what-is-nudge-training': '/blog/what-is-nudge-theory-what-is-nudge-training',
    '/chatgpt': '/blog/chatgpt',
    '/benefits-of-management-training-for-existing-managers': '/blog/benefits-of-management-training-for-existing-managers',
    '/how-to-develop-confidence-in-the-workplace': '/blog/how-to-develop-confidence-in-the-workplace',
    '/do-soft-skills-training-courses-for-employees-benefit-employers': '/blog/do-soft-skills-training-courses-for-employees-benefit-employers',
    '/working-with-different-styles-direct': '/blog/working-with-different-styles-direct',
    '/advantages-of-virtual-training': '/blog/advantages-of-virtual-training',
    '/the-benefits-of-virtual-training-courses-for-lawyers': '/blog/the-benefits-of-virtual-training-courses-for-lawyers',
    '/the-benefits-of-a-written-communication-skills-workshop': '/blog/the-benefits-of-a-written-communication-skills-workshop',
    '/benefits-of-unconscious-bias-training': '/blog/benefits-of-unconscious-bias-training',
    '/how-to-get-into-good-habits': '/blog/how-to-get-into-good-habits',
    '/teamwork-is-like-a-jigsaw-puzzle': '/blog/teamwork-is-like-a-jigsaw-puzzle',
    '/whats-different-about-nudge-training-with-itd': '/blog/whats-different-about-nudge-training-with-itd',
    '/elementor-37392': '/blog/how-to-say-no-at-work-assertively',
    '/examples-of-microaggression-at-work': '/blog/examples-of-microaggression-at-work',
    '/negotiation-skills-training-why-it-matters-and-how-it-improves-results-at-work': '/blog/negotiation-skills-training-why-it-matters-and-how-it-improves-results-at-work',
    '/practical-benefits-of-management-training': '/blog/practical-benefits-of-management-training',
    '/the-impact-of-virtual-presentation-skills-training': '/blog/the-impact-of-virtual-presentation-skills-training',
    '/challenges-when-presenting-virtually': '/blog/challenges-when-presenting-virtually',
    '/carrot-stick-motivating': '/blog/carrot-stick-motivating',
    '/business-services-managers-managing-motivating-people': '/blog/business-services-managers-managing-motivating-people',
    '/how-practical-is-fee-negotiation-training': '/blog/how-practical-is-fee-negotiation-training',
    '/how-to-improve-email-impact': '/blog/how-to-improve-email-impact',
    '/how-to-make-virtual-training-engaging': '/blog/how-to-make-virtual-training-engaging',
    '/does-virtual-training-lead-to-behavioural-change': '/blog/does-virtual-training-lead-to-behavioural-change',
    '/how-is-training-tailored': '/blog/how-is-training-tailored',
    '/how-can-you-use-the-principles-of-nudge': '/blog/how-can-you-use-the-principles-of-nudge',
    '/training-reviews': '/reviews',
    '/about-itd': '/about',
    '/training-case-studies': '/case-studies',
    '/teamwork-training': '/teamwork-collaboration-training',
    '/coaching-training': '/coaching-skills-training',
    '/market-sector-specific-training': '/sectors',
    '/itd-soft-skills-training': '/training',
    '/work-styles-model-results': '/work-styles-model-questionnaire',
    '/free-downloads/free-assertiveness-tip-sheet': '/assertiveness-training',
};

export default defineConfig({
  site: 'https://itd.com',
  trailingSlash: 'ignore',
  redirects: legacyRedirects,
  build: {
    inlineStylesheets: 'auto',
  },
  markdown: {
    // Astro 7 defaults to the Sätteri processor, which has no rehype hook; the
    // unified() pipeline is kept so links out of itd.com open in a new tab.
    processor: unified({
      rehypePlugins: [[rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }]],
    }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      filter: (page) => !Object.keys(legacyRedirects).some((from) => page === `https://itd.com${from}`),
    }),
    mdx(),
    icon({
      iconDir: 'src/icons',
    }),
  ],
});
