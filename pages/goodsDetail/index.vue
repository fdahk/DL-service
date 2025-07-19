<template>
    <view class="page">
        <!-- header -->
        <view class="header" :style="{display: scrollTop > 200 ? 'flex' : 'none'}" >
            <view class="header-nav" :style="{height: statusBarHeight + 'px'}">
                <text>商品详情</text>
            </view>
            <view class="header-tab">
                <view 
                    v-for="(item, index) in tabList" 
                    :key="index" 
                    class="header-tab-item" 
                    :class="{active: index === activeTab}" 
                    @click="handleTabClick(index)"
                >
                    <text>{{ item }}</text>
                </view>
                <!-- 滑动指示器 -->
                <view class="tab-indicator" :style="indicatorStyle"></view>                
            </view>
        </view>
        <!-- back --> 
         <view class="header-btn-box" :style="{height: statusBarHeight + 'px'}">
            <view class="header-btn">
                <text class="iconfont icon-jiantou_liebiaoxiangzuo_o back-icon" @click="handleBack"></text>
            </view>
         </view>
        <!-- body -->
        <scroll-view class="body" @scroll="handleScroll" scroll-y :scroll-top="scrollTopTo">
            <!-- 商品图展示 -->
            <swiper
                indicator-dots
                :autoplay="false"
                circular
                class="goods-img"
            >
                <swiper-item v-for="(item, index) in goods.image" :key="index">
                    <image
                        :src="item"
                        mode="scaleToFill"
                        class="goods-img-item"
                    />
                </swiper-item>
            </swiper>

            <!-- 商品价格栏 -->
            <view class="price-bar">
                <!-- 价格信息 -->
                <view class="price-info">
                    <text class="discount">7.6折</text>
                    <text class="current-price">¥319</text>
                    <text class="original-price">¥339</text>
                    <text class="coupon">已优惠20元</text>
                </view>
                
                <!-- 月销量信息 -->
                <view class="sales-info">
                    <text class="sales-text">月销50.2万件</text>
                </view>
            </view>           

            <!-- 商品标题栏 -->
            <view class="goods-title-box">
                <goodsDesc 
                    class="goods-title" 
                    :first="'旗舰店'" 
                    :desc="goods?.desc || '商品描述'" 
                    :second="'极速退款'" 
                />
                <text class="iconfont icon-fenxiang share-icon" @click="handleShare"></text>
            </view>
            <!-- 商品细节 -->
            <view class="goods-desc" style="height: 3000rpx; background-color: pink;">

            </view>
        </scroll-view>

        <!-- footer -->
         <view class="footer">
            <!-- 左侧操作按钮 -->
            <view class="footer-left">
                <view class="action-btn" @tap="handleStore">
                    <text class="iconfont icon-dianpuguanzhu bottom-icon"></text>
                    <text class="btn-text">店铺</text>
                </view>
                <view class="action-btn" @tap="handleCollect">
                    <text class="iconfont icon-shangpinshoucang bottom-icon" :class="{ active: isCollected }"></text>
                    <text class="btn-text">收藏</text>
                </view>
                <view class="action-btn" @tap="handleCustomerService">
                    <text class="iconfont icon-kefu bottom-icon"></text>
                    <text class="btn-text">客服</text>
                </view>
            </view>
            
            <!-- 右侧购买按钮 -->
            <view class="footer-right">
                <view class="buy-btn" @tap="handleBuy">
                    <text class="buy-text">限量价 7.6折¥319</text>
                    <text class="buy-subtitle">即将恢复原价 发起拼单</text>
                </view>
            </view>
         </view>
    </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGoodsStore } from '../../store/goodsStore'
import goodsDesc from '../../components/goodsDesc.vue'
// 导入价格组件
// import priceBar from '../../components/priceBar.vue'

const goodsStore = useGoodsStore()
const goods = computed(() => goodsStore.goodsInfo)
const scrollTop = ref(0)
const tabList = ["商品", "评价", "详情"]
const statusBarHeight = uni.getWindowInfo().statusBarHeight + 44

// tab栏事件
const activeTab= computed(() => {
    if(scrollTop.value < 350){
        return 0
    } else if(scrollTop.value < 550){
        return 1
    } else {
        return 2
    }
})
// 滑动指示器样式
const indicatorStyle = computed(() => {
    const tabWidth = 10
    const translateX = activeTab.value * 333
    return {
        width: `${tabWidth}%`,
        transform: `translateX(${translateX}%)`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }
})
// 点击tab跳转区域
const scrollTopTo = ref(0)
const handleTabClick = (index) => {
    // activeTab = index //不能修改计算属性
    const scrollPositions = [0, 350, 550]
    scrollTopTo.value = scrollPositions[index]
}


