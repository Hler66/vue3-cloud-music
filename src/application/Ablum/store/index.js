import {getAlbumDetailRequest} from '../../../api/request'

export default {
    state:{
        currentAblum:{},
        enterLoading:false
    },
    mutations:{
        setCurrentAblum(state,currentAblum){
            state.currentAblum = currentAblum;
        },
        changeEnterLoading(state,enterLoading){
            state.enterLoading = enterLoading;
        }
    },
    actions:{
        getAblumList(context,id){
            getAlbumDetailRequest(id).then(res=>{
                console.log(res)
                let data = res.playlist;
                context.commit('setCurrentAblum',data);
                context.commit('changeEnterLoading',false)
            }).catch(err=>{
                console.log(err,'获取ablum数据失败')
            })
        }
    },
    getters:{
        currentAblum:state=>state.currentAblum,
        enterLoading:state=>state.enterLoading
    }
}