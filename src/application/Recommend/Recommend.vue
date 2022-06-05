<template>
  <div class="content">
    <Scroll class="list" ref="scroll" :onScroll="getConfig">
      <div>
        <Slider :bannerList="bannerList"></Slider>
        <RecommendList :recommendList="recommendList"></RecommendList>
      </div>
      <div v-if="enterLoading">
        <Loading></Loading>
      </div>
    </Scroll>
  </div>
</template>

<script>
import {reactive,ref,onMounted,computed} from 'vue'
import { toRaw } from '@vue/reactivity'
import Slider from '../../components/Slider/Slider.vue'
import RecommendList from '../../components/List/RecommendList.vue'
import Scroll from '../../components/Scroll/Scroll.vue'
import Loading from '../../baseUI/Loading.vue'
import { useStore,mapGetters } from 'vuex' 
export default {
  components:{
    Slider,
    RecommendList,
    Scroll,
    Loading
  },
  data(){
    return {
      bannerList:[],
      // recommendList:[],
      // enterLoading:true
    }
  },
  // computed: {
  //     ...mapGetters([
  //         'bannerListGet',
  //         'recommendListGet',
  //         'enterLoadingGet'
  //     ])
  // },
  // watch: {
  //     bannerListGet(newVal) {
  //       console.log(newVal)
  //       this.bannerList = newVal
  //     },
  //     recommendListGet(newVal){
  //       console.log(newVal)
  //       this.recommendList = newVal
  //     },
  //     enterLoadingGet(newVal){
  //       console.log(newVal)
  //       this.enterLoading = newVal;
  //     }
  // },

  setup(){
    let scroll = ref();
    let store = useStore();
    let bannerList = reactive([]);
    let recommendList = reactive([]);
    let enterLoading = reactive(true)
    store.dispatch('getBannerList')
    store.dispatch('getRecommendList')
    bannerList = toRaw(store.state.Recommend.bannerList);
    recommendList = toRaw(store.state.Recommend.recommendList);
    enterLoading = toRaw(store.state.Recommend.enterLoading);
     
    onMounted(() => {
      // 使用ref调用子组件的方法
      scroll.value.initScroll()
    })

    const getConfig = function(){
      console.log("scroll change")
    }
    return {
      // ...toRefs(data),//使用toRefs会改变原始数据，但是不会触发更新视图 toRef一个道理
      scroll, //一定要返回,
      getConfig,
      bannerList,
      recommendList,
      enterLoading
    }
  }
}
</script>

<style lang="less" scoped>
.content{
  position: fixed;
  top: 90px;
  bottom: 60px;
  width: 100%;
}
</style>