"use client";

import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Loader2, 
  X, 
  RefreshCw,
  Eye,
  Star
} from "lucide-react";
import Button from "@/components/ui/Button";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  bodyHtml: string;
  category: string;
  heroImageUrl: string;
  authorName: string;
  authorAvatarUrl: string;
  readTimeMins: number;
  isFeatured: boolean;
  publishedAt: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formBodyHtml, setFormBodyHtml] = useState("");
  const [formCategory, setFormCategory] = useState("Technique");
  const [formHeroImage, setFormHeroImage] = useState("");
  const [formAuthorName, setFormAuthorName] = useState("");
  const [formAuthorAvatar, setFormAuthorAvatar] = useState("");
  const [formReadTime, setFormReadTime] = useState(5);
  const [formIsFeatured, setFormIsFeatured] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/blog");
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to load blog posts.");
      }

      setPosts(json.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (!editingPost && formTitle) {
      const slugified = formTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormSlug(slugified);
    }
  }, [formTitle, editingPost]);

  const openAddModal = () => {
    setEditingPost(null);
    setFormTitle("");
    setFormSlug("");
    setFormExcerpt("");
    setFormBodyHtml("");
    setFormCategory("Technique");
    setFormHeroImage("/images/blog_hero_1.png");
    setFormAuthorName("Chef Marcus King");
    setFormAuthorAvatar("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200");
    setFormReadTime(5);
    setFormIsFeatured(false);
    setIsModalOpen(true);
  };

  const openEditModal = (post: BlogPost) => {
    setEditingPost(post);
    setFormTitle(post.title);
    setFormSlug(post.slug);
    setFormExcerpt(post.excerpt);
    setFormBodyHtml(post.bodyHtml);
    setFormCategory(post.category);
    setFormHeroImage(post.heroImageUrl);
    setFormAuthorName(post.authorName);
    setFormAuthorAvatar(post.authorAvatarUrl);
    setFormReadTime(post.readTimeMins);
    setFormIsFeatured(post.isFeatured);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        title: formTitle,
        slug: formSlug,
        excerpt: formExcerpt,
        bodyHtml: formBodyHtml,
        category: formCategory,
        heroImageUrl: formHeroImage,
        authorName: formAuthorName,
        authorAvatarUrl: formAuthorAvatar,
        readTimeMins: formReadTime,
        isFeatured: formIsFeatured,
      };

      const url = editingPost 
        ? `/api/admin/blog/${editingPost.id}`
        : "/api/admin/blog";
      
      const method = editingPost ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        alert(json.error?.message || "Error submitting post.");
      } else {
        setIsModalOpen(false);
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
      alert("Network error submitting form.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you absolutely sure you want to delete this journal post?")) return;

    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        alert(json.error?.message || "Failed to delete post.");
      } else {
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
      alert("Network error deleting post.");
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Journal Editor</h2>
          <p className="text-sm text-slate-500">Compose and edit pastry chemistry studies and baking logs.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#A77146] hover:bg-[#8B5D39] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#A77146]/10 transition-colors"
        >
          <Plus size={16} />
          Write Post
        </button>
      </div>

      {/* ── LISTINGS TABLE ── */}
      {loading ? (
        <div className="bg-white border border-slate-200/80 rounded-xl p-12 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 size={28} className="animate-spin text-[#A77146]" />
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Loading articles...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 p-5 rounded-xl text-center">
          <p className="text-sm font-semibold">{error}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-xl p-12 text-center space-y-2">
          <p className="text-sm font-bold text-slate-700">No Journal Posts Found</p>
          <p className="text-xs text-slate-400">Write an article describing lamination or tempering techniques to begin.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="px-5 py-3">Article Title</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Author</th>
                  <th className="px-5 py-3">Read Time</th>
                  <th className="px-5 py-3">Featured status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Hero & Title */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 rounded bg-slate-50 border border-slate-150 overflow-hidden shrink-0">
                          <img
                            src={post.heroImageUrl || "/images/blog_hero_1.png"}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight line-clamp-1">{post.title}</p>
                          <p className="text-[10px] text-slate-400 font-normal mt-0.5">{post.slug}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-3 text-slate-600 font-semibold">{post.category}</td>

                    {/* Author */}
                    <td className="px-5 py-3 text-slate-600">{post.authorName}</td>

                    {/* Read time */}
                    <td className="px-5 py-3 text-slate-500 font-normal">{post.readTimeMins} mins</td>

                    {/* Featured status */}
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase
                        ${post.isFeatured ? "text-amber-500" : "text-slate-400"}
                      `}>
                        <Star size={12} className={post.isFeatured ? "fill-amber-500 text-amber-500" : ""} />
                        {post.isFeatured ? "Featured" : "Standard"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex gap-1.5">
                        <button
                          onClick={() => openEditModal(post)}
                          className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                          title="Edit Post"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer border border-transparent hover:border-red-100"
                          title="Delete Post"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── WRITE/EDIT MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="font-bold text-slate-950 text-base flex items-center gap-2">
                <BookOpen className="text-[#A77146]" size={18} />
                {editingPost ? `Edit ${editingPost.title}` : "Write Journal Article"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-6 text-xs text-slate-600">
              
              {/* Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Article Title</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77146] focus:border-[#A77146]"
                    placeholder="e.g. The Physics of Lamination"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77146] focus:border-[#A77146]"
                    placeholder="e.g. physics-of-lamination"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Excerpt Summary</label>
                <input
                  type="text"
                  required
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77146] focus:border-[#A77146]"
                  placeholder="Summarize the core focus of the article in one sentence..."
                />
              </div>

              {/* Row 2: Category, Read time, Hero Image */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77146] focus:border-[#A77146]"
                  >
                    <option value="Technique">Technique</option>
                    <option value="Ingredients">Ingredients</option>
                    <option value="Behind the Scenes">Behind the Scenes</option>
                    <option value="Seasonal">Seasonal</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Read Time (Minutes)</label>
                  <input
                    type="number"
                    required
                    value={formReadTime}
                    onChange={(e) => setFormReadTime(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77146] focus:border-[#A77146]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Hero Image URL</label>
                  <input
                    type="text"
                    required
                    value={formHeroImage}
                    onChange={(e) => setFormHeroImage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77146] focus:border-[#A77146]"
                    placeholder="/images/blog_hero_1.png"
                  />
                </div>

              </div>

              {/* Row 3: Author Name, Author Avatar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Author Name</label>
                  <input
                    type="text"
                    required
                    value={formAuthorName}
                    onChange={(e) => setFormAuthorName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77146] focus:border-[#A77146]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Author Avatar URL</label>
                  <input
                    type="text"
                    required
                    value={formAuthorAvatar}
                    onChange={(e) => setFormAuthorAvatar(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77146] focus:border-[#A77146]"
                  />
                </div>
              </div>

              {/* HTML Article Body */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Article Body (HTML/Markdown Format)</label>
                <textarea
                  required
                  value={formBodyHtml}
                  onChange={(e) => setFormBodyHtml(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[11px] font-mono px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77146] focus:border-[#A77146] h-40"
                  placeholder="<h2>Header</h2>\n<p>Describe lamination physics or tempering curve coordinates here...</p>"
                />
              </div>

              {/* Flag Settings */}
              <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 p-4 rounded-xl">
                <input
                  type="checkbox"
                  id="formIsFeatured"
                  checked={formIsFeatured}
                  onChange={(e) => setFormIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-[#A77146] focus:ring-[#A77146] border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="formIsFeatured" className="font-bold text-slate-700 cursor-pointer">
                  Feature on Journal homepage Spotlight header
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="!py-2.5 !px-5 text-xs font-semibold uppercase tracking-wider"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  variant="primary"
                  className="!py-2.5 !px-5 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  {submitting && <Loader2 size={13} className="animate-spin text-white" />}
                  {editingPost ? "Save Changes" : "Publish Post"}
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
