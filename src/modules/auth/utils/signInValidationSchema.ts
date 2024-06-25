import * as Yup from 'yup'

export const signInValidationSchema = Yup.object().shape({
  email: Yup.string()
    .required('El correo electrónico es obligatorio')
    .email('El correo electrónico no es válido'),
  password: Yup.string()
    .required('La contraseña es obligatoria')
    .min(5, 'La contraseña debe tener al menos 5 caracteres'),
})
