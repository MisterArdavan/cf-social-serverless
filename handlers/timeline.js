import Post from '../store/post'
import { wrapCorsHeader, checkOrigin } from '../helpers/cors'

const handler = async request => {
    try {
        const allowedOrigin = checkOrigin(request)
        let { posts, list_complete, cursor } = await Post.findMany(null, 1000)
        posts.sort((a,b) => a.compare(b))
        return wrapCorsHeader(new Response(JSON.stringify(posts), { headers: { "Content-Type": "application/json" }}), allowedOrigin)
    } catch (err) {
        return wrapCorsHeader(new Response(`Error! ${err} for ${JSON.stringify(posts)}`), allowedOrigin)
    }
}

export default handler