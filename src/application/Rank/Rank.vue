<template>
  <div class="container">
    <Scroll>
      <div>
        <h1 class="offical" style="">官方榜</h1>
        <ul class="list">
          <li class="listItem" style="display:flex;"  v-for="(item) in officialList" :key="item.coverImgId" @click="enterDetail(item.id)">
            <div class="img_wrapper" style="width:32vw;height:32vw;">
              <img :src="item.coverImgUrl" alt="" />
              <div class="decorate"></div>
              <span class="update_frequency">{{item.updateFrequency}}</span>
            </div>
            <ul class="songList" style="">
              <li  v-for="(item,index) in item.tracks" :key="index" >{{`${index +1 }. ${item.first} - ${item.second}`}}</li>
            </ul>
          </li>
        </ul>
        <h1 class="global">全球榜</h1>
        <ul class="list" style="display:flex;">
          <li class="listItem"  style="width:32vw;height:32vw;"  v-for="(item) in globalList" :key="item.coverImgId" @click="enterDetail(item.id)">
            <div class="img_wrapper" style="width:32vw;height:32vw;">
              <img :src="item.coverImgUrl" alt="" />
              <div class="decorate"></div>
              <span class="update_frequency">{{item.updateFrequency}}</span>
            </div>
            <ul class="songList" v-if="item.tracks">
              <li   v-for="(item,index) in item.tracks" :key="index" >{{`${index +1 }. ${item.first} - ${item.second}`}}</li>
            </ul>
          </li>
        </ul>
      </div>
    </Scroll>
  </div>
</template>

<script>
import {mapGetters, useStore} from 'vuex'
import {filterIndex} from '../../api/utils'
import Scroll from '../../components/Scroll/Scroll.vue'
export default {
  components:{
    Scroll
  },
  data(){
    return {
      officialList:[],
      globalList :[]
    }
  },
  computed:{
    ...mapGetters(
      ['rankListGet']
    )
  },
  watch:{
    rankListGet(rankList){
      let globalStartIndex = filterIndex(rankList);
      this.officialList = rankList.slice(0,globalStartIndex);
      this.globalList = rankList.slice(globalStartIndex);
    }
  },
  methods:{
    enterDetail(id){
      this.$router.push(`/rank/${id}`)
    }
  },

  setup(){
    let store = useStore();
    const getRankListDispatch=()=>{
      store.dispatch('getRankList')
    }
    getRankListDispatch()
    return {
      getRankListDispatch
    }

  }
}
</script>

<style lang="less" scoped>
.container{
  position: fixed;
  top: 90px;
  bottom: 60px;
  width: 100%;
  .offical,.global{
    margin: 10px 5px;
    padding-top: 15px;
    font-weight: 700;
    font-size: @font-size-m;
    color:@font-color-desc;
  }
  .list{
    margin-top: 10px;
    padding: 0 5px;
    // display: ;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    background: @background-color;
    &::after{
      content:'';
      display: block;
      width: 32vw; 
    }
    .listItem{
      // display: ;
      padding: 3px 0;
      border-bottom: 1px solid @border-color;
      .img_wrapper{
        // width: ${props => props.tracks.length ? "27vw": "32vw"};
        //  height: ${props => props.tracks.length ? "27vw": "32vw"};
        border-radius: 3px;
        position: relative;
        .decorate{
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 100%;
          border-radius: 3px;
          background: linear-gradient(hsla(0,0%,100%),hsla(0,0%,43%,.4));
        }
        img{
          width: 100%;
          height: 100%;
          border-radius: 3px;
        }
        .update_frequency{
          position: absolute;
          left: 7px;
          bottom: 7px;
          font-size: @font-size-ss;
          color:@font-color-light;
        }
      }
      .songList{
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 10px;
        >li{
          font-size: @font-size-s;
          color:grey;
        }
      }
    }
  }
}
</style>