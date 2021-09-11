<template>
  <div>  
      <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

      <!-- 卡片区域 -->
    <el-card class="box-card">
<div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
    
    
    </div>
       
  
</template>

<script>
// 使用lodash进行数据的合并
import _ from "lodash";
import * as echarts from 'echarts';
export default {
    data(){
        return{
            // 需要合并的数据
            options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
        }
    },
    created(){

    },
    // 在页面渲染完后再初始化echarts
  async  mounted(){
         // based on prepared DOM, initialize echarts instance准备好的DOM初始化实例
        var myChart = echarts.init(document.getElementById('main'));

 const { data: res } = await this.$http.get("reports/type/1");
      if (res.meta.status !== 200) {
        return this.$message("获取失败");
      }

         // specify chart configuration item and data准备好数据和配置项
    //    把查询到的数据和定义的数据进行合并,因为直接用获取到的数据会失去一些效果，所以要合并一下
   const result= _merge(res.data,this.options)

        // use configuration item and data specified to show chart展示数据
        myChart.setOption(result);
    },
    methods:{

    }

}
</script>

<style lang="less" scoped>

</style>