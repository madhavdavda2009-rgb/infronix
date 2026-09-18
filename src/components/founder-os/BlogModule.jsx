"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Article,
  Plus,
  MagnifyingGlass,
  Funnel,
  PencilSimple,
  Trash,
  Eye,
  CheckCircle,
  Clock,
  Archive,
  ArrowCounterClockwise,
  Globe,
  Tag,
  FolderSimple,
  UploadSimple,
  Image as ImageIcon,
  LinkSimple,
  TextB,
  TextItalic,
  TextHTwo,
  TextHThree,
  Quotes,
  Code,
  ListBullets,
  ListNumbers,
  Minus,
  Sparkle,
  CalendarBlank,
  User,
  WarningCircle,
  X,
  ShareNetwork,
  ArrowSquareOut
} from '@phosphor-icons/react';
import { useToast } from '@/context/ToastContext';
import { ConfirmModal } from './ConfirmModal';
import EmptyState from './EmptyState';
import { SafeMarkdownRenderer, calculateReadingTime } from '@/lib/markdown_parser';

function generateSlug(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function BlogModule({ onRefreshDashboard }) {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'drafts', 'published', 'scheduled', 'archived', 'categories', 'tags'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const [posts, setPosts] = useState([]);
  const [counts, setCounts] = useState({ total: 0, drafts: 0, published: 0, scheduled: 0, archived: 0 });
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Editor Modal State
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editorTab, setEditorTab] = useState('content'); // 'content', 'author', 'seo'
  const [editorViewMode, setEditorViewMode] = useState('edit'); // 'edit', 'preview', 'split'

  // Editor Form State
  const [postTitle, setPostTitle] = useState('');
  const [postSlug, setPostSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [postExcerpt, setPostExcerpt] = useState('');
  const [postContent, setPostContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [coverImageAlt, setCoverImageAlt] = useState('');
  const [selectedAuthorId, setSelectedAuthorId] = useState('');
  const [customAuthorName, setCustomAuthorName] = useState('InfronixWeb Editorial Team');
  const [customAuthorRole, setCustomAuthorRole] = useState('Digital Specialists');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [postStatus, setPostStatus] = useState('Draft');
  const [isFeatured, setIsFeatured] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [ogImageUrl, setOgImageUrl] = useState('');

  // Image upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  // Category & Tag modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showTagModal, setShowTagModal] = useState(false);
  const [editingTag, setEditingTag] = useState(null);

  // Confirmation Modals
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, title: '', isPublished: false });
  const [archiveConfirm, setArchiveConfirm] = useState({ isOpen: false, id: null, title: '' });

  // Textarea ref for toolbar insertions
  const contentTextareaRef = useRef(null);

  // Fetch blogs, categories, tags, authors
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/founder-os/blogs');
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts || []);
        setCounts(data.counts || { total: 0, drafts: 0, published: 0, scheduled: 0, archived: 0 });
        setCategories(data.categories || []);
        setTags(data.tags || []);
        setAuthors(data.authors || []);
      } else {
        showToast(data.error || 'Failed to load blog records', 'error');
      }
    } catch (err) {
      console.error('Blog fetch error:', err);
      showToast('Error loading blog records', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Open Editor for new or existing post
  function handleOpenEditor(post = null) {
    if (post) {
      setEditingPost(post);
      setPostTitle(post.title || '');
      setPostSlug(post.slug || '');
      setSlugManuallyEdited(true);
      setPostExcerpt(post.excerpt || '');
      setPostContent(post.content_markdown || '');
      setCoverImageUrl(post.cover_image_url || '');
      setCoverImageAlt(post.cover_image_alt || '');
      setSelectedAuthorId(post.author_person_id ? String(post.author_person_id) : '');
      setCustomAuthorName(post.author_name || 'InfronixWeb Editorial Team');
      setCustomAuthorRole(post.author_role || 'Digital Specialists');
      setSelectedCategoryId(post.category_id ? String(post.category_id) : '');
      setSelectedTagIds(Array.isArray(post.tags) ? post.tags.map(t => t.id) : []);
      setPostStatus(post.status || 'Draft');
      setIsFeatured(Boolean(post.featured));
      setScheduledDate(post.scheduled_for ? new Date(post.scheduled_for).toISOString().slice(0, 16) : '');
      setSeoTitle(post.seo_title || '');
      setSeoDescription(post.seo_description || '');
      setCanonicalUrl(post.canonical_url || '');
      setOgImageUrl(post.og_image_url || '');
    } else {
      setEditingPost(null);
      setPostTitle('');
      setPostSlug('');
      setSlugManuallyEdited(false);
      setPostExcerpt('');
      setPostContent('');
      setCoverImageUrl('');
      setCoverImageAlt('');
      const defaultFounder = authors.find(a => a.is_founder);
      setSelectedAuthorId(defaultFounder ? String(defaultFounder.id) : '');
      setCustomAuthorName('InfronixWeb Editorial Team');
      setCustomAuthorRole('Digital Specialists');
      setSelectedCategoryId(categories[0]?.id ? String(categories[0].id) : '');
      setSelectedTagIds([]);
      setPostStatus('Draft');
      setIsFeatured(false);
      setScheduledDate('');
      setSeoTitle('');
      setSeoDescription('');
      setCanonicalUrl('');
      setOgImageUrl('');
    }
    setEditorTab('content');
    setEditorViewMode('edit');
    setShowEditor(true);
  }

  // Title change triggers automatic slug update if not manually edited
  function handleTitleChange(val) {
    setPostTitle(val);
    if (!slugManuallyEdited) {
      setPostSlug(generateSlug(val));
    }
  }

  // Insert markdown snippet into editor
  function insertMarkdown(prefix, suffix = '', placeholder = '') {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = postContent.substring(start, end) || placeholder;
    const replacement = `${prefix}${selectedText}${suffix}`;

    const updated = postContent.substring(0, start) + replacement + postContent.substring(end);
    setPostContent(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  }

  // Upload Cover Photo
  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size exceeds 5 MB limit', 'error');
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/founder-os/blogs/upload-image', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setCoverImageUrl(data.imageUrl);
        if (!coverImageAlt && postTitle) {
          setCoverImageAlt(postTitle);
        }
        showToast('Cover photo uploaded', 'success');
      } else {
        showToast(data.error || 'Failed to upload photo', 'error');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      showToast('Image upload failed', 'error');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  // Save Post Handler (Draft / Publish / Schedule / Archive)
  async function handleSavePost(overrideStatus = null) {
    if (!postTitle.trim()) {
      showToast('Article title is required', 'error');
      setEditorTab('content');
      return;
    }

    if (!postExcerpt.trim()) {
      showToast('Article excerpt is required', 'error');
      setEditorTab('content');
      return;
    }

    const finalStatus = overrideStatus || postStatus;

    if (finalStatus === 'Scheduled' && !scheduledDate) {
      showToast('Please specify a scheduled publication date and time', 'error');
      setEditorTab('seo');
      return;
    }

    setActionLoading(true);
    try {
      const payload = {
        title: postTitle.trim(),
        slug: postSlug.trim() || generateSlug(postTitle),
        excerpt: postExcerpt.trim(),
        content_markdown: postContent,
        cover_image_url: coverImageUrl || null,
        cover_image_alt: coverImageAlt || null,
        author_person_id: selectedAuthorId ? parseInt(selectedAuthorId, 10) : null,
        author_name: customAuthorName,
        author_role: customAuthorRole,
        category_id: selectedCategoryId ? parseInt(selectedCategoryId, 10) : null,
        tag_ids: selectedTagIds,
        status: finalStatus,
        featured: isFeatured,
        scheduled_for: finalStatus === 'Scheduled' && scheduledDate ? scheduledDate : null,
        seo_title: seoTitle.trim() || null,
        seo_description: seoDescription.trim() || null,
        canonical_url: canonicalUrl.trim() || null,
        og_image_url: ogImageUrl.trim() || null
      };

      let res;
      if (editingPost) {
        res = await fetch(`/api/founder-os/blogs/${editingPost.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/founder-os/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (data.success) {
        showToast(
          finalStatus === 'Published' 
            ? 'Article published to live website!' 
            : (editingPost ? 'Article updated' : 'Draft saved'), 
          'success'
        );
        setShowEditor(false);
        fetchData();
        if (onRefreshDashboard) onRefreshDashboard();
      } else {
        showToast(data.error || 'Failed to save article', 'error');
      }
    } catch (err) {
      console.error('Save error:', err);
      showToast('Error saving article', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  // Quick Action: Publish / Unpublish / Archive / Restore
  async function handleQuickStatusChange(post, targetStatus) {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/founder-os/blogs/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Article marked as ${targetStatus}`, 'success');
        fetchData();
        if (onRefreshDashboard) onRefreshDashboard();
      } else {
        showToast(data.error || 'Status update failed', 'error');
      }
    } catch (err) {
      console.error('Status change error:', err);
      showToast('Error changing article status', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  // Open Authenticated Preview
  async function handleOpenPreview(postId) {
    try {
      const res = await fetch('/api/founder-os/blogs/preview-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blogId: postId })
      });
      const data = await res.json();
      if (data.success && data.previewUrl) {
        window.open(data.previewUrl, '_blank');
      } else {
        showToast(data.error || 'Failed to generate preview', 'error');
      }
    } catch (err) {
      showToast('Error opening preview', 'error');
    }
  }

  // Permanent Delete Confirm
  async function handleDeleteConfirm() {
    if (!deleteConfirm.id) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/founder-os/blogs/${deleteConfirm.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Article permanently deleted', 'success');
        setDeleteConfirm({ isOpen: false, id: null, title: '', isPublished: false });
        fetchData();
        if (onRefreshDashboard) onRefreshDashboard();
      } else {
        showToast(data.error || 'Failed to delete article', 'error');
      }
    } catch (err) {
      showToast('Error deleting article', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  // Filter posts based on active tab, search, and category
  const filteredPosts = posts.filter(post => {
    // Tab filter
    if (activeTab === 'drafts' && post.status !== 'Draft') return false;
    if (activeTab === 'published' && post.status !== 'Published') return false;
    if (activeTab === 'scheduled' && post.status !== 'Scheduled') return false;
    if (activeTab === 'archived' && post.status !== 'Archived') return false;

    // Category filter
    if (categoryFilter !== 'ALL' && String(post.category_id) !== String(categoryFilter)) {
      return false;
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title?.toLowerCase().includes(q);
      const matchSlug = post.slug?.toLowerCase().includes(q);
      const matchExcerpt = post.excerpt?.toLowerCase().includes(q);
      const matchAuthor = post.author_name?.toLowerCase().includes(q);
      if (!matchTitle && !matchSlug && !matchExcerpt && !matchAuthor) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Metrics Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div 
          onClick={() => setActiveTab('all')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${activeTab === 'all' ? 'bg-violet-50/70 border-violet-300 shadow-xs' : 'bg-white border-slate-200 hover:border-slate-300'}`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">All Posts</span>
            <Article size={16} className="text-violet-600" />
          </div>
          <div className="text-2xl font-bold font-heading text-slate-900">{counts.total}</div>
        </div>

        <div 
          onClick={() => setActiveTab('published')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${activeTab === 'published' ? 'bg-emerald-50/70 border-emerald-300 shadow-xs' : 'bg-white border-slate-200 hover:border-slate-300'}`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Published</span>
            <Globe size={16} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-heading text-emerald-700">{counts.published}</div>
        </div>

        <div 
          onClick={() => setActiveTab('drafts')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${activeTab === 'drafts' ? 'bg-amber-50/70 border-amber-300 shadow-xs' : 'bg-white border-slate-200 hover:border-slate-300'}`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Drafts</span>
            <PencilSimple size={16} className="text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-heading text-amber-700">{counts.drafts}</div>
        </div>

        <div 
          onClick={() => setActiveTab('scheduled')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${activeTab === 'scheduled' ? 'bg-blue-50/70 border-blue-300 shadow-xs' : 'bg-white border-slate-200 hover:border-slate-300'}`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Scheduled</span>
            <Clock size={16} className="text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-heading text-blue-700">{counts.scheduled}</div>
        </div>

        <div 
          onClick={() => setActiveTab('archived')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${activeTab === 'archived' ? 'bg-slate-100 border-slate-300 shadow-xs' : 'bg-white border-slate-200 hover:border-slate-300'}`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Archived</span>
            <Archive size={16} className="text-slate-500" />
          </div>
          <div className="text-2xl font-bold font-heading text-slate-600">{counts.archived}</div>
        </div>
      </div>

      {/* Navigation & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
          {[
            { id: 'all', label: 'All Posts' },
            { id: 'published', label: 'Published' },
            { id: 'drafts', label: 'Drafts' },
            { id: 'scheduled', label: 'Scheduled' },
            { id: 'archived', label: 'Archived' },
            { id: 'categories', label: `Categories (${categories.length})` },
            { id: 'tags', label: `Tags (${tags.length})` }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === t.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {activeTab === 'categories' ? (
            <button
              onClick={() => { setEditingCategory(null); setShowCategoryModal(true); }}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-violet-600/20 cursor-pointer transition-all min-h-[38px]"
            >
              <Plus size={15} weight="bold" />
              <span>New Category</span>
            </button>
          ) : activeTab === 'tags' ? (
            <button
              onClick={() => { setEditingTag(null); setShowTagModal(true); }}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-violet-600/20 cursor-pointer transition-all min-h-[38px]"
            >
              <Plus size={15} weight="bold" />
              <span>New Tag</span>
            </button>
          ) : (
            <button
              onClick={() => handleOpenEditor(null)}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-violet-600/20 cursor-pointer transition-all min-h-[38px]"
            >
              <Plus size={15} weight="bold" />
              <span>Write Article</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Management View */}
      {activeTab === 'categories' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Article Categories</h3>
            <span className="text-xs text-slate-500">{categories.length} Categories configured</span>
          </div>
          <div className="divide-y divide-slate-100">
            {categories.map(cat => (
              <div key={cat.id} className="p-4 sm:px-5 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{cat.name}</span>
                    <span className="text-xs font-mono text-slate-400">/{cat.slug}</span>
                  </div>
                  {cat.description && (
                    <p className="text-xs text-slate-500 mt-0.5 max-w-xl">{cat.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 font-semibold rounded-lg">
                    {cat.post_count || 0} posts
                  </span>
                  <button
                    onClick={() => { setEditingCategory(cat); setShowCategoryModal(true); }}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Edit Category"
                  >
                    <PencilSimple size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tag Management View */}
      {activeTab === 'tags' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Topic Tags</h3>
          <div className="flex flex-wrap gap-2.5">
            {tags.map(tag => (
              <div 
                key={tag.id}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <span className="font-bold text-slate-800">#{tag.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">({tag.post_count || 0})</span>
                <button
                  onClick={() => { setEditingTag(tag); setShowTagModal(true); }}
                  className="text-slate-400 hover:text-slate-700 ml-1 cursor-pointer"
                  title="Edit Tag"
                >
                  <PencilSimple size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Posts Listing Views */}
      {activeTab !== 'categories' && activeTab !== 'tags' && (
        <>
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles by title, slug, excerpt, author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 shadow-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 shadow-xs"
              >
                <option value="ALL">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Posts Table / List */}
          {filteredPosts.length === 0 ? (
            <EmptyState
              icon={Article}
              title="No blog articles found"
              message={
                searchQuery || categoryFilter !== 'ALL'
                  ? 'No articles match the applied filters.'
                  : activeTab === 'drafts'
                  ? 'No drafts currently saved. Start writing a new article.'
                  : activeTab === 'published'
                  ? 'No articles published yet. Publish a draft to make it live on the website.'
                  : 'Create your first blog post to publish insights on InfronixWeb.'
              }
              actionLabel="Write Article"
              onAction={() => handleOpenEditor(null)}
            />
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3 px-4">Article</th>
                      <th className="py-3 px-4">Author</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredPosts.map(post => {
                      const isPub = post.status === 'Published';
                      const isDraft = post.status === 'Draft';
                      const isSched = post.status === 'Scheduled';
                      const isArch = post.status === 'Archived';

                      return (
                        <tr key={post.id} className="hover:bg-slate-50/60 transition-colors group">
                          {/* Article Title & Cover */}
                          <td className="py-3.5 px-4 min-w-[240px]">
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                                {post.cover_image_url ? (
                                  <img src={post.cover_image_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <ImageIcon size={20} className="text-slate-400" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-slate-900 line-clamp-1 hover:text-violet-600 transition-colors cursor-pointer" onClick={() => handleOpenEditor(post)}>
                                    {post.title}
                                  </span>
                                  {post.featured && (
                                    <span className="px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-[10px] font-bold text-amber-700 flex items-center gap-0.5">
                                      <Sparkle size={11} weight="fill" /> Featured
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-mono">
                                  <span>/blog/{post.slug}</span>
                                  <span>•</span>
                                  <span>{post.reading_time_minutes || 1} min read</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Author */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-700 font-medium">
                            <div className="flex items-center gap-2">
                              {post.author_avatar_url ? (
                                <img src={post.author_avatar_url} alt="" className="w-6 h-6 rounded-full object-cover border border-slate-200" />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                  {post.author_name ? post.author_name[0] : 'I'}
                                </div>
                              )}
                              <span>{post.author_name}</span>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px]">
                              {post.category_name || 'Uncategorized'}
                            </span>
                          </td>

                          {/* Status Badge */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                              isPub 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : isDraft 
                                ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                                : isSched 
                                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                isPub ? 'bg-emerald-500' : isDraft ? 'bg-amber-500' : isSched ? 'bg-blue-500' : 'bg-slate-400'
                              }`} />
                              {post.status}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                            {isPub && post.published_at ? (
                              <div>
                                <span className="font-semibold text-slate-700">Published</span>
                                <div>{new Date(post.published_at).toLocaleDateString()}</div>
                              </div>
                            ) : isSched && post.scheduled_for ? (
                              <div>
                                <span className="font-semibold text-blue-600">Scheduled for</span>
                                <div>{new Date(post.scheduled_for).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                              </div>
                            ) : (
                              <div>
                                <span className="text-slate-400">Updated</span>
                                <div>{new Date(post.updated_at).toLocaleDateString()}</div>
                              </div>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Preview Draft */}
                              <button
                                onClick={() => handleOpenPreview(post.id)}
                                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                title="Preview Draft"
                              >
                                <Eye size={16} />
                              </button>

                              {/* View Live if Published */}
                              {isPub && (
                                <a
                                  href={`/blog/${post.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                  title="View on Live Website"
                                >
                                  <ArrowSquareOut size={16} />
                                </a>
                              )}

                              {/* Edit */}
                              <button
                                onClick={() => handleOpenEditor(post)}
                                className="p-1.5 text-violet-600 hover:text-violet-800 hover:bg-violet-50 rounded-lg transition-colors cursor-pointer"
                                title="Edit Article"
                              >
                                <PencilSimple size={16} />
                              </button>

                              {/* Quick Status Toggles */}
                              {isDraft && (
                                <button
                                  onClick={() => handleQuickStatusChange(post, 'Published')}
                                  disabled={actionLoading}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shadow-xs cursor-pointer transition-all"
                                  title="Publish to Live Website"
                                >
                                  Publish
                                </button>
                              )}

                              {isPub && (
                                <button
                                  onClick={() => handleQuickStatusChange(post, 'Draft')}
                                  disabled={actionLoading}
                                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold cursor-pointer transition-all"
                                  title="Move back to Draft (Unpublish)"
                                >
                                  Unpublish
                                </button>
                              )}

                              {isArch && (
                                <button
                                  onClick={() => handleQuickStatusChange(post, 'Draft')}
                                  disabled={actionLoading}
                                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                  title="Restore to Draft"
                                >
                                  <ArrowCounterClockwise size={16} />
                                </button>
                              )}

                              {!isArch && (
                                <button
                                  onClick={() => handleQuickStatusChange(post, 'Archived')}
                                  disabled={actionLoading}
                                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                  title="Archive Article"
                                >
                                  <Archive size={16} />
                                </button>
                              )}

                              {/* Delete */}
                              <button
                                onClick={() => setDeleteConfirm({ isOpen: true, id: post.id, title: post.title, isPublished: isPub })}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Permanently Delete"
                              >
                                <Trash size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* FULL BLOG EDITOR MODAL */}
      {showEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-700 border border-violet-200 flex items-center justify-center font-bold">
                  <Article size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold font-heading text-slate-900">
                    {editingPost ? 'Edit Blog Article' : 'New Blog Article'}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Reading Time: ~{calculateReadingTime(postContent)} min</span>
                    <span>•</span>
                    <span>Words: {postContent.trim() ? postContent.trim().split(/\s+/).length : 0}</span>
                  </div>
                </div>
              </div>

              {/* Header Editor Tabs */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setEditorTab('content')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${editorTab === 'content' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Content & Media
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorTab('author')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${editorTab === 'author' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Author & Tags
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorTab('seo')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${editorTab === 'seo' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    SEO & Publish
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowEditor(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Mobile Tab Switcher */}
            <div className="sm:hidden flex border-b border-slate-200 bg-slate-50 px-3 py-1 text-xs">
              <button
                onClick={() => setEditorTab('content')}
                className={`flex-1 py-1.5 font-bold ${editorTab === 'content' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-slate-500'}`}
              >
                Content
              </button>
              <button
                onClick={() => setEditorTab('author')}
                className={`flex-1 py-1.5 font-bold ${editorTab === 'author' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-slate-500'}`}
              >
                Author
              </button>
              <button
                onClick={() => setEditorTab('seo')}
                className={`flex-1 py-1.5 font-bold ${editorTab === 'seo' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-slate-500'}`}
              >
                SEO
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              
              {/* TAB 1: CONTENT & MEDIA */}
              {editorTab === 'content' && (
                <div className="space-y-5">
                  {/* Article Title */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Article Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={postTitle}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. How Local SEO Helps Ahmedabad Businesses Grow"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                    />
                  </div>

                  {/* URL Slug */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        URL Slug <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[11px] text-slate-400 font-mono">https://www.infronixweb.in/blog/{postSlug || '...'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={postSlug}
                        onChange={(e) => {
                          setSlugManuallyEdited(true);
                          setPostSlug(generateSlug(e.target.value));
                        }}
                        placeholder="how-local-seo-helps-ahmedabad-businesses"
                        className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSlugManuallyEdited(false);
                          setPostSlug(generateSlug(postTitle));
                        }}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap"
                        title="Auto-regenerate slug from Title"
                      >
                        Auto-sync
                      </button>
                    </div>
                  </div>

                  {/* Excerpt / Summary */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Excerpt / Meta Lead <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[11px] text-slate-400">{postExcerpt.length} chars (recom. 120-180)</span>
                    </div>
                    <textarea
                      rows={2}
                      value={postExcerpt}
                      onChange={(e) => setPostExcerpt(e.target.value)}
                      placeholder="Brief 1-2 sentence hook for search engines and social cards..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 leading-relaxed"
                    />
                  </div>

                  {/* Cover Photo Manager */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Cover Photo & Alt Text
                    </label>
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      {/* Image Preview / Upload Box */}
                      <div className="relative w-full sm:w-44 h-28 bg-white border-2 border-dashed border-slate-300 rounded-xl overflow-hidden flex items-center justify-center shrink-0 group">
                        {coverImageUrl ? (
                          <>
                            <img src={coverImageUrl} alt="Cover preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-1.5 bg-white text-slate-900 rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                                title="Replace Photo"
                              >
                                Replace
                              </button>
                              <button
                                type="button"
                                onClick={() => setCoverImageUrl('')}
                                className="p-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                                title="Remove Photo"
                              >
                                Remove
                              </button>
                            </div>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                            className="w-full h-full flex flex-col items-center justify-center p-2 text-slate-400 hover:text-violet-600 transition-colors cursor-pointer"
                          >
                            <UploadSimple size={24} className="mb-1" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                              {uploadingImage ? 'Uploading...' : 'Upload Image'}
                            </span>
                          </button>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/avif"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>

                      {/* URL input and Alt text */}
                      <div className="flex-1 w-full space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={coverImageUrl}
                            onChange={(e) => setCoverImageUrl(e.target.value)}
                            placeholder="Image URL (e.g. /uploads/blog/...) or upload above"
                            className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap"
                          >
                            Browse
                          </button>
                        </div>
                        <input
                          type="text"
                          value={coverImageAlt}
                          onChange={(e) => setCoverImageAlt(e.target.value)}
                          placeholder="Image Alt Text (e.g. InfronixWeb local SEO strategy chart)"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Main Article Content & Markdown Toolbar */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Article Body (Markdown)
                      </label>
                      <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setEditorViewMode('edit')}
                          className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${editorViewMode === 'edit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                        >
                          Write
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditorViewMode('preview')}
                          className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${editorViewMode === 'preview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                        >
                          Preview
                        </button>
                      </div>
                    </div>

                    {/* Markdown Quick Toolbar */}
                    {editorViewMode === 'edit' && (
                      <div className="flex flex-wrap items-center gap-1 p-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs">
                        <button
                          type="button"
                          onClick={() => insertMarkdown('## ', '', 'Section Heading')}
                          className="p-1.5 hover:bg-white hover:text-violet-600 text-slate-700 rounded-lg transition-colors cursor-pointer font-bold"
                          title="Heading 2"
                        >
                          <TextHTwo size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('### ', '', 'Subheading')}
                          className="p-1.5 hover:bg-white hover:text-violet-600 text-slate-700 rounded-lg transition-colors cursor-pointer font-bold"
                          title="Heading 3"
                        >
                          <TextHThree size={16} />
                        </button>
                        <div className="w-[1px] h-4 bg-slate-300 mx-1" />
                        <button
                          type="button"
                          onClick={() => insertMarkdown('**', '**', 'bold text')}
                          className="p-1.5 hover:bg-white hover:text-violet-600 text-slate-700 rounded-lg transition-colors cursor-pointer font-bold"
                          title="Bold"
                        >
                          <TextB size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('*', '*', 'italic text')}
                          className="p-1.5 hover:bg-white hover:text-violet-600 text-slate-700 rounded-lg transition-colors cursor-pointer italic"
                          title="Italic"
                        >
                          <TextItalic size={16} />
                        </button>
                        <div className="w-[1px] h-4 bg-slate-300 mx-1" />
                        <button
                          type="button"
                          onClick={() => insertMarkdown('- ', '', 'List item')}
                          className="p-1.5 hover:bg-white hover:text-violet-600 text-slate-700 rounded-lg transition-colors cursor-pointer"
                          title="Bullet List"
                        >
                          <ListBullets size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('1. ', '', 'Numbered item')}
                          className="p-1.5 hover:bg-white hover:text-violet-600 text-slate-700 rounded-lg transition-colors cursor-pointer"
                          title="Numbered List"
                        >
                          <ListNumbers size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('> ', '', 'Important quote or takeaway')}
                          className="p-1.5 hover:bg-white hover:text-violet-600 text-slate-700 rounded-lg transition-colors cursor-pointer"
                          title="Blockquote"
                        >
                          <Quotes size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('```javascript\n', '\n```', '// code snippet here')}
                          className="p-1.5 hover:bg-white hover:text-violet-600 text-slate-700 rounded-lg transition-colors cursor-pointer"
                          title="Code Block"
                        >
                          <Code size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('[', '](https://example.com)', 'Link Text')}
                          className="p-1.5 hover:bg-white hover:text-violet-600 text-slate-700 rounded-lg transition-colors cursor-pointer"
                          title="Insert Link"
                        >
                          <LinkSimple size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('![Image description](', ')', 'https://...')}
                          className="p-1.5 hover:bg-white hover:text-violet-600 text-slate-700 rounded-lg transition-colors cursor-pointer"
                          title="Insert Image"
                        >
                          <ImageIcon size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('\n---\n', '', '')}
                          className="p-1.5 hover:bg-white hover:text-violet-600 text-slate-700 rounded-lg transition-colors cursor-pointer"
                          title="Horizontal Divider"
                        >
                          <Minus size={16} />
                        </button>
                      </div>
                    )}

                    {/* Textarea or Preview */}
                    {editorViewMode === 'edit' ? (
                      <textarea
                        ref={contentTextareaRef}
                        rows={16}
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder="Write your article in structured Markdown... Use ## for headings, **bold**, - for lists, etc."
                        className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 leading-relaxed"
                      />
                    ) : (
                      <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl min-h-[300px] overflow-y-auto">
                        <SafeMarkdownRenderer content={postContent || '*No content written yet.*'} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: AUTHOR & CLASSIFICATION */}
              {editorTab === 'author' && (
                <div className="space-y-5">
                  {/* Author Selection from People & Roles */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Author Attribution
                    </label>
                    <p className="text-xs text-slate-500">
                      Link this post to a real team member from People & Roles, or assign to the editorial desk.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Team Member</label>
                        <select
                          value={selectedAuthorId}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedAuthorId(val);
                            if (val) {
                              const found = authors.find(a => String(a.id) === String(val));
                              if (found) {
                                setCustomAuthorName(found.name);
                                setCustomAuthorRole(found.public_role || found.role || 'Team Member');
                              }
                            }
                          }}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                        >
                          <option value="">-- Custom / Editorial Team --</option>
                          {authors.map(a => (
                            <option key={a.id} value={a.id}>
                              {a.name} ({a.public_role || a.role}){a.is_founder ? ' [Founder]' : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Display Author Name</label>
                        <input
                          type="text"
                          value={customAuthorName}
                          onChange={(e) => setCustomAuthorName(e.target.value)}
                          placeholder="e.g. Madhav Davda or InfronixWeb Editorial Team"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Primary Category <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => { setEditingCategory(null); setShowCategoryModal(true); }}
                        className="text-xs text-violet-600 hover:text-violet-800 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={13} weight="bold" /> Add Category
                      </button>
                    </div>

                    <select
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tags Multi-Select */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Topic Tags
                      </label>
                      <button
                        type="button"
                        onClick={() => { setEditingTag(null); setShowTagModal(true); }}
                        className="text-xs text-violet-600 hover:text-violet-800 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={13} weight="bold" /> Add Tag
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {tags.map(t => {
                        const isSelected = selectedTagIds.includes(t.id);
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedTagIds(selectedTagIds.filter(id => id !== t.id));
                              } else {
                                setSelectedTagIds([...selectedTagIds, t.id]);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-violet-600 text-white shadow-xs shadow-violet-600/20'
                                : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400'
                            }`}
                          >
                            <Tag size={13} weight={isSelected ? 'fill' : 'regular'} />
                            <span>{t.name}</span>
                          </button>
                        );
                      })}
                      {tags.length === 0 && (
                        <span className="text-xs text-slate-400 italic">No tags created yet.</span>
                      )}
                    </div>
                  </div>

                  {/* Featured Article Toggle */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Sparkle size={15} className="text-amber-500" weight="fill" />
                        <span>Feature this article on Blog index</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Displays article in prominent hero spotlight at the top of /blog.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 3: SEO & PUBLICATION CONTROLS */}
              {editorTab === 'seo' && (
                <div className="space-y-5">
                  {/* Status & Schedule Controls */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Publication Workflow
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'Draft', label: 'Draft', desc: 'Saved privately in database. Not visible publicly.' },
                        { id: 'Published', label: 'Published', desc: 'Live immediately on /blog & sitemap.' },
                        { id: 'Scheduled', label: 'Scheduled', desc: 'Auto-publishes at specified date/time.' }
                      ].map(s => (
                        <div
                          key={s.id}
                          onClick={() => setPostStatus(s.id)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                            postStatus === s.id
                              ? 'bg-violet-50 border-violet-400 ring-2 ring-violet-500/20'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="font-bold text-xs text-slate-900 mb-0.5">{s.label}</div>
                          <div className="text-[11px] text-slate-500 leading-tight">{s.desc}</div>
                        </div>
                      ))}
                    </div>

                    {postStatus === 'Scheduled' && (
                      <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
                          Publish Date & Time (IST):
                        </label>
                        <input
                          type="datetime-local"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                        />
                        <span className="text-[11px] text-slate-500 italic">
                          (Timezone: Asia/Kolkata)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* SEO Metadata Override */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      SEO & Social Metadata
                    </label>

                    {/* SEO Title */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-600">Custom SEO Title</label>
                        <span className="text-[10px] text-slate-400">{(seoTitle || postTitle).length} chars</span>
                      </div>
                      <input
                        type="text"
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        placeholder={postTitle || 'Defaults to Article Title | InfronixWeb'}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                      />
                    </div>

                    {/* SEO Description */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-600">Custom Meta Description</label>
                        <span className="text-[10px] text-slate-400">{(seoDescription || postExcerpt).length} chars</span>
                      </div>
                      <textarea
                        rows={2}
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        placeholder={postExcerpt || 'Defaults to article excerpt'}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                      />
                    </div>

                    {/* Canonical URL */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Canonical URL Override</label>
                      <input
                        type="text"
                        value={canonicalUrl}
                        onChange={(e) => setCanonicalUrl(e.target.value)}
                        placeholder={`https://www.infronixweb.in/blog/${postSlug || 'slug'}`}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                      />
                    </div>

                    {/* Google Search Snippet Preview */}
                    <div className="pt-4 border-t border-slate-200">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                        Google Search Preview
                      </span>
                      <div className="p-3 bg-white border border-slate-200 rounded-xl max-w-lg space-y-1">
                        <div className="text-[11px] text-emerald-800 font-mono">
                          https://www.infronixweb.in › blog › {postSlug || 'article-slug'}
                        </div>
                        <div className="text-sm font-bold text-blue-800 hover:underline line-clamp-1">
                          {seoTitle || postTitle || 'Article Title'} | InfronixWeb
                        </div>
                        <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {seoDescription || postExcerpt || 'Article summary description snippet in Google search results.'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Controls */}
            <div className="px-5 py-4 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 bg-white shrink-0">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowEditor(false)}
                  disabled={actionLoading}
                  className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>

                {editingPost && (
                  <button
                    type="button"
                    onClick={() => handleOpenPreview(editingPost.id)}
                    className="w-full sm:w-auto px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Eye size={15} />
                    <span>Preview</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {postStatus !== 'Published' && (
                  <button
                    type="button"
                    onClick={() => handleSavePost('Draft')}
                    disabled={actionLoading}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 rounded-xl text-xs font-bold cursor-pointer transition-all disabled:opacity-50"
                  >
                    Save as Draft
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleSavePost(postStatus === 'Draft' ? 'Published' : postStatus)}
                  disabled={actionLoading}
                  className={`flex-1 sm:flex-initial px-5 py-2 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 ${
                    postStatus === 'Scheduled'
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                  }`}
                >
                  {actionLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : postStatus === 'Scheduled' ? (
                    <Clock size={15} weight="bold" />
                  ) : (
                    <CheckCircle size={15} weight="bold" />
                  )}
                  <span>
                    {postStatus === 'Scheduled' 
                      ? 'Schedule Article' 
                      : postStatus === 'Published' 
                      ? 'Update Published Post' 
                      : 'Publish to Website'}
                  </span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {showCategoryModal && (
        <CategoryModal
          isOpen={showCategoryModal}
          category={editingCategory}
          onClose={() => setShowCategoryModal(false)}
          onSaved={() => { setShowCategoryModal(false); fetchData(); }}
        />
      )}

      {/* TAG MODAL */}
      {showTagModal && (
        <TagModal
          isOpen={showTagModal}
          tag={editingTag}
          onClose={() => setShowTagModal(false)}
          onSaved={() => { setShowTagModal(false); fetchData(); }}
        />
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title={deleteConfirm.isPublished ? "Delete Published Article?" : "Delete Article?"}
        message={
          deleteConfirm.isPublished
            ? `Warning: "${deleteConfirm.title}" is currently live on the website. Deleting it will permanently remove it from public search and URLs.`
            : `Are you sure you want to permanently delete "${deleteConfirm.title}"? This action cannot be undone.`
        }
        confirmLabel="Permanently Delete"
        isDestructive={true}
        loading={actionLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null, title: '', isPublished: false })}
      />
    </div>
  );
}

// Sub-component: Category Create/Edit Modal
function CategoryModal({ isOpen, category, onClose, onSaved }) {
  const { showToast } = useToast();
  const [name, setName] = useState(category?.name || '');
  const [slug, setSlug] = useState(category?.slug || '');
  const [description, setDescription] = useState(category?.description || '');
  const [displayOrder, setDisplayOrder] = useState(category?.display_order || 0);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Category name is required', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim() || generateSlug(name),
        description: description.trim(),
        display_order: parseInt(displayOrder || 0, 10)
      };

      const url = category ? `/api/founder-os/blogs/categories/${category.id}` : '/api/founder-os/blogs/categories';
      const res = await fetch(url, {
        method: category ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showToast(category ? 'Category updated' : 'Category created', 'success');
        onSaved();
      } else {
        showToast(data.error || 'Failed to save category', 'error');
      }
    } catch (err) {
      showToast('Error saving category', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">
            {category ? 'Edit Category' : 'New Category'}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!category) setSlug(generateSlug(e.target.value));
              }}
              placeholder="e.g. Local SEO"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-violet-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(generateSlug(e.target.value))}
              placeholder="local-seo"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-violet-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this topic category..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-violet-600"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              {loading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Sub-component: Tag Create/Edit Modal
function TagModal({ isOpen, tag, onClose, onSaved }) {
  const { showToast } = useToast();
  const [name, setName] = useState(tag?.name || '');
  const [slug, setSlug] = useState(tag?.slug || '');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Tag name is required', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim() || generateSlug(name)
      };

      const url = tag ? `/api/founder-os/blogs/tags/${tag.id}` : '/api/founder-os/blogs/tags';
      const res = await fetch(url, {
        method: tag ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showToast(tag ? 'Tag updated' : 'Tag created', 'success');
        onSaved();
      } else {
        showToast(data.error || 'Failed to save tag', 'error');
      }
    } catch (err) {
      showToast('Error saving tag', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">
            {tag ? 'Edit Tag' : 'New Tag'}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Tag Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!tag) setSlug(generateSlug(e.target.value));
              }}
              placeholder="e.g. NextJS"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-violet-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(generateSlug(e.target.value))}
              placeholder="nextjs"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-violet-600"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              {loading ? 'Saving...' : tag ? 'Update Tag' : 'Create Tag'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
