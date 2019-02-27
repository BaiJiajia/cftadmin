var GenerateAssetPlugin = require('generate-asset-webpack-plugin'); 
var createServerConfig = function(compilation){
  let cfgJson={ApiUrl:"http://cft.todosoft.com.cn"};
  return JSON.stringify(cfgJson);
}
module.exports = {
      css:{
            loaderOptions: {
                  // 给 sass-loader 传递选项
                  sass: {
                        // @/ 是 src/ 的别名
                        data: `@import "@/assets/style/common.scss";`
                  }
            }
      },
      configureWebpack: {
            plugins: [
                  new GenerateAssetPlugin({
                        filename: 'serverconfig.json',
                        fn: (compilation, cb) => {
                            cb(null, createServerConfig(compilation));
                        },
                        extraFiles: []
                  })
            ]
      },
      baseUrl: process.env.NODE_ENV === 'development'? '/' : '/ydadmin/',
      outputDir: process.env.outputDir
}