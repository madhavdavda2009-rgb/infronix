import ServiceLanding from '@/components/ServiceLanding';
import { getService } from '@/lib/services';
import { pageMetadata } from '@/lib/site-seo';
const service = getService('crm-automation');
export const metadata = pageMetadata(service.title, service.description, '/crm-automation');
export default function Page() { return <ServiceLanding slug="crm-automation" />; }
