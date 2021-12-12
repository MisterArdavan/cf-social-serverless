import Post from '../store/post'
import User from '../store/user'
import { wrapCorsHeader, checkOrigin } from '../helpers/cors'
import { JWT_URLs } from '../helpers/urls'


const handleNewUser = async (username) => {
  let cookie_header = {}
  if (JWT_URLs.production) {
    try {
      const resp = await fetch(new URL(`/auth/${username}`, JWT_URLs.production).toString())
      if (!resp.ok)
        throw new Error(`HTTP Error Response: ${resp.status} ${resp.statusText}`)
      if (resp.headers.has('set-cookie')) {
        cookie_header['set-cookie'] = resp.headers.get('set-cookie')
      }
      console.log(`cookie for new username ${username} is ${cookie_header['set-cookie']}`)
    } catch (error) {
      if (error.request)
        console.log(error.request)
      throw new Error('Error in communicating with JWT server: ' + error.message)
    }
    const user = new User(username)
    await user.save()
  }
  return cookie_header
}

const readCookie = (cookie, name) => {
  let nameEQ = name + "="
  let ca = cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}


const handleExistingUser = async (request, username) => {
  try {
    let cookie_header = {}
    console.log(`Getting cookie of existing username ${username}`)
    request.headers.forEach(console.log);
    if (request.headers.has('cookie')) {
      let token = readCookie(request.headers.get('cookie'), 'token')
      console.log('token is ' + token)
      const resp = await fetch(new URL('/verify', JWT_URLs.production).toString(), {
        headers: {
          Cookie: `token=${token}`,
        }
      })
      if (!resp.ok) {
        throw new Error(`Error verifying JWT token: ${resp.status} ${resp.statusText}`)
      }
      let tokenUsername = await resp.text()
      console.log('token username is ' + tokenUsername)
      if (username != tokenUsername) {
        throw new Error('This token is not for this username.')
      }
      cookie_header['set-cookie'] = `token=${token}`
      return cookie_header
    }
    else throw new Error('JWT token missing.')
  } catch (error) {
    throw new Error('This username is taken: ' + error.message)
  }
}

const handler = async request => {
  try {
    let cookie_header = {}
    const allowedOrigin = checkOrigin(request)
    const body = await request.json()
    if (!body) {
      throw new Error('Incorrect data')
    }
    const post = new Post(body)
    const u = await User.find(post.username)
    if (u != null) {
      cookie_header = await handleExistingUser(request, post.username)
    } else {
      cookie_header = await handleNewUser(post.username)
    }
    if (cookie_header['set-cookie'])
      await post.save()
    console.log(`success for ${post.username}`)
    return wrapCorsHeader(
      new Response('success', { headers: { ...cookie_header }, status: 201 }),
      allowedOrigin,
    )
  } catch (err) {
    const allowedOrigin = checkOrigin(request)
    return wrapCorsHeader(new Response(err, { status: 400 }), allowedOrigin)
  }
}

export default handler
