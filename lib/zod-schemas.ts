import { z } from "zod";

// ── PUBLIC SCHEMAS ──

export const contactSubmissionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Please choose a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const orderItemInputSchema = z.object({
  productId: z.string().optional().nullable(),
  tastingBoxId: z.string().optional().nullable(),
  name: z.string().min(1, "Item name snapshot is required"),
  unitPrice: z.number().positive("Price must be greater than zero"),
  quantity: z.number().int().positive("Quantity must be at least 1"),
});

export const orderCreationSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  customerPhone: z.string().min(10, "Phone number must be at least 10 characters"),
  deliveryAddress: z.string().min(10, "Please enter your full delivery address in New York"),
  deliveryNotes: z.string().optional().nullable(),
  isGift: z.boolean().default(false),
  giftMessage: z.string().optional().nullable(),
  deliveryDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid delivery date format",
  }),
  deliveryWindow: z.string().min(1, "Please choose a delivery time slot"),
  items: z.array(orderItemInputSchema).min(1, "Cart must contain at least one item"),
  promoCode: z.string().optional().nullable(),
});

// ── ADMIN SCHEMAS ──

export const adminLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const productImageSchema = z.object({
  url: z.string().url("Must be a valid image URL"),
  altText: z.string().min(1, "Alt text is required"),
  sortOrder: z.number().int().default(0),
});

export const productInputSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().min(10, "Description is required"),
  shortTag: z.string().optional().nullable(),
  categoryId: z.string().min(1, "Category is required"),
  price: z.number().positive("Price must be positive"),
  images: z.array(productImageSchema).min(1, "At least one image is required"),
  dietaryTags: z.array(z.string()).default([]), // Array of DietaryTag IDs or labels
  ingredients: z.array(z.string()).default([]),
  allergens: z.array(z.string()).default([]),
  shelfLifeDays: z.number().int().default(3),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  stockStatus: z.enum(["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"]).default("IN_STOCK"),
});

export const tastingBoxItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  thumbnailUrl: z.string().url("Must be a valid thumbnail URL"),
  isSwappable: z.boolean().default(false),
});

export const tastingBoxInputSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().min(10, "Description is required"),
  itemCount: z.number().int().positive("Item count must be positive"),
  price: z.number().positive("Price must be positive"),
  heroImageUrl: z.string().url("Must be a valid image URL"),
  contents: z.array(tastingBoxItemSchema).min(1, "Box must have items"),
  isActive: z.boolean().default(true),
});

export const blogPostInputSchema = z.object({
  title: z.string().min(5, "Title is required"),
  slug: z.string().min(2, "Slug is required"),
  excerpt: z.string().min(10, "Excerpt is required"),
  bodyHtml: z.string().min(50, "Full HTML article content is required"),
  category: z.enum(["Technique", "Ingredients", "Behind the Scenes", "Seasonal"]),
  heroImageUrl: z.string().url("Must be a valid image URL"),
  authorName: z.string().min(2, "Author name is required"),
  authorAvatarUrl: z.string().url("Must be a valid author avatar URL"),
  readTimeMins: z.number().int().positive("Read time is required"),
  isFeatured: z.boolean().default(false),
});
