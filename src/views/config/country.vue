<template>
  <div class="app-container">
    <div class="filter-container" style="padding-bottom: 20px;">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入国家"
                v-model="productList.name" filterable>
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" @click="resetFilter">重置</el-button>

      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">添加国家
      </el-button>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='序号' width="95">
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="国家名称" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="首字母" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.initial}}</span>
        </template>
      </el-table-column>
      <el-table-column label="拼音" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.pinyin}}</span>
        </template>
      </el-table-column>
      <el-table-column label="拼音缩写" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.pinyinAbbreviate}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="排序" width="200">
        <template slot-scope="scope">
          <el-tag>{{scope.row.sort}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.createTime}}</span>
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
                     :current-page="productList.page" :page-sizes="[10,20,30, 50]" :page-size="productList.limit"
                     layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!--添加国家-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="countryDialog">
      <el-form :rules="addRules" ref="countryForm"  :model="countryForm" label-position="left" label-width="100px" style='margin-left:50px;'>
        <el-form-item label="国家名称" prop="name">
          <el-input v-model="countryForm.name"></el-input>
        </el-form-item>
        <el-form-item label="首字母" prop="initial">
          <el-input v-model="countryForm.initial"></el-input>
        </el-form-item>
        <el-form-item label="拼音" prop="pinyin">
          <el-input v-model="countryForm.pinyin"></el-input>
        </el-form-item>
        <el-form-item label="拼音缩写" prop="pinyinAbbreviate">
          <el-input v-model="countryForm.pinyinAbbreviate"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="countryForm.sort" type="number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="countryDialog = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="add">确定</el-button>
        <el-button v-else type="primary" @click="edit">确定</el-button>
      </div>
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
  import { add, deleteCountry, edit, fetchList } from '@/api/country'
  import store from '@/store'

  export default {
    data() {
      return {
        deleteId: '',
        store,
        total: 0,
        list: null,
        listLoading: true,
        countryDialog: false,
        delDialog: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '添加'
        },
        productList: {
          pageNo: 1
        },
        countryForm: {
          name: '',
          initial: '',
          pinyin: '',
          pinyinAbbreviateL: ''
        },
        // 验证
        addRules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 2, message: '长度至少2个字符', trigger: 'blur' }
          ],
          initial: [
            { required: true, message: '请输入首字母', trigger: 'blur' }
          ],
          pinyin: [
            { required: true, message: '请输入拼音', trigger: 'blur' }
          ],
          pinyinAbbreviate: [
            { required: true, message: '请输入拼音缩写', trigger: 'blur' }
          ]
        }
      }
    },

    // 一开始就获取国家列表
    created() {
      this.fetchData()
    },
    methods: {
      // 获取产品列表
      fetchData() {
        this.listLoading = true
        fetchList(this.productList).then(response => {
          this.list = response.data.list
          this.total = response.data.totalCount
          this.listLoading = false
        })
      },
      // 重置
      resetTemp() {
        this.countryForm = {
          id: undefined,
          name: null
        }
      },
      // 添加
      handleCreate() {
        console.log(store.getters.imgUrl)
        this.resetTemp()
        this.dialogStatus = 'create'
        this.countryDialog = true
      },
      // 添加提交
      add() {
        this.$refs['countryForm'].validate((valid) => {
          if (valid) {
            add(this.countryForm).then(() => {
              this.countryDialog = false
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
      },
      // 编辑
      handleUpdate(row) {
        this.dialogStatus = 'update'
        this.resetTemp()
        this.countryForm = Object.assign({}, row) // 将row的值全部赋值给countryForm 然后提交countryForm就是编辑
        this.countryDialog = true
        this.$nextTick(() => {
          this.$refs['countryForm'].clearValidate()
        })
      },
      // 编辑提交
      edit() {
        const tempData = Object.assign({}, this.countryForm)
        edit(tempData).then(() => {
          for (const v of this.list) {
            if (v.id === this.countryForm.id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, this.countryForm)
              break
            }
          }
          this.countryDialog = false
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        })
        this.fetchData()
      },
      // 删除
      handleDelete(row) {
        this.delDialog = true
        this.deleteId = row.id
      },
      del() {
        deleteCountry(this.deleteId).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.fetchData()
        })
        this.delDialog = false
        const index = this.list.indexOf()
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
        this.productList.pageNo = val
        this.fetchData()
      }
    }
  }
</script>
