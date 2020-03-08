<template>
  <div class="gong">
    <div class="cur-menu-name">
        <span>发布信息维护/供方</span>
    </div>
    <div class="table-search-wrapper">
      <div class="search-wrapper">
        <div class="search-input">
          <span>起始时间-结束时间:</span>
          <el-date-picker
            v-model="startEndTate"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="search-input">
          <span>内容:</span>
          <el-input v-model="content" placeholder="请输入查询内容" clearable></el-input>
        </div>
        <div class="search-input search-btn" @click="search">搜索</div>

      </div>
      <div class="table-wrapper">
        <el-table :data="tableData.slice((page-1)*pageSize,page*pageSize)" :height="curHeight-230" style="width: 100%">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="country" label="国家"></el-table-column>
          <el-table-column prop="province" label="省" width="80"></el-table-column>
          <el-table-column prop="city" label="市" width="80"></el-table-column>
          <el-table-column prop="hospitalName" label="机构名称">
          </el-table-column>
          <el-table-column prop="gaodeLon" label="经度"></el-table-column>
          <el-table-column prop="gaodeLat" label="纬度"></el-table-column>
          <el-table-column prop="createTime" label="物资提供时间"></el-table-column>
          <el-table-column prop="linkPeople" label="联系人"></el-table-column>
          <el-table-column prop="linkTel" label="联系方式"></el-table-column>
          <el-table-column prop="needsName" label="物资清单" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="descr" label="备注" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="name" label="操作" fixed="right" width="120">
            <template slot-scope="scope">
              <el-button @click="deleteRow(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
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
    <!-- 删除 -->
    <el-dialog title="提示" :visible.sync="dialogVisibleDeleteShow" width="25%" center>
      <div style="text-align:center;"><span>确定要删除吗？</span></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleDeleteShow = false">取 消</el-button>
        <el-button type="primary" @click="delectCom">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {screenHeight,formatDate} from "../../utils/util"
export default {
  name: 'gong1',
  components: {
  },
  data () {
    return {
      curHeight:0,
      dialogTableVisible:false,
      page:1,
      pageSize:10,
      startEndTate:[],
      content:'',
      tableData: [],
      total:0,
      params:{},
      pageshow:true,

      dialogVisibleDeleteShow:false,
    }
  },
  mounted () {
    this.curHeight=screenHeight()

  },
  created () {
    this.params={
      orgType:2,
      page:this.page,
      pageSize:this.pageSize
    }
    this.getTableData(this.params)
  },
  methods: {
    deleteRow(row){
      this.curId=row.id
      this.dialogVisibleDeleteShow=true
    },
    delectCom(){
      this.$fetchPost("hospital/shield",{id:this.curId}).then(res => {
        this.$message({
          message: res.message,
          type: 'success'
        });
        if (res.result==1){
          this.dialogVisibleDeleteShow=false
          this.regetList()
        }
      })

    },
    // 操作完成获取数据
    regetList(){
      this.pageshow = false
      this.page=1
      this.tableData=[]
      this.params={
        orgType:2,
        page:this.page,
        pageSize:this.pageSize
      }
      this.getTableData(this.params)
      this.$nextTick(() => {
          this.pageshow = true
      })
    },
    search(){
      this.pageshow = false
      this.page=1
      this.tableData=[]
      this.params={
        orgType:2,
        content:this.content,
        page:this.page,
        pageSize:this.pageSize
      }
      if (this.startEndTate&&this.startEndTate.length>0){
        this.params.startDate=this.startEndTate[0]
        this.params.endDate=this.startEndTate[1]
      } else {
        this.params.startDate=''
        this.params.endDate=''

      }
      
      this.getTableData(this.params)
      this.$nextTick(() => {
          this.pageshow = true
      })

    },
    getTableData(params){
      this.$fetchGet("hospital/getHospital",params).then(res => {
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
            })
          }
      })
    },
    handleSizeChange(val) {
      this.params.pageSize=val
      this.getTableData(this.params)
    },
    handleCurrentChange(val) {
      this.params.page=val
      this.getTableData(this.params)
    },
    goUrl(item){
      window.open('https://medicalsupplies.sitiits.com/'+item)
    },
    clickLookBiao(row){

    }

  }
	
	
}
</script>

<style lang="scss">
@import '../../assets/css/common.scss';
.gong{
  .el-input{
    width:200px;
  }
  
}

</style>
