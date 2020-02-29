<template>
  <div class="minjian-orig">
    <div class="cur-menu-name">
        <span>录入信息维护/民间组织</span>
    </div>
    <div class="table-search-wrapper">
      <div class="search-wrapper">
        <div class="search-input">
          <span>创建时间:</span>
          <el-date-picker
            v-model="createTime"
            value-format="yyyy-MM-dd hh:mm:ss"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </div>
        <div class="search-input">
          <span>物品名称:</span>
          <el-autocomplete v-model="goodsName" :fetch-suggestions="querySearchAsync" placeholder="请选择物品名称" @select="handleSelect"></el-autocomplete>
        </div>
        <div class="search-input">
          <span>接受捐赠/采购情况:</span>
          <el-select v-model="acceptInfo" placeholder="请选择">
            <el-option
              v-for="item in acceptInfoList"
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
          <el-table-column prop="name" label="机构名称" width="140" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="materialType" label="类型" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.materialType==1">需求方</span>
              <span v-if="scope.row.materialType==2">提供方</span>
              <span v-if="scope.row.materialType==3">民间组织</span>
            </template>
          </el-table-column>
          <el-table-column prop="province" label="省" width="80"></el-table-column>
          <el-table-column prop="city" label="市" width="80"></el-table-column>
          <el-table-column prop="address" label="详细地址" width="140" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="descr" label="备注" width="100"></el-table-column>
          <el-table-column prop="serviceRange" label="服务覆盖范围" width="100"></el-table-column>
          <el-table-column prop="startTime" label="服务起始时间" width="100"></el-table-column>
          <el-table-column prop="endTime" label="服务结束时间" width="100"></el-table-column>
          <el-table-column prop="linkPeople" label="联系人" width="200">
            <template slot-scope="scope">
              <div v-for="(item,i) in scope.row.linkPeopleList" :key="i" style="padding:5px;" class="font-left">{{item}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="picUrl" label="图片链接" width="180" >
            <template slot-scope="scope">
              <!-- <div style="padding:5px;color:#4F84FD;cursor:pointer;" class="font-left"> -->
                <img v-for="(item,i) in scope.row.picUrlList" :key="i" :src="'https://medicalsupplies.sitiits.com/'+item" alt="" style="width:60px;height:60px;margin:2px;" >
              <!-- </div> -->
            </template>

          </el-table-column>
          <el-table-column prop="endTime" label="物资提供时间" width="120"></el-table-column>
          <el-table-column prop="name" label="查看" fixed="right" width="150">
            <template slot-scope="scope">
              <span style="color:#4F84FD;cursor:pointer;" @click="clickLookGoods(scope.row)">查看提供的服务或物资</span>

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
    <!-- 查看所需物资弹框 -->
    <el-dialog title="物资详情" :visible.sync="dialogTableVisible" :close-on-click-modal="false" width="480" center custom-class="look-goods">
      <el-table :data="gridData">
        <el-table-column property="needsName" label="物资名称"></el-table-column>
        <el-table-column property="needsNum" label="物资数量"></el-table-column>
        <!-- <el-table-column property="" label="物资表述">
            <template slot-scope="scope">
              <span style="color:#4F84FD;cursor:pointer;" @click="clickLookBiao(scope.row)">查看标准</span>
            </template>

        </el-table-column> -->
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
import {screenHeight} from "../../utils/util"
export default {
  name: 'minjianOrig',
  components: {
  },
  data () {
    return {
      curHeight:0,
      dialogTableVisible:false,
      page:1,
      pageSize:10,
      createTime:'',
      goodsName:'',
      acceptInfo:'',
      goodsNameList: [],
      acceptInfoList: [
        {
          value: 1,
          label: '接受个人捐赠'
        }, {
          value: 2,
          label: '接受企业捐赠'
        }, {
          value: 3,
          label: '接受采购'
        }, {
          value: 4,
          label: '捐赠'
        }, {
          value: 5,
          label: '采购'
        }
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
      materialType:3,
      page:this.page,
      pageSize:this.pageSize
    }
    this.getTableData(this.params)
    this.getNeedsNameList()
  },
  methods: {
    getNeedsNameList(){
      this.$fetchGet("prepare/getNeedsName").then(res => {
        if (res.data&&res.data.length>0){
          let obj={}
          res.data.forEach(item => {
            obj={
              value:item
            }
          this.goodsNameList.push(obj)
          })
        }
      })
    },
    querySearchAsync(queryString,cb) {
      var restaurants = this.goodsNameList;
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
      cb(results);

    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
    },
    search(){
      this.pageshow = false
      this.page=1
      this.tableData=[]
      this.params={
        materialType:3,
        createTime:this.createTime,
        needName:this.goodsName,
        status:this.acceptInfo,
        page:this.page,
        pageSize:this.pageSize
      }
      this.getTableData(this.params)
      this.$nextTick(() => {
          this.pageshow = true
      })

    },
    getTableData(params){
      this.$fetchGet("prepare/getMaterial",params).then(res => {
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
    clickLookGoods(row){
      this.dialogTableVisible=true
      this.gridData=row.prepareDetails
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
.minjian-orig{
  
}

</style>
