import ServiceLanding from '@/components/ServiceLanding';
import { getService } from '@/lib/services';
import { pageMetadata } from '@/lib/site-seo';
const service = getService('ai-chatbot');
export const metadata = pageMetadata(service.title, service.description, '/ai-chatbot');
export default function Page() { return <ServiceLanding slug="ai-chatbot" />; }
