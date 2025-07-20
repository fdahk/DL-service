<template>
<view class="user-page">
    <!-- header -->
    <view class="header" :style="{ height: navBarHeight + 'px' }">
    <text>登录</text>
    </view>
    <!-- body -->
    <view class="content">
      <!-- 旧版写法：不支持授权弹窗 -->
      <!-- <button v-if="!userInfo" open-type="getUserInfo" @getuserinfo="handleGetUserInfo">微信一键登录</button> -->
      <button v-if="!userInfo"  @tap="handleGetUserInfo">微信一键登录</button>
      <view v-else>
          <image :src="userInfo.avatarUrl" style="width:80rpx;height:80rpx;border-radius:50%;" />
          <text>{{ userInfo.nickName || '微信用户' }}</text>
          <text>openid: {{ userInfo.openid }}</text>
      </view>
    </view>
</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const navBarHeight = uni.getWindowInfo().statusBarHeight + 44
const userInfo = ref(null)


const handleGetUserInfo = async () => {
  wx.getUserProfile({
    desc: '用于完善会员资料',
    success: async (res) => {
      //存到数据库
      const result = await wx.cloud.callFunction({
        name: 'login',
        data: {
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
        }
      })
      // 存到本地
      const openid = result.result.data.openid
      res.userInfo.openid = openid
      uni.setStorageSync('userInfo', res.userInfo)
      uni.showToast({ title: '登录成功', icon: 'success' })
      // 登录成功后跳转
      setTimeout(() => {
        uni.reLaunch({ url: '/pages/index/index' })
      }, 800)      
    },
    fail: () => {
      uni.showToast({ title: '用户拒绝授权', icon: 'none' })
    }
  })
}

onMounted(() => {
  const localUser = uni.getStorageSync('userInfo')
  if (localUser) {
    userInfo.value = localUser
    uni.reLaunch({ url: '/pages/index/index' })
  }
})
</script>

<style lang="scss" scoped>
.user-page {
  height: 100vh;
  display: flex; 
  align-items: center;
  justify-self: center;
}
.header { 
position: fixed;  
top: 0;
left: 0;
right: 0;
display: flex;
flex-direction: column;
align-items: center;
// justify-content: end; 新规范，兼容性差，傻逼小程序的老浏览器，这个都不支持
justify-content: flex-end;
}

.content { 
display: flex;
flex-direction: column;
width: 100%;
align-items: center;
justify-content: center;
}
</style>