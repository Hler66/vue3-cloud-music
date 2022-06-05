<template>
  <div class="progressWrapper">
      <div class="bar-inner" @click="progressClick" ref="progressBar">
        <div class="progress" ref="progress"></div>
        <div class="progress-btn-wrapper" ref="progressBtn"
         @touchstart="progressTouchStart"
         @touchmove="progressTouchMove"
         @touchend="progressTouchEnd">
            <div class="progress-btn"></div>
        </div>
      </div>
  </div>
</template>

<script>
import {prefixStyle} from '../api/utils'
import {ref,reactive,toRefs ,getCurrentInstance,onMounted } from 'vue'
export default {
    props:{
        percentChange:{
            type:Function,
            default:null
        },
        percent:{
            type:Number,
            default:0
        }
    },

    computed:{
        percent(){
            return this.percent
        }
    },
    watch:{},

    setup(props){
        const instance = getCurrentInstance();
        const {percentChange} = props;
        let data = reactive({
            touch:{}
        })
        const transform = prefixStyle('transform');
        let progress = ref(null)
        let progressBar = ref(null)
        let progressBtn = ref(null);
        const progressBtnWidth = 16;

        

        const _offset = (offsetWidth)=>{
            // 进度条开始动
            progress.value.style.width = `${offsetWidth}px`;
            progressBtn.value.style.transform = `translate3d(${offsetWidth}px,0,0)`
        }
        const progressTouchStart=(e)=>{
            const startTouch = {};
            startTouch.initiated = true;//tue表示滑动开始
            startTouch.startX = e.touches[0].pageX;
            startTouch.left = progress.value.clientWidth;
            data.touch = startTouch
        }
        const progressTouchMove  =(e)=>{
            if(!data.touch.initiated) return;
            const deltaX = e.touches[0].pageX - data.touch.startX;
            const barWidth = progressBar.value.clientWidth -  progressBtnWidth;
            const offsetWidth =  Math.min(Math.max(0,data.touch.left + deltaX),barWidth);
            _offset(offsetWidth)
        }
        const progressTouchEnd = e =>{
            console.log(data.touch)
            const endTouch = JSON.parse(JSON.stringify(data.touch));
            endTouch.initiated = false;
            data.touch = endTouch;
            _changePercent();
        }
        const progressClick = (e)=>{
            const rect = progressBar.value.getBoundingClientRect();
            // 当前事件的X轴长度pageX - rect开始时距离X 
            const offsetWidth = e.pageX - rect.left;
            _offset(offsetWidth);
            _changePercent();
        }
        // 执行父组件回调
        const _changePercent = ()=>{
            const barWidth = progress.value.clientWidth - progressBtnWidth;
            const curPercent = progress.value.clientWidth / barWidth;//新的进度回调
            percentChange(curPercent);//执行父组件回调
        }
        onMounted(() => {
            if(instance.ctx.percent >=0 && instance.ctx.percent<=1 && !data.touch.initiated){
                const barWidth = progressBar.value.clientWidth - progressBtnWidth;
                const offsetWidth = instance.ctx.percent * barWidth;
                progress.value.style.width = `${offsetWidth}px`;
                progressBtn.value.style[transform] = `translate3d(${offsetWidth}px,0,0)`
            }
        })
        console.log(instance.ctx.percent)

        return {
            ...toRefs(data), 
            progress,
            progressBar,
            progressBtn,
            progressTouchStart,
            progressTouchMove,
            progressTouchEnd,
            progressClick
        }
    }
}
</script>

<style lang="less" scoped>
.progressWrapper{
    height: 30px;
    .bar-inner{
        position: relative;
        top: 13px;
        height: 4px;
        background: rgba(0,0,0,.3);
        .progress{
            position: absolute;
            height: 100%;
            background: @theme-color-red;
        }
        .progress-btn-wrapper{
            position: absolute;
            left: -15px;
            top: -13px;
            width: 30px;
            height: 30px;
            .progress-btn{
                position: relative;
                top: 7px;
                left: 7px;
                box-sizing: border-box;
                width: 16px;
                height: 16px;
                border:3px solid @border-color;
                border-radius: 50%;
                background: @theme-color-red;
            }
        }
    }
}
</style>