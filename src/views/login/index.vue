<template>
  <div class="login">
    <div class="login-top">
      <div class="login-desc">
        <span>云逆行·新冠肺炎物资公益平台</span>
        <span>后台数据维护系统</span>
      </div>
    </div>
    <div class="login-main">
      <div class="login-content">
        <div class="login-title">欢迎登录</div>
        <div class="login-input">
          <el-input v-model="userName" placeholder="请输入用户名" class="searchClass"></el-input>
          <i class="iconfont el-icon-user"></i>
          <span v-if="userNameErr">请输入用户名</span>
        </div>
        <div class="login-input">
          <el-input v-model="pwd" placeholder="请输入密码" type="password" class="searchClass"></el-input>
          <i class="iconfont el-icon-view"></i>
          <span v-if="pwdErr">请输入密码</span>
        </div>
        <div class="login-btn" @keyup.enter="login" @click="login">登录</div>

      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'login',
  components: {
  },
  data () {
    return {
      userName:'',
      pwd:'',
      userNameErr:false,
      pwdErr:false,
    }
  },
  mounted () {
    sessionStorage.clear()
  },
  created () {
    var _self = this;
    document.onkeydown = function(e){
      if(window.event == undefined){
        var key = e.keyCode;
      }else{
        var key = window.event.keyCode;
      }
      if(key == 13){
        _self.login();
      }
    }
  },
  methods: {
    login(){
      if (!this.userName) {
        this.userNameErr=true
      } else {
        this.userNameErr=false
      }
      if (!this.pwd) {
        this.pwdErr=true
      } else {
        this.pwdErr=false
      }
      if (!this.pwdErr&&!this.userNameErr){
        let Base64 = require("js-base64").Base64
        this.$fetchPost('login',{
          username:this.userName,
          password:Base64.encode(this.pwd)
        }).then(res => {
          if (res.status=="success"){
			      document.onkeydown = undefined;
            this.$message({
              message: '登录成功',
              type: 'success'
            });
            sessionStorage.setItem('userInfo',JSON.stringify(res.info))
            this.$router.push({path:'/hospitalInfo/xu'})
          } else if(res.status=="fail"){
            this.$message({
              message: '请输入正确的用户名密码',
              type: 'error'
            });
          }
  
        })
      } else {
        this.$message({
          message: '请输入用户名密码',
          type: 'error'
        });
      }
    }

  }
	
}
</script>

<style lang="scss">
.login{
  width:100%;
  height:100%;
  background:#EDF0F4;
  .login-top{
    display:flex;
    justify-content:center;
    width:100%;
    height:280px;
    background:url("../../assets/images/login-bg.png") no-repeat;
    background-size:100% 280px;
    .login-desc{
      display:flex;
      flex-direction:column;
      // justify-content:center;
      align-items:center;
      margin-top:100px;
      span{
        font-size:48px;
        font-family:PingFangSC-Medium,PingFang SC;
        font-weight:500;
        color:rgba(255,255,255,1);
        &:last-child{
          font-size:30px;
          margin-top:15px;
        }
      }
    }
  }
  .login-main{
    display:flex;
    justify-content:center;
    margin-top:90px;
    .login-content{
      display:flex;
      flex-direction:column;
      // justify-content:center;
      align-items:center;
      width:490px;
      height:390px;
      background:rgba(255,255,255,1);
      .login-title{
        font-size:28px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(36,139,254,1);
        line-height:40px;
        margin:25px 0;
      }
      .login-input{
        position:relative;
        width:340px;
        height:40px;
        background:rgba(237,240,244,1);
        border-radius:20px;
        margin-top:25px;
        .el-input__inner{
          background:#EDF0F4;
          border-radius:20px;
        }
        .iconfont {
          position:absolute;
          top:12px;
          right:10px;
          color:#999;
        }
        span{
          position:absolute;
          top:5px;
          right:40px;
          color:red;
          font-size:14px;
        }
      }
      .login-btn{
        width:340px;
        height:40px;
        font-size:16px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height:40px;
        text-align:center;
        background:linear-gradient(90deg,rgba(72,149,246,1) 0%,rgba(78,94,246,1) 100%);
        box-shadow:0px 6px 10px 0px rgba(88,182,255,0.4);
        border-radius:20px;
        margin:50px 0 80px 0;
        cursor:pointer;
      }
    }
  }
  
}

</style>
