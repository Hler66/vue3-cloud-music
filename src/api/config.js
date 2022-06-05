import axios from 'axios';
// http://localhost:3000
export const baseUrl = 'http://localhost:8080';

const axiosInstance = axios.create({
    baseURL:baseUrl
})
// 响应拦截
axiosInstance.interceptors.response.use(res=>res.data,err=>console.log(err,'网络错误'));

export const HEADER_HEIGHT = 45;

export const playMode = {
    sequence:0,
    loop:1,
    random:2
}

export {
    axiosInstance
}
