<!--
    by: ssfei  2018/11/29
    name: 工作台
    notes:
-->
<template>
    <component
        :is="currentView"
        @updateView="updateView">
    </component>
</template>
<script>
import {mapState,mapMutations,mapGetters} from "vuex";
import operatingPlatform from './operatingPlatform.vue';
import classWisdomList from './classWisdomList.vue';
import classWisdom from '../teacher/classInData/classRecords/ktzh/ktzhWrap.vue';
export default {
     data(){
        return{
            currentView:"operatingPlatform",
        }
    },
     components:{
        operatingPlatform,
        classWisdomList,
        classWisdom
    },
    created () {
        this.currentView=this.$route.query.currentView?this.$route.query.currentView:this.currentView
    },
    computed:{
    },
    watch:{

    },
    methods:{
        /**
         * 当前显示的模块
         * @param _val {String}
         */
        updateView(name){
            this.currentView=name;
            if(name == 'operatingPlatform'){
                this.$routePlugin.delQuery('currentView','from');
            }
            // else{
            //     this.$routePlugin.addQuery({currentView:name});
            // }
        },

    }
}
</script>
<style lang="less" scoped>
@import "~@/libs/css/theme/theme.less";

</style>
