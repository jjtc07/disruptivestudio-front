import * as Yup from 'yup'

export const signUpValidationSchema = Yup.object().shape({
  username: Yup.string()
    .required('El nombre de usuario es obligatorio')
    .min(4, 'El nombre de usuario debe tener al menos 4 caracteres'),
  email: Yup.string()
    .required('El correo electrónico es obligatorio')
    .email('El correo electrónico no es válido'),
  password: Yup.string()
    .required('La contraseña es obligatoria')
    .min(5, 'La contraseña debe tener al menos 5 caracteres'),
  confirmPassword: Yup.string()
    .required('Debes confirmar la contraseña')
    .oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden'),
  role: Yup.string().required('Debes seleccionar un rol'),
})
