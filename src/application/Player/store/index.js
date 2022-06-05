import { playMode } from "@/api/config";
export default{
    state:{
        fullScreen:false,
        playing:false,
        sequencePlayList:[],//顺序播放
        playlist:[],
        mode:playMode.sequence,
        currentIndex:-1,
        showPlayList:false,
        currentSong:{}
    },
    mutations:{
        changeCurrentSong(state,currentSong){
            state.currentSong = currentSong;
        },
        changeFullScreen(state,fullScreen){
            state.fullScreen = fullScreen
        },
        changePlayingState (state,playing){
            state.playing = playing;
        },
        changePlayMode(state,mode){
            state.mode = mode
        },
        changeCurrentIndex(state,currentIndex){
            state.currentIndex = currentIndex
        },
        changeshowPlayList(state,showPlayList){
            state.showPlayList = showPlayList
        },
        changePlaylist(state,playlist){
            state.playlist = playlist;
        },
        changeSequencePlayList(state,list){
            state.sequencePlayList = list
        }
    },
    actions:{
        
    },
    getters:{
        currentSong:state=>state.currentSong,
        sequencePlayList:state=>state.sequencePlayList,
        playlist:state=>state.playlist
    }
}