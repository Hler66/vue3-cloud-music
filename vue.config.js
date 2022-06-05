const { defineConfig } = require('@vue/cli-service')
const path = require("path")

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  pluginOptions:{
    'style-resources-loader':{
        preProcessor: 'less',
        patterns: [
            path.resolve(__dirname, './src/assets/global-style.less')
        ]
    }
  },
  devServer:{
    host:'localhost',
    port:8080,
    proxy:{
      '/api':{
        target:'http://localhost:3000',
        changeOrigin:true,
        pathRewrite:{
          '^/api':''
        }
      }
    }
  }
}
)