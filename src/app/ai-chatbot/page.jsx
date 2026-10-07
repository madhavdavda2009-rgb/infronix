import { permanentRedirect } from 'next/navigation';

export default function RetiredServicePage() {
  permanentRedirect('/services');
}
