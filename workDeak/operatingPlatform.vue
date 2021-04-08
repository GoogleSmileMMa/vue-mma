<!--
    by: ssfei  2018/11/29
    name: 校长工作台
    notes:
-->
<template>
    <div class="operatingPlatform" :class="{'pr-20': collapse !== 'open'}" v-if="hasAuthority">
        <div class="iconItem">
            <expandBtn :class="collapse === 'open' ? 'is-collapse' : 'not-collapse'"></expandBtn>
        </div>
        <div class="content">
            <!-- 左侧内容 -->
            <div class="shashow-top"></div>
            <div class="shashow-btm"></div>
            <div class="left-content" ref="leftContent">
                <!-- 顶部 -->
                <div class="top">
                    <h3>您好，{{teacherInfo.teacherName.slice(0, 6)}}{{ teacherInfo.teacherName && teacherInfo.teacherName.length > 6 ? '...' : '' }}{{ ifRole(roleEnName) }}</h3>
                    <ul class="time-list">
                        <li class="time-item" v-for="(tItem, tIdx) in timeList" :key="tIdx" :class="{ active: timeIdx === tIdx }" @click="changeTime(tIdx)">{{ tItem.text }}</li>
                    </ul>
                </div>
                <!-- 周活跃统计部分 -->
                <week-statistics :ifSmallScreen="ifSmallScreen" :isSingleSchool="isSingleSchool" :blockList="blockList" :schoolId="schoolId" :userId="userId" :setBurialEvent="setBurialEvent" @expandChange="expandChange"></week-statistics>
                <!-- tab和对应的切换内容 -->
                <div class="ope-content">
                    <div class="ope-title">
                        <ul class="ope-list">
                            <li class="ope-item" v-for="(tItem, tIdx) in operationList" :key="tIdx" :class="{ 'active': opeIdx === tIdx }" @click="changeOpeTab(tIdx)">
                                {{ tItem.text }}
                            </li>
                        </ul>
                        <chooseBtn :btn-name="chosedGradeName" :drop-list="tabList" ref-name="grade" @exportBtnChoose="recieveGradeChoose"></chooseBtn>
                        <chooseBtn :btn-name="chosedSubjectName" :drop-list="subjectList" ref-name="subject" @exportBtnChoose="recieveSubjectChoose"></chooseBtn>
                    </div>
                    <!-- tab对应的图表内容 -->
                    <ul class="condition-list" :class="[ ifSmallScreen ? 'wrap-style': 'no-wrap-style' ]">
                        <!-- <li class="condition-item" v-for="(cItem, cIdx) in conditionList" :key="cIdx">
                            <span class="rect" :class="cItem.color"></span>
                            <span class="text" :class="{'grey-text': opeIdx === 2}">{{ cItem.textArr[opeIdx] }}</span>
                            <span v-if="!cItem.textArr[opeIdx].includes('·')" class="order" :class="[ cItem.reverse ? 'order-up' : 'order-down']" @click="reverseOrder(cItem)"></span>
                        </li> -->
                        <li class="con-item" :class="{'line': !isSingleSchool || !conditionList[1].textArr[opeIdx]}">
                            <rectItem :c-item="conditionList[0]" :ope-idx="opeIdx" :status="conOrderStatus[opeIdx]" :curIdx="0" :isSingleSchool="isSingleSchool" @clickCondition="clickCondition" />
                            <rectItem v-if="conditionList[1].textArr[opeIdx]" :c-item="conditionList[1]" :ope-idx="opeIdx" :status="conOrderStatus[opeIdx]" :curIdx="1" :isSingleSchool="isSingleSchool" @clickCondition="clickCondition" />
                        </li>
                        <li class="con-item" :class="{'no-padding': !isSingleSchool || !conditionList[1].textArr[opeIdx]}">
                            <rectItem :c-item="conditionList[2]" :ope-idx="opeIdx" :status="conOrderStatus[opeIdx]" :curIdx="2" :showRect="false"/>
                        </li>
                        <li class="con-item" :class="{'line': !isSingleSchool || !conditionList[4].textArr[opeIdx]}">
                            <rectItem :c-item="conditionList[3]" :ope-idx="opeIdx" :status="conOrderStatus[opeIdx]" :curIdx="3" :isSingleSchool="isSingleSchool" @clickCondition="clickCondition" />
                            <rectItem v-if="conditionList[4].textArr[opeIdx]" :c-item="conditionList[4]" :ope-idx="opeIdx" :status="conOrderStatus[opeIdx]" :curIdx="4" :isSingleSchool="isSingleSchool" @clickCondition="clickCondition" />
                        </li>
                    </ul>
                    <div class="chart-div">
                        <div v-if="!isSingleSchool && tsBehaviorData && tsBehaviorData.yAxisData" class="name-fold">
                            <div class="box" @click="nameFold=!nameFold">
                                <span class="newicon" :class="{iconxiangyou:nameFold,iconxiangzuo:!nameFold}"></span>
                                <span class="newicon" :class="{iconxiangzuo:nameFold,iconxiangyou:!nameFold}"></span>
                            </div>
                        </div>
                        <!-- tab对应的图表内容 -->
                        <horizonBar v-if="isSingleSchool"
                        :series="tsBehaviorData"
                        :loading="teachersStudentsLoading" />
                        <boxplotChart v-else :series="tsBehaviorData" :name-fold="nameFold" :loading="teachersStudentsLoading"></boxplotChart>
                        <!-- 图表的滚动遮罩 -->
                        <div class="scroll-mask" v-if="tsBehaviorData && tsBehaviorData.yAxisData && tsBehaviorData.yAxisData.length > 7">
                            <span><i class="newicon iconyidong"/>上下拖拽图表以查看更多</span>
                        </div>
                    </div>
                    <!-- 图表底部tip -->
                    <div class="ope-tip" v-html="opeTipContent[opeIdx]"></div>
                </div>
                <!-- 底部图表和精品课堂 -->
                <singleStatisticTrend v-if="isSingleSchool" :ifSmallScreen="ifSmallScreen" :roseChartLft="roseChartLft" :roseChartRig="roseChartRig" :courseList="courseList" :loading="qualityClassLoading"></singleStatisticTrend>
                <groupStatisticTrend v-else :analysisList="analysisList"></groupStatisticTrend>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState,mapMutations} from "vuex";
