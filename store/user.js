class User {
    constructor(username) {
        this.username = username
    }

    async save() {
        return await CF_KV.put(`users:${this.username}`, JSON.stringify(this))
    }

    static async find(username) {
        const persisted = await CF_KV.get(`users:${username}`)
        const user = JSON.parse(persisted)
        return persisted ? new User({...user}) : null
    }
    
}

export default User