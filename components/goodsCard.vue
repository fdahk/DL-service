<template>
    <view class="goods-card">
           
        <!-- 店铺信息 -->
        <view class="shop-info">
            <view class="shop-tags">
                <text class="tag flagship">旗舰店</text>
                <text class="tag brand">官方</text>
            </view>
            <view class="order-status">{{ order.status }}</view>
        </view>  
      
        <!-- 商品信息 -->
        <view class="goods-info">
            <!-- 商品图片 -->
            <view class="goods-image">
                <image :src="order.image" mode="aspectFill" class="image" />
            </view>            
            <!-- 商品描述 -->
            <view class="goods-desc">
                <text class="title-text">{{ order.desc }}</text>
            </view>
            
            <!-- 价格信息 -->
            <view class="price-section">
                <text class="original-price">¥{{ order.price }}</text>
            </view>
 
        </view>

        <!-- 实付金额 -->
        <view class="payment-info">
            <text class="payment-label">实付</text>
            <text class="payment-price">¥{{ (order.price/0.75).toFixed(2) }}</text>
            <text class="payment-note">(免运费)</text>
        </view>       

        <!-- 操作按钮区域 -->
        <view class="action-section">
            <!-- 操作按钮 -->
            <view class="action-buttons">
                <view class="btn-group">
                    <view class="action-btn remove-btn" @tap="handleRemove">删除订单</view>
                    <view class="action-btn detail-btn" @tap="handleViewDetail">售后详情</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// 接收数据
const props = defineProps({
    order: {
        type: Object,
        default: () => ({
            image: '',
            title: '',
            price: 0,
            desc: '',
            salesCount: 0,
            category: '',
            status: ''
        })
    }
})
// 定义事件
const emit = defineEmits(['remove', 'viewDetail'])

// 事件处理
const handleRemove = () => {
    emit('remove', props.order)
}

const handleViewDetail = () => {
    emit('viewDetail', props.order)
}
</script>

<style lang="scss" scoped>
.goods-card {
    background-color: #fff;
    padding: 16rpx;
    display: flex;
    flex-direction: column;
    margin-bottom: 10rpx;
}


// 店铺信息
.shop-info {
    margin-bottom: 12rpx;
    display: flex;
    justify-content: space-between;
    .shop-tags {
        display: flex;
        align-items: center;
        .tag {
            font-size: 26rpx;
            padding: 2rpx 6rpx;
            border-radius: 3rpx;
            margin-right: 8rpx;
            
            &.flagship {
                background-color: #fff1f0;
                color: #ff4d4f;
                border: 1rpx solid #ffccc7;
            }
            
            &.brand {
                background-color: #f6ffed;
                color: #52c41a;
                border: 1rpx solid #b7eb8f;
            }
        }
    }
    // 交易状态
    .order-status {
        font-size: 26rpx;
        color: $uni-color-primary;
    }    
}

// 商品信息
.goods-info {
    flex: 1;
    display: flex;
}

// 商品图片
.goods-image {
    width: 200rpx;
    height: 200rpx;
    .image {
        width: 100%;
        height: 100%;
    }
}
// 商品描述
.goods-desc {
    flex: 1;
    padding: 10rpx;
    .title-text {
        font-size: 26rpx;
        color: #333;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}

// 价格区域
.price-section {
    display: flex;
    align-items: baseline;    
    justify-content: flex-end;
    width: 140rpx;
    .original-price {
        font-size: 26rpx;
        color: $uni-text-color;
        // text-decoration: line-through;
    }
}

// 实付信息
.payment-info {
    display: flex;
    align-items: baseline;
    margin-bottom: 16rpx;
    justify-content: flex-end;
    .payment-label {
        font-size: 24rpx;
        color: #666;
        margin-right: 8rpx;
    }
    
    .payment-price {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
        margin-right: 8rpx;
    }
    
    .payment-note {
        font-size: 20rpx;
        color: #52c41a;
    }
}
// 操作区域
.action-section {
    border-top: 1rpx solid #f0f0f0;
    padding-top: 16rpx;
}
// 操作按钮
.action-buttons {
    .btn-group {
        display: flex;
        justify-content: flex-end;
        gap: 16rpx;
    }
    
    .action-btn {
        border-radius: 4rpx;
        font-size: 28rpx;
        border: 1rpx solid;
        padding: 8rpx ;
        background-color: transparent;
        &.remove-btn {
            color: #666;
            border-color: #d9d9d9;
            background-color: #fff;
        }
        
        &.detail-btn {
            color: white;
            background-color: $uni-color-primary;
        }
    }
}
</style>