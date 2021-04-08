<!-- 周统计小模块 -->
<template>
    <div class="week-statistics">
        <ul class="block-list" :class="{ 'wrap': ifSmallScreen }">
            <li class="block-item" :class="[ ifSmallScreen ? 'two-line' : 'one-line' ]" v-for="(bItem, bIdx) in blockList" :key="bIdx">
                <!-- 数据块 -->
                <div class="block" :class="{ 'red': bItem.trend === '下降' && !(isSingleSchool && bIdx === 2), 'blue': bItem.trend === '稳定' || (isSingleSchool && bIdx === 2), 'green': bItem.trend === '上升' && !(isSingleSchool && bIdx === 2),  }" @click="expandActivity(bIdx)">
                    <div class="tip" v-if="!(isSingleSchool && bIdx === 2)">{{ bItem.tip }}</div>
                    <div class="icon-img" :class="bItem.img">
                    </div>
                    <div class="text-wrapper">
                        <div class="line">
                            <span class="per-big" @click="clickBlock('big', bIdx, bItem.weekName)">{{ bItem.bigPer }}</span>
                            <span v-if="!(isSingleSchool && bIdx === 2)" class="status">
                                <i v-if="bItem.trend !== '稳定'" :class="{ 'sanjiao-xia': bItem.trend === '下降', 'sanjiao-shang': bItem.trend === '上升' }"></i>
                                <span class="per-small">{{ bItem.smallPer }}</span>
                            </span>
                        </div>
                        <div class="bottom-line">
                            <!-- <span class="percent" @click="clickBlock('per', bIdx, bItem.weekName)">{{bIdx == 2 ? (isSingleSchool ? `${ bItem.weekName }授课次数` : `${ bItem.weekName }${ bItem.type }活跃率/共${ bItem.num }个班级`) : `${ bItem.weekName }${ bItem.type }活跃率/${ bItem.num }人活跃`}}</span> -->
                            <span class="percent" @click="clickBlock('teaching', bIdx, bItem.weekName)" v-if="bIdx == 2 && isSingleSchool">{{ bItem.weekName }}授课次数</span>
                            <span class="percent" v-if="bIdx === 2 && !isSingleSchool">
                                <span @click="clickBlock('classRate', bIdx)">{{ bItem.weekName }}{{ bItem.type }}活跃率</span>/<span @click="clickBlock('classNum', bIdx)">共{{ bItem.num }}个班级</span>
                            </span>
                            <span class="percent" v-if="bIdx !== 2">
                                <span @click="clickBlock('rate', bIdx)">{{ bItem.weekName }}{{ bItem.type }}活跃率</span>/<span @click="clickBlock('num', bIdx)">共{{ bItem.num }}人活跃</span>
                            </span>
                            <i class="iconfont icon-xiangxia" :class="[bItem.ifExpand? 'rotate-up' : 'rotate-down']" />
                        </div>
                    </div>
                </div>
                <!-- 活跃人数图表 -->
                <transition name="slide-down">
                    <div class="activity" :class="{'hide-block': !bItem.ifExpand}">
                        <div class="title-unit">
                            <h3 @click="clickChartBlock(bIdx)">{{ bItem.title }}</h3>
                            <span>{{ bItem.unit }}</span>
                        </div>
                        <resourceCom
                            :loadingResource='true'
                            :yData='bItem.lineChart.lineseries'
                            :xData='bItem.lineChart.linexData'
                            :index="bIdx"
                            :units="units[0]"
                            :isShade="true"
                            :dataZoomStep="7"
                            :showDataZoom="true"
                            :gridLeft="32"
                            :gridRight="48"
                            :gridBottom="68"
                            symbol="none"
                        ></resourceCom>
                    </div>
                </transition>
            </li>
            <li v-if="!fromQuery && isSingleSchool" class="data-full" :class="[ ifSmallScreen ? 'two-line' : 'one-line', currentTheme === 'darkTheme' ? 'dark-bg' : 'light-bg' ]" @click='goToBigDataBoard'>
                <img v-if="currentTheme === 'darkTheme'" src="@/libs/images/workDeak/data-full-dark.svg" alt="">
                <img v-else src="@/libs/images/workDeak/data-full.svg" alt="">
                <div class="data-text">数据全景</div>
            </li>
        </ul>
    </div>
</template>

