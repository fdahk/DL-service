<template>
	<!-- 页面根容器  -->
	<view class="page">
		<!-- 顶部 -->
		<view class="custom-navbar" >
            <view class="navbar-title" :style="{ height: navBarHeight + 'px' }">
                <i class="iconfont icon-jiantou_liebiaoxiangzuo_o left-icon" @tap="handleBack"></i> 
                <text class="navbar-title-text">拼多多</text>
            </view>
			<!-- 搜索框 -->
			<view class="navbar-search-box"  >
				<SearchBar @tap="handleSearchTap" style="width: 100%;"/>
			</view>
		</view>		

		<!-- body -->
		<view class="content">
			<!-- 竖向商品展示(我靠，uvui没有虚拟列表) -->
			<view class="virtual-list-box">
				<!-- 虚拟列表 -->
				<VirtualList
				ref="virtualListRef"
				:data="listData"
				:item-height="450"
				:scroll-height="scrollHeight"
				:buffer-size="4"  
				:enable-load-more="true"
				:has-more="hasMore"
				key-field="id"
				@loadMore="handleLoadMore"
				@scroll="handleScroll"
				class="scroll-container"
				>


				<!-- 作用域插槽 : 渲染若干个行item，构成渲染区域-->
				<template #default="{ visibleItems, itemHeight, getItemKey }">
					<view v-if="visibleItems.length === 0">
						<text>暂无数据</text>
					</view>
					<view 
						v-else
						v-for="(item, index) in visibleItems" 
						:key="getItemKey(item, index)"
						class="list-item-row"
						:style="{ height: itemHeight + 'rpx' }"
					>
						<view class="list-item-col" 
						v-for="(itemCol, colIndex) in getValidItems(item)" 
						:key="colIndex" @tap="handleItemClick(itemCol, item.virtualIndex)">
							<image class="item-img" :src="itemCol?.image[0]" mode="aspectFill" />
							<view class="item-title-box">
								<view class="item-title">{{ itemCol?.title }}</view>
								<view class="item-desc">{{ itemCol?.desc }}</view>
							</view>
							<view class="item-price-box">
								<text class="item-price">￥{{ itemCol?.price.toFixed(2) }}</text>
								<text class="item-sales-count">已售：{{ itemCol?.salesCount }}</text>
							</view>
						</view>
					</view>
				</template>
				</VirtualList>
			</view>
			<!-- 操作按钮 -->
			<FloatingButton v-show="computedScrollTop > 1500" :handleTap="scrollToTop" />
		</view>
	</view>
</template>

<script setup>
	import { ref, onMounted, computed } from 'vue'
	import SearchBar from '../../components/search.vue'
	import VirtualList from '../../components/virtualList.vue'
	import FloatingButton from '../../components/floatingButton.vue'
	import { useGoodsStore } from '../../store/goodsStore'
	const goodsStore = useGoodsStore()
	const navBarHeight = uni.getWindowInfo().statusBarHeight + 44
	const fixedTopHeight = ref(0)
    const scrollHeight = ref(0)
	// 虚拟列表
	const virtualListRef = ref(null)
	const listData = ref([])
	const hasMore = ref(true)
	const currentPage = ref(1)
	// 计算属性，用于获取虚拟列表的滚动位置
	// 注： 需要明确声明哪些数据是响应式的，尽管该值本身是实时更新的，但可能模板不存在响应式依赖，导致无法实时更新
	const computedScrollTop = computed(() => {
		// console.log(virtualListRef.value?.currentScrollTop) // 调试
		return virtualListRef.value?.currentScrollTop
	})

	// 加载数据
	const loadData = async () => {
        // 补充逻辑
        listData.value = goodsStore.searchRes
        if(listData.value.length < 20){
            hasMore.value = false
        }
	}
    // 返回
    const handleBack = () => {
        uni.navigateBack()
    }

	// 上拉加载更多
	const handleLoadMore = async () => {
		currentPage.value++
		await loadData()
	}


	// 点击列表项
	const handleItemClick = (item) => {
		goodsStore.setCurrentGoods(item)
		uni.navigateTo({url: '/pages/goodsDetail/index'})
	}

	// 回到顶部
	const scrollToTop = () => {
	virtualListRef.value?.scrollToTop()
	}

	// 处理滚动事件
	const handleScroll = (scrollInfo) => {
		// 可以在这里处理滚动相关逻辑
		// console.log('滚动信息:', scrollInfo)
		
		// 示例1：记录滚动位置（用于恢复滚动位置）
		// uni.setStorageSync('listScrollPosition', scrollInfo.scrollTop)
		
		// 示例2：根据滚动位置动态显示/隐藏元素
		// if (scrollInfo.scrollTop > 500) {
		//   // 可以显示回到顶部按钮或其他操作
		// }
		
		// 示例3：滚动到特定位置时触发某些操作
		// if (scrollInfo.scrollTop > scrollInfo.scrollHeight * 0.8) {
		//   // 接近底部时可以预加载下一页数据
		// }
	}

	// 过滤有效数据的函数
	const getValidItems = (item) => {
	return [item?.[0], item?.[1]].filter(Boolean)
	}

	//点击搜索
	const handleSearchTap = () => {
		// 跳转到搜索页
		try {
			uni.redirectTo({ url: '/pages/search/index' })	
		} catch (error) {
			console.error('跳转失败:', error)
		}
		
	}
	onMounted(() => {	
		// 固定顶部高度 = 状态栏高度 tab栏高度 + 总margin高度
		fixedTopHeight.value = navBarHeight + 32.5 + 5
        scrollHeight.value = uni.getSystemInfoSync().windowHeight - fixedTopHeight.value
		// 初始化商品数据
		loadData()
	})
