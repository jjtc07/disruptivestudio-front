// import { makeRequest } from '@modules/common/utils'
// import { fetchThemes } from '@modules/themes/services'
import CreatePostPage from '@modules/posts/pages/create-post'

// export async function getServerSideProps(context: any) {
//   try {
//     const response = await fetchThemes()

//     const post = response.data

//     return {
//       props: {
//         post,
//       },
//     }
//   } catch (error) {
//     console.error('Error fetching post:', error)
//     return {
//       notFound: true,
//     }
//   }
// }

export default CreatePostPage
