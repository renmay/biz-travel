<template>
  <div class="app-container">
    <div class="filter-container" style="padding-bottom: 20px;">
      <el-form :model="form" label-position="left" label-width="100px">
        <span class="form-title">用户协议</span>
        <tinymce :height="400" v-model="form.content"></tinymce>
        <el-button type="primary" @click="submit" style="margin-top: 20px;">保存</el-button>
      </el-form>
    </div>
  </div>
</template>


<script>
  import Tinymce from '@/components/Tinymce'
  import { edit, getAgreement } from '@/api/protocol'

  export default {
    components: { Tinymce },
    data() {
      return {
        form: {}
      }
    },
    // 一开始就获取列表
    created() {
      this.getAgreement()
    },
    methods: {
      //  提交用户协议
      getAgreement() {
        getAgreement().then(response => {
          this.form = response.data
          this.form.id = undefined
          this.form.storeId = undefined
          console.log(this.form)
        })
      },
      // 编辑
      submit() {
        const tempData = Object.assign({}, this.form)
        edit(tempData).then(() => {
          this.$notify({
            title: '成功',
            message: '编辑成功',
            type: 'success',
            duration: 2000
          })
        })
      }
    }
  }
</script>
<style>
  .form-title {
    font-size: 18px;
    padding-bottom: 26px;
    display: block;
  }
</style>
