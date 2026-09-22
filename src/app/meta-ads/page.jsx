import ServiceLanding from '@/components/ServiceLanding';
import { getService } from '@/lib/services';
import { pageMetadata } from '@/lib/site-seo';
const service = getService('meta-ads');
export const metadata = pageMetadata(service.title, service.description, '/meta-ads');
export default function Page() { return <ServiceLanding slug="meta-ads" />; }
