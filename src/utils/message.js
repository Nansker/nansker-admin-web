import Vue from 'vue'
import roleApi from "@/api/role";

const message = {
  success(message) {
    Vue.prototype.$message({
      message,
      type: 'success'
    });
  },
  info(message) {
    Vue.prototype.$message({
      message,
      type: 'info'
    });
  },
  warning(message) {
    Vue.prototype.$message({
      message,
      type: 'warning'
    });
  },
  error(message) {
    Vue.prototype.$message({
      message,
      type: 'error'
    });
  },

  confirm(message, callback) {
    Vue.prototype.$confirm(message || "确认继续操作？", '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(_ => {
        callback()
      })
  }
}

export default message
