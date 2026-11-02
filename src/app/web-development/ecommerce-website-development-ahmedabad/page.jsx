import ServiceLanding from '@/components/ServiceLanding';
import { getService } from '@/lib/services';
import { pageMetadata } from '@/lib/site-seo';
const service = getService('web-development/ecommerce-website-development-ahmedabad');
export const metadata = pageMetadata(service.title, service.description, '/web-development/ecommerce-website-development-ahmedabad');
export default function Page() { return <ServiceLanding slug="web-development/ecommerce-website-development-ahmedabad" />; }
