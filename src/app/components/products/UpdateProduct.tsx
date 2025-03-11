'use client'

import api from '@/api/api'
import {
  ProductFormData,
  ProductResponse,
  formatDateForApi,
  parseDateFromApi,
  validateProductForm,
} from '@/schemas/ProductsSchemas'
import { useEffect, useState } from 'react'
import Modal from './Modal'

interface UpdateProductsProps {
  item: ProductResponse | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function UpdateProducts({
  item,
  isOpen,
  onClose,
  onSuccess,
}: UpdateProductsProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    quantity: 1,
    price: 0,
    date: new Date().toISOString().split('T')[0],
    category: true,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [submissionError, setSubmissionError] = useState('')

  // Load product data when item changes
  useEffect(() => {
    if (item && isOpen) {
      setFormData({
        name: item.name,
        description: item.description || '',
        quantity: item.quantity,
        price: item.price,
        // Convert the date format if needed
        date: item.date
          ? parseDateFromApi(item.date.toString())
          : new Date().toISOString().split('T')[0],
        category: item.category,
      })

      // Reset state
      setImageFile(null)
      setErrors({})
      setSubmissionError('')
    }
  }, [item, isOpen])

  // Handle text input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement

    // Convert numeric inputs to numbers
    if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: value === '' ? '' : Number(value),
      }))
    }
    // Handle checkbox/boolean values
    else if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }))
    }
    // Handle select dropdown for category
    else if (name === 'category') {
      setFormData((prev) => ({
        ...prev,
        [name]: value === 'Entrada',
      }))
    }
    // Handle regular text inputs
    else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])

      // Clear image error if exists
      if (errors.image) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.image
          return newErrors
        })
      }
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!item) {
      setSubmissionError('No product selected for update')
      return
    }

    setSubmissionError('')

    // Validate form data
    const validationResult = validateProductForm(formData)

    if (!validationResult.success) {
      // Convert Zod errors to a more usable format
      const fieldErrors: Record<string, string> = {}
      validationResult.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as string] = error.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    try {
      setLoading(true)

      // Create FormData for multipart/form-data submission
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      if (formData.description)
        formDataToSend.append('description', formData.description)
      formDataToSend.append('quantity', formData.quantity.toString())
      formDataToSend.append('price', formData.price.toString())
      formDataToSend.append('date', formatDateForApi(formData.date))
      formDataToSend.append('category', formData.category.toString())

      // Only append image if a new one was selected
      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }

      // Send PUT request to update the product
      const response = await api.put(`/product/${item.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      console.log('Product updated successfully:', response.data)

      // Call success callback if provided
      if (onSuccess) onSuccess()

      // Close modal
      onClose()

      window.location.reload()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error updating product:', err)

      if (err.response?.data?.error) {
        setSubmissionError(err.response.data.error)
      } else if (err.response?.status === 401) {
        setSubmissionError(
          'Você precisa estar autenticado para atualizar produtos',
        )
      } else {
        setSubmissionError('Ocorreu um erro ao atualizar o produto')
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <Modal isOpen={isOpen} closeModal={onClose}>
      {submissionError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {submissionError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 mb-4 grid-cols-2">
          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Nome
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`bg-gray-50 border ${errors.name ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
              placeholder="Digite o nome do produto"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name}</span>
            )}
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Descrição (opcional)
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Digite a descrição do produto"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Imagem do Produto
            </label>

            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              accept="image/*"
              className={`bg-gray-50 border ${errors.image ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white`}
            />
            <p className="text-xs text-gray-500 mt-1">
              Deixe vazio para manter a imagem atual
            </p>
            {errors.image && (
              <span className="text-red-500 text-sm">{errors.image}</span>
            )}
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Quantidade
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              className={`bg-gray-50 border ${errors.quantity ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
              placeholder="Quantidade"
            />
            {errors.quantity && (
              <span className="text-red-500 text-sm">{errors.quantity}</span>
            )}
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Valor unidade
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              className={`bg-gray-50 border ${errors.price ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
              placeholder="Preço"
            />
            {errors.price && (
              <span className="text-red-500 text-sm">{errors.price}</span>
            )}
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Data
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`bg-gray-50 border ${errors.date ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
            />
            {errors.date && (
              <span className="text-red-500 text-sm">{errors.date}</span>
            )}
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Categoria
            </label>
            <select
              name="category"
              value={formData.category ? 'Entrada' : 'Saída'}
              onChange={handleChange}
              className={`bg-gray-50 border ${errors.category ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
            >
              <option value="Entrada">Entrada</option>
              <option value="Saída">Saída</option>
            </select>
            {errors.category && (
              <span className="text-red-500 text-sm">{errors.category}</span>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Atualizando...
            </>
          ) : (
            'Atualizar'
          )}
        </button>
      </form>
    </Modal>
  )
}
