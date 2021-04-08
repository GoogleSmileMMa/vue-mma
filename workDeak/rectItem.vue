<!-- 课堂授课等图表rect -->
<template>
    <div v-if="cItem" class="rect-item" @click="reverseOrder(cItem)">
        <span v-if="showRect" class="rect" :class="cItem.color"></span>
        <span class="text" :class="{'grey-text': cItem.textArr[opeIdx].includes('·')}" @click="clickBlock">{{ cItem.textArr[opeIdx] }}</span>
        <span v-if="!cItem.textArr[opeIdx].includes('·')" class="order" :class="[ status.oIdx !== curIdx ? '' : status.reverse ? 'order-down' : 'order-up']" :data-index="curIdx"></span>
    </div>
</template>

<script>
    export default {
        name: '',
        props: {
            // react item的内容
            cItem: {
                type: Object,
                default() {
                    return null
                }
            },
            // 当前tab的索引
            opeIdx: {
                type: Number,
                default: 0
            },
            // item在conditionList里面的索引
            curIdx: {
                type: Number,
                default: 0
            },
            // 排序高亮状态
            status: {
                type: Object,
                default() {
                    return {
                        oIdx: 0,
                        reverse: true
                    }
                }
            },
            // 是否是单校
            isSingleSchool: {
                type: Boolean,
                default: true
            },
            // 是否显示rect块
            showRect: {
                type: Boolean,
                default: true
            }
        },
        components: {},
        data() {
            return {
                
            }
        },
        created() {
            
        },
        methods: {
            // 点击模块
            clickBlock() {
                // 点击时，右侧指标跳到那一部分
                let name = ''
                let typeName = this.isSingleSchool ? 'president' : 'groupSchool'
                let arr = [0, 0, 0, 0, 0]
                if (this.opeIdx === 0) {
                    arr = this.isSingleSchool ?  [10, 11, 0, 12, 13] : [4, 0, 0, 5, 0]
                } else if (this.opeIdx === 1) {
                    arr = this.isSingleSchool ?  [14, 0, 0, 15, 0] : [6, 0, 0, 7, 0]
                } else if (this.opeIdx === 2) {
                    arr = this.isSingleSchool ?  [16, 17, 0, 18, 19] : [8, 0, 0, 9, 0]
                }
                name = this.curIdx !== 2 ? typeName + arr[this.curIdx] : ''
                this.$store.commit('setToolTipActive', name)
            },
            // 横形柱状图表切换正序逆序
            reverseOrder (item) {
                this.$set(item, 'reverse', !item.reverse)
                this.$emit('clickCondition', this.curIdx, !item.reverse)
            },
        },
    }
</script>
<style lang='less' scoped>
@import '~@/libs/css/mixin.less';
@import '~@/libs/css/theme/theme.less';
.rect-item {
    .flex-center();
    .rect {
        width: 20px;
        height: 20px;
        border-radius: 5px;
    }
    .text {
        cursor: pointer;
        padding: 0 8px;
        color: @themeFontColor_3;
        font-size: 16px;
        font-weight:400;
    }
    .grey-text {
        color: @newLightFontColor;
    }
    .gra-blue {
        background:linear-gradient(90deg,rgba(54,143,255,1) 0%,rgba(103,200,255,1) 100%);
    }
    .gra-yellow {
        background:linear-gradient(270deg,rgba(248,181,7,1) 0%,rgba(255,222,119,1) 100%);
    }
    .gra-purple {
        background:linear-gradient(90deg,rgba(170,159,253,1) 0%,rgba(127,117,255,1) 100%);
    }
    .gra-green {
        background:linear-gradient(90deg,rgba(101,220,146,1) 0%,rgba(36,195,102,1) 100%);
    }
    .order {
        width: 16px;
        height: 16px;
        cursor: pointer;
        background: url('~@/libs/images/workDeak/icon-order.png') no-repeat center center/contain;
    }
    .order-up {
        background-image: url('~@/libs/images/workDeak/icon-order-up.png'); 
    }
    .order-down {
        background-image: url('~@/libs/images/workDeak/icon-order-down.png'); 
    }
}
</style>