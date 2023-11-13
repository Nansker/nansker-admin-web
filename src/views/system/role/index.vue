<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="queryParams.roleName" placeholder="请输入角色名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="queryFromReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!--操作栏-->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleSave">新增</el-button>
      </el-col>
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
      <el-table-column type="index" label="序号" width="55"/>
      <el-table-column prop="id" label="ID"/>

      <el-table-column prop="roleName" label="角色名称"/>
      <el-table-column prop="roleCode" label="权限字符"/>
      <el-table-column prop="description" label="描述"/>

      <el-table-column prop="updateTime" label="更新时间"/>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleRemove(scope.row)">删除</el-button>
          <el-button size="mini" type="text" icon="el-icon-coordinate" @click="handleAssign(scope.row)">分配权限</el-button>
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

    <!-- 添加或修改对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogShow" width="500px" append-to-body>
      <el-form ref="form" :model="dialogFrom" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="dialogFrom.roleName" placeholder="请输入角色名称"/>
        </el-form-item>
        <el-form-item label="权限字符">
          <el-input v-model="dialogFrom.roleCode" placeholder="请输入权限字符"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" placeholder="备注内容" v-model="dialogFrom.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogSubmitForm">确 定</el-button>
        <el-button @click="dialogCancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import roleApi from "@/api/role";
import message from "@/utils/message";
import router from "@/router";

export default {
  name: "RoleIndex",
  data() {
    return {
      listLoading: true,
      list: [],//数据列表
      total: 0,//数据记录数
      queryParams: {
        pageNum: 1,//当前页
        pageSize: 10//分页大小
      },
      dialogTitle: "",
      dialogShow: false,
      dialogFrom: {},
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /** 初始化数据 */
    async fetchData() {
      this.listLoading = true
      const response = await roleApi.list(this.queryParams)
      this.list = response.data.rows
      this.total = response.data.total
      this.listLoading = false
    },

    /** 查询数据 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.fetchData()
    },

    /** 保存数据 */
    handleSave() {
      this.dialogShow = true
      this.dialogTitle = "添加角色"
    },

    /** 更新数据 */
    async handleUpdate(row) {
      this.dialogShow = true
      this.dialogTitle = "修改角色信息"
      const response = await roleApi.getById(row.id)
      this.dialogFrom = response.data
    },

    /** 删除数据 */
    handleRemove(row) {
      const that = this
      message.confirm('确认删除【' + row.roleName + '】的信息？', function () {
        roleApi.remove(row.id).then(response => {
          message.success("删除成功")
          that.fetchData()
        })
      })
    },

    /**分配权限 */
    handleAssign(row) {
      router.push({path: "/system/role/menu", query: {id: row.id}})
    },

    /** 弹窗表单数据提交按钮 */
    async dialogSubmitForm() {
      if (this.dialogFrom.id) {
        //修改
        await roleApi.update(this.dialogFrom)
        message.success("修改成功")
        this.dialogCancel()
        await this.fetchData();
      } else {
        //添加
        await roleApi.save(this.dialogFrom)
        message.success("添加成功")
        this.dialogCancel()
        await this.fetchData();
      }
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

    /** 弹窗取消按钮 */
    dialogCancel() {
      this.dialogShow = false
      this.dialogFromReset()
    },

    /** 搜索重置按钮操作 */
    queryFromReset() {
      this.queryParams = {
        pageSize: 10,
        pageNum: 1
      }
      this.handleQuery()
    },

    /** 弹窗表单重置 */
    dialogFromReset() {
      this.dialogFrom = {};
    },
  }
}
</script>

<style scoped>

</style>
