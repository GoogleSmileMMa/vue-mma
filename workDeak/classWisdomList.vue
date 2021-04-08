<!--
    by: ssfei 2018年03月06日
    name: 课堂智汇列表
    notes: null
-->
<template>
    <div class="classWisdomList">
        <div class="themeBgColor_1 backBtn" @click="backToEvent('back')">返回</div>
        <!-- 搜索 -->
        <div class="searchBox clear">
            <div class="teacherSearch fl searchItem">
                <el-input v-model="searchData.teacherName" placeholder="请输入教师姓名" @keypress.native="searchkeypress($event)"></el-input>
            </div>
            <div class="subjectSearch fl searchItem">
                <el-select v-model="searchData.subjectCode" placeholder="请选择学科" size='mini'>
                    <el-option
                    v-for="item in subjectList"
                    :key="item.subjectCode"
                    :label="item.subjectName"
                    :value="item.subjectCode">
                    </el-option>
                </el-select>
            </div>
            <div class="gradeSearch fl searchItem">
                <el-select v-model="searchData.gradeCode" placeholder="请选择年级" size='mini'>
                    <el-option
                    v-for="item in gradeList"
                    :key="item.gradeCode"
                    :label="item.gradeName"
                    :value="item.gradeCode"
                    >
                    </el-option>
                </el-select>
            </div>
            <div class="dateSearch fl">
                <p class="defaultDate" v-if='defaultDate' @click="changeTimeRange">{{defaultDate}}</p>
                <el-date-picker
                    size='mini'
                    v-model="classDateArr"
                    type="daterange"
                    range-separator="~"
                    @change="changeTime"
                    ref='dateRef'
                    :default-time="['00:00:00', '23:59:59']"
                    :default-value="defaultValue">
                </el-date-picker>
            </div>
            <div class="btnBox fl clear">
                <div class="searchBtn btn" @click='search'>查询</div>
                <div class="resetBtn btn" @click='reset'>重置</div>
            </div>
        </div>
        <div class="contentBox" v-loading="loading" element-loading-text="正在加载" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)">
            <div class="noData" v-show="!courseList.length && !loading">
                <div class="noDataBox">
                    <div class="noDataImg"></div>
                    <div class="noDataText">暂无数据</div>
                </div>
            </div>
            <div class="contentList clear" v-show='courseList.length'>
                <div :class="[{noMargin:index%4==3},'listItem']" v-for='(item,index) in courseList' :key='index' @click='goToClassWisdom(item)'>
                    <div class="topImgBox">
                        <img :src="item.url" alt="">
                    </div>
                    <div class="bottomInfo">
                        <div class="couseNameBox clear">
                            <span class="couseName" :title='item.courseName'>{{item.courseName}}</span>
                            <span class="couseDate">{{item.shareTime}}</span>
                        </div>
                        <div class="nameBox clear">
                            <div class="headerBox">
                                <img :src="item.userPhoto" alt="">
                            </div>
                            <div class="teacherName" :title='item.teacherName'>{{item.teacherName}}</div>
                            <div class="grade">{{item.className}}</div>
                        </div>
                        <div class="rankBox clear">
                            <span class="rank">第
                                <span class="bold">
                                    {{item.rank}}
                                </span>
                            名</span>
                            <span class="praireAndDis">
                                <i class="iconfont icon-xin"></i>
                                {{item.likeNum}}
                                <i class="iconfont icon-tiwenpingluncishu"></i>
                                {{item.commentNum}}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pageBox" v-show='courseList.length'>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="listPageNum"
                    :page-sizes="[8, 20, 40]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tatalCount">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState,mapMutations} from "vuex";
