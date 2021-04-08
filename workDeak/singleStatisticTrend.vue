<!-- 单校的统计趋势分析 -->
<template>
    <div class="bottom-chart" :class="[ ifSmallScreen ? 'wrap-style': 'no-wrap-style' ]">
        <div class="chart-wrapper" @click="clickBlock(0)">
            <h3>题库资源使用情况</h3>
            <div class="preparingAnalyseChart">
                <roseChartItem
                    key="roseChartItem1"
                    :options="roseChartLft.optionList"
                    :value="roseChartLft.resourceNum"
                    unit='题'
                    gridTop="center"
                    gridBottom="center"
                    gridRight="center"
                    gridLeft="center"
                    :loading="false"
                ></roseChartItem>
            </div>
        </div>
        <div class="chart-wrapper" @click="clickBlock(1)">
            <h3>教学资源使用情况</h3>
            <div class="preparingAnalyseChart">
                <roseChartItem
                    key="roseChartItem2"
                    :options="roseChartRig.optionList"
                    :value="roseChartRig.resourceNum"
                    unit="次"
                    :gridTop="20"
                    :gridBottom="20"
                    :gridRight="'10%'"
                    :gridLeft="'10%'"
                    :loading="false"
                ></roseChartItem>
            </div>
        </div>
        <div class="chart-wrapper">
            <h3 @click="clickBlock(2)">精品课堂</h3>
            <span class="more" @click='moreCourse'>更多</span>
            <div class="swiper-wrapper" v-show="courseList.length">
                <div class="btn preview" :class="{ 'active': curCourseIndex > 0, 'disabled': curCourseIndex === 0 }" @click="goCoursePreAndNext(-1)">
                    <i class="iconfont icon-xiangzuo"></i>
                </div>
                <div class="btn after" :class="{ 'active': curCourseIndex < courseList.length - 1, 'disabled': curCourseIndex === courseList.length - 1 }" @click="goCoursePreAndNext(1)">
                    <i class="iconfont icon-xiangyou"></i>
                </div>
                <ul class="swiper-list" :style="coursePosition">
                    <li class="swiper-item" v-for="(sItem, sIdx) in courseList" :key="sIdx" @click='goToClassWisdom(sItem)'>
                        <img :src="sItem.url" alt="">
                        <div class="shadow-tip">
                            <div class="left-name">{{ sItem.subjectName || '--' }}——{{ sItem.courseName || '--' }}</div>
                            <div class="left-teacher">{{ sItem.className || '--' }}——{{ sItem.teacherName || '--' }}</div>
                        </div>
                    </li>
                </ul>
            </div>
            <noDataComp v-show="!courseList.length && !loading"></noDataComp>
        </div>
    </div>
</template>

<script>
import {mapMutations} from 'vuex';
const roseChartItem = resolve => resolve(require('@/libs/modules/roseChart/roseChart.vue'));
export default {
    name: 'singleStatisticTrend',
    props: {
        loading: {
            type: Boolean,
            default: true
        },
        // 是否是小于1366的屏幕
        ifSmallScreen: {
            type: Boolean,
            default: false
        },
        // 玫瑰图配置项
        roseChartLft: {
            type: Object,
            default() {
                return null
            }
        },
        roseChartRig: {
            type: Object,
            default() {
                return null
            }
        },
        // 精品课堂数据
        courseList: {
            type: Array,
            default() {
                return []
            }
        }
    },
    components: {
        roseChartItem
    },
    data() {
        return {
            curCourseIndex: 0, // 当前展示的精品课堂item索引
        }
    },
    computed: {
        // 精品课堂的位置样式
        coursePosition () {
            console.log(this.curCourseIndex);
            return {
                left: -290 * this.curCourseIndex + 'px'
            }
        },
    },
    created() {
        
    },
    methods: {
        ...mapMutations([
                'setListPageNum',
                'setSearchValue',
                'setHideBread',
                'setDiscussAreaHei',
                'setBurialEvent'
            ]),
        // 点击模块
        clickBlock (index) {
            // 点击时，右侧指标跳到那一部分
            let name = index === 0 ? 'president20' : index === 1 ? 'president21' : index === 2 ? 'president22' : ''
            this.$store.commit('setToolTipActive', name)
        },
        //跳转到课堂智汇列表
        moreCourse(){
            this.setListPageNum(1);
            this.setSearchValue({});
            this.setHideBread(false);
            // this.$emit('updateView','classWisdomList');
            this.$router.push({
                path:"/page/contentBody/classWisdomList.html",
                query:{
                    from:'workDeak'
                }
            })
        },
        /**
         * 精品课堂前一张和后一张
         * @param num -1 和 1 两个值  分别表示前一页和后一页
         */
        goCoursePreAndNext (num) {
            if (this.curCourseIndex + num < 0 || this.curCourseIndex + num >= this.courseList.length) return
            this.curCourseIndex += num
        },
        /**
         * 跳转到课堂智汇
         * @param  {Object} item 当前课堂信息
         */
        goToClassWisdom(item){
            this.setHideBread(false);
            //从精品课堂跳到课堂智慧，需要设置评论区的高(因看板无面包屑，跳到课堂智慧后，评论区高度取值错误，会多40px，导致评论按钮超出页面区域)
            this.setDiscussAreaHei(true);
            this.setBurialEvent("201000009",{})
            // this.$emit('updateView','classWisdom');
            this.$router.push({
                path:'/page/contentBody/classWisdom.html',
                query: {
                    courseId:item.courseId,
                    from:'workDeak',
                    parentId:'001'
                }

            })
        },
    },
}
</script>
<style lang='less' scoped>
@import './index.less';
</style>