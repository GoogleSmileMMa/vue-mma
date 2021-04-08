import dataUrl from '@/libs/interface/operatingPlatform/operatingPlatform.js'
export default {
    // 获取授课趋势
    getTeachingChartData (self) {
        var args = {};
        args.contentType = 'application/json';
        args.path = dataUrl.getTeachingTrend;
        args.querys = Object.assign({
            schoolIdList: [{"schoolId":self.schoolId}]
        }, self.params);
        self.$apiAjax.post(args, true, (r) => {
            let list = r.map(item => {
                return {
                    day: item.date,
                    activeUserNum: item.teachingNum
                }
            })
            self.resetLineData(list, self.blockList[2].lineChart, '次授课')
        })
    },
    // 获取授课次数
    getTeachingNum (self) {
        var args = {};
        args.contentType = 'application/json';
        args.path = dataUrl.getTeachingNum;
        args.querys = Object.assign({
            schoolIdList: [{"schoolId":self.schoolId}]
        }, self.params);
        self.$apiAjax.post(args, true, (r) => {
            let data = {
                bigPer: r.thisweek || r.thisweek === 0 ? r.thisweek : r.lastweek,
                weekName: r.thisweek || r.thisweek === 0 ? '本周' : '上周',
                trend: '上升', // 周授课是绿色
                title: '授课次数',
                unit: '（单位：次）'
            }
            let item = Object.assign(self.blockList[2], data)
            self.$set(self.blockList, 2, item)
        })
    },
    // 获取应用模块活跃率 dataType分teacher,student,class表示不同的活跃率，index是blockList的索引
    getClassActivityData (self, group, dataType, index) {
        self.$set(self.blockList[index], 'loadingResource', false)
        let arr = []
        if (!group) {
            let list = self.schoolId.split(',')
            arr = list.map(e=> ({schoolId:e}))
        } else {
            arr = [{"schoolId":self.schoolId}]
        }
        var args = {};
        args.contentType = 'application/json';
        args.path = dataUrl.getClassActivityTrend;
        args.querys = Object.assign({
            schoolIdList: arr,
            dataType
        }, self.params);

        self.$apiAjax.post(args, true, (r) => {
            console.log(self.blockList[index]);
            self.$set(self.blockList[index], 'loadingResource', true)
            let list = r.map(item => {
                return {
                    day: item.date,
                    activeUserNum: item.teachingNum
                }
            })
            let unit = index === 2 ? '个' : '位'
            let name = ['教师', '学生', '班级'][index]
            self.resetLineData(list, self.blockList[index].lineChart, unit+'活跃'+name)
        })
    },
    // 获取应用模块活跃人数等数量 dataType分teacher,student,class表示不同的数量，index是blockList的索引
    getClassActivityNum(self, group, dataType, index ) {
        let arr = []
        if (!group) {
            let list = self.schoolId.split(',')
            arr = list.map(e=> ({schoolId:e}))
        } else {
            arr = [{"schoolId":self.schoolId}]
        }
        var args = {};
        args.contentType = 'application/json';
        args.path = dataUrl.getClassActivityNum;
        args.contentType = 'application/json';
        args.querys = Object.assign({
            schoolIdList: arr,
            dataType
        }, self.params);

        self.$apiAjax.post(args, true, (r) => {
            let num = r.percent.replace('%', '')
            num = parseFloat(num)
            let data = {
                num: r.thisweek || r.lastweek || 0,
                bigPer: r.activepercent,
                smallPer: r.percent.replace('-', ''),
                tip: self.getActivityTip(num),
                trend: num > 0 ? '上升' : num === 0 ? '稳定' : '下降',
                weekName: r.thisweek || r.thisweek === 0 ? '本周' : '上周'
            }
            let item = Object.assign(self.blockList[index], data)
            self.$set(self.blockList, index, item)
        })
    },
    // 获取作业布置数据
    getHomeworkData (self, group,sort, field) {
        var args = {};
        args.path = dataUrl.getHomeworkDataUrl;
        args.querys = Object.assign({
            schoolId:self.schoolId,
            schoolName:self.schoolName,
            schoolType: group ? '0' : '1',
            sort: sort || 'desc',
            sortField: field || '',
            academicYearId: self.academicYearId,
            grade: self.chosedGradeCode,
            gradeName: self.chosedGradeCode ? self.chosedGradeName : '',
            subject: self.chosedSubjectCode,
            subjectName: self.chosedSubjectCode ? self.chosedSubjectName : ''
        }, self.params);
        
        self.$apiAjax.get(args, true, (r) => {
            self.teachersStudentsLoading = false
            self.$set(self.opeTipContent,2,r.dataRead)
            let list = group ? r.hmDataGuideSchoolDetailVos ? r.hmDataGuideSchoolDetailVos.reverse() : [] : r.hmDataGuideGroupDetailVos ? r.hmDataGuideGroupDetailVos.reverse() : []
            let item = null
            if (list && list.length) {
                if (group) {
                    item = self.getTsItem(list, 2)
                } else {
                    item = self.getGroupTsItem(list, 2)
                }
            }
            self.$set(self.teacherStudentData, 2, item)
            self.tsBehaviorData = self.teacherStudentData[self.opeIdx]
        })
    },
    // 获取课堂授课数据
    getPrincipalCourseAnalysis (self, group, sort, field) {
        var args = {};
        args.path = dataUrl.getPrincipalCourseAnalysisUrl;
        args.querys = Object.assign({
            schoolId:self.schoolId,
            schoolName:self.schoolName,
            schoolType: group ? '0' : '1',
            sort: sort || 'desc',
            sortField: field || '',
            academicYearId: self.academicYearId,
            grade: self.chosedGradeCode,
            gradeName: self.chosedGradeCode ? self.chosedGradeName : '',
            subject: self.chosedSubjectCode,
            subjectName: self.chosedSubjectCode ? self.chosedSubjectName : ''
        }, self.params);
        
        self.$apiAjax.get(args, true, (r) => {
            self.teachersStudentsLoading = false
            self.$set(self.opeTipContent,0,r.dataRead)
            let list = group ? r.resDataGuideSchoolDetailVOS ? r.resDataGuideSchoolDetailVOS.reverse() :  [] : r.resDataGuideGroupDetailVos ? r.resDataGuideGroupDetailVos.reverse() : []
            let item = null
            if (list && list.length) {
                if (group) {
                    item = self.getTsItem(list, 0)
                } else {
                    item = self.getGroupTsItem(list, 0)
                }
            }
            self.$set(self.teacherStudentData, 0, item)
            self.tsBehaviorData = self.teacherStudentData[self.opeIdx]
        })
    },
    // 获取资源分享数据
    getResourceShareData (self, group, sort, field) {
        var args = {};
        args.path = dataUrl.getResourceShareDataUrl;
        args.querys = Object.assign({
            schoolId:self.schoolId,
            schoolName:self.schoolName,
            schoolType: group ? '0' : '1',
            sort: sort || 'desc',
            sortField: field || '',
            academicYearId: self.academicYearId,
            grade: self.chosedGradeCode,
            gradeName: self.chosedGradeCode ? self.chosedGradeName : '',
            subject: self.chosedSubjectCode,
            subjectName: self.chosedSubjectCode ? self.chosedSubjectName : ''
        }, self.params);
        
        self.$apiAjax.get(args, true, (r) => {
            self.teachersStudentsLoading = false
            self.$set(self.opeTipContent,1,r.dataRead)
            let list = group ? r.resDataGuideSchoolDetailVOS ? r.resDataGuideSchoolDetailVOS.reverse() :  [] : r.resDataGuideGroupDetailVos ? r.resDataGuideGroupDetailVos.reverse() : []
            let item = null
            if (list && list.length) {
                if (group) {
                    item = self.getTsItem(list, 1)
                } else {
                    item = self.getGroupTsItem(list, 1)
                }
            }
            self.$set(self.teacherStudentData, 1, item)
            self.tsBehaviorData = self.teacherStudentData[self.opeIdx]
        })
    },
    // 获取集团授课次数趋势分析
    getTeachingTimesData (self, group) {
        let arr = []
        if (!group) {
            let list = self.schoolId.split(',')
            arr = list.map(e=> ({schoolId:e}))
        } else {
            arr = [{"schoolId":self.schoolId}]
        }
        var args = {};
        args.contentType = 'application/json';
        args.path = dataUrl.getTeachingTimesAnalysis;
        args.querys = Object.assign({
            schoolIdList: arr
        }, self.params);

        self.$apiAjax.post(args, true, (r) => {
            let list = r.map(item => {
                return {
                    day: item.date,
                    activeUserNum: item.teachingNum,
                    praiseNum: item.praiseNum
                }
            })
            
            self.resetLineData(list, self.analysisList[0].lineChart, '教师授课次数', 'praiseNum', '学生获表扬数')
            console.log(self.analysisList);
        })
    },
    // 题库资源使用情况
    getDataQuestionUse (self) {
        var args = {};
        args.path = dataUrl.getDataQuestionUseUrl;
        args.querys = Object.assign({
            schoolId:self.schoolId
        }, self.params);

        self.$apiAjax.get(args, true, (r) => {
            let optionList = []
            let resourceNum = []
            r.map((params) => {
                optionList.push(params.subjectName)
                resourceNum.push(params.topicCount)
            })
            self.roseChartLft = {
                optionList,
                resourceNum
            }
        })
    },
    // 教学资源使用情况
    getDataResUseGuide (self) {
        var args = {};
        args.path = dataUrl.getDataResUseGuideUrl;
        args.querys = Object.assign({
            schoolId:self.schoolId
        }, self.params);

        self.$apiAjax.get(args, true, (r) => {
            let optionList = []
            let resourceNum = []
            r.map((params) => {
                optionList.push(params.subjectName)
                resourceNum.push(params.resourceUseNum)
            })
            self.roseChartRig = {
                optionList,
                resourceNum
            }
        })
    },
    // 获取集团资源使用分析
    getResAnalysisGuide (self) {
        var args = {};
        args.path = dataUrl.getResAnalysisGuideUrl;
        args.querys = Object.assign({
            schoolId:self.schoolId
        }, self.params);

        self.$apiAjax.get(args, true, (r) => {
            let list = r.map(item => {
                return {
                    day: item.activeDate,
                    activeUserNum: item.resourceUseNum,
                    praiseNum: item.studyNum
                }
            })
            self.resetLineData(list, self.analysisList[1].lineChart, '教师使用资源次数', 'praiseNum', '学生学习资源次数')
        })
    },
    // 获取集团作业分析
    getDataGuideHmAnalysis (self) {
        var args = {};
        args.path = dataUrl.getDataGuideHmAnalysisUrl;
        args.querys = Object.assign({
            schoolId:self.schoolId
        }, self.params);

        self.$apiAjax.get(args, true, (r) => {
            let list = r.map(item => {
                return {
                    day: item.activeDay,
                    activeUserNum: item.teacherNum,
                    praiseNum: item.hmNum
                }
            })
            
            self.resetLineData(list, self.analysisList[2].lineChart, '布置作业教师数', 'praiseNum', '布置作业数')
        })
    }
}