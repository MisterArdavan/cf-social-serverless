import { v4 as uuid } from 'uuid'

class Post {
    constructor({ id, username, title, content, submitted_at }) {
        this.id = id || uuid()
        this.title = title
        this.submitted_at = submitted_at || Date.now()
        if (!username) {
            throw new Error('Missing username in data')
        } else {
            this.username = username
        }
        if (!content) {
            throw new Error('Missing content in data')
        } else {
            this.content = content
        }
    }

    async save() {
        return await CF_KV.put(`posts:${this.id}`, JSON.stringify(this))
    }

    static async findMany(cursor, limit) {
        const {keys:ids, list_complete, cursor: new_cursor} = await CF_KV.list({"prefix": "posts:", "cursor": cursor, "limit": limit})
        const posts = await Promise.all(ids.map((id) => Post.find(id.name)))
        return {posts, list_complete, cursor}
    }

    static async find(id) {
        const persisted = await CF_KV.get(id)
        const post = JSON.parse(persisted)
        return persisted ? new Post({...post}) : null
    }

    compare(post) {
        return post.submitted_at - this.submitted_at
    }
    
}

export default Post