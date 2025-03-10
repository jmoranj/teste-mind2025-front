import { z } from 'zod'

// Registration schema
export const registerSchema = z
  .object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').trim(),
    email: z.string().email('Formato de email inválido').trim(),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z
      .string()
      .min(6, 'Confirmação de senha deve ter pelo menos 6 caracteres'),
  })
  // Add custom validation for password confirmation
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Formato de email inválido').trim(),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

// Types derived from schemas
export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>

// Helper function to validate user input against schema
export const validateRegisterForm = (data: RegisterFormData) => {
  return registerSchema.safeParse(data)
}

export const validateLoginForm = (data: LoginFormData) => {
  return loginSchema.safeParse(data)
}
