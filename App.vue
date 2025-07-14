<script>
	// 导出一个对象，作为 App.vue 组件的配置。这个对象会被 uni-app 框架识别为应用的根组件
	// 这是uniapp特有的写法结构，也是推荐的结构
	// 这些钩子是 uni-app 框架自动调用的，只有在 App.vue 的 export default 里定义才会生效
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
