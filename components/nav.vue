<template>
  <view class="custom-navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
    <view class="navbar-content">
      <!-- 左侧品牌名 -->
      <view class="navbar-left">
        <text class="brand-name">闲鱼</text>
      </view>
      
      <!-- 中间搜索框 -->
      <view class="navbar-center" @tap="handleSearchTap">
        <view class="search-box">
          <text class="iconfont icon-seach search-icon"></text>
          <text class="search-placeholder">打口机</text>
        </view>
      </view>
      
      <!-- 右侧图标 -->
      <view class="navbar-right">
        <view class="icon-item" @tap="handleMoreTap">
          <text class="iconfont icon-more"></text>
        </view>
        <view class="icon-item" @tap="handleCameraTap">
          <text class="iconfont icon-saoma"></text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CustomNav',
  data() {
    return {
      statusBarHeight: 0
    }
  },
  mounted() {
    // 获取状态栏高度
    uni.getSystemInfo({
      success: (res) => {
        this.statusBarHeight = res.statusBarHeight || 44
      }
    })
  },
  methods: {
    // 搜索框点击事件
    handleSearchTap() {
      this.$emit('search-tap')
      // 或者直接跳转到搜索页面
      // uni.navigateTo({
      //   url: '/pages/search/search'
      // })
    },
    
    // 更多按钮点击事件
    handleMoreTap() {
      this.$emit('more-tap')
    },
    
    // 扫码/相机按钮点击事件
    handleCameraTap() {
      this.$emit('camera-tap')
      // 或者直接调用扫码功能
      // uni.scanCode({
      //   success: (res) => {
      //     console.log('扫码结果：', res.result)
      //   }
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('/static/iconFonts/iconfont.css');

.custom-navbar {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.navbar-content {
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  justify-content: space-between;
}

.navbar-left {
  flex: 0 0 auto;
  
  .brand-name {
    color: #333;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 1px;
  }
}

.navbar-center {
  flex: 1;
  margin: 0 12px;
  
  .search-box {
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 20px;
    height: 32px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    
    &:active {
      background-color: rgba(255, 255, 255, 0.8);
      transform: scale(0.98);
    }
    
    .search-icon {
      color: #999;
      margin-right: 8px;
      font-size: 14px;
    }
    
    .search-placeholder {
      color: #666;
      font-size: 14px;
      flex: 1;
    }
  }
}

.navbar-right {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  
  .icon-item {
    margin-left: 12px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    background-color: rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    
    &:active {
      background-color: rgba(255, 255, 255, 0.4);
      transform: scale(0.9);
    }
    
    .iconfont {
      color: #333;
      font-size: 16px;
    }
  }
}

/* 适配不同设备 */
@media screen and (max-width: 375px) {
  .navbar-content {
    padding: 0 12px;
  }
  
  .navbar-center {
    margin: 0 8px;
  }
  
  .navbar-right .icon-item {
    margin-left: 8px;
    width: 28px;
    height: 28px;
  }
}
</style>
