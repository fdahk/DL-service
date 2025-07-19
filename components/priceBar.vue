<!-- components/priceBar.vue -->
<template>
    <view class="price-bar">
        <!-- 价格信息 -->
        <view class="price-info">
            <text class="discount">{{ discount }}折</text>
            <text class="current-price">¥{{ currentPrice }}</text>
            <text class="original-price">¥{{ originalPrice }}</text>
            <text class="coupon">已优惠{{ couponAmount }}元</text>
        </view>
        
        <!-- 月销量信息 -->
        <view class="sales-info">
            <text class="sales-text">月销{{ monthlySales }}万件</text>
        </view>
    </view>
</template>

<script setup>
defineProps({
    discount: {
        type: String,
        default: '7.6'
    },
    currentPrice: {
        type: String,
        default: '319'
    },
    originalPrice: {
        type: String,
        default: '339'
    },
    couponAmount: {
        type: String,
        default: '20'
    },
    monthlySales: {
        type: String,
        default: '50.2'
    }
})
</script>

<style lang="scss" scoped>
.price-bar {
    padding: 20rpx;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1rpx solid #f0f0f0;
}

.price-info {
    display: flex;
    align-items: baseline;
    flex: 1;
    
    .discount {
        font-size: 24rpx;
        color: #ff4d4f;
        background-color: #fff1f0;
        border: 1rpx solid #ffccc7;
        border-radius: 4rpx;
        padding: 2rpx 6rpx;
        margin-right: 8rpx;
        line-height: 1.2;
    }
    
    .current-price {
        font-size: 48rpx;
        font-weight: bold;
        color: #ff4d4f;
        margin-right: 8rpx;
        line-height: 1;
    }
    
    .original-price {
        font-size: 28rpx;
        color: #999;
        text-decoration: line-through;
        margin-right: 8rpx;
        line-height: 1;
    }
    
    .coupon {
        font-size: 22rpx;
        color: #ff4d4f;
        background-color: #fff1f0;
        border: 1rpx solid #ffccc7;
        border-radius: 4rpx;
        padding: 2rpx 6rpx;
        line-height: 1.2;
    }
}

.sales-info {
    .sales-text {
        font-size: 24rpx;
        color: #666;
        line-height: 1;
    }
}
</style>