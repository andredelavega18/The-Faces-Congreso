/**
 * Common type definitions for The Faces 2026
 */

// ============================================
// Base Types
// ============================================

export type ID = string | number;

export interface BaseEntity {
    id: ID;
    createdAt: Date | string;
    updatedAt: Date | string;
}

// ============================================
// User Types
// ============================================

export interface User extends BaseEntity {
    email: string;
    name: string;
    avatarUrl?: string;
    role: UserRole;
}

export type UserRole = 'admin' | 'moderator' | 'user';

// ============================================
// Event Types
// ============================================

export interface Event extends BaseEntity {
    title: string;
    description: string;
    date: Date | string;
    location: string;
    imageUrl?: string;
    capacity: number;
    registeredCount: number;
    status: EventStatus;
}

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';

// ============================================
// Registration Types
// ============================================

export interface Registration extends BaseEntity {
    userId: ID;
    eventId: ID;
    status: RegistrationStatus;
    paymentStatus: PaymentStatus;
    ticketType: TicketType;
    amount: number;
}

export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type TicketType = 'general' | 'vip' | 'student';

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}

export interface ApiError {
    error: string;
    code: string;
    statusCode: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// ============================================
// Form Types
// ============================================

export interface FormState {
    isLoading: boolean;
    isSubmitting: boolean;
    error: string | null;
    success: boolean;
}

// ============================================
// Component Props Types
// ============================================

export interface BaseComponentProps {
    className?: string;
    children?: React.ReactNode;
}

export interface WithId {
    id: ID;
}
