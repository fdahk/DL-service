<template>
    <!-- 操作按钮 -->
    <view class="floating-buttons" >
        <view class="back-top" @tap="handleTap">
            <text class="iconfont icon-jiantou_liebiaoshouqi_o back-top-icon"></text>
            <text class="back-top-text" style="font-size: 24rpx;">顶部</text>
        </view>
    </view>
</template>

<script setup>

defineProps({
    handleTap: {
        type: Function,
        default: () => {}
    }
})
</script>

<style lang="scss" scoped>
// 操作按钮
.floating-buttons {
  position: fixed;
  right: 32rpx;
  bottom: 100rpx;
  z-index: 999;
  
  .back-top {
    background-color: white;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
    padding: 10rpx 10rpx;
    border-radius: 50rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    .back-top-icon {
		// 诡异： 用rpx不生效、用px生效，其他样式都生效、只有字体大小不生效，用在顶部文本样式也生效
		display: flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		font-size: 32px;
		color: black;
	}
  }
}
</style>
