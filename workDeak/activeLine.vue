<!--
    by: ssfei  2018/11/29
    name: 校长工作台---近30天资源引用情况
    notes:
-->
<template>
    <div class="lineBox">
        <lineChartItem
            :axisConfig='lineChart.axisConfig'
            :axisLabelConfig='lineChart.axisLabelConfig'
            :splitLineConfig='lineChart.splitLineConfig'
            :legendConfig='lineChart.legendConfig'
            :legendData='legendData'
            :tooltipConfig='lineChart.tooltipConfig'
            :xData='xData'
            :series='yData'
            :isShade='lineChart.isShade'
            :smooth='lineChart.smooth'
            :showMarkLine='lineChart.showMarkLine'
            :showMarkLineLabel='true'
            :markLineStyle='lineChart.markLineStyle'
            :markLineData='lineChart.markLineData'
            :fromWorkEfficiency='lineChart.fromWorkEfficiency'
            :xAxisNamePadding='lineChart.xAxisNamePadding'
            :defalutToolTip='false'
            :yInverse='false'
            :gridLeft='40'
            :gridBottom='50'
            :gridRight='20'
            :lineName='lineChart.lineName'
            :fromPage='lineChart.fromPage'
            :loading='loadingActive'
        ></lineChartItem>
    </div>
</template>
<script>
import lineChartItem from '@/libs/modules/lineChart/lineChart.vue';
export default {
    props:{
        loadingActive:{
            type:Boolean,
            default:false
        },
        yData:{
            type:Array,
            default:()=>{
                return []
            }
        },
        xData:{
            type:Array,
            default:()=>{
                return []
            }
        },
        legendData:{
            type:Array,
            default:()=>{
                return []
            }
        }
    },
    data(){
        return{
            lineChart:{
                axisConfig:{
                    yName:'',
                    xName:'',
                },
                axisLabelConfig:{
                    xSeriesDataType:'category',
                    xisNumber:true,
                    yisNumber:true,
                    xsymbol:'%',
                    ysymbol:'%',
                    rotate:0,
                },
                splitLineConfig:{
                    xsplitLineShow:true,
                    ysplitLineShow:false,
                },
                legendConfig:{
                    legendShow:true,
                    legendOrient:['horizontal','right','20'],//'vertical'
                },
                tooltipConfig:{
                    axisPointerType:'line',
                    tooltipShow:true,
                },
                isShade:true,
                smooth:true,
                xAxisNamePadding:[10,0,0,0],
                showMarkLine:false,
                lineName:'workDeakUserTime',
                fromPage:'workDeakUserTime'
            },
        }
    },
    components:{
        lineChartItem,
    },
}
</script>
<style lang="less" scoped>
.lineBox{
    width: 100%;
    height: 100%;
}
</style>


