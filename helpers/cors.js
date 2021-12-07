const allowedOrigins = [
  'https://cf-social-viewer.pages.dev',
  'http://localhost:3000',
]

const corsHeaders = origin => ({
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': ['POST', 'GET', 'OPTIONS'],
  'Access-Control-Allow-Origin': origin,
})

const checkOrigin = request => {
  const origin = request.headers.get('Origin')
  return allowedOrigins.find(allowedOrigin => allowedOrigin.includes(origin))
}

const wrapCorsHeader = (response, allowedOrigin) => {
  const headers = corsHeaders(allowedOrigin)
  for (const key of Object.keys(headers)) {
    response.headers.set(key, headers[key])
  }
  return response
}

export { corsHeaders, wrapCorsHeader, checkOrigin }
