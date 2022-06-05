import { axiosInstance } from "./config";

export const getBannerRequest = ()=>{
    return axiosInstance.get('/api/banner')
}

export const getRecommendListRequest=()=>{
    return axiosInstance.get('/api/personalized');
}

export const getHotSingerListRequest=(count)=>{
    return axiosInstance.get(`/api/top/artists?offset=${count}`)
}

export const getSingerListRequest = (category,alpha,count)=>{
    return axiosInstance.get(`/api/artist/list?cat=${category}&initial=${alpha.toLowerCase()}&offset=${count}`)
}
export const getRankListRequest=()=>{
    return axiosInstance.get(`/api/toplist/detail`);
}
export const getAlbumDetailRequest = id => {
    return axiosInstance.get (`/api/playlist/detail?id=${id}`);
};
export const getSingerInfoRequest = id => {
    return axiosInstance.get (`/api/artists?id=${id}`);
};