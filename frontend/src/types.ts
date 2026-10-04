export interface Category {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  sort_order: number;
  active: number;
}

export interface SareeImage {
  id: number;
  saree_id: number;
  image_url: string;
  is_primary: number;
  sort_order: number;
}

export interface Saree {
  id: number;
  name: string;
  category_id?: number;
  category_name?: string;
  short_description?: string;
  description?: string;
  fabric?: string;
  color?: string;
  design_style?: string;
  occasion?: string;
  weave_details?: string;
  border_details?: string;
  pallu_details?: string;
  featured: number;
  new_arrival: number;
  published: number;
  primary_image?: string;
  images?: SareeImage[];
  created_at?: string;
  updated_at?: string;
}

export interface GalleryItem {
  id: number;
  image_url: string;
  title?: string;
  description?: string;
  sort_order: number;
  published: number;
}

export interface SiteSettings {
  logo?: string;
  hero_title?: string;
  hero_subtitle?: string;
  about_text?: string;
  contact_phone_1?: string;
  contact_phone_1_name?: string;
  contact_phone_2?: string;
  contact_phone_2_name?: string;
  contact_phone_3?: string;
  whatsapp_number?: string;
  address?: string;
  instagram_url?: string;
  maps_url?: string;
}

export interface AdminUser {
  id: number;
  username: string;
  display_name?: string;
  role?: string;
  created_at: string;
}

export interface AdminStats {
  totalSarees: number;
  publishedSarees: number;
  categories: number;
  galleryImages: number;
}