</script>

<style lang="scss" scoped>

.page {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

// 头部
.custom-navbar {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 9999;
	background-color: white;
	display: flex;
	flex-direction: column;
    .navbar-title {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        .left-icon {
            font-size: 80rpx;
            position: absolute;
            left: 20rpx;
            bottom: 10rpx;
        }
        .navbar-title-text {
            font-size: 40rpx;
            font-weight: 500;
            position:  absolute;
            bottom: 30rpx;
        }
    }
	// 搜索框
	.navbar-search-box {
	box-sizing: border-box;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: stretch;
	padding: 0 16rpx; 
    height: 65rpx; // 推荐开发时指明高度，便于计算
    margin-bottom: 10rpx;
	}

}

// 内容
.content {
	// v-bind() 只能接受一个 JS 表达式，表达式的结果必须是字符串或数字。如果需要拼接单位，请在表达式中拼接
	margin-top: v-bind('fixedTopHeight + "px"'); // 这里不能用rpx，因为fixedTopHeight是px
	display: flex;
	flex-direction: column;
	gap: 10rpx;
	flex: 1;
}


// 虚拟列表
.virtual-list-box {
	display: flex;
	flex-direction: column;
	flex: 1;
	background-color: transparent;
}

.scroll-container {
position: relative;
width: 100%;
// height: 100vh;
flex: 1;
}

.list-item-row {
	display: grid;
	// Grid 中，网格项目（grid item）有一个默认的最小尺寸约束
	// 设置了等分，但其并不会收缩子元素
	grid-template-columns: repeat(2, 1fr);
	gap: 10rpx;
	margin-bottom: 10rpx;
}
.list-item-col {
  display: flex;
  flex-direction: column;
  height: 450rpx;
  align-items: center;
  background-color: #fff;
  transition: background-color 0.2s ease;
  min-width: 0; // 防止内容溢出
  &:active {
    background-color: #f8f8f8;
  }
  
  .item-img {
    width: 100%;
	height: 350rpx;
	background-color: #f0f0f0;

  }
  
  .item-title-box {
    display: flex;
	width: 100%;
	height: 50rpx;
	justify-content: space-between;
	align-items: center;

    .item-title {
	width: 20%;
	font-size: 24rpx;
	color: $uni-text-color-grey;
	white-space: nowrap;
	overflow: hidden;
    }
    
    .item-desc {
	width: 70%;
	font-size: 24rpx;
	color: $uni-text-color-grey;
	white-space: nowrap;
	overflow: hidden;
    }
    
  }
  
  .item-price-box {
	width: 100%;
	flex: 1;
	display: flex;
	justify-content: space-between;
	align-items: center;
    .item-price {
      font-size: 34rpx;
      color: $uni-color-primary;
      font-weight: 400;
    }
	.item-sales-count {
		font-size: 24rpx;
		color: $uni-text-color-grey;
	}
  }
}


// 文本省略
// @mixin text-overflow {
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: nowrap;
// }

// @mixin text-overflow-multi($lines) {
//   overflow: hidden;
//   text-overflow: ellipsis;
//   display: -webkit-box;
//   -webkit-line-clamp: $lines;
//   -webkit-box-orient: vertical;
// }

@media screen and (max-width: 375px) {
  .navbar-content {
    padding: 0 12rpx;
  }
  
  .navbar-center {
    margin: 0 8rpx;
  }
  
  .navbar-right .icon-item {
    margin-left: 8rpx;
    width: 28rpx;
    height: 28rpx;
  }
}
</style>
