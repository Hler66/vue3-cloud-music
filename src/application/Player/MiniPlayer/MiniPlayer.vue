<template>
<transition
  mode="out-in" 
    :appear="!fullScreen"
    name="mini" 
    duration="400"
    @enter="enter"
    @after-leave="afterLeave"
>
    <div  ref="miniPlayerRef" @click="toggleFullScreenClick"  class="miniPlayerContainer">
        <div class="icon">
          <div class="imgWrapper">
            <img :class="[{pause:playing},'play']" :src="song.al.picUrl" width="40" height="40" alt="img"/>
          </div>
        </div>
        <div class="text">
          <h2 class="name nowrap">{{song.name}}</h2>
          <p class="desc nowrap">{{getName(song.ar)}}</p>
        </div>
        <div class="control">
          <ProcessCircle :radius="32" :percent="percent">
            <i v-if="playing" @click="handleClick($event,false)" class="iconfont icon-mini">&#xe650;</i>
            <i v-else @click="handleClick($event,true)" class="iconfont icon-mini">&#xe61e;</i>
          </ProcessCircle>
        </div>
        <div class="control">
          <i class="iconfont">&#xe640;</i>
        </div>
      </div>
</transition>

</template>

<script>
import {ref } from 'vue'
import {getName} from '../../../api/utils'
import ProcessCircle from '../../../baseUI/process-circle.vue'
export default {
  components:{
    ProcessCircle
  },
  props:{
    song:{
      type:Object,
      default:{}
    },
    fullScreen:{
        type:Boolean,
        default:false
    },
    toggleFullScreen:{
      type:Function,
      default:null
    },
    percent:{
      type:Number,
      default:0
    },
    clickPlaying:{
      type:Function,
      default:null
    },
    playing:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return {
      song:this.song,
      // percent:0.2
    }
  },
  computed:{
        fullScreen(){
            return this.fullScreen
        },
        percent(){
          return this.percent
        },
        playing(){
          return this.playing
        }
    },
    methods:{

    },
  setup(props){
      let {toggleFullScreen,clickPlaying} =  props;
      let miniPlayerRef = ref(null)
      const enter = function(){
          miniPlayerRef.value.style.display = "flex";
      }
      // const afterLeave = function(){
      //     miniPlayerRef.value.style.display = "none";
      // }
      const toggleFullScreenClick = ()=>{
        toggleFullScreen(true)
      }
      const handleClick =(e,is)=>{
        clickPlaying(e,is)
      }
    return{
      getName,
      enter,
      miniPlayerRef,
      // afterLeave,
      toggleFullScreenClick,
      handleClick
    }
  }
}
</script>

<style lang="less" scoped>
// 没有效果
.mini-enter {
  transform: translate3d(0, 100%, 0);
}
.mini-enter-active{
    transform: translate3d(0,0,0);
    transition: all 0.4s;
}
.min-leave-active{
    transform: translate3d(0, 100%, 0);
    transition: all .4s
}

@keyframes rotate {
  0%{
    transform: rotate(0);
  }
  100%{
    transform: rotate(360deg);
  }
}


.miniPlayerContainer{
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  height: 60px;
  background: @hightlight-background-color;

  .icon{
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;
    .imgWrapper{
      width: 100%;
      height: 100%;
      img{
        border-radius: 50%;
        &.play{
          animation: rotate 10 s infinite;
          &.pause{
            animation-play-state: paused;
          }
        }
      }
    }
  }
  .text{
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    .name{
      margin-bottom: 2px;
      font-size: @font-size-m;
      color:@font-color-desc;
    }
    .desc{
      font-size: @font-size-s;
      color: @font-color-desc-v2;
    }
  }
  .control{
    flex: 0 0 30px;
    padding: 0 10px;
    text-align: center;
    .iconfont ,.icon-playlist{
      font-size: 23px;
      color:@theme-color-red;
    }
    .icon-mini{
      font-size:16px;
      position: absolute;
      left: 8px;
      top: 8px;
      &.icon-play{
        left: 9px;
      }
    }
  }
}
</style>