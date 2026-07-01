"use client";

import React, { useState, useEffect } from "react";
import { 
  Cake, 
  Search, 
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

interface ProductImage {
  url: string;
  altText: string;
  sortOrder: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface DietaryTag {
  id: string;
  label: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortTag: string | null;
  categoryId: string;
  price: string;
  images: ProductImage[];
  dietaryTags: DietaryTag[];
  ingredients: string[];
  allergens: string[];
  shelfLifeDays: number;
  isFeatured: boolean;
  isActive: boolean;
  stockStatus: string;
  category: Category;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dietaryTags, setDietaryTags] = useState<DietaryTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formShortTag, setFormShortTag] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formShelfLife, setFormShelfLife] = useState(3);
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsActive, setFormIsActive] = useState(true);
  const [formStockStatus, setFormStockStatus] = useState("IN_STOCK");
  
  // Array field states (comma-separated strings)
  const [formIngredients, setFormIngredients] = useState("");
  const [formAllergens, setFormAllergens] = useState("");
  const [formImagesText, setFormImagesText] = useState(""); // URL per line or comma-separated
  const [formSelectedDietary, setFormSelectedDietary] = useState<string[]>([]);

  const fetchFiltersAndData = async () => {
    try {
      // Fetch categories
      const catRes = await fetch("/api/categories");
      const catJson = await catRes.json();
      if (catRes.ok && catJson.success) {
        setCategories(catJson.data);
      }

      // Fetch all dietary tags
      // For simplicity, we can define the standard ones or fetch them. Since we seeded 4, let's hardcode them or deduce.
      setDietaryTags([
        { id: "gf", label: "Gluten-Free" },
        { id: "vegan", label: "Vegan" },
        { id: "nf", label: "Nut-Free" },
        { id: "df", label: "Dairy-Free" }
      ]);
    } catch (err) {
      console.error("Error loading filters:", err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/admin/products?categoryId=${categoryFilter}&page=${page}&limit=10`;
      const res = await fetch(url);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to load products.");
      }

      setProducts(json.data.products);
      setTotalPages(json.data.pagination.totalPages);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiltersAndData();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, page]);

  // Auto-generate slug from name
  useEffect(() => {
    if (!editingProduct && formName) {
      const slugified = formName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormSlug(slugified);
    }
  }, [formName, editingProduct]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormSlug("");
    setFormDescription("");
    setFormShortTag("");
    setFormCategoryId(categories[0]?.id || "");
    setFormPrice("");
    setFormShelfLife(3);
    setFormIsFeatured(false);
    setFormIsActive(true);
    setFormStockStatus("IN_STOCK");
    setFormIngredients("");
    setFormAllergens("");
    setFormImagesText("");
    setFormSelectedDietary([]);
    setIsModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormSlug(prod.slug);
    setFormDescription(prod.description);
    setFormShortTag(prod.shortTag || "");
    setFormCategoryId(prod.categoryId);
    setFormPrice(Number(prod.price).toString());
    setFormShelfLife(prod.shelfLifeDays);
    setFormIsFeatured(prod.isFeatured);
    setFormIsActive(prod.isActive);
    setFormStockStatus(prod.stockStatus);
    setFormIngredients(prod.ingredients.join(", "));
    setFormAllergens(prod.allergens.join(", "));
    setFormImagesText(prod.images.map(img => img.url).join("\n"));
    
    // Set selected dietary tags
    // The seeded items might have tags matching by label or ID. Let's map by label.
    setFormSelectedDietary(prod.dietaryTags.map(tag => tag.id));
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 1. Process images
      const imgLines = formImagesText.split("\n").map(l => l.trim()).filter(Boolean);
      const imagesData = imgLines.map((url, index) => ({
        url,
        altText: `${formName} Image ${index + 1}`,
        sortOrder: index,
      }));

      if (imagesData.length === 0) {
        // Provide a default fallback image
        imagesData.push({
          url: "/images/chocolate_tart.png",
          altText: formName,
          sortOrder: 0,
        });
      }

      // 2. Parse ingredients and allergens
      const ingredients = formIngredients.split(",").map(i => i.trim()).filter(Boolean);
      const allergens = formAllergens.split(",").map(a => a.trim()).filter(Boolean);

      const payload = {
        name: formName,
        slug: formSlug,
        description: formDescription,
        shortTag: formShortTag || null,
        categoryId: formCategoryId,
        price: parseFloat(formPrice),
        images: imagesData,
        dietaryTags: formSelectedDietary,
        ingredients,
        allergens,
        shelfLifeDays: formShelfLife,
        isFeatured: formIsFeatured,
        isActive: formIsActive,
        stockStatus: formStockStatus,
      };

      const url = editingProduct 
        ? `/api/admin/products/${editingProduct.id}`
        : "/api/admin/products";
      
      const method = editingProduct ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        alert(json.error?.message || "Error submitting product.");
      } else {
        setIsModalOpen(false);
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
      alert("Network error submitting form.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you absolutely sure you want to delete this bakery item?")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        alert(json.error?.message || "Failed to delete item.");
      } else {
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
      alert("Network error deleting item.");
    }
  };

  const toggleDietarySelect = (tagId: string) => {
    if (formSelectedDietary.includes(tagId)) {
      setFormSelectedDietary(formSelectedDietary.filter(id => id !== tagId));
    } else {
      setFormSelectedDietary([...formSelectedDietary, tagId]);
    }
  };

  const filteredProducts = products.filter(prod => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      prod.name.toLowerCase().includes(query) ||
      prod.slug.toLowerCase().includes(query) ||
      prod.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Bakery Items Catalog</h2>
          <p className="text-sm text-slate-500">Manage all display menu products, stock levels, and recipes.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openAddModal}
            className="bg-[#A77146] hover:bg-[#8B5D39] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#A77146]/10 transition-colors"
          >
            <Plus size={16} />
            Add New Item
          </button>
        </div>
      </div>

      {/* ── FILTERS BAR ── */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search by product name, description, slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs pl-9 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77146] focus:border-[#A77146] transition-colors"
          />
        </div>

        {/* Category Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="bg-white border border-slate-200 text-slate-700 text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77146] focus:border-[#A77146] cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

      </div>

      {/* ── PRODUCTS TABLE ── */}
      {loading ? (
        <div className="bg-white border border-slate-200/80 rounded-xl p-12 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 size={28} className="animate-spin text-[#A77146]" />
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Loading catalog list...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 p-5 rounded-xl text-center">
          <p className="text-sm font-semibold">{error}</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-xl p-12 text-center space-y-2">
          <p className="text-sm font-bold text-slate-700">No Items Found</p>
          <p className="text-xs text-slate-400">Add a product or change your search filter to begin.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Stock Status</th>
                  <th className="px-5 py-3">Shelf Life</th>
                  <th className="px-5 py-3">Fulfillment Active</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Thumbnail & Name */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-150 overflow-hidden shrink-0">
                          <img
                            src={prod.images[0]?.url || "/images/chocolate_tart.png"}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{prod.name}</p>
                          <p className="text-[10px] text-slate-400 font-normal mt-0.5">{prod.slug}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-3 font-semibold text-slate-600">{prod.category?.name}</td>

                    {/* Price */}
                    <td className="px-5 py-3 font-bold text-slate-800">${Number(prod.price).toFixed(2)}</td>

                    {/* Stock status */}
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase
                        ${prod.stockStatus === "IN_STOCK" 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : prod.stockStatus === "LOW_STOCK" 
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : "bg-red-50 text-red-700 border-red-100"
                        }
                      `}>
                        {prod.stockStatus.replace("_", " ")}
                      </span>
                    </td>

                    {/* Shelf life */}
                    <td className="px-5 py-3 text-slate-500 font-normal">{prod.shelfLifeDays} days</td>

                    {/* Active Toggle */}
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase
                        ${prod.isActive ? "text-emerald-600" : "text-slate-400"}
                      `}>
                        {prod.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                        {prod.isActive ? "Visible" : "Hidden"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex gap-1.5">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                          title="Edit Product"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer border border-transparent hover:border-red-100"
                          title="Delete Product"
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 flex items-center justify-between">
              <span className="text-slate-500 font-semibold text-xs">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="!py-2 !px-4 text-[11px] font-semibold uppercase tracking-wider"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="!py-2 !px-4 text-[11px] font-semibold uppercase tracking-wider"
                >
                  Next
                </Button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ── ADD/EDIT MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="font-bold text-slate-950 text-base flex items-center gap-2">
                <Cake className="text-[#A77146]" size={18} />
                {editingProduct ? `Edit ${editingProduct.name}` : "Add New Bakery Item"}
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
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77146] focus:border-[#A77146]"
                    placeholder="e.g. Madagascar Vanilla Tart"
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
                    placeholder="e.g. madagascar-vanilla-tart"
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
                  placeholder="Enter full descriptive product specifications..."
                />
              </div>

              {/* Row 2: Category, Price, Shelf Life, Tag */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Category</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77146] focus:border-[#A77146]"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
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
                    placeholder="12.00"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Shelf Life (Days)</label>
                  <input
                    type="number"
                    required
                    value={formShelfLife}
                    onChange={(e) => setFormShelfLife(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77146] focus:border-[#A77146]"
                    placeholder="3"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Tag (Optional)</label>
                  <input
                    type="text"
                    value={formShortTag}
                    onChange={(e) => setFormShortTag(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77146] focus:border-[#A77146]"
                    placeholder="Best Seller, New"
                  />
                </div>

              </div>

              {/* Image URLs text area */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Product Image URLs (One URL per line)</label>
                <textarea
                  value={formImagesText}
                  onChange={(e) => setFormImagesText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[11px] px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77146] focus:border-[#A77146] h-20"
                  placeholder="https://images.unsplash.com/photo-...\nhttps://..."
                />
              </div>

              {/* Row 3: Dietary tags multi select */}
              <div className="space-y-2">
                <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">Dietary Restrictions</label>
                <div className="flex flex-wrap gap-2">
                  {dietaryTags.map(tag => {
                    const isSelected = formSelectedDietary.includes(tag.id) || formSelectedDietary.includes(tag.label);
                    return (
                      <button
                        type="button"
                        key={tag.id}
                        onClick={() => toggleDietarySelect(tag.id)}
                        className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer
                          ${isSelected 
                            ? "bg-[#A77146]/10 text-[#A77146] border-[#A77146]/35" 
                            : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                          }
                        `}
                      >
                        {tag.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 4: Ingredients, Allergens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Ingredients (Comma separated)</label>
                  <input
                    type="text"
                    value={formIngredients}
                    onChange={(e) => setFormIngredients(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77146] focus:border-[#A77146]"
                    placeholder="Flour, Butter, Sugar, Vanilla"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Allergens (Comma separated)</label>
                  <input
                    type="text"
                    value={formAllergens}
                    onChange={(e) => setFormAllergens(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77146] focus:border-[#A77146]"
                    placeholder="Wheat, Eggs, Dairy"
                  />
                </div>
              </div>

              {/* Row 5: Flags (Featured, Active, Stock Status) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 border border-slate-100 p-4 rounded-xl items-center">
                
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id="formIsFeatured"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-[#A77146] focus:ring-[#A77146] border-slate-300 rounded cursor-pointer"
                  />
                  <label htmlFor="formIsFeatured" className="font-bold text-slate-700 cursor-pointer">
                    Feature on Homepage
                  </label>
                </div>

                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id="formIsActive"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="w-4 h-4 text-[#A77146] focus:ring-[#A77146] border-slate-300 rounded cursor-pointer"
                  />
                  <label htmlFor="formIsActive" className="font-bold text-slate-700 cursor-pointer">
                    Visible to Customers
                  </label>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[9px] block">Stock Status</label>
                  <select
                    value={formStockStatus}
                    onChange={(e) => setFormStockStatus(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77146] focus:border-[#A77146]"
                  >
                    <option value="IN_STOCK">IN STOCK</option>
                    <option value="LOW_STOCK">LOW STOCK</option>
                    <option value="OUT_OF_STOCK">OUT OF STOCK</option>
                  </select>
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
                  {editingProduct ? "Save Changes" : "Create Item"}
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
