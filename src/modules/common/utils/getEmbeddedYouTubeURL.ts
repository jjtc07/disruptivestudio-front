export const getEmbeddedYouTubeURL = (url: string): string => {
  if (!url.includes('youtube.com')) {
    return 'La URL proporcionada no es de YouTube'
  }

  const videoId = url.split('v=')[1]
  if (!videoId) {
    return 'No se pudo extraer el ID del video'
  }

  const embeddedUrl = `https://www.youtube.com/embed/${videoId}`

  return embeddedUrl
}
