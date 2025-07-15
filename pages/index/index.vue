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
			<uv-list
				:list="goodsList"
				:finished="finished"
				@load="loadMore"
			>
				<template #default="{ item, index }">
				<view class="item">
					<image :src="item.img" mode="scaleToFill" style="width: 100rpx; height: 100rpx;" />
					<view>￥{{ item.price }}</view>
				</view>
				</template>
			</uv-list>
		</view>
	</view>
</template>

<script setup>
	import { ref, onMounted } from 'vue'
	import SearchBar from '../../components/search.vue'
	import ScrollProductDisplay from '../../components/scrollProductDisplay.vue'
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

	onMounted(() => {
		uni.getSystemInfo({
			success: (res) => {
				statusBarHeight.value = (res.statusBarHeight || 44) * 2
				// 固定顶部高度 = 状态栏高度 + 搜索框高度 + tab栏高度 + 间距
				fixedTopHeight.value = statusBarHeight.value + 88 + 20 + 65 + 10
			}
		})
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

.title {
	font-size: 36rpx;
	color: #333;
	margin-bottom: 20rpx;
}

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
