<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- Alert 警告 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>

      <!--级联选择器  -->
      <el-row class="spantext">
        <el-col>
          <span
            >选择商品分类：
            <el-cascader
              v-model="selectedKeys"
              :options="cateList"
              :props="setcatevalue"
              expandTrigger="hover"
              @change="handleChange"
            ></el-cascader
          ></span>
        </el-col>
      </el-row>

      <!-- Tabs 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many" :disabled="isselectThird">
          <el-button type="primary" size="mini" @click="adddialogVisible = true"
            >添加参数</el-button
          >
          <el-table :data="activeparamsData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 展开的标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="deltag(i, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加标签按钮按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="updatepramas(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deletepramas(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only" :disabled="isselectThird">
          <el-button type="primary" size="mini" @click="adddialogVisible = true"
            >添加属性</el-button
          >
          <el-table :data="stateparamsData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 展开的标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="deltag(i, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加标签按钮按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="updatepramas(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deletepramas(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数或属性对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="adddialogVisible"
      width="30%"
      @close="closedialog"
    >
      <el-form
        :model="addForm"
        :rules="rules"
        ref="ruleFormRef"
        label-width="100px"
      >
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addparams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editdialogVisible"
      width="30%"
      @close="closedialog"
    >
      <el-form
        :model="editForm"
        :rules="rules"
        ref="ruleFormRef"
        label-width="100px"
      >
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editparams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 定义分类数据
      cateList: [],
      //  定义选择器中选中的值的双向绑定
      selectedKeys: [],
      // props级联选择框的配置对象
      setcatevalue: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 定义tags标签默认选择的值
      activeName: "many",
      //   动态参数
      activeparamsData: [],
      //   静态参数
      stateparamsData: [],
      //  添加参数或属性对话框的显示
      adddialogVisible: false,
      // 定义表单input输入的值
      addForm: {
        attr_name: "",
      },

      // 定义表单规则
      rules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },

      //  修改参数或属性对话框的显示
      editdialogVisible: false,
      // 定义根据id查到的参数值
      editForm: {},
    };
  },
  computed: {
    //   如果级联选择器没有选择第三级分类，则隐藏tabs标签
    isselectThird() {
      if (this.selectedKeys.length !== 3) {
        return true;
      }
      return false;
    },
    //   定义选择第三级分类的id
    cateID() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2];
      }
      return null;
    },
    // 定义添加参数或属性的标题判断
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
    },
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    // 获取商品分类信息的方法,params vue路由传参的方法
    async getGoodsCate() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message("获取商品分类失败");
      }
      this.cateList = res.data;
    },
    // 当选择级联选择器中的选项后，触发这个函数
    handleChange() {
      this.getParamsData();
    },
    // tabs标签触发的函数
    handleClick() {
      this.getParamsData();
    },
    // 封装一下获取参数数据的方法
    async getParamsData() {
      // 只能选择三级分类,如果选的不是三级分类，则清空selectedKeys
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = [];
        // 如果选的不是三级分类,不显示动态参数和静态参数
        this.activeparamsData = [];
        this.stateparamsData = [];
        return;
      }
      //    如果选的是三级分类，则获取参数列表
      const { data: res } = await this.$http.get(
        `categories/${this.cateID}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message("获取参数失败");
      }
      //   把attr_vals变成数组
      res.data.forEach((item) => {
        // 判断attr_vals是否为空
        item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
        // 把attr_vals变成数组的同时把inputVisible和inputValue定义一下
        item.inputVisible = false;
        item.inputValue = "";
      });
      console.log(res.data);

      if (this.activeName === "many") {
        this.activeparamsData = res.data;
      } else {
        this.stateparamsData = res.data;
      }
    },
    // 关闭对话框触发的重置事件
    closedialog() {
      this.$refs.ruleFormRef.resetFields();
    },
    // 点击确定按钮添加参数
    addparams() {
      // 进行预校验
      this.$refs.ruleFormRef.validate(async (vaild) => {
        if (!vaild) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateID}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 201) {
          return this.$message("添加参数失败");
        }
        this.getParamsData();
        this.$message.success("添加参数成功");

        this.adddialogVisible = false;
      });
    },
    // 编辑动态参数对话框
    async updatepramas(updatemsgId) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateID}/attributes/${updatemsgId}`,
        {
          params: {
            attr_sel: this.activeName,
          },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message("获取参数失败");
      }
      this.getParamsData();
      this.editForm = res.data;
      this.editdialogVisible = true;
    },
    // 确认修改参数
    editparams() {
      // 进行预校验
      this.$refs.ruleFormRef.validate(async (vaild) => {
        if (!vaild) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateID}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.editForm.attr_sel,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message("修改参数失败");
        }
        this.$message.success("修改参数成功");
        this.getParamsData();
        this.editdialogVisible = false;
      });
    },
    // 删除参数
    async deletepramas(delmsgId) {
      const confirmresult = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmresult !== "confirm") {
        return this.$message("您已取消删除");
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.cateID}/attributes/${delmsgId}`
      );
      if (res.meta.status !== 200) {
        return this.$message("删除参数失败");
      }
      this.getParamsData();
      this.$message.success("删除参数成功");
    },
    // 输入框失去焦点时和按下enter时触发这个事件
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false;
        row.inputValue = "";
        return;
      }
      // 如果没有return 则做后续的处理,trim去除字符串的头尾空格,join把数组中的所有元素转换为一个字符串,push数组中添加新元素
      row.attr_vals.push(row.inputValue.trim());
      row.inputVisible = false;
      row.inputValue = "";

      this.savevals(row);
    },
    // 发起请求保存操作
    async savevals(row) {
      const { data: res } = await this.$http.put(
        `categories/${row.cat_id}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(","),
        }
      );
      if (res.meta.status !== 200) {
        return this.$message("更新失败");
      }
      this.$message.success("更新成功");
    },

    // 点击按钮时显示输入框
    showInput(row) {
      row.inputVisible = true;
      //  让文本框自动获取焦点
      // $nextTick的作用就是当页面元素重新被渲染时，才会指定回调函数中的代码
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 删除标签splice() 方法用于添加或删除数组中的元素。
    deltag(i, row) {
      row.attr_vals.splice(i, 1);
      this.savevals(row);
    },
  },
};
</script>

<style lang="less" scoped>
.spantext {
  margin: 10px 0;
}
.el-tag {
  margin: 5px;
}
.input-new-tag {
  width: 100px;
}
</style>