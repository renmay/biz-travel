<template>
  <div class="app-container">
    <div class="filter-container" style="padding-bottom: 20px;">
      <el-select clearable class="filter-item" v-model="listQuery.type" placeholder="请选择产品类型">
        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select clearable class="filter-item" v-model="listQuery.category" placeholder="请选择产品分类">
        <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入产品名称"
                v-model="listQuery.name" filterable>
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" @click="resetFilter">重置</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">添加产品
      </el-button>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit>
      <el-table-column align="center" label='序号' width="95" fixed="left">
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="产品名称" align="center" width="200" fixed="left">
        <template slot-scope="scope">
          <span icon-class="star">{{scope.row.name}}</span>
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
      <el-table-column class-name="status-col" label="产品类型" align="center">
        <template slot-scope="scope">
          {{scope.row.type | typeFilter}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="产品分类" align="center">
        <template slot-scope="scope">
          {{scope.row.category | categoryFilter}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="支付方式" align="center">
        <template slot-scope="scope">
          {{scope.row.isSupportDeposit | isSupportDepositFilter}}
        </template>
      </el-table-column>
      <el-table-column label="定金" align="center" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.deposit">￥</span> <span>{{scope.row.deposit}}/人</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" align="center" width="120">
        <template slot-scope="scope">
          <el-tag>{{scope.row.actived | statusFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="120">
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
      <el-table-column align="center" prop="created_at" label="操作" width="200" fixed="right">
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="travelDialog">
      <el-form :rules="addRules" ref="travelForm" :model="travelForm" label-position="left" label-width="100px"
               style='margin-left:50px;'>
        <el-form-item label="产品名称" prop='name'>
          <el-input v-model="travelForm.name" :maxlength="120"></el-input>
        </el-form-item>
        <el-form-item label="产品图片">
          <singleImage ref="singleImageUpload" @successCBK="imageSuccessCBK"></singleImage>
          <el-tip>! 请务必上传产品图片</el-tip>
        </el-form-item>
        <el-form-item label="市场价" prop='marketPrice'>
          <el-input v-model="travelForm.marketPrice" type="number" min="0.01"></el-input>
        </el-form-item>
        <el-form-item label="成人价格" prop='fixPrice'>
          <el-input v-model="travelForm.fixPrice" type="number" min="0.01"></el-input>
        </el-form-item>
        <el-form-item label="儿童价格" prop='childPrice'>
          <el-input v-model="travelForm.childPrice" type="number" min="0.01"></el-input>
        </el-form-item>
        <el-form-item label="支付方式" prop='isSupportDeposit'>
          <el-radio v-model="travelForm.isSupportDeposit" :label="true">付定金</el-radio>
          <el-radio v-model="travelForm.isSupportDeposit" :label="false">付全额</el-radio>
        </el-form-item>
        <el-form-item label="定金" prop='deposit'>
          <el-input v-model="travelForm.deposit" type="number" min="0.01"></el-input>
          <el-tip>定金不得超过总额的20%</el-tip>
        </el-form-item>
        <el-form-item label="产品类型" prop='type'>
          <el-radio-group v-model="travelForm.type">
            <el-radio :label="1" border>国内游</el-radio>
            <el-radio :label="2" border>境外游</el-radio>
            <el-radio :label="3" border>精选定制</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="travelForm.type !== 3" label="产品分类" prop='category'>
          <el-radio-group v-model="travelForm.category">
            <el-radio :label="1" border>自由行</el-radio>
            <el-radio :label="2" border>跟团游</el-radio>
            <el-radio :label="3" border>主题游</el-radio>
          </el-radio-group>
        </el-form-item>
        <hr style="margin:16px 0 30px 0;color: lightgray;">
        <el-form-item label="行程安排" prop='intro'>
          <tinymce :height="300" ref="intro" v-model="travelForm.intro"></tinymce>
        </el-form-item>
        <hr style="margin:16px 0 30px 0;color: lightgray;">
        <el-form-item label="费用说明" prop='specDetailDescription'>
          <tinymce :height="300" ref="specDetailDescription" v-model="travelForm.specDetailDescription"></tinymce>
        </el-form-item>
        <hr style="margin:16px 0 30px 0;color: lightgray;">
        <el-form-item label="预定须知" prop='afterSaleService'>
          <tinymce :height="300" ref="afterSaleService" v-model="travelForm.afterSaleService"></tinymce>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="travelDialog = false">取消</el-button>
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
        <el-form-item label="产品类型">
          <el-radio-group v-model="detailForm.type">
            <el-radio :label="1" border>国内游</el-radio>
            <el-radio :label="2" border>境外游</el-radio>
            <el-radio :label="3" border>精选定制</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="产品分类">
          <el-radio-group v-model="detailForm.category">
            <el-radio :label="1" border>自由行</el-radio>
            <el-radio :label="2" border>跟团游</el-radio>
            <el-radio :label="3" border>主题游</el-radio>
          </el-radio-group>
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

    <!--删除提示-->
    <el-dialog
      title="温馨提示"
      :visible.sync="delDialog"
      width="28%"
      left>
      <span>确定删除？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="delDialog = false">取 消</el-button>
    <el-button type="danger" @click="del">确 定</el-button>
  </span>
    </el-dialog>


  </div>
</template>


<script>
  import { add, deleteProduct, edit, fetchList } from '@/api/travel'
  import { putOff, putOn } from '@/api/product'
  import Tinymce from '@/components/Tinymce'
  import singleImage from '@/components/singleImage'
  import store from '@/store'

  export default {
    components: { Tinymce, singleImage },
    data() {
      return {
        deleteId: '',
        total: 0,
        list: null,
        listLoading: true,
        travelDialog: false,
        detailDialog: false,
        delDialog: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '添加'
        },
        listQuery: {
          pageNo: 1
        },
        travelForm: {
          name: '',
          isSupportDeposit: true,
          category: '1',
          type: '1'
        },
        detailForm: {},
        // list界面的option
        payOptions: [{
          value: 'true',
          label: '付定金'
        }, {
          value: 'false',
          label: '付全额'
        }],
        typeOptions: [{
          value: '1',
          label: '国内游'
        }, {
          value: '2',
          label: '境外游'
        }, {
          value: '3',
          label: '精选定制'
        }],
        categoryOptions: [{
          value: '1',
          label: '自由行'
        }, {
          value: '2',
          label: '跟团游'
        }, {
          value: '3',
          label: '主题游'
        }],
        selfOptions: [{
          value: '1',
          label: '是'
        }, {
          value: '0',
          label: '否'
        }],
        // 验证
        addRules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 2, message: '长度至少2个字符', trigger: 'blur' }
          ],
          marketPrice: [
            { required: true, message: '请输入市场价', trigger: 'blur' }
          ],
          fixPrice: [
            { required: true, message: '请输入成人价', trigger: 'blur' }
          ],
          childPrice: [
            { required: true, message: '请输入儿童价', trigger: 'blur' }
          ],
          isSupportDeposit: [{ required: true, message: '請至少选择一种支付方式', trigger: 'change' }],
          deposit: [
            { required: true, message: '请输入定金', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择类型', trigger: 'blur' }
          ],
          category: [
            { required: true, message: '请选择category', trigger: 'blur' }
          ],
          intro: [
            { required: true, message: '请填写行程安排', trigger: 'blur' }
          ],
          specDetailDescription: [
            { required: true, message: '请填写费用说明', trigger: 'blur' }
          ],
          afterSaleService: [
            { required: true, message: '请填写预定须知', trigger: 'blur' }
          ]
        }
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
      typeFilter(status) {
        const statusMap = {
          1: '国内游',
          2: '境外游',
          3: '精选定制'
        }
        return statusMap[status]
      },
      categoryFilter(status) {
        const statusMap = {
          1: '自由行',
          2: '跟团游',
          3: '主题游'
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
        this.travelForm = {}
      },
      // 添加
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.travelDialog = true
        this.$nextTick(() => {
          this.$refs['travelForm'].clearValidate()
        })
        this.$refs.intro.setContent('')
        this.$refs.specDetailDescription.setContent('')
        this.$refs.afterSaleService.setContent('')
        this.resetImage()
      },
      // 添加提交
      add() {
        if (this.travelForm.url === undefined || this.travelForm.url === null) {
          this.$notify({
            title: '提交失败',
            message: '请上传图片',
            type: 'faliure',
            duration: 2000
          })
          return
        }
        this.$refs['travelForm'].validate((valid) => {
          if (valid) {
            this.travelDialog = true
            add(this.travelForm).then(() => {
              this.travelDialog = false
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
              this.fetchData()
            })
          }
        })
        this.fetchData()
      },
      // 图片问题
      imageSuccessCBK(url) {
        console.log('图片组件传过来的url')
        console.log(url)
        this.travelForm.url = url
      },
      // 编辑
      handleUpdate(row) {
        const tempData = Object.assign({}, row) // 将row的值全部赋值给travelForm 然后提交travelForm就是编辑
        this.dialogStatus = 'update'
        this.travelForm.id = tempData.id
        this.travelForm.name = tempData.name
        this.travelForm.intro = tempData.intro
        this.travelForm.specDetailDescription = tempData.specDetailDescription
        this.travelForm.marketPrice = tempData.marketPrice
        this.travelForm.fixPrice = tempData.fixPrice
        this.travelForm.childPrice = tempData.childPrice
        this.travelForm.isSupportDeposit = tempData.isSupportDeposit
        this.travelForm.type = tempData.type
        this.travelForm.category = tempData.category
        this.travelForm.deposit = tempData.deposit
        this.travelForm.afterSaleService = tempData.afterSaleService
        this.travelForm.isSelfSupport = tempData.isSelfSupport
        // 调用子组件出现undefined的情况可以setTimeout来处理
        setTimeout(() => {
          this.$refs.intro.setContent(this.travelForm.intro)
          this.$refs.specDetailDescription.setContent(this.travelForm.specDetailDescription)
          this.$refs.afterSaleService.setContent(this.travelForm.afterSaleService)
        }, 0)
        // 弹出框dialog父组件通过$refs这个方法调用singleImageUpload子组件，将url回显到子组件中
        this.travelDialog = true
        this.travelForm.url = store.getters.imgUrl + tempData.url
        console.log(this.travelForm.url)
        this.resetImage()
      },
      resetImage() {
        setTimeout(() => {
          this.$refs.singleImageUpload.setUrl(this.travelForm.url)
        }, 0)
      },
      // 编辑提交
      edit() {
        const tempData = Object.assign({}, this.travelForm)
        // 不懂
        console.log(tempData.url.indexOf(store.getters.imgUrl))
        if (tempData.url.indexOf(store.getters.imgUrl) >= 0) {
          tempData.url = ''
        }
        edit(tempData).then((response) => {
          this.travelDialog = false
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
          this.fetchData()
        })
      },
      // 删除
      handleDelete(row) {
        this.delDialog = true
        // 要删除的那条数据的id，首先要去定义
        this.deleteId = row.id
      },
      del(row) {
        deleteProduct(this.deleteId).then((response) => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.delDialog = false
          this.fetchData()
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      },
      // 筛选
      handleFilter() {
        this.fetchData()
      },
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
