<template>
  <div class="app-container">
    <div class="filter-container" style="padding-bottom: 20px;">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入产品名称"
                v-model="listQuery.name" filterable>
      </el-input>

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" @click="resetFilter">重置</el-button>

      <!--<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"-->
      <!--@click="handleCreate">添加产品-->
      <!--</el-button>-->
      <!---->
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='序号' width="95">
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="产品名称" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.contactName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人电话" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.contactMobile}}</span>
        </template>
      </el-table-column>
      <el-table-column label="定制师" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.customerId}}</span>
        </template>
      </el-table-column>
      <el-table-column label="市场价" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.marketPrice"></span><span>{{scope.row.marketPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column label="成人价格" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.fixPrice"></span><span>{{scope.row.fixPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column label="儿童价格" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.childPrice"></span><span>{{scope.row.childPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="支付方式" align="center">
        <template slot-scope="scope">
          {{scope.row.isSupportDeposit | isSupportDepositFilter}}
        </template>
      </el-table-column>
      <el-table-column label="定金" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.deposit">￥</span> <span>{{scope.row.deposit}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag>{{scope.row.actived | statusFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="putOn(scope.row)" v-show="scope.row.actived==2">上架
          </el-button>
          <el-button type="info" size="mini" @click="putOff(scope.row)" v-show="scope.row.actived==1">下架
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="查看" width="200">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="detail(scope.row)">查看详情
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)"><i class="el-icon-edit"></i> 编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)"><i class="el-icon-delete"></i> 删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <!--分页-->
    <div class="pagination-container" style="margin-top: 20px;">
      <el-pagination background @current-change="handleCurrentChange"
                     :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!--添加产品-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="customDialog">
      <el-form :model="customForm" label-position="left" label-width="100px" style='margin-left:50px;'>
        <el-form-item label="产品名称">
          <el-input v-model="customForm.name" :maxlength="120"></el-input>
        </el-form-item>
        <el-form-item label="产品图片">
          <singleImage ref="singleImageUpload" @successCBK="imageSuccessCBK"></singleImage>
        </el-form-item>
        <el-form-item label="市场价">
          <el-input v-model="customForm.marketPrice" type="number" min="0.01"></el-input>
        </el-form-item>
        <el-form-item label="成人价格">
          <el-input v-model="customForm.fixPrice" type="number" min="0.01"></el-input>
        </el-form-item>
        <el-form-item label="儿童价格">
          <el-input v-model="customForm.childPrice" type="number" min="0.01"></el-input>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-radio v-model="customForm.isSupportDeposit" :label="true">付定金</el-radio>
          <el-radio v-model="customForm.isSupportDeposit" :label="false">付全额</el-radio>
        </el-form-item>
        <el-form-item label="定金">
          <el-input v-model="customForm.deposit" type="number" ></el-input>
        </el-form-item>
        <hr style="margin:16px 0 30px 0;color: lightgray;">
        <el-form-item label="行程安排">
          <tinymce :height="300" v-model="customForm.intro"></tinymce>
        </el-form-item>
        <hr style="margin:16px 0 30px 0;color: lightgray;">
        <el-form-item label="费用说明">
          <tinymce :height="300" v-model="customForm.specDetailDescription"></tinymce>
        </el-form-item>
        <hr style="margin:16px 0 30px 0;color: lightgray;">
        <el-form-item label="预定须知">
          <tinymce :height="300" v-model="customForm.afterSaleService"></tinymce>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="customDialog = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="add">确定</el-button>
        <el-button v-else type="primary" @click="edit">确定</el-button>
      </div>
    </el-dialog>

    <!--查看详情-->
    <el-dialog :visible.sync="detailDialog" width="70%">
      <el-form :model="detailForm" label-position="left" label-width="100px" style='margin-left:50px;'>
        <el-form-item label="产品名称" disabled>
          <el-input v-model="detailForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="产品图片">
          <img :src="detailForm.url" style="width: 178px;height: 178px;">
        </el-form-item>
        <el-form-item label="市场价">
          <el-input v-model="detailForm.marketPrice" type="number" disabled></el-input>
        </el-form-item>
        <el-form-item label="成人价格">
          <el-input v-model="detailForm.fixPrice" type="number" disabled></el-input>
        </el-form-item>
        <el-form-item label="儿童价格">
          <el-input v-model="detailForm.childPrice" type="number" disabled></el-input>
        </el-form-item>
        <el-form-item label="点击量" disabled>
          <el-input v-model="detailForm.clicksCount" disabled></el-input>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-radio v-model="detailForm.isSupportDeposit" :label="true">付定金</el-radio>
          <el-radio v-model="detailForm.isSupportDeposit" :label="false">付全额</el-radio>
        </el-form-item>
        <el-form-item label="定金">
          <el-input v-model="detailForm.deposit" type="number" disabled></el-input>
        </el-form-item>
        <el-form-item label="行程安排">
          <div class="editor-content" v-html="detailForm.intro"
               style="padding-bottom: 60px;border: 1px solid lightgray;"></div>
        </el-form-item>
        <el-form-item label="费用说明">
          <div class="editor-content" v-html="detailForm.specDetailDescription"
               style="padding-bottom: 60px;border: 1px solid lightgray;"></div>
        </el-form-item>
        <el-form-item label="预定须知">
          <div class="editor-content" v-html="detailForm.afterSaleService"
               style="padding-bottom: 60px;border: 1px solid lightgray;"></div>
        </el-form-item>


      </el-form>
    </el-dialog>

  </div>
</template>


<script>
  import {add, deleteProduct, edit, fetchList} from '@/api/custom'
  import {putOff, putOn} from '@/api/product'
  import Tinymce from '@/components/Tinymce'
  import singleImage from '@/components/singleImage'
  import store from '@/store'

  export default {
    components: {Tinymce, singleImage},
    data() {
      return {
        store,
        total: '',
        list: null,
        listLoading: true,
        customDialog: false,
        detailDialog: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '添加'
        },
        listQuery: {
          pageNo: 1
        },
        customForm: {
          name: '',
          type: 1,
          isSupportDeposit: true,
        },
        detailForm: {},
        // list界面的option
        payOptions: [{
          value: 'true',
          label: '付定金'
        }, {
          value: 'false',
          label: '付全额'
        }]
      }
    },
    // 筛选列表状态
    filters: {
      statusFilter(status) {
        const statusMap = {
          1: '销售中',
          2: '已下架',
          3: '已删除'
        }
        return statusMap[status]
      },
      isSupportDepositFilter(status) {
        const statusMap = {
          true: '付定金',
          false: '付全额'
        }
        return statusMap[status]
      }
    },
    // 一开始就获取列表
    created() {
      this.fetchData()
    },
    methods: {
      imageSuccessCBK(url) {
        console.log(url + '234432432432432')
        this.customForm.url = url
      },
      // 获取产品列表
      fetchData() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.data.list
          this.total = response.data.totalCount
          this.listLoading = false
        })
      },
      // 重置
      resetTemp() {
        this.customForm = {
          id: undefined,
          name: null
        }
      },
      // 添加
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.customDialog = true
      },
      // 添加提交
      add() {
        this.customDialog = true
        add(this.customForm).then((response) => {
          this.customDialog = false
          this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success',
            duration: 2000
          })
          this.list.unshift(this.customForm)
        })
      },
      // 编辑
      handleUpdate(row) {
        // this.customForm = Object.assign({}, row) // 将row的值全部赋值给customForm 然后提交customForm就是编辑
        this.customDialog = true
        this.dialogStatus = 'update'
        this.customForm.id = row.id
        this.customForm.name = row.name
        this.customForm.intro = row.intro
        this.customForm.specDetailDescription = row.specDetailDescription
        this.customForm.marketPrice = row.marketPrice
        this.customForm.fixPrice = row.fixPrice
        this.customForm.childPrice = row.childPrice
        this.customForm.isSupportDeposit = row.isSupportDeposit
        this.customForm.deposit = row.deposit
        this.customForm.afterSaleService = row.afterSaleService
        // 弹出框dialog父组件通过$refs这个方法调用singleImageUpload子组件，将url回显到子组件中
        this.customForm.url = store.getters.imgUrl + row.url
        console.log('store.getters.imgUrl')
        console.log(store.getters.imgUrl)
        console.log(this.customForm.url)
        // 传到数据库的图片格式
        this.$refs.singleImageUpload.setUrl(row.url)
      },
      // 编辑提交
      edit() {
        const tempData = Object.assign({}, this.customForm)
        console.log(tempData)
        edit(tempData).then(() => {
          for (const v of this.list) {
            if (v.id === this.customForm.id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, this.customForm)
              break
            }
          }
          this.customDialog = false
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      // 删除
      handleDelete(row) {
        deleteProduct(row.id).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.fetchData()
        }).catch(err => {
          this.$notify({
            title: '失败',
            message: '删除失败' + err.message,
            type: 'failure',
            duration: 1000
          })
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      },
      // 筛选
      handleFilter() {
        this.fetchData()
      },
      // 重置
      resetFilter() {
        location.reload()
      },
      // 分页
      handleCurrentChange(val) {
        this.listQuery.pageNo = val
        this.fetchData()
      },
      // 上架
      putOn(row) {
        putOn(row.id).then(() => {
          this.$notify({
            title: '成功',
            message: '上架成功',
            type: 'success',
            duration: 2000
          })
          this.fetchData()
        }).catch(err => {
          this.$notify({
            title: '失败',
            message: '上架失败' + err.message,
            type: 'failure',
            duration: 1000
          })
        })
        this.fetchData()
      },
      // 下架
      putOff(row) {
        putOff(row.id).then(() => {
          this.$notify({
            title: '成功',
            message: '下架成功',
            type: 'success',
            duration: 2000
          })
          this.fetchData()
        }).catch(err => {
          this.$notify({
            title: '失败',
            message: '下架失败' + err.message,
            type: 'failure',
            duration: 1000
          })
        })
        // const index = this.list.indexOf(row)
        // this.list.splice(index, 1)
        this.fetchData()
      },
      // 查看详情
      detail(detail) {
        this.detailDialog = true
        this.detailForm = Object.assign({}, detail)
        this.detailForm.url = store.getters.imgUrl + detail.url
      }
    }
  }
</script>
