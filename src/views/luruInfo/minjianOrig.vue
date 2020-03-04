<template>
  <div class="minjian-orig">
    <div class="cur-menu-name">
        <span>录入信息维护/民间组织</span>
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
          <span>物品名称:</span>
          <el-autocomplete v-model="goodsName" :fetch-suggestions="querySearchAsync" placeholder="请选择物品名称" @select="handleSelect" clearable></el-autocomplete>
        </div>
        <!-- <div class="search-input">
          <span>接受捐赠/采购情况:</span>
          <el-select v-model="acceptInfo" placeholder="请选择" clearable>
            <el-option
              v-for="item in acceptInfoList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div> -->
        <div class="search-input search-btn" @click="search">搜索</div>
        <div class="search-input search-btn" @click="add">新增</div>

      </div>
      <div class="table-wrapper">
        <el-table :data="tableData.slice((page-1)*pageSize,page*pageSize)" :height="curHeight-230" style="width: 100%">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="name" label="机构名称">
          </el-table-column>
          <el-table-column prop="materialType" label="类型">
            <template slot-scope="scope">
              <span v-if="scope.row.materialType==1">需求方</span>
              <span v-if="scope.row.materialType==2">提供方</span>
              <span v-if="scope.row.materialType==3">民间组织</span>
            </template>
          </el-table-column>
          <el-table-column prop="province" label="省"></el-table-column>
          <el-table-column prop="city" label="市"></el-table-column>
          <el-table-column prop="address" label="详细地址"></el-table-column>
          <el-table-column prop="serviceRange" label="服务覆盖范围"></el-table-column>
          <el-table-column prop="startTime" label="服务起始时间"></el-table-column>
          <el-table-column prop="endTime" label="服务结束时间"></el-table-column>
          <el-table-column prop="linkPeople" label="联系人">
            <template slot-scope="scope">
              <div v-for="(item,i) in scope.row.linkPeopleList" :key="i" style="padding:5px;" class="font-left">{{item}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="attachment" label="图片链接">
            <template slot-scope="scope">
              <!-- <div style="padding:5px;color:#4F84FD;cursor:pointer;" class="font-left"> -->
                <img v-for="(item,i) in scope.row.attachment" :key="i" :src="item" alt="" style="width:60px;height:60px;margin:2px;" @click="goUrl(item)">
              <!-- </div> -->
            </template>

          </el-table-column>
          <el-table-column prop="detail" label="物资详情" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="descr" label="备注" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="isValid" label="审核状态">
            <template slot-scope="scope">
              <div v-if="scope.row.isValid==0">未审核</div>
              <div v-else-if="scope.row.isValid==1">审核通过</div>
              <div v-else-if="scope.row.isValid==2">审核不通过</div>
              <div v-else-if="scope.row.isValid==3">后台录入</div>
            </template>
          </el-table-column>
          <el-table-column prop="checkDescr" label="审核意见" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop=" hasShow" label="发布状态">
            <template slot-scope="scope">
              <div v-if="scope.row.hasShow==0">未发布</div>
              <div v-else-if="scope.row.hasShow==1">已发布</div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="查看" fixed="right" width="200">
            <template slot-scope="scope">
              <el-button @click="clickLookGoods(scope.row)" type="text" size="small">查看提供的服务或物资</el-button>
              <el-button @click="clickPublish(scope.row)" type="text" size="small" v-if="scope.row.isValid==0||scope.row.isValid==3">审核</el-button>
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
    <!-- 删除 -->
    <el-dialog title="提示" :visible.sync="dialogVisibleDeleteShow" width="25%" center>
      <div style="text-align:center;"><span>确定要删除吗？</span></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleDeleteShow = false">取 消</el-button>
        <el-button type="primary" @click="delectCom">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 审核弹框 -->
    <el-dialog title="审核" :visible.sync="dialogPublishShow" :close-on-click-modal="false" width="480" center custom-class="look-goods">
        <el-form label-position="right" :model="form">
          <el-form-item label="是否审核">
            <el-radio-group v-model="form.checkStatus">
              <el-radio v-for="item in statusList" :key="item.type" :label="item.type">{{item.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核意见">
            <el-input v-model="form.checkDesc" type="textarea" :rows="5" placeholder="请输入描述内容"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">提交</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>
    <!-- 新增或编辑弹框 -->
    <el-dialog :title="addOrEditPoint==1?'编辑':'新增'" :visible.sync="dialogVisibleAddOrEditShow"
    :show-close="false" 
    :close-on-click-modal="false">
      <div class="all-input-wrapper">
        <div class="input-wrapper">
          <div class="label-title"><span class="font-red">*</span>名称</div>
          <el-input v-model="form1.name" placeholder="请输入名称"></el-input>
        </div>
        <div class="input-wrapper">
          <div class="label-title"><span class="font-red">*</span>所在地区</div>
          <el-cascader v-model="form1.provinceAndCity" :options="options" :props="{value:'name',label:'name',children:'city'}" @change="handleChange"></el-cascader>
        </div>
        <div class="input-wrapper">
          <div><span class="font-red">*</span>详细地址（门牌号）</div>
          <el-input v-model="form1.address" placeholder="请输入街道、门牌号等"></el-input>
        </div>
        <div class="input-wrapper">
          <div><span class="font-red">*</span>服务覆盖范围</div>
          <el-input v-model="form1.serviceRange" placeholder="输入例如：山东全省16个地市"></el-input>
        </div>
        <div class="input-wrapper">
          <div class="label-title"><span class="font-red">*</span>请选择可提供服务的起始日期</div>
          <el-date-picker v-model="form1.startTime" type="date" placeholder="选择时间" 
          value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
        <div class="input-wrapper">
          <div class="label-title"><span class="font-red">*</span>请选择可提供服务的结束日期</div>
          <el-date-picker v-model="form1.endTime" type="date" placeholder="选择时间" 
          value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
        <div class="input-wrapper">
          <div class="label-title"><span class="font-red">*</span>机构类型</div>
          <el-radio-group v-model="type">
            <el-radio v-for="item in luruTypeRadio" :key="item.type" :label="item.type">{{item.name}}</el-radio>
          </el-radio-group>
        </div>
        <div class="input-wrapper">
          <div class="label-title">链接</div>
          <el-input v-model="form1.linkUrl" type="textarea" :rows="2" placeholder="请填写"></el-input>
        </div>
        <div class="input-wrapper">
          <div class="label-title">联系人-联系电话</div>
          <div class="comfirm-need-input-wrapper">
            <div class="comfirm-need-top comfirm-need-top-tel">

              <div class="comfirm-need-head">
                <div class="name">联系人</div>
                <div class="num">联系方式</div>
              </div>
              <div class="comfirm-need-body" v-for="(iteam,index) in contectTelList" :key="index">
                <div class="name">
                  <el-input class="sup-name" v-model="iteam.name" type="text" placeholder="输入联系人"></el-input>
                </div>
                <div class="num">
                  <el-input class="tel" v-model="iteam.tel" type="text" placeholder="输入电话号码(建议手机)"></el-input>
                   <!-- @blur="linkTelBlur(1,iteam.tel,index)" -->
                  <img @click="deleteTel(index)" style="" src="../../assets/images/reduce1.png" alt="">
                </div>
              </div>
            </div>
            <div class="comfirm-need-bottom" @click="addTel"><img style="" src="../../assets/images/add1.png" alt="" >添加</div>
          </div>
        </div>
        <div class="input-wrapper">
          <div class="label-title"><span class="font-red">*</span>服务提供类型</div>
          <div class="athor-wrapper">
            <el-checkbox-group v-model="materialDetails1" @change="changeStatus">
              <el-checkbox v-for="item in luruSupRadio" :key="item.type" :label="item.name">{{item.name}}</el-checkbox>
            </el-checkbox-group>
            <span class="athor">备注(若选择其他服务，请填写备注)</span>
            <el-input v-model="form1.needsDescr" type="textarea" :rows="2" placeholder="备注(若选择其他，请填写备注)" v-if="changeAnthor" @blur="blurAnthor"></el-input>
          </div>
        </div>
        <div class="input-wrapper">
          <div class="label-title">其他说明</div>
          <el-input v-model="form1.descr" type="textarea" :rows="5" placeholder="请输入其他说明"></el-input>
        </div>
        <div class="input-wrapper">
          <div class="label-title"><span class="font-red">*</span>上传附件</div>
          <el-upload class="upload-demo" action="#" :http-request="handleHttpUpolad" :on-success="uploadImgSuccess" :on-remove="handleRemove"
          :on-error="uploadImgError" :on-exceed="changeExceed" 
          :file-list="imgList"  :limit="5" >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </div>
          <el-button type="primary" @click="editDataClear">取消</el-button>
          <el-button type="primary" @click="submitForm1()">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {screenHeight,formatDate} from "../../utils/util"
import json from "../../utils/city_code.json"
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
      startEndTate:[],
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

      dialogPublishShow:false,
      curId:'',
      statusList:[
        {
          type:1,
          name:"审核通过"
        },
        {
          type:0,
          name:"审核不通过"
        }
      ],
      form:{
        checkStatus:1, // 是否置顶
        checkDesc:'', // 网页链接
      },

      dialogVisibleDeleteShow:false,
      dialogVisibleAddOrEditShow:false,
      addOrEditPoint:0,
      options:json,
      contectTelList:[
        {
          name:'',
          tel:'',
        }
      ],
      materialDetails1:[], // 服务提供类型
      materialDetails:[],
      changeAnthor:0, //选择其他服务时展示备注
      changeAnthorDesc:0, // 备注中信息是否填写
      telindex:0,
      type:1, // 类型
      imgList:[] , //图片列表
      curImgList:[],
      form1:{
        materialType:3,
        name:'', // 机构名称
        provinceAndCity:'', // 省市
        province:'', // 省
        city:'', // 市
        address:'', // 详细地址
        serviceRange:'', // 服务覆盖范围
        startTime:'', // 起始时间
        endTime:'', // 结束时间
        type:'', // 类型
        linkUrl:'', // 链接
        materialDetails1:[], // 服务提供类型
        materialDetails:[],
        needsDescr:'', // 其他服务说明备注
        contectTelList:[],
        descr:'', // 其他说明
        picUrl:'', // 图片地址
        imgList:[] , //图片列表
      },
      luruTypeRadio:[ //录入类型单选数据
        {
          type:1,
          name:"民间组织"
        },{
          type:2,
          name:"志愿者团队"
        },{
          type:3,
          name:"企业"
        }
      ], 
      luruSupRadio:[ //录入物资对接情况单选数据
        {
          type:1,
          name:"医疗救助"
        },{
          type:2,
          name:"心理干预"
        },{
          type:3,
          name:"物资发放"
        },{
          type:4,
          name:"疫情排查"
        },{
          type:5,
          name:"宣传倡导"
        },{
          type:6,
          name:"社区服务"
        },{
          type:7,
          name:"其他服务"
        },
      ], 
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
    blurAnthor(){
      if (this.form1.needsDescr){
        this.changeAnthor=0
        this.changeAnthorDesc=1

      } else {
        this.changeAnthor=1
        this.changeAnthorDesc=0
      }

    },
    changeStatus(value){
      this.materialDetails=[]
      let obj={}
      if (value.length){
        let x=value.indexOf('其他服务')

        value.forEach(item => {
          if (x!=-1){
            this.changeAnthor=1
          } else {
            this.changeAnthor=0
            this.form1.needsDescr=''
          }
          obj={
            needsName:item,
            needsNum:'',
          }
          this.materialDetails.push(obj)
  
        })
        console.log(this.materialDetails)
      } else {
        this.changeAnthor=0
      }
    },
    addTel(){
      this.telindex++
      this.contectTelList.push({
        name:'',
        tel:'',
      })
    },
    deleteTel(index){
      this.contectTelList.splice(index,1)
      this.telindex--
    },
	  uploadImgSuccess(response, file, fileList) {
     // 缓存接口调用所需的文件路径
      this.imgList=fileList
      if (this.imgList&&this.imgList.length>0){
        this.imgList.forEach(item => {
          this.curImgList.push(item.response)
        })
        this.form1.picUrl=this.curImgList.join(",")
      } else {
          this.curImgList=[]
        this.form1.picUrl=""

      }
    //  console.log(this.imgList,"上传")
      this.$message({
        message: "上传成功",
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
	  handleRemove(file, fileList) {
     // 更新缓存文件
      this.imgList=fileList
      if (this.imgList&&this.imgList.length>0){
        this.imgList.forEach(item => {
          this.curImgList.push(item.response)
        })
        this.form1.picUrl=this.curImgList.join(",")
      } else {
          this.curImgList=[]
          this.form1.picUrl=""
      }
    //  console.log(this.imgList,"删除")
      this.$message({
        message: "删除成功",
        type: 'success'
      });
	  },
    handleHttpUpolad(file){
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
    },
    changeExceed(files, fileList){
      this.$message.error("当前限制只可上传5个文件，重传文件前，请先删除旧文件")
    },
    handleChange(value){
      this.form1.province=value[0]
      this.form1.city=value[1]
    },
    add(){
      this.addOrEditPoint=0
      this.dialogVisibleAddOrEditShow=true

      this.form1={
        materialType:3,
        name:'', // 机构名称startTime
        provinceAndCity:'', // 省市
        province:'', // 省
        city:'', // 市
        address:'', // 详细地址
        serviceRange:'', // 服务覆盖范围
        startTime:'', // 起始时间
        endTime:'', // 结束时间
        type:'', // 类型
        linkUrl:'', // 链接
        materialDetails1:[], // 服务提供类型
        materialDetails:[],
        needsDescr:'', // 其他服务说明备注
        contectTelList:[],
        descr:'', // 其他说明
        picUrl:'', // 图片地址
        imgList:[] , //图片列表
      },
      this.contectTelList=[
        {
          name:'',
          tel:'',
        }
      ]
      
      this.materialDetails1=[] // 服务提供类型
      this.materialDetails=[]
      this.changeAnthor=0
      this.changeAnthorDesc=0
      this.telindex=0
      this.type=1 // 类型
      this.imgList=[]  //图片列表
      this.curImgList=[]
    },

    jsonFormat (dataset) {
      const data = dataset
      let datajson = {}
      var jsonresult = []
      for (let i = 0; i < data.length; i++) {
        datajson.name=data[i][0]
        datajson.tel=data[i][1]
        jsonresult.push(datajson)
        datajson = {}
      }
      return jsonresult
    },
    editRow(row){

      console.log(row)
      this.addOrEditPoint=1
      this.dialogVisibleAddOrEditShow=true
      this.curId=row.id
      this.form1={
        materialType:3,
        name:row.name, // 机构名称
        provinceAndCity:[row.province,row.city], // 省市
        province:row.province, // 省
        city:row.city, // 市
        address:row.address, // 详细地址
        serviceRange:row.serviceRange, // 服务覆盖范围
        startTime:row.startTime, // 起始时间
        endTime:row.endTime, // 结束时间
        type:'', // 类型
        linkUrl:row.linkUrl, // 链接
        materialDetails1:[], // 服务提供类型
        materialDetails:[],
        needsDescr:row.needsDescr, // 其他服务说明备注
        contectTelList:[],
        descr:row.descr, // 其他说明
        picUrl:'', // 图片地址
        imgList:[] , //图片列表
      }
      
      if (row.linkPeople){
        row.contectTelList1=row.linkPeople.split(",")
        let obj={}
        let x=row.contectTelList1
        for(let i=0;i<x.length;i++){
          x[i]=x[i].split("-")
        }

        this.contectTelList=this.jsonFormat(x)
        this.telindex=this.contectTelList.length-1
      }
      if (row.materialDetails) {
        row.materialDetails.forEach(item=> {


          this.materialDetails1.push(item.needsName) //需求表
        })
      }
      
      this.type=row.type// 类型
      
      if (row.picUrl) {
        let x=row.picUrl.split(",")
        let obj={}
        x.forEach(item=> {
          obj={
            url: item,
            name:item, 
            response:item, 
            status: 'finished'
          }
          this.imgList.push(obj)
        })
        this.imgListOld=this.imgList
      } else {
        this.imgList=[]
      }
      // this.imgList=[]  //图片列表
      this.curImgList=[]
    },
    //地址解析
    addresschange(address){
      var geocoder = new AMap.Geocoder();
      geocoder.getLocation(address, (status, result)=> {
          if (status === 'complete'&&result.geocodes.length) {
          
            let lnglat = result.geocodes[0].location
            //  return lnglat
            this.form1.longitude=lnglat.lng
            this.form1.latitude=lnglat.lat
            let newImgList=[]
            this.imgList.forEach(item => {
              newImgList.push(item.response)
              this.form1.picUrl=newImgList.join(",")
            })
            let linkPeopleArr=[]
            this.contectTelList.forEach(v=> {
              if (v.tel||v.name&&v.tel){
                linkPeopleArr.push(v.name+":"+v.tel)
              }
              this.form1.linkPeople=linkPeopleArr.join(',')
            })
            this.form1.materialDetails=this.materialDetails
            

            this.form1.type=this.type
            this.form1.contectTelList=this.contectTelList
            console.log(this.form1)
            
            if (this.addOrEditPoint==0){
              this.$fetchPost("material/insert",this.form1,"json").then(res => {
                this.$message({
                  message: res.message,
                  type: 'success'
                });
                if (res.result==1){
                  this.dialogVisibleAddOrEditShow=false
                  this.regetList()
                }
              })
            }else if (this.addOrEditPoint==1){
              this.form1.id=this.curId
              this.$fetchPost("material/update",this.form1,"json").then(res => {
                this.$message({
                  message: res.message,
                  type: 'success'
                });
                if (res.result==1){
                  this.dialogVisibleAddOrEditShow=false
                  this.regetList()
                }
              })
            } 
            
          }else{
              // log.error('根据地址查询位置失败');
          }
      });
    },
    submitForm1(){
      if (this.form1.name==''||this.form1.provinceAndCity==''||this.form1.address==''||this.form1.serviceRange==""||this.form1.startTime==''||this.form1.endTime==""||this.materialDetails1.length==0||this.imgList.length==0){
        this.$message.error( "请输入完整信息");
      } else if(this.changeAnthor&&!this.changeAnthorDesc) {
        this.$message.error( "选择服务类型中其他服务时请输入备注");
      } else {
        
        
      if (this.form1.needsDescr){
        this.changeAnthor=1
        this.changeAnthorDesc=1

      } else {
        this.changeAnthor=0
        this.changeAnthorDesc=0
      }
        this.addresschange(this.form1.province+this.form1.city+this.form1.address)
      }
    },
    clickPublish(row){
      this.dialogPublishShow=true
      this.curId=row.id
    },
    submitForm(form){
      this.form.id=this.curId
      this.$fetchPost("material/publish",this.form).then(res => {
        this.$message({
          message: res.message,
          type: 'success'
        });
        if (res.result==1){
          this.dialogPublishShow=false
          this.regetList()
        }
      })
    },
    // 编辑点击取消时数据清空
    editDataClear(){
      this.dialogVisibleAddOrEditShow=false
      this.form1={
        materialType:3,
        name:'', // 机构名称
        provinceAndCity:'', // 省市
        province:'', // 省
        city:'', // 市
        address:'', // 详细地址
        serviceRange:'', // 服务覆盖范围
        startTime:'', // 起始时间
        endTime:'', // 结束时间
        type:'', // 类型
        linkUrl:'', // 链接
        materialDetails1:[], // 服务提供类型
        materialDetails:[],
        needsDescr:'', // 其他服务说明备注
        contectTelList:[],
        descr:'', // 其他说明
        picUrl:'', // 图片地址
        imgList:[] , //图片列表
      },
      this.contectTelList=[
        {
          name:'',
          tel:'',
        }
      ]
      
      this.materialDetails1=[] // 服务提供类型
      this.materialDetails=[]
      this.changeAnthor=0
      this.changeAnthorDesc=0
      this.telindex=0
      this.type=1 // 类型
      this.imgList=[]  //图片列表
      this.curImgList=[]
    },
    // 操作完成获取数据
    regetList(){
      this.pageshow = false
      this.page=1
      this.tableData=[]
      this.params={
        materialType:3,
        page:this.page,
        pageSize:this.pageSize
      }
      this.getTableData(this.params)
      this.$nextTick(() => {
          this.pageshow = true
      })

      this.form={
        checkStatus:1, // 是否置顶
        checkDesc:'', // 网页链接
      },
      this.form1={
        materialType:3,
        name:'', // 机构名称
        provinceAndCity:'', // 省市
        province:'', // 省
        city:'', // 市
        address:'', // 详细地址
        serviceRange:'', // 服务覆盖范围
        startTime:'', // 起始时间
        endTime:'', // 结束时间
        type:'', // 类型
        linkUrl:'', // 链接
        contectTelList:[],
        descr:'', // 其他说明
        picUrl:'', // 图片地址
        imgList:[] , //图片列表
      },
      this.telindex=0
      this.changeAnthor=0
      this.changeAnthorDesc=0
      this.type=1 // 类型
      this.imgList=[]  //图片列表
      this.curImgList=[]


    },
    deleteRow(row){
      this.curId=row.id
      this.dialogVisibleDeleteShow=true
    },
    delectCom(){
      this.$fetchPost("material/shield",{id:this.curId}).then(res => {
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
    getNeedsNameList(){
      this.$fetchGet("material/getNeedsName",{
        materialType:3
      }).then(res => {
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
        needName:this.goodsName,
        // status:this.acceptInfo,
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
      this.$fetchGet("material/getMaterial",params).then(res => {
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
              if (item.startTime){
                item.startTime=formatDate(item.startTime)
              }
              if (item.endTime){
                item.endTime=formatDate(item.endTime)
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
      this.gridData=row.materialDetails
    },
    goUrl(item){
      window.open(item)
    },
    clickLookBiao(row){

    }

  }
	
}
</script>

<style lang="scss">
@import '../../assets/css/common.scss';
.minjian-orig{
  .input-wrapper{
    display:flex;
    justify-content:flex-start;
    align-items:center;
    padding:10px 0;
    .label-title{
      display:flex;
      justify-content: flex-start;
      align-items: center;
      width:200px;
      padding-right:10px;
    }
    .font-red{
      color:red;
    }
    
    .comfirm-need-input-wrapper{
      background:#fff;
      border-radius: 5px;
      font-size:15px;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
      .comfirm-need-top{
        .name{
          display: flex;
          justify-content: center;
          align-items:center;
          width: 300px;
          border-right: 1px solid #F1F2F5;
        }
        .num{
          display: flex;
          justify-content: center;
          align-items:center;
          width: 200px;
        }
        &.comfirm-need-top-tel{
          .name{
            display: flex;
            justify-content: center;
            align-items:center;
            width: 300px;
            border-right: 1px solid #F1F2F5;
          }
          .num{
            display: flex;
            justify-content: center;
            align-items:center;
            width: 200px;
          }

        }
        .comfirm-need-head{
          display: flex;
          justify-content: flex-start;
          height: 40px;
          background:#E5EAF2;
          border-top-left-radius:5px;
          border-top-right-radius:5px;
          border-bottom: 1px solid #F1F2F5;
          .name{}
          .num{}
        }
        .comfirm-need-body{
          display: flex;
          justify-content: flex-start;
          border-bottom: 1px solid #F1F2F5;
          .name{
            .sup-name{}
          }
          .num {
            display: flex;
            justify-content: center;
            align-items:center;
            .sup-num,.sup-name {
              text-align:center;
            }
            img{
              width:30px;
              height: 30px;
              padding-right: 5px;
            }
          }
          
        }
      }
      .comfirm-need-bottom{
        height: 30px;
        display: flex;
        justify-content:center;
        align-items:center;
        font-size:15px;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(102,102,102,1);
        img{
          width: 30px;
          height: 30px;
          margin-right:5px;
        }
      }
    }
  }
  
}

</style>
