<template> 
    <view class="page">
        
        <!-- 安全区适配：<uv-navbar /> 、<uv-status-bar /> -->
        <uv-status-bar /> 

        <!-- 顶部导航栏 -->
        <view class="header" :style="{ paddingRight: capsuleButtonInfo.width + 20 + 'px' }">
            <!-- 回退按钮 -->
            <i class="iconfont icon-jiantou_liebiaoxiangzuo_o left-icon" @tap="handleBack"></i>
            <!-- 搜索框 -->
            <SearchBar style="flex: 1;" @confirm="handleConfirm"/>
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
                    <text class="refresh-icon">刷新</text>
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
import SearchBar from '../../components/search.vue'
import { useGoodsStore } from '../../store/goodsStore'
const goodsStore = useGoodsStore()
const capsuleButtonInfo = uni.getMenuButtonBoundingClientRect()
const suggestTags = ref([
    '充话费联通', '篮球鞋', '二手车', '瑜伽课',
    '于正版演员版', 'nut+椰子', '工作室', '毛衣男出租',
    '摩托车', '厂房仓库出租'
])
// 回退
const handleBack = () => {
    uni.navigateBack()
}
// 搜索
const handleConfirm = async (value) => {
    const res = await wx.cloud.callFunction({
        name: 'search',
        data: {
            searchValue: value
        }
    })
    goodsStore.setSearchRes(res.result.data.reduce((acc, cur, idx) => {
        if (idx % 2 === 0) {
            acc.push(res.result.data.slice(idx, idx + 2));
        }
        return acc;
    }, []))
    uni.redirectTo({
        url: `/pages/searchRes/index`
    })
}


const searchTag = (tag) => {
    console.log('搜索:', tag)
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
    .left-icon {
        font-size: 70rpx;
        color: #333;
        margin-right: 24rpx;
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
    gap: 16rpx;
    
    .tag {
        background-color: #f5f5f5;
        padding: 16rpx 32rpx;
        border-radius: 40rpx;
        font-size: 28rpx;
        color: #666;        
    }
}
</style>