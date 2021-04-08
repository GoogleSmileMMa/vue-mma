<!-- 点击按钮可弹出选择框 -->
<template>
    <div class='choose-btn' :ref="refName" @click="ifShow = !ifShow">
        <i class="iconfont icon-pailie"></i>
        <div class="text" :class="{ 'blue': !btnName.includes('全部') }">{{ btnName }}</div>
        <ul class="drop-list" :class="{ 'height': !ifShow }">
            <li class="drop-item" :class="{ 'active': btnName === dItem.name }" v-for="(dItem, dIdx) in dropList" :key="dIdx" @click.stop="chooseItem(dItem)">{{ dItem.name }}</li>
        </ul>
    </div>
</template>

<script>
export default {
    name: '',
    props: {
        // 下拉框名称
        btnName: {
            type: String,
            default: '全部'
        },
        // 下拉列表数据
        dropList: {
            type: Array,
            default() {
                return []
            }
        },
        // 用途是点其他位置关闭下拉框
        refName: {
            type: String,
            default: 'box'
        },
    },
    components: {},
    data() {
        return {
            ifShow: false, // 是否显示下拉
        }
    },
    mounted() {
        document.addEventListener('click', this.clickHandle)
    },
    methods: {
        // 用来关闭下拉框的点击事件
        clickHandle (e) {
            let dom = this.$refs[this.refName]
            if (dom && !dom.contains(e.target)) {
                this.ifShow = false
            }
        },
        // 选择下拉框的某一项
        chooseItem (item) {
            this.ifShow = false
            this.$emit('exportBtnChoose', item)
        },
    },
}
</script>
<style lang='less' scoped>
@import '~@/libs/css/mixin.less';
@import '~@/libs/css/theme/theme.less';
.choose-btn {
    width:144px;
    height:40px;
    line-height: 40px;
    background:@newBtnBg;
    border-radius:13px;
    border:1px solid @newBorderColor;
    position: relative;
    margin-right: 24px;
    cursor: pointer;
    &:last-of-type {
        margin: 0;
    }
    &:hover {
        border-color: @newPrimaryColor;
        .iconfont {
            color: @newPrimaryColor;
        }
    }
    .text {
        font-size: 16px;
        color: @themeFontColor_3;
        cursor: pointer;
        padding-left: 48px;
        width: 130px;
        .no-wrap();
        &.blue {
            color: @newPrimaryColor;
        }
    }
    .iconfont {
        position: absolute;
        font-size: 16px;
        color: @newLightFontColor;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
    }
    ::-webkit-scrollbar {
        display: none; /* Chrome Safari */
    }
    .drop-list {
        position: absolute;
        top: 49px;
        left: 0;
        width: 144px;
        height: 240px;
        box-sizing: border-box;
        overflow-y: auto;
        background: @themeBg;
        box-shadow:0px 0px 12px 0px @newBtnShadow;
        border-radius:13px;
        border:1px solid @newBtnBorColor;
        padding: 12px 0;
        transition: height .3s ease;
        z-index: 1000;
        &.height {
            height: 0;
            padding: 0;
            border: 0;
        }
        .drop-item {
            text-align: center;
            color: @newTextColor;
            height: 40px;
            font-size: 14px;
            cursor: pointer;
            .no-wrap();
            &:hover {
                background: @newBtnActiveBg;
            }
        }
        .active {
            color: @newPrimaryColor;
        }
    }
}
</style>