<template>
  <div class="dashboard-container">
    <span style="padding-right: 20px;color: rgb(65,91,147);font-size: 18px;">{{currentUser}}，欢迎进入旅行社管理系统</span>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getUsername } from '@/utils/auth' // getToken from cookie

  export default {
    data() {
      return {
        currentUser: getUsername()
      }
    },
    name: 'dashboard',
    computed: {
      ...mapGetters([
        'name',
        'roles'
      ])
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
</style>
