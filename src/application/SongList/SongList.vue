<template>
  <div class="songList">
      <div class="first_line">
                <div class="play_all">
                    <i class="iconfont">&#xe6e3;</i>
                    <span>播放全部<span class="sum">共{{totalCount}}首</span></span>
                </div>
                <div v-if="showCollect" class="add_list">
                    <i class="iconfont">&#xe62d;</i>
                    <span>收藏{{(Math.floor(count/100) / 10)}}万</span>
                </div>
            </div>
            <ul class="songItem">
                <li v-for="(item,index) in songs" :key="item.id" @click="selectItem($event,index)">
                    <span class="index">{{index+1}}</span>
                    <div class="info">
                        <span>{{item.name}}</span>
                        <span >
                            {{item.ar ? getName(item.ar):getName(item.artists)}} - {{item.al?item.al.name : item.album.name}}
                        </span>
                    </div>
                </li>
            </ul>
  </div>
</template>

<script>
import {useStore} from 'vuex'
import {getCurrentInstance} from 'vue'
import {getName} from '../../api/utils'
export default {
    components:{
    },
    props:{
        showCollect:{
            type:Boolean,
            default:false
        },
        songs:{
            type:Array,
            default:[]
        },
        collectCount:{
            type:Number,
            default:0
        },
        musicAnimation:{
            type:Function,
            default:null
        }
    },
    data(){
        return{
            songs:this.songs,
            collectCount:this.collectCount,
            showCollect:this.showCollect
        }
    },
    computed:{
        totalCount(){
            return this.songs.length
        }
    },
    setup(props){
        let instance = getCurrentInstance();
        let store = useStore();
        const {musicAnimation} = props;

        const changePlayListDispatch=(playList)=>{
            store.commit('changePlaylist',playList)
        }
        const changeCurrentIndexDispatch=(currentIndex)=>{
            store.commit('changeCurrentIndex',currentIndex);
        }
        const changeSequencePlayListDispatch=(list)=>{
            store.commit('changeSequencePlayList',list);
        }
        
        const selectItem = (e,index)=>{
            changePlayListDispatch(instance.songs);
            changeSequencePlayListDispatch(instance.songs);
            changeCurrentIndexDispatch(index);
            musicAnimation(e.clientX,e.clientY);
        }

        return {
            getName,
            selectItem
        }
    }
}
</script>

<style lang="less" scoped>
.songList{
        border-radius: 10px;
        opacity: 0.98;
        background: @hightlight-background-color;
        .first_line{
            display: flex;
            box-sizing: border-box;
            padding: 10px 0;
            margin-left: 10px;
            position: relative;
            justify-content: space-between;
            border-bottom: 1px solid @border-color;
            .play_all{
                display: inline-block;
                line-height: 24px;
                color: @font-color-desc;
                .iconfont{
                    font-size: 24px;
                    margin-right: 10px;
                    vertical-align: top;
                }
                .sum{
                    font-size: @font-size-s;
                    color: @font-color-desc-v2;
                }
                >span{
                    vertical-align: top;
                }
            }
            .add_list,.isCollected{
                display: flex;
                align-items: center;
                position: absolute;
                right: 0;
                left: 0;
                bottom: 0;
                width: 130px;
                line-height: 34px;
                background: @theme-color-red;
                color:@font-color-light;
                font-size: 0;
                border-radius: 3px;
                vertical-align: top;
                .iconfont{
                    vertical-align: top;
                    font-size: 10px;
                    margin: 0 5px 0 10px;
                }
                span{
                    font-size: 14px;
                    line-height: 34px;
                }
            }
            .isCollected{
                display: flex;
                background: @background-color;
                color: @font-color-desc;
            }
        }
        .songItem{
            >li{
                display: flex;
                height: 60px;
                align-items: center;
                .index{
                    flex-basis: 60px;
                    width: 60px;
                    height: 60px;
                    line-height: 60px;
                    text-align: center;
                }
                .info{
                     box-sizing: border-box;
                    flex: 1;
                    display: flex;
                    height: 100%;
                    padding: 5px 0;
                    flex-direction: column;
                    justify-content: space-around;
                    border-bottom: 1px solid @border-color;
                    >span:first-child{
                        color:@font-color-desc;
                    }
                    >span:last-child{
                        font-size: @font-size-s;
                        color:#bba8a8;
                    }
                }
            }
        }
    }
</style>