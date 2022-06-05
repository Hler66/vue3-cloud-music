<template>
  <div class="listWrapper">
      <h1 class="title">推荐歌单</h1>
      <div class="list">
          <div class="listItem" v-for="(item,index) in recommendList" :key="item.id + index" @click="enterDetail(item.id)">
              <div class="img_wrapper">
                  <div class="decorate"></div>
                  <!-- 加载参数可以减少图片大小 -->
                  <img  v-lazy="item.picUrl+'?params=300x300'" width="100%" height="100%" alt="music"/>
                  <div class="play_count">
                      <i class="iconfont play">&#xe885;</i>
                      <span class="count">{{getCount(item.playCount)}}</span>
                  </div>
              </div>
              <div class="desc">{{item.name}}</div>
          </div>
      </div>
  </div>
</template>

<script>
import {getCount} from '../../api/utils'
export default {
    props:{ 
        recommendList:Array
    },
    methods:{
        enterDetail(id){
            this.$router.push(`/recommend/${id}`);
        }
    },
    setup(props){
        let recommendList = props.recommendList;
        return {
            recommendList, 
            getCount
        }
    }
}
</script>

<style lang="less" scoped>
.listWrapper{
    max-width: 100%;
    .title{
        font-weight: 700;
        padding-left: 6px;
        font-size: 14px;
        line-height: 60px;
    }
    .list{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        
        .listItem{
            width: 32%;
            margin: 2px;
            
            .img_wrapper{
                position: relative;
                // 给白色背景的 图片的文字加一层遮罩
                .decorate{
                    position: absolute;
                    top: 0;
                    width: 100%;
                    height: 35px;
                    border-radius: 3px;
                    background: linear-gradient(hsla(0,0%,43%),hsla(0,0%,100%,0));
                }
                img{
                    width: 100%;
                    height: 100%;
                    border-radius: 4px;
                }
                .play_count{
                    position: absolute;
                    top:2px;
                    right: 2px;
                    font-size: @font-size-s;
                    color:@font-color-light;
                }
            }
            .desc{
                overflow: hidden;
                margin-top: 2px;
                padding: 0 2px;
                height: 50px;
                line-height: 1.4;
                text-align: left;
                font-size: @font-size-s;
                color: @font-color-desc;
            }
        }
    }
}
</style>