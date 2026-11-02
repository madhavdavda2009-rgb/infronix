import ServiceLanding from '@/components/ServiceLanding';
import { getService } from '@/lib/services';
import { pageMetadata } from '@/lib/site-seo';
const service = getService('digital-marketing-for-manufacturers');
export const metadata = pageMetadata(service.title, service.description, '/digital-marketing-for-manufacturers');
export default function Page() { return <ServiceLanding slug="digital-marketing-for-manufacturers" />; }
