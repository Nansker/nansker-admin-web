<template>
  <div class="app-container">

    <el-form :inline="true" :model="userInfo">
      <el-form-item label="用户账号">
        <el-input v-model="userInfo.username" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="用户昵称">
        <el-input v-model="userInfo.name" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input v-model="userInfo.phone" :disabled="true"></el-input>
      </el-form-item>
    </el-form>

    <!--数据列表-->
    <el-table
      ref="roleTable"
      v-loading="listLoading"
      element-loading-text="数据加载中"
      @selection-change="handleSelectionChange"
      :data="list">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column prop="id" label="ID">
      </el-table-column>
      <el-table-column prop="roleName" label="角色名称"/>
      <el-table-column prop="roleCode" label="权限字符"/>
      <el-table-column prop="description" label="描述"/>
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

    <el-row>
      <el-col :offset="10">
        <el-button type="primary" size="medium" @click="handleAssign" round>提交</el-button>
        <el-button size="medium" round @click="handleBack">返回</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import message from "@/utils/message";
import userApi from "@/api/user";
import roleApi from "@/api/role";

export default {
  name:"UserRole",
  data() {
    return {
      listLoading: true,
      userId: "",
      userInfo: {},
      list: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      oldUserRoleIds: [],
      newUserRoleIds: []
    }
  },
  created() {
    //获取route传递的id
    if (this.$route.query && this.$route.query.key) {
      this.userId = this.$route.query.key
    }
    this.fetchData()
  },
  methods: {
    /** 初始化数据 */
    async fetchData() {
      this.listLoading = true
      //获取用户信息
      const userResponse = await userApi.getById(this.userId)
      this.userInfo = userResponse.data

      //获取全部角色
      const roleResp = await roleApi.getAll();
      this.list = roleResp.data

      //初始化用户已分配角色
      const userRoleResponse = await userApi.getRoleByUserId(this.userId);
      this.oldUserRoleIds = userRoleResponse.data
      this.listLoading = false

      this.handleToggleSelection()
    },

    /** 角色切换选择 */
    handleToggleSelection() {
      this.$refs.roleTable.clearSelection();
      this.$nextTick(() => {
        this.oldUserRoleIds.forEach(id => {
          this.list.forEach(row => {
            if (id == row.id) {
              this.$refs.roleTable.toggleRowSelection(row);
            }
          })
        })
      })
    },

    /** 分配角色 */
    handleAssign() {
      if (this.newUserRoleIds.length == 0) {
        message.info("需要为用户分配角色才能访问系统数据")
      } else if (JSON.stringify(this.oldUserRoleIds) === JSON.stringify(this.newUserRoleIds)) {
        message.info("没有改变")
      } else {
        //组装用户角色对象
        let userRole = {
          userId: this.userId,
          roleIdList: this.newUserRoleIds
        }
         userApi.roleAssign(userRole).then(response => {
          this.fetchData()
           message.success("角色更新成功")
        })
      }
    },

    /** 选择角色 */
    handleSelectionChange(val) {
      //清空原数据
      this.newUserRoleIds = []
      val.forEach(role => {
        this.newUserRoleIds.push(role.id)
      })
    },

    /** 选择分页大小 */
    handlePageSizeChange(val) {
      this.queryParams.pageSize = val
      this.fetchData()
    },

    /** 返回 */
    handleBack() {
      this.$router.back()
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

</style>
