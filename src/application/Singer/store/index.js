import {getSingerInfoRequest} from '../../../api/request'

export default {
    state:{
        artist:{},
        songsOfArtist:[],
        loading:true
    },
    mutations:{
        setArtist(state,artist){
            state.artist = artist
        },
        setSongsOfArtist(state,songsOfArtist){
            state.songsOfArtist = songsOfArtist
        },
        setLoading(state,loading){
            state.loading = loading
        }
    },
    actions:{
        getSingerInfo(context,id){
            getSingerInfoRequest(id).then(data=>{
                console.log(data)
                context.commit('setArtist',data.artist);
                context.commit('setSongsOfArtist',data.hotSongs);
                context.commit('setLoading',false)
            })
        }
    },
    getters:{
        artist:state=>state.artist,
        songsOfArtist:state =>state.songsOfArtist,
        loading:state=>state.loading
    }
}