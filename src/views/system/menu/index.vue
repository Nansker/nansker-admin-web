<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入菜单名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="菜单状态">
          <el-option label="正常" :value="1"></el-option>
          <el-option el="禁用" :value="0"></el-option>
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
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleSave">新增 </el-button>
      </el-col>
    </el-row>

    <el-table
      :data="list"
      v-loading="listLoading"
      element-loading-text="数据加载中"
      style="width: 100%;
      margin-bottom: 20px;"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="sortValue" label="排序"/>
      <el-table-column prop="name" label="菜单名称"/>
      <el-table-column label="图标">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="perms" label="权限字符"/>
      <el-table-column prop="path" label="组件路径"/>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status ==1 ">正常</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"/>
      <el-table-column label="操作" width="260">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-plus" @click="handleMenuNodeSave(scope.row)">新增</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleRemove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogShow" width="680px" append-to-body>
      <el-form ref="form" :model="dialogFrom" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单" prop="parentId">
              <tree-select
                v-model="dialogFrom.parentId"
                :options="menuOptions"
                :default-expand-level="2"
                placeholder="选择上级菜单"
                :show-count="true"
                :normalizer="normalizer"
                @select="handleDialogMenu">
              </tree-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="type">
              <el-radio-group v-model="dialogFrom.type">
                <el-radio :label="0">目录</el-radio>
                <el-radio :label="1">菜单</el-radio>
                <el-radio :label="2">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="dialogFrom.type !=2">
            <el-form-item label="菜单图标" prop="icon">
              <el-input v-model="dialogFrom.icon" placeholder="请输入菜单图标"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="dialogFrom.name" placeholder="请输入菜单名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sortValue">
              <el-input-number v-model="dialogFrom.sortValue" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item prop="path">
              <span slot="label">
                <el-tooltip content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                路由地址
              </span>
              <el-input v-model="dialogFrom.path" placeholder="请输入路由地址"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="dialogFrom.type != 0">
            <el-form-item prop="component">
              <span slot="label">
                <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                组件路径
              </span>
              <el-input v-model="dialogFrom.component" placeholder="请输入组件路径"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="dialogFrom.type != 0">
            <el-form-item prop="perms">
              <el-input v-model="dialogFrom.perms" placeholder="请输入权限标识" maxlength="100"/>
              <span slot="label">
                <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                权限字符
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="status" label="菜单状态">
              <el-radio-group v-model="dialogFrom.status">
                <el-radio :label="1">正常</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
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
import message from "@/utils/message";
import menuApi from "@/api/menu";

export default {
  name:"MenuIndex",
  data() {
    return {
      listLoading: true,
      list: [],
      queryParams: {},
      dialogTitle: "",
      dialogShow: false,
      dialogFrom: {
        parentId: 0,
        type: 0,
        status: 1
      },
      menuOptions:[]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /** 初始化数据 */
    async fetchData() {
      this.listLoading = true
      const response = await menuApi.list(this.queryParams)
      this.list = response.data
      this.listLoading = false

      //设置弹窗树形上级菜单
      const mainMenu = {id: 0, name: "主类目",  children: []}
      mainMenu.children = this.list
      this.menuOptions.push(mainMenu)
    },

    /** 查询数据 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.fetchData()
    },

    /** 保存数据 */
    handleSave() {
      this.dialogShow = true
      this.dialogTitle = "添加菜单"
    },

    /** 添加子菜单 */
    handleMenuNodeSave(node){
      this.dialogShow = true
      this.dialogTitle = "添加菜单"
      this.dialogFrom.parentId = node.id
    },

    /** 更新数据 */
    async handleUpdate(row) {
      this.dialogShow = true
      this.dialogTitle = "修改菜单信息"
      const response = await menuApi.getById(row.id)
      this.dialogFrom = response.data
    },

    /** 删除数据 */
    handleRemove(row) {
      const that = this
      message.confirm('确认删除【' + row.name + '】的信息？', async function () {
        await menuApi.remove(row.id)
        message.success("删除成功")
        await that.fetchData()
      })
    },

    /** 弹窗菜单选择 */
    handleDialogMenu(node){
      this.dialogFrom.parentId = node.id
    },

    /** 弹窗表单数据提交按钮 */
    async dialogSubmitForm() {
      if (this.dialogFrom.id) {
        //修改
        await menuApi.update(this.dialogFrom)
        message.success("修改成功")
        this.dialogCancel()
        await this.fetchData();
      } else {
        //添加
        await menuApi.save(this.dialogFrom)
        message.success("添加成功")
        this.dialogCancel()
        await this.fetchData();
      }
    },

    /** 弹窗取消按钮 */
    dialogCancel() {
      this.dialogShow = false
      this.dialogFromReset()
    },

    /** 搜索重置按钮操作 */
    queryFromReset() {
      this.queryParams = {}
      this.handleQuery()
    },

    /** 弹窗表单重置 */
    dialogFromReset() {
      this.dialogFrom = {
        parentId: 0,
        type: 0,
        status: 1
      };
    },

    normalizer(node) { //方法
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id, // 键名转换，方法默认是label和children进行树状渲染
        label: node.name,
        children: node.children
      }
    }
  }

}
</script>

<style scoped>

</style>
