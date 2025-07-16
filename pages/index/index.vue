<template>
	<!-- 页面根容器  -->
	<view class="page">
		<!-- 顶部 -->
		<view class="custom-navbar" :style="{ paddingTop: statusBarHeight + 'rpx' }">
			<!-- 搜索框 -->
			<view class="navbar-search-box">
				<view class="navbar-search" @tap="handleSearchTap">
					<SearchBar />
				</view>
			</view>
			<!-- tab栏 -->
			<scroll-view class="navbar-tab-container" scroll-x> <!-- 只能一个直接子元素，这个子元素的宽度要能撑开，才能横向滚动 -->
				<view class="navbar-tab-box">
					<view class="navbar-tab-item-box" v-for="item in tabList" :key="item.id" 
					@tap="handleTabTap(item.id)" :class="{ active: item.id === activeTab }">
						<text class="navbar-tab-item">{{ item.name }}</text>
					</view>
				</view>
			</scroll-view>	
		</view>		

		<!-- body -->
		<view class="content">
			<!-- 横向商品展示 -->
			<ScrollProductDisplay :brand="brand" :goodsList="goodsList" />
			<!-- 横向商品展示2 -->
			<ScrollProductDisplay :brand="brand2" :goodsList="goodsList2" />
			<!-- 竖向商品展示(我靠，uvui没有虚拟列表) -->
			<!-- 虚拟列表 -->
			<view class="virtual-list-box">
				<VirtualList
				ref="virtualListRef"
				:data="listData"
				:item-height="350"
				:container-height="1200"
				:buffer-size="8"  
				:enable-refresh="true"
				:enable-load-more="true"
				:has-more="hasMore"
				key-field="id"
				@refresh="handleRefresh"
				@loadMore="handleLoadMore"
				@scroll="handleScroll"
				@itemClick="handleItemClick"
				>
				<!-- 作用域插槽 : 渲染若干个行item，构成渲染区域-->
				<template #default="{ visibleItems, itemHeight, getItemKey }">
					<view 
						v-for="(item, index) in visibleItems" 
						:key="getItemKey(item, index)"
						class="virtual-item-row-box"
						:style="{ height: itemHeight + 'rpx' }"
					>
						<view class="list-item-row" @tap="handleItemClick(item, item.virtualIndex)">
							<view class="list-item-col" v-for="(itemCol, colIndex) in [item[0], item[1]]" :key="colIndex">
								<view class="item-img">
									<image class="avatar" :src="itemCol.avatar" mode="aspectFill" />
								</view>
								<view class="item-title-box">
									<view class="item-title">{{ itemCol.title }}</view>
									<view class="item-desc">{{ itemCol.description }}</view>
								</view>
								<view class="item-price-box">
									<text class="item-price">￥{{ itemCol.price }}</text>
								</view>
							</view>
						</view>
					</view>
				</template>
				</VirtualList>
			</view>
			<!-- 操作按钮 -->
			<view class="floating-buttons">
			<view class="btn" @tap="scrollToTop">回到顶部</view>
			<view class="btn" @tap="addMoreData">添加数据</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, onMounted } from 'vue'
	import SearchBar from '../../components/search.vue'
	import ScrollProductDisplay from '../../components/scrollProductDisplay.vue'
	import VirtualList from '../../components/virtualList.vue'
	const statusBarHeight = ref(0)
	const activeTab = ref(1)
	const fixedTopHeight = ref(0)
	// 横向商品展示1
	const brand = ref({
		logo: '/static/pngs/baiyi.png',
		title: '百亿补贴',
		desc: '大牌正品'
	})
	const goodsList = ref([
		{ id: 1, img: '/static/pngs/cxk.png', price: 3590 },
		{ id: 2, img: '/static/pngs/cxk.png', price: 1790 },
		{ id: 3, img: '/static/pngs/cxk.png', price: 1599 },
		{ id: 4, img: '/static/pngs/cxk.png', price: 4657 }
	])
	// 横向商品展示2
	const brand2 = ref({
		logo: '/static/pngs/maicai.png',
		title: '多多买菜',
		desc: '次日自提'
	})
	const goodsList2 = ref([
		{ id: 1, img: '/static/pngs/cgx.jpg', price: 3590 },
		{ id: 2, img: '/static/pngs/cgx.jpg', price: 1790 },
		{ id: 3, img: '/static/pngs/cgx.jpg', price: 1599 },
		{ id: 4, img: '/static/pngs/cgx.jpg', price: 4657 }
	])
	const handleTabTap = (id) => {
		activeTab.value = id
	}
	const tabList = ref([
		{ id: 1, name: '首页' },
		{ id: 2, name: '食品' },
		{ id: 3, name: '百货' },
		{ id: 4, name: '运动' },
		{ id: 5, name: '医药' },
		{ id: 6, name: '手机' },
		{ id: 7, name: '水果' },
		{ id: 8, name: '男装' },
		{ id: 9, name: '女装' },
		{ id: 10, name: '电器' },
		{ id: 11, name: '鞋包' },
	])
	// 虚拟列表
	const virtualListRef = ref(null)
	const listData = ref([])
	const hasMore = ref(true)
	const currentPage = ref(1)

	// 生成模拟数据
	const generateMockData = (page = 1, pageSize = 50) => {
		const data = []
		const start = (page - 1) * pageSize
		
		for (let i = 0; i < pageSize; i++) {
			const index = start + i
			data.push(
				[{
				id: index*2 + 1,
				title: `商品标题 ${index*2 + 1}`,
				description: `这是第 ${index*2 + 1} 个商品的详细描述，包含了丰富的信息内容`,
				avatar: '/static/logo.png',
				price: (Math.random() * 1000 + 10).toFixed(2),
				category: ['电子产品', '服装配饰', '家居用品', '运动户外', '图书音像'][index % 5]
				},
				{
				id: index*2 + 2,
				title: `商品标题 ${index*2 + 2}`,
				description: `这是第 ${index*2 + 2} 个商品的详细描述，包含了丰富的信息内容`,
				avatar: '/static/logo.png',
				price: (Math.random() * 1000 + 10).toFixed(2),
				category: ['电子产品', '服装配饰', '家居用品', '运动户外', '图书音像'][index % 5]
			}])
		}
		
		return data
	}

	// 初始化数据
	const initData = () => {
	listData.value = generateMockData(1, 100)
	currentPage.value = 1
	}

	// 下拉刷新
	const handleRefresh = async () => {
		return new Promise((resolve) => {
			setTimeout(() => {
			// 重新加载数据
			listData.value = generateMockData(1, 100)
			currentPage.value = 1
			hasMore.value = true
			
			uni.showToast({
				title: '刷新成功',
				icon: 'success'
			})
			
			resolve()
			}, 1500)
		})
	}

	// 上拉加载更多
	const handleLoadMore = async () => {
		return new Promise((resolve) => {
			setTimeout(() => {
			currentPage.value++
			const newData = generateMockData(currentPage.value, 50)
			listData.value.push(...newData)
			
			// 模拟没有更多数据
			if (listData.value.length >= 500) {
				hasMore.value = false
				uni.showToast({
				title: '没有更多数据了',
				icon: 'none'
				})
			} else {
				uni.showToast({
				title: `加载了 ${newData.length} 条数据`,
				icon: 'none'
				})
			}
			
			resolve()
			}, 1000)
		})
	}


	// 点击列表项
	const handleItemClick = (item, index) => {
		uni.showModal({
			title: '点击提示',
			content: `你点击了第 ${index + 1} 项：${item.title}`,
			showCancel: false
		})
	}

	// 回到顶部
	const scrollToTop = () => {
	virtualListRef.value?.scrollToTop()
	}

	// 添加更多数据
	const addMoreData = () => {
		const newData = generateMockData(Date.now(), 20)
		listData.value.unshift(...newData)
		
		uni.showToast({
			title: '添加了20条数据',
			icon: 'success'
		})
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

	onMounted(() => {
		uni.getSystemInfo({
			success: (res) => {
				statusBarHeight.value = (res.statusBarHeight || 44) * 2
				// 固定顶部高度 = 状态栏高度 + 搜索框高度 + tab栏高度 + 间距
				fixedTopHeight.value = statusBarHeight.value + 88 + 20 + 65 + 10
			}
		})
		// 初始化数据
		initData()
	})


	const handleSearchTap = () => {
		// 跳转页面，并保留当前页面在页面栈中（可以返回）
		try {
			uni.navigateTo({	
				url: '/pages/search/index'
			})	
		} catch (error) {
			console.error('跳转失败:', error)
		}
		
	}

</script>

<style lang="scss" scoped>
.page {
	height: 100vh;
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
	// 搜索框
	.navbar-search-box {
	height: 88rpx;  
	display: flex;
	align-items: center;
	padding: 0 16rpx; 
	margin-right: 160rpx; 
	justify-content: space-between;
	margin-bottom: 20rpx;
	}

	.navbar-search {
	flex: 1;
	margin: 0 24rpx;
	}

	// tab栏
	.navbar-tab-container {
		// overflow: hidden; //注：建议别加，虽然在这好像没区别
		padding: 0 20rpx;
		border-bottom: 1rpx solid $uni-border-color;
		.navbar-tab-box {
			display: flex;
			align-items: center;
			flex-wrap: nowrap;
			white-space: nowrap;
			width: 100%;
			gap: 35rpx;
			.navbar-tab-item-box {
				display: flex;
				flex-direction: column;
				// flex: 0 0 auto; //不压缩
				height: 65rpx;
				&.active {
					border-bottom: 4rpx solid $uni-color-primary;
				}
			}
			.navbar-tab-item {
				font-size: 34rpx;
				color: #333;
			}
		}	
	}
}

// 内容
.content {
	// v-bind() 只能接受一个 JS 表达式，表达式的结果必须是字符串或数字。如果需要拼接单位，请在表达式中拼接
	margin-top: v-bind('fixedTopHeight + "rpx"');
	display: flex;
	flex-direction: column;
	gap: 10rpx;
}


// 虚拟列表
.virtual-list-box {
	display: flex;
	flex-direction: column;
	gap: 10rpx;
}
.virtual-item-row-box {
	display: flex;
	flex-direction: column;
	gap: 10rpx;
}
.list-item-row {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 10rpx;
}
.list-item-col {
  display: flex;
  flex-direction: column;
  height: 350rpx;
  align-items: center;
  padding: 10rpx 10rpx;
  background-color: #fff;
  transition: background-color 0.2s ease;
  
  &:active {
    background-color: #f8f8f8;
  }
  
  .item-img {
    
    .avatar {
      width: 100rpx;
      height: 100rpx;
      border-radius: 12rpx;
      background-color: #f0f0f0;
    }
  }
  
  .item-title-box {
    display: flex;
	width: 100%;
	justify-content: space-between;
	align-items: center;
    word-break: break-all;
    .item-title {
      font-size: 28rpx;
      color: $uni-text-color;
      font-weight: 400;
      margin-bottom: 8rpx;
      // @include text-overflow;
    }
    
    .item-desc {
      font-size: 24rpx;
      color: $uni-text-color-grey;
      margin-bottom: 12rpx;
      word-break: break-all;
      // @include text-overflow-multi(2);
    }
    
  }
  
  .item-price-box {
    .item-price {
      font-size: 28rpx;
      color: $uni-color-primary;
      font-weight: 400;
    }
  }
}
// 操作按钮
.floating-buttons {
  position: fixed;
  right: 32rpx;
  bottom: 100rpx;
  z-index: 999;
  
  .btn {
    background-color: $uni-color-primary;
    color: white;
    padding: 16rpx 24rpx;
    border-radius: 50rpx;
    font-size: 24rpx;
    margin-bottom: 16rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    
    &:active {
      transform: scale(0.95);
      background-color: darken($uni-color-primary, 10%);
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
