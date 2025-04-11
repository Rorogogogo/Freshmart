import { NextResponse } from 'next/server'

// Mock hierarchical categories data
const categories = [
  // Root categories
  {
    id: 'cat-1',
    name: 'Fruits',
    description: 'Fresh seasonal fruits',
    productsCount: 10,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-2',
    name: 'Vegetables',
    description: 'Fresh organic vegetables',
    productsCount: 12,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-3',
    name: 'Dairy & Eggs',
    description: 'Milk, cheese, yogurt, and eggs',
    productsCount: 8,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-4',
    name: 'Bakery',
    description: 'Fresh baked goods',
    productsCount: 7,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Subcategories - Fruits
  {
    id: 'subcat-1',
    name: 'Tropical Fruits',
    description: 'Exotic fruits from tropical regions',
    productsCount: 4,
    isDeleted: false,
    parentId: 'cat-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'subcat-2',
    name: 'Berries',
    description: 'Sweet and tart berries',
    productsCount: 3,
    isDeleted: false,
    parentId: 'cat-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'subcat-3',
    name: 'Citrus Fruits',
    description: 'Refreshing citrus fruits',
    productsCount: 3,
    isDeleted: false,
    parentId: 'cat-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Subcategories - Vegetables
  {
    id: 'subcat-4',
    name: 'Leafy Greens',
    description: 'Nutritious leafy green vegetables',
    productsCount: 4,
    isDeleted: false,
    parentId: 'cat-2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'subcat-5',
    name: 'Root Vegetables',
    description: 'Hearty root vegetables',
    productsCount: 4,
    isDeleted: false,
    parentId: 'cat-2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'subcat-6',
    name: 'Fresh Herbs',
    description: 'Aromatic fresh herbs',
    productsCount: 4,
    isDeleted: false,
    parentId: 'cat-2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Subcategories - Dairy & Eggs
  {
    id: 'subcat-7',
    name: 'Milk & Cream',
    description: 'Fresh milk and cream products',
    productsCount: 3,
    isDeleted: false,
    parentId: 'cat-3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'subcat-8',
    name: 'Cheese',
    description: 'Artisanal and everyday cheeses',
    productsCount: 3,
    isDeleted: false,
    parentId: 'cat-3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'subcat-9',
    name: 'Yogurt & Cultured',
    description: 'Yogurt and fermented dairy products',
    productsCount: 2,
    isDeleted: false,
    parentId: 'cat-3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Subcategories - Bakery
  {
    id: 'subcat-10',
    name: 'Bread',
    description: 'Freshly baked breads',
    productsCount: 3,
    isDeleted: false,
    parentId: 'cat-4',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'subcat-11',
    name: 'Pastries',
    description: 'Sweet pastries and desserts',
    productsCount: 2,
    isDeleted: false,
    parentId: 'cat-4',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'subcat-12',
    name: 'Specialty Baked Goods',
    description: 'Specialty and artisanal baked goods',
    productsCount: 2,
    isDeleted: false,
    parentId: 'cat-4',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Categories retrieved successfully',
    statusCode: 200,
    data: categories,
  })
}
