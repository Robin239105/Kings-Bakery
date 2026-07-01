"use client";

import React, { useState, useEffect } from "react";
import { 
  Box, 
  Plus, 
  Edit, 
  Trash2, 
  Loader2, 
  X, 
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react";
import Button from "@/components/ui/Button";

interface TastingBoxItem {
  id?: string;
  name: string;
  thumbnailUrl: string;
  isSwappable: boolean;
}

interface TastingBox {
  id: string;
  name: string;
  slug: string;
  description: string;
  itemCount: number;
  price: string;
  heroImageUrl: string;
  isActive: boolean;
  contents: TastingBoxItem[];
}

export default function AdminTastingBoxesPage() {
  const [boxes, setBoxes] = useState<TastingBox[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBox, setEditingBox] = useState<TastingBox | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formItemCount, setFormItemCount] = useState(6);
  const [formPrice, setFormPrice] = useState("");
  const [formHeroImage, setFormHeroImage] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);
  
  // Nested contents fields (dynamic array list)
  const [formContents, setFormContents] = useState<TastingBoxItem[]>([]);

  const fetchTastingBoxes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/tasting-boxes");
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to load tasting boxes.");
      }

      setBoxes(json.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTastingBoxes();
  }, []);

  // Auto-generate slug from name
  useEffect(() => {
    if (!editingBox && formName) {
      const slugified = formName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormSlug(slugified);
    }
  }, [formName, editingBox]);

  const openAddModal = () => {
    setEditingBox(null);
    setFormName("");
    setFormSlug("");
    setFormDescription("");
    setFormItemCount(6);
    setFormPrice("");
    setFormHeroImage("");
    setFormIsActive(true);
    setFormContents([
      { name: "Vanilla Bean Cupcake", thumbnailUrl: "/images/pastel_macarons.png", isSwappable: false },
      { name: "Almond Butter Croissant", thumbnailUrl: "/images/flaky_croissant.png", isSwappable: true }
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (box: TastingBox) => {
    setEditingBox(box);
    setFormName(box.name);
    setFormSlug(box.slug);
    setFormDescription(box.description);
    setFormItemCount(box.itemCount);
    setFormPrice(Number(box.price).toString());
    setFormHeroImage(box.heroImageUrl);
    setFormIsActive(box.isActive);
    setFormContents(box.contents);
    setIsModalOpen(true);
  };

  const addContentItem = () => {
    setFormContents([...formContents, { name: "", thumbnailUrl: "/images/pastel_macarons.png", isSwappable: false }]);
  };

  const removeContentItem = (index: number) => {
    setFormContents(formContents.filter((_, i) => i !== index));
  };

  const updateContentItem = (index: number, key: keyof TastingBoxItem, value: any) => {
    setFormContents(
      formContents.map((item, i) => i === index ? { ...item, [key]: value } : item)
    );
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        name: formName,
        slug: formSlug,
        description: formDescription,
        itemCount: formItemCount,
        price: parseFloat(formPrice),
        heroImageUrl: formHeroImage || "/images/assorted_tasting_box.png",
        contents: formContents,
        isActive: formIsActive,
      };

      const url = editingBox 
        ? `/api/admin/tasting-boxes/${editingBox.id}`
        : "/api/admin/tasting-boxes";
      
      const method = editingBox ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        alert(json.error?.message || "Error submitting tasting box.");
      } else {
        setIsModalOpen(false);
        fetchTastingBoxes();
      }
    } catch (err) {
      console.error(err);
      alert("Network error submitting form.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you absolutely sure you want to delete this tasting box?")) return;

    try {
      const res = await fetch(`/api/admin/tasting-boxes/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        alert(json.error?.message || "Failed to delete box.");
      } else {
        fetchTastingBoxes();
      }
    } catch (err) {
      console.error(err);
      alert("Network error deleting box.");
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Tasting Boxes Assortment</h2>
          <p className="text-sm text-slate-500">Configure curated bundles, counts, and bundle swappable choices.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#A77146] hover:bg-[#8B5D39] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#A77146]/10 transition-colors"
        >
          <Plus size={16} />
          Add Tasting Box
        </button>
      </div>

      {/* ── LISTINGS TABLE ── */}
      {loading ? (
        <div className="bg-white border border-slate-200/80 rounded-xl p-12 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 size={28} className="animate-spin text-[#A77146]" />
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Loading boxes...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 p-5 rounded-xl text-center">
          <p className="text-sm font-semibold">{error}</p>
        </div>
      ) : boxes.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-xl p-12 text-center space-y-2">
          <p className="text-sm font-bold text-slate-700">No Tasting Boxes Found</p>
          <p className="text-xs text-slate-400">Configure a gift tasting box to begin.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="px-5 py-3">Tasting Box</th>
                  <th className="px-5 py-3">Pieces Count</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Contents Config</th>
                  <th className="px-5 py-3">Visibility</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {boxes.map((box) => (
                  <tr key={box.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Thumbnail & Name */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-150 overflow-hidden shrink-0">
                          <img
                            src={box.heroImageUrl || "/images/assorted_tasting_box.png"}
                            alt={box.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{box.name}</p>
                          <p className="text-[10px] text-slate-400 font-normal mt-0.5">{box.slug}</p>
                        </div>
                      </div>
                    </td>

                    {/* Pieces count */}
                    <td className="px-5 py-3 text-slate-600">{box.itemCount} pieces</td>

                    {/* Price */}
                    <td className="px-5 py-3 font-bold text-slate-800">${Number(box.price).toFixed(2)}</td>

                    {/* Contents count */}
                    <td className="px-5 py-3 text-slate-500 font-normal">
                      {box.contents.length} configured items ({box.contents.filter(i => i.isSwappable).length} swappable)
                    </td>

                    {/* Visibility */}
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase
                        ${box.isActive ? "text-emerald-600" : "text-slate-400"}
                      `}>
                        {box.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                        {box.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex gap-1.5">
                        <button
                          onClick={() => openEditModal(box)}
                          className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                          title="Edit Box"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(box.id)}
                          className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer border border-transparent hover:border-red-100"
                          title="Delete Box"
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

      {/* ── ADD/EDIT MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="font-bold text-slate-950 text-base flex items-center gap-2">
                <Box className="text-[#A77146]" size={18} />
                {editingBox ? `Edit ${editingBox.name}` : "Create Tasting Box"}
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
              
              {/* Row 1: Name, Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Tasting Box Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77146] focus:border-[#A77146]"
                    placeholder="e.g. The Signature Box"
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
                    placeholder="e.g. the-signature-box"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Description</label>
                <textarea
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77146] focus:border-[#A77146] h-20"
                  placeholder="Enter full tasting box description details..."
                />
              </div>

              {/* Row 2: Pieces Count, Price, Hero Image, Visibility */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Pieces Count</label>
                  <input
                    type="number"
                    required
                    value={formItemCount}
                    onChange={(e) => setFormItemCount(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77146] focus:border-[#A77146]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77146] focus:border-[#A77146]"
                    placeholder="45.00"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Hero Image URL</label>
                  <input
                    type="text"
                    value={formHeroImage}
                    onChange={(e) => setFormHeroImage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77146] focus:border-[#A77146]"
                    placeholder="/images/assorted_tasting_box.png"
                  />
                </div>

                <div className="flex items-center gap-2 pb-3.5 px-1">
                  <input
                    type="checkbox"
                    id="formIsActive"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="w-4 h-4 text-[#A77146] focus:ring-[#A77146] border-slate-300 rounded cursor-pointer"
                  />
                  <label htmlFor="formIsActive" className="font-bold text-slate-700 cursor-pointer">
                    Visible to Public
                  </label>
                </div>

              </div>

              {/* Contents Configuration Section */}
              <div className="space-y-3 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">Box Items Selection List</label>
                  <button
                    type="button"
                    onClick={addContentItem}
                    className="text-xs text-[#A77146] hover:text-[#8B5D39] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} /> Add Content Item
                  </button>
                </div>

                <div className="space-y-3 bg-slate-50 border border-slate-150 rounded-xl p-4 max-h-[220px] overflow-y-auto">
                  {formContents.length === 0 ? (
                    <p className="text-slate-400 italic text-center py-4">No content items configured. Click 'Add Content Item' above.</p>
                  ) : (
                    formContents.map((item, index) => (
                      <div key={index} className="flex flex-col md:flex-row md:items-center gap-3 bg-white border border-slate-150 p-3 rounded-lg shadow-sm">
                        
                        <div className="flex-1 space-y-1">
                          <input
                            type="text"
                            required
                            placeholder="Item Name (e.g. Parisian Rose Macaron)"
                            value={item.name}
                            onChange={(e) => updateContentItem(index, "name", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[11px] px-2.5 py-1.5 rounded"
                          />
                        </div>

                        <div className="flex-1 space-y-1">
                          <input
                            type="text"
                            placeholder="Thumbnail Image URL"
                            value={item.thumbnailUrl}
                            onChange={(e) => updateContentItem(index, "thumbnailUrl", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[11px] px-2.5 py-1.5 rounded"
                          />
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <input
                            type="checkbox"
                            id={`swappable-${index}`}
                            checked={item.isSwappable}
                            onChange={(e) => updateContentItem(index, "isSwappable", e.target.checked)}
                            className="w-3.5 h-3.5 text-[#A77146] focus:ring-[#A77146] border-slate-300 rounded cursor-pointer"
                          />
                          <label htmlFor={`swappable-${index}`} className="font-semibold text-slate-600 text-[11px] cursor-pointer">
                            Swappable choice
                          </label>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeContentItem(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>

                      </div>
                    ))
                  )}
                </div>
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
                  {editingBox ? "Save Changes" : "Create Tasting Box"}
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
