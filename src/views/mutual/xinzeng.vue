`<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.locationDesc" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="filters.status">
            <el-radio v-model="status" :label="0">未审核</el-radio>
            <el-radio :label="1">已审核</el-radio>
            <!-- <el-radio :label="2">未通过</el-radio> -->
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="refreshData" :formatter="transformButtonStatus">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="data" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="userId" label="用户ID" min-width="100"></el-table-column>
      <el-table-column prop="type" label="专题类别" :formatter="transformtType" min-width="100"></el-table-column>
      <el-table-column prop="status" label="状态" min-width="80" :formatter="transformStatus"></el-table-column>
      <el-table-column
        prop="introduction"
        label="简介内容"
        min-width="120"
        :show-overflow-tooltip="true"
        sortable
      ></el-table-column>
      <el-table-column
        prop="reason"
        label="添加原因"
        width="120"
        sortable
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="locationDescription"
        label="位置"
        min-width="120"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="200" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | moment("YYYY-MM-DD,h:mm:ss") }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="处理时间" min-width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | moment("YYYY-MM-DD,h:mm:ss") }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="xLat" label="纬度" min-width="120" sortable></el-table-column>
      <el-table-column prop="yLng" label="经度" min-width="120" sortable></el-table-column>
      <el-table-column prop="comments" label="推荐人" min-width="120" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="操作" width="200">
        <template scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="handleEdit(scope.$index,scope.row)"
            v-if="scope.row.status==0"
          >未审核</el-button>
          <el-button
            type="primary"
            size="small"
            @click="handleEdit(scope.$index,scope.row)"
            v-else-if="scope.row.status==1"
            :disabled="scope.row.status === '1'? true:false"
          >已审核</el-button>

          <el-button
            type="primary"
            size="small"
            @click="handleEdit(scope.$index,scope.row)"
            v-if="scope.row.status==2"
          >未通过</el-button>
          <el-button
            type="primary"
            size="small" class="el-icon-picture"
            @click="viewPhoto(scope.$index, scope.row.attachments.replace(/(^\[+)|(\]+$)/g,'').split(','))"
          >查看图片</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" class="el-icon-delete"  @click="handleDeletes" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="5" :total="total"
        style="float:right;"
      ></el-pagination>
    </el-col>
    <!-- 点击处理时的对话框 -->
    <el-dialog v-model="editFormVisible" title :close-on-click-modal="false">
      <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
        <el-form-item label="专题名称" prop="topicName">
          <el-input v-model="editForm.topicName" auto-complete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="活动日期" prop="updateTime">
          <el-date-picker v-model="editForm.updateTime" disabled type="date"></el-date-picker>
        </el-form-item> -->

        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="editForm.userId"></el-input>
        </el-form-item>

        <el-form-item label="纬度" prop="xLat">
          <el-input v-model="editForm.xLat" type="number"></el-input>
        </el-form-item>
        <el-form-item label="经度" prop="yLng">
          <el-input v-model="editForm.yLng" type="number"></el-input>
        </el-form-item>
        <el-form-item label="区县" prop="county">
          <el-select v-model="editForm.county" placeholder="请选择区县">
            <el-option label="长安区" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="乡镇" prop="town">
          <el-select v-model="editForm.town" placeholder="请选择乡镇">
            <el-option label="滦镇街道" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="峪口">
          <el-select v-model="editForm.yuKou" placeholder="请选择峪口">
            <el-option label="扯袍峪" value="11"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="位置描述">
          <el-input type="textarea" v-model="editForm.locationDescription"></el-input>
        </el-form-item>
        <el-form-item label="人文地理">
          <el-input type="textarea" v-model="editForm.history"></el-input>
        </el-form-item>
        <el-form-item label="自然风貌">
          <el-input type="textarea" v-model="editForm.naturalFeatures"></el-input>
        </el-form-item>
        <el-form-item label="实景链接">
          <el-input type="text" v-model="editForm.realBautyUrl"></el-input>
        </el-form-item>
        <el-form-item label="其他说明">
          <el-input type="textarea" v-model="editForm.otherComments"></el-input>
        </el-form-item>
        <el-form-item label="新增处理" prop="comments">
          <el-input type="text" v-model="editForm.comments"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="handleDataSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!-- 查看图片的对话框 -->
    <el-dialog v-model="showViewImage" title :close-on-click-modal="false">
      <!-- 轮播图 -->
      <el-carousel height="700px">
        <el-carousel-item v-for="(item,index) in viewImageData" :key="index">
          <img :src="item" class="carousel-img">
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </section>
</template>
<script src="../../scripts/mutual/xinzeng.js"></script>
<style scoped>
.el-carousel__item img {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  width: 100%;
  height: 100%;
  margin: 0;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>