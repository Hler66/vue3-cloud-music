<template>
  <div>
      <Scroll direction="horizental">
        <div ref="category" class="taps"><!--ref="category"-->
            <div class="list">
                <span>{{title}}</span>
                <span v-for="(item) in list" 
                    :class="[{'selected':oldVal === item.key},'listItem']" 
                    @click="handleClick(item.key)" 
                    :key="item.id">
                    {{item.name}}
                </span>
            </div>
        </div>
    </Scroll>
  </div>
</template>

<script>
import Scroll from '../components/Scroll/Scroll.vue'
import {ref,onMounted,reactive,toRef,toRefs,onUpdated } from 'vue'
export default {
    props:{
        list:{
            type:Array,
            default:[]
        },
        oldVal:{
            type:String,
            default:''
        },
        title:{
            type:String,
            default:''
        }
    },
    components:{
        Scroll
    },
    data(){
        return {
            // list:this.list,
            // title:this.title,//放在这个不会触发响应式视图更新
            // HoldVal:this.oldVal
        }
    },
    computed:{
        list(){
            return this.list
        },
        title(){
            return this.title
        }
    }
    ,
    methods:{
        handleClick(key){
            this.$emit('handleClick',key)
        }
    },
    setup(props){
        let data = reactive({
            oldVal:toRef(props,'oldVal')
        })
        let category = ref(null);
        const initDOM = ()=>{
            let categoryDOM = category.value;//获取到DOM
            let tagElems = categoryDOM.querySelectorAll('span');
            let totalWidth = 0;//获取到所有span标签的宽度
            Array.from(tagElems).forEach(ele=>{
                totalWidth += ele.offsetWidth;
            })
            categoryDOM.style.width = `${totalWidth}px`;
        }
        onMounted(() => {
           initDOM()
        })
        return {
            ...toRefs(data),
            category,
        }
    }
}
</script>

<style lang="less" scoped>
.list{
    display: flex;
    align-items: center;
    height: 30px;
    overflow: hidden;
    >span:first-of-type{
        display: block;
        flex: 0 0 auto;
        padding: 5px 0;
        margin-right: 5px;
        color:grey;
        font-size: @font-size-m;
        vertical-align: middle;
    }
    .listItem{
        flex: 0 0 auto;
        font-size: @font-size-m;
        padding: 5px 8px;
        border-radius: 10px;
        &.selected{
            color:@theme-color-red;
            border:1px solid @theme-color-red;
            opacity: 0.8;
        }
    }
}
</style>