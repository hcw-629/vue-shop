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
          <el-button type="primary" @click="showaddCate">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <!--columns	表格各列的配置 data	表格各行的数据
        show-index	是否显示数据索引 expand-type	是否为展开行类型表格 
        selection-type	是否为多选类型表格 -->
      <tree-table
        :data="goodscate"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        :border="true"
        class="treetable"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>

        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0"> 一级 </el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">
            二级
          </el-tag>
          <el-tag type="warning" v-else> 三级 </el-tag>
        </template>

        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <!-- 编辑按钮 -->
          <el-button type="primary" icon="el-icon-edit" size="mini"
            @click="editCate(scope.row)">编辑</el-button
          >

          <!-- 删除按钮 -->
          <el-button type="danger" icon="el-icon-delete" size="mini"
             @click="deleteCate(scope.row.cat_id)">删除</el-button
          >
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

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatedialogVisible"
      width="40%"
     @close="closeaddCatedialog"
    >
      <el-form
        :status-icon="true"
        :model="addCateinfo"
        :rules="addCateinforules"
        ref="addCateRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <!-- v-model输入的数据都会输入到addRole中去进行验证 -->
          <el-input v-model="addCateinfo.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="父级分类" prop="cat_level" >
          <!--v-model将选中的值双向绑定到data中 options用来指定数据源，props定义下拉框props对象 -->
           <el-cascader
           change-on-select
           clearable
           style="width:100%;"
    v-model="selectedKeys"
    :options="getParentCateinfo"
    expandTrigger="hover"
    :props="cascaderProps"
    @change="parentCateChange"></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate"
          >确 定</el-button
        >
      </span>
    </el-dialog>

<!-- 修改分类名称对话框 -->
    <el-dialog
  title="修改分类名称"
  :visible.sync="editCatedialogVisible"
  width="30%"
  @close="closeeditCatedialog"
  >
   <el-form
        :status-icon="true"
        :model="editCateinfo"
        :rules="editCateinforules"
        ref="editCateinfoRef"
        label-width="100px"
      >
   <el-form-item label="分类名称" prop="cat_name">
          <!-- v-model输入的数据都会输入到addRole中去进行验证 -->
          <el-input v-model="editCateinfo.cat_name"></el-input>
        </el-form-item>
   </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editCatedialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editCateSure">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取商品分类信息的请求参数，获取的是第三级的分类数据
      queryinfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 商品分类数据
      goodscate: [],
      // 总共几条数据
      total: 0,
      // 威table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
          width: "200px",
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          // 表示将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用的模板名称
          template: "isok",
          width: "100px",
        },
        {
          label: "排序",
          prop: "cat_level",
          // 表示将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用的模板名称
          template: "order",
          width: "100px",
        },
        {
          label: "操作",
          // 表示将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用的模板名称
          template: "opt",
          width: "200px",
        },
      ],
      // 定义添加分类的对话框
      addCatedialogVisible: false,
      // 定义添加的分类的数据
      addCateinfo: {
        cat_pid: 0,
        cat_name: "",
        cat_level: 0,
      },
      // 定义添加分类的验证规则
      addCateinforules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
    //   父级分类列表数据
    getParentCateinfo:[],
    // 定义下拉框props对象
    cascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children'

    },
    // 选中的值的id
    selectedKeys:[],
    // 编辑分类列表的对话框
    editCatedialogVisible:false,
    // 点击编辑分类列表取到的此条数据信息
    editCateinfo: {
        cat_name: ""
      },
      // 点击编辑分类列表取到的此条数据信息的id
    editCateid:'',
    // 点击编辑分类的验证规则
      editCateinforules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
    }
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    // 获取商品分类信息的方法,params vue路由传参的方法
    async getGoodsCate() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryinfo,
      });
      if (res.meta.status != 200) {
        return this.$message("获取商品分类失败");
      }
      
      this.goodscate = res.data.result;
      this.total = res.data.total;
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.queryinfo.pagesize = newSize;
      this.getGoodsCate();
    },
    // 监听当前页改变
    handleCurrentChange(newPage) {
      this.queryinfo.pagenum = newPage;
      this.getGoodsCate();
    },
    // 弹出添加分类的对话框
    showaddCate() {
        // 先获取父级分类的数据列表
        this.getParentCate()
        // 再显示对话框
      this.addCatedialogVisible = true;
    },
    // 获取父级分类的数据类别
  async  getParentCate(){
    //   获取前两级分类数据
         const { data: res } = await this.$http.get("categories", {
        params: {type:2},
      });
      if (res.meta.status !== 200) {
        return this.$message("获取父级分类失败");
      }
     this.getParentCateinfo=res.data
    },
    // 选择项发生变化立即触发这个函数,没选父级的那么添加的就是一级的分类
    parentCateChange(){
        console.log(this.selectedKeys);
        // 如果选择项为空，即selectedKeys的值的length为0
        // 如果选择项不为空，即selectedKeys的值的length大于0
        if(this.selectedKeys.length>0){
            // 父级分类的id
            this.addCateinfo.cat_pid=this.selectedKeys[this.selectedKeys.length-1]
            // 为当前分类的等级赋值
            this.addCateinfo.cat_level=this.selectedKeys.length
            return
        }else{
            this.addCateinfo.cat_pid=0
            this.addCateinfo.cat_level=0
        }
    },
    // 点击添加分类的确认按钮
    addCate(){
       this.$refs.addCateRef.validate(async valid=>{
           if(!valid) return
            const { data: res } = await this.$http.post("categories", this.addCateinfo);
      if (res.meta.status !== 201) {
        return this.$message("添加分类失败");
      }
      this.$message.success("添加分类成功");
      this.addCatedialogVisible = false;
      this.getGoodsCate();

       })
    },
    // 关闭添加分类对话框的表单重置
    closeaddCatedialog(){
        this.$refs.addCateRef.resetFields()
        this.selectedKeys=[]
        this.addCateinfo.cat_pid=0
            this.addCateinfo.cat_level=0
    },
    // 编辑商品分类名称
    editCate(editCatemsg){
         this.editCateid=editCatemsg.cat_id
        this.editCateinfo=editCatemsg
        this.editCatedialogVisible=true
    },
    // 点击编辑商品分类对话框确定按钮
    editCateSure(){
        this.$refs.editCateinfoRef.validate(async valid=>{
           if(!valid) return
            const { data: res } = await this.$http.put("categories/"+this.editCateid,this.editCateinfo);
      if (res.meta.status !== 200) {
        return this.$message("更新失败");
      }
      this.$message.success("更新成功");
      this.editCatedialogVisible = false;
      this.getGoodsCate();

       })
    },
     // 关闭编辑商品分类对话框的表单重置
    closeeditCatedialog(){
  this.$refs.editCateinfoRef.resetFields()
    },
    // 删除分类
   async deleteCate(delid){
      const confirmresult= await  this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmresult!=='confirm'){
            return this.$message("您已取消删除！");
        }
          const { data: res } = await this.$http.delete("categories/"+delid);
      if (res.meta.status !== 200) {
        return this.$message("删除失败");
      }
      this.$message.success("删除成功");
      
      this.getGoodsCate();
    }
  },
};
</script>


<style lang="less" scoped>
.treetable {
  margin-top: 15px;
}
</style>