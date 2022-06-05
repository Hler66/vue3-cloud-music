<template>
        <div class="scrollContainer" ref="scrollContainerRef" >
            <slot></slot>
            <div class="pullUpLoading" :style="{display:(pullUpLoading?'':'none')}"><Loading></Loading></div>
            <div class="pullDownLoading" :style="{display:(pullDownLoading?'':'none')}"><Loading></Loading></div>
        </div>
</template>

<script>
import {reactive ,ref,onMounted} from 'vue';
import BScroll from 'better-scroll';
import Loading from '../../baseUI/Loading.vue'
import {debounce} from '../../api/utils'

export default {
    props:{
        direction:{
            type:String,
            default:"vertical"
        },
        click:{
            type:Boolean,
            default:true
        },
        refresh:{
            type:Boolean,
            default:true
        },
        onScroll:{
            type:Function,
            default:null
        },
        pullUp:{
            type:Function,
            default:null
        },
        pullDown:{
            type:Function,
            default:null
        },
        pullUpLoading:{
            type:Boolean,
            default:false
        },
        pullDownLoading:{
            type:Boolean,
            default:false
        },
        bounceTop:{
            type:Boolean,
            default:true
        },
        bounceBottom:{
            type:Boolean,
            default:true
        }

    },
    components:{
        Loading
    },
    setup(props){
        const {direction,click,refresh,bounceTop,bounceBottom} = props;
        const {pullUp,pullDown,onScroll,pullUpLoading,pullDownLoading} = props;
        const scrollContainerRef = ref(null);
        let bScroll = reactive({});
        // 防抖优化
        const debounceScroll =  debounce(onScroll,300);
        const debouncePullUp = debounce(pullUp,3000);
        const debouncePullDown = debounce(pullDown,3000);
        const initScroll = () =>{
            // 使用ref获取dom节点
            bScroll = reactive(new BScroll(scrollContainerRef.value,{
                scrollX:direction === 'horizental',
                scrollY:direction === 'vertical',
                probeType:3,
                click:click,
                bounce:{
                    top:bounceTop,
                    bottom:bounceBottom
                },
                // 加上mouseWheel 才可以鼠标轮子滚动
                mouseWheel: true
            }));
            if(bScroll && onScroll) {
               bScroll.on('scroll',(pos)=>{
                    debounceScroll(pos)
                })
               return ()=>{
                   bScroll.off('scroll')
               }
           }
           if(bScroll && pullUp){
                bScroll.on('scrollEnd',()=>{
                    // 判断是否滑倒底部
                    if(bScroll.y <=bScroll.maxScrollY + 100){
                        // 是否可能产生闭包陷阱
                        debouncePullUp()
                    }
                })
                return ()=>{
                    bScroll.off('scrollEnd')
                }
           }

           if(bScroll && pullDown){
                console.log("]")
               bScroll.on('touchEnd',(pos)=>{
                //    判断用户的下拉动作
                   if(pos.y > 50){
                       debouncePullDown();
                   }
               });
               return ()=>{
                   bScroll.off('touchEnd')
               }
           }
            if(refresh && bScroll){
                bScroll.refresh();
            }
        }
        // setTimeout(()=>{
        //     initScroll();  
        // })
        onMounted(() => {
            // 有用！！！
            setTimeout(()=>{
                initScroll();  
            })
        })
        return {
            bScroll,
            initScroll,
            scrollContainerRef,
            pullUpLoading,
            pullDownLoading
        }
    }
}
</script>

<style lang="less" scoped>
.scrollContainer{
    width: 100%;
    height: 100%;
    overflow: hidden;
    .pullUpLoading{
        position: absolute;
        left: 0;
        right: 0;
        bottom: 5px;
        height: 60px;
        width: 60px;
        margin: auto;
        z-index: 100;
    }
    .pullDownLoading{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        height: 30px;
        margin: auto;
        z-index: 100;
    }
}
</style>