import MixinDataBuriedPoint from '@/views/contentBody/Mixin/MixinDataBuriedPoint.vue';
import dataUrl from '@/libs/interface/teacher/ktzh/classCollectRankList.js';
import {getSubjectListCom,getGradeListBySchoolId} from '@/libs/js/services/services';
import commonUrl from '@/libs/interface/public.js'
export default {
    mixins: [MixinDataBuriedPoint],
    data(){
        return{
            loading:true,
            currentPage:1,
            pageSize:8,
            tatalCount:0,
            searchData:{
                teacherName:'',
                subjectCode:'',
                gradeCode:'',
                startTime:'',
                endTime:'',
            },
            subjectList:[],
            gradeList:[],
            classDateArr:[],
            courseList:[],
            defaultDate:'',//默认日期
            resetDate:'',//保存默认时间，重置后使用
            defaultSubjectCode:'',//默认学科，，重置时使用
        }
    },
    mounted(){
        this.setShowMenuList(false);
        this.setShowRegister(false);
        this.setHideBread(false);
        if(JSON.stringify(this.searchValue) !== '{}'){
            this.searchData = JSON.parse(JSON.stringify(this.searchValue));
        };
        //this.pageNum = this.listPageNum?this.listPageNum:1;
        this.defaultDate = this.timeForMat(29);
        this.resetDate = this.defaultDate;//重置后的时间
        this.searchData.startTime=this.defaultDate.split('~')[0]?this.defaultDate.split('~')[0]:"";
        this.searchData.endTime=this.defaultDate.split('~')[1]?this.defaultDate.split('~')[1]:"";
        this.getSubjectList();//获取学科
        this.getGradeList();//获取年级
        this.$eventBus.$emit('bus-set-bread-crubm',[{name:'数据导览'},{name:'课堂智汇排行榜'}]);

    },
    computed:{
        ...mapState({
            searchValue: state => state.searchValueStore.searchValue,
            listPageNum: state => state.searchValueStore.listPageNum
        }),

        schoolId(){
            return this.$store.state.userInfo.schoolId
        },
        userId(){
            return this.$store.state.userInfo.userId
        },
        defaultValue(){
            const end = new Date();
            const start = new Date();
            return [start.getTime() - 3600 * 1000 * 24 * 30,end]
        },
    },
    methods:{
        ...mapMutations(["setShowMenuList","setShowRegister","setHideBread",'setListPageNum','setSearchValue']),
        //点击事件搜索框
        changeTimeRange() {
            this.$refs.dateRef.focus();
        },
        /**
         * 时间搜索计算默认日期
         * @param  {Number} count 时间差
         */
        timeForMat (count) {
           // 拼接时间
            // let time1 = new Date()
            // time1.setTime(time1.getTime())
            // let Y1 = time1.getFullYear()
            // let M1 = ((time1.getMonth() + 1) > 9 ? (time1.getMonth() + 1) : '0' + (time1.getMonth() + 1))
            // let D1 = (time1.getDate() > 9 ? time1.getDate() : '0' + time1.getDate())
            // let timer1 = Y1 + '-' + M1 + '-' + D1 // 当前时间
            // let time2 = new Date()
            // time2.setTime(time2.getTime() - (24 * 60 * 60 * 1000 * count))
            // let Y2 = time2.getFullYear()
            // let M2 = ((time2.getMonth() + 1) > 9 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1))
            // let D2 = (time2.getDate() > 9 ? time2.getDate() : '0' + time2.getDate())
            // let timer2 = Y2 + '-' + M2 + '-' + D2 // 之前的7天或者30天
            // var time = timer2+'~'+timer1
            return ''
        },
        //计算每个宽度
        calculateItemWidth(){
            let contentListWidth = document.querySelector('.contentBox').offsetWidth;
            setTimeout(()=>{
                let listItem = document.querySelectorAll('.listItem');
                listItem.forEach(item=>{
                    item.style.width = (contentListWidth-60)/4+'px';
                })
            },10)
        },
         /**
         * 切换时间
         * @param  {Array} _time  选择的时间
         */
        changeTime(_time){
            this.defaultDate=' ';
            if(_time){
                this.searchData.startTime = _time[0].format('yyyy-MM-dd');
                this.searchData.endTime = _time[1].format('yyyy-MM-dd');
            }else{
                this.searchData.startTime='';
                this.searchData.endTime='';
            }
        },
        //获取列表信息
        getClassCollectRankList(){
            this.loading = true;
            var args = {};
            args.path = dataUrl.getClassCollectRankListUrl;
            args.querys = {
                schoolId:this.schoolId,
                teacherName:this.searchData.teacherName,
                grade:this.searchData.gradeCode,
                subject:this.searchData.subjectCode,
                startDate:this.searchData.startTime,
                endDate:this.searchData.endTime,
                pageNum:this.listPageNum,
                pageSize:this.pageSize
           };
            this.$apiAjax.get(args, true, (r) => {
                this.loading = false;
                if(r == 'error'){
                    return false;
                }
                if(r.list && r.list instanceof Array && r.list.length){
                    r.list.forEach(item => {
                        item.shareTime = this.format(item.shareTime);
                    });
                    this.courseList = r.list;
                    this.tatalCount=r.total;
                    // if(r.list.length){
                    //     this.calculateItemWidth();
                    // }
                }else{
                    this.courseList = [];
                }
            })
        },
        /**
         * 时间戳转换
         * @param  {String} shijianchuo  需要转化的时间
         */
        format(shijianchuo){
            //shijianchuo是整数，否则要parseInt转换
            var time = new Date(shijianchuo);
            var y = time.getFullYear();
            var m = time.getMonth()+1;
            var d = time.getDate();
            if(d<10){
                d='0'+d;
            }
            if(m<10){
                m='0'+m;
            }
            return  y+'-'+m+'-'+d;
        },
         /**
         * 切换每页条数
         * @param  {Nmber} size  条数
         */
        handleSizeChange(size){
            this.pageSize=size;
            this.getClassCollectRankList();
        },
         /**
         * 切换页码
         * @param  {Nmber} val  页码
         */
        handleCurrentChange(val){
            this.setListPageNum(val);
            this.getClassCollectRankList();
        },
        //获取学科
        getSubjectList(){
            let res = getSubjectListCom({userId:this.userId,schoolId:this.schoolId});
            res.then(data=>{
                if(data && data instanceof Array && data.length){
                    this.subjectList = data.map(item=>{
                        return{
                            subjectCode:item.subjectCode,
                            subjectName:item.subjectName
                        }
                    });
                    this.defaultSubjectCode = this.subjectList[0].subjectCode;//重置到第一个学科
                    if(this.searchData.subjectCode==''){
                        this.searchData.subjectCode = this.subjectList[0].subjectCode;

                    }
                    this.getClassCollectRankList();
                }
            })
        },
        //获取年级
        getGradeList(){
            var args = {};
            args.path = commonUrl.getGradeListBySchoolIdUrl;
            args.querys = {
                schoolId:this.schoolId,
           };
            this.$apiAjax.get(args, true, (r) => {
                if(r == 'error'){
                    return false;
                };
                if(r && r instanceof Array && r.length){
                    this.gradeList = r.map(item=>{
                        return{
                            gradeCode:item.gradeCode,
                            gradeName:item.gradeName
                        }
                    })
                    this.gradeList.unshift({
                        gradeCode:'',
                        gradeName:'全部（年级）'
                    })
                }
            })

        },

        //查询
        search(){
            if(this.searchData.teacherName){
                this.searchData.teacherName=this.searchData.teacherName.replace(/^\s+|\s+$/g,"");
            }
            this.setListPageNum(1);
            this.getClassCollectRankList();
            this.setSearchValue(this.searchData);
        },
        //重置
        reset(){
            this.classDateArr = [];
            this.searchData.teacherName='';
            this.searchData.gradeCode='';
            this.searchData.subjectCode=this.defaultSubjectCode;
            this.defaultDate = this.resetDate;
            this.searchData.startTime=this.defaultDate.split('~')[0];
            this.searchData.endTime=this.defaultDate.split('~')[1];
            this.setListPageNum(1);
            this.setSearchValue({});
            this.getClassCollectRankList();
        },
        //跳转到课堂智汇
        goToClassWisdom(item){
            this.setBurialEvent("201000010",{});
            this.$router.push({
                path:'/page/contentBody/classWisdom.html',
                query: {
                    courseId:item.courseId,
                    from:'classWisdomList',
                    from1:this.$route.query.from,
                }
            })
        },
       //回车搜索
        searchkeypress(e){
            if(e.keyCode == 13){
                if(this.teacherName){
                    this.teacherName=this.teacherName.replace(/^\s+|\s+$/g,"");
                }
                this.setListPageNum(1);
                this.getClassCollectRankList();
            }
        },
        //返回
        backToEvent(){
            if(this.$route.query.from=='workDeak'){
                this.$router.push('/page/contentBody/workDeak.html');
            }else if(this.$route.query.from=='dataKanban'){
                this.$router.push('/page/contentBody/dataKanban.html');
            }
        },

    },
    beforeDestroy() {
    },
}
</script>

