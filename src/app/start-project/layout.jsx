import { pageMetadata } from '@/lib/site-seo';
// This is a conversion form; selected-service/package URLs have no standalone search value.
export const metadata = {
  ...pageMetadata("Discuss Your Project", "Tell InfronixWeb about your website, marketing or automation project. Share your requirements and request a scoped proposal.", '/start-project'),
  robots: { index: false, follow: true },
};

export default function StartProjectLayout({ children }) {
  return children;
}
