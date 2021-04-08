const os = require('os');
const path = require('path');
const axios = require("axios");
const webpack = require('webpack');
const chalk = require("chalk");
const WebpackDevServer = require('webpack-dev-server');
const webpackDevConfig = require('./webpack.config.js')("development");
const allRouter = require('../src/router.js');
const filePlusFun = require("./fsWebpackPlugin.js");
let filePlus = new filePlusFun();
const ip = require('ip');
 const IP = ip.address();

const url = "";
// const url = "10.4.91.218";
const port = 7777;
let opened = false;
process.env.NODE_ENV = 'development';
webpackDevConfig.entry.main.unshift("webpack-hot-middleware/client?reload=true&" + `http://${url}:${port}`);
webpackDevConfig.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
webpackDevConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
webpackDevConfig.plugins.push(new webpack.NoEmitOnErrorsPlugin());
webpackDevConfig.output.path = path.join(__dirname, "./");
var indexPath=`http://${url}:${port}/index.html`;
var indexFilePath="/"+path.basename(indexPath);

//更换打包版本信息  区分生产站或是测试站
let buildVersion = `module.exports = function() {this.vertion = 'dev';};`
filePlus.writeFile(path.join(__dirname,"../src/libs/interface/buildVersion.js"),buildVersion,true);

function getIndex(res) {
    axios.get(indexPath).then(resData => {
        res.end(resData.data);
    }).catch(err => {
        res.end(err);
    })
}

function if404(req, res, next) {
    var url=String(req.originalUrl);
    if (url.substr(-5) == ".html" && url!=indexFilePath) {
        getIndex(res);
    } else {
        next();
    }
}

function forRouter(app) {
    this.forEach(item => {
        if (item.children instanceof Array && item.children.length) {
            forRouter.bind(item.children)(app);
        }
        if (item.path !== "*") {
            app.get(item.path, (req, res, next) => {
                console.log(item.path);
                getIndex(res);
            })
        }else{
            app.get("*",if404);
        }
    });
}
const compiler = webpack(webpackDevConfig);
new WebpackDevServer(
    compiler, {
        contentBase: webpackDevConfig.output.path,
        publicPath: webpackDevConfig.output.publicPath,
        inline: true,
        hot: true, //热更新
        quiet: true,
        port: port, //设置端口号
        progress: true, //显示打包的进度
        proxy: {
            // "/zhkt-data-service": {
            //     target:'http://172.31.201.32:8888/xxl-api-admin/mock/run',//mock地址代理
            //     secure: false,
            //     changeOrigin: true,
            //         pathRewrite: {
            //           '^/zhkt-data-service': ''
            //         }
            // },
            "/zhkt-data-service": {
                target:'http://172.31.7.15:30334',//测试环境代理
                // targer:'http:test.zhktdata.changyan.com',
                secure: false,
                changeOrigin: true,
                    pathRewrite: {
                      '^/zhkt-data-service': '/zhkt-data-service'
                    }
            },
            // "/zhkt-data-service": {
            //     target:'http://pre.api.changyan.com',//测试环境代理
            //     // targer:'http:test.zhktdata.changyan.com',
            //     secure: false,
            //     changeOrigin: true,
            //         pathRewrite: {
            //           '^/zhkt-data-service': '/zhkt-data-service'
            //         }
            // },
        },
        setup(app, ctx) {
            app.use(require('webpack-hot-middleware')(compiler));
            app.use(require('connect-history-api-fallback')());
            forRouter.bind(allRouter)(app);
            app.use("*.css",function(req, res, next){
                next();
            })
        }
    }
).listen(port, url, function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(`Listening at http://${url}:${port}`);
});
compiler.hooks.done.tap("done", function(stats) {
    var compilation = stats.compilation;
    Object.keys(compilation.assets).forEach(key => {
        console.log(chalk.blue(key));
    })

    compilation.warnings.forEach(key => {
        console.log(chalk.yellow(key));
    })

    compilation.errors.forEach(key => {
        console.log(chalk.red(`${key}:${stats.compilation.errors[key]}`));
    })
    console.log(chalk.green(`time：${(stats.endTime-stats.startTime)/1000} s\n`) + chalk.white("调试完毕"));

    if (!opened) {
        var cmd = os.platform() == "win32" ? 'explorer' : 'open';
        opened = require('child_process').exec(`${cmd} "http://${url?url:"localhost"}:${port}"`);
    }
})
