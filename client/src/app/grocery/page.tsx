import React from 'react'
import GroceryStore from '@/components/Grocery'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fresh Grocery Store',
  description:
    'Shop fresh, organic, and quality groceries delivered to your doorstep.',
}

export default function GroceryPage() {
  return <GroceryStore />
}
