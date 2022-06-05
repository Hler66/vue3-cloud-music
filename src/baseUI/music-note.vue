<template>
  <div class="Iconcontainer" ref="iconsRef">

  </div>
</template>

<script>
import {ref ,onMounted } from 'vue'
import {prefixStyle} from '../api/utils'
export default {
    setup(){
        const ICON_NUMBER = 3;
        const transform = prefixStyle('transform');

        let iconsRef = ref(null);

        const createNode = (txt)=>{
            const template = `<div class="icon_wrapper">${txt}</div>`;
            let tempNode = document.createElement('div');
            tempNode.innerHTML = template;
            return tempNode.firstChild;
        }
        onMounted(() => {
          for (let i = 0; i < ICON_NUMBER; i++){
                let node = createNode(`<div class="iconfont">&#xe642;</div>`);
                iconsRef.value.appendChild(node);
            }
            // 类数组转换成数组，当然也可以用 [...xxx] 解构语法或者 Array.from ()
            let domArray = [].slice.call(iconsRef.value.children);
            domArray.forEach(item => {
            item.running = false;
            console.log(item)
            item.addEventListener('transitionend', function() {
                this.style['display'] = 'none';
                this.style[transform] = `translate3d(0, 0, 0)`;
                this.running = false;
                let icon = this.querySelector('div');
                icon.style[transform] = `translate3d(0, 0, 0)`;
            }, false);
            });  
        });
        const startAnimation = ({x, y}) => {
            for (let i = 0; i < ICON_NUMBER; i++) {
                let domArray = [].slice.call(iconsRef.value.children)
                let item = domArray[i]
                // 选择一个空闲的元素来开始动画
                if (item.running === false) {
                    item.style.left = x + "px";
                    item.style.top = y + "px";
                    item.style.display = "inline-block";
                    setTimeout (() => {
                            item.running = true;
                            item.style[transform] = `translate3d(0, 750px, 0)`;
                            let icon = item.querySelector("div");
                            icon.style[transform] = `translate3d(-40px, 0, 0)`;
                        }, 20);
                    break;
            }
        }
        };
        return {
            iconsRef,
            startAnimation
        }
    }
}
</script>

<style lang="less" scoped>
.Iconcontainer{
    .icon_wrapper{
        background: red;
        position: fixed;
        z-index: 1000;
        margin-top: -10px;
        margin-left: -10px;
        color: @theme-color-red;
        font-size: 14px;
        display: none;
        transition: transform 1s cubic-bezier(.62,-0.1,.86,.57);
        transform: translate3d(0, 0, 0);
        >div {
            transition: transform 1s;
        }
    }
}

</style>