<template>

    <view class="search-box">
      <text class="iconfont icon-sousuo search-icon"></text>
      <input class="search-input" placeholder="搜索" @confirm="handleConfirm"/>
    </view>

</template>

<script setup>
import { defineEmits } from 'vue'
const emit = defineEmits(['confirm'])

const handleConfirm = (e) => {
  emit('confirm', e.detail.value)
}

</script>

<style scoped lang="scss">

  .search-box {
    background-color: #e6e4e4;
    border-radius: 40rpx;
    display: flex;
    align-items: center;
    padding: 10rpx 32rpx;  
    .search-icon {
      color: #999;
      margin-right: 16rpx;
    //   font-size: 28rpx;
    }
    
    .search-input {
      color: #999;
      font-size: 28rpx;
      flex: 1;
    }
  }
</style>