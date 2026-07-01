import { Product, TastingBox, BlogPost, Review } from "./mock-data";

// Helper to map DB Product to Frontend Product type
function mapProduct(p: any): Product {
  // Calculate average rating
  const reviewsList = p.reviews || [];
  const avgRating = reviewsList.length > 0
    ? Number((reviewsList.reduce((acc: number, r: any) => acc + r.rating, 0) / reviewsList.length).toFixed(1))
    : 4.8; // default to 4.8 for realism

  const mappedReviews: Review[] = reviewsList.map((r: any) => ({
    id: r.id,
    name: r.authorName,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
    rating: r.rating,
    date: new Date(r.createdAt).toISOString().split("T")[0],
    comment: r.comment,
    verified: r.isVerified,
  }));

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    category: (p.category?.name || "Pastries") as any,
    description: p.description,
    longDescription: p.description, // Mapped to single description field
    images: (p.images || []).map((img: any) => img.url),
    dietary: (p.dietaryTags || []).map((t: any) => t.label) as any,
    ingredients: p.ingredients || [],
    allergens: p.allergens || [],
    storage: "Keep refrigerated. Best consumed within 3 days.",
    rating: avgRating,
    reviews: mappedReviews,
  };
}

// Helper to map DB TastingBox to Frontend TastingBox type
function mapTastingBox(b: any): TastingBox {
  return {
    id: b.id,
    name: b.name,
    slug: b.slug,
    price: Number(b.price),
    description: b.description,
    longDescription: b.description,
    image: b.heroImageUrl,
    itemCount: b.itemCount,
    contents: (b.contents || []).map((item: any) => ({
      name: item.name,
      qty: 1, // default quantity count
      slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    })),
    customizableItems: (b.contents || [])
      .filter((item: any) => item.isSwappable)
      .map((item: any) => ({
        originalName: item.name,
        options: ["Almond Laminated Croissant", "Classic Butter Croissant", "Matcha Sesame Choux", "Dark Chocolate Sourdough Pastry"],
      })),
  };
}

// Helper to map DB BlogPost to Frontend BlogPost type
function mapBlogPost(post: any): BlogPost {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    category: post.category as any,
    excerpt: post.excerpt,
    content: post.bodyHtml,
    author: {
      name: post.authorName,
      role: "Pastry Specialist",
      avatar: post.authorAvatarUrl,
    },
    date: new Date(post.publishedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    readTime: `${post.readTimeMins} min read`,
    image: post.heroImageUrl,
  };
}

// ── EXPORTED FETCH FUNCTIONS ──

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch("/api/products?limit=100");
    const json = await res.json();
    if (!res.ok || !json.success) return [];
    return (json.data.products || []).map(mapProduct);
  } catch (error) {
    console.error("API error getProducts:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`/api/products/${slug}`);
    const json = await res.json();
    if (!res.ok || !json.success) return null;
    return mapProduct(json.data);
  } catch (error) {
    console.error("API error getProductBySlug:", error);
    return null;
  }
}

export async function getRelatedProducts(category: string, currentProductId: string, limit = 3): Promise<Product[]> {
  try {
    const products = await getProducts();
    return products
      .filter((p) => p.category === category && p.id !== currentProductId)
      .slice(0, limit);
  } catch (error) {
    console.error("API error getRelatedProducts:", error);
    return [];
  }
}

export async function getTastingBoxes(): Promise<TastingBox[]> {
  try {
    const res = await fetch("/api/tasting-boxes");
    const json = await res.json();
    if (!res.ok || !json.success) return [];
    return (json.data || []).map(mapTastingBox);
  } catch (error) {
    console.error("API error getTastingBoxes:", error);
    return [];
  }
}

export async function getTastingBoxBySlug(slug: string): Promise<TastingBox | null> {
  try {
    const res = await fetch(`/api/tasting-boxes/${slug}`);
    const json = await res.json();
    if (!res.ok || !json.success) return null;
    return mapTastingBox(json.data);
  } catch (error) {
    console.error("API error getTastingBoxBySlug:", error);
    return null;
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch("/api/blog?limit=20");
    const json = await res.json();
    if (!res.ok || !json.success) return [];
    return (json.data.posts || []).map(mapBlogPost);
  } catch (error) {
    console.error("API error getBlogPosts:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`/api/blog/${slug}`);
    const json = await res.json();
    if (!res.ok || !json.success) return null;
    return mapBlogPost(json.data);
  } catch (error) {
    console.error("API error getBlogPostBySlug:", error);
    return null;
  }
}

export async function submitContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      return { success: false, message: json.error?.message || "Submission failed." };
    }
    return { success: true, message: "Thank you for your message. We will respond shortly." };
  } catch (error) {
    console.error("API error submitContactForm:", error);
    return { success: false, message: "Network error submitting contact details." };
  }
}

export async function submitNewsletterForm(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      return { success: false, message: json.error?.message || "Subscription failed." };
    }
    return { success: true, message: "Successfully subscribed to the Journal." };
  } catch (error) {
    console.error("API error submitNewsletterForm:", error);
    return { success: false, message: "Network error joining list." };
  }
}

export interface OrderInput {
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    customizedOptions?: Record<string, string>;
  }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  deliveryDate: string;
  deliveryTimeSlot: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryNotes?: string;
  giftMessage?: string;
  paymentDetails: {
    cardNumber: string;
    expiryDate: string;
    cvc: string;
  };
}

export async function createOrder(order: OrderInput): Promise<{ success: boolean; orderId: string }> {
  try {
    // Map frontend order input to backend schema
    const payload = {
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      deliveryAddress: order.customerAddress,
      deliveryNotes: order.deliveryNotes || null,
      isGift: !!order.giftMessage,
      giftMessage: order.giftMessage || null,
      deliveryDate: new Date(order.deliveryDate).toISOString().split("T")[0],
      deliveryWindow: order.deliveryTimeSlot,
      promoCode: order.discount > 0 ? "KINGS10" : null, // deduce if promo code was applied
      items: order.items.map((item) => {
        const isBox = item.productId.startsWith("b"); // tasting box ids start with 'b'
        return {
          productId: isBox ? null : item.productId,
          tastingBoxId: isBox ? item.productId : null,
          name: item.productName,
          unitPrice: item.price,
          quantity: item.quantity,
        };
      }),
    };

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || "Order checkout failed.");
    }

    return { success: true, orderId: json.data.orderNumber };
  } catch (error: any) {
    console.error("API error createOrder:", error);
    return { success: false, orderId: "" };
  }
}
