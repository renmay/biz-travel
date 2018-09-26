<template>
  <div class="app-container">
    <div class="filter-container" style="padding-bottom: 20px;">
      <el-select clearable class="filter-item" v-model="listQuery.status" placeholder="请选择状态">
        <el-option v-for="item in statusOptions" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入需求单号"
                v-model="listQuery.id" filterable>
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入客户姓名"
                v-model="listQuery.contactName" filterable>
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" @click="resetFilter">重置</el-button>
    </div>

    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='序号' width="95">
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="需求单号" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="type-col" label="需求类型" align="center">
        <template slot-scope="scope">
          <el-tag>{{scope.row.type | typeFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="客户姓名" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.contactName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户电话" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.contactMobile}}</span>
        </template>
      </el-table-column>
      <el-table-column label="出发地" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.placeOfDeparture"></span><span>{{scope.row.placeOfDeparture}}</span>
        </template>
      </el-table-column>
      <el-table-column label="目的地" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.destination"></span><span>{{scope.row.destination}}</span>
        </template>
      </el-table-column>
      <el-table-column label="出发时间" align="center" width="120">
        <template slot-scope="scope">
          <i class="el-icon-time"></i><span>{{scope.row.departureTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="出行天数" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.numberOfDays}}</span>
        </template>
      </el-table-column>
      <el-table-column label="预算/人" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.budget">￥</span> <span>{{scope.row.budget}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.createDate}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="需求详情" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="viewNeeds(scope.row)" v-show="scope.row.type==1">查看需求
          </el-button>
          <el-button size="mini" type="success" @click="viewCustomNeeds(scope.row)" v-show="scope.row.type==2">查看需求
          </el-button>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag>{{scope.row.status | statusFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="定制" width="120%">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleCreate(scope.row)"
                     v-show="scope.row.status==2">定制
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)"
                     v-show="scope.row.status==3">编辑定制
          </el-button>
          <el-button type="warning" size="mini" @click="handleDistribution(scope.row)" v-show="scope.row.status==1">分配
          </el-button>
        </template>
      </el-table-column>

      <el-table-column label="定制师" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.customerName">{{scope.row.customerName}}</el-tag>
          <el-tag type="info" v-else>未分配</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="定制详情" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="viewDetail(scope.row)"
                     v-if="scope.row.status==3">定制详情
          </el-button>
          <el-tag type="info" v-else>未定制
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="160" fixed="right">

        <template slot-scope="scope">

          <el-button size="mini" type="danger" @click="handleCancel(scope.row)"
                     v-show="scope.row.status==1||scope.row.status==2||scope.row.status==3"><i
            class="el-icon-delete"></i> 取消订单
          </el-button>
          <el-tag type="info" v-show="scope.row.status==5">已取消
          </el-tag>
          <el-tag type="info" v-show="scope.row.status==4">已完成
          </el-tag>
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

    <!--定制-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="customDialog" width="80%">
      <el-row type="flex" class="row-bg">
        <el-col :span="10">
          <el-form v-show="needsForm.type==1" :model="needsForm" label-position="left" label-width="100px"
                   style='background-color:#eeeeef;padding: 6%;border-radius:6px;'>
            <span class="detail-title">需求参数</span>
            <el-form-item label="出发地: " disabled>
              <span>{{needsForm.placeOfDeparture}}</span>
            </el-form-item>
            <el-form-item label="出发国家" disabled>
              <span> {{needsForm.placeOfDepartureNational}} </span>
            </el-form-item>
            <el-form-item label="目的地" disabled>
              <span> {{needsForm.destination}} </span>
            </el-form-item>
            <el-form-item label="目的国家" disabled>
              <span> {{needsForm.destinationNational}} </span>
            </el-form-item>
            <el-form-item label="出发时间">
              <span> {{needsForm.departureTime}} </span>
            </el-form-item>
            <el-form-item label="旅行天数">
              <span> {{needsForm.numberOfDays}} </span>
            </el-form-item>
            <el-form-item label="成人数">
              <span> {{needsForm.numberOfAdults}} </span>
            </el-form-item>
            <el-form-item label="儿童数">
              <span> {{needsForm.numberOfKid}} </span>
            </el-form-item>
            <span class="detail-title">服务要求</span>
            <el-form-item label="预算" disabled>
              <span> {{needsForm.budget}} </span>
            </el-form-item>
            <el-form-item label="酒店要求" disabled>
              <span> {{needsForm.hotelMinimumStandard}} </span>
            </el-form-item>
            <el-form-item label="房型要求" disabled>
              <span> {{needsForm.roomMinimumStandard}} </span>
            </el-form-item>
            <el-form-item label="餐饮要求">
              <span> {{needsForm.cateringMinimumStandard}} </span>
            </el-form-item>
            <el-form-item label="服务要求">
              <span> {{needsForm.serviceMinimumStandard}} </span>
            </el-form-item>

            <span class="detail-title">客户姓名</span>
            <el-form-item label="姓名" disabled>
              <span> {{needsForm.contactName}} </span>
            </el-form-item>
            <el-form-item label="手机号" disabled>
              <span> {{needsForm.contactMobile}} </span>
            </el-form-item>
            <el-form-item label="备注">
              <span> {{needsForm.remark}} </span>
            </el-form-item>
          </el-form>
          <el-form v-show="needsForm.type==2" :model="customNeedsForm" label-position="left" label-width="100px"
                   style='margin-left:50px;'>
            <span class="detail-title">调整商品</span>
            <el-form-item label="商品名称">
              <el-input v-model="customNeedsForm.customProductName" disabled></el-input>
            </el-form-item>
            <el-form-item label="价格/人">
              <el-input v-model="customNeedsForm.customProductFixPrice" disabled></el-input>
            </el-form-item>
            <span class="detail-title">调整项目</span>
            <el-form-item label="酒店要求">
              <el-input v-model="customNeedsForm.adjustedItems" disabled></el-input>
            </el-form-item>
            <span class="detail-title">出行信息</span>
            <el-form-item label="出发时间">
              <el-input v-model="customNeedsForm.departureTime" disabled></el-input>
            </el-form-item>
            <el-form-item label="成人人数">
              <el-input v-model="customNeedsForm.numberOfAdults" disabled></el-input>
            </el-form-item>
            <el-form-item label="儿童人数">
              <el-input v-model="customNeedsForm.numberOfKid" disabled></el-input>
            </el-form-item>
            <el-form-item label="预算">
              <el-input v-model="customNeedsForm.budget" disabled></el-input>
            </el-form-item>
            <span class="detail-title">联系人</span>
            <el-form-item label="姓名">
              <el-input v-model="customNeedsForm.contactName" disabled></el-input>
            </el-form-item>
            <el-form-item label="手机号码">
              <el-input v-model="customNeedsForm.contactMobile" disabled></el-input>
            </el-form-item>
            <span class="detail-title">备注</span>
            <el-form-item label="备注">
              <el-input type="textarea" class="article-textarea" :rows="1" autosize v-model="customNeedsForm.remark"
                        disabled></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="14">
          <el-form :rules="customRules" ref="customForm" :model="customForm" label-position="left" label-width="100px"
                   style='margin-left:50px;'>
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="customForm.name" :maxlength="120"></el-input>
            </el-form-item>

            <el-form-item label="产品图片">
              <singleImage ref="singleImageUpload" @successCBK="imageSuccessCBK"></singleImage>
              <el-tip>! 请务必上传定制产品图片</el-tip>
            </el-form-item>

            <el-form-item label="市场价" prop="marketPrice">
              <el-input v-model="customForm.marketPrice" type="number" min="0.01"></el-input>
            </el-form-item>
            <el-form-item label="成人价格" prop="fixPrice">
              <el-input v-model="customForm.fixPrice" type="number" min="0.01"></el-input>
            </el-form-item>
            <el-form-item label="儿童价格" prop="childPrice">
              <el-input v-model="customForm.childPrice" type="number" min="0.01"></el-input>
            </el-form-item>
            <el-form-item label="支付方式" prop="isSupportDeposit">
              <el-radio v-model="customForm.isSupportDeposit" :label="true">付定金</el-radio>
              <el-radio v-model="customForm.isSupportDeposit" :label="false">付全额</el-radio>
            </el-form-item>
            <el-form-item label="定金" prop="deposit">
              <el-input v-model="customForm.deposit" type="number" min="0.01"></el-input>
            </el-form-item>
            <hr style="margin:16px 0 30px 0;color: lightgray;">
            <el-form-item label="行程安排" prop="intro">
              <tinymce :height="300" v-model="customForm.intro" ref="intro"></tinymce>
            </el-form-item>
            <hr style="margin:16px 0 30px 0;color: lightgray;">
            <el-form-item label="费用说明" prop="specDetailDescription">
              <tinymce :height="300" v-model="customForm.specDetailDescription" ref="specDetailDescription"></tinymce>
            </el-form-item>
            <hr style="margin:16px 0 30px 0;color: lightgray;">
            <el-form-item label="预定须知" prop="afterSaleService">
              <tinymce :height="300" v-model="customForm.afterSaleService" ref="afterSaleService"></tinymce>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="customDialog = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="custom">确定</el-button>
        <el-button v-else type="primary" @click="edit">确定</el-button>
      </div>
    </el-dialog>


    <!--分配列表-->
    <el-dialog :visible.sync="distributionDialog">
      <el-table :data="customerList" v-loading.body="listLoading" element-loading-text="Loading" border fit
                highlight-current-row>
        <el-table-column align="center" label='序号' width="95">
          <template slot-scope="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column label="定制师" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="定制师Id" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="created_at" label="选择">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="distribution(scope.row)">选择此定制师
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--<div slot="footer" class="dialog-footer">-->
      <!--<el-button @click="distributionDialog = false">取消</el-button>-->
      <!--<el-button type="primary" @click="distribution">确定</el-button>-->
      <!--</div>-->
      <!--分页-->
      <div class="pagination-container" style="margin-top: 20px;">
        <el-pagination background @current-change="distributionHandleCurrentChange"
                       :current-page="distributionListQuery.page" :page-sizes="[10,20,30, 50]"
                       :page-size="distributionListQuery.limit"
                       layout="total, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-dialog>


    <!--查看需求（高端定制）-->
    <el-dialog :visible.sync="needsDialog" width="70%">
      <el-form :model="needsForm" label-position="left" label-width="100px" style='margin-left:50px;'>
        <span class="detail-title">需求参数</span>
        <el-form-item label="出发地">
          <el-input v-model="needsForm.placeOfDeparture" disabled></el-input>
        </el-form-item>
        <el-form-item label="出发国家">
          <el-input v-model="needsForm.placeOfDepartureNational" disabled></el-input>
        </el-form-item>
        <el-form-item label="目的地">
          <el-input v-model="needsForm.destination" disabled></el-input>
        </el-form-item>
        <el-form-item label="目的国家">
          <el-input v-model="needsForm.destinationNational" disabled></el-input>
        </el-form-item>
        <el-form-item label="出发时间">
          <el-input v-model="needsForm.departureTime" disabled></el-input>
        </el-form-item>
        <el-form-item label="旅行天数">
          <el-input v-model="needsForm.numberOfDays" type="number" disabled></el-input>
        </el-form-item>
        <el-form-item label="成人数">
          <el-input v-model="needsForm.numberOfAdults" type="number" disabled></el-input>
        </el-form-item>
        <el-form-item label="儿童数">
          <el-input v-model="needsForm.numberOfKid" type="number" disabled></el-input>
        </el-form-item>
        <el-form-item label="预算">
          <el-input v-model="needsForm.budget" disabled></el-input>
        </el-form-item>
        <span class="detail-title">要求</span>
        <el-form-item label="酒店要求">
          <el-input v-model="needsForm.hotelMinimumStandard" disabled></el-input>
        </el-form-item>
        <el-form-item label="房型要求">
          <el-input v-model="needsForm.roomMinimumStandard" disabled></el-input>
        </el-form-item>
        <el-form-item label="餐饮要求">
          <el-input v-model="needsForm.cateringMinimumStandard" disabled></el-input>
        </el-form-item>
        <el-form-item label="服务要求">
          <el-input v-model="needsForm.serviceMinimumStandard" disabled></el-input>
        </el-form-item>
        <span class="detail-title">客户姓名</span>
        <el-form-item label="姓名">
          <el-input v-model="needsForm.contactName" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="needsForm.contactMobile" disabled></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="needsForm.remark" disabled></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--查看需求（精选定制）-->
    <el-dialog :visible.sync="customNeedsDialog" width="70%">
      <el-form :model="customNeedsForm" label-position="left" label-width="100px" style='margin-left:50px;'>
        <span class="detail-title">调整商品</span>
        <el-form-item label="商品名称">
          <el-input v-model="customNeedsForm.customProductName" disabled></el-input>
        </el-form-item>
        <el-form-item label="价格/人">
          <el-input v-model="customNeedsForm.customProductFixPrice" disabled></el-input>
        </el-form-item>
        <span class="detail-title">调整项目</span>
        <el-form-item label="调整项目">
          <el-input v-model="customNeedsForm.adjustedItems" disabled></el-input>
        </el-form-item>
        <span class="detail-title">出行信息</span>
        <el-form-item label="出发时间">
          <el-input v-model="customNeedsForm.departureTime" disabled></el-input>
        </el-form-item>
        <el-form-item label="成人人数">
          <el-input v-model="customNeedsForm.numberOfAdults" disabled></el-input>
        </el-form-item>
        <el-form-item label="儿童人数">
          <el-input v-model="customNeedsForm.numberOfKid" disabled></el-input>
        </el-form-item>
        <el-form-item label="预算">
          <el-input v-model="customNeedsForm.budget" disabled></el-input>
        </el-form-item>
        <span class="detail-title">联系人</span>
        <el-form-item label="姓名">
          <el-input v-model="customNeedsForm.contactName" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="customNeedsForm.contactMobile" disabled></el-input>
        </el-form-item>
        <span class="detail-title">备注</span>
        <el-form-item label="备注">
          <el-input type="textarea" class="article-textarea" :rows="1" autosize v-model="customNeedsForm.remark"
                    disabled></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--定制详情-->
    <el-dialog title="定制详情" :visible.sync="customDetailDialog" width="80%">
      <el-row type="flex" class="row-bg">
        <el-col :span="10">
          <el-form v-show="needsForm.type==1" :model="needsForm" label-position="left" label-width="100px"
                   style='background-color: #eeeeef;padding: 6%;border-radius:6px;'>
            <span class="detail-title">需求参数</span>
            <el-form-item label="出发地: " disabled>
              <span>{{needsForm.placeOfDeparture}}</span>
            </el-form-item>
            <el-form-item label="出发国家" disabled>
              <span> {{needsForm.placeOfDepartureNational}} </span>
            </el-form-item>
            <el-form-item label="目的地" disabled>
              <span> {{needsForm.destination}} </span>
            </el-form-item>
            <el-form-item label="目的国家" disabled>
              <span> {{needsForm.destinationNational}} </span>
            </el-form-item>
            <el-form-item label="出发时间">
              <span> {{needsForm.departureTime}} </span>
            </el-form-item>
            <el-form-item label="旅行天数">
              <span> {{needsForm.numberOfDays}} </span>
            </el-form-item>
            <el-form-item label="成人数">
              <span> {{needsForm.numberOfAdults}} </span>
            </el-form-item>
            <el-form-item label="儿童数">
              <span> {{needsForm.numberOfKid}} </span>
            </el-form-item>
            <span class="detail-title">服务要求</span>
            <el-form-item label="预算" disabled>
              <span> {{needsForm.budget}} </span>
            </el-form-item>
            <el-form-item label="酒店要求" disabled>
              <span> {{needsForm.hotelMinimumStandard}} </span>
            </el-form-item>
            <el-form-item label="房型要求" disabled>
              <span> {{needsForm.roomMinimumStandard}} </span>
            </el-form-item>
            <el-form-item label="餐饮要求">
              <span> {{needsForm.cateringMinimumStandard}} </span>
            </el-form-item>
            <el-form-item label="服务要求">
              <span> {{needsForm.serviceMinimumStandard}} </span>
            </el-form-item>

            <span class="detail-title">客户姓名</span>
            <el-form-item label="姓名" disabled>
              <span> {{needsForm.contactName}} </span>
            </el-form-item>
            <el-form-item label="手机号" disabled>
              <span> {{needsForm.contactMobile}} </span>
            </el-form-item>
            <el-form-item label="备注">
              <span> {{needsForm.remark}} </span>
            </el-form-item>
          </el-form>
          <el-form v-show="needsForm.type==2" :model="customNeedsForm" label-position="left" label-width="100px"
                   style='margin-left:50px;'>
            <span class="detail-title">调整商品</span>
            <el-form-item label="商品名称">
              <el-input v-model="customNeedsForm.customProductName" disabled></el-input>
            </el-form-item>
            <el-form-item label="成人价">
              <el-input v-model="customNeedsForm.customProductFixPrice" disabled></el-input>
            </el-form-item>
            <el-form-item label="儿童价">
              <el-input v-model="customNeedsForm.customProductFixPrice" disabled></el-input>
            </el-form-item>
            <span class="detail-title">调整项目</span>
            <el-form-item label="酒店要求">
              <el-input v-model="customNeedsForm.adjustedItems" disabled></el-input>
            </el-form-item>
            <span class="detail-title">出行信息</span>
            <el-form-item label="出发时间">
              <el-input v-model="customNeedsForm.departureTime" disabled></el-input>
            </el-form-item>
            <el-form-item label="成人人数">
              <el-input v-model="customNeedsForm.numberOfAdults" disabled></el-input>
            </el-form-item>
            <el-form-item label="儿童人数">
              <el-input v-model="customNeedsForm.numberOfKid" disabled></el-input>
            </el-form-item>
            <el-form-item label="预算">
              <el-input v-model="customNeedsForm.budget" disabled></el-input>
            </el-form-item>
            <span class="detail-title">联系人</span>
            <el-form-item label="姓名">
              <el-input v-model="customNeedsForm.contactName" disabled></el-input>
            </el-form-item>
            <el-form-item label="手机号码">
              <el-input v-model="customNeedsForm.contactMobile" disabled></el-input>
            </el-form-item>
            <span class="detail-title">备注</span>
            <el-form-item label="备注">
              <el-input type="textarea" class="article-textarea" :rows="1" autosize v-model="customNeedsForm.remark"
                        disabled></el-input>
            </el-form-item>
          </el-form>
        </el-col>

        <el-col :span="14">
          <el-form :model="customForm" label-position="left" label-width="100px" style='margin-left:50px;'>
            <el-form-item label="商品名称">
              <el-input v-model="customForm.name" :maxlength="120" disabled></el-input>
            </el-form-item>
            <el-form-item label="市场价">
              <el-input v-model="customForm.marketPrice" type="number" disabled></el-input>
            </el-form-item>
            <el-form-item label="成人价格">
              <el-input v-model="customForm.fixPrice" type="number" disabled></el-input>
            </el-form-item>
            <el-form-item label="儿童价格">
              <el-input v-model="customForm.childPrice" type="number" disabled></el-input>
            </el-form-item>
            <el-form-item label="支付方式">
              <el-radio v-model="customForm.isSupportDeposit" :label="true" disabled>付定金</el-radio>
              <el-radio v-model="customForm.isSupportDeposit" :label="false" disabled>付全额</el-radio>
            </el-form-item>
            <el-form-item label="定金">
              <el-input v-model="customForm.deposit" type="number" disabled></el-input>
            </el-form-item>
            <hr style="margin:16px 0 30px 0;color: lightgray;">
            <el-form-item label="行程安排">
              <div class="editor-content" v-html="customForm.intro"
                   style="padding-bottom: 60px;border: 1px solid lightgray;"></div>
            </el-form-item>
            <el-form-item label="费用说明">
              <div class="editor-content" v-html="customForm.specDetailDescription"
                   style="padding-bottom: 60px;border: 1px solid lightgray;"></div>
            </el-form-item>
            <el-form-item label="预定须知">
              <div class="editor-content" v-html="customForm.afterSaleService"
                   style="padding-bottom: 60px;border: 1px solid lightgray;"></div>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="customDetailDialog = false">返回</el-button>
      </div>
    </el-dialog>


    <!--取消提示-->
    <el-dialog
      title="温馨提示"
      :visible.sync="cancelDialog"
      width="28%"
      left>
      <span>确定取消此订单？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="cancelDialog = false">取 消</el-button>
    <el-button type="danger" @click="cancel">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>


<script>
  import { cancel, distribution, fetchList } from '@/api/needs'
  import { custom, edit, getByCustomId } from '@/api/custom'
  import { customer } from '@/api/custom-person'
  import Tinymce from '@/components/Tinymce'
  import singleImage from '@/components/singleImage'
  import store from '@/store'
  import { getUsername } from '@/utils/auth' // getToken from cookie

  export default {
    components: { Tinymce, singleImage },
    data() {
      return {
        cancelId: '',
        currentUser: getUsername(),
        // 当前的需求单的Id
        currentCustomOrderId: '',
        store,
        total: 0,
        list: null,
        customerList: null,
        listLoading: true,
        customDialog: false,
        needsDialog: false,
        customNeedsDialog: false,
        distributionDialog: false,
        customDetailDialog: false,
        cancelDialog: false,
        dialogStatus: '',
        textMap: {
          update: '修改定制',
          create: '定制'
        },
        listQuery: {
          pageNo: 1
        },
        distributionListQuery: {
          pageNo: 1
        },
        customForm: {
          name: '',
          isSupportDeposit: true,
          category: '1',
          type: '1'
        },
        distributionForm: {},
        needsForm: {},
        customNeedsForm: {},
        // list界面的option
        statusOptions: [{
          value: '1',
          label: '待分配'
        }, {
          value: '2',
          label: '待定制'
        }, {
          value: '3',
          label: '待支付'
        }, {
          value: '4',
          label: '已完成'
        }, {
          value: '5',
          label: '已取消'
        }],
        customRules: {
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
            { required: true, message: '请选择分类', trigger: 'blur' }
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
          1: '待分配',
          2: '待定制',
          3: '待支付',
          4: '已完成',
          5: '已取消'
        }
        return statusMap[status]
      },
      typeFilter(type) {
        const typeMap = {
          1: '高端',
          2: '精选'
        }
        return typeMap[type]
      }
    },
    // 一开始就获取列表
    created() {
      this.fetchData()
    },
    methods: {
      // 获取需求列表
      fetchData() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.data.list
          for (let i = 0; i < this.list.length; i++) {
            this.list[i].departureTime = this.list[i].departureTime.substring(0, 10)
          }
          this.total = response.data.totalCount
          this.listLoading = false
        })
      },
      // 重置定制框
      resetTemp() {
        this.customForm = {}
      },
      // 定制框
      handleCreate(row) {
        console.log(store.getters.imgUrl)
        this.resetTemp()
        this.needsForm = row
        this.customNeedsForm = row
        this.customForm.customOrderId = row.id
        this.dialogStatus = 'create'
        this.customDialog = true
        setTimeout(() => {
          this.$refs.intro.setContent(this.customForm.intro)
          this.$refs.specDetailDescription.setContent(this.customForm.specDetailDescription)
          this.$refs.afterSaleService.setContent(this.customForm.afterSaleService)
        }, 0)
        this.resetImage()
      },
      // 定制
      custom() {
        if (this.customForm.url === undefined || this.customForm.url === null) {
          this.$notify({
            title: '提交失败',
            message: '请上传图片',
            type: 'faliure',
            duration: 2000
          })
          return
        }
        this.$refs['customForm'].validate((valid) => {
          if (valid) {
            this.customDialog = true
            custom(this.customForm).then((response) => {
              this.customDialog = false
              this.$notify({
                title: '成功',
                message: '定制成功',
                type: 'success',
                duration: 2000
              })
              this.fetchData()
            })
          }
        })
      },
      // 编辑定制图片
      imageSuccessCBK(url) {
        console.log('图片组件传过来的url')
        console.log(url)
        this.customForm.url = url
      },
      resetImage() {
        setTimeout(() => {
          this.$refs.singleImageUpload.setUrl(this.customForm.url)
        }, 0)
      },
      // 编辑定制框
      handleUpdate(row) {
        const customOrderId = row.id
        getByCustomId({ customOrderId }).then(response => {
          const data = response.data
          this.needsForm = row
          this.customNeedsForm = row
          const tempData = Object.assign({}, data) // 将row的值全部赋值给customForm 然后提交customForm就是编辑
          this.dialogStatus = 'update'
          this.customForm.id = tempData.id
          this.customForm.name = tempData.name
          this.customForm.intro = tempData.intro
          this.customForm.specDetailDescription = tempData.specDetailDescription
          this.customForm.marketPrice = tempData.marketPrice
          this.customForm.fixPrice = tempData.fixPrice
          this.customForm.childPrice = tempData.childPrice
          this.customForm.isSupportDeposit = tempData.isSupportDeposit
          this.customForm.deposit = tempData.deposit
          this.customForm.afterSaleService = tempData.afterSaleService
          // 调用子组件出现undefined的情况可以setTimeout来处理
          setTimeout(() => {
            this.$refs.intro.setContent(this.customForm.intro)
            this.$refs.specDetailDescription.setContent(this.customForm.specDetailDescription)
            this.$refs.afterSaleService.setContent(this.customForm.afterSaleService)
          }, 0)
          // 弹出框dialog父组件通过$refs这个方法调用singleImageUpload子组件，将url回显到子组件中
          this.customDialog = true
          this.customForm.url = store.getters.imgUrl + tempData.url
          console.log(this.customForm.url)
          this.resetImage()
          // this.customForm.url = store.getters.imgUrl + tempData.url
          // setTimeout(() => {
          //   this.$refs.singleImageUpload.setUrl(this.customForm.url)
          // }, 0)
        })
      },

      // 定制编辑
      edit() {
        const tempData = Object.assign({}, this.customForm)
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
      // 定制详情（高端定制）
      viewDetail(row) {
        const customOrderId = row.id
        getByCustomId({ customOrderId }).then(response => {
          const data = response.data
          this.customForm = data
          this.needsForm = row
          this.customNeedsForm = row
        })
        this.customForm = Object.assign({}, row) // 将row的值全部赋值给customForm 然后提交customForm就是编辑
        this.dialogStatus = 'update'
        this.customDetailDialog = true
        this.customForm.url = store.getters.imgUrl + row.url
        // this.$refs.singleImageUpload.setUrl(row.url)
      },
      // 分配框
      handleDistribution(row) {
        this.currentCustomOrderId = row.id
        this.distributionDialog = true
        this.listLoading = true
        customer(this.distributionListQuery).then(response => {
          this.customerList = response.data.list
          this.total = response.data.totalCount
          this.listLoading = false
        })
      },
      // 选择定制师（即分配）
      distribution(row) {
        const tempData = {
          customerId: row.merchantId,
          id: this.currentCustomOrderId
        }
        distribution(tempData).then((response) => {
          this.distributionDialog = false
          this.fetchData()
        })
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
      distributionHandleCurrentChange(val) {
        this.distributionListQuery.pageNo = val
        this.fetchData()
      },
      // 查看需求详情
      viewNeeds(detail) {
        this.needsDialog = true
        this.needsForm = detail
      },
      viewCustomNeeds(detail) {
        this.customNeedsDialog = true
        this.customNeedsForm = detail
      },
      handleCancel(row) {
        this.cancelDialog = true
        this.cancelId = row.id
      },
      // 取消
      cancel() {
        cancel(this.cancelId).then(() => {
          this.$notify({
            title: '成功',
            message: '取消成功',
            type: 'success',
            duration: 2000
          })
          this.fetchData()
        }).catch(err => {
          this.$notify({
            title: '失败',
            message: '取消失败' + err.message,
            type: 'failure',
            duration: 1000
          })
        })
        this.fetchData()
        this.cancelDialog = false
      }
    }
  }
</script>
<style>
  .detail-title {
    font-size: 18px;
    padding-bottom: 26px;
    display: block;
    font-weight: bold;
    text-align: center;
  }

  input:disabled {
    color: #444 !important;
  }

  textarea:disabled {
    color: #444 !important;
  }
</style>
