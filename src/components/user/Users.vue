<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <!-- gutter属性来指定每一栏之间的间隔 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryinfo.query"
            clearable
            @clear="getUserlist"
          >
            <el-button
              @click="getUserlist"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <!-- span是每一栏的宽度 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户表格 -->
      <!-- 当el-table元素中注入data对象数组后，在el-table-column中用prop属性来对应对象中的键名即可填入数据，
      用label属性来定义表格的列名。可以使用width属性来定义列宽。 -->
      <el-table border stripe :data="userlist" style="width: 100%">
        <!-- 添加索引列  type="index"-->
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!-- 用模板插槽显示当前列的数据
            再用e-switch双向绑定状态数据 -->
          <!--  @change 触发switch状态发生变化时的回调函数，
            回调参数：新状态的值，把新状态的数据以参数传入
             slot-scope就是作用域插槽，scope.row就是这一列的信息-->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changestate(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="updateDialog(scope.row.id)"
            ></el-button>

            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteDialog(scope.row.id)"
            ></el-button>

            <!-- 分配角色按钮 tooltip文字提示-->
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="allotRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <!--  @size-change就是选择每页显示几条数据，@current-change就是切换到哪一页的数据，
      :current-page就是当前的页数，:page-sizes就是给每页显示几条数据填选项，
      :page-size就是每页显示多少条数据，:total就是显示哪几个功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!--弹出添加用户的对话框 
      :visible.sync是否显示 Dialog，支持 .sync 修饰符，默认是false,
     @close关闭对话框实现重置效果-->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="30%"
        @close="addDialogClosed"
      >
        <!-- 内容主体区 -->
        <!-- ref是给el-form起了一个引用名称用来调用各种方法的比如重置表单 prop 是验证规则的属性 
      rules是验证规则，model是输入的数据绑定
      status-icon为输入框添加了表示校验结果的反馈图标--->
        <el-form
          :status-icon="true"
          :model="addForm"
          :rules="addFormrules"
          ref="addFormRef"
          label-width="70px"
        >
          <el-form-item label="用户名" prop="username">
            <!-- v-model输入的数据都会输入到addForm中去进行验证 -->
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>

          <el-form-item label="手机" prop="mobile">
            <!-- @input在 Input 值改变时触发checkMobile事件 -->
            <el-input v-model="addForm.mobile" @input="checkMobile"></el-input>
          </el-form-item>
        </el-form>

        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!--弹出修改数据的对话框 
      @close="addDialogClosed"复用了添加用户对话框关闭的重置表单的方法
     -->
      <el-dialog
        title="修改用户信息"
        :visible.sync="updateDialogVisible"
        width="30%"
        @close="addDialogClosed"
      >
        <!-- 修改表单内容主体区 -->
        <!--这里的:rules="addFormrules"复用了添加表单里的验证规则 ref="addFormRef"也是--->
        <el-form
          :status-icon="true"
          :model="editdata"
          :rules="addFormrules"
          label-width="70px"
          ref="addFormRef"
        >
          <el-form-item label="用户名">
            <!-- disabled该输入框不可编辑 -->
            <el-input disabled v-model="editdata.username"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editdata.email"></el-input>
          </el-form-item>

          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editdata.mobile" @input="checkMobile"></el-input>
          </el-form-item>
        </el-form>

        <!-- 底部区域 -->
        <!-- 点击确定传入id调用updateUser方法 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="updateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateUser(editdata.id)"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!--弹出分配角色功能的对话框 
     -->
      <el-dialog
        title="分配角色"
        :visible.sync="allotRoledialogVisible"
        width="30%"
        @close="closeallotRoledialog"
      >
        <span>当前的用户: {{ usersInfo.username }}</span
        ><br />
        <span>当前的角色: {{ usersInfo.role_name }}</span
        ><br />
        <!--v-model绑定的是选择的值，label是选项中的值，
  value是你选中这项后这项真正的值是roleInfo.id,然后这个id会传给selectvalueId  -->
        <span
          >分配新角色:
          <el-select v-model="selectvalueId" placeholder="请选择">
            <el-option
              v-for="item in roleInfo"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="allotRoledialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveAllotRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    //在data中自定义手机的验证规则
    let checkMobile = (rule, value, callback) => {
      //验证手机
      const regMobile = /^1[3|4|5|7|8][0-9]\d{8}$/;
      //如果你输入了东西，并且没通过验证，则提示错误
      if (!regMobile.test(value)) {
        callback(new Error("请输入有效的手机号"));
      }
      callback();
    };

    //在data中自定义邮箱的验证规则
    let checkEmail = (rule, value, callback) => {
      //验证邮箱
      const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (!regEmail.test(value)) {
        callback(new Error("请输入有效的邮箱"));
      }
      callback();
    };
    return {
      // 获取用户列表的参数对象
      queryinfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2,
      },
      //   获取的用户列表数据
      userlist: [],
      // 总共有多少条数据
      total: 0,
      // 因为要通过按钮控制添加用户对话框的显示与隐藏，所以要定义一下
      addDialogVisible: false,

      // 添加用户的表单数据
      addForm: {
        username: "hcw",
        password: "123456",
        email: "139@qq.com",
        mobile: "17373129773",
      },

      // 添加表单的用户规则对象
      addFormrules: {
        // trigger失去焦点时触发验证，required必填项
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 修改用户信息的对话框的显示与隐藏
      updateDialogVisible: false,
      // 修改按钮查询到的用户信息对象
      editdata: {},
      // 分配角色的对话框显示
      allotRoledialogVisible: false,
      // 定义根据id查询出的用户信息对象
      usersInfo: {},
      // 定义查询出的角色信息数组
      roleInfo: [],
      // 定义分配角色下拉框选中的值的id
      selectvalueId: "",
    };
  },
  created() {
    //  点击用户列表就执行getUserlist方法获取users数据
    this.getUserlist();
  },
  methods: {
    //   获取users数据
    async getUserlist() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryinfo,
      });
      if (res.meta.status != 200) {
        return this.$message.error("获取用户列表失败");
      }
      this.userlist = res.data.users;
      this.total = res.data.total;
    },

    // 监听pagesize改变的事件，选择每页显示几条数据，就会触发handleSizeChange事件
    handleSizeChange(newSize) {
      // 选择每页显示几条数据，newSize就相当于上面的page-sizes,
      //然后让定义的queryinfo.pagesize等于newSize，这样每页就显示newSize条数据
      this.queryinfo.pagesize = newSize;
      // this.queryinfo.pagesize发生变化了，所以要重新发起数据的请求getUserlist()来获取数据
      this.getUserlist();
    },
    // 监听页码值改变的事件,选择显示那一页的数据
    handleCurrentChange(newPage) {
      //让定义的queryinfo.pagenum等于newPage，这样该页就显示newPage那页的数据
      this.queryinfo.pagenum = newPage;
      // this.queryinfo.pagenum发生变化了，重新发起数据的请求getUserlist()来获取数据
      this.getUserlist();
    },

    // 触发switch状态发生变化时的回调函数
    async changestate(userinfo) {
      //  userinfo里有需要替换的状态数据，通过this.$http.put发送替换内容的请求
      // 根据userinfo.id替换userinfo.mg_state
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status != 200) {
        // 如果修改失败就把switch状态变回原样
        userinfo.mg_state != userinfo.mg_state;
        return this.$message.error("修改状态失败");
      }
      this.$message.success("修改状态成功");
    },

    // 监听添加用户对话框关闭的事件
    addDialogClosed() {
      // 调用ref的引用的重置表单的方法
      this.$refs.addFormRef.resetFields();
    },

    // 在确定添加用户之前进行预验证
    addUser() {
      // 调用ref的引用的预验证表单的方法,validate对整个表单进行校验的方法
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status != 201) {
          return this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");
        // 添加用户成功后隐藏对话框
        this.addDialogVisible = false;
        // 刷新用户的列表，重新获取用户列表的数据
        this.getUserlist();
      });
    },

    //对手机号进行边输入边校验方法，validateField对部分表单字段进行校验的方法
    checkMobile(val) {
      this.$refs.addFormRef.validateField("mobile");
    },

    // 点击修改按钮触发updateDialog事件
    async updateDialog(rowid) {
      // 展示修改的对话框
      this.updateDialogVisible = true;
      //  根据 ID 查询用户信息
      const { data: res } = await this.$http.get("users/" + rowid);

      if (res.meta.status != 200) {
        return this.$message.error("查询用户失败");
      }
      this.editdata = res.data;
      this.$message.success("查询用户成功");
    },

    // 点击确认修改按钮，发送网络请求进行数据的修改
    updateUser(id) {
      // 调用ref的引用的预验证表单的方法,validate对整个表单进行校验的方法,验证通过的信息才能发起网络请求
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        // 可以发起修改用户的网络请求
        const { data: res } = await this.$http.put(
          "users/" + id,
          this.editdata
        );
        if (res.meta.status != 200) {
          return this.$message.error("修改用户信息失败");
        }
        this.$message.success("修改用户信息成功");
        this.updateDialogVisible = false;
        this.getUserlist();
      });
    },

    //  弹出确认删除的对话框
    async deleteDialog(delid) {
      //this.$confirm是promise对象，
      //点取消会报错误所以这里要捕获错误使用.catch(err=>err)相当于.catch(err=>{return err}),此处简化了
      const delresult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // 点击取消弹出提示框
      if (delresult !== "confirm") {
        return this.$message("已取消删除！");
      }
      // 如果delresult是confirm，发起删除用户的网络请求
      const { data: res } = await this.$http.delete("users/" + delid);
      if (res.meta.status != 200) {
        this.$message.error("删除用户信息失败");
      }
      this.$message.success("删除用户信息成功");
      this.getUserlist();
    },
    // 分配角色功能
    async allotRole(scoperow) {
      this.usersInfo = scoperow;

      // 查询角色信息
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200) {
        this.$message.error("查询角色信息失败");
      }

      this.roleInfo = res.data;

      this.allotRoledialogVisible = true;
    },
    // 点击确定分配角色按钮
    async saveAllotRole() {
      //  如果没有选择分配的角色
      if (!this.selectvalueId) {
        return this.$message.error("请选中分配的角色！");
      }
      // 给用户分配角色的网络请求
      const {
        data: res,
      } = await this.$http.put(`users/${this.usersInfo.id}/role`, {
        rid: this.selectvalueId,
      });
      if (res.meta.status != 200) {
        this.$message.error("分配角色失败");
      }
      this.$message.success("分配角色成功");
      this.getUserlist();
      this.allotRoledialogVisible = false;
    },
    // 当确认分配角色对话框时重置下拉框的值，及清除之前加载的用户信息，即打开就是新的用户信息
    closeallotRoledialog() {
      this.selectvalueId = "";
      this.usersInfo = {};
    },
  },
};
</script>

<style lang="less" scoped>
</style>