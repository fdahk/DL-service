<template>

    <view class="search-box">
      <text class="iconfont icon-sousuo search-icon"></text>
      <text class="search-placeholder">搜索</text>
    </view>

</template>

<script setup>

</script>

<style scoped lang="scss">

  .search-box {
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 40rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    padding: 0 32rpx;
    box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    
    &:active {
      background-color: rgba(255, 255, 255, 0.8);
      transform: scale(0.98);
    }
    
    .search-icon {
      color: #999;
      margin-right: 16rpx;
    //   font-size: 28rpx;
    }
    
    .search-placeholder {
      color: #666;
      font-size: 28rpx;
      flex: 1;
    }
  }
</style>