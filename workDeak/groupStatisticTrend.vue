<!-- 集团校统计趋势分析 -->
<template>
    <ul class='group-statistic-trend'>
        <li class="chart-item" v-for="(cItem, cIdx) in analysisList" :key="cIdx">
            <h3 @click="clickBlock(cIdx, 0)">{{ cItem.title }}</h3>
            <resourceCom
                :key="`resourceCom${cIdx}`"
                :loadingResource='false'
                :yData='cItem.lineChart.lineseries'
                :xData='cItem.lineChart.linexData'
                :isDoubleY="cIdx !== 0"
                :axisConfig="{yName:'（次）',xName:''}"
                :units="units[cIdx]"
                :yAxisPading="[20,24,0,0]"
                :index="cIdx + 20"
                :showDataZoom="true"
                :dataZoomStep="7"
                :gridLeft="32"
                :gridRight="40"
                :gridBottom="68"
                :isShade="false"
                fromPage="trendResourceLine"
                symbol="none"
            ></resourceCom>
            <div class="legend" v-if="cItem.lineChart.lineseries.length">
                <div class="leg-item" @click="clickBlock(cIdx, 0)">
                    <i class="icon"></i>
                    {{ cItem.lineChart.lineseries[1] ? cItem.lineChart.lineseries[1].name : '' }}
                </div>
                <div class="leg-item" @click="clickBlock(cIdx, 1)">
                    <i class="icon"></i>
                    {{ cItem.lineChart.lineseries[0] ? cItem.lineChart.lineseries[0].name : '' }}
                </div>
            </div>
        </li>
    </ul>
</template>

<script>
import resourceCom from "./resourceline.vue";
export default {
    name: 'groupStatisticTrend', // 集团校组件
    props: {
        // 分析统计图表list
        analysisList: {
            type: Array,
            default() {
                return []
            }
        }
    },
    components: {
        resourceCom
    },
    data() {
        return {
            units: [{
                    yNames: ['（次）','（次）'],
                    xUnit: ['次','次']
                },{
                    yNames: ['（次）','（次）'],
                    xUnit: ['次','次']
                },{
                    yNames: ['（人）','（次）'],
                    xUnit: ['人','次']
                }]
        }
    },
    created() {
        console.log(this.analysisList);
    },
    methods: {
        // 点击模块
        clickBlock (cIdx, index) {
            // 点击时，右侧指标跳到那一部分
            let arr = [[10, 11], [12, 13], [14, 15]]
            let name = 'groupSchool' + arr[cIdx][index]
            this.$store.commit('setToolTipActive', name)
        },
        // 组装图表数据
        resetLineData (r, arrItem, name) {
            if(r instanceof Array && r.length){
                var resItem = [
                    {name, data:[]}
                ]
                var tempXData = [];
                r.forEach(item=>{
                    tempXData.push(item.day);
                    resItem[0].data.push(item.activeUserNum);
                });
                arrItem.lineseries = resItem;  //y轴数据
                arrItem.linexData = tempXData;    //x轴数据
            }
        },
    },
}
</script>
<style lang='less' scoped>
@import '~@/libs/css/mixin.less';
@import '~@/libs/css/theme/theme.less';
.group-statistic-trend {
    display: flex;
    justify-content: space-between;
    margin-top: 32px;
    .chart-item {
        width: calc((100% - 52px) / 3);
        height:400px;
        background:@newBlockBg;
        border-radius:21px;
        .flex-center();
        flex-direction: column;
        padding: 24px 0;
        h3 {
            width: 100%;
            color: @newFontColor;
            line-height: 25px;
            font-weight:700;
            font-size:18px;
            padding: 0 32px;
        }
        .legend {
            .flex-space-between();
            justify-content: space-around;
            width: 100%;
            height:20px;
            font-size:14px;
            font-weight:400;
            color: @themeFontColor_4;
            .leg-item {
                .flex-center;
                .icon {
                    width: 16px;
                    height: 2px;
                    border-radius: 1px;
                    background:linear-gradient(90deg,rgba(101,220,146,1) 0%,rgba(36,195,102,1) 100%);;
                    margin-right: 8px;
                }
                &:last-of-type {
                    .icon {
                        background: linear-gradient(270deg,rgba(54,143,255,1) 0%,rgba(103,200,255,1) 100%);;
                    }
                }
            }
        }
    }
}
</style>