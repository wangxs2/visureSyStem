<template>
  <div class="qiugou-info">
    <div class="cur-menu-name">
        <span>实时播报信息/求购信息</span>
    </div>
    <div class="table-search-wrapper">
      <div class="search-wrapper">
        <div class="search-input">
          <span>标题:</span>
          <el-autocomplete v-model="title" :fetch-suggestions="querySearchAsync" placeholder="请选择标题名称" @select="handleSelect"></el-autocomplete>
        </div>
        <div class="search-input">
          <span>起始时间-结束时间:</span>
          <el-date-picker
            v-model="startEndTate"
            type="datetimerange"
            value-format="yyyy-MM-dd hh:mm:ss"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="search-input">
          <span>状态:</span>
          <el-select v-model="status" placeholder="请选择">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search-input search-btn" @click="search">搜索</div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData.slice((page-1)*pageSize,page*pageSize)" :height="curHeight-230" style="width: 100%">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="title" label="标题" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div style="padding:5px;" class="font-left">{{scope.row.title}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="body" label="正文" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div style="padding:5px;" class="font-left">{{scope.row.body}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <div style="padding:5px;" v-if="scope.row.status==0">等待资助</div>
              <div style="padding:5px;" v-if="scope.row.status==1">资助完成</div>
            </template>
          </el-table-column>
          <el-table-column prop="links" label="链接">
            <template slot-scope="scope">
              <div style="padding:5px;color:#4F84FD;cursor:pointer;" class="font-left"v-if="scope.row.links" @click="goUrl(scope.row)">{{scope.row.links}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间"></el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
             v-if="pageshow"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="sizes, prev, pager, next, total,jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {screenHeight} from "../../utils/util"
export default {
  name: 'qiugouInfo',
  components: {
  },
  data () {
    return {
      curHeight:0,
      dialogTableVisible:false,
      page:1,
      pageSize:10,
      startEndTate:[],
      startDate:'',
      endDate:'',
      status:'',
      title:'',
      titleList: [],
      statusList: [
        {
          value: 0,
          label: '等待资助'
        }, {
          value: 1,
          label: '资助完成'
        }, 
      ],
      tableData: [],
      total:0,
      gridData: [],
      params:{},
      pageshow:true,
    }
  },
  mounted () {
    this.curHeight=screenHeight()

  },
  created () {
    this.params={
      tab:"purchase",
      page:this.page,
      pageSize:this.pageSize
    }
    this.getTableData(this.params)
    this.getNeedsNameList()
  },
  methods: {
    getNeedsNameList(){
      this.$fetchGet("dock/getTitle",{
        tab:'purchase'
      }).then(res => {
        if (res.data&&res.data.length>0){
          let obj={}
          res.data.forEach(item => {
            obj={
              value:item
            }
          this.titleList.push(obj)
          })
          console.log(this.titleList)
        }
      })
    },
    querySearchAsync(queryString,cb) {
      var restaurants = this.titleList;
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
      cb(results);

    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      console.log(item);
    },
    search(){
      this.pageshow = false
      this.page=1
      this.tableData=[]
      this.params={
        tab:"purchase",
        title:this.title,
        startDate:this.startEndTate[0],
        endDate:this.startEndTate[1],
        status:this.status,
        page:this.page,
        pageSize:this.pageSize
      }
      this.getTableData(this.params)
      this.$nextTick(() => {
          this.pageshow = true
      })

    },
    getTableData(params){
      this.$fetchGet("dock/getListByTab",params).then(res => {
          this.total=res.data.total
          this.tableData=res.data.list
          if (this.tableData&&this.tableData.length>0){
            this.tableData.forEach(item => {
              if (item.linkPeople){
                item.linkPeople=item.linkPeople.replace(/:/g, "-")
                item.linkPeopleList=item.linkPeople.split(',')
                item.linkPeopleList.forEach(items => {
                  // items=items.split(":").join("-")
                  // console.log(items)

                })
                item.linkPeopleList=item.linkPeopleList
              }
              if (item.picUrl){
                item.picUrlList=item.picUrl.split(",")
              }
              
            })
            console.log(this.tableData)
          }
      })
    },
    goUrl(row){
      window.open(row.links)
    },
    handleSizeChange(val) {
      this.params.pageSize=val
      this.getTableData(this.params)
    },
    handleCurrentChange(val) {
      this.params.page=val
      this.getTableData(this.params)
    },

  }
	
}
</script>

<style lang="scss">
@import '../../assets/css/common.scss';
.qiugou-info{
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width:350px !important;
  }
  
}

</style>
