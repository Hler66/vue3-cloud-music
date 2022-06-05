<template>
<transition
    mode="out-in" 
    appear
    name="fly"
    duration="300"
    >
      <div v-if="isShow" key="liveList" class="container">
          <Header id="head" ref="headerEl" @handleClick="handleClick" :isMarquee="isMarquee" :title="title"></Header>
          <Scroll bounceTop="false" :onScroll="handleScroll">
              <div >
                  <div class="topDesc">
                    <div class="background" :style="{background:`url(${currentAlbum.coverImgUrl}) no-repeat`}">
                        <div class="filter"></div>
                    </div>
                    <div class="img_wrapper">
                        <div class="decorate"></div>
                        <img :src="currentAlbum.coverImgUrl" alt=""/>
                        <div class="play_count">
                            <i class="iconfont play">&#xe885;</i>
                            <span class="count">{{subscribedCount}}</span>
                        </div>
                    </div>
                    <div class="desc_wrapper">
                        <div class="title">{{currentAlbum.name}}</div>
                        <div class="person">
                            <div class="avatar" v-if="currentAblum.creator">
                                <img :src="currentAlbum.creator.avatarUrl" alt="" />
                            </div>
                            <div class="name">{{currentAlbum.creator.nickname}}</div>
                        </div>
                    </div>
                </div>
                <div class="menu">
                        <div>
                            <i className="iconfont">&#xe6ad;</i>
                                评论
                        </div>
                        <div>
                            <i className="iconfont">&#xe86f;</i>
                            点赞
                        </div>
                        <div>
                            <i className="iconfont">&#xe62d;</i>
                            收藏
                        </div>
                        <div>
                            <i className="iconfont">&#xe606;</i>
                            更多
                        </div>
                </div>
                <div class="songList">
                    <div class="first_line">
                        <div class="paly_all">
                            <i class="iconfont">&#xe6e3;</i>
                            <span>播放全部<span class="sum">共{{currentAlbum.tracks.length}}首</span></span>
                        </div>
                        <div class="add_list">
                            <i class="iconfont">&#xe62d;</i>
                            <span>收藏{{subCount}}</span>
                        </div>
                    </div>
                    <ul class="songItem">
                        <li v-for="(item,index) in currentAlbum.tracks" :key="index">
                            <span class="index">{{index+1}}</span>
                            <div class="info nowrap">
                                <span>{{item.name}}</span>
                                <span>
                                    {{getName(item.ar)}} - {{item.al.name}}
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
              </div>
              <Player></Player>
          </Scroll>
      </div>
  </transition>
</template>

<script>
import Player from '../Player/Player.vue'
import {onMounted,ref ,getCurrentInstance} from 'vue'
import Header from '../../baseUI/Header.vue'
import Scroll from '../../components/Scroll/Scroll.vue'
import {getCount,getName} from '../../api/utils'
import { mapGetters ,useStore} from 'vuex'
import {useRouter,useRoute} from 'vue-router'
import {HEADER_HEIGHT} from '../../api/config'


export default {
    components:{
        Header,
        Scroll,
        Player
    },
    data(){
        return {
             //mock 数据
            currentAlbum : {
                creator: {
                        avatarUrl: "",
                        nickname: ""
                    },
                    coverImgUrl: "",
                    subscribedCount: 0,
                    name: "",
                    tracks:[
                        {
                            name: "",
                            ar: [{name: ""}, {name: ""}],
                            al: {
                            name: ""
                            }
                        }
                    ]
                }
        }
    },
    computed:{
        subscribedCount(){
            return `${Math.floor(this.currentAlbum.subscribedCount/1000)/10}万`
        },
        subCount(){
            return getCount(this.currentAlbum.subscribedCount)
        },
        ...mapGetters(['currentAblum'])
    },
    watch:{
        currentAblum(newVal){
            this.currentAlbum = newVal;
        }
    },
    methods:{
        handleClick(){
            this.$router.go(-1)
        }
    },
    setup(){
        let store = useStore();
        const route = useRoute();//处理参数
        let id = route.params.id;
        store.dispatch('getAblumList',id)//放在这里会出现时机不对,currentAlbum为null的情况
        let isShow = ref(true);
        let isMarquee = ref(false);
        let title = ref('歌单');
        let headerEl = ref(null);
        let Instance = getCurrentInstance();
        // 滚动逻辑
        const handleScroll = (pos)=>{
            let minScrollY = -HEADER_HEIGHT;
            let percent = Math.abs(pos.y / minScrollY);
            let headerDOM = document.getElementById('head')
            if(pos.y < minScrollY){
                headerDOM.style.backgroundColor = '#d44439';
                headerDOM.style.opacity = Math.min(1,(percent - 1) /2);
                console.log(Instance)
                title.value = Instance.ctx.currentAlbum.name;
                isMarquee.value = true;
            }else{
                headerDOM.style.backgroundColor = "";
                headerDOM.style.opacity = 1;
                title.value = '歌单';
                isMarquee.value = false;
            }
        }
        
        return {
            isShow,
            title,
            getName,
            isMarquee,
            headerEl,
            handleScroll
        }
    }
}
</script>

<style lang="less" scoped>
.fly-enter-active,
.fly-appear-active {
     transform: rotateZ(30deg) translate3d(100%, 0, 0);
}
.fly-leave {
    transform: rotateZ (0deg) translate3d(0, 0, 0);
}
.fly-leave-active {
    transition: transform .3s;
    transform: rotateZ(30deg) translate3d(100%, 0, 0);
}
.container{
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 1000;
    background: @background-color;
    transition: transform .3s;
    transform-origin: right bottom;
    .topDesc{
        background-size: 100%;
        padding: 5px;
        padding-bottom: 50px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
        height: 275px;
        position: relative;
        .background{
            z-index:-1;
            background-size: 100% 100% ;
            position: absolute;
            width: 100%;
            height: 100%;
            filter: blur(20px);
            .filter{
                position: absolute;
                top: 0;
                left: 0;
                z-index:10;
                width: 100%;
                height: 100%;
                background: rgba(7,17,27,0.2);
            }
        }
        .img_wrapper{
            width: 120px;
            height: 120px;
            position: relative;
            .decorate{
                position: absolute;
                top: 0;
                width: 100%;
                height: 35px;
                border-radius: 3px;
                background: linear-gradient(hsla(0,0%,43%,.4),hsla(0,0%,100%,0));
            }
            .play_count {
                position: absolute;
                right: 2px;
                top: 2px;
                font-size: @font-size-s;
                line-height: 15px;
                color: @font-color-light;
                .play {
                    vertical-align: top;
                }
            }
            img{
                width: 120px;
                height: 120px;
                border-radius: 3px;
            }
        }
        .desc_wrapper{
            flex:1;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            height: 120px;
            padding: 0 10px;
            .title{
                max-height: 70px;
                color:@font-color-light;
            }
            .person{
                display: flex;
                .avatar{
                    width: 20px;
                    height: 20px;
                    margin-right: 5px;
                    img{
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }
                }
                .name{
                    line-height: 20px;
                    font-size: @font-size-m;
                    color: @font-color-desc-v2;
                }
            }
        }
    }
    .menu{
        position: relative;
        display: flex;
        justify-content: space-around;
        box-sizing: border-box;
        padding: 0 30px 20px 30px;
        margin: -100px 0 0 0 ;
        >div{
            display: flex;
            flex-direction: column;
            line-height: 20px;
            text-align: center;
            color: @font-color-light;
            z-index: 1000;
            font-weight: 500;
            .iconfont{
                font-size: 20px;
            }
        }
    }
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
}
</style>