import ServiceLanding from '@/components/ServiceLanding';
import { getService } from '@/lib/services';
import { pageMetadata } from '@/lib/site-seo';
const service = getService('performance-marketing');
export const metadata = pageMetadata(service.title, service.description, '/performance-marketing');
export default function Page() { return <ServiceLanding slug="performance-marketing" />; }
