export interface User {
    id: string,
    username: string,
    email?: string
}

export interface Session {
    id: string,
    data: Array<Object>,
}