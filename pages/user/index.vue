<template>
  <view class="user-center" :style="{ paddingTop: navBarHeight + 'px' }">
    <!-- 顶部导航栏 -->
    <view class="top-nav" :style="{ height: navBarHeight + 'px' }">
      <text class="top-nav-text">个人中心</text>
    </view>
    <!-- 头部用户信息 -->
    <view class="user-header">
      <image class="avatar" :src="userInfo.avatarUrl || defaultAvatar" />
      <view class="user-info">
        <text class="nickname">{{ userInfo.nickName || '未登录' }}</text>
        <button class="update-btn" v-if="userInfo.nickName" size="mini">更新资料</button>
      </view>
      <button class="order-btn" size="mini">拼单返现</button>
    </view>

    <!-- 省钱月卡 -->
    <view class="card-banner">
      <text>省钱月卡 | 先领券 再下单</text>
    </view>

    <!-- 我的订单 -->
    <view class="order-section">
      <view class="order-title">
        <text>我的订单</text>
        <view class="order-all" @tap="goAllOrder">查看全部 ></view>
      </view>
      <view class="order-list">
        <view class="order-item" v-for="item in orderList" :key="item.text">
          <text class="iconfont order-icon" :class="item.icon"></text>
          <text class="order-text">{{ item.text }}</text>
          <view v-if="item.badge" class="badge">{{ item.badge }}</view>
        </view>
      </view>
    </view>

    <!-- 优惠券广告 -->
    <view class="coupon-tip">
      <text>送你迈巴赫5元优惠券,加多多福利可领</text>
      <button class="get-coupon-btn" size="mini">去领取</button>
    </view>

    <!-- 多多钱包 -->
    <view class="wallet-section">
      <view class="wallet-title">
        <text>多多钱包</text>
        <view class="wallet-all">查看余额 ></view>
      </view>
    </view>

    <!-- 底部菜单 -->
    <view class="bottom-menu">
      <view class="menu-item" v-for="item in menuList" :key="item.text">
        <text class="iconfont menu-icon" :class="item.icon"></text>
        <text class="menu-text">{{ item.text }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
const defaultAvatar = 'https://img.yzcdn.cn/vant/cat.jpeg'
const navBarHeight = uni.getWindowInfo().statusBarHeight + 44
const userInfo = uni.getStorageSync('userInfo')


const orderList = [
  { icon: 'icon-daifukuan', text: '待付款' },
  { icon: 'icon-fenxiang', text: '待分享' },
  { icon: 'icon-caozuo-shijian', text: '待发货' },
  { icon: 'icon-daishouhuo', text: '待收货', badge: 1 },
  { icon: 'icon-pingjia', text: '评价', badge: 11 }
]

const menuList = [
  { icon: 'icon-wodeyouhuiquan', text: '优惠券' },
  { icon: 'icon-shangpinshoucang', text: '商品收藏' },
  { icon: 'icon-dianpuguanzhu', text: '店铺关注' },
  { icon: 'icon-caozuo-shijian', text: '历史浏览' },
  { icon: 'icon-shouhou', text: '退款售后' }
]

const goAllOrder = () => {
  uni.showToast({ title: '跳转全部订单', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.user-center {
  background: white;
  min-height: 100vh;
}

//顶部导航栏
.top-nav {
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  .top-nav-text {
    font-size: 36rpx;
    font-weight: bold;
    position: absolute;
    bottom: 0;
    margin-bottom: 20rpx;
  }
}

//用户栏
.user-header {
  background: #fff;
  padding: 32rpx 32rpx;
  display: flex;
  align-items: center;
  position: relative;
  .avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    margin-left: 32rpx;
    background: #eee;
  }
  .user-info {
    margin-left: 24rpx;
    display: flex;
    flex-direction: column;
    align-items: start;
    flex: 1;
    .nickname {
      font-size: 36rpx;
      font-weight: bold;
      color: #222;
    }
    .update-btn {
      margin-top: 8rpx;
      margin-left: 0;
      font-size: 22rpx;
      color: #fd1515;
      background: #fff0f0;
      border: none;
    }
  }
  .order-btn {
    position: absolute;
    right: 32rpx;
    top: 32rpx;
    font-size: 24rpx;
    color: #fd1515;
    background: #fff0f0;
    border: none;
  }
}

.card-banner {
  background: #fff0f0;
  color: #fd1515;
  padding: 18rpx 32rpx;
  font-size: 26rpx;
  margin-bottom: 16rpx;
}

//订单
.order-section {
  background: #fff;
  margin-bottom: 16rpx;
  .order-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx 32rpx 0 32rpx;
    font-size: 30rpx;
    .order-all {
      color: #999;
      font-size: 24rpx;
    }
  }
  .order-list {
    display: flex;
    justify-content: space-around;
    padding: 24rpx 0;
    .order-item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      .order-icon {
        font-size: 48rpx;
      }
      .order-text {
        margin-top: 8rpx;
        font-size: 24rpx;
        color: #333;
      }
      .badge {
        position: absolute;
        top: 0;
        right: 0;
        background: #fd1515;
        color: #fff;
        border-radius: 50%;
        font-size: 18rpx;
        padding: 2rpx 8rpx;
      }
    }
  }
}

.coupon-tip {
  background: #fff;
  margin-bottom: 16rpx;
  padding: 18rpx 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .get-coupon-btn {
    background: #fd1515;
    color: #fff;
    font-size: 24rpx;
    border: none;
    padding: 8rpx 24rpx;
  }
}

.wallet-section {
  background: #fff;
  margin-bottom: 16rpx;
  .wallet-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx 32rpx;
    font-size: 30rpx;
    .wallet-all {
      color: #999;
      font-size: 24rpx;
    }
  }
}

.bottom-menu {
  background: #fff;
  display: flex;
  justify-content: space-around;
  padding: 24rpx 0;
  .menu-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    .menu-icon {
      font-size: 48rpx;
    }
    .menu-text {
      margin-top: 8rpx;
      font-size: 24rpx;
      color: #333;
    }
  }
}
</style>