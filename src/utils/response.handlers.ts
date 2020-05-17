export default class Handler {
    public success = (data: any) =>{
        return {
            status: "success",
            data: data,
        }
    }

    public error = (data: any, message: string, code: string) => {
        return {
            status: "error",
            code: code,
            message: message,
            data: data,
        }
    }
}