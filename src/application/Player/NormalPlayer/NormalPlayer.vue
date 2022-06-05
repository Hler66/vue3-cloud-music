<template>
<transition 
    mode="out-in" 
    :appear="fullScreen"
    name="normal"
    duration="400"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="leave"
    @after-leave="afterLeave"
>
      <div v-if="fullScreen" class="normalPlayerContainer" ref="normalPlayerRef">
            <div class="background">
                <img :src="song.al.picUrl + '?param=300x300'" width="100%" height="100%" alt="歌曲图片" />
            </div>
            <div class="background layer"></div>
            <div class="top" >
                <div class="back" @click="toggleFullScreenClick">
                    <i class="iconfont icon-back">&#xe662;</i>
                </div>
                <h1 class="title nowrap">{{song.name}}</h1>
                <h1 class="subtitle nowrap">{{getName(song.ar)}}</h1>
            </div>
            <div class="middle" ref="cdWrapperRef">
                <div class="cdWrapper">
                    <div class="cd">
                        <img :src="song.al.picUrl + '?param=400x400'" class="image play" alt="" />
                    </div>
                </div>
            </div>
            <div class="bottom">
                <div class="progressBarWrapper">
                    <span class="time time-l">{{currentTime}}</span>
                    <div class="progress-bar-wrapper">
                        <ProgressBar 
                        :percentChange="percentChange" 
                        :percent="percent"
                        ></ProgressBar>
                    </div>
                    <div class="time time-r">{{duration}}</div>
                </div>
                <div class="operators">
                    <div class="icon i-left" @click="changeMode" >
                        <i class="iconfont" v-html="getPlayMode"></i>
                        <!-- &#xe625; -->
                    </div>
                    <div class="icon i-left" @click="handlePrevClick" >
                        <i class="iconfont">&#xe6e1;</i>
                    </div>
                    <div class="icon i-center">
                        <i class="iconfont" @click="handlePlaying($event,!playing)">{{playing?`&#xe723;`:`&#xe731;`}}</i>    
                    </div>
                    <div  class="icon i-right" @click="handleNextClick">
                        <i class="iconfont">&#xe718;</i>
                    </div>
                    <div class="icon i-right">
                        <i class="iconfont">&#xe640;</i>
                    </div>
                </div>
            </div>
    </div>
</transition>

</template>

<script>
import {getName,prefixStyle,formatPlayTime } from '../../../api/utils'
import { playMode } from "@/api/config";
import animations from 'create-keyframe-animation'
import {ref,toRefs,reactive} from 'vue'
import ProgressBar from '../../../baseUI/processBar.vue'


export default {
    components:{
        ProgressBar
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
        clickPlaying:{
            type:Function,
            default:null
        },
        onProgressChange:{
            type:Function,
            default:null
        },
        mode:{
            type:Number,
            default:0
        },
        changeMode:{
            type:Function,
            default:null
        },
        handlePrev:{
            type:Function,
            default:null
        },
        handleNext:{
            type:Function,
            default:null
        },
        playing:{
            type:Boolean,
            default:false
        },
        duration:{
            type:Number,
            default:0
        },
        currentTime:{
            type:Number,
            default:0
        },
    },
    data(){
        return {
            song:this.song
        }
    },
    computed:{
        fullScreen(){
            return this.fullScreen
        },
        playing(){
          return this.playing
        },
        duration(){
            return formatPlayTime(this.duration)
        },
        currentTime(){
            return formatPlayTime(this.currentTime)
        },
        mode(){
            return this.mode
        },
        getPlayMode(){
            let content;
            console.log(this.mode)
            if (this.mode === playMode.sequence) {
                content = "&#xe625;";
            } else if (this.mode === playMode.loop) {
                content = "&#xe653;";
            } else {
                content = "&#xe61b;";
            }
            console.log(content)
            return content;
        }
    },
    methods:{
        
    },
    setup(props){
        let normalPlayerRef = ref();
        let cdWrapperRef = ref();
        let {toggleFullScreen,clickPlaying,onProgressChange,handlePrev,handleNext,changeMode} =  props;
        const toggleFullScreenClick=()=>{
            toggleFullScreen(false);
        }
        const enter =()=>{
            normalPlayerRef.value.style.display = 'block';
            // 获取miniPlayer相对于中心图片的偏移
            const {x,y,scale} = _getPosAndScale();
            let animation = {
                0:{
                    transform:`translate3d(${x}px,${y}px) scale(${scale})`
                },
                60:{
                    transform: `translate3d(0, 0, 0) scale(1.1)`
                },
                100:{
                    transform: `translate3d(0, 0, 0) scale(1)`
                }
            };
            animations.registerAnimation({
                name:'move',
                animation,
                presets:{
                    duration:400,
                    easing:"linear"
                }
            });
            animations.runAnimation(cdWrapperRef.value,'move')
        }
        const afterEnter = ()=>{
            // 进入后解绑
            const cdWrapperDom = cdWrapperRef.value;
            animations.unregisterAnimation('move');
            cdWrapperDom.style.animation = "";
        }
        const transform = prefixStyle("transform");
        const leave = ()=>{//没有触发
            if(!cdWrapperRef.value) return;
            const cdWrapperDom = cdWrapperRef.value;
            cdWrapperDom.style.transition = 'all 0.4s';
            const { x, y, scale } = _getPosAndScale();
            cdWrapperDom.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
        }
        const afterLeave = () => {
            if (!cdWrapperRef.value) return;
            const cdWrapperDom = cdWrapperRef.value;
            cdWrapperDom.style.transition = "";
            cdWrapperDom.style[transform] = "";
            // 一定要注意现在要把 normalPlayer 这个 DOM 给隐藏掉，因为 CSSTransition 的工作只是把动画执行一遍 
            // 不置为 none 现在全屏播放器页面还是存在
            normalPlayerRef.value.style.display = "none";
        };
        const _getPosAndScale=()=>{
            const targetWidth = 40;
            const paddingLeft = 40;
            const paddingBottom = 30;
            const paddingTop = 80;
            const width = window.innerWidth * 0.8;
            const scale = targetWidth / width;
            // 两个圆心横坐标距离和纵坐标距离
            const x = -(window.innerWidth / 2 - paddingLeft);
            const y = window.innerHeight - paddingTop - width/2 -paddingBottom;
            return {
                x,
                y,
                scale
            }
        }
        // 改变进度条回调
        const percentChange = ()=>{

        }
        // 改变播放状态
        const handlePlaying=(e,playing)=>{
             clickPlaying(e,playing)
        }
        const handlePrevClick=()=>{
            handlePrev()
        }
        const handleNextClick=()=>{
            handleNext()
        }


        return {
            getName,
            toggleFullScreenClick,
            normalPlayerRef,
            cdWrapperRef,
            enter,
            afterEnter,
            leave,
            afterLeave,
            handlePlaying,
            handlePrevClick,
            handleNextClick,
            changeMode
        }
    }
}
</script>

