<template>
  <transition :appear="show" mode="out-in"  :duration="300" name="drop">
      <div v-if="show" class="toastWrapper">
          <div class="text" >{{text}}</div>
      </div>
  </transition>
</template>

<script>
import {ref, reactive,getCurrentInstance} from 'vue'
export default {
    props:{
        text:{
            type:String,
            default:''
        }
    },
    computed:{
        text(){
            console.log(this.text)
            return this.text;
        }
    },
    setup(){
        let show = ref(false);
        let timer = reactive('');
        let instance = getCurrentInstance()
        const  showWay=()=>{
            // 防抖处理
            if(timer) clearTimeout(timer)
            show.value = true;
            timer = setTimeout(()=>{
                show.value = false
            },3000)
        }
        return {
            showWay,
            show
        }
        
    }
}
</script>

<style lang="less" scoped>
.drop-enter{
    opacity: 0;
    transform: translate3d(0,100%,0);
}
.drop-enter-active{
    opacity: 1;
    transition: all 0.3s;
    transform: translate3d(0,0,0);
}
.drop-leave-active{
    opacity: 0;
    transition: all 0.3s;
    transform: translate3d(0,100%,0);
}
.toastWrapper{
    position: fixed;
    bottom: 0;
    z-index: 1000;
    width: 100%;
    height: 50px;
    .text{
        line-height: 50px;
        text-align: center;
        color: #fff;
        font-size: @font-size-l;
    }
}
</style>