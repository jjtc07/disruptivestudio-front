import * as Yup from 'yup'

export const createPostValidationSchema = Yup.object().shape({
  title: Yup.string().required('El título es obligatorio'),
  description: Yup.string().required('La descripción es obligatoria'),
  themes: Yup.array()
    .of(Yup.string())
    .min(1, 'Debes seleccionar al menos un tema'),
  cover: Yup.mixed().required('Debes seleccionar una imagen de portada'),
  content: Yup.string().when('typeContentState', {
    is: (typeContentState: string[]) => typeContentState?.includes('video'),
    then: Yup.string().required('El contenido de video es obligatorio'),
  }),
})