<style lang="less" scoped>
// 没有效果
.normal-enter,.normal-leave-to{
    .top {
        transform: translate3d(0, -100px, 0);
    }
    .bottom {
        transform: translate3d(0, 100px, 0);
    }
}
.normal-enter-active,.normal-leave-active{
    .top,
    .bottom {
        transform: translate3d(0, 0, 0);
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
    }
    opacity: 1;
    transition: all 0.4s;
}
.normal-leave-active {
  opacity: 0;
}

@keyframes rotate {
    0%{
        transform: rotate(0);
    }
    100%{
        transform: rotate(360deg);
    }
}
.normalPlayerContainer{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: @background-color;
    .background{
        position: absolute;
        left: 0;
        top:0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);
        &.layer{
            background: @font-color-desc;
            opacity: 0.3;
            filter: none;
        }
    }
    .top{
        position: relative;
        margin-bottom: 25px;
        .back{
            position: absolute;
            top: 0;
            left: 6px;
            z-index: 50;
            .iconfont{
                display: block;
                padding: 9px;
                font-size: 24px;
                color: @font-color-desc;
                font-weight: bold;
                transform: rotate(90deg);
            }
        }
        .title{
            width: 70%;
            margin: 0 auto;
            line-height: 40px;
            text-align: center;
            font-size: @font-size-l;
            color: @font-color-desc;
        }
        .subtitle{
            line-height: 20px;
            text-align: center;
            font-size: @font-size-m;
            color: @font-color-desc-v2;
        }
    }
    .middle{
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;
        overflow: hidden;
        .cdWrapper{
            position: absolute;
            margin: auto;
            top: 10%;
            left: 0;
            right: 0;
            width: 80%;
            box-sizing: border-box;
            height: 80vw;
            .cd{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                .image{
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    box-sizing: border-box;
                    border-radius: 50%;
                    border: 10px solid rgba(255, 2555, 255, 0.1);
                }
                .play{
                    // 旋转效果
                    animation: rotate 20s 20s linear infinite;
                    &.pause{
                        animation-play-state: paused;
                    }
                }
            }
            .play_lyric{
                margin-top: 20px ;
                font-size: 14px;
                line-height: 20px;
                white-space: normal;
                text-align: center;
                color: rgba(255, 255, 255, 0.5);
            }
        }
        
    }
    .bottom{
        position: absolute;
        bottom: 50px;
        width: 100%;
        .progressBarWrapper{
            display: flex;
            align-items: center;
            width: 80%;
            margin: 0 auto;
            padding: 10px 0;
            .time{
                color: @font-color-desc;
                font-size: @font-size-s;
                flex: 0 0 30px;
                line-height: 30px;
                width: 30px;
                &.time-l{
                    text-align: left;
                }
                &.timer-r{
                    text-align: right;
                }
            }
            .progress-bar-wrapper{
                flex: 1;
            }
        }
        .operators{
            display: flex;
            align-items: center;
            .icon{
                font-weight: 300;
                flex: 1;
                color: @font-color-desc;
                &.disable{
                    color:@theme-color-shadow;
                }
                i{
                    font-weight: 300;
                    font-size: 30px;
                }
            }
            .i-left{
                text-align: right;
            }
            .i-center{
                padding: 0 20px;
                text-align: center;
                i{
                    font-size: 40px;
                }
            }
            .i-right{
                text-align: left;
            }
            .i-favorite{
                color: @theme-color-red;
            }
        }

    }
    
}
</style>