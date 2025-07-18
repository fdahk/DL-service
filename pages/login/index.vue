<template>
<view class="user-page">
    <!-- header -->
    <view class="header" :style="{ marginTop: navBarHeight + 'rpx' }">
    <text class="title">登录</text>
    </view>
    <!-- body -->
    <view class="content">
    <button v-if="!userInfo" open-type="getUserInfo" @getuserinfo="onGetUserInfo">微信一键登录</button>
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
const navBarHeight = uni.getSystemInfoSync().statusBarHeight + 44
const userInfo = ref(null)

onMounted(() => {
  const localUser = uni.getStorageSync('userInfo')
  if (localUser) {
    userInfo.value = localUser
    uni.reLaunch({ url: '/pages/index/index' })
  }
})

const onGetUserInfo = async (e) => {
  const { userInfo: wxUserInfo } = e.detail
  if (!wxUserInfo) {
    uni.showToast({ title: '请授权登录', icon: 'none' })
    return
  }
  try {
    const res = await wx.cloud.callFunction({
      name: 'login',
      data: {
        nickName: wxUserInfo.nickName,
        avatarUrl: wxUserInfo.avatarUrl
      }
    })
    if (res.result.code === 0) {
      userInfo.value = res.result.data
      uni.setStorageSync('userInfo', res.result.data)
      uni.showToast({ title: '登录成功', icon: 'success' })
      // 登录成功后跳转
      setTimeout(() => {
        uni.reLaunch({ url: '/pages/index/index' })
      }, 800)
    } else {
      uni.showToast({ title: '登录失败', icon: 'none' })
    }
  } catch (err) {
    console.error('云函数异常:', err)
    uni.showToast({ title: '云函数异常', icon: 'none' })
  }
}
</script>

<style lang="scss" scoped>
.user-page {}
.header { text-align: center; }
.title {}
.content { text-align: center; }
</style>