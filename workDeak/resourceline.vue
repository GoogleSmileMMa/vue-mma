<!--
    by: ssfei  2018/11/29
    name: 校长工作台---近30天资源引用情况
    notes:
-->
<template>
    <div class="lineBox">
        <lineChartItem
            :axisConfig='axisConfig'
            :axisLabelConfig='resourcelineChart.axisLabelConfig'
            :splitLineConfig='resourcelineChart.splitLineConfig'
            :legendConfig='resourcelineChart.legendConfig'
            :legendData='resourcelineChart.legendData'
            :tooltipConfig='resourcelineChart.tooltipConfig'
            :yAxisPading="yAxisPading"
            :xData='xData'
            :series='yData'
            :units="units"
            :isDoubleY="isDoubleY"
            :isShade='isShade'
            :smooth='resourcelineChart.smooth'
            :showMarkLine='resourcelineChart.showMarkLine'
            :showMarkLineLabel='true'
            :markLineStyle='resourcelineChart.markLineStyle'
            :markLineData='resourcelineChart.markLineData'
            :fromWorkEfficiency='resourcelineChart.fromWorkEfficiency'
            :xAxisNamePadding='resourcelineChart.xAxisNamePadding'
            :defalutToolTip='false'
            :yInverse='false'
            :gridTop='gridTop'
            :gridLeft='gridLeft'
            :gridBottom='gridBottom'
            :gridRight='gridRight'
            :lineName='resourcelineChart.lineName + index'
            :fromPage='fromPage'
            :loading='loadingResource'
            :showDataZoom="showDataZoom"
            :dataZoomStep="dataZoomStep"
            :isShowTick="false"
            :symbol="symbol"
        ></lineChartItem>
    </div>
</template>
<script>
import lineChartItem from '@/libs/modules/lineChart/lineDoubleYline.vue';
export default {
    props:{
        loadingResource:{
            type:Boolean,
            default:false
        },
        yAxisPading:{
            type:Array,
            default:()=>{
                return []
            }
        },
        yData:{
            type:Array,
            default:()=>{
                return []
            }
        },
        units: {
            type:Object,
            default:() => {
                return null
            }
        },
        isDoubleY:{
            type:Boolean,
            default:false
        },
        dataZoomStep:{
            type:Number,
            default:30
        },
        xData:{
            type:Array,
            default:()=>{
                return []
            }
        },
        /**
         * minchen8  2021- 1-12
         * 当一个页面引用多次此图表，如果不加index 区分，会id重复
         */
        index: {
            type: Number,
            default: ''
        },
        showDataZoom: {
            type: Boolean,
            default: false
        },
        gridTop: {
            type: Number,
            default: 40
        },
        gridLeft: {
            type: Number,
            default: 40
        },
        gridBottom: {
            type: Number,
            default: 40
        },
        gridRight: {
            type: Number,
            default: 20
        },
        symbol: {
            type:String,
            default:'circle'
        },
        isShade: {
            type: Boolean,
            default: true
        },
        // 应用模块和趋势分析模块tooltip不一样
        fromPage: {
            type: String,
            default: 'workDeakResourceLine'
        },
        axisConfig: {
            type:Object,
            default:() => {
                return {
                    yName:'',
                    xName:'',
                }
            }
        }
    },
    data(){
        return{
            resourcelineChart:{
                axisLabelConfig:{
                    xSeriesDataType:'category',
                    xisNumber:true,
                    yisNumber:true,
                    xsymbol:'%',
                    ysymbol:'%',
                    rotate:0,
                },
                splitLineConfig:{
                    xsplitLineShow:false,
                    ysplitLineShow:false,
                },
                legendConfig:{
                    legendShow:false,
                    legendOrient:['horizontal','right','top'],//'vertical'
                },
                legendData:['资源引用'],
                tooltipConfig:{
                    axisPointerType:'line',
                    tooltipShow:true,
                },
                linexData:[],
                lineseries:[],
                isShowTick: false,
                smooth:true,
                xAxisNamePadding:[10,0,0,0],
                showMarkLine:false,
                lineName:'workDeakResourceLine',
            },
        }
    },
    components:{
        lineChartItem,
    }
}
</script>
<style lang="less" scoped>
.lineBox{
    width: 100%;
    height: 100%;
}
</style>


