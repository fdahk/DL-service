<template> 
    <view class="page">
        
        <!-- 安全区适配：<uv-navbar /> 、<uv-status-bar /> -->
        <uv-status-bar /> 

        <!-- 顶部导航栏 -->
        <view class="header">
            <!-- 回退按钮 -->
            <i class="iconfont icon-jiantou_liebiaoxiangzuo_o left-icon" @tap="handleBack"></i>
            <!-- 搜索框 -->
            <view class="search-box">
                <input 
                    class="search-input" 
                    placeholder="摩托车"
                    placeholder-style="color: #333;"
                    value="摩托车"
                />
            </view>
        </view>
        
        <!-- 内容 -->
        <view class="content">
            <!-- 历史搜索 -->
            <view class="section">
                <view class="section-header">
                    <text class="section-title">历史搜索</text>
                    <text class="delete-icon">🗑</text>
                </view>
                <view class="history-list">
                    <text class="history-item">1</text>
                </view>
            </view>
            
            <!-- 猜你可能在找 -->
            <view class="section">
                <view class="section-header">
                    <text class="section-title">猜你可能在找</text>
                    <text class="refresh-icon">🔄</text>
                </view>
                <view class="tags-container">
                    <text class="tag" v-for="tag in suggestTags" :key="tag" @tap="searchTag(tag)">
                        {{ tag }}
                    </text>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue'

const suggestTags = ref([
    '充话费联通', '篮球鞋', '二手车', '瑜伽课',
    '于正版演员版', 'nut+椰子', '工作室', '毛衣男出租',
    '摩托车', '厂房仓库出租'
])

const handleBack = () => {
    uni.navigateBack()
}

const searchTag = (tag) => {
    console.log('搜索:', tag)
    // 这里可以添加搜索逻辑
}
</script>

<style lang="scss" scoped>
.page {
    height: 100vh;
    background-color: #fff;
    display: flex;
    flex-direction: column;
}

.header {
    display: flex;
    align-items: center;
    padding: 20rpx 32rpx;
    background-color: #fff;
    border-bottom: 1rpx solid #f0f0f0;
    margin-right: 160rpx;
    .left-icon {
        font-size: 70rpx;
        color: #333;
        margin-right: 24rpx;
    }
    
    .search-box {
        flex: 1;
        height: 70rpx;
        background-color: #f5f5f5;
        border-radius: 35rpx;
        display: flex;
        align-items: center;
        padding: 0 32rpx;
        margin-right: 24rpx;
        
        .search-input {
            flex: 1;
            font-size: 28rpx;
            color: #333;
        }
    }
}

.content {
    flex: 1;
    padding: 32rpx;
}

.section {
    margin-bottom: 60rpx;
    
    .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 32rpx;
        
        .section-title {
            font-size: 32rpx;
            color: #333;
            font-weight: 500;
        }
        
        .delete-icon,
        .refresh-icon {
            font-size: 32rpx;
            color: #999;
        }
    }
}

.history-list {
    .history-item {
        display: inline-block;
        background-color: #f5f5f5;
        padding: 16rpx 32rpx;
        border-radius: 40rpx;
        font-size: 28rpx;
        color: #666;
        margin-right: 24rpx;
        margin-bottom: 24rpx;
    }
}

.tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 24rpx;
    
    .tag {
        background-color: #f5f5f5;
        padding: 16rpx 32rpx;
        border-radius: 40rpx;
        font-size: 28rpx;
        color: #666;
        margin-bottom: 24rpx;
        
        &:active {
            background-color: #e0e0e0;
        }
    }
}
</style>