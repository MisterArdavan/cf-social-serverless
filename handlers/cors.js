import { checkOrigin, corsHeaders } from "../helpers/cors"

const cors = async (request) => {
    const allowedOrigin = checkOrigin(request)
    return new Response('OK', { headers: corsHeaders(allowedOrigin) })
}

export default cors