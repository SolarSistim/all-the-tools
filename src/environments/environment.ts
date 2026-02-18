export const environment = {
  production: false,
  adsEnabled: true,
  ogFetchLimitPerMin: 10,
  ogFetchUserLimitPerMin: 5,
  ogFetchUserLockoutMinutes: 10,
  // Use deployed site URL for Identity API (localhost doesn't have Netlify Identity backend)
  netlifyIdentitySiteUrl: 'https://www.allthethings.dev',
  newsUrl: 'https://json.allthethings.dev/news/news.json'
};
