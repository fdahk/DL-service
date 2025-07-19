<template>
    <view class="goods-title-wrapper">
        <text class="goods-title">
            <text class="tag first">{{ first }}</text>
            <text class="content">{{ desc }}</text>
            <text class="tag second">{{ second }}</text>
        </text>
    </view>
</template>

<script setup>
defineProps({
    first: String,
    desc: String,
    second: String,
})
</script>

<style lang="scss" scoped>
.goods-title-wrapper {
    width: 100%;
    line-height: 1.5;
}

.goods-title {
    font-size: 28rpx;
    color: #333;
    line-height: 1.5;
    
    .tag {
        font-size: 20rpx;
        color: white;
        padding: 2rpx 6rpx;
        border-radius: 3rpx;
        margin: 0 4rpx;
        vertical-align: middle; 
    }
    
    .first {
        background-color: #000;
        margin-left: 0;
    }
    
    .second {
        background-color: #52c41a;
        margin-right: 0;
    }
    
    .content {
        font-size: 28rpx;
        color: #333;
    }
}
</style>