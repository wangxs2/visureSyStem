<template>
  <div class="gongying-info">
    <div class="cur-menu-name">
        <span>实时播报信息/供应信息</span>
    </div>
    <div class="table-search-wrapper">
      <div class="search-wrapper">
        <div class="search-input">
          <span>标题:</span>
          <el-autocomplete v-model="title" :fetch-suggestions="querySearchAsync" placeholder="请选择标题名称" @select="handleSelect" clearable></el-autocomplete>
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
          <el-select v-model="status" placeholder="请选择" clearable>
            <el-option
              v-for="item in statusList"
              :key="item.type"
              :label="item.name"
              :value="item.type">
            </el-option>
          </el-select>
        </div>
        <div class="search-input search-btn" @click="search">搜索</div>
        <div class="search-input search-btn" @click="add">新增</div>

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
              <div style="padding:5px;" v-if="scope.row.status==0">未核实</div>
              <div style="padding:5px;" v-if="scope.row.status==1">已核实</div>
              <div style="padding:5px;" v-if="scope.row.status==2">已完结</div>
            </template>
          </el-table-column>
          <el-table-column prop="links" label="链接">
            <template slot-scope="scope">
              <div style="padding:5px;color:#4F84FD;cursor:pointer;" class="font-left" v-if="scope.row.attachment" @click="goUrl(scope.row)">{{scope.row.attachment[0]}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间"></el-table-column>
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
      <el-dialog :title="addOrEditPoint==1?'编辑':'新增'" :visible.sync="dialogVisible" :close-on-click-modal="false">
        
        <el-form label-position="right" :model="form" :rules="rules" ref="form" >
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="发布时间" prop="updateTime">
            <el-date-picker v-model="form.updateTime" type="datetime" placeholder="选择发布时间" 
            value-format="yyyy-MM-dd hh:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="消息主体" prop="body">
            <el-input v-model="form.body" type="textarea" :rows="5" placeholder="请输入消息主体"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio v-for="item in statusList" :key="item.type" :label="item.type">{{item.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="上传附件" prop="links" ref="imageUpload">
            <el-upload class="upload-demo" action="#" :http-request="handleHttpUpolad" :on-success="uploadImgSuccess" :on-remove="handleRemove" 
            :on-error="uploadImgError" :on-exceed="changeExceed" :file-list="form.imgList"  :limit="1" v-model="form.links">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('form')">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 删除 -->
      <el-dialog title="提示" :visible.sync="dialogVisibleDeleteShow" width="25%" center>
        <div style="text-align:center;"><span>确定要删除吗？</span></div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleDeleteShow = false">取 消</el-button>
          <el-button type="primary" @click="delectCom">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {screenHeight} from "../../utils/util"
export default {
  name: 'gongyingInfo',
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
      tableData: [],
      total:0,
      gridData: [],
      params:{},
      pageshow:true,

      dialogVisible:false,
      addOrEditPoint:0,
      curId:'',
      statusList:[
        {
          type:1,
          name:"已核实"
        },
        {
          type:0,
          name:"未核实"
        },
        {
          type:2,
          name:"已完结"
        }
      ],
      form:{
        title:'', // 标题
        updateTime:'', // 发布时间
        body:'', // 消息主体
        // attachmentLink:'', // 网页链接
        status:1, // 是否置顶
        imgList:[]
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
        ],
        updateTime: [
          { required: true, message: '请选择发布时间', trigger: 'change' },
        ],
        body: [
          { required: true, message: '请输入消息主体', trigger: 'blur' },
        ],
        links: [
          { required: false, message: '请上传文件',  },
        ],
        status: [
          { required: true, message: '请选择是否置顶', trigger: 'change' },
        ],
      },

      dialogVisibleDeleteShow:false,
    }
  },
  mounted () {
    this.curHeight=screenHeight()

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
	  uploadImgSuccess(response, file, fileList) {
     // 缓存接口调用所需的文件路径
      this.$refs.imageUpload.clearValidate();
      this.form.imgList=fileList
      this.$message({
        message: "上传成功",
        type: 'success'
      });
	  },
	  handleRemove(file, fileList) {
     // 更新缓存文件
     this.form.imgList=fileList
      this.$message({
        message: "删除成功",
        type: 'success'
      });
	  },
    uploadImgError(err,file,fileList){
      if (err.result&&err.result==-1){
        this.$message.error(err.message)
      } else {
        this.$message.error("上传失败")
      }
    },
    handleHttpUpolad(file){
      // let zip=new jsZip()
      // zip.file(file.file.name,file.file)
      // zip.generateAsync({
      //   type:'blob',
      //   compression:"DEFLATE",
      //   compressionOption:{
      //     level:8
      //   },
      // }).then(content => {
        // console.log(file)
        // if (file.file.type.indexOf("pdf")!=-1&&file.file.type.indexOf("doc")!=-1&&file.file.type.indexOf("docx")!=-1){
          let data = new FormData();
          data.append("uploadFile",file.file);  //图片
          this.$fetchPostFile("file/upload",data).then(res => {
            
            if (res.result&&res.result==-1){
              file.onError(res)
            } else {
              file.onSuccess(res)
              this.form.links=res
            }
          }).catch(err => {
            file.onError(err)
            // this.$message.error("上传失败")
          })

        // } else {
        //   this.$message.error("请上传pdf或者word文件")

        // }
    },
    changeExceed(files, fileList){
      this.$message.error("当前限制只可上传1个文件，重传文件前，请先删除旧文件")
    },
    add(){
      this.addOrEditPoint=0
      this.dialogVisible=true
      this.form={
        title:'',
        updateTime:'',
        body:'',
        links:'',
        status:1,
        imgList:[]
      }
    },
    editRow(row){
      this.addOrEditPoint=1
      this.dialogVisible=true
      this.curId=row.id
      this.form={
        title:row.title,
        updateTime:row.updateTime,
        body:row.body,
        links:row.links,
        status:row.status,
      }
      if (row.links){
        this.form.imgList=[{url: row.links,name:row.links, status: 'finished'}]
      } else {
        this.form.imgList=[]
      }
    },
    deleteRow(row){
      this.curId=row.id
      this.dialogVisibleDeleteShow=true
    },
    delectCom(){
      this.$fetchPost("supplyInfo/delete",{id:this.curId}).then(res => {
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
    submitForm(form){
      this.$refs[form].validate((valid) => {
        if (valid) {
          
          if (this.addOrEditPoint==0){
            this.$fetchPost("supplyInfo/insert",this.form,"json").then(res => {
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
            if (this.form.imgList&&this.form.imgList.length==0){
              this.form.links=''
            }
            this.$fetchPost("supplyInfo/update",this.form,"json").then(res => {
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
      this.$fetchGet("supplyInfo/getTitle").then(res => {
        if (res.data&&res.data.length>0){
          let obj={}
          res.data.forEach(item => {
            obj={
              value:item
            }
          this.titleList.push(obj)
          })
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
    },
    search(){
      this.pageshow = false
      this.page=1
      this.tableData=[]
      this.params={
        title:this.title,
        status:this.status,
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
      this.$fetchGet("supplyInfo/getList",params).then(res => {
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
    goUrl(row){
      window.open(row.attachment[0])
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
.gongying-info{
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width:350px !important;
  }
  .el-upload-list{
    // width:350px;
  }
  
}

</style>