import scatterCom from "./avgScoreScatter.vue";
import resourceCom from "./resourceline.vue";
import activeCom from "./activeLine.vue";
import barChart from "@/libs/modules/barChart/barChart.vue";
import expandBtn from "@/libs/modules/toolTips/expandBtnAll.vue";
import {promptCopy} from '@/libs/js/config/index';
import dataUrl from '@/libs/interface/operatingPlatform/operatingPlatform.js'
import context from '@/libs/interface/context.js';
import publicUrl from '@/libs/interface/public.js';
import yearUrl from '@/libs/interface/student/learnInputAnalysis.js'
import MixinDataBuriedPoint from '@/views/contentBody/Mixin/MixinDataBuriedPoint.vue';

import horizonBar from '@/libs/modules/horizonBar'
import horizonInBar from '@/libs/modules/horizonBar/horIndex'
import boxplotChart from '@/libs/modules/boxplotChart'
import weekStatistics from './weekStatistics'
import chooseBtn from './chooseBtn'
import rectItem from './rectItem'
import singleStatisticTrend from './singleStatisticTrend'
import groupStatisticTrend from './groupStatisticTrend'
import {getSubjectListCom} from '@/libs/js/services/services';
import { tipObj } from '@/libs/js/config/toolTips'
import {yestoday, getBeforeOrAfterDate} from '@/libs/js/utils/calcdate';
// 将获取数据的方法整理到一个js文件
import getData from './getData'
console.log(...getData);
export default {
    name:'operatingPlatform',
    mixins: [MixinDataBuriedPoint],
    data(){
        return{
            promptCopy:promptCopy,
            hasAuthority:false,
            loadingActive:true, //近30天活跃用户情况Loading
            loadingAvgScore:true,//最近一次作业平均分Loading
            loadingWorkTime:true,//近7天人均作业累计用时Loading
            loadingcourseList:true,//精品课堂列表loading
            loadingResource:true,//资源loading
            scatterHeight:200,//散点图需要的高度
            teachersStudentsLoading: true,
            swiperOption: {},
            //个人信息及右上角的部分指标数据
            teacherInfo:{
                avatar:'',
                teacherName:'',
                subject:'',
                shareNum: 0,
                smartClassNum: 0,
                smartClassRecordNum: 0
            },
            activeId:'', // 年级id
            tabList:[],
            aveScoreList:[], //散点图数据
            //散点图
            scatterObj:{
                scatterYdata:[],
                scatterlegendData:[],
                scatterXdata:[],
            },
            //柱状图
            barChartObj:{
                verticalDirection:"vertical",//方向
                totalNum:100,//总人数
                barxData:[],//category  请求的数据
                baryData:[],//value 请求的数据
                markLine:false,//是否需要显示markLine
                baryAxisName:'',
                yAxisMinInterval:0
            },
            //折线图数据
            lineChart:{
                linexData:[],
                lineseries:[],
            },
            resourcelineChart:{
                lineseries:[],
                linexData:[],
            },
            //我的课堂数据列表
            courseList:[],
            qualityClassLoading:true,
            seniorityList:[],//课堂智慧排行数据
            ownData:{},//课堂智慧排行老师自己的数据
            allAmount:0,//近30天资源应用次数总数
            rightExpand: false, // 默认右侧数据是收起的
            timeIdx: 1, // 当前时间索引 默认显示近30天数据
            timeList: [ // 顶部的时间切换list
                {
                    text: '近7天',
                    id: 1
                },
                {
                    text: '近30天',
                    id: 2
                },
                {
                    text: '本学期',
                    id: 3
                },
                {
                    text: '本学年',
                    id: 4
                },
            ],
            blockList: [ // 顶部的三个block
                {
                    img: 'teacher',
                    num: '',
                    bigPer: '',
                    smallPer: '',
                    type: '教师',
                    tip: '',
                    trend: '稳定',
                    weekName: '',
                    title: '教师活跃人数',
                    unit: '（单位：人）',
                    ifExpand: false,
                    lineChart: {
                        lineseries: [],
                        linexData: [],
                    }
                },
                {
                    img: 'student',
                    num: '',
                    bigPer: '',
                    smallPer: '',
                    type: '学生',
                    tip: '',
                    trend: '上升',
                    weekName: '',
                    title: '学生活跃人数',
                    unit: '（单位：人）',
                    ifExpand: false,
                    lineChart: {
                        lineseries: [],
                        linexData: [],
                    }
                },
                {
                    img: 'class',
                    num: '',
                    bigPer: '',
                    smallPer: '',
                    type: '班级',
                    tip: '',
                    trend: '',
                    weekName: '',
                    title: '班级活跃个数',
                    unit: '（单位：个）',
                    ifExpand: false,
                    lineChart: {
                        lineseries: [],
                        linexData: [],
                    }
                },
            ],
            opeIdx: 0, // 课堂授课资源分享作业布置切换的index
            operationList: [ // 中间的tab切换list
                {
                    text: '课堂授课',
                    id: 1
                },
                {
                    text: '资源分享',
                    id: 2
                },
                {
                    text: '作业布置',
                    id: 3
                }
            ],
            chosedGradeName: '全部年级', // 选中的年级名称
            chosedGradeCode: '', // 选中的年级名称
            chosedSubjectName: '全部学科', // 选中的学科名称
            chosedSubjectCode: '', // 选中的学科名称
            subjectList: [], // 学科数组列表
            //玫瑰图
            roseChartLft:{
                optionList:[],
                resourceNum:[]
            },
            roseChartRig:{
                optionList:[],
                resourceNum:[]
            },
            ifSmallScreen: false, // 是否是1366的小屏
            teacherStudentData: [], // 里面有三组数据，分布是课堂授课，资源分享和作业布置
            conOrderStatus: [ // 里面三个对象，存放的是课堂授课，资源分享和作业布置的排序条件
                {
                    oIdx: 1,
                    reverse: true
                },
                {
                    oIdx: 0,
                    reverse: true
                },
                {
                    oIdx: 0,
                    reverse: true
                }
            ],
            opeTipContent: ['','',''], // 师生关联的tip内容
            analysisList: [ // 集团校的三个分析图表list
                {
                    title: '授课次数分析',
                    lineChart: {
                        lineseries: [],
                        linexData: [],
                    }
                },
                {
                    title: '资源使用分析',
                    lineChart: {
                        lineseries: [],
                        linexData: [],
                    }
                },
                {
                    title: '作业布置分析',
                    lineChart: {
                        lineseries: [],
                        linexData: [],
                    }
                },
            ],
            params: {
                startDate: '', // 日期筛选的开始时间
                endDate: '' // 日期筛选的结束时间
            },
            termTime: { // 本学期的开始时间和结束时间
                startDate: '',
                endDate: ''
            },
            academicYear: { // 本学年的开始时间和结束时间
                startDate: '',
                endDate: ''
            },
            schoolId: '',
            schoolName: '',
            nameFold:true,
            tsBehaviorData: null, // 师生互动行为数据
            academicYearId: ''

        }
    },
    components:{
        barChart,
        scatterCom,
        resourceCom,
        activeCom,
        weekStatistics,
        horizonBar,
        horizonInBar,
        boxplotChart,
        chooseBtn,
        rectItem,
        singleStatisticTrend,
        groupStatisticTrend,
        expandBtn
    },
    computed:{
        ...mapState(['collapse']),
        userId(){
            return this.$store.state.userInfo.userId;
        },
        isClickTab(){
            return this.$store.state.isClickTab;
        },
        // 账号的角色名称
        roleEnName(){
            return this.$store.state.userInfo.roleEnName;
        },
        // 是否是单校校长校长
        isSingleSchool(){
            let res =this.schoolId.indexOf(',') === -1
            this.setIsSingleSchool(res)
            // 当为集团校的时候，condition默认选中的为第0个
            this.$set(this.conOrderStatus[0], 'oIdx', 0)
            return res
        },
        // 师生互动当前sort
        tsSort () {
            return this.conOrderStatus[this.opeIdx].reverse ? 'desc' : 'asc'
        },
        // 师生互动当前条件项
        tsField () {
            return this.tsArgList[this.opeIdx][this.conOrderStatus[this.opeIdx].oIdx]
        },
        tsArgList() {
            let list = this.isSingleSchool ? [ // 师生互动模块的参数
                ['shoukeCount', 'interactionNum', '', 'involvedPercent', 'rightPercent'],
                ['shareCount', '', '', 'studyNum', ''],
                ['hmNum', 'appraiseRate', '', 'submitRate', 'scoreRate']
            ] : [
                ['resReadRate', '', '', 'shareCount', ''],
                ['shareCount', '', '', 'resReadRate', ''],
                ['appraiseRate', '', '', 'submitRate', '']
            ]
            return list
        },
        // 条件列表
        conditionList () {
            let list = this.isSingleSchool ? [
                {
                    textArr: ['教师授课次数', '教师分享班级资源次数', '教师布置作业次数'],
                    color: 'gra-blue',
                    reverse: false
                },
                {
                    textArr: ['教师发布互动次数', '', '教师作业批改率'],
                    color: 'gra-yellow',
                    reverse: false
                },
                {
                    textArr: [`${this.chosedGradeName}·${this.chosedSubjectName}`, `${this.chosedGradeName}·${this.chosedSubjectName}`, `${this.chosedGradeName}·${this.chosedSubjectName}`],
                    reverse: false
                },
                {
                    textArr: ['学生互动参与率', '学生学习班级资源次数', '作业平均提交率'],
                    color: this.opeIdx === 1 ? 'gra-yellow' : 'gra-purple',
                    reverse: false
                },
                {
                    textArr: ['互动答题正确率', '', '作业平均正确率'],
                    color: 'gra-green',
                    reverse: false
                },
            ] : [
                {
                    textArr: ['教师互动授课率', '教师分享资源数', '教师作业批改率'],
                    color: 'gra-blue',
                    reverse: false
                },
                {
                    textArr: ['', '', ''],
                    color: 'gra-yellow',
                    reverse: false
                },
                {
                    textArr: [`${this.chosedGradeName}·${this.chosedSubjectName}`, `${this.chosedGradeName}·${this.chosedSubjectName}`, `${this.chosedGradeName}·${this.chosedSubjectName}`],
                    reverse: false
                },
                {
                    textArr: ['学生互动参与次数', '学生资源查看率', '学生作业提交率'],
                    color: 'gra-yellow',
                    reverse: false
                },
                {
                    textArr: ['', '', ''],
                    color: 'gra-green',
                    reverse: false
                },
            ]
            return list
        }
    },
    watch: {
        // 当窗口尺寸改变时，判断小屏的参数变化
        '$store.state.redrawOutIndexPage'(newVal,oldVal){
            // this.ifSmallScreen = document.documentElement.clientWidth < 1367
            this.ifSmallScreen = this.judgeSmallScreen()
        }
    },
    mounted(){
        this.setHideBread(true);
        this.setShowMenuList(false);
        this.setShowRegister(false);
        this.getUserName()
        this.$eventBus.$on('set-school',(id,name)=>{
            this.schoolId = id
            this.schoolName = name
            this.changeTime(1, true)
            this.chosedGradeName = '全部年级'
            this.chosedGradeCode = ''
            this.chosedSubjectName = '全部学科'
            this.chosedSubjectCode = ''
            this.init()
        });
        this.ifSmallScreen = this.judgeSmallScreen()
    },
    created(){
        let userInfo = this.$store.state.userInfo;
        // 设置默认的30天时间参数
        this.changeTime(1, true)
        this.schoolId = userInfo.schoolId
        if (userInfo.roleEnName === 'groupSuperAdministrator' && sessionStorage.getItem('initSchoolList')) {
            this.schoolId = sessionStorage.getItem('initSchoolList')
            this.schoolName = sessionStorage.getItem('initSchoolListName')
        }
        let currentMenuInfo = JSON.parse(sessionStorage.getItem('currentMenuInfo'));
        if (userInfo.roleEnName !=="headmaster"
            && userInfo.roleEnName !=="viceHeadmaster"
            && userInfo.roleEnName !=="admin"
            && userInfo.roleEnName !=="schoolAdministrator"
            && userInfo.roleEnName !=="groupSuperAdministrator") {
            this.$router.replace("/page/contentBody/dataKanban.html");
            return;
        }else if(userInfo.roleEnName=="schoolAdministrator"){
            (this.isClickTab || currentMenuInfo.currentTabId !== '009') ? this.init() : this.$router.replace("/page/contentBody/");
            return;
        }
    },
    destroyed() {
        this.$eventBus.$off('set-school')
    },
    methods:{
        ...mapMutations(["setShowMenuList","setShowRegister","setHideBread",'setDiscussAreaHei','setListPageNum','setSearchValue','setCollapse', 'setToolTips', 'setIsSingleSchool']),
        // 获取账号角色名称 测试说需求中副校长显示为校长
        ifRole(role) {
            switch (role) {
                case 'headmaster':
                    return '校长'
                case 'viceHeadmaster':
                    return '校长' 
                case 'schoolAdministrator':
                    return '管理员老师'
                default:
                    return '老师'
            }
        },
        // 判断是否是小屏左侧内容换行显示
        judgeSmallScreen() {
            this.$nextTick(() => {
                console.log(document.documentElement.clientWidth);
                console.log(this.$store.state.collapse);
                let clWidth = document.documentElement.clientWidth || document.body.clientWidth
                this.ifSmallScreen = clWidth < 1601
            })
        },
        // 初始化需要获取的数据，当时间切换，数据要重新获取
        initData() {
            // 获取教师活跃率和活跃周数据
            this.getClassActivityData(this, this.isSingleSchool, 'teacher', 0)
            this.getClassActivityNum(this, this.isSingleSchool, 'teacher', 0)
            // 获取学生活跃率和活跃周数据
            this.getClassActivityData(this, this.isSingleSchool, 'student', 1)
            this.getClassActivityNum(this, this.isSingleSchool, 'student', 1)
            // 单校和集团校获取的数据不一样
            if (this.isSingleSchool) {
                // 获取单校授课数据和周授课节数
                this.getTeachingChartData(this)
                this.getTeachingNum(this)
                this.getDataQuestionUse(this)
                this.getDataResUseGuide(this)
                this.getLatestClassRecordBySchoolId();//获取精品课堂
            } else {
                // 获取班级活跃率和活跃周数据
                this.getClassActivityData(this, this.isSingleSchool, 'class', 2)
                this.getClassActivityNum(this, this.isSingleSchool, 'class', 2)
                this.getTeachingTimesData(this, this.isSingleSchool)
                this.getResAnalysisGuide(this)
                this.getDataGuideHmAnalysis(this)
            }
            this.updateCharts()
        },
        //初始化接口
        init(){
            // 进入页面的时候将指标说明的值放进store(presidentData是单校指标数据，groupData是集团校指标数据)
            let tipData = this.isSingleSchool ? tipObj.presidentData : tipObj.groupData
            this.setToolTips(tipData)
            this.initData()
            this.getTeacherInfo();//获取校长信息
            this.getGradeListBySchoolId();//获取学校班级列表
            this.getSubjectList() // 获取学科信息
            this.getAcademicYearList() // 获取本学年信息
        },
        // 顶部时间切换
        changeTime (tIdx, ifInit) {
            this.timeIdx = tIdx
            // 默认是展示最近30天内数据
            let time =  getBeforeOrAfterDate(-30, yestoday)
            // 选择不同的时间需要重新计算开始和结束时间
            if (tIdx === 0) {
                time =  getBeforeOrAfterDate(-7, yestoday)
            } else if (tIdx === 1) {
                time =  getBeforeOrAfterDate(-30, yestoday)
            } else if (tIdx === 2) {
                time = [this.termTime.startDate, this.termTime.endDate]
            } else if (tIdx === 3) {
                time = [this.academicYear.startDate, this.academicYear.endDate]
            }
            this.params = {
                startDate: time[0],
                endDate: time[1],
            }
            if (ifInit) return
            this.initData()
        },
        // 周统计图表展开收起
        expandChange (ifExpand) {
            // 点击任一图表打开所有波动趋势图或收起所有波动趋势图
            this.blockList = this.blockList.map(item => {
                item.ifExpand = ifExpand
                return item
            })  
        },
        // 师生互动图表tab切换
        changeOpeTab (tIdx) {
            this.opeIdx = tIdx
            this.updateCharts()
        },
        // 接收选中的年级
        recieveGradeChoose (item) {
            this.chosedGradeCode = item.id
            this.chosedGradeName = item.name
            // 当重新选了年级，应联动更新学科
            this.getSubjectList()
            this.updateCharts()
        },
        // 接收选中的学科
        recieveSubjectChoose (item) {
            this.chosedSubjectCode = item.id
            this.chosedSubjectName = item.name
            this.updateCharts()
        },
        updateCharts() {
            if (this.opeIdx === 0) {
                this.getPrincipalCourseAnalysis(this, this.isSingleSchool, this.tsSort, this.tsField)
            } else if (this.opeIdx === 1) {
                this.getResourceShareData(this, this.isSingleSchool, this.tsSort, this.tsField)
            } else if (this.opeIdx === 2) {
                this.getHomeworkData(this, this.isSingleSchool, this.tsSort, this.tsField)// 获取资源分享数据
            }
        },
        // 点击师生关联行为数据模块
        clickCondition (index, reverse) {
            console.dir(index, reverse);
            this.$set(this.conOrderStatus[this.opeIdx], 'oIdx', index)
            this.$set(this.conOrderStatus[this.opeIdx], 'reverse', reverse)
            // let sort = !reverse ? 'desc' : 'asc'
            // let cList = ['hmNum', 'appraiseRate', '', 'submitRate', 'scoreRate']
            this.teachersStudentsLoading = true
            this.updateCharts()
        },
        
        ...getData,
        // 通过获取到的这周或上周百分比计算tip[-100%,-20%),[-20%,-10%),[-10%,0),0%,(0,10%],(10%,20%],(20%,100%]

        getActivityTip (num) {
            let res = '保持稳定'
            if (num >= -100 && num < -20) {
                res = '较大下降'
            } else if (num >= -20 && num < -10) {
                res = '小幅下降'
            } else if (num >= -10 && num < 0) {
                res = '略微下降'
            } else if (num === 0) {
                res = '保持稳定'
            } else if (num > 0 && num <= 10) {
                res = '略微上升'
            } else if (num > 10 && num <= 20) {
                res = '小幅上升'
            } else if (num > 20 && num <= 100) {
                res = '较大上升'
            }
            return res
        },
        // 师生互动模块的数据整理
        getTsItem (list, idx) {
            let argList = this.tsArgList
            let yAxisData = list.map(item => item.dataName)
            let teacherData = list.map(item => {
                return {
                    val: item[argList[idx][0]] || 0,
                    res: idx === 1 ? null : (item[argList[idx][1]] || 0),
                    label: item.dataName
                }
            })
            let studentData = list.map(item => {
                return {
                    val: item[argList[idx][3]] || 0,
                    res: idx === 1 ? null : (item[argList[idx][4]] || 0),
                    label: item.dataName
                }
            })
            return {
                yAxisData,
                teacher: {
                    name: [this.conditionList[0].textArr[idx], this.conditionList[1].textArr[idx]],
                    data: teacherData
                },
                student: {
                    name: [this.conditionList[3].textArr[idx], this.conditionList[4].textArr[idx]],
                    data: studentData
                }
            }
        },
        getGroupTsItem (list, idx) {
            let yAxisData,teacherData,studentData
            if (idx === 2) {
                yAxisData = list.map(item => item.schoolName)
                teacherData = list.map(item => {
                    return [item.appraiseRateMax ? item.appraiseRateMax.toFixed(1) : 0,item.appraiseRateQ3 ? item.appraiseRateQ3.toFixed(1) : 0,item.appraiseRateMedian ? item.appraiseRateMedian.toFixed(1) : 0,item.appraiseRateQ1 ? item.appraiseRateQ1.toFixed(1) : 0,item.appraiseRateMin ? item.appraiseRateMin.toFixed(1) : 0,item.schoolName,'%']
                })
                studentData = list.map(item => {
                    return [item.submitRateMax ? item.submitRateMax.toFixed(1) : 0,item.submitRateQ3 ? item.submitRateQ3.toFixed(1) : 0,item.submitRateMedian ? item.submitRateMedian.toFixed(1) : 0,item.submitRateQ1 ? item.submitRateQ1.toFixed(1) : 0,item.submitRateMin ? item.submitRateMin.toFixed(1) : 0,item.schoolName,'%']
                })
            } else if (idx === 1) {
                yAxisData = list.map(item => item.schoolName)
                studentData = list.map(item => {
                    return [item.resReadRateMax ? item.resReadRateMax.toFixed(1) : 0,item.resReadRateQ3 ? item.resReadRateQ3.toFixed(1) : 0,item.resReadRateMedian ? item.resReadRateMedian.toFixed(1) : 0,item.resReadRateQ1 ? item.resReadRateQ1.toFixed(1) : 0,item.resReadRateMin ? item.resReadRateMin.toFixed(1) : 0,item.schoolName,'%']
                })
                teacherData = list.map(item => {
                    return [item.shareCountMax || 0,item.shareCountQ3 || 0,item.shareCountMedian || 0,item.shareCountQ1 || 0,item.shareCountMin || 0,item.schoolName,'次']
                })
            } else {
                yAxisData = list.map(item => item.schoolName)
                teacherData = list.map(item => {
                    return [item.resReadRateMax ? item.resReadRateMax.toFixed(1) : 0,item.resReadRateQ3 ? item.resReadRateQ3.toFixed(1) : 0,item.resReadRateMedian ? item.resReadRateMedian.toFixed(1) : 0,item.resReadRateQ1 ? item.resReadRateQ1.toFixed(1) : 0,item.resReadRateMin ? item.resReadRateMin.toFixed(1) : 0,item.schoolName,'%']
                })
                studentData = list.map(item => {
                    return [item.shareCountMax || 0,item.shareCountQ3 || 0,item.shareCountMedian || 0,item.shareCountQ1 || 0,item.shareCountMin || 0,item.schoolName,'次']
                })
            }
            return {
                yAxisData,
                teacher: teacherData,
                student: studentData
            }
        },
        //获取学科
        async getSubjectList(){
            this.subjectList = [];
            let data = await getSubjectListCom ({userId: this.userId, schoolId: this.schoolId.split(',')[0], classId: this.chosedGradeCode});
            console.log(data);
            if (data && data.length ) {
                this.subjectList = data.map(item => {
                    return {
                        name: item.subjectName,
                        id: item.subjectCode
                    }
                })
                this.subjectList.unshift({
                    name: '全部学科',
                    id: ''
                });
            }
        },
        getToolTips(){
            this.isCollapse =!this.isCollapse;
            if(!this.isCollapse){
                this.setCollapse('open');
            }else{
                this.setCollapse('close');
            }
        },
        //获取学期
        getTermListByAcademic(academicId){
            var args = {};
            args.path = yearUrl.getTermListByAcademicUrl;
            args.querys = {
                schoolId:this.schoolId.split(',')[0],
                academicId
            };
            this.$apiAjax.get(args, true, (r) => {
                if(r === 'error'){
                    return false;
                }
                if(r instanceof Array && r.length){
                    let curTime = new Date().getTime()
                    // 按照学期的开始时间小于当前时间来找当前学期
                    // let arr = r.filter(item => new Date(item.startDate).getTime() < curTime)
                    // let len = arr.length - 1
                    // 当前学期根据isShow 为true来判断
                    let arr = r.filter(item => item.isShow)
                    arr = arr.length ? arr : r[0]
                    this.termTime.startDate = arr[0].startDate
                    this.termTime.endDate = arr[0].endDate
                }
            })
        },
        //获取学年
        getAcademicYearList(){
            var args = {};
            args.path = yearUrl.getAcademicYearListUrl;
            args.querys = {
                schoolId:this.schoolId.split(',')[0],
                // schoolId:'1010000001000023686',
            };
            this.$apiAjax.get(args, true, (r) => {
                if(r === 'error'){
                    return false;
                }
                if(r instanceof Array && r.length){
                    // 从学年list中获得当前时间所处的学年
                    let arr = r.filter(item => item.isShow)
                    arr = arr.length ? arr : r[0]
                    this.academicYear.startDate = arr[0].startDate
                    this.academicYear.endDate = arr[0].endDate
                    this.academicYearId = arr[0].academicYearId
                    // 获取学年后获取学期
                    this.getTermListByAcademic(arr[0].academicYearId)
                }
            })
        },
        getUserName(){
            var args = {};
            var self = this;
            args.path = publicUrl.getUserRoleAndBaseInfoUrl;
            args.querys = {
                userId:this.userId
            };
            this.$apiAjax.get(args, true, (data)=> {
                if(data == 'error'){
                    return false;
                }
                if(data.userInfo.roleEnName === 'groupSuperAdministrator'){
                    this.hasAuthority = true;
                    this.$nextTick (tick => {
                        this.init ();
                    })
                } else {
                    this.loadGradeAndClassList()
                }
            })
        },
        //加载班级年级列表
        loadGradeAndClassList () {
            var args = {};
            args.path = publicUrl.getGradeAndClassListUrl;
            args.querys = {schoolId:this.$store.state.userInfo.schoolId,userId:this.$store.state.userInfo.userId}
            this.$apiAjax.get (args, true, (r) => {
                this.hasAuthority = true;
                if (r === 'error') return false;
                if (r instanceof Array && !r.length) {
                    this.$router.replace ({
                        name: '/noAuthority.html',
                        query: {status: 'notclass'}
                    });
                    return false;
                }
                // 有默认年级，但是没有班级的情况检测
                if (Array.isArray (r) && r.length) {
                    let childrenList = r.filter ((item, index) => {
                        return item.children.length === 0;
                    });
                    if (childrenList.length === r.length) {
                        this.$router.replace ({
                            name: '/noAuthority.html',
                            query: {status: 'notclass'}
                        });
                        return false;
                    }
                }
                this.$nextTick (tick => {
                    this.init ();
                })
            })
        },
        //获取工作台的个人信息
        getTeacherInfo(){
            var args = {};
            args.path = dataUrl.getTeacherInfoUrl;
            args.querys = {
                token:this.$store.state.userInfo.token,
                userId:this.$store.state.userInfo.userId,
                schoolId:this.schoolId.split(',')[0],
           };
            this.$apiAjax.get(args, true, (r) => {
                this.teacherInfo.avatar = r.avatar||'';
                this.teacherInfo.teacherName = r.teacherName||'';
                this.teacherInfo.subject = r.subject||'';
            })
        },
        //获取学校的班级列表
        getGradeListBySchoolId(){
            this.scatterObj.scatterseries = [];//获取学校的班级列表如果失败，则清空散点图及柱状图数据，防止不出现无数据图
            this.barChartObj.baryData=[];
            // 重置
            this.tabList = [];
            this.activeId = '';
            var args = {};
            args.path = dataUrl.getGradeListBySchoolIdUrl;
            args.querys = {
                schoolId:this.schoolId.split(',')[0],
            };
            this.$apiAjax.get(args, true, (r) => {
                if(r instanceof Array && r.length){
                    this.tabList = r.map(item=>{
                        return{
                            name:item.gradeName,
                            id:item.gradeCode
                        }
                    });

                    // 在年级数据前加上全部年级
                    this.tabList.unshift({
                        name: '全部年级',
                        id: ''
                    })
                }

            })
        },
        unique(arr){
            var hash=[];
            for (var i = 0; i < arr.length; i++) {
                if(hash.indexOf(arr[i])==-1){
                    hash.push(arr[i]);
                }
            }
            return hash;
        },
        // 组装图表数据
        resetLineData (r, arrItem, name, otherKey, otherName) {
            if(r instanceof Array && r.length){
                var resItem = [
                    {name, data:[]}
                ]
                if (otherKey) {
                   resItem = [
                    {name, data:[]},
                    {name: otherName, data:[]}
                    ] 
                }
                var tempXData = [];
                let otherTemp = []
                r.forEach(item=>{
                    tempXData.push(item.day);
                    resItem[0].data.push(item.activeUserNum);
                    if (otherKey) {
                        resItem[1].data.push(item[otherKey]);
                    }
                });
                arrItem.lineseries = resItem;  //y轴数据
                arrItem.linexData = tempXData;    //x轴数据
            } else {
                arrItem.lineseries = [];  //y轴数据
                arrItem.linexData = [];    //x轴数据
            }
        },

        //获取精品课堂
        getLatestClassRecordBySchoolId(){
            this.loadingcourseList = true;
            var args = {};
            args.path = dataUrl.getLatestClassRecordBySchoolIdUrl;
            args.querys = {
                schoolId:this.schoolId,
            };
            this.$apiAjax.get(args, true, (r) => {
                this.loadingcourseList = false;
                if(r=='error'){
                    return
                }
                if(r&&r instanceof Array&&r.length){
                    this.courseList = r;
                    this.courseList.forEach(item => {
                        var FormatDate = this.getDateTimeStamp(item.courseStartTime);
                        item.courseStartTime = this.getDateDiff(FormatDate);
                    });
                }
                this.qualityClassLoading = false
            })
        },
         /**
         * 处理时间:字符串转换为时间戳    精品课堂时间计算
         * @param  {String} dateStr 当前时间
         */
        getDateTimeStamp(dateStr) {
            return Date.parse(dateStr.replace(/-/gi, "/"));
        },
        /**
         * 处理时间：计算时差    精品课堂时间计算
         * @param  {String} dateTimeStamp 当前时间
         */
        getDateDiff(dateTimeStamp) {
            var result = '';
            var minute = 1000 * 60;
            var hour = minute * 60;
            var day = hour * 24;
            var halfamonth = day * 15;
            var month = day * 30;
            var now = new Date().getTime();
            var diffValue = now - dateTimeStamp;
            if (diffValue < 0) {
                //若日期不符则弹窗口告之,结束日期不能小于开始日期！
            }
            var monthC = diffValue / month;
            var weekC = diffValue / (7 * day);
            var dayC = diffValue / day;
            var hourC = diffValue / hour;
            var minC = diffValue / minute;
            if (monthC >= 1) {
                result = parseInt(monthC) + "个月前";
            }
            else if (weekC >= 1) {
                result = parseInt(weekC) + "周前";
            }
            else if (dayC >= 1) {
                result = parseInt(dayC) + "天前";
            }
            else if (hourC >= 1) {
                result = parseInt(hourC) + "个小时前";
            }
            else if (minC >= 1) {
                result = parseInt(minC) + "分钟前";
            } else if(minC < 1) {
                result = '1' + "分钟前";
            }
            return result;
        },
    },
    beforeDestroy() {
    }
}
</script>

<style lang="less" scoped>
@import "~@/libs/css/theme/theme.less";
@import "./index.less";
.operatingPlatform{
    .left-content{
        &::-webkit-scrollbar {
            width: 0px !important;
        }
    }
}
</style>
