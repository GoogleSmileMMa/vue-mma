<!--
    by: ssfei  2018/11/29
    name: 校长工作台
    notes:
-->
<template>
    <div class="operatingPlatform" v-if="hasAuthority">
        <div class="headBox">
            <div class="headContent clear">
                <div class="infoBox">
                    <div class="headImg">
                        <img :src="teacherInfo.avatar" v-if="teacherInfo.avatar">
                        <img src="@/libs/images/default.png" v-else>
                    </div>
                    <div class="blessings">
                        <div class="morning">早安，<span class="name">{{teacherInfo.teacherName}}</span> ，祝你开心每一天！</div>
                        <!-- <div class="subject">{{teacherInfo.subject}}</div> -->
                        <div class="subject">数据，把深深在您心底的错综复杂链接起来~</div>
                    </div>
                </div>
                <div class="panoramicDataBtn" v-show="!fromQuery">
                    <div class="panoramicDataText" @click='goToBigDataBoard'>全景数据&gt;&gt;</div>
                </div>
                <div class="studentCountInfo">
                    <!-- <div class="item">
                        <p class="itemName">智课班级数</p>
                        <p class="itemCound">
                            <span class="correct">{{teacherInfo.smartClassNum}}</span>
                        </p>
                    </div> -->
                    <div class="item">
                        <p class="itemName">授课总次数</p>
                        <p class="itemCound">
                            <span class="correct">{{teacherInfo.smartClassRecordNum}}</span>
                        </p>
                    </div>
                    <!-- 1.5版本需求去掉该指标 -->
                    <!-- <div class="item">
                        <p class="itemName">分享次数</p>
                        <p class="itemCound">
                            <span class="correct">{{teacherInfo.shareNum}}</span>
                        </p>
                    </div> -->
                </div>
            </div>
        </div>
        <div class="deskContentBox">
            <div class="student clear">
                <div class="studentInfo">
                    <div class="topTitle">
                        <div class="title">学生信息</div>
                        <div class="tabs">
                            <div :class="[{'active':activeId==item.id},'tabsItem']" v-for="item in tabList" :key='item.id' @click="clickTabItem(item.id)">{{item.name}}</div>
                        </div>
                    </div>
                    <div class="bottomChar clear">
                        <div class="scatterChar char" v-loading="loadingAvgScore" element-loading-text="正在加载"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.5)">
                            <el-tooltip placement="top">
                                <div slot="content" v-html="promptCopy.workDeak.averagePractice"></div>
                                <div class="dotBox">
                                    <!-- <span class="dot"></span> -->
                                    最近一次作业平均分
                                </div>
                            </el-tooltip>
                            <div class="scatter">
                                <scatterCom
                                    :scatterYdata='scatterObj.scatterYdata'
                                    :loadingAvgScore='loadingAvgScore'
                                    :scatterlegendData='scatterObj.scatterlegendData'
                                    :scatterXValue='scatterObj.scatterXdata'
                                ></scatterCom>
                            </div>
                        </div>
                        <div class="barChar char" v-loading="loadingWorkTime" element-loading-text="正在加载"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.5)">
                            <el-tooltip placement="top">
                                <div slot="content" v-html="promptCopy.workDeak.nearly7Days"></div>
                                <div class="dotBox">
                                    <!-- <span class="dot"></span> -->
                                    近7天人均作业累计用时（小时）
                                </div>
                            </el-tooltip>
                            <barChart
                                :direction="barChartObj.verticalDirection"
                                :totalNum="barChartObj.totalNum"
                                :options="barChartObj.barxData"
                                :value="barChartObj.baryData"
                                :markLine="barChartObj.markLine"
                                :yAxisName='barChartObj.baryAxisName'
                                :yisNumber='true'
                                :gridTop="40"
                                :gridBottom="40"
                                :gridLeft="40"
                                :gridRight="40"
                                :toolTipTitle="'时长'"
                                :dataZoomShow="true"
                                :yAxisMinInterval="barChartObj.yAxisMinInterval"
                                :loading='loadingWorkTime'
                            ></barChart>
                        </div>
                    </div>
                </div>
                <div class="studentPerformance" v-loading="loadingActive" element-loading-text="正在加载"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.5)">
                    <div class="topTitle">
                        <el-tooltip placement="top">
                            <div slot="content" v-html="promptCopy.workDeak.nearly30Days"></div>
                            <div class="title">近30天用户活跃情况</div>
                        </el-tooltip>
                    </div>
                    <div class="bottomStudentList">
                       <activeCom
                            :loadingActive='loadingActive'
                            :xData='lineChart.linexData'
                            :yData='lineChart.lineseries'
                            :legendData='lineChart.legendData'
                       ></activeCom>
                    </div>
                </div>
            </div>
            <div class="classRoom clear">
                <div class="classLeft"  v-loading="loadingcourseList" element-loading-text="正在加载"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.5)">
                    <div class="myCourse clear">
                        <div class="topTitle">
                            <el-tooltip placement="top">
                                <!-- <div slot="content" v-html="promptCopy.workDeak.excellent"></div> -->
                                <div slot="content">
                                    说明：教师使用智慧课堂授课将自动记录生成课堂实录，这里展示教师最新分享的4节课堂；
                                    <br>
                                    意义：直观展示教师课堂成果，便于管理者了解智慧课堂教学情况，并促进优质教学资源积累，提升教育质量。
                                </div>
                                <div class="title">精品课堂</div>
                            </el-tooltip>
                            <div class="PerformanceDetail" @click='moreCourse()'>
                                <i class="iconfont icon-sangedian"></i>
                            </div>
                        </div>
                        <div class="courseList clear">
                            <div class="courseListBox" v-show="courseList.length">
                                <div class="courseItem" v-for="(item,index) in courseList" :key="index" @click='goToClassWisdom(item)'>
                                    <div class="imgBox">
                                        <img :src="item.url" alt="" class='imgItem'>
                                        <!-- <img src="@/libs/images/teacher/courseOne1.png" v-show='index===0' class="img">
                                        <img src="@/libs/images/teacher/courseTwo2.png" v-show='index===1' class="img">
                                        <img src="@/libs/images/teacher/courseThree3.png" v-show='index===2' class="img">
                                        <img src="@/libs/images/teacher/courseFour.png" v-show='index===3' class="img"> -->
                                    </div>
                                    <div class="shadowInfo clear">
                                        <div class="courseName">
                                            <p>{{item.courseName}}</p>
                                            <div>
                                                <span>{{item.subjectName}}</span>
                                                <span>{{item.courseStartTime}}</span>
                                            </div>
                                        </div>
                                        <div class="courseInfo">
                                            <p style="margin-top:3px">{{item.className}}</p>
                                            <p>{{item.teacherName}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <noDataComp v-show="(!courseList || !courseList.length) && !loadingcourseList"></noDataComp>
                        </div>
                    </div>
                </div>
                <div class="classRight" v-loading="loadingResource" element-loading-text="正在加载"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.5)">
                    <div class="topTitle">
                        <el-tooltip placement="top">
                            <div slot="content" v-html="promptCopy.workDeak.resourceCitation"></div>
                            <div class="title">近30天资源引用情况</div>
                        </el-tooltip>
                    </div>
                    <div class="bottomSeniorityList">
                        <p class="amountBox" v-show='allAmount'>总<span class="amountText">{{allAmount}}</span>次引用</p>
                        <resourceCom
                            :loadingResource='loadingResource'
                            :yData='resourcelineChart.lineseries'
                            :xData='resourcelineChart.linexData'
                        ></resourceCom>
                    </div>
                </div>
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
import {promptCopy} from '@/libs/js/config/index';
import dataUrl from '@/libs/interface/operatingPlatform/operatingPlatform.js'
import context from '@/libs/interface/context.js';
import publicUrl from '@/libs/interface/public.js';
import MixinDataBuriedPoint from '@/views/contentBody/Mixin/MixinDataBuriedPoint.vue';
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
                legendData:['教师','学生'],
                linexData:[],
                lineseries:[],
            },
            resourcelineChart:{
                lineseries:[],
                linexData:[],
            },
            //我的课堂数据列表
            courseList:[],
            seniorityList:[],//课堂智慧排行数据
            ownData:{},//课堂智慧排行老师自己的数据
            allAmount:0,//近30天资源应用次数总数
            version:'',
            fromQuery:"",//轻智课跳转不显示大数据看板
        }
    },
    components:{
        barChart,
        scatterCom,
        resourceCom,
        activeCom
    },
    computed:{
        schoolId(){
            return this.$store.state.userInfo.schoolId;
        },
        userId(){
            return this.$store.state.userInfo.userId;
        },
        isClickTab(){
            return this.$store.state.isClickTab;
        }
    },
    watch: {
    },
    mounted(){
        if(sessionStorage.getItem('fromPage')){
            this.fromQuery = sessionStorage.getItem('fromPage');
        };
        this.setHideBread(true);
        this.version = context.version;
        this.setShowMenuList(false);
        this.setShowRegister(false);
        this.loadGradeAndClassList();
    },
    created(){
        let userInfo = this.$store.state.userInfo;
        let currentMenuInfo = JSON.parse(sessionStorage.getItem('currentMenuInfo'));
        if (userInfo.roleEnName !=="headmaster"
            && userInfo.roleEnName !=="viceHeadmaster"
            && userInfo.roleEnName !=="admin"
            && userInfo.roleEnName !=="schoolAdministrator") {
            this.$router.replace("/page/contentBody/dataKanban.html");
            return;
        }else if(userInfo.roleEnName=='headmaster' || userInfo.roleEnName=='viceHeadmaster'){
            this.init();
        }else if(userInfo.roleEnName=="schoolAdministrator"){
            (this.isClickTab || currentMenuInfo.currentTabId !== '009') ? this.init() : this.$router.replace("/page/contentBody/propertyManagement.html");
            return;
        }
        this.isPad();
    },
    methods:{
        //判断移动端显示隐藏全景数据
        isPad(){
            if(/iphone|ios|android|ipod/i.test(navigator.userAgent.toLowerCase()) == true ){
                this.fromQuery = 1;
            }
        },
        //初始化接口
        init(){
            this.getTeacherInfo();//获取校长信息
            this.getSchoolDataOverview();//获取校长工作台，智课班级、智课总数量、校本微课数量
            this.getGradeListBySchoolId();//获取学校班级列表
            this.getLatestClassRecordBySchoolId();//获取精品课堂
            this.getDailyActiveUserList();//获取用户近30天活跃情况列表
            this.getResReferenceList();//近30天资源引用
        },
        goToBigDataBoard(){
            this.setBurialEvent("201000042",{});
            setTimeout(()=>{
                let myWindow = window.open('/page/hugeDataManage.html'+"?schoolId="+this.schoolId+"&userId="+this.userId);
                myWindow.focus();
            },100)
            // window.open('/page/realTimeDataView.html'+"?schoolId="+this.schoolId+"&userId="+this.userId);
        },
        //加载班级年级列表
        loadGradeAndClassList () {
            var args = {};
            args.path = publicUrl.getGradeAndClassListUrl;
            args.querys = {
                userId: this.$store.state.userInfo.userId
            };
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
        ...mapMutations(["setShowMenuList","setShowRegister","setHideBread",'setDiscussAreaHei','setListPageNum','setSearchValue']),
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
         /**
         * 班级tab切换
         * @param  {String} tabId 当前班级id
         */
        clickTabItem(tabId){
            this.activeId=tabId;
            this.getLatestHomeworkAverageScore();
            this.getHomeworkCompleteTimeStatistics();
        },
        //获取工作台的个人信息
        getTeacherInfo(){
            var args = {};
            args.path = dataUrl.getTeacherInfoUrl;
            args.querys = {
                token:this.$store.state.userInfo.token,
                userId:this.$store.state.userInfo.userId,
                schoolId:this.$store.state.userInfo.schoolId,
           };
            this.$apiAjax.get(args, true, (r) => {
                this.teacherInfo.avatar = r.avatar||'';
                this.teacherInfo.teacherName = r.teacherName||'';
                this.teacherInfo.subject = r.subject||'';
            })
        },
        //获取校长工作台，智课班级、智课总数量、校本微课数量
        getSchoolDataOverview(){
            var args = {};
            args.path = dataUrl.getSchoolDataOverviewUrl;
            args.querys = {
                schoolId:this.$store.state.userInfo.schoolId,
            };
            this.$apiAjax.get(args, true, (r) => {
                this.teacherInfo.schoolWeikeNum=r.schoolWeikeNum||0;
                this.teacherInfo.smartClassNum=r.smartClassNum||0;
                this.teacherInfo.smartClassRecordNum=r.smartClassRecordNum||0;
                 this.teacherInfo.shareNum=r.shareNum||0;
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
                schoolId:this.$store.state.userInfo.schoolId,
            };
            this.$apiAjax.get(args, true, (r) => {
                if(r instanceof Array && r.length){
                    this.tabList = r.map(item=>{
                        return{
                            name:item.gradeName,
                            id:item.gradeCode
                        }
                    });
                    this.activeId =  this.tabList[0].id;
                    if(this.activeId){
                        this.getLatestHomeworkAverageScore();
                        this.getHomeworkCompleteTimeStatistics();
                    }
                }

            })
        },
        //获取学校某个年级下，所有班级的最近一次作业平均分（散点图）
        getLatestHomeworkAverageScore(){
            this.loadingAvgScore = true;

            var args = {};
            args.path = dataUrl.getLatestHomeworkAverageScoreUrl;
            args.querys = {
                schoolId:this.$store.state.userInfo.schoolId,
                grade:this.activeId,
            };
            this.$apiAjax.get(args, true, (r) => {
                this.loadingAvgScore = false;
                // 重置
                this.scatterObj.scatterlegendData = [];
                this.scatterObj.scatterXdata = [];
                this.scatterObj.scatterYdata = [];
                this.scatterObj.yAxisMax = 100;
                if(r=='error'){
                    return
                }
                if(r instanceof Array && r.length){
                    this.aveScoreList = r;
                    let tempSeries = [];
                    let tempClassName = [];
                    let copyTempClassName = [];
                    this.aveScoreList.forEach(item=>{
                        if (!this.scatterObj.scatterlegendData.includes(item.subjectName)) {
                            this.scatterObj.scatterlegendData.push(item.subjectName);
                            tempSeries.push({
                                name:item.subjectName,
                                data:[]
                            })
                        };
                        tempClassName.push(item.className);
                    });

                    copyTempClassName = this.unique(tempClassName);//数组去重
                    copyTempClassName.forEach(item=>{
                        this.scatterObj.scatterXdata.push(item.slice(0,4)+'\n'+item.slice(4));
                    });
                    let maxNum = 0;
                    this.aveScoreList.forEach(item=>{
                        tempSeries.forEach(ele => {
                            if (item.subjectName === ele.name) {
                                if (item.avgScore > maxNum) {
                                    maxNum = item.avgScore;
                                }
                                ele.data.push([item.className.slice(0,4)+'\n'+item.className.slice(4),item.avgScore,item.createDate]);
                            }
                        })
                    });
                    this.scatterObj.scatterYdata = tempSeries;
                    this.scatterObj.yAxisMax =  Math.ceil(maxNum);
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
        //获取近一周各学科作业的完成时间统计(柱状图)
        getHomeworkCompleteTimeStatistics(){
            this.loadingWorkTime = true;
            // 重置
            this.barChartObj.baryData=[];
            this.barChartObj.barxData=[];

            var args = {};
            args.path = dataUrl.getHomeworkCompleteTimeStatisticsUrl;
            args.querys = {
                schoolId:this.$store.state.userInfo.schoolId,
                grade:this.activeId,
            };
            this.$apiAjax.get(args, true, (r) => {
                this.loadingWorkTime = false;
                if(r=='error'){
                    return
                }
                if(r && r instanceof Array && r.length){
                    r.forEach(item=>{
                        this.barChartObj.barxData.push(item.subjectName);
                        this.barChartObj.baryData.push((item.costTime/60/60).toFixed(1));
                    });
                }
            })
        },
        //获取用户近30天活跃情况列表（折线图）
        getDailyActiveUserList(){
            this.loadingActive = true;
            var args = {};
            args.path = dataUrl.getDailyActiveUserListUrl;
            args.querys = {
                schoolId:this.$store.state.userInfo.schoolId,
            };
            this.$apiAjax.get(args, true, (r) => {
                this.loadingActive = false;
                if(r=='error'){
                    return
                }
                //如果教师和学生返回的数组数据都为空
                if(!r.teacherList.length && !r.studentList.length){
                    this.lineChart.lineseries = [];
                    return
                }
                var userActiveSeries = [];
                userActiveSeries = this.lineChart.legendData.map(item=>{
                    return{
                        name:item,
                        data:[],
                    }
                });
                var tempXData = [];
                if(r.teacherList && r.teacherList instanceof Array && r.teacherList.length){
                    r.teacherList.forEach(item=>{
                        tempXData.push(item.day);
                        userActiveSeries[0].data.push(item.activeUserNum);
                    })
                };
                if(r.studentList && r.studentList instanceof Array && r.studentList.length){
                    r.studentList.forEach(item=>{
                        userActiveSeries[1].data.push(item.activeUserNum);
                    })
                };
                this.lineChart.lineseries = userActiveSeries;
                this.lineChart.linexData = tempXData;
            })
        },
         //获取近30天资源引用数据情况
        getResReferenceList(){
            this.loadingResource=true;
            var args = {};
            args.path = dataUrl.getResReferenceListUrl;
            args.querys = {
                schoolId:this.$store.state.userInfo.schoolId,
            };
            this.$apiAjax.get(args, true, (r) => {
                this.loadingResource=false;
                this.allAmount = 0;
                if(r=='error'){
                    return
                }
                if(r instanceof Array && r.length){
                    var resouceUseSeries = [
                        {name:'资源引用',data:[]}
                    ]
                    var tempXData = [];
                    r.forEach(item=>{
                        tempXData.push(item.day);
                        resouceUseSeries[0].data.push(item.teachingNum);
                        this.allAmount += item.teachingNum;
                    });
                    this.resourcelineChart.lineseries = resouceUseSeries;  //y轴数据
                    this.resourcelineChart.linexData = tempXData;    //x轴数据
                }
            })
        },

        //获取精品课堂
        getLatestClassRecordBySchoolId(){
            this.loadingcourseList = true;
            var args = {};
            args.path = dataUrl.getLatestClassRecordBySchoolIdUrl;
            args.querys = {
                schoolId:this.$store.state.userInfo.schoolId,
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
.operatingPlatform{
    width: 100%;
    height: 100%;
    .myCourse,.studentInfo,.studentPerformance,.classRight{
        height:100%;
        .topTitle{
            height: 50px;
            padding: 0px 20px 0px 20px;
            color: @themeFontColor_1;
            font-size: 14px;
            border-bottom: 1px solid @cutOffLine_1;
            .title{
                line-height: 50px;
                float: left;
            }
            .PerformanceDetail{
                float: right;
                cursor:pointer;
                line-height: 50px;
                .icon-sangedian{
                    color: @themeColor1;
                }
            }
            .tabs{
                float: right;
                .tabsItem{
                    float: left;
                    height: 49px;
                    width: 60px;
                    line-height: 50px;
                    text-align: center;
                    color: @themeFontColor_2;
                    &.active{
                        border-bottom: 3px solid @themeColor1;
                        color:@themeColor1;
                    }
                }
            }
        }
    }

    .headBox{
        width: 100%;
        // height: 20%;
        height:130px;
        padding: 10px;
        background: @themeModeBg;
        .title{
            color: #fff;
            font-size: 14px;
        }
        .headContent{
            height: 100%;
            .infoBox{
                float: left;
                width:40%;
                padding:20px 20px 20px 20px;
                border-right: 1px solid @cutOffLine_1;
                .headImg{
                    float: left;
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    img{
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }
                }
                .blessings{
                    width: calc(100% - 64px);
                    font-size: 20px;
                    color: @themeFontColor_2;
                    float: left;
                    padding: 5px 0px 0px 20px;
                    .name{
                        color: @themeColor1;
                    }
                    .subject{
                        font-size: 14px;
                        padding-top: 10px;
                    }
                }
            }
            .panoramicDataBtn{
                float: left;
                height: 100%;
                color: @bigDataBoardTextFont;
                margin-left: 10px;
                position: relative;
                width: 100px;
                .panoramicDataText{
                    position: absolute;
                    bottom:20px;
                    cursor: pointer;
                }
            }
            .studentCountInfo{
                float: right;
                // width:70%;
                padding:20px 40px 20px 10px;
                .item{
                    width: 150px;
                    float: left;
                    margin-right: 50px;
                    text-align: center;
                    .itemName{
                        font-size: 14px;
                        color: @highLightFontColor;
                    }
                    .itemCound{
                        color: @highLightFontColor;
                        .correct{
                            color: @themeColor1;
                            font-size: 38px;
                        }
                    }
                }
            }
        }
    }
    .deskContentBox{
        width:100%;
        height:calc(~"100% - "140px);
        padding-top: 10px;
    }
    .student{
        width: 100%;
        height:calc(~"100% - "280px);
        .studentInfo{
            width: 80%;
            float: left;
            height:100%;
            margin-right: 10px;
            border-radius: 5px;
            background: @themeModeBg;
            .bottomChar{
                height: calc(~"100% - "50px);
                padding: 20px 20px 10px 20px;
                .char{
                    position: relative;
                }
                .scatterChar{
                    width: 50%;
                    height:100%;
                    float: left;
                    margin-right: 5%;
                    position: relative;
                    .scatter{
                        width: 100%;
                        height:100%;
                    }
                }
                .barChar{
                    width: 45%;
                    height: 100%;
                    float: left;
                }
                .dotBox{
                    position: absolute;
                    font-size: 12px;
                    z-index: 10;
                    color: @themeFontColor_1;
                    .dot{
                        display: inline-block;
                        width: 6px;
                        height: 6px;
                        background: @themeColor1;
                        border-radius: 50%;
                        margin-right: 10px;
                    }
                }
            }
        }
        .studentPerformance{
            width: calc(~'20% - ' 10px);
            float: left;
            height: 100%;
            background: @themeModeBg;
            border-radius: 5px;
            .bottomStudentList{
                width: 100%;
                height:calc(~'100% - ' 50px);
            }
        }
    }
    .classRoom{
        width: 100%;
        padding-top: 10px;
        height:280px;
        .classLeft{
            width: 80%;
            float: left;
            margin-right: 10px;
            height: 100%;
            border-radius: 5px;
            .myCourse{
                width: 100%;
                border-radius: 5px;
                background: @themeModeBg;
                .courseList{
                    height: calc(~"100% - "50px);
                    padding: 20px;
                    width: 100%;
                    .courseListBox{
                        width: 100%;
                        height: 100%;
                        .courseItem{
                            float: left;
                            width: 22%;
                            height: 100%;
                            background-image: url('~@/libs/images/modules/defaultClass.png');
                            background-size:cover;
                            background-repeat: no-repeat;
                            margin-right:4%;
                            border-top-left-radius: 8px;
                            border-top-right-radius: 8px;
                            position: relative;
                            cursor: pointer;
                            .imgBox{
                                height: 100%;
                                width: 100%;
                                border-radius: 4px;
                                overflow: hidden;
                                cursor: pointer;
                                .imgItem{
                                    height: 100%;
                                    width: 100%;
                                }
                            }
                            .shadowInfo{
                                width: 100%;
                                height: 38px;
                                position: absolute;
                                bottom: 0;
                                left: 0;
                                background: rgba(0,0,0,0.4);
                                padding: 0px 5px;
                                .courseName{
                                    float: left;
                                    color: #fff;
                                    font-size: 12px;
                                }
                                .courseInfo{
                                    float: right;
                                    color: #fff;
                                    font-size: 12px;
                                    text-align: right;
                                }
                            }
                        }
                        :last-child{
                            margin-right:0;
                        }
                    }
                    .noDate{

                    }
                }
            }
            .dashboardBox{
                width: 100%;
                border-radius: 5px;
                margin-top: 10px;
                padding: 20px;
                .singlePieItem{
                    float: left;
                    width: 16.66%;
                }
            }
        }
        .classRight{
            width: calc(~'20% - ' 10px);
            float: left;
            background: @themeModeBg;
            border-radius: 5px;
            .bottomSeniorityList{
                width: 100%;
                height: calc(~"100% - "50px);
                position: relative;
                .amountBox{
                    position: absolute;
                    color: @themeFontColor_2;
                    font-size: 14px;
                    top: 15px;
                    right: 10px;
                    .amountText{
                        font-size: 16px;
                        color: @themeColor1;
                    }
                }
            }
        }
    }

}
</style>
