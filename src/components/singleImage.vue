<template>
  <div class="upload-container">
    <el-upload
      class="avatar-uploader"
      action="https://httpbin432432432.org/post"
      :show-file-list="false"
      :before-upload="beforeUpload">
      <img v-if="url" :src="url" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
import store from '@/store'
import { getUploadParams } from '@/api/upload'
import axios from 'axios'

export default {
  name: 'singleImageUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      url: '',
      shortUrl: '',
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
    // 父组件调用子组件需要用到自定义的方法（用来在编辑界面中回显）
    setUrl(url) {
      console.log(url)
      console.log('子组件被调用')
      this.url = url
    },
    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
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
      // 限制上传格式
      const isJPG = image.type === 'image/jpeg'
      const isGIF = image.type === 'image/gif'
      const isPNG = image.type === 'image/png'
      const isBMP = image.type === 'image/bmp'
      const isLt2M = image.size / 1024 / 1024 < 2
      if (!isJPG && !isGIF && !isPNG && !isBMP) {
        this.common.errorTip('上传图片必须是JPG/GIF/PNG/BMP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }

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
      axios.post(this.ossUrl, param, config).then(response => {
        const shortUrl = response.data.data.url.toString()
        url = this.ossUrl + shortUrl
        this.$emit('successCBK', shortUrl)
        return new Promise((resolve, reject) => {
          this.url = url
          resolve(true)
        })
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
.avatar-uploader{
  width: 178px;
  height: 178px;
  border:1px dashed lightGray;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
