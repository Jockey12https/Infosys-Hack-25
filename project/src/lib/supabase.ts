import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.log('VITE_SUPABASE_URL:', supabaseUrl);
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
});

// Types
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  user_type: 'traveler' | 'guide' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Guide {
  id: string;
  user_id: string;
  village: string;
  district: string;
  state: string;
  pincode: string;
  specialties: string[];
  languages: string[];
  gender?: string;
  years_experience?: string;
  description?: string;
  hourly_rate: number;
  availability: string[];
  is_verified: boolean;
  is_active: boolean;
  rating: number;
  total_reviews: number;
  total_bookings: number;
  gallery_images: string[];
  certifications: string[];
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export interface Booking {
  id: string;
  traveler_id: string;
  guide_id: string;
  booking_date: string;
  booking_time: string;
  duration_hours: number;
  number_of_guests: number;
  experience_type?: string;
  special_requests?: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  guides?: Guide;
  profiles?: Profile;
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet';
  provider?: string;
  last_four?: string;
  upi_id?: string;
  is_default: boolean;
  is_verified: boolean;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  booking_id?: string;
  payer_id: string;
  payee_id: string;
  payment_method_id?: string;
  amount: number;
  currency: string;
  type: 'booking_payment' | 'refund' | 'payout' | 'fee';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  gateway?: string;
  gateway_transaction_id?: string;
  gateway_response: any;
  description?: string;
  fees: number;
  net_amount?: number;
  processed_at?: string;
  created_at: string;
  updated_at: string;
  bookings?: Booking;
  payer?: Profile;
  payee?: Profile;
  payment_methods?: PaymentMethod;
}

export interface MerchantAccount {
  id: string;
  guide_id: string;
  account_type: 'bank_account' | 'upi' | 'wallet';
  bank_name?: string;
  account_number?: string;
  ifsc_code?: string;
  account_holder_name?: string;
  upi_id?: string;
  is_verified: boolean;
  verification_status: 'pending' | 'verified' | 'rejected';
  verification_documents: any[];
  created_at: string;
  updated_at: string;
  guides?: Guide;
}

export interface Payout {
  id: string;
  guide_id: string;
  merchant_account_id?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payout_date?: string;
  gateway_payout_id?: string;
  gateway_response: any;
  transaction_ids: string[];
  created_at: string;
  updated_at: string;
  guides?: Guide;
  merchant_accounts?: MerchantAccount;
}

export interface CommunityGroup {
  id: string;
  name: string;
  description?: string;
  cover_image?: string;
  group_type: 'public' | 'private';
  category: 'general' | 'region' | 'activity' | 'travel_tips' | 'photography' | 'culture';
  location?: string;
  created_by: string;
  member_count: number;
  post_count: number;
  is_active: boolean;
  rules: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  is_member?: boolean;
  user_role?: 'admin' | 'moderator' | 'member';
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'member';
  joined_at: string;
  is_active: boolean;
  profiles?: Profile;
}

export interface GroupPost {
  id: string;
  group_id: string;
  author_id: string;
  title?: string;
  content: string;
  post_type: 'text' | 'photo' | 'experience' | 'question' | 'tip';
  images: string[];
  location?: string;
  tags: string[];
  like_count: number;
  comment_count: number;
  is_pinned: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  community_groups?: CommunityGroup;
  user_liked?: boolean;
}

export interface PostComment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  parent_comment_id?: string;
  like_count: number;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  user_liked?: boolean;
  replies?: PostComment[];
}

export interface PostLike {
  id: string;
  user_id: string;
  post_id?: string;
  comment_id?: string;
  created_at: string;
}