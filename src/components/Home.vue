<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/ntf.jpg" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 左侧导航区 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-btn" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <!-- unique-opened	是否只保持一个子菜单的展开 -->
        <el-menu
        :default-active="activePath"
        router
        :collapse-transition="false"
         :collapse="isCollapse"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#1390E2"
         unique-opened
        >
          <!-- 一级菜单 -->
          <!-- :index默认是字符串，且应该是唯一的id -->
          <el-submenu  :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 根据唯一的id遍历图标对应的class值-->
              <i :class="iconsObj[item.id]" id="icons"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <!-- 以'/'+secItem.path为index的值进行路由跳转 -->
            <el-menu-item @click="saveNavStatus('/'+secItem.path)" :index="'/'+secItem.path" v-for="secItem in item.children" :key="secItem.id">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{secItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主要内容区 -->
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      //左侧菜单数据
      menulist: [],
    //   根据一级菜单唯一的id给图标设置一个对象，每个id对应一个class值
      iconsObj:{
          '125':'iconfont icon-users',
          '103':'iconfont icon-lock_fill',
          '101':'iconfont icon-shangpin',
          '102':'iconfont icon-danju',
          '145':'iconfont icon-baobiao'
      },
      // 左侧菜单是否折叠
      isCollapse:false,
      // 定义二级菜单被激活的链接地址
      activePath:''
    };
  },
  // 因为页面一加载就应该获取左侧菜单数据，所以这里定义一个生命周期函数create()
  created() {
    this.getMenuList();
    // 页面一加载就应该获取保持高亮的二级菜单的session
    this.activePath=window.sessionStorage.getItem('activePath')
  },
  methods: {
    loginout() {
      // 销毁本地token
      window.sessionStorage.clear();
      // 跳转到登录页
      this.$router.push("/login");
    },
    // 获取左侧所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
       //把得到的数据塞到menulist数组里
      this.menulist = res.data;
    },
    // 点击按钮切换菜单的折叠和展开
    toggleCollapse(){
      this.isCollapse=!this.isCollapse
    },
    // 保存二级菜单链接的激活状态
    saveNavStatus(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      // 当点击不同的链接时重新给data中定义的activePath赋值
      this.activePath=activePath
    }
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 18px;
  > div {
    display: flex;
    // 居中对齐弹性盒的各项
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu{
    border-right:none;
}
}
.el-main {
  background-color: #eaedf1;
}
// 图标
#icons{
    margin-right: 10px;
}
.toggle-btn{
  background-color: rgb(51, 140, 175);
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  // letter-spacing 属性增加或减少字符间的空白（字符间距）,
  //em相对于父级元素的font-size计算而来,父级元素：20px，子级元素的1em相当于20px
  letter-spacing: 0.2em;
  // 鼠标放上去变成一个小手
  cursor: pointer;
}

</style>
