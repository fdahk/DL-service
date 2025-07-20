<template>
    <view class="page">
        <!-- header -->
         <view class="header">
            <view class="header-title" :style="{height: statusBarHeight + 'px'}">
                <view class="back-btn">
                    <text class="iconfont icon-jiantou_liebiaoxiangzuo_o back-icon" @click="handleBack"></text>
                </view>
                <text class="header-title-text">我的订单</text>
            </view>
         </view>
        <!-- 订单列表 -->
        <scroll-view class="order-list" scroll-y :style="{marginTop: statusBarHeight + 'px'}">
            <view v-for="(order, _id) in orderList" :key="_id">
                <goods-card :order="order" @remove="handleRemoveGoods" @viewDetail="handleViewDetail" />
            </view>
        </scroll-view>
    </view>
</template>

<script setup>
import goodsCard from '@/components/goodsCard.vue'
import { useOrderStore } from '../../store/orderStore'
const orderStore = useOrderStore()
const orderList = orderStore.orderList
const statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 44

// 返回
const handleBack = () => {
    uni.navigateBack()
}

// 删除商品
const handleRemoveGoods = (goodsInfo) => {
    console.log('删除商品:', goodsInfo)
}

// 查看详情
const handleViewDetail = (goodsInfo) => {
    console.log('查看详情:', goodsInfo)
}
</script>

<style lang="scss" scoped>
.page {
    height: 100vh;
}

.header {
    background-color: white;
    display: flex; 
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    .header-title {
        position: relative;
        display: flex; 
        align-items: flex-end;
        justify-content: center;
        .header-title-text {
            font-size: 40rpx;
            font-weight: 400;
            margin-bottom: 20rpx;
        }
        .back-btn {
            position: absolute;
            left: 10rpx;
            bottom: 10rpx;
            width: 60rpx;
            height: 60rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            .back-icon {
                font-size: 70rpx;
                color: $uni-text-color;
            }
        }        
    }

}

// 订单列表 
.order-list {
    display: flex; 
    flex-direction: column; 
    // gap: 20rpx; //scroll-view 不支持 gap
}
</style>