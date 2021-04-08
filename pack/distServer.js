const WebpackDevServer = require('webpack-dev-server');
const express=require("express");
const fs=require("fs");
const path = require('path');
const url = "";
// const url = "10.4.91.218";
const port = 8888;
let opened = false;
let urlPorts={
    "test.zhktdata.changyan.com":"localhost:8888"
}
const webpack = require('webpack');
new WebpackDevServer(
    webpack({
        entry:{
            main:"./test.js"
        },
        output:{
            path:path.join(__dirname, `../test/`),
        }
    }), {
        inline: false,
        hot: false, //热更新
        quiet: true,
        port: port, //设置端口号
        progress: false, //显示打包的进度
        proxy: {
            // "http://test.zhktdata.changyan.com/": {
            //     target:'http://test.zhktdata.changyan.com/',//mock地址代理
            //     secure: false,
            //     changeOrigin: true,
            //         pathRewrite: {
            //         }
            // },
            // "/zhkt-data-service": {
            //     target:'http://172.31.7.15:30334',//测试环境代理
            //     // targer:'http:test.zhktdata.changyan.com',
            //     secure: false,
            //     changeOrigin: true,
            //         pathRewrite: {
            //           '^/zhkt-data-service': '/zhkt-data-service'
            //         }
            // }
        },
        setup(app, ctx) {
            app.get("*",function(req, res, next){
                let fileUrl=path.join(__dirname, '../dist/');
                let askIndex=String(req.url).indexOf("?");
                if(askIndex>=0){
                    fileUrl=path.join(fileUrl, String(req.url).substr(0,askIndex));
                }else{
                    fileUrl=path.join(fileUrl, req.url);
                }

                let fileData="";
                console.log(path.extname(fileUrl),path.extname(fileUrl).substr(0,3)===".js");
                try {
                    if(path.extname(fileUrl).substr(0,5)===".html" || path.extname(fileUrl).substr(0,3)===".js"){
                        fileData=fs.readFileSync(fileUrl).toString();
                        for(var name in urlPorts){
                            let index=fileData.indexOf(name,0);
                            console.log("replace---->",index);
                            while(index>=0){
                                fileData=fileData.replace(name,urlPorts[name]);
                                index=fileData.indexOf(name,index+1);
                            }
                        }
                    }
                } catch (e) {
                    console.log(e);
                    fileData=null;
                    next();
                }
                if(!fileData){
                    next();
                }else{
                    if(path.extname(fileUrl).substr(0,5)===".html"){
                        res.set("Content-Type","text/html; charset=utf-8");
                    }else{
                        res.set("Content-Type","application/javascript; charset=utf-8");
                    }
                    res.send(fileData);
                }
            })
            app.use(express.static(path.join(__dirname, '../dist/')));
        }
    }
).listen(port, url, function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(`Listening at http://${url}:${port}`);
});
