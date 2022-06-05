<template>
  <transition
   mode="out-in" 
    appear
    name="fly"
    duration="300">
    <div v-if="isShow" key="singerList" class="container">
        <Header @handleClick="handleClick" ref="header" :title="title"></Header>
        <div class="imgWrapper" ref="imageWrapper" :style="[{background:`url(${artist.picUrl}) no-repeat`},{backgroundSize:'cover'}]">
            <div class="filter"></div>
        </div>
        <div class="collectButton" ref="collectButton">
            <i class="iconfont">&#xe62d;</i>
            <span class="text">收藏</span>
        </div>
        <div class="bgLayer" ref="layer"></div>
        <div class="songListWrapper" ref="songScrollWrapper">
            <Scroll ref="songScroll" :onScroll="handleScroll">
                <SongList 
                :songs="songsOfArtist"
                 :showCollect="false"
                  :musicAnimation="musicAnimation"></SongList>
            </Scroll>
        </div>
        <Loading v-if="loading"></Loading>
        <Player></Player>
        <MusicNote ref="musicNoteRef"></MusicNote>
    </div>
  </transition>
</template>

<script>
import {ref,onMounted,reactive} from 'vue'
import Header from '../../baseUI/Header.vue'
import {getName} from '../../api/utils'
import SongList from '../SongList/SongList.vue'
import Scroll from '../../components/Scroll/Scroll.vue'
import {HEADER_HEIGHT} from '../../api/config'
import { mapGetters ,useStore} from 'vuex'
import {useRoute} from 'vue-router'
import Loading from '../../baseUI/Loading.vue'
import { toRaw } from '@vue/reactivity'
import MusicNote from '../../baseUI/music-note.vue'
import Player from '../Player/Player.vue'
export default {
    props:{
    },
    components:{
        Header,
        SongList,
        Scroll,
        Loading,
        MusicNote,
        Player
    },
    data(){
        return {
            // artist:{},
            // songsOfArtist:[]
        }
    },
    methods:{
         handleClick(){
            this.$router.go(-1)
        }
    },
    // 无法成功监听
    // computed:{
    //   ...mapGetters([
    //     'artist',
    //     'songsOfArtist'
    //     ])
    // },
    // watch:{
    //   artist(newVal){
    //     // 没有成功触发
    //     console.log(newVal)
    //     this.artist = newVal;
    //   },
    //   songsOfArtist(newVal){
    //     console.log(newVal)
    //     this.songsOfArtist = newVal
    //   }
    // },
    setup(){
      const store =useStore()
        let route = useRoute()
        let isShow = ref(true)
        let title = ref('返回');
        const collectButton = ref(null);
        const imageWrapper = ref(null);
        const songScrollWrapper = ref(null);
        const songScroll = ref(null);
        const header = ref(null);
        const layer = ref(null);
        let artist = reactive({});
        let songsOfArtist = reactive([]);

        let loading = ref(true);

        let musicNoteRef = ref(null);

        const initialHeight = ref(0);
        const OFFSET =5 ;
        store.dispatch('getSingerInfo',route.params.id)
        loading.value = store.state.Singer.loading;
        artist = toRaw(store.state.Singer.artist);
        songsOfArtist = toRaw(store.state.Singer.songsOfArtist);

        const handleScroll=(pos)=>{
            let height = initialHeight.value;
            const buttonDOM = collectButton.value;
            const newY = pos.y;
            const imageDOM = imageWrapper.value;
            const headerDOM = header.value;
            const layerDOM = layer.value;
            const minScrollY = -(height - OFFSET) + HEADER_HEIGHT;
            // 滑动距离占图片高度的百分比
            const percent = Math.abs(newY / height);
            if (newY > 0) {
                console.log("1")
                imageDOM.style["transform"] = `scale(${1 + percent})`;
                buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`;
                layerDOM.style.top = `${height - OFFSET + newY}px`;
                // 往上移动，但是遮罩还没有超过Header部分
            } else if (newY >= minScrollY) {
                console.log("2")
                layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`;
                //这时候保证遮罩的层叠优先级比图片高，不至于被图片挡住
                layerDOM.style.zIndex = 1;
                imageDOM.style.paddingTop = "75%";
                imageDOM.style.height = 0;
                imageDOM.style.zIndex = -1;
                //按钮跟着移动且渐渐变透明
                buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`;
                buttonDOM.style["opacity"] = `${1 - percent * 2}`;
                // 往上移动，但是遮罩超过Header部分
            } else if (newY < minScrollY) {
                console.log("3")
                //往上滑动，但是超过Header部分
                layerDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`;
                layerDOM.style.zIndex = 1;
                //防止溢出的歌单内容遮住Header，Header在遮罩上面
                headerDOM.style.zIndex = 100;
                //此时图片高度与Header一致
                imageDOM.style.height = `${HEADER_HEIGHT}px`;
                imageDOM.style.paddingTop = 0;
                imageDOM.style.zIndex = 99;
            }
        }


        onMounted(() => {
            let h = imageWrapper.value.offsetHeight;
            console.log(songScrollWrapper.value)
            songScrollWrapper.value.style.top = `${h - OFFSET}px`;
            initialHeight.value = h;
            // 把遮罩放到下面，包住歌曲列表
            layer.value.style.top = `${h - OFFSET}px`;
            // console.log(songScroll)
            // songScroll.value.refresh();
        })

        const musicAnimation = (x, y) => {
            console.log(musicNoteRef.value.startAnimation)
            musicNoteRef.value.startAnimation({ x, y });
        };
        return {
            isShow,
            title,
            getName,
            collectButton,
            imageWrapper,
            songScroll,
            header,
            layer,
            songScrollWrapper,
            handleScroll,
            loading,
            artist,
            songsOfArtist,
            musicAnimation,
            musicNoteRef
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
    .imgWrapper{
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 75%;
        transform-origin: top; background-size: cover;
        z-index: 50;
        background-size: cover;
        .filter{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(7,17,27,0.3);
        }
    }
    .collectButton{
        position: absolute;
        left: 0;
        right: 0;
        margin:auto;
        box-sizing: border-box;
        width: 120px;
        height: 40px;
        margin-top: -55px ;
        z-index: 50;
        background: @theme-color-red;
        color:@font-color-light;
        text-align: center;
        font-size: 0;
        line-height: 40px;
        border-radius: 3px;
        .iconfont{
            display: inline-block;
            margin-right: 10px;
            font-size: 14px;
            vertical-align: 1px;
        }
        .text{
            display: inline-block;
            font-size: 14px;
            letter-spacing: 5px;
        }
    }
    .bgLayer{
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        background: white;
        border-radius: 10px;
        opacity: 0.5;
        z-index: 50;
    }
    .songListWrapper{
        position: absolute;
        z-index: 50;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        >div {
            position: absolute;
            left: 0;
            width: 100%;
            overflow: visible;
        }
    }
}
</style>