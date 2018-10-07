const path=require("path");
const uglify=require('uglifyjs-webpack-plugin');  //引入uglufy插件，该插件不需要下载安装，因为webpack是默认已经集成
const htmlPlugin=require('html-webpack-plugin');            //html打包插件
const extractTextPlugin=require('extract-text-webpack-plugin');         //css分离，require导入插件
//配置路径问题
var website={
    publicPath:'http://localhost:8888/'            //IP端口
}

module.exports={
    mode:'development',     //告诉webpack相应的使用内置优化，相应的值有none,development,production(默认)
    //入口文件的配置项
    entry:{         //入口点，使用了main的为简写
        //将入口文件设置为src下的main，就不是默认的index文件
        main:'./src/main.js',
        main:'./src/main2.js'
    },
    //出口文件的配置
    output:{
        //打包路径
        path:path.resolve(__dirname,'../dist'),
        //打包文件的名称
        filename:'[name].js',                //[name]告诉入口文件的名字，打包出来也是同样的名字
       
        publicPath:website.publicPath     //处理静态文件路径
    },
    //模块
    module:{
        rules:[
            //配置css-loader，导入模块
            // {
            //     test:/\.css$/,
            //     use:[
            //         {loader:'style-loader'},
            //         {loader:'css-loader'}
            //     ]
            // },
            {
                test:/\.css$/,
                use: extractTextPlugin.extract({
                    fallback:"style-loader",
                    use:"css-loader"
                })
            },
           
            // {
            //     test:/\.css$/,
            //     use:extractTextPlugin.extract({
            //         fallback:'style-loader',
            //         use:'css-loader'
            //     })
            // },
            {
                test:/\.(jpg|png|jpeg|gif)/,         //配置图片文件的后后缀名
                use:[{
                    loader:'url-loader',        //指定loader和loader的配置参数
                    options:{       
                        limit:500,        //当图片小于该值时，会生成一恶搞图片的url,如果是一个大于该值会何时能城一个base64的图片
                        outputPath:'images/'     //打包后的图片放到imagaes文件夹中
                    }
                }]
               
            },
           {
               test:/\.(htm|html)$/i,
               use:['html-withimg-loader']
           }
        ]
    },
    //插件
    plugins:[
        new uglify(),     //配置uglify对象,js压缩插件
        new htmlPlugin({
            minify:{
                removeAttributeQuotes:true,      //removeAttributeQuotes是卸掉属性的双引号
                removeComments:true,     //去除注释
                removeEmptyAttributes:true,         //去除空属性
                collapseWhitespace:true      //去除空格
            },
            hash:true,      //避免缓存js
            template:'./src/index.html'     //需要进行打包的html模板路径和文件名称
        }),
        new extractTextPlugin('css/index.css')
    ],
    //配置webpack开发服务功能
    devServer:{
        //设置基本目录结构
        contentBase:path.resolve(__dirname,'../dist'),
        //配置服务器的IP地址，可以使用IP也可以使用localhost
        host:'localhost',
        //设置服务端压缩是否开启
        compress:true,
        //配饰服务端端口号
        port:8888

    },
    // target:'node'        //部署目标
}