<template>
  <div class="app-container">

    <el-form :inline="true" :model="roleInfo">
      <el-form-item label="角色名称">
        <el-input v-model="roleInfo.roleName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="权限标识">
        <el-input v-model="roleInfo.roleCode" :disabled="true"></el-input>
      </el-form-item>
    </el-form>

    <el-tree :data="list" show-checkbox node-key="id" ref="menuTree" :props="menuTreeProps" @check-change="handleCheckChange"></el-tree>

    <el-row>
      <el-col :offset="10">
        <el-button type="primary" size="medium" @click="handleSubmit" round>提交</el-button>
        <el-button size="medium" round @click="handleBack">返回</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import message from "@/utils/message";
import menuApi from "@/api/menu";
import roleApi from "@/api/role";

export default {
  name:"RolePermission",
  data() {
    return {
      listLoading: true,
      roleId: "",
      roleInfo: {},
      list: [],
      oldRoleMenuIds: [],
      newRoleMenuIds: [],
      menuTreeProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    //获取route传递的id
    if (this.$route.query && this.$route.query.id) {
      this.roleId = this.$route.query.id
    }
    this.fetchData()
  },
  methods: {
    /** 初始化数据 */
    async fetchData() {
      this.listLoading = true

      //获取角色信息
      const roleResp = await roleApi.getById(this.roleId)
      this.roleInfo = roleResp.data

      //获取菜单列表
      const menuListResp = await menuApi.list()
      this.list = menuListResp.data

      await this.setMenuTreeNode()
    },

    /** 设置菜单节点 */
    async setMenuTreeNode() {
      this.oldRoleMenuIds = []
      //获取角色已分配权限
      const roleMenuResp = await roleApi.getMenuById(this.roleId);
      roleMenuResp.data.forEach(menu => {
        this.oldRoleMenuIds.push(menu.menuId)
        this.$refs.menuTree.setChecked(menu.menuId, true)
      })

      //使用这个方法会出现无法正确选择节点的问题
      // this.$refs.menuTree.setCheckedKeys([this.oldRoleMenuIds]);

    },

    /** 分配角色 */
    async handleSubmit() {
      if (this.newRoleMenuIds.length == 0) {
        message.info("需要为角色分配权限才能访问系统数据")
      } else if (JSON.stringify(this.oldRoleMenuIds) === JSON.stringify(this.newRoleMenuIds)) {
        message.info("没有改变")
      } else {
        //组装用户角色对象
        let roleMenu = {
          roleId: this.roleId,
          menuIdList: this.newRoleMenuIds
        }
        roleApi.doRoleMenuAssign(roleMenu).then(response => {
          this.setMenuTreeNode()
          message.success("权限更新成功")
        })
      }
    },

    handleCheckChange() {
      this.newRoleMenuIds = []
      const nodes = this.$refs.menuTree.getCheckedNodes(true)
      nodes.forEach(node => {
        this.newRoleMenuIds.push(node.id)
        this.getParentKey(node)
      })
      //去重
      this.newRoleMenuIds = Array.from(new Set(this.newRoleMenuIds));
    },

    getParentKey(data) {
      if (data.parentId != 0) {
        const node = this.$refs.menuTree.getNode(data.parentId)
        this.newRoleMenuIds.push(node.data.id)
        this.getParentKey(node.data)
      }
    },

    /** 返回 */
    handleBack() {
      this.$router.back()
    },

  }
}
</script>

<style scoped>

</style>
