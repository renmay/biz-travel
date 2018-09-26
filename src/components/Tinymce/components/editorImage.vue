<template>
  <div class="upload-container">
    <el-button icon='el-icon-upload' size="mini" :style="{background:color,borderColor:color}"
               @click=" dialogVisible=true" type="primary">插入图片
    </el-button>
    <el-dialog append-to-body :visible.sync="dialogVisible">
      <el-upload class="editor-slide-upload" action="http://httpbin.org/post" :multiple="true" :file-list="fileList"
                 :show-file-list="true"
                 list-type="picture-card" :on-remove="handleRemove" :on-success="handleSuccess"
                 :before-upload="beforeUpload">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import { getUploadParams } from '@/api/upload'
  import axios from 'axios'
  import store from '@/store'

  export default {
    name: 'editorSlideUpload',
    props: {
      color: {
        type: String,
        default: '#1890ff'
      }
    },
    data() {
      return {
        urlList: [],
        dialogVisible: false,
        listObj: {},
        fileList: [],
        url: '',
        store,
        ossUrl: store.getters.imgUrl
      }
    },
    mounted() {
      this.getConfig()
    },
    create() {
      this.getConfig()
    },
    methods: {
      checkAllSuccess() {
        return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
      },
      handleSubmit() {
        // console.log(this.urlList)
        // console.log(this.listObj)
        if (!this.checkAllSuccess()) {
          this.$message('请等待所有图片上传成功 或 出现了网络问题，请刷新页面重新上传！')
          return
        }
        this.$emit('successCBK', this.urlList)
        this.listObj = {}
        this.fileList = []
        this.urlList = []
        this.dialogVisible = false
      },
      handleSuccess(response, file) {
        const uid = file.uid
        const objKeyArr = Object.keys(this.listObj)
        for (let i = 0, len = objKeyArr.length; i < len; i++) {
          if (this.listObj[objKeyArr[i]].uid === uid) {
            this.listObj[objKeyArr[i]].hasSuccess = true
            return
          }
        }
      },
      handleRemove(file) {
        const uid = file.uid
        const objKeyArr = Object.keys(this.listObj)

        for (let i = 0, len = objKeyArr.length; i < len; i++) {
          if (this.listObj[objKeyArr[i]].uid === uid) {
            delete this.listObj[objKeyArr[i]]
          }
        }
        for (let j = 0; j < this.urlList.length; j++) {
          if (this.urlList[j].uid === uid) {
            this.urlList.splice(j, 1)
            return
          }
        }
      },
      // 获取图片上传参数
      getConfig() {
        getUploadParams().then(response => {
          this.uploadParams = response.data
        }).catch(err => {
          console.log(err)
        })
      },
      // 通用图片上传
      beforeUpload(image, type) {
        // const isJPG = image.type === 'image/jpeg' || 'image/png' || 'image/gif'
        // const isLt2M = image.size / 1024 / 1024 < 2
        // if (!isJPG) {
        //   this.$message.error('上传头像图片只能是 JPG/png/gif 格式!')
        // }
        // if (!isLt2M) {
        //   this.$message.error('上传头像图片大小不能超过 2MB!')
        // }
        const param = new FormData()
        const data = this.uploadParams
        // key就代表文件层级和阿里云上的文件名
        param.append('key', data.dir + image.name)
        param.append('policy', data.policy)
        param.append('callback', data.callback)
        param.append('OSSAccessKeyId', data.accessid)
        param.append('callback', data.callback)
        // 阿里云正常返回204，然后返回信息是空的，想看到返回信息强制让它返回201，返回一个xml文件可以提取有用的信息
        param.append('success_action_status', 201)
        param.append('signature', data.signature)
        param.append('file', image, image.name)
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        let url = ''
        const _self = this
        // const _URL = window.URL || window.webkitURL
        const fileName = image.uid
        axios.post(this.ossUrl, param, config).then(response => {
          const shortUrl = response.data.data.url.toString()
          url = this.ossUrl + shortUrl
          return new Promise((resolve, reject) => {
            const temp = {
              uid: image.uid,
              url: url
            }
            this.urlList.push(temp)
            _self.listObj[fileName] = {
              url: url,
              hasSuccess: false,
              uid: image.uid,
              width: this.width,
              height: this.height
            }
            resolve(true)
          })
        })
      },
      beforeUpload2(file) {
        const _self = this
        const _URL = window.URL || window.webkitURL
        const fileName = file.uid
        this.listObj[fileName] = {}
        return new Promise((resolve, reject) => {
          const img = new Image()
          img.src = _URL.createObjectURL(file)
          img.onload = function() {
            _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
          }
          resolve(true)
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .upload-container {
    .editor-slide-upload {
      margin-bottom: 20px;
    }
  }
</style>
