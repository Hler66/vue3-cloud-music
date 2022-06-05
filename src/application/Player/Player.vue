<template>
<keep-alive>
  <div>
    <MiniPlayer :song="currentSong" 
    :percent="percent" 
    :fullScreen="fullScreen" 
    :clickPlaying="clickPlaying" 
    :toggleFullScreen="toggleFullScreen"
    :playing="playing" />
    <NoramlPlayer 
    :song="currentSong" 
    :percent="percent" 
    :fullScreen="fullScreen" 
    :clickPlaying="clickPlaying" 
    :toggleFullScreen="toggleFullScreen"
    :playing="playing"
    :duration="duration"
    :mode="mode"
    :currentTime="currentTime"
    :onChangeProgressBar="onChangeProgressBar"
    :handlePrev="handlePrev"
    :handleNext="handleNext"
    :changeMode="changeMode"/>
    <audio ref="audioRef" 
    @timeupdate="updateTime"
    @ended="ended"></audio>
    <Toast :text="modeText" ref="toastRef"></Toast>
  </div>
</keep-alive>
</template>

<script>
import MiniPlayer from './MiniPlayer/MiniPlayer.vue'
import NoramlPlayer from './NormalPlayer/NormalPlayer.vue'
import {mapGetters, useStore} from 'vuex'
import {ref,getCurrentInstance,onMounted,onBeforeMount,toRefs,reactive} from 'vue'
import {getSongUrl,shuffle,findIndex} from '../../api/utils'
import Toast from '../../baseUI/Toast.vue'
import {playMode} from '../../api/config'
export default {
  props:{
    fullScreen:{
      type:Boolean,
      default:false
    },

  },
  components:{
    MiniPlayer,
    NoramlPlayer,
    Toast
  },
  data(){
    return {
      currentSong : {
    al: { picUrl: "https://p1.music.126.net/JL_id1CFwNJpzgrXwemh4Q==/109951164172892390.jpg" },
    name: "木偶人",
    ar: [{name: "薛之谦"}]
  }
    }
  },
  computed:{
    ...mapGetters(['currentSong','sequencePlayList']),
  },
  watch:{
    currentSong(newVal){
      this.currentSong = newVal;
    },
    sequencePlayList(newVal){
      this.sequencePlayList = newVal
    },
    playlist(newVal){
      this.playlist = newVal;
    }
  },
  setup(){
    // mock数据
    const playList = [
    {
      ftype: 0,
      djId: 0,
      a: null,
      cd: '01',
      crbt: null,
      no: 1,
      st: 0,
      rt: '',
      cf: '',
      alia: [
        '手游《梦幻花园》苏州园林版推广曲'
      ],
      rtUrls: [],
      fee: 0,
      s_id: 0,
      copyright: 0,
      h: {
        br: 320000,
        fid: 0,
        size: 9400365,
        vd: -45814
      },
      mv: 0,
      al: {
        id: 84991301,
        name: '拾梦纪',
        picUrl: 'http://p1.music.126.net/M19SOoRMkcHmJvmGflXjXQ==/109951164627180052.jpg',
        tns: [],
        pic_str: '109951164627180052',
        pic: 109951164627180050
      },
      name: '拾梦纪',
      l: {
        br: 128000,
        fid: 0,
        size: 3760173,
        vd: -41672
      },
      rtype: 0,
      m: {
        br: 192000,
        fid: 0,
        size: 5640237,
        vd: -43277
      },
      cp: 1416668,
      mark: 0,
      rtUrl: null,
      mst: 9,
      dt: 234947,
      ar: [
        {
          id: 12084589,
          name: '妖扬',
          tns: [],
          alias: []
        },
        {
          id: 12578371,
          name: '金天',
          tns: [],
          alias: []
        }
      ],
      pop: 5,
      pst: 0,
      t: 0,
      v: 3,
      id: 1416767593,
      publishTime: 0,
      rurl: null
    }
];

    let store = useStore()
    const data = reactive({
        preSong:{}
    })
    // mock初始化为0
    store.commit('changeCurrentIndex',0)

    let fullScreen = ref(false);
    let playing = ref(false);
    let currentIndex =ref(0);
    // 当前播放事件
    let currentTime = ref(0);
    // 歌曲总时长
    let duration = ref(0);
    let percent = ref(0);
    let mode = ref(0)//
    mode.value = store.state.Player.mode

    let modeText = ref('');
    let toastRef = ref(null);

    currentTime.value = store.state.Player.currentIndex;

    let audioRef = ref();
    const instance = getCurrentInstance()
    // 初始化播放器
    const initPlayer =()=>{
      if(!instance.ctx.currentSong 
      || !playList.length 
      || currentIndex === -1
      || !playList[currentIndex]
      || playList[currentIndex].id === preSong.id) return;
      store.commit('changeCurrentIndex',0);//默认-1，改为0
      let current = playList[0];
      store.commit('changeCurrentSong',current);
      audioRef.value.src =getSongUrl(current.id);
      setTimeout(()=>{
        audioRef.value.play();
      })
      store.commit('changePlayingState',true);//播放状态
      currentTime.value = 0;
      duration.value = (current.dt / 1000) | 0;//播放总时长
    }
    onMounted(() => {
      initPlayer();
      // 歌曲进度
      if(playing.value){
        audioRef.value.play()
      }else{
        audioRef.value.pause()
      }
    })
    percent.value = isNaN(currentTime.value / duration.value)?0:currentTime.value / duration.value;
    fullScreen.value = store.state.Player.fullScreen;
    playing.value = store.state.Player.playing;
    currentIndex.value = store.state.Player.currentIndex;
    const toggleFullScreen = function(fuScreen){
      store.commit('changeFullScreen',fuScreen)
      fullScreen.value = store.state.Player.fullScreen;
    }
    // 阻止全屏
    const clickPlaying=(e,state)=>{
      e.stopPropagation();
      store.commit('changePlayingState',state);
      playing.value = store.state.Player.playing;
    }
    // 不断触发timeupdate事件
    const updateTime=(e)=>{
      currentTime.value = e.target.currentTime;
    }

    // 结束
    const ended=(e)=>{
      console.log("播放结束")
      if(mode.value === playMode.loop){
        handleLoop()
      }else{
        handleNext()
      }
    }

    // 控制进度条
    const onChangeProgressBar=(curProgress)=>{
      const newTime = curProgress * duration;
      currentTime.value = newTime;
      audioRef.value.currentTime = newTime;
      if(!playing.value){
        store.commit('changePlayingState',true);
      }
    }
    // 循环
    const handleLoop = ()=>{
      audioRef.value.currentTime = 0;
      store.commit('changePlayingState',true);
      audioRef.value.play();
    }
    const handlePrev = ()=>{
      console.log("prev")
      if(playList.length === 1){
        handleLoop();
        return;
      }
      let index = currentIndex - 1;
      if(index < 0) index = playList.length -1;
      if(!playing) store.commit('changePlayingState',true);
      store.commit('changeCurrentIndex',index);
    }
    // 下一首
    const handleNext =()=>{
      // 单曲
      if(playList.length == 1){
        handleLoop();
        return ;
      }
      let index = currentIndex + 1;
      if(index === playList.length) index = 0;
      if(!playing) store.commit('changePlayingState',true);
      store.commit('changeCurrentIndex',index);
    }
    // 模式切换弹窗
    const changeMode = ()=>{
      mode.value = store.state.Player.mode;
      let newMode = (mode.value + 1) % 3;
      if(newMode === 0){
        // 顺序播放
        store.commit('changePlaylist',instance.ctx.sequencePlayList);
        let index = findIndex(instance.ctx.currentSong,instance.ctx.sequencePlayList);
        store.commit('changeCurrentIndex',index);
        modeText.value="顺序播放"
      }else if(newMode == 1){
        // 单曲循环
        store.commit('changePlaylist',instance.ctx.sequencePlayList);
        modeText.value ="单曲循环"
      }else{
        // 随机播放
        let newList = shuffle(instance.ctx.sequencePlayList);
        let index = findIndex(instance.ctx.currentSong,newList);
        store.commit('changePlaylist',newList);
        store.commit('changeCurrentIndex',index);
        modeText.value = "随机播放"
      }
      store.commit('changePlayMode',newMode);
      toastRef.value.showWay();
    }

    return {
      ...toRefs(data),
      fullScreen,
      toggleFullScreen,
      clickPlaying,
      audioRef,
      percent,
      playing,
      currentTime,
      duration,
      updateTime,
      onChangeProgressBar,
      handleNext,
      handlePrev,
      mode,
      changeMode,
      modeText,
      toastRef,
      ended
    }
  }
}
</script>

<style>

</style>