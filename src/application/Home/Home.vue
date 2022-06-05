<template>
  <div class="top">
    <span class="iconfont menu">&#xe65c;</span>
    <span class="title">vue-cloud-music</span>
    <span class="iconfont search">&#xe62b;</span>
  </div>
  <div class="tab"> 
    <router-link to="/recommend" active-class="selected"><div class="tabItem"><span>推荐</span></div></router-link>
    <router-link to="/singers" active-class="selected"><div class="tabItem"><span>歌手</span></div></router-link>
    <router-link to="/rank" active-class="selected"><div class="tabItem"><span>排行榜</span></div></router-link>
    <!-- <router-view ></router-view> -->
  </div>
  <Player></Player>
  <router-view ></router-view>
</template>

<script>
import Player from '../Player/Player.vue'
import {reactive,toRefs} from 'vue'
export default {
  components:{
    Player
  },
  setup(){
    const data = reactive({
      // isSelectTab:false
    })
    return {
      ...toRefs(data)
    }
  }
}
</script>

<style lang="less" scoped>
.top{
  display: flex;
  flex-direction: row; 
  justify-content: space-between;
  line-height: 44px;
  padding: 5px 10px;//上下5 左右10
  background: @theme-color-red;
  &>span{
    height: 40px;
    color: #f1f1f1;
    font-size: 20px;
    &.iconfont{
      font-size: 25px;
    }
  }
}
.tab{
  display: flex;
  height: 44px;
  flex-direction: row;
  justify-content: space-around;
  background: @theme-color-red;
  line-height: 44px;
  a{
    font-size: 14px;
    color: #e4e4e4;
    padding: 2px 0;
    &.selected{
      span{
        padding: 3px 0;
        font-weight: 700;
        color: #f1f1f1;
        border-bottom: 2px solid #f1f1f1 ;
      }
    }
  }
  &.tabItem{
    height: 100%;
  }
}
</style>