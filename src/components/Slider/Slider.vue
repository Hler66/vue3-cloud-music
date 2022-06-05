<template>
  <div class="swiper">
    <swiper 
      :modules="modules"
      :space-between="50"
      :pagination="{clickable:true}"
      class="swiper-container"
      :autoplay="{delay:3000}"
      loop
      >
    <swiper-slide v-for="(item,index) in bannerList" :key="index">
      <div class="swiper-nav">
        <img :src="item.imageUrl" alt="推荐"/>
      </div>
    </swiper-slide>
    </swiper>
    <div className="before"></div>
  </div>
</template>

<script>
import {defineComponent} from 'vue'
import {Navigation, Pagination,Autoplay} from 'swiper'
import {Swiper,SwiperSlide } from 'swiper/vue'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay'

export default defineComponent({
    props:{
        bannerList:Array
    },
    components:{
      Swiper,
      SwiperSlide
    },
   setup(props){
     console.log(props.bannerList)
       let bannerList = props.bannerList;
       return {
         bannerList,
         modules:[Navigation,Pagination,Autoplay]
       }
   }
})
</script>

<style lang="less" scoped>
.swiper{
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background: #fff;
    .before{
      position: absolute;
      top: 0;
      height: 60%;
      width: 100%;
      background: @theme-color-red;
    }
  .swiper-container{
    position: relative;
    width: 98%;
    height: 160px;
    overflow: hidden;
    margin: auto;
    border-radius: 6px;
    .swiper-slide{
      width: 100%;
      height: 100%;
      .swiper-nav{
        position: absolute;
        display: block;
        width: 100%;
        height: 100%;
        img{
          width: 100%;
          height: 100%;
        }
      }
      // 没有效果
      .swiper-pagination-bullet-active {
          background: @theme-color-red;
      }
    }
  }
}
</style>