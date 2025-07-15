<template>
  <view class="banner">
    <!-- 左侧品牌/活动信息 -->
    <view class="banner-left">
      <image class="banner-logo" :src="brand.logo" mode="aspectFit" />
      <view class="banner-title">{{ brand.title }}</view>
      <view class="banner-desc">{{ brand.desc }}</view>
    </view>
    <!-- 右侧商品横滑 -->
    <scroll-view class="banner-scroll" scroll-x>
      <view class="banner-goods-list">
        <view class="goods-card" v-for="item in goodsList" :key="item.id">
          <image class="goods-img" :src="item.img" mode="aspectFit" />
          <view class="goods-price">￥{{ item.price }}</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
    import { defineProps } from 'vue'
    defineProps({
        brand: {
            type: Object,
            // 数据示例
            default: () => ({
            logo: '/static/pngs/baiyi.png',
            title: '百亿补贴',
            desc: '大牌正品'
            })
        },
        goodsList: {
            type: Array,
            // 数据示例
            default: () => [
            { id: 1, img: '/static/pngs/cxk.png', price: 3590 },
            { id: 2, img: '/static/pngs/cxk.png', price: 1790 },
            { id: 3, img: '/static/pngs/cxk.png', price: 1599 },
            { id: 4, img: '/static/pngs/cxk.png', price: 4657 }
            ]
        }
    })
</script>

<style lang="scss" scoped>
.banner {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.03);
  overflow: hidden;
}

.banner-left {
  width: 120rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 20rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
  .banner-logo {
    width: 80rpx;
    height: 80rpx;
    border-radius: 16rpx;
    margin-bottom: 8rpx;
    background: #fff;
    border: 1rpx solid #f5f5f5;
  }
  .banner-title {
    font-size: 28rpx;
    color: #222;
    font-weight: bold;
    margin-bottom: 4rpx;
  }
  .banner-desc {
    font-size: 22rpx;
    color: #aaa;
  }
}

.banner-scroll {
  flex: 1;
  overflow: visible;
}

.banner-goods-list {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 32rpx;
  padding-right: 20rpx;
}

.goods-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120rpx;
  .goods-img {
    width: 100rpx;
    height: 120rpx;
    object-fit: contain;
    margin-bottom: 8rpx;
  }
  .goods-price {
    color: $uni-color-primary;
    font-size: 28rpx;
    font-weight: bold;
    margin-top: 4rpx;
  }
}
</style>