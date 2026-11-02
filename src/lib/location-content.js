// Each kind of place faces a different challenge. Trade-specific advice lives in location-trades.js.
const web = ['/web-development', 'Website development'];
const seo = ['/seo', 'SEO services'];
const localSeo = ['/seo/local-seo-services-ahmedabad', 'Local SEO and Google Maps'];
const googleAds = ['/google-ads', 'Google Ads management'];
const metaAds = ['/meta-ads', 'Meta Ads management'];
const social = ['/digital-marketing/social-media-marketing', 'Social media marketing'];
const store = ['/web-development/ecommerce-website-development-ahmedabad', 'E-commerce websites'];
const manufacturers = ['/digital-marketing-for-manufacturers', 'Marketing for manufacturers'];

const profiles = {
  industrial: {
    challenge: `Buyers looking for a supplier here often come from outside the area, so your website has to explain what you make before anyone visits. A brochure or a single contact page rarely answers that.`,
    links: [web, manufacturers, seo, googleAds],
  },
  commercial: {
    challenge: `Several local businesses often offer the same thing within a short distance. Your listing, reviews and website help a customer choose you instead of the next option on the map.`,
    links: [localSeo, web, googleAds, social],
  },
  residential: {
    challenge: `Most customers around here search on a phone and choose something close by. If your listing is incomplete or your phone number is hard to find, they may move on to the next result.`,
    links: [localSeo, web, social, metaAds],
  },
  oldCity: {
    challenge: `Businesses here often run on reputation and repeat customers. That still matters, but a new buyer from another city will usually check Google before calling.`,
    links: [web, localSeo, store, seo],
  },
  town: {
    challenge: `There are often fewer strong local websites in this part of Gujarat, so a clear site and a complete Google listing can stand out sooner than in a crowded city market.`,
    links: [web, localSeo, googleAds, social],
  },
  city: {
    challenge: `Competition here depends on the trade you are in. We start by checking who currently appears for your services, then decide where your business can realistically stand out.`,
    links: [web, seo, googleAds, manufacturers],
  },
};

export const locationProfile = (location) => profiles[location.kind];
