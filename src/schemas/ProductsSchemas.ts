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
  const [day, month, year] = dateString.split('/')
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}
