7.18： 
    BUG: 1.微信开发者工具的编译功能问题
         2.组件样式应该写在使用它的地方
7.19： 
    1.  当 props.data 变化时，Vue 3 的执行顺序：
        触发响应式更新
        重新计算所有依赖该数据的计算属性
        更新模板渲染
        执行 watch 回调
    2.bug: 由于虚拟列表的slot更新时机与数据延迟问题导致的崩溃
        1.slot内的数据访问加上可选链，避免中途导致程序崩溃
        2.修复数据不成对情况下的渲染样式问题:
            原因：v-for 遍历时按照数量创建模板，即使其中有元素是undefined
            ps: 可选链是vue3的语法，vue2不支持，item?.[1]返回undefined
            解决：过滤数据形成新数组，避免渲染无效数据
        3.注：:src="item" 而非 :src={item}
        4.:style="{height: statusBarHeight + 'px'}" 记得加单位
        5.:second='"极速退款"' 字符串需要加引号
        6.uniapp规定：pages下不能乱放文件
        7.双标签、自闭合标签：双标签需处理插槽，不用插槽的话自闭合性能更高 
        8.富样式文本：
            1.基线对齐：align-items: baseline
            2.text包裹：作为文本流
        9.v-show原理: <!-- 等价于 -->
            <view style="display: none;">内容</view>
            <view style="display: block;">内容</view>
            bug：CSS 中的 flex 覆盖了v-show 的 display: none，导致v-show失效
            ps：一般不会出现这个情况的原因：一般不在某组件的根元素上使用flex
        10.flex元素的主轴大小由父元素决定
        11. activeTab.value = computed() 和 const activeTab = computed()  后者正确 
        12. 滑轨动画方案
7.20:
    1.云函数上传失败：本地调试找原因
    2.小程序不会销毁页面 
    3.搜索框组件的兼容性问题： 搜索框组件的宽度在使用处定义(flex1\width100% 均适配)，高度组件内实现 

7.21：
    1.store值不能直接赋值，特别是初始值为null，建议写action函数

7.22
    1.Vue 的响应式数据变化后，DOM 并不会立刻更新，而是等本轮“宏任务”结束后统一异步更新 DOM。
        如果在数据变化后立刻访问 DOM 或依赖 DOM 状态的变量，拿到的可能还是“旧的”DOM。
    2.父子组件的变量名细节
        父组件 <VirtualList :has-more="hasMore" />
        子组件const props = defineProps({ hasMore: Boolean })
        HTML规范里，属性名是不区分大小写的，所以属性名通常用小写字母和短横线命名，比如 has-more。
            在JavaScript 代码里，变量名和 props 推荐用小驼峰（camelCase），比如 hasMore。
            Vue 会自动把模板里的 has-more 转换为 JS 里的 hasMore，并进行匹配。
    3.微信小程序 TabBar 的高度是固定的，一般为 50px（物理像素），在不同设备上会自动适配
        小程序没有直接的 API 获取 TabBar 高度，但你可以通过 uni.getSystemInfoSync() 获取屏幕高度、窗口高度，间接推算 TabBar 高度
    4.虚拟列表的高度在引用处设置，非组件内实现
    5.scroll-view 需要指定 :style="{ height: scrollHeight + 'px' }"
    6.普通文档流中，min-height: 100% 是基于其父元素的高度计算的
        flex容器在主轴方向上，子元素的高度会自动撑开父元素
        交叉轴（Cross Axis）默认不会自动撑开，需要额外设置 align-items: stretch（默认值