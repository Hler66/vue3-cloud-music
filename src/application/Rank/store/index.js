import {getRankListRequest} from '../../../api/request'

export default {
    state:{
        rankList:[],
        loading:true
    },
    mutations:{
        changeRankList(state,rankList){
            state.rankList = rankList;
        },
        changeLoading(state,loading){
            state.loading = loading
        }
    },
    actions:{
        getRankList(context){
            getRankListRequest().then(data=>{
                let list = data && data.list;
                context.commit('changeRankList',list);
                context.commit('changeLoading',false)
            })
        }
    },
    getters:{
        rankListGet:state=>state.rankList,
        loadingGet:state=>state.loading
    }
}