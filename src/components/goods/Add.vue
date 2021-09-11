<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
       <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>

      <!--步骤条  :active="activeIndex-0" 减0是让他变成数字-->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!--  左侧标签-->
      <el-form
        :model="addForm"
        :rules="addrules"
        ref="addruleFormRef"
        label-position="top"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeLeave"
          @tab-click="getParams"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 级联选择器 -->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="catprops"
                expandTrigger="hover"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in activeinfo"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in staticParams"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
            <el-button type="primary" class="addbtn" @click="addgoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog title="图片预览" :visible.sync="photodialogVisible" width="30%">
      <img :src="photoPath" class="photoImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  data() {
    return {
      // 预览图片的显示切换
      photodialogVisible: false,
      // 预览图片的路径
      photoPath: {},
      // 步骤条进度索引
      activeIndex: "0",
      // 添加的商品数据
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        // 上传图片成功的返回值
        pics: [],
        // 商品介绍
        goods_introduce: "",
        attrs: [],
      },
      // addrules表单验证规则
      addrules: {
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
      // 下拉框需要展示的值
      catprops: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 定义查询出来的商品分类数据
      cateList: [],
      // 定义查询出来的商品参数
      activeinfo: [],
      // 定义查询出的静态参数
      staticParams: [],
      // 定义图片上传请求的api路径
      uploadUrl: "http://127.0.0.1:8888/api/private/v1/upload",
      // 图片上传组件的请求头对象,因为上传组件并没有调用axios,所以要手动指定Authorization字段
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
    };
  },
  created() {
    this.getgoodsList();
  },
  methods: {
    // 查询出商品分类数据
    async getgoodsList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("查询失败");
      }
      this.cateList = res.data;
    },

    handleChange() {
      // 判断选择的是否是三级分类
      if (this.addForm.goods_cat.length !== 3) {
        return (this.addForm.goods_cat = []);
      }
    },
    // 判断切换左侧标签的事件
    beforeLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择分类");
        return false;
      }
    },
    // 获取商品动静态参数
    async getParams() {
      if (this.activeIndex === "1") {
        const {
          data: res,
        } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: "many" },
        });
        if (res.meta.status !== 200) {
          return this.$message.error("查询商品动态参数失败");
        }
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
        });
        this.activeinfo = res.data;
      } else if (this.activeIndex === "2") {
        const {
          data: res,
        } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: "only" },
        });
        if (res.meta.status !== 200) {
          return this.$message.error("查询商品静态参数失败");
        }
        this.staticParams = res.data;
      }
    },
    // 定义图片的预览
    handlePreview(file) {
      this.photoPath = file.response.data.url;
      this.photodialogVisible = true;
    },
    // 定义图片的移除
    handleRemove(file) {
        
      //    获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path;
      // 根据临时路径findIndex查到对应的索引值
      const i = this.addForm.pics.findIndex((x) => x.pic === filePath);
      // 调用数组的splice方法，把图片信息对象，从pics数组中移除
      this.addForm.pics.splice(i, 1);
    },
    // 图片上传成功的事件
    handleSuccess(Response) {
      // 1.拼接得到一个图片信息对象
      console.log(Response);
      const picsObj = {
        pic: Response.data.tmp_path,
      };
      // 将图片信息对象push到pics数组中
      this.addForm.pics.push(picsObj);
      
    },
    // 添加商品按钮
    addgoods() {
      this.$refs.addruleFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填入必填信息！");
        }
        //执行添加的业务逻辑,因为addForm在表单要进行双向数据绑定，所以在拼接之前先把addForm深拷贝一份，join把数组变成字符串
        const form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(",");
        // 处理动态参数,把this.activeinfo做forEach循环，每循环一次都拿到一个动态属性的item项
        this.activeinfo.forEach((item) => {
          const newinfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(","),
          };
          this.addForm.attrs.push(newinfo);
        });
        // 处理静态参数
        this.staticParams.forEach((item) => {
          const newinfo = { attr_id: item.attr_id, attr_value: item.attr_vals };
          this.addForm.attrs.push(newinfo);
        });
        form.attrs = this.addForm.attrs;
        const { data: res } = await this.$http.post(`goods`, form);
        if (res.meta.status !== 201) {
          return this.$message.error("创建商品失败");
        }
        this.$message.success("创建商品成功");
        this.$router.push("/goods");
      });
    },
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
    },
  },
};
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.photoImg {
  width: 100%;
}
.addbtn {
  margin-top: 10px;
}
</style>