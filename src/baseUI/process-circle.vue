<template>
  <div class="circleWrapper">
      <svg :width="radius" :hight="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent" />
        <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent"
            :strokeDasharray="dashArray"
            :strokeDashoffset="dashOffset" />
      </svg>
        <slot></slot>
  </div>
</template>

<script>
import {getCurrentInstance} from 'vue'
export default {
    props:{
        radius:{
            type:Number,
            default:0
        },
        percent:{
            type:Number,
            default:0
        },
    },
    data(){
        return{
        }
    },
    computed:{
        percent(){
            return this.percent;
        }
    },
    setup(props){
        const instance = getCurrentInstance()
        let {radius} = props;
        // 整个背景的周长

        const dashArray = Math.PI * 100;
        // 没有高亮部分
        const dashOffset = (1 - instance.ctx.percent) * dashArray;
        return {
            radius,
            dashArray,
            dashOffset
        }
    }
}
</script>

<style lang="less" scoped>
.circleWrapper{
    position: relative;
    circle{
        stroke-width: 8px;
        transform-origin: center;
        &.progress-background{
            transform: scale(0.9);
            stroke: @theme-color-shadow;
        }
        &.progress-bar{
            transform: scale(0.9) rotate(-90deg);
            stroke: @theme-color-red;
        }
    }

}
</style>