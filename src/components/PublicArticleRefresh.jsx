'use client';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { usePublicData } from '@/hooks/usePublicData';

export default function PublicArticleRefresh({ slug, revision }) {
  const router = useRouter();
  const initialData = useMemo(() => ({ success: true, revision }), [revision]);
  const data = usePublicData(`/api/public/blog-revision?slug=${encodeURIComponent(slug)}`, initialData);
  useEffect(() => {
    if (data?.success && data.revision !== revision) router.refresh();
  }, [data, revision, router]);
  return null;
}
