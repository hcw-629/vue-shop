<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- span是每一栏的宽度 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" clearable>
            <!-- v-model="queryinfo.query" -->
            <!-- @clear="getUserlist" -->
            <!-- @click="getUserlist" -->
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表单区域 -->
      <el-table :data="orderData" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="order_pay">
          <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.order_pay === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send">
          <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.is_send === '是'">是</el-tag>
            <el-tag type="danger" v-else>否</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | getDatafilter }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="editadd"
          ></el-button>
          <el-button
            type="success"
            size="mini"
            icon="el-icon-location"
            @click="logistics"
          ></el-button>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[5, 8, 10, 15]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editAdddialogVisible"
      width="30%"
      @close="closeeditAdddialog"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormrules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="citydata"
            expandTrigger="hover"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAdddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAdddialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 物流进度对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="logisticsdialogVisible"
      width="30%"
    >
      <!--  {{item.context}}是物流信息， :timestamp="item.time"是物流时间 -->
      <el-timeline>
        <el-timeline-item
          v-for="(item, i) in addressData"
          :key="i"
          :timestamp="item.time"
        >
          {{ item.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
// 导入的城市地址数据
import citydata from "./citydata";
export default {
  data() {
    return {
      // 订单信息
      orderData: [],

      // 订单请求参数
      queryinfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      editAdddialogVisible: false,
      addressForm: {
        address1: [],
        address2: "",
      },
      addressFormrules: {
        address1: [
          { required: true, message: "请选择省市区/县", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请选择详细地址", trigger: "blur" },
        ],
      },

      // 导入的城市地址数据
      citydata,
      logisticsdialogVisible: false,
      addressData: [
        {
          time: "2018-05-10 09:39:00",
          context: "已签收,感谢使用顺丰,期待再次为您服务",
        },
      ],
    };
  },

  created() {
    this.getOrderData();
  },
  methods: {
    //   获取订单信息
    async getOrderData() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryinfo,
      });
      if (res.meta.status !== 200) {
        return this.$message("获取订单失败");
      }
      console.log(res.data);
      this.orderData = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryinfo.pagesize = newSize;
      this.getOrderData();
    },
    handleCurrentChange(newPage) {
      this.queryinfo.pagenum = newPage;
      this.getOrderData();
    },
    // 修改地址
    editadd() {
      this.editAdddialogVisible = true;
    },
    closeeditAdddialog() {
      this.$refs.addressFormRef.resetFields();
    },
    logistics() {
      this.logisticsdialogVisible = true;
    },
  },
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>