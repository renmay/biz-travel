<template>
  <div class="app-container">
    <div class="filter-container" style="padding-bottom: 20px;">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate" right>添加标准
      </el-button>
    </div>

    <el-tabs v-model="activeName" type="border-card" @tab-click="getData">
      <el-tab-pane
        :key="item.title"
        v-for="(item, index) in typeOptions"
        :label="item.title"
        :name="item.value">
        <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit
                  highlight-current-row>
          <el-table-column align="center" label='序号' width="95">
            <template slot-scope="scope">
              {{scope.$index + 1}}
            </template>
          </el-table-column>
          <el-table-column label="服务标准" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
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
      </el-tab-pane>
    </el-tabs>

    <!--分页-->
    <div class="pagination-container" style="margin-top: 20px;">
      <el-pagination background @current-change="handleCurrentChange"
                     :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!--添加标准-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="standardDialog">
      <el-form :rules="addRules" ref="standardForm" :model="standardForm" label-position="left" label-width="100px" style='margin-left:50px;'>
        <el-form-item label="分类">
          <el-select v-model="standardForm.type" clearable placeholder="请选择" prop="type">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.title"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务标准" prop="name">
          <el-input v-model="standardForm.name"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="standardForm.sort" type="number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="standardDialog = false">取消</el-button>
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
  import { add, del, edit, fetchList } from '@/api/standard'
  import store from '@/store'

  export default {
    data() {
      return {
        deleteId: '',
        activeName: '1',
        store,
        total: 0,
        list: [],
        listLoading: true,
        standardDialog: false,
        dialogStatus: '',
        delDialog: false,
        textMap: {
          update: '编辑',
          create: '添加'
        },
        typeOptions: [{
          title: '酒店',
          value: '1'
        }, {
          title: '房型',
          value: '2'
        }, {
          title: '餐饮',
          value: '3'
        }, {
          title: '服务',
          value: '4'
        }],
        listQuery: {
          pageNo: 1,
          type: 1
        },
        standardForm: {
          name: '',
          type: 1
        },
        // validate
        addRules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 2, message: '长度至少2个字符', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请输入类型', trigger: 'blur' }
          ]
        }
      }
    },
    // 一开始就获取国家列表
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.data.list
          this.total = response.data.totalCount
          this.listLoading = false
        })
      },
      getData(target) {
        this.listQuery.type = target.name
        this.fetchData()
      },
      // 重置
      resetTemp() {
        this.standardForm = {
          id: undefined,
          name: null
        }
      },
      // 添加
      handleCreate() {
        console.log(store.getters.imgUrl)
        this.resetTemp()
        this.dialogStatus = 'create'
        this.standardDialog = true
      },
      // 添加提交
      add() {
        this.$refs['standardForm'].validate((valid) => {
          if (valid) {
            add(this.standardForm).then(() => {
              this.standardDialog = false
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
        this.resetTemp()
        this.dialogStatus = 'update'
        this.standardForm = Object.assign({}, row) // 将row的值全部赋值给standardForm 然后提交standardForm就是编辑
        this.standardDialog = true
      },
      // 编辑提交
      edit() {
        const tempData = Object.assign({}, this.standardForm)
        edit(tempData).then(() => {
          for (const v of this.list) {
            if (v.id === this.standardForm.id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, this.standardForm)
              break
            }
          }
          this.standardDialog = false
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
        this.delDialog = true
        this.deleteId = row.id
      },
      del(row) {
        del(this.deleteId).then(() => {
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
        this.delDialog = false
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      },
      // 筛选
      handleFilter() {
        this.fetchData()
      },
      // 分页
      handleCurrentChange(val) {
        this.listQuery.pageNo = val
        this.fetchData()
      }
    }
  }
</script>
