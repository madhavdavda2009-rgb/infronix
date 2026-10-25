import ServiceLanding from '@/components/ServiceLanding';
import { getService } from '@/lib/services';
import { pageMetadata } from '@/lib/site-seo';
const service = getService('chatgpt-ads');
export const metadata = pageMetadata(service.title, service.description, '/chatgpt-ads');
export default function Page() { return <ServiceLanding slug="chatgpt-ads" />; }
