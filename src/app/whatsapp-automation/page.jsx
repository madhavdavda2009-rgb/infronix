import ServiceLanding from '@/components/ServiceLanding';
import { getService } from '@/lib/services';
import { pageMetadata } from '@/lib/site-seo';
const service = getService('whatsapp-automation');
export const metadata = pageMetadata(service.title, service.description, '/whatsapp-automation');
export default function Page() { return <ServiceLanding slug="whatsapp-automation" />; }
