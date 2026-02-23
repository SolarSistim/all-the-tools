export const environment = {
  production: false,
  adsEnabled: true,
  ogFetchLimitPerMin: 10,
  ogFetchUserLimitPerMin: 5,
  ogFetchUserLockoutMinutes: 10,
  // Use deployed site URL for Identity API (localhost doesn't have Netlify Identity backend)
  netlifyIdentitySiteUrl: 'https://www.allthethings.dev',
  newsUrl: '/json-proxy/news/news.json',
  resourcesUrl: '/json-proxy/resources',
  artistsUrl: '/json-proxy/3d-artist-spotlight',
  blogUrl: '/json-proxy/blog'
};
