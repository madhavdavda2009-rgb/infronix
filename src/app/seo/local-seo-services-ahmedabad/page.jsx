import ServiceLanding from '@/components/ServiceLanding';
import { getService } from '@/lib/services';
import { pageMetadata } from '@/lib/site-seo';
const service = getService('seo/local-seo-services-ahmedabad');
export const metadata = pageMetadata(service.title, service.description, '/seo/local-seo-services-ahmedabad');
export default function Page() { return <ServiceLanding slug="seo/local-seo-services-ahmedabad" />; }
