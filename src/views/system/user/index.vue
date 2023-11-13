<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="queryParams.username" placeholder="请输入用户名" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入昵称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择用户状态">
          <el-option :key="1" label="正常" :value="1"></el-option>
          <el-option :key="0" label="禁用" :value="0"></el-option>
        </el-select>
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
      <el-table-column prop="id" label="ID"/>
      <el-table-column label="昵称">
        <template slot-scope="scope">
          <div class="user-name-wrapper">
            <el-avatar :size="48" v-if="scope.row.avatar" :src="scope.row.avatar"></el-avatar>
            <el-avatar :size="48" v-else>{{ scope.row.name }}</el-avatar>
            <span class="user-name">{{ scope.row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名"/>
      <el-table-column prop="phone" label="手机号"/>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status ==1 ">正常</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="注册时间"/>
      <el-table-column label="操作" align="center" width="200px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleRemove(scope.row)">删除</el-button>
          <el-popover
            style="margin-left: 8px"
            trigger="click">
            <el-button size="mini" type="text" icon="el-icon-unlock" @click="handlePassword(scope.row)">重置密码</el-button>
            <br/>
            <el-button size="mini" type="text" icon="el-icon-coordinate" @click="handleRoleAssign(scope.row)">分配角色
            </el-button>
            <el-button slot="reference" size="mini" type="text" icon="el-icon-warning-outline">更多</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination
      background
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogShow" width="650px" append-to-body>
      <el-form ref="form" :model="dialogFrom" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="12" v-if="this.dialogFrom.id">
            <el-form-item label="用户ID">
              <el-input v-model="dialogFrom.id" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户昵称">
              <el-input v-model="dialogFrom.name" placeholder="请输入用户名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号">
              <el-input v-model="dialogFrom.phone" placeholder="请输入用户手机号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户状态" prop="status">
              <el-radio-group v-model="dialogFrom.status">
                <el-radio :label="1">正常</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input type="textarea" placeholder="备注内容" v-model="dialogFrom.description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogSubmitForm">确 定</el-button>
        <el-button @click="dialogCancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import userApi from "@/api/user";
import message from "@/utils/message";
import router from "@/router";

export default {
  name: "UserIndex",
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
      dialogFrom: {
        status: 1
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /** 初始化数据 */
    async fetchData() {
      this.listLoading = true
      const response = await userApi.list(this.queryParams)
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
      this.dialogTitle = "添加用户"
    },

    /** 更新数据 */
    async handleUpdate(row) {
      this.dialogShow = true
      this.dialogTitle = "修改用户信息"

      const response = await userApi.getById(row.id)
      this.dialogFrom = response.data
    },

    /** 分配角色 */
    handleRoleAssign(row) {
      router.push({path: "/system/user/role", query: {key: row.id}})
    },

    /** 重置密码 */
    handlePassword(row) {
      router.push({path: "/system/user/password", query: {key: row.username}})
    },

    /** 删除数据 */
    handleRemove(row) {
      const that = this
      message.confirm('确认删除【' + row.username + '】的信息？', async function () {
        await userApi.remove(row.id)
        message.success("删除成功")
        await that.fetchData()
      })
    },

    /** 弹窗表单数据提交按钮 */
    async dialogSubmitForm() {
      if (this.dialogFrom.id) {
        //修改
        await userApi.update(this.dialogFrom)
        message.success("修改成功")
        this.dialogCancel()
        await this.fetchData();
      } else {
        //添加
        await userApi.save(this.dialogFrom)
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
      this.dialogFrom = {
        status: 1
      };
    },

  }

}
</script>

<style lang="scss" scoped>
.user-name-wrapper {
  display: flex;
  align-items: center;

  .user-name {
    margin-left: 10px;
  }
}
</style>
