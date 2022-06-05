import {getBannerRequest,getRecommendListRequest} from '../../../api/request'
// import createPersistedState from "vuex-persistedstate";

export default {
    // namespaced: true,//命名空间，防止命名冲突
    state:{
        bannerList:[],
        recommendList:[],
        enterLoading:true
    },
    mutations:{
        setBannerList(state,bannerList){
            console.log(bannerList)
            state.bannerList = bannerList;
        },
        setRecommend(state,recommendList){
            console.log(recommendList)
            state.recommendList = recommendList
        },
        changeEnterLoading(state,enterLoading){
            state.enterLoading = enterLoading;
            console.log(state.enterLoading)
        }
    },
    actions:{
        getBannerList(context){
            getBannerRequest().then(res=>{
                context.commit('setBannerList',res.banners)
            })
        },
        getRecommendList(context){
            getRecommendListRequest().then(data=>{
                context.commit('setRecommend',data.result)
                context.commit('changeEnterLoading',false)
            }).catch((err)=>{
                console.log(err,'推荐歌单数据传输错误')
            })
        }
    },
    getters:{
        bannerListGet:state=>state.bannerList,
        recommendListGet:state=>state.recommendList,
        enterLoadingGet:state=>state.enterLoading
    },
    // plugins: [createPersistedState({
    //     storage: window.sessionStorage,
    //     reducer(val){
    //         return {
    //             recommendList:val.recommendList,
    //             bannerList:val.bannerList
    //         }
    //     }
    // })], 无法实现模块中的特定字段存储
}