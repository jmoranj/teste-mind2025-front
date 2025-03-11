import { z } from 'zod'

// Product schema for form validation
export const productSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').trim(),
  description: z.string().optional(),
  quantity: z
    .number({ invalid_type_error: 'Quantidade deve ser um número' })
    .int('Quantidade deve ser um número inteiro')
    .min(1, 'Quantidade deve ser pelo menos 1'),
  price: z
    .number({ invalid_type_error: 'Preço deve ser um número' })
    .min(0.01, 'Preço deve ser maior que zero'),
  date: z.string().min(1, 'Data é obrigatória'),
  category: z.boolean({
    invalid_type_error: 'Categoria deve ser selecionada',
    required_error: 'Categoria é obrigatória',
  }),
})

// Form data type derived from schema
export type ProductFormData = z.infer<typeof productSchema>

// Schema for API response (when getting products)
export const productResponseSchema = productSchema.extend({
  id: z.string(),
  userId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  image: z.any().optional(), // API returns image as binary data or null
})

export type ProductResponse = z.infer<typeof productResponseSchema>

// Helper functions for validation
export const validateProductForm = (data: ProductFormData) => {
  return productSchema.safeParse(data)
}

// Helper function to format date to DD/MM/YYYY as expected by backend
export const formatDateForApi = (dateString: string): string => {
  const date = new Date(dateString)
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
}

// Helper function to parse DD/MM/YYYY to YYYY-MM-DD for HTML date input
export const parseDateFromApi = (dateString: string): string => {
  // Check if date is already in ISO format (YYYY-MM-DD)
  if (dateString.includes('-')) {
    return dateString.split('T')[0] // Remove time portion if present
  }

  // Check if the date uses / separator
  if (dateString.includes('/')) {
    const parts = dateString.split('/')

    // Determine format based on parts
    if (parts.length === 3) {
      // If the first part looks like a year (4 digits)
      if (parts[0].length === 4) {
        // YYYY/MM/DD format
        const [year, month, day] = parts
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      } else {
        // Assume DD/MM/YYYY format
        const [day, month, year] = parts
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      }
    }
  }

  // If it's a timestamp or other date format, try to convert it
  try {
    const date = new Date(dateString)
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]
    }
  } catch (error) {
    console.error('Error parsing date:', error)
  }

  // If all else fails, return today's date
  console.warn('Could not parse date:', dateString)
  return new Date().toISOString().split('T')[0]
}

export interface ProductsContainerProps {
  onDataChange?: () => void
}
