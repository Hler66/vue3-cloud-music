<template>
  <div class="headerContainer">
      <i class="iconfont back" @click="handleClick">&#xe655;</i>
      <marquee v-if="isMarquee"><h1>{{title}}</h1></marquee>
      <h1 v-else>{{title}}</h1>
  </div>
</template>

<script>
export default {
    props:{
        title:{
            type:String,
            default:''
        },
        isMarquee:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return {
            // title:this.title 直接放到title中是父组件和子组件是没有响应式的
        }
    },
    computed:{
        title(){
            return this.title;
        }
    },
    methods:{
        handleClick(){
            this.$emit('handleClick')
        }
    },
    setup(){

    }

}
</script>

<style lang="less" scoped>
.headerContainer{
    position: fixed;
    padding: 5px 10px;
    padding-top: 0;
    height: 40px;
    width: 100%;
    z-index: 100;
    display: flex;
    line-height: 40px;
    color:@font-color-light;
    .back{
        margin-right: 5px;
        font-size: 20px;
        width: 20px;
    }
    >h1{
        font-size: @font-size-l;
        font-weight: 700;
    }
}

.Marquee {
    width: 100%;
    height: 35px;
    overflow: hidden;
    position: relative;
    white-space: nowrap;
 }
 .text {
    position: absolute;
    animation: marquee 10s linear infinite;
 }
 @keyframes marquee {
    from {
        left: 100%;
    }
    to {
        left: -100%
    }
 }
 @keyframes marquee {
    from {
        transform: translateX(100%);
    }
    to {
        transform: translateX(-100%);
    }
 }
</style>