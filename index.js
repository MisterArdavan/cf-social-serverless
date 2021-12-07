import { Router } from 'itty-router'
import index from './handlers/index.js'
import create from './handlers/create.js'
import timeline from './handlers/timeline.js'
import { serverError, notFoundError} from './handlers/error.js'
import cors from './handlers/cors.js'

const router = Router()

router.options('*', cors)

// Our index route redirects to /posts
router.get('/', index)

router.get('/posts', timeline)

router.post('/posts', create)

router.all('*', notFoundError)

addEventListener('fetch', (e) => {
  e.respondWith(router.handle(e.request).catch(serverError))
})