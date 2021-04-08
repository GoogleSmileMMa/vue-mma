const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const chalk = require("chalk");
const webpackDevConfig = require('./webpack.config.js')("production");
const filePlusFun = require("./fsWebpackPlugin.js");
let filePlus = new filePlusFun();

require("del")(["./dist/*"]); //删除历史打包数据
process.env.NODE_ENV = 'production';

let log = "";
var routers = require("../src/router.js");
var timer = 0;
//更换打包版本信息  区分生产站或是测试站
let buildVersion = `module.exports = function() {this.vertion = 'preRelease';};`
filePlus.writeFile(path.join(__dirname,"../src/libs/interface/buildVersion.js"),buildVersion,true);

function routerEach(outputPath, file) {
    if (!(this instanceof Array)) return;
    this.forEach(item => {
        if (item.path.substr(-5) == ".html") {
            var s = filePlus.writeFile(path.join(outputPath, item.path), file, true);
        }
        routerEach.bind(item.children)(outputPath, file);
    })
}

function runing() {
    return new Promise((resolve, reject) => {
        timer = setInterval(t => {
            process.stdout.write(".")
        }, 100);
    })
}

function packRun(theme) {
    require("del")([`./${theme.themeName}/*`]); //删除历史打包数据
    const webpackDevConfig= require('./webpack.config.js')("production",theme.themeName);
    let themeflie=`@import "./${theme.themeName}.less";`
    filePlus.writeFile(path.join(__dirname,"../src/libs/css/theme/themeFile.less"),themeflie,true);
    const compiler = webpack(webpackDevConfig);

    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err) {
                reject(err);
            } else {
                Object.keys(stats.compilation.assets).forEach(key => {
                    log += chalk.blue(key) + "\n";
                })
                stats.compilation.warnings.forEach(key => {
                    log += chalk.yellow(key) + "\n";
                })
                stats.compilation.errors.forEach(key => {
                    log += chalk.red(`${key}:${stats.compilation.errors[key]}`) + "\n";
                })
                log += chalk.green(`time：${(stats.endTime-stats.startTime)/1000} s\n`) + "\n";

                var outputPath = webpackDevConfig.output.path;
                var indexPath = path.join(outputPath, "index.html");
                var indexFile = "";
                try {
                    indexFile = filePlus.readFile(indexPath, "utf-8", true);
                    routerEach.bind(routers)(outputPath, indexFile);
                } catch (e) {
                    return reject( new Error(log+"\n"+e.message));
                }
                resolve(log);
            }
        })
    })
}

console.log("正在打包：");
// Promise.race([packRun(), runing()]).then(data => {
//     clearInterval(timer);
//     console.log(data);
// }).catch(err => {
//     console.log(chalk.red(err));
//     process.exit(0);
// })
let themePath="../src/libs/css/theme/"
let themeList=[
    {
        themeName:"dark",
        src:"dark.less",
        default:false
    },
    {
        themeName:"light",
        src:"light.less",
        default:false
    },
    {
        themeName:"qzk",
        src:"qzk.less",
        default:true
    }
]
function merge(){
    console.log("启动合并......");
    themeList.forEach(item=>{
        if(item.default){
            let from=path.join(__dirname,`../${item.themeName}/`);
            let to= path.join(__dirname,"../dist/");
            console.log(from,"------>",to);
            filePlus.copyPath(from,to,true);
            return false;
        }
    })
    themeList.forEach(item=>{
        let from=path.join(__dirname,`../${item.themeName}/page/css/vendor.css`);
        let to= path.join(__dirname,`../dist/page/css/${item.themeName}.css`);
        console.log(from,"------>",to);
        filePlus.copyFile(
            from,
            to,
            true)
    })
    console.log("合并完成");
}
function nextBuildTheme(index){
    if(index>=themeList.length){
        merge();
        return ;
    } ;
    let theme=themeList[index];
    Promise.race([packRun(theme), runing()]).then(data => {
        clearInterval(timer);
        console.log(data);
        nextBuildTheme(index+1);
    }).catch(err => {
        console.log(chalk.red(err));
        process.exit(0);
    })
}
nextBuildTheme(0);
