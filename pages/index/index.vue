<template>
	<!-- 页面根容器  -->
	<view class="page">
		<Nav />
		<!-- 添加一些内容，避免页面完全空白 -->
		<view class="content">
			<text>页面内容</text>
		</view>
	</view>
</template>

<script>
	import Nav from "../../components/nav.vue";
	export default {
		// Vue3 就需要注册组件，只是现代工具链vibe或组合式api自动化了这个过程
		components: {
			Nav  // 注：必须注册组件，否则无法使用
		},
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
.page {
	height: 100vh;
}

.content {
	padding: 20px;
	/* 预留导航栏空间 */
	margin-top: 88px; /* 状态栏 + 导航栏高度 */
}
</style>
