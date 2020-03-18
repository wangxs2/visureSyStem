<template>
  <div class="xu">
    <div class="cur-menu-name">
        <span>录入信息维护/需方</span>
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
        <div class="search-input">
          <span>接受捐赠/采购情况:</span>
          <el-select v-model="acceptInfo" placeholder="请选择" clearable>
            <el-option
              v-for="item in acceptInfoList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search-input search-btn" @click="search">搜索</div>
        <div class="search-input search-btn" @click="handlderive">导出</div>
        <!-- <div class="search-input search-btn" @click="add">新增</div> -->

      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" :height="curHeight" ref="table" style="width: 100%">
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
          <el-table-column prop="country" label="国家"></el-table-column>
          <el-table-column prop="province" label="省"></el-table-column>
          <el-table-column prop="city" label="市"></el-table-column>
          <el-table-column prop="longitude" label="经度"></el-table-column>
          <el-table-column prop="latitude" label="纬度"></el-table-column>
          <el-table-column prop="address" label="详细地址"></el-table-column>
          <el-table-column prop="status" label="物资对接情况">
            <template slot-scope="scope">
              <div v-if="scope.row.status==1">接受个人捐赠</div>
              <div v-if="scope.row.status==2">接受企业捐赠</div>
              <div v-if="scope.row.status==3">接受采购</div>
              <div v-if="scope.row.status=='1,2'">接受个人捐赠,接受企业捐赠</div>
              <div v-if="scope.row.status=='2,1'">接受企业捐赠,接受个人捐赠</div>
              <div v-if="scope.row.status=='1,3'">接受个人捐赠,接受采购</div>
              <div v-if="scope.row.status=='3,1'">接受采购,接受个人捐赠</div>
              <div v-if="scope.row.status=='2,3'">接受企业捐赠,接受采购</div>
              <div v-if="scope.row.status=='3,2'">接受采购,接受企业捐赠</div>
              <div v-if="scope.row.status=='1,2,3'">接受个人捐赠,接受企业捐赠,接受采购</div>
              <div v-if="scope.row.status=='1,3,2'">接受个人捐赠,接受采购,接受企业捐赠</div>
              <div v-if="scope.row.status=='2,1,3'">接受企业捐赠,接受个人捐赠,接受采购</div>
              <div v-if="scope.row.status=='2,3,1'">接受企业捐赠,接受采购,接受个人捐赠</div>
              <div v-if="scope.row.status=='3,1,2'">接受采购,接受个人捐赠,接受企业捐赠</div>
              <div v-if="scope.row.status=='3,2,1'">接受采购,接受企业捐赠,接受个人捐赠</div>
              <!-- <div v-if="scope.row.status==4">捐赠</div>
              <div v-if="scope.row.status==5">采购</div> -->
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="需求发布时间"></el-table-column>
          <el-table-column prop="source" label="需求来源">
            <template slot-scope="scope">
              <div v-if="scope.row.source==1">政府发布</div>
              <div v-else-if="scope.row.source==2">医院官方渠道</div>
              <div v-else-if="scope.row.source==3">公益平台</div>
              <div v-else-if="scope.row.source==4">微信公众号</div>
              <div v-else-if="scope.row.source==5">其他</div>
            </template>
          </el-table-column>
          <el-table-column prop="linkPeople" label="联系人">
            <template slot-scope="scope">
              <div v-for="(item,i) in scope.row.linkPeopleList" :key="i" style="padding:5px;" class="font-left">{{item}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="attachment" label="图片链接" >
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
          <el-table-column prop="name" label="查看或操作" fixed="right" width="160">
            <template slot-scope="scope">
              <el-button @click="editLonLatRow(scope.row)" type="text" size="small">修改经纬度</el-button>
              <el-button @click="clickLookGoods(scope.row)" type="text" size="small">查看所需物资</el-button>
              <el-button @click="clickPublish(scope.row)" type="text" size="small" v-if="scope.row.isValid==0||scope.row.isValid==3">审核</el-button>
              <!-- <el-button @click="editRow(JSON.parse(JSON.stringify(scope.row)))" type="text" size="small">编辑</el-button> -->
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
    <!-- 修改经纬度 -->
    <el-dialog title="修改经纬度" :visible.sync="dialogVisibleLonLatShow" width="30%" center>
      <el-form :model="lonLatForm" :rules="lonLatRules" ref="lonLatForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="经度" prop="lon">
          <el-input v-model="lonLatForm.lon" placeholder="请输入经度"></el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="lat">
          <el-input v-model="lonLatForm.lat" placeholder="请输入纬度"></el-input>
        </el-form-item>
        <el-form-item label="经纬度类型" prop="type">
          <el-radio-group v-model="lonLatForm.type">
            <el-radio v-for="item in lonlatType" :key="item.type" :label="item.type">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <div style="margin-left:30px;margin-bottom:10px;color:#F56C6C">提交经纬度后会自动转换为84经纬度</div>
        <el-form-item>
          <el-button type="primary" @click="submitForm2('lonLatForm')">提交</el-button>
          <el-button type="primary" @click="dialogVisibleLonLatShow=false">取消</el-button>
        </el-form-item>
      </el-form>
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
          <div class="label-title"><span class="font-red">*</span>类型</div>
          <el-radio-group v-model="type">
            <el-radio v-for="item in luruTypeRadio" :key="item.type" :label="item.type">{{item.name}}</el-radio>
          </el-radio-group>
        </div>
        <div class="input-wrapper">
          <div class="label-title"><span class="font-red">*</span>物资对接情况</div>
          <el-checkbox-group v-model="status" @change="changeStatus">
            <el-checkbox v-for="item in luruSupRadio" :key="item.type" :label="item.type">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="input-wrapper">
          <div class="label-title"><span class="font-red">*</span>需求表</div>
          <div class="comfirm-need-input-wrapper">
            <div class="comfirm-need-top">
              <div class="comfirm-need-head">
                <div class="name">物资名称</div>
                <div class="num">需求数量</div>
              </div>
              <div class="comfirm-need-body" v-for="(iteam,index) in materialDetails" :key="index">
                <div class="name" v-if="curNeedName">
                  <el-select v-model="iteam.needsName" placeholder="请选择" @change="changeNeedName">
                    <el-option v-for="item in needList" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </div>
                <div class="name" v-else>
                  <el-input v-model="iteam.needsName" placeholder="请输入需求名称" size="samll"></el-input>
                </div>
                <div class="num">
                  <el-input v-model="iteam.needsNum" placeholder="请输入需求数量" size="samll"></el-input>
                  <img @click="deleteDemand(index)" style="" src="../../assets/images/reduce1.png" alt="">
                </div>
              </div>
            </div>
            <div class="comfirm-need-bottom" @click="addDemand"><img style="" src="../../assets/images/add1.png" alt="" >添加</div>
          </div>
          <!-- <span class="desc need-table-desc">数量填写可便于物资调配，如不确定数量可不填写</span> -->
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
                  <el-input class="tel" v-model="iteam.tel" type="text" placeholder="输入电话号码(建议手机)" @blur="linkTelBlur(iteam.tel,index)"></el-input>
                  <img @click="deleteTel(index)" style="" src="../../assets/images/reduce1.png" alt="">
                </div>
              </div>
            </div>
            <div class="comfirm-need-bottom" @click="addTel"><img style="" src="../../assets/images/add1.png" alt="" >添加</div>
          </div>
        </div>
        <div class="input-wrapper">
          <div class="label-title"><span class="font-red">*</span>需求发布时间</div>
          <el-date-picker v-model="form1.createTime" type="date" placeholder="选择发布时间" 
          value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
        <div class="input-wrapper">
          <div class="label-title"><span class="font-red">*</span>需求来源</div>
          <el-radio-group v-model="source">
            <el-radio v-for="item in luruSourceRadio" :key="item.type" :label="item.type">{{item.name}}</el-radio>
          </el-radio-group>
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
import {screenHeight,formatDate,curDataTime} from "../../utils/util"
import json from "../../utils/city_code.json"
export default {
  name: 'xu',
  components: {
  },
  data () {
    return {
      curHeight:null,
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
      tableDataExecl:[],
      tableExecl:0,
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
      materialDetails:[
        {
          needsName:'',
          needsNum:'',
        }
      ],//需求表
      telindex:0,
      testindex:0,
      curNeedName:1,
      source:1, // 需求来源 
      type:4, // 类型
      status:[], // 物资对接情况
      imgList:[] , //图片列表
      curImgList:[],
      form1:{
        materialType:1,
        name:'', // 机构名称
        provinceAndCity:'', // 省市
        province:'', // 省
        city:'', // 市
        address:'', // 详细地址
        type:'', // 类型
        status:'', // 物资对接情况
        materialDetails:[],//需求表
        contectTelList:[],
        createTime:'', // 发布时间
        source:'', // 需求来源 
        descr:'', // 其他说明
        picUrl:'', // 图片地址
        imgList:[] , //图片列表
      },
      luruTypeRadio:[ //录入类型单选数据
        {
          type:4,
          name:"定点医院"
        },{
          type:5,
          name:"发热门诊"
        },{
          type:6,
          name:"防控指挥部"
        },{
          type:7,
          name:"普通医院"
        },{
          type:0,
          name:"其他抗疫单位"
        },
      ], 
      luruSupRadio:[ //录入物资对接情况单选数据
        {
          type:1,
          name:"接受个人捐赠"
        },{
          type:2,
          name:"接受企业捐赠"
        },{
          type:3,
          name:"接受采购"
        },
      ], 
      luruSourceRadio:[ //录入需求来源单选数据
        {
          type:1,
          name:"政府发布"
        },{
          type:2,
          name:"医院官方渠道"
        },{
          type:3,
          name:"公益平台"
        },{
          type:4,
          name:"微信公众号"
        },{
          type:5,
          name:"其他"
        },
      ],
      needList:["N95口罩","外科口罩","一次性医用口罩","隔离衣","一次性手术衣","医用帽","护目镜","防护眼罩","防护面罩","医用手套","防污染鞋套","长筒防护靴","测温仪","84消毒液","75%浓度酒精","一次性消毒床罩","消毒设备","对口药品","负压担架","负压救护车","消洗设备","全面型呼吸防护器","其他"],
      dialogVisibleLonLatShow:false,
      lonlatType:[
        {
          type:3,
          name:'84经纬度'
        },{
          type:1,
          name:'高德经纬度'
        },{
          type:2,
          name:'百度经纬度'
        }
      ],
      lonLatForm:{
        lon:'', // 经度
        lat:'', // 纬度
        type:3, // 经纬度类型  1 高德，2 百度, 3 84
      },
      lonLatRules:{
        lon: [
          { required: true, message: '请填写经度', trigger: 'blur' }
        ],
        lat: [
          { required: true, message: '请填写纬度', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择经纬度类型', trigger: 'change' }
        ],
      }
    }
  },
  mounted () {
    // this.curHeight=screenHeight()
    this.curHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 80;
    this.searchDataSession()

  },
  created () {
    // this.params={
    //   materialType:1,
    //   page:this.page,
    //   pageSize:this.pageSize
    // }
    // this.getTableData(this.params)
    this.getNeedsNameList()
  },
  methods: {
    editLonLatRow(row){
      this.curId=row.id
      this.lonLatForm.lon=row.longitude
      this.lonLatForm.lat=row.latitude
      this.lonLatForm.type=3
      this.dialogVisibleLonLatShow=true
    },
    submitForm2(form){
      this.lonLatForm.materialId=this.curId
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$fetchPost("material/updateLngLat",this.lonLatForm).then(res => {
            this.$message({
              message: res.message,
              type: 'success'
            });
            if (res.result==1){
              this.dialogVisibleLonLatShow=false
              this.regetList()
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    getTableDataExecal(params){
      this.$fetchGet("material/getMaterial",params).then(res => {
          // this.total=res.data.total
          // console.log(res)
          this.tableDataExecl=res.data.list
          if (this.tableDataExecl&&this.tableDataExecl.length>0){
            this.tableDataExecl.forEach(item => {
              if (item.linkPeople){
                item.linkPeople=item.linkPeople.replace(/:/g, "-")
                item.linkPeopleList=item.linkPeople.split(',')
                item.linkPeopleList.forEach(items => {
                  // items=items.split(":").join("-")
                  // console.log(items)

                })
                item.linkPeopleList=item.linkPeopleList
              }
              if (item.createTime){
                item.createTime=formatDate(item.createTime)
              }
              
            })
          }



          
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = [ '机构名称','类型','国家','省', '市', '经度', '纬度', '详细地址', '物资对接情况', '需求发布时间', '需求来源', '联系人','图片链接', '物资详情','备注','审核状态','审核意见','发布状态']
            const filterVal = ['name','materialType','country',"province", 'city', 'longitude', 'latitude', 'address', 'status', 'createTime', 'source', 'linkPeople','attachment', 'detail','descr','isValid','checkDescr','hasShow']
            const data = this.formatJson(filterVal, this.tableDataExecl)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: curDataTime()+"导出记录",
              autoWidth: true,
              // filename: this.filename
            })
          })
      })

    },
    handlderive() {
      this.tableExecl=1
      let searchData1 = JSON.parse(sessionStorage.getItem("searchData1"))

      if (searchData1){
        let x=searchData1
        this.goodsName=searchData1.needName
        this.acceptInfo=searchData1.status
        if (searchData1.startDate&&searchData1.endDate){

          this.startEndTate=[searchData1.startDate,searchData1.endDate]
        }
        this.getTableDataExecal(x)
      } else {
        let x={
          materialType:1,
        }
        this.getTableDataExecal(x)
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'materialType') {
            if (v[j]==1){
              v[j]="需求方"
            } else if(v[j]==2){
              v[j]="提供方"
            } else if(v[j]==3){
              v[j]="民间组织"
            }
            return v[j]
          }
          if (j === 'status') {
            if (v[j]==1){
              v[j]="接受个人捐赠"
            } else if(v[j]==2){
              v[j]="接受企业捐赠"
            } else if(v[j]==3){
              v[j]="接受采购"
            } else if(v[j]=='1,2'){
              v[j]="接受个人捐赠,接受企业捐赠"
            } else if(v[j]=='2,1'){
              v[j]="接受企业捐赠,接受个人捐赠"
            } else if(v[j]=='1,3'){
              v[j]="接受个人捐赠,接受采购"
            } else if(v[j]=='3,1'){
              v[j]="接受采购,接受个人捐赠"
            } else if(v[j]=='2,3'){
              v[j]="接受企业捐赠,接受采购"
            } else if(v[j]=='3,2'){
              v[j]="接受采购,接受企业捐赠"
            } else if(v[j]=='1,2,3'){
              v[j]="接受个人捐赠,接受企业捐赠,接受采购"
            } else if(v[j]=='1,3,2'){
              v[j]="接受个人捐赠,接受采购,接受企业捐赠"
            } else if(v[j]=='2,1,3'){
              v[j]="接受企业捐赠,接受个人捐赠,接受采购"
            } else if(v[j]=='2,3,1'){
              v[j]="接受企业捐赠,接受采购,接受个人捐赠"
            } else if(v[j]=='3,1,2'){
              v[j]="接受采购,接受个人捐赠,接受企业捐赠"
            } else if(v[j]=='3,2,1'){
              v[j]="接受采购,接受企业捐赠,接受个人捐赠"
            }
            return v[j]
          }
          if (j === 'source') {
            if(v[j]==1){
              v[j]="政府发布"
            } else if(v[j]==2){
              v[j]="医院官方渠道"
            } else if(v[j]==3){
              v[j]="公益平台"
            } else if(v[j]==4){
              v[j]="微信公众号"
            } else if(v[j]==5){
              v[j]="其他"
            }
            return v[j]
          }
          if (j === 'attachment'){
            if (v[j]&&v[j].length){
              v[j]=v[j].join(",")
            }
            return v[j]

          }
          if (j === 'isValid') {
            if (v[j]==0){
              v[j]="未审核"
            } else if(v[j]==1){
              v[j]="审核通过"
            } else if(v[j]==2){
              v[j]="审核不通过"
            } else if(v[j]==3){
              v[j]="后台录入"
            }
            return v[j]
          }
          if (j === 'hasShow') {
            if (v[j]==0){
              v[j]="未发布"
            } else if(v[j]==1){
              v[j]="已发布"
            }
            return v[j]
          }
          // if (j === 'createTime') {
          //   if (v[j]){
          //     v[j]=v[j].substring(0,10)
          //   }
          //   return v[j]
          // }
          return v[j]
            
        })
      )
    },
    // 存储查询条件获取
    searchDataSession(){
      let searchData = JSON.parse(sessionStorage.getItem("searchData"))

      if (searchData){
        this.params=searchData
        this.goodsName=searchData.needName
        this.acceptInfo=searchData.status
        if (searchData.startDate&&searchData.endDate){

          this.startEndTate=[searchData.startDate,searchData.endDate]
        }
        this.getTableData(this.params)
      } else {
        this.params={
          materialType:1,
          page:this.page,
          pageSize:this.pageSize
        }
        this.getTableData(this.params)
      }


    },
    changeStatus(value){
      this.form1.status=value.join(",")
    },
    changeNeedName(value){
      // console.log(value)
      if (value=="其他"){
        this.curNeedName=0
        this.materialDetails[this.testindex].needsName=''
      } else {
        this.curNeedName=1
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
    //添加需求表
    addDemand(){
      this.curNeedName=1
      let x=this.materialDetails.some(item =>{
          return item.needsName == ""
      })
      if(x||this.materialDetails[this.testindex].needsName==''){
        this.$message.error( "请完善信息(至少输入物资名称)");
      }else{
        this.testindex++
        this.materialDetails.push({
          needsName:'',
          needsNum:'',
        })
      }
    },
    //删除需求表
    deleteDemand(index){
      if(this.testindex<1){
        this.materialDetails[index].needsName=''
        this.materialDetails[index].needsNum=''
        this.$message.error( "至少添加一条需求");
      }else{
        this.materialDetails.splice(index,1)
        this.testindex--
      }
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
        materialType:1,
        name:'', // 机构名称
        provinceAndCity:'', // 省市
        province:'', // 省
        city:'', // 市
        address:'', // 详细地址
        type:'', // 类型
        status:'', // 物资对接情况
        materialDetails:[],//需求表
        contectTelList:[],
        createTime:'', // 发布时间
        source:'', // 需求来源 
        descr:'', // 其他说明
        picUrl:'', // 图片地址
        imgList:[] , //图片列表
      },
      this.materialDetails=[
        {
          needsName:'',
          needsNum:'',
        }
      ]
      this.contectTelList=[
        {
          name:'',
          tel:'',
        }
      ]
      this.telindex=0
      this.testindex=0
      this.curNeedName=1
      this.source=1 // 需求来源 
      this.type=4 // 类型
      this.status=[] // 物资对接情况
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

      this.addOrEditPoint=1
      this.dialogVisibleAddOrEditShow=true
      this.curId=row.id
      this.form1={
        materialType:1,
        name:row.name, // 机构名称
        provinceAndCity:[row.province,row.city], // 省市
        province:row.province, // 省
        city:row.city, // 市
        address:row.address, // 详细地址
        type:'', // 类型
        status:'', // 物资对接情况
        materialDetails:[],//需求表
        contectTelList:[],
        createTime:row.createTime, // 发布时间
        source:'', // 需求来源 
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
        this.testindex=row.materialDetails.length-1
        this.materialDetails=row.materialDetails //需求表
      }
      this.curNeedName=1
      this.source=row.source // 需求来源 
      this.type=row.type// 类型
      if (row.status){
        let x=row.status.split(",")
        this.status=x.map(Number) // 物资对接情况
        this.form1.status =  this.status.join(",")
      }
      
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
            
            this.form1.type=this.type
            this.form1.materialDetails=this.materialDetails
            this.form1.contectTelList=this.contectTelList
            this.form1.source=this.source
            
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
      if (this.form1.name==''||this.form1.provinceAndCity==''||this.form1.address==''||this.status.length==0||this.materialDetails.length==0||this.form1.createTime==''||this.imgList.length==0){
        this.$message.error( "请输入完整信息");
      } else {
        this.addresschange(this.form1.province+this.form1.city+this.form1.address)
      }
    },
    
    linkTelBlur(tel,index){
      var strTel=/^[\d\-]+$/g
        if (!strTel.test(tel)){
          this.contectTelList[index].tel=''
          this.$message.error('当前填写电话格式有误')
        }
    },
    clickPublish(row){
      this.dialogPublishShow=true
      this.curId=row.id
    },
    submitForm(){
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
        materialType:1,
        name:'', // 机构名称
        provinceAndCity:'', // 省市
        province:'', // 省
        city:'', // 市
        address:'', // 详细地址
        type:'', // 类型
        status:'', // 物资对接情况
        materialDetails:[],//需求表
        contectTelList:[],
        createTime:'', // 发布时间
        source:'', // 需求来源 
        descr:'', // 其他说明
        picUrl:'', // 图片地址
        imgList:[] , //图片列表
      },
      this.materialDetails=[
        {
          needsName:'',
          needsNum:'',
        }
      ]
      this.contectTelList=[
        {
          name:'',
          tel:'',
        }
      ]
      this.telindex=0
      this.testindex=0
      this.curNeedName=1
      this.source=1 // 需求来源 
      this.type=4 // 类型
      this.status=[] // 物资对接情况
      this.imgList=[]  //图片列表
      this.curImgList=[]
    },
    // 操作完成获取数据
    regetList(){
      this.pageshow = false
      this.page=1
      this.tableData=[]
      
      this.searchDataSession()
      // this.params={
      //   materialType:1,
      //   page:this.page,
      //   pageSize:this.pageSize
      // }
      // this.getTableData(this.params)
      this.$nextTick(() => {
          this.pageshow = true
      })

      this.form={
        checkStatus:1, // 是否置顶
        checkDesc:'', // 网页链接
      },
      this.form1={
        materialType:1,
        name:'', // 机构名称
        provinceAndCity:'', // 省市
        province:'', // 省
        city:'', // 市
        address:'', // 详细地址
        type:'', // 类型
        status:'', // 物资对接情况
        materialDetails:[],//需求表
        contectTelList:[],
        createTime:'', // 发布时间
        source:'', // 需求来源 
        descr:'', // 其他说明
        picUrl:'', // 图片地址
        imgList:[] , //图片列表
      },
      this.telindex=0
      this.testindex=0
      this.curNeedName=1
      this.source=1 // 需求来源 
      this.type=4 // 类型
      this.status=[] // 物资对接情况
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
        materialType:1
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
        materialType:1,
        needName:this.goodsName,
        status:this.acceptInfo,
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
      if (this.tableExecl=1){
        let x={
          materialType:1,
          needName:this.goodsName,
          status:this.acceptInfo,
        }
        if (this.startEndTate&&this.startEndTate.length>0){
          x.startDate=this.startEndTate[0]
          x.endDate=this.startEndTate[1]
        } else {
          x.startDate=''
          x.endDate=''
        }
        // this.getTableDataExecal(x)
        sessionStorage.setItem("searchData1",JSON.stringify(x))

      }
      sessionStorage.setItem("searchData",JSON.stringify(this.params))


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
              if (item.createTime){
                item.createTime=formatDate(item.createTime)
              }
              
            })
          }
      })
    },
    handleSizeChange(val) {
      this.pageSize=val
      this.params.pageSize=val
      this.getTableData(this.params)
    },
    handleCurrentChange(val) {
      this.page=val
      this.params.page=val
      this.getTableData(this.params)
    },
    clickLookGoods(row){
      // this.gridData=[]
      this.dialogTableVisible=true
      // this.$fetchGet('material/getMaterialDetail',{materialId:row.id}).then(res => {
      //   this.gridData=res.data
      // })
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
.xu{
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
