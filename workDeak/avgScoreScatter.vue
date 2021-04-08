<!--
    by: ssfei  2018/11/29
    name: 校长工作台---最近一次作业平均分
    notes:
-->
<template>
    <div class="scatterBox">
        <scatter
            :legendData='scatterlegendData'
            :scatterTitle='scatterObj.scatterTitle'
            :xData='scatterXValue'
            :xisNumber='scatterObj.scatterxisNumber'
            :yisNumber='scatterObj.scatteryisNumber'
            :series='scatterYdata'
            :rotate="scatterObj.scatterrotate"
            :axisLineColor='scatterObj.scatteraxisLineColor'
            :tipText="scatterObj.scattertipText"
            :yName='scatterObj.scatteryName'
            :showScope='true'
            :legendOrient='scatterObj.scatterlegendOrient'
            :gridLeft="40"
            :gridRight="30"
            :gridTop="40"
            :gridBottom="40"
            :yAxisMax='scatterObj.yAxisMax'
            :loading='loadingAvgScore'
            :legendWidth="'70%'"
            :idName="'averageScoreScatter'"
        ></scatter>
    </div>
</template>
<script>
import scatter from "@/libs/modules/scatter/scatter.vue"
export default {
    props:{
        loadingAvgScore:{
            type:Boolean,
            default:false
        },
        scatterYdata:{
            type:Array,
            default:()=>{
                return []
            }
        },
        scatterlegendData:{
            type:Array,
            default:()=>{
                return []
            }
        },
        scatterXValue:{
            type:Array,
            default:()=>{
                return []
            }
        }
    },
    data(){
        return{
            scatterObj:{ //散点图数据
                scatterlegendData:[], //
                scatterTitle:'',
                scatterxisNumber:true,
                scatteryisNumber:false,
                scatterrotate:0,
                scatteraxisLineColor:'#5E5F68',
                scattertipText:'',
                scatteryName:'',
                scatterlegendOrient:['horizontal','right','top'],
                yAxisMax:100
            }
        }
    },
    components:{
        scatter,
    },
}
</script>
<style lang="less" scoped>
.scatterBox{
    width: 100%;
    height: 100%;
}
</style>
