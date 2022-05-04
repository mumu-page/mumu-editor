export interface Response<D = any> {
    success: string
    message: string
    data: D
}