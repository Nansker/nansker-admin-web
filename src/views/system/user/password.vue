<template>
  <div class="app-container">

    <el-row>
      <el-col align="center" :span="10" :offset="7">
        <el-form :model="user">
          <el-form-item label="用户账号">
            <el-input v-model="user.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="新密码">
            <el-input type="password" v-model="user.password" show-password clearable></el-input>
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input type="password" v-model="confirmPassword" show-password clearable></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col align="center" :span="10" :offset="7">
        <el-button type="primary" size="medium" @click="handleSubmit" round>提交</el-button>
        <el-button size="medium" round @click="handleBack">返回</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import message from "@/utils/message";
import userApi from "@/api/user";

export default {
  name: "UserPasswordReset",
  data() {
    return {
      user: {
        username: "",
        password: ""
      },
      confirmPassword: ""
    }
  },
  created() {
    //获取route传递的username
    if (this.$route.query && this.$route.query.key) {
      this.user.username = this.$route.query.key
    }
  },
  methods: {
    async handleSubmit() {
      //验证密码一致性
      if (this.user.password != this.confirmPassword) {
        message.warning("两次输入的密码不一致！")
        return
      }
      await userApi.updatePassword(this.user)
      message.success("密码修改成功")
      this.handleBack()
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