<script>
import resourceCom from "./resourceline.vue";
import { mapState,mapMutations } from 'vuex'
export default {
    name: '',
    props: {
        // 是否是小于1366的屏幕
        ifSmallScreen: {
            type: Boolean,
            default: false
        },
        // 是否是单校校长
        isSingleSchool: {
            type: Boolean,
            default: true
        },
        // 周活跃数据列表
        blockList: {
            type: Array,
            default() {
                return []
            }
        },
        // 学校id
        schoolId: {
            type: String,
            default: ''
        },
        // 用户
        userId: {
            type: String,
            default: ''
        },
        // 埋点方法
        setBurialEvent: {
            type: Function
        }
    },
    components: {
        resourceCom
    },
    data() {
        return {
            fromQuery:"",//轻智课跳转不显示大数据看板
            units: [{
                    yNames: ['',''],
                    xUnit: ['','']
                }]
        }
    },
    computed: {
        ...mapState(["currentTheme"]) 
    },
    mounted () {

        if(sessionStorage.getItem('fromPage')){
            this.fromQuery = sessionStorage.getItem('fromPage');
        }
    },
    created() {
        this.isPad();
        this.setIsLogoTheme(this.currentTheme);
    },
    methods: {
        ...mapMutations(['setIsLogoTheme']),
        // 教师学生和班级的图表展开
        expandActivity (bIdx) {
            // this.$set(this.blockList[bIdx], 'ifExpand', !this.blockList[bIdx].ifExpand)
            let ifExpand = !this.blockList[bIdx].ifExpand
            this.$emit('expandChange', ifExpand)
        },
        // 点击展开的图表的title
        clickChartBlock(bIdx) {
            // 展开教师活跃人数时，右侧指标跳到那一部分
            let arr = this.isSingleSchool ? [3, 6, 9] : [17, 19, 20]
            let name = this.isSingleSchool ? 'president' + arr[bIdx] : 'groupSchool' + arr[bIdx]
            this.$store.commit('setToolTipActive', name)
        },
        // 点击模块
        clickBlock (type, index, weekName) {
            // 点击时，右侧指标跳到那一部分
            let nameType = this.isSingleSchool ? 'president' : 'groupSchool'
            let arr = [0, 0, 0]
            if (type === 'big') {
                arr = this.isSingleSchool ? [2, 5, 7] : [1, 2, 3]
                if (this.isSingleSchool && weekName === '本周') {
                    arr = [2, 5, 8]
                }
            } else if (type === 'teaching') {
                arr = [2, 5, 7]
                if (weekName === '本周') {
                    arr = [2, 5, 8]
                }
            } else if (type === 'classRate') {
                arr = [1, 2, 3]
            } else if (type === 'classNum') {
                arr = [16, 18, '']
            } else if (type === 'rate') {
                arr = this.isSingleSchool ? [2, 5, ''] : [1, 2, 3]
            } else if (type === 'num') {
                arr = this.isSingleSchool ? [1, 4, ''] : [16, 18, '']
            }
            let name = nameType + arr[index]
            this.$store.commit('setToolTipActive', name)
        },
        // 跳数据全景
        goToBigDataBoard(){
            console.log(this.setBurialEvent);
            this.setBurialEvent("201000042",{});
            setTimeout(()=>{
                let myWindow = window.open('/page/hugeDataManage.html'+"?schoolId="+this.schoolId+"&userId="+this.userId);
                myWindow.focus();
            },100)
            // window.open('/page/realTimeDataView.html'+"?schoolId="+this.schoolId+"&userId="+this.userId);
        },
        //判断移动端显示隐藏全景数据
        isPad(){
            if(/iphone|ios|android|ipod/i.test(navigator.userAgent.toLowerCase()) == true ){
                this.fromQuery = 1;
            }
        }
    },
}
</script>
<style lang='less' scoped>
@import '~@/libs/css/mixin.less';
@import '~@/libs/css/theme/theme.less';
.week-statistics {
    .flex-space-between();
    align-items: flex-start;
    padding-top: 32px;
    .block-list {
        width: 100%;
        display: flex;
        align-items: flex-start;
        &.wrap {
            flex-wrap: wrap;
        }
        .block-item {
            overflow: hidden;
            margin-right: 32px;
            position: relative;
            &.one-line {
                // flex: 1;
                // width: 33.33%;
                width: calc((100% - 64px) / 3);
                &:last-child {
                    margin-right: 0;
                }
            }
            &.two-line {
                width: calc((100% - 32px) / 2);
                &:nth-of-type(1),
                &:nth-of-type(3) {
                    margin-right: 16px;
                }
                &:nth-of-type(2) {
                    margin-right: 0;
                    margin-left: 16px;
                }
                &:nth-of-type(3) {
                    margin-top: 32px;
                }
            }
        }
        .block {
            cursor: pointer;
            height:112px;
            border-radius:21px;
            position: relative;
            padding: 16px;
            box-sizing: border-box;
            background: @commonBlockBg;
            div,span{
                cursor: pointer;
            }
            .flex-left();
            .icon-img {
                width: 80px;
                height: 80px;
                border-radius:13px;
                border: 1px solid @newBlockBorderColor;
                background-repeat: no-repeat;
                background-position: center center;
            }
            .teacher {
                background-image: @newIconTeacher;
            }
            .student {
                background-image: @newIconStudent;
            }
            .class {
                background-image: @newIconClass;
            }
            .tip {
                position: absolute;
                top: 0;
                right: 0;
                width:82px;
                height:32px;
                font-weight: 500;
                border-radius:0px 60px 0px 100px;
                padding: 0 0 2px 6px;
                .flex-center()
            }
            .text-wrapper {
                flex: 1;
                padding-left: 24px;
            }
            .line {
                .flex-left();
                align-items: flex-end;
            }
            .per-big {
                font-size:32px;
                line-height: 45px;
                color: @newFontColor;
                font-weight:600;
            }
            .status {
                color: @newLightFontColor;
                padding-left: 22px;
                line-height:25px;
                display: flex;
                padding-bottom: 5px;
                .flex-left();
                i {
                    margin-right: 2px;
                }
                .sanjiao-shang {
                    width: 0;
                    height: 0;
                    border: 6px solid @newGreen;
                    border-left-color: transparent;
                    border-top-color: transparent;
                    border-right-color: transparent;
                }
                .sanjiao-xia {
                    width: 0;
                    height: 0;
                    border: 6px solid @newRed;
                    border-left-color: transparent;
                    border-bottom-color: transparent;
                    border-right-color: transparent;
                    position: relative;
                    top: 6px;
                }
            }
            .per-small {
                font-size: 18px;
                font-weight:400;
            }
            .bottom-line {
                .flex-space-between();
                padding-bottom: 5px;
            }
            .percent {
                font-size:14px;
                font-weight:400;
                color: @newBlockFont;
                line-height:20px;
            }
            .icon-xiangxia {
                font-size: 16px;
                color: @newLightFontColor;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .rotate-up {
                color: @newPrimaryColor;
                transform: rotate(180deg);
            }
            .rotate-down {
                transform: rotate(0);
            }
        }
        .blue {
            .icon-img {
                background-color: @newBlockImgBlue;
            }
            .tip {
                color: @newBlockTipBlue;
                background: @newTipBlueBg;
            }
        }
        .red {
            .icon-img {
                background-color:@newBlockImgRed;
            }
            .tip {
                color: @newBlockTipRed;
                background: @newTipRedBg;
            }
            .status {
                color: @newRed;
            }
        }
        .green {
            .icon-img {
                background-color:@newBlockImgGreen;
            }
            .tip {
                color: @newBlockTipGreen;
                background: @newTipGreenBg;
            }
            .status {
                color: @newGreen;
            }
        }
        .activity {
            width: 100%;
            height:360px;
            background: @commonBlockBg;
            border-radius:21px;
            margin-top: 24px;
            padding: 24px 0;
            &.hide-block {
                position: absolute;
                z-index: -1;
            }
            .title-unit {
                .flex-space-between();
                padding: 0 32px;
                h3 {
                    font-size:18px;
                    font-weight: 700;
                    color:@newFontColor;
                    line-height:25px;
                }
                span {
                    font-size:14px;
                    font-weight:400;
                    color: @newLightFontColor;
                    line-height:20px;
                }
            }
        }
    }
    .data-full {
        width: 112px;
        height: 112px;
        // background: @dataFullBg no-repeat center center/contain;
        .flex-left();
        flex-direction: column;
        padding-top: 30px;
        cursor: pointer;
        &.dark-bg {
            background: url('~@/libs/images/workDeak/data-full-bg-dark.png') no-repeat center center/contain;
        }
        &.light-bg {
            background: url('~@/libs/images/workDeak/data-full-bg.png') no-repeat center center/contain;
        }
        &.two-line {
            margin-top: 32px;
            margin-left: 16px;
        }
        .data-text {
            font-size:14px;
            font-weight:600;
            color:@newPrimaryColor;
            line-height:20px;
            text-align: center;
            padding-top: 10px;
        }
    }
}
.slide-down-enter-active,
.slide-down-leave-active {
    transition: all .5s ease;
    height: 267px;
}
.slide-down-enter,
.slide-down-leave-to {
    transition: all .5s ease;
    opacity: 0;
    height: 0;
}
</style>