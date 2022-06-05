<template>
  <GlobalStyle>
    <IconStyle>
    </IconStyle>
  </GlobalStyle>
  <router-view></router-view>
</template>

<script>
import {GlobalStyle} from './styled'
import {IconStyle} from './assets/iconfont/iconfont'

export default {
  name: 'App',
  components:{
    GlobalStyle,
    IconStyle
  }
}
</script>

<style>
@import "./assets/global-style.less";
</style>
