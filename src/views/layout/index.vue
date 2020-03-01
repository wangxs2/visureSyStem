<template>
  <div class="layout">
      <div class="layout-top">
          <div class="title">云逆行·新冠肺炎物资公益平台-后台数据维护系统</div>
          <div class="user-wrapper">
              <span>欢迎您</span>
              <span class="user">
                  <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                        {{userInfo.userName}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </span>
          </div>
      </div>
      <div class="layout-content">
        <div class="layout-left">
            <el-menu
                :default-active="defaultUrl"
                router
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                background-color="#31478F"
                unique-opened
                text-color="#fff"
                active-text-color="#fff">
                <el-submenu index="/hospitalInfo">
                    <template slot="title">
                        <img src="../../assets/images/icon_1.png"  alt="" />
                        <span>发布信息维护</span>
                    </template>
                    <el-menu-item-group title="">
                        <el-menu-item index="/hospitalInfo/xu"><img src="../../assets/images/icon_1_1.png"  alt="" />需方</el-menu-item>
                        <el-menu-item index="/hospitalInfo/gong"><img src="../../assets/images/icon_1_2.png"  alt="" />供方</el-menu-item>
                        <el-menu-item index="/hospitalInfo/minjianOrig"><img src="../../assets/images/icon_1_3.png"  alt="" />民间组织</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="/luruInfo">
                    <template slot="title">
                        <img src="../../assets/images/icon_1.png"  alt="" />
                        <span>录入信息维护</span>
                    </template>
                    <el-menu-item-group title="">
                        <el-menu-item index="/luruInfo/xu"><img src="../../assets/images/icon_1_1.png"  alt="" />需方</el-menu-item>
                        <el-menu-item index="/luruInfo/gong"><img src="../../assets/images/icon_1_2.png"  alt="" />供方</el-menu-item>
                        <el-menu-item index="/luruInfo/minjianOrig"><img src="../../assets/images/icon_1_3.png"  alt="" />民间组织</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="/curTimeInfo">
                    <template slot="title">
                        <img src="../../assets/images/icon_2.png"  alt="" />
                        <span>实时播报信息</span>
                    </template>
                    <el-menu-item-group title="">
                        <el-menu-item index="/curTimeInfo/curTime"><img src="../../assets/images/icon_2_1.png"  alt="" />实时播报</el-menu-item>
                        <el-menu-item index="/curTimeInfo/zizhuInfo"><img src="../../assets/images/icon_2_2.png"  alt="" />资助信息</el-menu-item>
                        <el-menu-item index="/curTimeInfo/qiugouInfo"><img src="../../assets/images/icon_2_3.png"  alt="" />求购信息</el-menu-item>
                        <el-menu-item index="/curTimeInfo/gongyingInfo"><img src="../../assets/images/icon_2_4.png"  alt="" />供应信息</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-menu-item index="/dataStatistic">
                    <img src="../../assets/images/icon_3.png"  alt="" />
                    <span slot="title">统计</span>
                </el-menu-item>
            </el-menu>
        </div>
        <div class="layout-right">
            <router-view></router-view>
        </div>
      </div>

  </div>
</template>

<script>
export default {
  name: 'home',
  components: {
  },
  data () {
    return {
        defaultUrl:'/luruInfo/xu',
        curMenuName:"录入信息维护/需方",
        curMenuList:[],
        userInfo:{}
    }
  },
  mounted () {
      if (sessionStorage.getItem('userInfo')){
          this.userInfo=JSON.parse(sessionStorage.getItem('userInfo'))

      }
      if(sessionStorage.getItem('curMenu')){

        this.defaultUrl= sessionStorage.getItem('curMenu')
      }
    //   this.$router.options.routes.forEach(item => {
    //       if (item.name=="layout"){
    //           this.curMenuList=item.children
    //       }
    //   })
    //   console.log(this.curMenuList)


  },
  created () {
  },
  watch:{
    $route(to,from){
    //   console.log(to.path)
      sessionStorage.setItem('curMenu',to.path)
    }
  },
  methods: {
      handleOpen(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        // console.log(key, keyPath);
      },
      logout(){
          this.$fetchGet('login/logout').then(res => {
              sessionStorage.clear()
              this.$router.push({path:"/login"})
          })
      },

  }
	
}
</script>

<style lang="scss">

.el-dropdown-menu__item{
    padding:20px!important;
}

.el-menu{
    width:220px;
    img{
        width:20px;
        height:20px;
        margin-right:18px;
    }
}
.el-submenu__title{
    padding-left:20px!important;
}
.el-menu-item{
    padding-left:20px!important;
}
.el-submenu .el-menu-item{
    padding-left:40px!important;
}
.el-menu-item.is-active{
    background:#4F84FD!important;
}
.el-menu-item-group__title{
    padding:0;
}
.layout{
    .layout-top{
        display:flex;
        justify-content:space-between;
        align-items:center;
        padding:0 20px;
        height:64px;
        background:#1A2F76;
        .title{
            font-size:22px;
            font-family:Microsoft YaHei;
            font-weight:400;
            color:rgba(255,255,255,1);
        }
        .user-wrapper{
            font-size:14px;
            font-family:Microsoft YaHei;
            font-weight:400;
            color:rgba(255,255,255,1);
            span{}
            .user{
                margin-left:20px;
                .el-dropdown{
                    color:#fff;
                }

            }
        }
    }
    .layout-content{
        .layout-left{
            position:absolute;
            top:64px;
            left:0;
            bottom:0;
            width:220px;
            background:#31478F;
        }
        .layout-right{
            margin-left:220px;
            background:#EDF0F4;
        }
    }
  
}

</style>
