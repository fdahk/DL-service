<template>
	<!-- 页面根容器  -->
	<view class="page">
		<!-- 顶部 -->
		<view class="custom-navbar">
			<!-- 搜索框 -->
			<view class="navbar-search-box" 
			:style="{ paddingRight: capsuleButtonInfo.width + 20 + 'px', height: statusBarHeight + 'px' }" >
				<SearchBar @tap="handleSearchTap" style="width: 100%;"/>
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
			<!-- 竖向商品展示(我靠，uvui没有虚拟列表) -->
			<view class="virtual-list-box">
				<!-- 虚拟列表 -->
				<VirtualList
				ref="virtualListRef"
				:data="listData[activeTab]"
				:item-height="450"
				:buffer-size="4"  
				:enable-load-more="true"
				:has-more="hasMore"
				:scroll-height="scrollHeight"
				key-field="id"
				@loadMore="handleLoadMore"
				@scroll="handleScroll"
				class="scroll-container"
				>
				<!-- 顶部展示区域 -->
				<template #topDispley1>
					<ScrollProductDisplay :brand="brand" :goodsList="goodsList" />
				</template>
				<template #topDispley2>
					<ScrollProductDisplay :brand="brand2" :goodsList="goodsList2" />
				</template>

				<!-- 作用域插槽 : 渲染若干个行item，构成渲染区域-->
				<template #default="{ visibleItems, itemHeight, getItemKey }">
					<view 
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
	import ScrollProductDisplay from '../../components/scrollProductDisplay.vue'
	import VirtualList from '../../components/virtualList.vue'
	import FloatingButton from '../../components/floatingButton.vue'
	import { useGoodsStore } from '../../store/goodsStore'
	const goodsStore = useGoodsStore()
	const statusBarHeight = uni.getWindowInfo().statusBarHeight + 44
	const activeTab = ref(1)
	const fixedTopHeight = ref(0)
	// 胶囊按钮信息 
	const capsuleButtonInfo = uni.getMenuButtonBoundingClientRect()
	// 虚拟列表
	const virtualListRef = ref(null)
	const listData = ref({})
	const hasMore = ref(true)
	const currentPage = ref(1)
	const scrollHeight = ref(0) //滚动区高度计算

	// 计算属性，用于获取虚拟列表的滚动位置
	// 注： 需要明确声明哪些数据是响应式的，尽管该值本身是实时更新的，但可能模板不存在响应式依赖，导致无法实时更新
	const computedScrollTop = computed(() => {
		// console.log(virtualListRef.value?.currentScrollTop) // 调试
		return virtualListRef.value?.currentScrollTop
	})
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
	const handleTabTap = async (id) => {
		// 先确保数据结构存在，避免 undefined
		if (!listData.value[id]) {
			listData.value[id] = []  // 设置为空数组而不是 undefined
		}
		
		activeTab.value = id  // 再切换 tab
		
		// 如果没有数据才加载
		if (listData.value[id].length === 0) {
			await loadData()
		} else {
			currentPage.value = Math.ceil(listData.value[id].length / 20)
		}
	}
	// tab列表
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

	// 加载数据
	const loadData = async () => {
		const res = await wx.cloud.callFunction({
			name: 'get',
			data: {
				skip: (currentPage.value - 1) * 20,
				limit: 20,
				category: tabList.value[activeTab.value - 1].name
			}
		})
		// 防止undefined
		if(!listData.value[activeTab.value]){
			listData.value[activeTab.value] = []
		}
		// 判断hasMOre 
		if(res.result.data.length < 20){
			hasMore.value = false
		}

		listData.value[activeTab.value] = [...listData.value[activeTab.value], ...res.result.data.reduce((acc, cur, idx) => {
		if (idx % 2 === 0) {
			acc.push(res.result.data.slice(idx, idx + 2));
		}
		return acc;
		}, [])];
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
		// 跳转页面，并保留当前页面在页面栈中（可以返回）
		try {
			uni.navigateTo({	
				url: '/pages/search/index'
			})	
		} catch (error) {
			console.error('跳转失败:', error)
		}
		
	}
	onMounted(() => {
		// 登录页跳转过来后再鉴定一下
		const userInfo = uni.getStorageSync('userInfo')
		if (!userInfo) {
			// 未登录，跳转到登录页
			uni.reLaunch({ url: '/pages/login/index' })
		}		
		// 固定顶部高度 = 状态栏高度 tab栏高度 + 总margin高度
		fixedTopHeight.value = statusBarHeight + 32.5 + 10
		scrollHeight.value = uni.getSystemInfoSync().windowHeight - fixedTopHeight.value
		console.log(fixedTopHeight.value)
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
	// 搜索框
	.navbar-search-box {
	box-sizing: border-box;
	width: 100%;
	display: flex;
	align-items: flex-end;
	justify-content: stretch;
	padding: 0 16rpx; 
	margin-bottom: 20rpx;
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
