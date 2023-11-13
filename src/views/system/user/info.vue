<template>
  <div class="app-container">
    <div class="box">
      <el-tabs value="first">
        <el-tab-pane label="个人信息" name="first">
          <el-row :gutter="20">
            <el-col :span="4" align="center">
              <el-avatar :size="100" :src="user.avatar"></el-avatar>
              <br>
              <el-button type="text" @click="handleAvatar">修改头像</el-button>
              <br>
              <el-button type="text" @click="handlePassword">重置密码</el-button>
            </el-col>
            <el-col :span="20">
              <el-form ref="user" :model="user" label-position="top">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="ID">
                      <el-input v-model="user.id" :disabled="true"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="用户账号">
                      <el-input v-model="user.username" :disabled="true"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="用户昵称">
                      <el-input v-model="user.name"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="联系方式">
                      <el-input v-model="user.phone"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24" align="right">
                    <el-button type="primary" @click="handleUpdate">确认修改</el-button>
                  </el-col>
                </el-row>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="登录日志" name="second">
          <el-timeline style="margin-top: 30px">
            <el-timeline-item
              v-for="(log, index) in logList"
              :key="index"
              :timestamp="log.accessTime">
              {{ log.msg }}
            </el-timeline-item>
          </el-timeline>
        </el-tab-pane>
      </el-tabs>

    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import userApi from "@/api/user";
import message from "@/utils/message";
import logApi from "@/api/log/logLogin";
import router from "@/router";

export default {
  name: "UserInfo",
  computed: {
    ...mapGetters([
      'userInfo',
    ])
  },
  data() {
    return {
      user: {},
      logList: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    //初始化数据
    fetchData() {
      this.user = this.userInfo
      this.getUserLoginLog()
    },
    async getUserLoginLog() {
      const resp = await logApi.getLogByUser();
      this.logList = resp.data
    },
    async handleUpdate() {
      await userApi.update(this.user);
      //重新获取信息
      await this.$store.dispatch('user/getInfo')
      message.success("信息修改成功")
    },
    /** 重置密码 */
    handlePassword() {
      router.push({path: "/system/user/password", query: {key: this.user.username}})
    },
    handleAvatar() {

    }
  }
}
</script>

<style scoped>
.app-container{
  background-color: #f4f6f9;
  min-height: calc(100vh - 50px);
}
.box {
  background-color: white;
  margin: 10px 20px;
  padding: 30px;
  border-radius: 10px;
  /*min-height: calc(100vh - 110px);*/
}
</style>
