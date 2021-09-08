<template>
  <div>
       <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

        <!-- 卡片区域 -->
    <el-card class="box-card">

        <!-- 添加分类按钮 -->
        <el-row>
            <el-col>
                <el-button type="primary">添加分类</el-button>
            </el-col>
        </el-row>

        <!-- 表格区域 -->
        <!--columns	表格各列的配置 data	表格各行的数据
        show-index	是否显示数据索引 expand-type	是否为展开行类型表格 
        selection-type	是否为多选类型表格 -->
       <tree-table :data="goodscate" :columns="columns"
       :selection-type="false"
       :expand-type="false"
       :show-index="true"
       index-text="#"
       :border="true"
       class="treetable">
       <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted===false"
            style="color:lightgreen;"></i>
            <i class="el-icon-error"  style="color:red;" v-else></i>
        </template>

        <!-- 排序 -->
         <template slot="order" slot-scope="scope">
            <el-tag v-if="scope.row.cat_level===0">
                一级
            </el-tag>
            <el-tag type="success" v-else-if="scope.row.cat_level===1">
                二级
            </el-tag>
            <el-tag type="warning" v-else>
                三级
            </el-tag>
        </template>

         <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
             <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            >编辑</el-button>

            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            >删除</el-button>
        </template>

       </tree-table>

        <!-- 分页区域 -->
         <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[3, 5, 8, 10]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>


    </el-card>
  </div>
</template>

<script>
export default {
    data(){
        return{
            // 获取商品分类信息的请求参数
            queryinfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            // 商品分类数据
            goodscate:[],
            // 总共几条数据
            total:0,
            // 威table指定列的定义
            columns:[
                {
                    label:'分类名称',
                    prop:'cat_name',
                    width:'200px'
                },
                 {
                    label:'是否有效',
                    prop:'cat_deleted',
                    // 表示将当前列定义为模板列
                    type:'template',
                    // 表示当前这一列使用的模板名称
                    template:'isok',
                     width:'100px'
                },
                 {
                    label:'排序',
                    prop:'cat_level',
                    // 表示将当前列定义为模板列
                    type:'template',
                    // 表示当前这一列使用的模板名称
                    template:'order',
                     width:'100px'
                },
                 {
                    label:'操作',
                    // 表示将当前列定义为模板列
                    type:'template',
                    // 表示当前这一列使用的模板名称
                    template:'opt',
                    width:'200px'
                },
            ]
        }
    },
    created(){
        this.getGoodsCate()
    },
    methods:{
        // 获取商品分类信息的方法,params vue路由传参的方法
      async  getGoodsCate(){
        const {data:res} = await  this.$http.get('categories',{params:this.queryinfo})
            if(res.meta.status!=200){
               return this.$message('获取商品分类失败')
            }
            this.goodscate=res.data.result
             this.total=res.data.total
          
        },
        // 监听pagesize改变
        handleSizeChange(newSize){
            this.queryinfo.pagesize=newSize
             this.getGoodsCate()
        },
        // 监听当前页改变
        handleCurrentChange(newPage){
             this.queryinfo.pagenum=newPage
             this.getGoodsCate()
        }

    }

}
</script>


<style lang="less" scoped>
.treetable{
    margin-top: 15px;
}
</style>