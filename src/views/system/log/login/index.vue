<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
      <el-form-item label="用户名" prop="roleName">
        <el-input v-model="queryParams.username" placeholder="请输入用户名" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="queryFromReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!--操作栏-->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="handleBatchRemove">删除</el-button>
      </el-col>
    </el-row>

    <!--数据列表-->
    <el-table
      v-loading="listLoading"
      element-loading-text="数据加载中"
      :data="list">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column prop="id" label="ID"/>
      <el-table-column prop="username" label="用户名"/>
      <el-table-column prop="ipaddr" label="登录 ip"/>
      <el-table-column prop="msg" label="登录成功"/>
      <el-table-column prop="accessTime" label="访问时间"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleRemove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination
      style="margin-top: 12px;float: right"
      @size-change="handlePageSizeChange"
      @current-change="handlePageNumChange"
      :current-page="queryParams.pageNum"
      :page-sizes="[10, 20, 30]"
      :page-size="queryParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

  </div>
</template>

<script>
import logLoginApi from "@/api/log/logLogin";
import message from "@/utils/message";

export default {
  name: "LogLoginIndex",
  data() {
    return {
      listLoading: true,
      list: [],//数据列表
      total: 0,//数据记录数
      queryParams: {
        pageNum: 1,//当前页
        pageSize: 10//分页大小
      },
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    //初始化数据
    /** 初始化数据 */
    async fetchData() {
      this.listLoading = true
      const response = await logLoginApi.listPage(this.queryParams)
      this.list = response.data.rows
      this.total = response.data.total
      this.listLoading = false
    },

    /** 查询数据 */
    async handleQuery() {
      this.queryParams.pageNum = 1
      await this.fetchData()
    },

    /** 删除数据 */
    async handleRemove(row) {
      const that = this
      message.confirm('确认删除【' + row.username + '】的信息？', function () {
        logLoginApi.remove(row.id).then(resp => {
          message.success("删除成功")
          that.fetchData()
        })
      })
    },

  /** 批量删除数据 */
  handleBatchRemove() {

  },

  /** 选择分页大小 */
  handlePageSizeChange(val) {
    this.queryParams.pageSize = val
    this.fetchData()
  },

  /** 选择当前页 */
  handlePageNumChange(val) {
    this.queryParams.pageNum = val
    this.fetchData()
  },
}
}
</script>

<style scoped>
.app-container {

}
</style>
