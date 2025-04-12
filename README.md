# Freshmart - Comprehensive E-commerce Platform

## Table of Contents

1. [Introduction](#introduction)
2. [Technology Stack](#technology-stack)
3. [Architecture Overview](#architecture-overview)
4. [Frontend Features](#frontend-features)
5. [Backend Features](#backend-features)
6. [Database Schema](#database-schema)
7. [Authentication System](#authentication-system)
8. [Admin Dashboard](#admin-dashboard)
9. [User Flow](#user-flow)
10. [API Documentation](#api-documentation)
11. [Deployment](#deployment)

## Introduction

Freshmart is a full-featured e-commerce platform specialized for grocery delivery. It provides a seamless shopping experience for users looking for fresh produce and grocery items. The platform implements features like product categorization, shopping cart functionality, user authentication, order management, and an admin dashboard for inventory management.

## Technology Stack

### Frontend

- **Framework**: Next.js 14.2.4
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: TailwindCSS 3.4.1
- **Authentication**: NextAuth.js 4.24.7
- **State Management**: React Context API
- **HTTP Client**: Axios
- **UI Components**:
  - react-hot-toast for notifications
  - @iconify/react for icons
  - AOS for scroll animations
  - next-themes for dark/light mode support
  - react-slick for carousels
  - Framer Motion for animations

### Backend

- **Framework**: ASP.NET Core 9
- **Language**: C#
- **Database ORM**: Entity Framework Core 9.0.4
- **Database**: PostgreSQL (via Npgsql.EntityFrameworkCore.PostgreSQL)
- **Authentication**: JWT (System.IdentityModel.Tokens.Jwt 8.8.0)
- **Identity**: Microsoft.AspNetCore.Identity.EntityFrameworkCore
- **Cloud Storage**: Cloudinary (CloudinaryDotNet 1.27.5)
- **Social Authentication**: Google (Google.Apis.Auth 1.66.0)
- **API Documentation**: Swagger (Swashbuckle.AspNetCore 6.5.0)

## Architecture Overview

### Frontend Architecture

- **App Router Architecture**: Utilizing Next.js 14's App Router for routing
- **TypeScript**: Fully typed components and API interfaces
- **Context API**: Global state management through custom contexts
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Component Structure**:
  - `/app`: Page components and routing
  - `/components`: Reusable UI components
  - `/contexts`: State management contexts
  - `/api`: API client interfaces
  - `/types`: TypeScript type definitions
  - `/utils`: Utility functions

### Backend Architecture

- **Clean Architecture**:
  - `Freshmart.Core`: Contains domain models, DTOs, and interfaces
  - `Freshmart.Infrastructure`: Implements data access and services
  - `Freshmart.API`: Exposes RESTful endpoints and handles HTTP requests
- **Repository Pattern**: Entity access through service layer
- **Dependency Injection**: Services registered in container
- **Domain-Driven Design**: Business logic encapsulated in domain models

## Frontend Features

### User Interface

- **Responsive Design**: Mobile-first approach for all screen sizes
- **Dark/Light Mode**: User selectable theme preference
- **Header Navigation**:
  - Dynamic dropdown menus with category loading on hover
  - Animated mobile navigation
  - User profile dropdown
- **Home Page**:
  - Hero section with featured products
  - Category browsing
  - Product showcases
- **Product Browsing**:
  - Category and subcategory filtering
  - Search functionality
  - Product grid and list views
  - Sorting and filtering options

### Product Catalog

- **Hierarchical Categories**: Two-level category system with parent/child relationships
- **Product Cards**: Display product image, price, rating, and stock status
- **Product Detail**: Modal pop-up with detailed information and add to cart functionality
- **Image Handling**: Cloudinary integration for optimized image delivery
- **Rating System**: Display average ratings and review counts

### Shopping Experience

- **Shopping Cart**:
  - Persistent cart across sessions
  - Real-time total calculation
  - Quantity adjustments
  - Product removal
- **Checkout Flow**:
  - Shipping information form
  - Order summary
  - Stock availability verification
- **Order Confirmation**:
  - Order number and details
  - Delivery timeline
  - Receipt generation

### User Account

- **Authentication**:
  - Email/password sign-in and registration
  - Google social login
  - JWT token-based session management
- **User Profile**:
  - Personal information management
  - Address book
- **Order History**:
  - Past order listing
  - Order details and status
  - Reorder functionality

## Backend Features

### API Structure

- **RESTful API Design**: Consistent resource-based endpoints
- **Controllers**:
  - `AuthController`: User authentication and registration
  - `ProductsController`: Product CRUD operations
  - `CategoriesController`: Category management
  - `OrdersController`: Order processing
  - `AdminController`: Admin-only operations

### Database Models

- **Core Entities**:
  - `User`: Customer information and authentication
  - `Product`: Product details including stock and pricing
  - `Category`: Hierarchical category system
  - `Order`: Order metadata and status
  - `OrderItem`: Individual items within orders

### Authentication System

- **JWT Tokens**: Secure authentication with expiration
- **Role-Based Authorization**: Admin vs. Customer roles
- **Google OAuth Integration**: Social sign-in capabilities
- **Password Reset**: Secure password recovery flow

### Media Management

- **Cloudinary Integration**: Cloud-based image storage
- **Image Optimization**: Automatic resizing and format optimization
- **Secure URLs**: Protected image access

### Order Processing

- **Order Creation**: Convert cart to order
- **Stock Verification**: Check availability before confirmation
- **Order Status Tracking**: Monitor order fulfillment
- **Order History**: Maintain comprehensive order records

## Database Schema

### Key Entities

#### User

- Contains authentication details and personal information
- Links to orders and preferences
- Supports role-based authorization

#### Product

- Complete product information
- Inventory tracking
- Category relationships
- Rating and review aggregation

#### Category

- Hierarchical structure with parent-child relationships
- Product associations
- Meta information for display

#### Order

- Order metadata (date, total, status)
- Customer information
- Shipping details
- Associated order items

#### OrderItem

- Product references
- Quantity and pricing at time of purchase
- Order relationship

## Authentication System

### User Registration and Login

- Email verification
- Password requirements and hashing
- JWT token generation and validation
- Refresh token mechanism

### Social Authentication

- Google OAuth integration
- Profile information synchronization
- Account linking capabilities

### Authorization

- Role-based access control
- Admin vs. regular user privileges
- API endpoint protection

## Admin Dashboard

### Product Management

- Add, edit, and delete products
- Update inventory levels
- Manage product images
- Assign categories

### Category Management

- Create and organize categories
- Build hierarchical relationships
- Associated product management

### Order Management

- View and process orders
- Update order status
- Customer communication
- Order filtering and search

### User Management

- View customer accounts
- Manage roles and permissions
- Account status control

## User Flow

### Shopping Flow

1. Browse categories or search for products
2. View product details
3. Add items to cart
4. Review cart
5. Proceed to checkout
6. Enter shipping information
7. Place order
8. Receive confirmation

### Account Management Flow

1. Register/Login
2. Update profile information
3. View order history
4. Manage shipping addresses
5. Update preferences

## API Documentation

### Authentication Endpoints

- POST `/api/auth/register`: Create new user account
- POST `/api/auth/login`: Authenticate user
- POST `/api/auth/google-login`: Authenticate with Google
- POST `/api/auth/refresh-token`: Refresh authentication token
- POST `/api/auth/forgot-password`: Initiate password reset
- POST `/api/auth/reset-password`: Complete password reset

### Product Endpoints

- GET `/api/products`: List products with filtering options
- GET `/api/products/{id}`: Get specific product details
- GET `/api/products/category/{categoryId}`: Get products by category
- POST `/api/products`: Create product (admin only)
- PUT `/api/products/{id}`: Update product (admin only)
- DELETE `/api/products/{id}`: Delete product (admin only)
- POST `/api/products/{id}/rate`: Rate product

### Category Endpoints

- GET `/api/categories`: List all categories
- GET `/api/categories/{id}`: Get specific category
- POST `/api/categories`: Create category (admin only)
- PUT `/api/categories/{id}`: Update category (admin only)
- DELETE `/api/categories/{id}`: Delete category (admin only)

### Order Endpoints

- GET `/api/orders`: List user's orders
- GET `/api/orders/{id}`: Get specific order details
- POST `/api/orders`: Create new order
- PUT `/api/orders/{id}/status`: Update order status (admin only)

## Deployment

### Frontend Deployment

- Vercel or Netlify recommended for Next.js deployment
- Environment variables configuration:
  - `NEXT_PUBLIC_API_URL`: Backend API URL
  - `NEXTAUTH_SECRET`: Secret for NextAuth
  - `NEXTAUTH_URL`: Frontend URL for authentication
  - `GOOGLE_CLIENT_ID`: Google OAuth client ID
  - `GOOGLE_CLIENT_SECRET`: Google OAuth client secret

### Backend Deployment

- Azure App Service or AWS Elastic Beanstalk recommended
- PostgreSQL database on managed service
- Environment variables:
  - Database connection string
  - JWT secret
  - Cloudinary credentials
  - CORS allowed origins
  - Google Auth settings

## Special Features

1. **Dynamic Menu Navigation**: Categories are loaded on-demand when hovering over menu items
2. **Hierarchical Category System**: Two-level deep category organization
3. **Cloudinary Integration**: Seamless image uploads and optimization
4. **Theme Support**: Dark/light mode with system preference detection
5. **Stock Management**: Real-time inventory tracking during purchase
6. **Responsive Cart Sidebar**: Easy access from any page
7. **Form Validation**: Client and server-side validation for all forms
8. **Toast Notifications**: User-friendly feedback on all operations
