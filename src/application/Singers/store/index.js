import { getHotSingerListRequest, getSingerListRequest } from "@/api/request"
export default {
    state:{
        singerList:[],
        enterLoading:true,//进场效果
        pullUpLoading:false,//上拉加载动画
        pullDownLoading:false,//下拉1加载动画
        pageCount:0 //当前页数，实现分页功能
    },
    mutations:{
        setSingerList(state,singerList){
            state.singerList = singerList
        },
        setEnterLoading(state,enterLoading){
            state.enterLoading = enterLoading
        },
        setpullDownLoading(state,pullDownLoading){
            state.pullDownLoading = pullDownLoading
        },
        setpullUpLoading(state,pullUpLoading){
            state.pullUpLoading = pullUpLoading
        },
        changePageCount(state,pageCount){
            state.pageCount = pageCount
        }
    },
    actions:{
        getHotSingerList(context){
            // count = 0
            getHotSingerListRequest(0).then(res=>{
                context.commit('setSingerList',res.artists);
                context.commit('setEnterLoading',false);
                context.commit('setpullDownLoading',false)
            }).catch((err)=>{
                console.log(err,'热门歌手数据获取失败')
            })
        },
        // 获取更多歌手
        refreshMoreHotSingerList({ commit, state }){
            const pageCount = state.pageCount;
            const singerList = state.singerList;
            getHotSingerListRequest(pageCount).then(res=>{
                const data = [...singerList,...res.artists];
                commit('setSingerList',data);
                commit('setpullUpLoading',false)
            }).catch((err)=>{
                console.log(err,'热门歌手数据获取失败')
            })
        },
        // 第一次加载对应类别歌手
        getSingerList(context,{category,alpha}){
            getSingerListRequest(category,alpha,0).then(res=>{
                const data = res.artists;
                context.commit('setSingerList',data);
                context.commit('setEnterLoading',false);
                context.commit('setpullDownLoading',false);
            }).catch((err)=>{
                console.log(err,'歌曲数据获取失败')
            })
        },
        refreshMoreSingerList({commit,state},{category,alpha}){
            const pageCount = state.pageCount;
            const singerList = state.singerList;
            getSingerListRequest(category,alpha,pageCount).then(res=>{
                const data = [...singerList,...res.artists];
                commit('setSingerList',data)
                commit('setpullUpLoading',false)
            }).catch((err)=>{
                console.log(err,'歌手数据获取失败')
            })
        }
    },
    getters:{
        singerGet : state=>state.singerList,
        pullUpLoading : state=>state.pullUpLoading,
        pullDownLoading:state=>state.pullDownLoading,
        pageCount:state=>state.pageCount
    }
}