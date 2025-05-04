const getEnv = (key:string , defaultValue?:any):string =>{
    const value = process.env[key]||defaultValue;
    if(value ==undefined){
        throw new Error(`value env ${key} undefined`)
    }
    return value
}

export const MONGO_URL = getEnv("DATABASE");
export const NODE_ENV = getEnv("NODE_ENV","development");
export const PORT = getEnv("PORT",3000);
export const JWT_SECRET = getEnv("JWT_SECRET");
export const CLOUDINARY_CLOUD_NAME = getEnv("CLOUDINARY_CLOUD_NAME");
export const CLOUDINARY_API_KEY = getEnv("CLOUDINARY_API_KEY");
export const CLOUDINARY_API_SECRET = getEnv("CLOUDINARY_API_SECRET");
export const URL_ORIGIN = getEnv("URL_ORIGIN");