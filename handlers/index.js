import { wrapCorsHeader, checkOrigin } from "../helpers/cors"

const handler = (request) => {
    const allowedOrigin = checkOrigin(request)
    return wrapCorsHeader(new Response('Hi!', { headers: { Location: '/posts' }, status: 301 }), allowedOrigin)
}
export default handler