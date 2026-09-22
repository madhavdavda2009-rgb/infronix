import ServiceLanding from '@/components/ServiceLanding';
import { getService } from '@/lib/services';
import { pageMetadata } from '@/lib/site-seo';
const service = getService('google-ads');
export const metadata = pageMetadata(service.title, service.description, '/google-ads');
export default function Page() { return <ServiceLanding slug="google-ads" />; }
