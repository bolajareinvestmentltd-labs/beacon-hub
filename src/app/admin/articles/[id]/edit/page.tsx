"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type ArticlePayload = {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  coverImage: string | null;
};

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params?.id;

  const [article, setArticle] = useState<ArticlePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [coverImage, setCoverImage] = useState("");

  useEffect(() => {
    if (!articleId) return;

    async function loadArticle() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/admin/articles/${articleId}`, {
          credentials: "same-origin",
        });

        if (!response.ok) {
          throw new Error("Could not retrieve article details.");
        }

        const payload = await response.json();
        setArticle(payload.article);
        setTitle(payload.article.title || "");
        setCategory(payload.article.category || "");
        setExcerpt(payload.article.excerpt || "");
        setContent(payload.article.content || "");
        setAuthor(payload.article.author || "Beacon-Hub Intelligence");
        setCoverImage(payload.article.coverImage || "");
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Unable to load article.");
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [articleId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    if (!articleId) {
      setError("Article ID is not available.");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(`/api/admin/articles/${articleId}`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          category,
          excerpt,
          content,
          author,
          coverImage,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || "Failed to save changes.");
      }

      setSuccess(result.message || "Article updated successfully.");
      setTimeout(() => router.push("/admin"), 1200);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not update article.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4EFEA] px-4 py-12">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-xl border border-black/5">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-[#1A1A1A]">Edit Published Article</h1>
          <p className="mt-2 text-sm text-[#4A4A4A]">
            Update title, category, excerpt, content, author, or cover image for this article.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-sm text-slate-600">
            Loading article details...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        ) : article ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.32em] text-slate-500 mb-2">Headline</label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#E2725B] focus:ring-1 focus:ring-[#E2725B]"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.32em] text-slate-500 mb-2">Category</label>
                <input
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#E2725B] focus:ring-1 focus:ring-[#E2725B]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.32em] text-slate-500 mb-2">Author</label>
                <input
                  value={author}
                  onChange={(event) => setAuthor(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#E2725B] focus:ring-1 focus:ring-[#E2725B]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.32em] text-slate-500 mb-2">Excerpt</label>
              <textarea
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#E2725B] focus:ring-1 focus:ring-[#E2725B]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.32em] text-slate-500 mb-2">Full Briefing</label>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                rows={10}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#E2725B] focus:ring-1 focus:ring-[#E2725B]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.32em] text-slate-500 mb-2">Cover Image URL</label>
              <input
                value={coverImage ?? ""}
                onChange={(event) => setCoverImage(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#E2725B] focus:ring-1 focus:ring-[#E2725B]"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {success && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{success}</div>
            )}
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <a href="/admin" className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                Back to admin
              </a>
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-black px-6 py-3 text-sm font-bold uppercase tracking-[0.24em] text-white transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        ) : (
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-12 text-sm text-orange-700">
            Article could not be found or you are not authorized to edit it.
          </div>
        )}
      </div>
    </div>
  );
}
