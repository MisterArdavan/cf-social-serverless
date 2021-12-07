import Post from '../store/post'
import { wrapCorsHeader, checkOrigin } from '../helpers/cors'

const handler = async request => {
  try {
    const allowedOrigin = checkOrigin(request)
    const body = await request.json()
    if (!body) {
      throw new Error('Incorrect data')
    }
    const post = new Post(body)
    await post.save()
    return wrapCorsHeader(
      new Response('success', { headers: { Location: '/posts' }, status: 301 }),
      allowedOrigin,
    )
  } catch (err) {
    const allowedOrigin = checkOrigin(request)
    return wrapCorsHeader(new Response(err, { status: 400 }), allowedOrigin)
  }
}

export default handler
