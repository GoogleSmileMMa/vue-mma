const fs = require('fs');
const path = require('path');
const filePlusFun = require("./fsWebpackPlugin.js");
let filePlus = new filePlusFun();


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

merge();
