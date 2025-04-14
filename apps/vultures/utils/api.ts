export const getApiPrefix = () => {
    // here we could create an endpoint on the 
    // api to get the actual api endpoint
    return process.env.NEXT_PUBLIC_API_URL + "/api/v1"
}