# webpackStudy# webpack是什么
webpack是javascrip应用程序的静态模块打包器(module bundler)
html,js,css,图片
# webpack能做什么
模块化打包<br/>
css,html,js变成一行，去除注释，去除多余引号


# 为什么要选择webpack
1. webpack 进行打包可以解决由于加载太多脚本导致的网络瓶颈，增加脚本的可读性，避免整体文件出现问题。
2. 支持CommonJS和EMS
3. 在node.js的基础上运行，可以在浏览器环境之外使用
4. 


### 创建文件
```
//进入相关的文件夹,使用下面的方法可以创建出三个文件
mkdir config dist src


//创建package文件
npm init -y

//在dist文件中创建index.html文件
//在src文件夹中创建index.js文件



```


## 打包
webpack4直接默认src/index.js文件作为默认入口
```
//使用webpack 进行简单打包
webpack
```
打包完毕后可以看出，dist文件夹中出现了main.js文件，还多了一个node-modules文件夹，但是直接使用webpack打包会出现警告，因为webpack的打包有两种形式：<br/>
1. webpack --mode=development开发环境
2. webpack --mode=production生产环境,代码会产生压缩
3. 

## 删除产生的js文件
#### 然后再config文件夹下创建webpack.dev.js进行配置
```
const path=require("path");
module.exports={
    mode:'development',
    //入口文件的配置项
    entry:{
        //将入口文件设置为src下的main，就不是默认的index文件
        main:'./src/main.js',
        //第二个入口文件
        //main:'./src/main2.js'
    },
    //出口文件的配置
    output:{
        //打包路径,打包的路径一定不要写错，否则会产生一些错误的结果，在运行时可能会出现一些错误
        path:path.resolve(__dirname,'../dist'),
        //打包文件的名称
        filename:'bundle.js'
        //两个入口文件
        //filename:[name].js
    },
    //模块
    module:{},
    //插件
    plugins:[],
    //配置webpack开发服务功能
    devServer:{}
}


//我们已经将默认的index.js文件删除，所以需要在package.json文件中进行配置
"scripts": {
//自定义的信的入口文件
    "build":"webpack --config=config/webpack.dev.js"    
  },
```
然后使用npm run build就可以，但是如果有两个有两个入口文件，就需要进行一些修改，否则会进行报错


###配置webpack-dev-server
```
//在webpack.dev.js文件中的server选项中进行配置
devServer:{
        //设置基本目录结构
        contentBase:path.resolve(__dirname,'../dist'),
        //配置服务器的IP地址，可以使用IP也可以使用localhost
        host:'localhost',
        //设置服务端压缩是否开启
        compress:true,
        //配饰服务端端口号
        port:8080

    }
    
    
//在package.json文件中也需要进行相应的配置
"scripts": {
    "server":"webpack-dev-server --config=config/webpack.dev.js"
  },
```
然后再进行npm run server，成功

## 打包html
打包html需要下载插件 
```
npm install html-webpack-plugin --save-dev
```
```
//引入插件

plugins:[
    new htmlPlugin({
        minify:{    //对html文件进行压缩
            removeAttributeQuetes:true,    //去除属性的双引号
            removeComments:true,    //去除注释
            removeEmptyAttributes:true, //去除空属性
            collapseWhiteSpace:true  //去除空格
        },
        hash:true,      //有效避免缓存js
        template:'./src/index.html'     //打包的html模板路径和文件名称
        
    })
]
```
## 关于css
打包css。需要下载css的loader插件，style-loader和caa-loader
```
npm install style-loader css-loader --save-dev
```
然后在webpack.dev.js文件中进行配置
```
module:{
    //配置css-loader，引入模块
    rules:[
        {
            test:/\.css$/,
            use:[
                {loader:style-loader},
                {loader:css-loader}
            ]
        }
        
    ]
}
```

## 关于js
配置js压缩也需要插件，但是该插件webpack已经默认集成该插件，就不需要进行下载
```
//首先一如该插件
const uglify=require('uglifyjs-webpack-plugin';

//配置webpack-plugin插件
plugins:[
    new uglify()
]
```


## 关于img
如果要打包图片，需要装载机的解析，所以需要下载装载机file-loader和url-loader<br/>
###### file-loader: 
解决路径问题
###### url-loader
提高图片较多时的性能问题，url装载机会引入图片的编码
```
npm install --save-dev file-loader url-loader
```
```
//配置
{
    test:/\.(png|jpg|gif|jpeg)/,    //匹配文件后缀
    use:[{
        loader:'url-loader',   
        loader:'file-loader'
        //指定使用loader和loader的配置参数
        options:{
            limit:500       //当图片小于该值时，会生成一恶搞图片的url,如果是一个大于该值会何时能城一个base64的图片
        }
    }]
}
```
## 分离图片路径
将图片路径进行处理，主要是将css从js中分离出来，解决css中的图片路径不对的问题<br/>
首先需要下载插件，才能实现该功能
<br/>
```
npm install extract-text-plugin --save-dev
```
下载之后需要进行配置和引入
```
//引入插件
const extractTextPlugin=require("extract-text-webpack-plugin");
//配置

plugins:[
    new extractTextPlugin("css/index.css")//index.css分离后的路径
]

//修改加载器配置
{
                test:/\.css$/,
                use: extractTextPlugin.extract({
                    fallback:"style-loader",
                    use:"css-loader"
                })
            }

```

```
npm install --save-dev extract-text-webpack-plugin@next
//提升版本，解决版本不匹配问题
```
打包成功之后，发现路径并没有正确，图片依然不能显示出来，因为还没有对路径进行配置

```
var website={
    publicPath:"http://loaclhost:8888/"
}
//ip地址

//在输出选项中引入对象的publicPath属性
output:{
    publicPath:website.publicPath   //处理静态文件路径
}
//处理图片
{
                test:/\.(jpg|png|jpeg|gif)/,         //配置图片文件的后后缀名
                use:[{
                    loader:'url-loader',        //指定loader和loader的配置参数
                    options:{       
                        limit:500,        //当图片小于该值时，会生成一恶搞图片的url,如果是一个大于该值会何时能城一个base64的图片
                        outputPath:'images/'     //打包后的图片放到imagaes文件夹中
                    }
                }]
               
            }
```
然后下载html引入HTML的<img>标签，需要安装插件
```
npm install html-withimg-loader --save-dev
```
```
{
    test:/\.(html)$/i,
    use:['html-widthimg-loader']
}
```

然后打包能够看到图片打包之后在指定的images文件夹中，图片也成功显示在网页中。




webpack4 学习
