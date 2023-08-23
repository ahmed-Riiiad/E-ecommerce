export class generateError extends Error {
    constructor(message,statusCode){
        super(message)
        this.statusCode=statusCode
    }
}