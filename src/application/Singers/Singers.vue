<template>
  <div class="navContainer">
    <HorizenItem :list="list" :oldVal="category" @handleClick="handleUpdateCategory" title="分类(默认热门):"></HorizenItem>
    <HorizenItem :list="alphaTypes" :oldVal="alpha" @handleClick="handleUpdateAlpha" title="首字母:"></HorizenItem>
  </div>
  <div class="listContainer">
    <Scroll :pullUp="handleUp"
            :pullDown="handleDown"
            :pullUpLoading="pullUpLoading"
            :pullDownLoading="pullDownLoading"
            >
      <div class="list">
        <div v-for="(item) in singerList" :key="item.accountId" class="listItem" @click="enterDetail(item.id)">
          <div class="img_wrapper">
            <img :src="item.picUrl+'?param=300x300'" width="100%" height="100%" alt="music" />
          </div>
          <span class="name">{{item.name}}</span>
        </div>
      </div>
    </Scroll>
  </div>
</template>

<script>
import HorizenItem from '../../baseUI/horizen-item.vue'
import {categoryTypes,alphaTypes} from '../../api/data'
import {reactive,toRefs,ref} from 'vue'
import Scroll from '../../components/Scroll/Scroll.vue'
import { mapGetters, useStore } from 'vuex'
export default {
  components:{
    HorizenItem,
    Scroll
  },
  data(){
    return {
      category:'',
      alpha:'',
      singerList:[],
    }
  },
  computed: {
      ...mapGetters([
          'singerGet',
          'pullUpLoading'
      ])
  },
  watch: {
      singerGet(newVal) {
          this.singerList = newVal 
      },
      // pullUpLoading(newVal){
      //   // this.pullUpLoading = newVal
      // }
  },
  methods:{
    // 更新值  子组件请求父组件更新值
    handleUpdateAlpha(val){
      this.alpha = val;
      this.updateDispatch(this.category,val);
    },
    handleUpdateCategory(val){
      this.category = val;
      this.updateDispatch(val,this.alpha)
    },
    handleUp(){
      this.pullUpRefreshDispatch(this.category,this.alpha,this.category === '',this.pageCount)
    },
    handleDown(){
      this.pullDownRefreshDispatch(this.category,this.alpha)
    },
    enterDetail(id){
      this.$router.push(`/singers/${id}`)
    }
  },
  setup(){
    let pageCount = ref(0)
    let pullUpLoading = ref(false);
    let pullDownLoading = ref(false);
    let store = useStore();
    const data = reactive({
      list:categoryTypes,
      alphaTypes:alphaTypes,
    });
    // Dispatch更新
    const getHotSingerDispatch=()=>{
      store.dispatch('getHotSingerList');
    };
    const updateDispatch=(category,alpha)=>{
      store.commit('changePageCount',0);
      pageCount.value = store.state.Singers.pageCount;
      store.commit('setEnterLoading',true);
      store.dispatch('getSingerList',{category,alpha});
    };
    const pullUpRefreshDispatch=(category,alpha,hot,count)=>{
      store.commit('setpullUpLoading',true);
      pullUpLoading.value = store.state.Singers.pullUpLoading;
      store.commit('changePageCount',count+1);
      let a = store.state.Singers.pageCount;
      pageCount.value = a;//value 成功
      if(hot){
        store.dispatch('refreshMoreHotSingerList')
      }else{
        store.dispatch('refreshMoreSingerList',{category,alpha})
      }
    };
   const pullDownRefreshDispatch=(category,alpha)=>{
      store.commit('setpullDownLoading',true);
      pullDownLoading.value = store.state.Singers.pullDownLoading;
      store.commit('changePageCount',0);//重新获取
      pageCount.value = store.state.Singers.pageCount;
      if(category === '' && alpha === ''){
        store.dispatch('getHotSingerList');
      }else{
        store.dispatch('getSingerList',{category,alpha});
      }
    };  

    getHotSingerDispatch();

    //操作数据后更新视图
    return { 
      ...toRefs(data),
      // singerList,
      getHotSingerDispatch,
      updateDispatch,
      pullUpRefreshDispatch,
      pullDownRefreshDispatch,
      pageCount,
      pullUpLoading,
      pullDownLoading
    }
  }

}
</script>

<style lang="less" scoped>
.navContainer{
  box-sizing: border-box;
  position: fixed;
  top: 95px;
  width: 100%;
  padding: 5px;
  overflow: hidden;
}
.listContainer{
  position: fixed;
  top: 160px;
  left: 0;
  bottom: 0;
  overflow: hidden;
  width: 100%;
  .list{
    display: flex;
    margin: auto;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    bottom: 0;
    .title{
      margin: 10px 0 10px 10px;
      color: @font-color-desc;
      font-size: @font-size-s;
    }
    .listItem{
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      margin: 0 5px;
      padding: 5px 0;
      align-items: center;
      border-bottom: 1px solid @border-color;
      .img_wrapper{
        margin-right: 20px;
        img{
          border-radius: 3px;
          width: 50px;
          height: 50px;
        }
      }
      .name{
        font-size: @font-size-m;
        color: @font-color-desc;
        font-weight: 500;
      }
    }
  }
}
</style>