// 处理滚动事件
const handleScroll = (e) => {
    scrollTop.value = e.detail.scrollTop
}
//   回退
const handleBack = () => {
    uni.navigateBack()
}
//   分享
const handleShare = () => {
    uni.share({
        title: goods.value?.desc,
        path: `/pages/goodsDetail/index?id=${goods.value?.id}`,
    })
}

// 底部按钮
// 收藏状态
const isCollected = ref(false)

// 事件处理
const handleStore = () => {
    // 跳转到店铺页面
    uni.navigateTo({
        url: `/pages/store/index?storeId=${goods.value?.storeId}`
    })
}

const handleCollect = () => {
    isCollected.value = !isCollected.value
    uni.showToast({
        title: isCollected.value ? '收藏成功' : '取消收藏',
        icon: 'success'
    })
}

const handleCustomerService = () => {
    // 打开客服对话
    uni.showToast({
        title: '客服功能开发中',
        icon: 'none'
    })
}

const handleBuy = () => {
    // 购买逻辑
    uni.navigateTo({
        url: `/pages/order/confirm?goodsId=${goods.value?.id}`
    })
}
</script>

<style lang="scss" scoped>
.page {
    width: 100%;
    height: 100vh;
    background-color: white;
}
// header
.header {
    width: 100%;
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: white;
    .header-nav {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .header-tab {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        position: relative; // 添加相对定位
        .header-tab-item {
            padding-bottom: 8px;
            transition: all .3s ease;
            position: relative;
            z-index: 1; // 确保在指示器上方
        }
        .active {
            color: $uni-color-primary;
            // 移除原来的 border-bottom
        }              
        // 滑动指示器
        .tab-indicator {
            position: absolute;
            bottom: 0;
            left: 46px; //兼容性极差，但简单
            height: 2px;
            // background: linear-gradient(90deg, $uni-color-primary, lighten($uni-color-primary, 20%));
            background-color: $uni-color-primary;
        }
    }
}
//顶部按钮
.header-btn-box {
    position: fixed;
    z-index: 200;
    top: 0;
    left: 0;
    right: 0;
    background-color: transparent;
}
.header-btn {
    width: 80rpx;
    height: 60rpx;
    position: absolute;
    bottom: 8px;
    left: 10px;
    border-radius: 30%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $uni-bg-color-hover;
    opacity: .4;
    .back-icon {
        font-size: 60rpx;
        color: black;
    }
}
//body
.body {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  // 图片展示
  .goods-img {
    width: 100%;
    height: 40vh;
  }
    .goods-img-item {
            width: 100%;
        height: 100%;
    }  
    // 商品信息
    .goods-title-box {
        box-sizing: border-box;
        width: 100%;
        height: 100rpx;
        // padding: 10px;
        min-width: 0;
        display: flex;
        align-items: center;
        justify-content: center;    
        .goods-title {
            flex: 1;
            min-width: 0;
            height: 100%;
        }
        .share-icon {
            margin-left: 4px;
            font-size: 50rpx;
            color: $uni-color-primary;
        }
    }
}

//价格栏
.price-bar {
    padding: 20rpx;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1rpx solid #f0f0f0;
    // margin-bottom: 10rpx;
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

// footer
.footer {
    height: 120rpx;
    position: fixed; 
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    display: flex;
    align-items: center;
    padding-left: 20rpx;
}

.footer-left {
    display: flex;
    align-items: center;
    .bottom-icon {
        font-size: 50rpx;
        color: #666;
        margin-bottom: 4rpx;
    }
    .action-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0 20rpx;
        margin-right: 10rpx;
        }
        
        .btn-text {
            font-size: 20rpx;
            color: #666;
            line-height: 1;
        }
        
        &:active {
            background-color: #f5f5f5;
            border-radius: 8rpx;
        }
}

.footer-right {
    flex: 1;
    height: 100%;
    .buy-btn {
        background: linear-gradient(135deg, #ff6b6b 0%, #ff4d4f 100%);
        padding: 20rpx 30rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 80rpx;
        
        .buy-text {
            font-size: 28rpx;
            color: #fff;
            font-weight: bold;
            line-height: 1.2;
        }
        
        .buy-subtitle {
            font-size: 20rpx;
            color: #fff;
            opacity: 0.9;
            line-height: 1.2;
            margin-top: 2rpx;
        }
    }
}
</style>