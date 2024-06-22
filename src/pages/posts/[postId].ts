import PostDetail from '@modules/posts/pages/postDetails'
import { makeRequest } from '@modules/common/utils'

export async function getServerSideProps(context: any) {
  const { postId } = context.query

  try {
    const response = await makeRequest({
      method: 'GET',
      url: `posts/${postId}`,
    })

    const post = response.data

    return {
      props: {
        post,
      },
    }
  } catch (error) {
    console.error('Error fetching post:', error)
    return {
      notFound: true,
    }
  }
}

export default PostDetail
