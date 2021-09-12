<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <!-- 添加角色按钮 -->
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="addroledialogVisible = true">
            添加角色
          </el-button>
        </el-col>
      </el-row>

      <!-- 表格区域  stripe是否为斑马纹 table-->
      <el-table :data="roleslist" border stripe>
        <!-- 展开列 展开角色的所有权限 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!--:class动态的class值绑定，值为bdbottom时都加上样式，
              判断当是第一行时加上bdtop的样式，不是第一行时不加 
              v-for遍历循环把当前数据的children的权限信息遍历展示出来
              i1是 scope.row.children的索引相当于数组的索引 -->
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <!-- span 栅格占据的列数 默认值是24 -->
              <el-col :span="5">
                <!-- closable定义一个标签是否可移除 删除时触发 deleteitem3方法-->
                <el-tag closable @close="deleteitem3(scope.row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二级权限和三级权限 -->
              <el-col :span="19">
                <!-- vcenter使一二级权限样式居中 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="deleteitem3(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 closable定义一个标签是否可移除-->
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="deleteitem3(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="350px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="editRolemsg(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deleterole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              @click="allotrights(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="选择要分配的权限"
      :visible.sync="allotrightsdialogVisible"
      width="30%"
      @close="closeDialogEvent"
    >
      <!--  default-expand-all是否默认展开所有节点,默认是false
  node-key每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
  show-checkbox树前面加复选框
  default-checked-keys默认勾选的节点的 key 的数组
  -->
      <el-tree
        :default-expand-all="true"
        node-key="id"
        show-checkbox
        :data="rightslist"
        ref="treeIdRef"
        :props="defaultProps"
        :default-checked-keys="treearray"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="allotrightsdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotPower(rolesId)">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addroledialogVisible"
      width="30%"
      @close="closeaddroledialog"
    >
      <el-form
        :status-icon="true"
        :model="addRole"
        :rules="addRolerules"
        ref="addRoleRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <!-- v-model输入的数据都会输入到addRole中去进行验证 -->
          <el-input v-model="addRole.roleName"></el-input>
        </el-form-item>

        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addroledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolebtn">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色信息对话框 -->
    <el-dialog
      title="修改角色信息"
      :visible.sync="updateroledialogVisible"
      width="30%"
      @close="closeupdateroledialog"
    >
      <el-form
        :status-icon="true"
        :model="editinfo"
        :rules="editinforules"
        ref="editinfoRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <!-- v-model输入的数据都会输入到addRole中去进行验证 -->
          <el-input v-model="editinfo.roleName"></el-input>
        </el-form-item>

        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editinfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="updateroledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updaterole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 定义角色列表数据数组
      roleslist: [],
      // 定义权限列表数据数组
      rightslist: [],
      // 定义肥胖权限列表的对话框的显示
      allotrightsdialogVisible: false,
      //   定义树形结构的属性对象
      defaultProps: {
        // 要显示的数组
        children: "children",
        //  要显示的数组的什么数据
        label: "authName",
      },
      // 把三级权限的id都保存到这个数组中
      treearray: [],
      // 传入分配权限对话框对话框的角色id
      rolesId: "",
      // 添加角色对话框的显示
      addroledialogVisible: false,
      // 定义一个添加角色的输入的信息的对象
      addRole: {
        roleName: "hcw",
        roleDesc: "hcwdesc",
      },
      // 定义添加角色的校验规则
      addRolerules: {
        // trigger失去焦点时触发验证，required必填项
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      // 编辑角色对话框的显示
      updateroledialogVisible: false,
      // 定义对话框的信息对象
      editinfo: {
        roleName: "",
        roleDesc: "",
      },
      // 定义获取对话框的信息的id
      editid: "",
      // 定义修改角色的校验规则
      editinforules: {
        // trigger失去焦点时触发验证，required必填项
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    //   页面一加载就获取角色列表数据的方法
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      // 获取角色列表数据
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200) {
        this.$message.error("获取角色列表失败");
      }
      this.roleslist = res.data;
    },
    // 删除角色的三级权限
    async deleteitem3(role, item3id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message("您已取消删除!");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${item3id}`
      );
      if (res.meta.status != 200) {
        this.$message.error("删除权限失败");
      }
      //    直接把更新后的数据变成role.children里的数据就不用全局渲染了，就不会关闭当前的展开窗口了
      role.children = res.data;
    },
    // 分配权限按钮方法
    async allotrights(role) {
      this.rolesId = role.id;
      // 获取权限列表树形结构数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status != 200) {
        this.$message.error("获取权限列表失败");
      }
      this.rightslist = res.data;

      //   递归获取三级节点id的函数
      this.recursionItem3id(role, this.treearray);
      this.allotrightsdialogVisible = true;
    },
    // 在页面中定义一个递归函数，
    // 作用：把角色列表的数据传到递归函数中，通过递归把三级权限的id传到treearray数组中
    // node角色列表的数据，用node.children判断是否是三级节点，arr保存三级权限的id
    recursionItem3id(node, arr) {
      //  如果node节点里没有children则把node.id保存到arr数组中
      if (!node.children) {
        return arr.push(node.id);
      }
      // 如果没有node.id保存到arr数组中，则继续执行递归函数recursionItem3id
      node.children.forEach((item) => this.recursionItem3id(item, arr));
    },
    //  监听关闭分配权限对话框的事件
    closeDialogEvent() {
      //  关闭分配权限对话框后清除上一个保存的三级权限的id
      this.treearray = [];
    },
    //  给角色授权的方法
    async allotPower(roleId) {
      // 把目前被选中的节点以及目前半选中的节点的id组成数组，再形成以 `,` 分割的字符串作为请求参数
      const rightIdObj = [
        ...this.$refs.treeIdRef.getCheckedKeys(),
        ...this.$refs.treeIdRef.getHalfCheckedKeys(),
      ];
      const rids = rightIdObj.join(",");

      const { data: res } = await this.$http.post(`roles/${roleId}/rights`, {
        rids: rids,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("更新失败");
      }
      this.getRolesList();
      this.allotrightsdialogVisible = false;
    },

    // 定义添加角色确认按钮
    addRolebtn() {
      //  进行信息的预校验
      this.$refs.addRoleRef.validate(async (valid) => {
        //  如果校验通过
        if (!valid) return;

        // 发起添加角色请求
        const { data: res } = await this.$http.post("roles", this.addRole);
        if (res.meta.status != 201) {
          return this.$message.error("添加角色失败");
        }
        this.$message.success("添加角色成功");
        this.getRolesList();
        this.addroledialogVisible = false;
      });
    },
    // 关闭添加角色对话框的重置事件
    closeaddroledialog() {
      this.$refs.addRoleRef.resetFields();
    },
    // 点击编辑按钮触发事件
    editRolemsg(editmsg) {
      this.editid = editmsg.id;
      this.editinfo = editmsg;
      this.updateroledialogVisible = true;
    },
    // 点击确认编辑按钮发送修改请求
    updaterole() {
      //先进行预校验
      this.$refs.editinfoRef.validate(async (valid) => {
        //  如果校验通过
        if (!valid) return;
        // 发送修改请求
        const { data: res } = await this.$http.put(
          "roles/" + this.editid,
          this.editinfo
        );
        if (res.meta.status != 200) {
          return this.$message.error("修改角色失败");
        }
        this.$message.success("修改角色成功");
        this.getRolesList();
        this.updateroledialogVisible = false;
      });
    },
    // 关闭添加角色对话框的重置事件
    closeupdateroledialog() {
      this.$refs.editinfoRef.resetFields();
    },
    // 删除角色信息
    async deleterole(deid) {
      const confirmresult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmresult != "confirm") {
        return this.$message("您已取消删除");
      }
      // 发送删除请求
      const { data: res } = await this.$http.delete("roles/" + deid);
      if (res.meta.status != 200) {
        return this.$message.error("删除角色失败");
      }
      this.$message.success("删除角色成功");
      this.getRolesList();
    },
  },
};
</script>

<style lang="less" scoped>
// 标签上下左右外边距
.el-tag {
  margin: 7px;
}
// 设置上边框
.bdtop {
  border-top: 1px solid #eee;
}
// 设置下边框
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  // 在纵向上居中
  align-items: center;
}
</style>