<style lang="less" scoped>
@import "~@/libs/css/theme/theme.less";
.classWisdomList{
    width: 100%;
    height: 100%;
    margin-top: 40px;
    .backBtn{
        left:24px;
        top:0;
    }
    .el-input__inner{
        width: 220px;
        height: 30px;
    }
    .searchBox{
        .searchItem{
            margin-right:10px;
        }
        .teacherSearch{
            width: 184px;
            height: 28px;
        }
        .dateSearch{
            position: relative;
            .defaultDate{
                height: 28px;
                width:auto !important;
                line-height: 28px;
                color: @themeFontColor_2;
                z-index: 1;
                opacity: 1;
                background: @inputBackgroundColor;
                position: absolute;
                top: 1px;
                left: 30px;
                cursor: pointer;
                font-size: 12px;
            }
        }
        .btnBox{
            float: left;
            cursor: pointer;
            margin-left:10px;
            .btn{
                width: 50px;
                height: 28px;
                float: left;
                background: @btn2_bg;
                margin-left: 10px;
                border-radius: 4px;
                color:@btn2_color;
                text-align: center;
                line-height: 28px;
                cursor: pointer;
            }
            .searchBtn{
                margin-left:0;
                &.hover{
                    background:@btn2_hover;
                }
            }
            .resetBtn{
                color:@btn1_color;
                background: @btn1_bg;
                border-color:@btn1_border;
                &:hover{
                    background:@btn1_hover;
                }
            }
        }
    }
    .contentBox{
        width: 100%;
        height: calc(~'100% - '30px);
        .contentList{
            width: 100%;
            height: calc(~'100% - '52px);
            overflow-y: auto;
            .noMargin{
                margin-right: 0px !important;
            }
            .listItem{
                width: calc(~'25% - '15px);
                height: 265px;
                background: @themeModeBg;
                border-radius: 5px;
                float: left;
                margin-right: 20px;
                margin-top: 20px;
                cursor: pointer;
                position: relative;
                .topImgBox{
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                    width: 100%;
                    height: 265px;
                    cursor: pointer;
                    background-image: url('~@/libs/images/modules/defaultClass.png');
                    background-size:cover;
                    background-repeat: no-repeat;
                    img{
                        border-radius: 5px;
                        width: 100%;
                        height: 100%;
                    }
                }
                .bottomInfo{
                    width: 100%;
                    padding: 10px;
                    height: 95px;
                    cursor: pointer;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    background: rgba(0,0,0,0.4);
                    color:@themeFontColor_5;
                    .couseNameBox{
                        .couseName{
                            width: 50%;
                            font-size:16px;
                            float: left;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        .couseDate{
                            font-size:12px;
                            float: right;
                            //color: @themeFontColor_2;
                        }
                    }
                    .nameBox{
                        margin-top: 5px;
                        .headerBox{
                            float: left;
                            width:24px;
                            height:24px;
                            border-radius:50%;
                            vertical-align: middle;
                            margin-right:10px;
                            background-image: url('../../../libs/images/modules/defalutHead.png');
                            background-repeat:no-repeat;
                            background-size:100%;
                            border-radius: 50%;
                            img{
                                width:100%;
                                height:100%;
                                border-radius:50%;
                            }
                        }
                        .teacherName{
                            float: left;
                            //color: @themeFontColor_2;
                            width: 40%;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            line-height: 24px;
                        }
                        .grade{
                            float: right;
                            //color: @themeFontColor_2;
                            line-height: 24px;
                        }
                    }
                    .rankBox{
                        margin-top: 5px;
                        .rank{
                            font-size: 12px;
                            font-weight: bold;
                            //color: @highLightFontColor;
                            .bold{
                                font-size: 16px;
                                font-weight: bold;
                            }
                        }
                        .praireAndDis{
                            float: right;
                            //color: @themeFontColor_2;
                            .icon-xin{
                                color: #FF3399;
                            }
                            .icon-tiwenpingluncishu{
                                color: #4157ED;
                                font-size: 13px;
                            }
                        }
                    }
                }
            }
        }
        .pageBox{
            text-align: center;
            margin-top: 20px;
        }
    }
}

</style>
