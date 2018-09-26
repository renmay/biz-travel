<template>

  <el-menu class="topbar" mode="horizontal">

    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <div style="float: left;">
          <span style="padding-right: 20px;color: rgb(65,91,147);font-size: 18px;">{{currentUser}}</span>
        </div>
        <div style="float: left;">
          <img :src="img_avatar" alt="" class="user-avatar img_avatar">
        </div>
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            首页
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>


</template>

<script>
  import { mapGetters } from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import img_avatar from '@/assets/topbar/avatar.gif'
  import { getUsername } from '@/utils/auth' // getToken from cookie

  export default {
    name: 'Topbar',
    data() {
      return {
        currentUser: getUsername(),
        list: null,
        listLoading: true,
        dialogFormVisible: false,
        formLabelWidth: '120px',
        img_avatar,
        form: {}
      }
    },
    components: {
      Breadcrumb,
      Hamburger
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'avatar'
      ])
    },
    // 一创建就执行以下方法
    created() {

    },
    methods: {
      // sidebar下拉框
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      },
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done()
          })
          .catch(_ => {
          })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .topbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }
    .screenfull {
      position: absolute;
      right: 90px;
      top: 16px;
      color: red;
    }
    .center-wrapper {
      display: inline;
      line-height: 58px;
      position: absolute;
      top: -20px;
      right: 50%;
      color: #2d3a4b;
      .center-title {
        font-size: 24px;
        color: #409EFF;
      }
    }
    .avatar-container {
      height: 50px;
      display: inline-block;
      position: absolute;
      right: 35px;
      .avatar-wrapper {
        clear: both;
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
    .choose_wechat .el-button {
      margin-bottom: 10px;
    }
  }
</style>

