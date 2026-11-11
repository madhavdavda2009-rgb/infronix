import Image from 'next/image';

// CMS uploads are already resized WebP files or Cloudinary assets. Deliver them
// directly so hosted image-optimizer configuration cannot hide valid photos.
export default function CmsImage({ src, ...props }) {
  const dynamic = typeof src === 'string' && (
    src.startsWith('/api/public/media?') || src.startsWith('data:image/') ||
    // Any other full web address loads straight in the browser, not via our server.
    /^https?:\/\//i.test(src)
  );
  return <Image {...props} src={src} unoptimized={dynamic || props.unoptimized} />;
}
