<template>
  <div class="login_container">
    <!-- 登录盒子 -->
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.jpg" alt="" />
      </div>
      <!-- 表单 -->
      <el-form
        ref="loginformRef"
        :model="loginform"
        :rules="loginformrules"
        label-width="0px"
        class="login_form"
      >
        <el-form-item prop="username">
          <!-- prefix-icon添加前置小图标 -->
          <el-input
            v-model="loginform.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginform.password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <!-- 表单按钮 -->
        <div class="btns">
          <el-button type="info" @click="resetLoginForm">重置</el-button>
          <el-button type="success" @click="login">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      // 登录表单的数据绑定对象
      loginform: {
        username: "admin",
        password: "123456",
      },
      loginformrules: {
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
      },
    };
  },
  methods: {
    // 按钮重置
    resetLoginForm() {
      this.$refs.loginformRef.resetFields();
    },
    // 登录前预验证
    login() {
      this.$refs.loginformRef.validate(async (valid) => {
        // valid为true则通过，默认是true，!valid预验证不通过
        if (!valid) return;
        //  预验证通过，发起登录请求
        const { data: res } = await this.$http.post("login", this.loginform);
        //  状态码不是200，登录失败
        if (res.meta.status !== 200) return this.$message.error("登录失败");
        this.$message.success("登录成功");
        // 1．将登录成功之后的token，保存到客户端的sessionstorage中
        window.sessionStorage.setItem("token", res.data.token);
        // 1.1项目中除了登录之外的其他API接口，必须在登录之后才能访问
        // 1.2 token只应在当前网站打开期间生效，所以将 token保存在sessionStorage 中
        //  2．通过编程式导航跳转到后台主页，路由地址是/home
        this.$router.push("/home");
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: skyblue;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  // 进行位移，横轴上移动-50%，纵轴上移动-50%
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}
.login_form {
  position: absolute;
  // 放最下面
  bottom: 10px;
  width: 100%;
  padding: 0 20px;
  // box-sizing默认是content-box，要改成border-box为元素指定的任何内边距和边框都将在已设定的宽度和高度内进行绘制
  box-sizing: border-box;
}
.btns {
  // 弹性盒模型
  display: flex;
  // 尾部对齐
  justify-content: flex-end;
}
</style>