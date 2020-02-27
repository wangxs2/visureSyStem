<template>
  <div class="cur-time">
    <div class="cur-menu-name">
        <span>实时播报信息/实时播报</span>
    </div>
    <div class="table-search-wrapper">
      <div class="search-wrapper">
        <div class="search-input">
          <span>标题:</span>
          <el-autocomplete v-model="headline" :fetch-suggestions="querySearchAsync" placeholder="请选择标题名称" @select="handleSelect"></el-autocomplete>
        </div>
        <div class="search-input">
          <span>起始时间-结束时间:</span>
          <el-date-picker
            v-model="startEndTate"
            value-format="yyyy-MM-dd hh:mm:ss"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="search-input">
          <span>是否置顶:</span>
          <el-select v-model="isTop" placeholder="请选择">
            <el-option
              v-for="item in isTopList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search-input search-btn" @click="search">搜索</div>
        <div class="search-input search-btn" @click="add">新增</div>

      </div>
      <div class="table-wrapper">
        <el-table :data="tableData.slice((page-1)*pageSize,page*pageSize)" :height="curHeight-230" style="width: 100%">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="headline" label="标题" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div style="padding:5px;" class="font-left">{{scope.row.headline}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="mainBody" label="正文" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div style="padding:5px;" class="font-left">{{scope.row.mainBody}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="pubDate" label="发布日期"></el-table-column>
          <el-table-column prop="publishSource" label="来源"></el-table-column>
          <el-table-column prop="url" label="链接">
            <template slot-scope="scope">
              <div style="padding:5px;color:#4F84FD;cursor:pointer;" class="font-left"v-if="scope.row.url" @click="goUrl(scope.row)">{{scope.row.url}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间"></el-table-column>
          <el-table-column prop="isTop" label="是否置顶">
            <template slot-scope="scope">
              <div style="padding:5px;" v-if="scope.row.isTop==1">是</div>
              <div style="padding:5px;" v-if="scope.row.isTop==0">否</div>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="editRow(scope.row)" type="text" size="small">编辑</el-button>
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

    <el-dialog :title="addOrEditPoint==1?'编辑':'新增'" :visible.sync="dialogVisible" :close-on-click-modal="false">
      
      <el-form label-position="right" :model="form" :rules="rules" ref="form" >
        <el-form-item label="标题" prop="headline">
          <el-input v-model="form.headline" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="发布时间" prop="pubDate">
          <el-date-picker v-model="form.pubDate" type="datetime" placeholder="选择发布时间" format="yyyy-MM-dd hh:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="消息主体" prop="mainBody">
          <el-input v-model="form.mainBody" type="textarea" :rows="5" placeholder="请输入消息主体"></el-input>
        </el-form-item>
        <el-form-item label="信息来源" prop="publishSource">
          <el-input v-model="form.publishSource" placeholder="请输入信息来源"></el-input>
        </el-form-item>
        <el-form-item label="网页链接" prop="url">
          <el-input v-model="form.url" placeholder="请输入网页链接"></el-input>
        </el-form-item>
        <el-form-item label="是否置顶" prop="isTop">
          <el-radio-group v-model="form.isTop">
            <el-radio v-for="item in isTopList" :key="item.type" :label="item.type">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import {screenHeight} from "../../utils/util"
export default {
  name: 'curTime',
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
      headline:'',
      isTop:'',
      acceptInfo:'',
      headlineList: [],
      isTopList: [
        {
          value: 0,
          label: '不置顶'
        }, {
          value: 1,
          label: '置顶'
        }, 
      ],
      tableData: [],
      total:0,
      gridData: [],
      params:{},
      pageshow:true,

      dialogVisible:false,
      addOrEditPoint:0,
      curId:'',
      isTopList:[
        {
          type:1,
          name:"是"
        },
        {
          type:0,
          name:"否"
        }
      ],
      form:{
        headline:'', // 标题
        pubDate:'', // 发布时间
        mainBody:'', // 消息主体
        publishSource:'', // 信息来源
        url:'', // 网页链接
        isTop:1, // 是否置顶
      },
      rules: {
        headline: [
          { required: true, message: '请输入标题', trigger: 'blur' },
        ],
        pubDate: [
          { required: true, message: '请选择发布时间', trigger: 'change' },
        ],
        mainBody: [
          { required: true, message: '请输入消息主体', trigger: 'blur' },
        ],
        publishSource: [
          { required: true, message: '请输入信息来源', trigger: 'blur' },
        ],
        url: [
          { required: true, message: '请输入网页链接', trigger: 'blur' },
        ],
        isTop: [
          { required: true, message: '请选择是否置顶', trigger: 'change' },
        ],
      },
    }
  },
  mounted () {
    this.curHeight=screenHeight()
    console.log(this.curHeight-230)

  },
  created () {
    this.params={
      page:this.page,
      pageSize:this.pageSize
    }
    this.getTableData(this.params)
    this.getNeedsNameList()
  },
  methods: {
    add(){
      this.addOrEditPoint=0
      this.dialogVisible=true
      this.form={
        headline:'',
        pubDate:'',
        mainBody:'',
        publishSource:'',
        url:'',
        isTop:1,
      }
    },
    editRow(row){
      this.addOrEditPoint=1
      this.dialogVisible=true
      this.curId=row.id
      this.form={
        headline:row.headline,
        pubDate:row.pubDate,
        mainBody:row.mainBody,
        publishSource:row.publishSource,
        url:row.url,
        isTop:row.isTop,
      }
    },
    deleteRow(row){
      this.$fetchPost("donate/delete",{id:row.id}).then(res => {
        this.$message({
          message: res.message,
          type: 'success'
        });
        if (res.result==1){
          this.regetList()
        }
      })
    },
    submitForm(form){
        this.$refs[form].validate((valid) => {
          if (valid) {
            
            if (this.addOrEditPoint==0){
              this.$fetchPost("donate/insert",this.form,"json").then(res => {
                this.$message({
                  message: res.message,
                  type: 'success'
                });
                if (res.result==1){
                  this.dialogVisible=false
                  this.regetList()
                }
              })
            }else if (this.addOrEditPoint==1){
              this.form.id=this.curId
              this.$fetchPost("donate/update",this.form,"json").then(res => {
                this.$message({
                  message: res.message,
                  type: 'success'
                });
                if (res.result==1){
                  this.dialogVisible=false
                  this.regetList()
                }
              })
            } 
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    // 操作完成获取数据
    regetList(){
      this.pageshow = false
      this.page=1
      this.tableData=[]
      this.params={
        page:this.page,
        pageSize:this.pageSize
      }
      this.getTableData(this.params)
      this.$nextTick(() => {
          this.pageshow = true
      })
    },
    getNeedsNameList(){
      this.$fetchGet("donate/getHeadline",{
        tab:'supply'
      }).then(res => {
        if (res.data&&res.data.length>0){
          let obj={}
          res.data.forEach(item => {
            obj={
              value:item
            }
          this.headlineList.push(obj)
          })
          console.log(this.headlineList)
        }
      })
    },
    querySearchAsync(queryString,cb) {
      var restaurants = this.headlineList;
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
        startDate:this.startEndTate[0],
        endDate:this.startEndTate[1],
        headline:this.headline,
        isTop:this.isTop,
        page:this.page,
        pageSize:this.pageSize
      }
      this.getTableData(this.params)
      this.$nextTick(() => {
          this.pageshow = true
      })

    },
    getTableData(params){
      this.$fetchGet("donate/getInfo",params).then(res => {
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
    goUrl(row){
      window.open(row.url)

    },
    clickLookBiao(row){

    }

  }
	
}
</script>

<style lang="scss">
@import '../../assets/css/common.scss';
.cur-time{
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width:350px !important;
  }
  .el-form{

    .el-form-item{
      display:flex;
      justify-content:flex-start;
      align-items:center;
    }
    .el-input,.el-form-item__content{
      width:600px;
    }
  }
  
}

</style>
