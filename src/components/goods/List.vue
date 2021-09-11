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
  <!-- 搜索与添加区域 -->
      <!-- gutter属性来指定每一栏之间的间隔 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryinfo.query"
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <!-- span是每一栏的宽度 -->
        <el-col :span="4">
          <el-button type="primary" @click="addgoods"
            >添加商品</el-button
          >
        </el-col>
      </el-row>

    <el-table :data="goodsList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
         <el-table-column label="商品名称" prop="goods_name" min-width="650px"></el-table-column>
          <el-table-column label="商品价格（元）" prop="goods_price" width="120px"></el-table-column>
           <el-table-column label="商品重量" prop="goods_weight" ></el-table-column>
            <el-table-column label="创建时间" prop="add_time" width="180px">
                <template slot-scope="scope">
                    {{scope.row.add_time | getDatafilter}}
                </template>
            </el-table-column>
              <el-table-column label="操作" min-width="200px">
                  <template slot-scope="scope">
                       <el-button type="primary" icon="el-icon-edit" size="mini" @click="editgoods(scope.row)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="delgoods(scope.row.goods_id)">删除</el-button>
                  </template>
              </el-table-column>
    </el-table>

    <!-- 分页 -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryinfo.pagenum"
      :page-sizes="[3, 5, 8, 10]"
      :page-size="queryinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>

<!-- 编辑商品对话框 -->
<el-dialog
  title="编辑商品"
  :visible.sync="editgooddialogVisible"
  width="30%"
  @close="closeeditgooddialog"
  >
  <el-form :model="editinfo"  
  :rules="editrules"
        ref="editruleFormRef"
        label-position="top">
    <el-form-item label="商品名称"  prop="goods_name">
       <el-input v-model="editinfo.goods_name" ></el-input>
    </el-form-item>
<el-form-item label="价格"  prop="goods_price">
   <el-input v-model="editinfo.goods_price" type="number"></el-input>
</el-form-item>
<el-form-item label="数量"  prop="goods_number">
   <el-input v-model="editinfo.goods_number" type="number"></el-input>
</el-form-item>
<el-form-item label="重量"  prop="goods_weight">
   <el-input v-model="editinfo.goods_weight" type="number"></el-input>
</el-form-item>
 <el-form-item label="分类" prop="goods_cat">
              <!-- 级联选择器 -->
              <el-cascader
                v-model="editinfo.goods_cat"
                :options="cateList"
                :props="catprops"
                expandTrigger="hover"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editgooddialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editgoodsEvent">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {
    data(){
        return{
            // 定义请求的参数
            queryinfo:{
                query:'',
                // 当前页码
                pagenum:1,
                // 每页显示条数
                pagesize:5
            },
            // 定义查询到的数据
            goodsList:[],
            // 总数据条数
            total:0,
            editId:'',
            // 得到的编辑信息
            editinfo:{
              goods_name:'',
              goods_price:0,
              goods_weight:0,
              goods_number:0,
              goods_cat:[]
             
            },
            // editinfo表单验证规则
      editrules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
         goods_cat: [
          { required: true, message: "请输入商品分类", trigger: "blur" },
        ],
       
      },
      // 编辑商品对话框的切换
      editgooddialogVisible:false,
        // 下拉框需要展示的值
      catprops: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 定义查询出来的商品分类数据
      cateList: [],
        }
        
    },
    created(){
        this.getGoodsList()
        this.getgoodscateList();
    },
    methods:{
     
        // 查询商品列表数据
       async getGoodsList(){
           const {data:res}=await this.$http.get('goods',{params:this.queryinfo})
           if(res.meta.status!==200){
              return this.$message('获取失败')
           }
           
            this.goodsList=res.data.goods
            this.total=res.data.total
           
        },
         // 查询出商品分类数据
    async getgoodscateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("查询失败");
      }
      this.cateList = res.data;
    },

    handleChange() {
      // 判断选择的是否是三级分类
      if (this.editinfo.goods_cat.length !== 3) {
        return (this.editinfo.goods_cat = []);
      }
    },
        // 监听一页显示几条数据的变化
        handleSizeChange(newPage){
            this.queryinfo.pagesize=newPage
             this.getGoodsList()
        },
        //  监听页码的变化
        handleCurrentChange(newSize){
        this.queryinfo.pagenum=newSize
         this.getGoodsList()
        },
        // 删除商品
      async  delgoods(delid){
           const result=await  this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(result!=='confirm'){
            return this.$message('您已取消删除')
        }
          const {data:res}=await this.$http.delete('goods/'+delid)
           if(res.meta.status!==200){
              return this.$message('删除失败')
           }
            this.$message.success('删除成功')
            this.getGoodsList()
        },
        // 添加商品的跳转
        addgoods(){
            this.$router.push('goods/add')
        },
        // 编辑商品
        editgoods(row){
          
          this.editId=row.goods_id
          
          this.editinfo=row
         
          this.editgooddialogVisible=true
        },
        // 确认编辑商品
        editgoodsEvent(){
          this.$refs.editruleFormRef.validate(async (valid) => {
        if (!valid)  {
          return this.$message.error("请填入必填信息！");
        }
        const form = _.cloneDeep(this.editinfo);
        form.goods_cat = form.goods_cat.join(",");
            const {data:res}=await this.$http.put('goods/'+this.editId,form)
           if(res.meta.status!==200){
              return this.$message('编辑失败') 
           }
           console.log(res.meta);
          this.$message.success('编辑成功')
           this.editgooddialogVisible=false
           this.getGoodsList()
            this.getgoodscateList();
          })

        },
        // 编辑对话框的表单重置
        closeeditgooddialog(){
          this.$refs.editruleFormRef.resetFields()
        }
    }

}
</script>

<style lang="less" scoped>

</style>