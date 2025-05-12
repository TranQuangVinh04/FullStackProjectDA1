import axios from "axios";

export const axiosInstanace = axios.create({
    baseURL:"http://localhost:3000/api",
    withCredentials:true,
    
})


