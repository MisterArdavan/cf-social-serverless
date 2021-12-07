import { wrapCorsHeader, checkOrigin} from "../helpers/cors"

const ServerErrorHandler = (error, request) => {
    const allowedOrigin = checkOrigin(request)
    return wrapCorsHeader(new Response(error.message || 'Server Error', { status: error.status || 500 }), allowedOrigin)
}

const notFoundHandler = request => {
    const allowedOrigin = checkOrigin(request)
    return wrapCorsHeader(new Response('404, not found!', { status: 404 }), allowedOrigin)
}

export { ServerErrorHandler as serverError, notFoundHandler as notFoundError }

