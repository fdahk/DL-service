<template>      
<!-- 滚动容器 -->
<!-- 滚动容器的高度等于“窗口高度 - 下拉刷新区域高度”，保证内容区始终可见。
只要滚动条滚动，handleScroll 就会被触发，组件会重新计算哪些数据需要渲染。 -->
<scroll-view
    scroll-y
    :scroll-top="scrollViewTop"
    :enable-back-to-top="enableBackToTop"
    :refresher-enabled="false"
    :style="{ height: scrollHeight + 'px' }"
    @scroll="handleScroll"
    @scrolltolower="handleScrollToLower"
    ref="scrollViewRef"
>
    <!-- 顶部展示区域(为了适配滚动，建议直接用插槽) -->
    <slot name="topDispley1"></slot>
    <slot name="topDispley2"></slot>
    <slot name="topDispley3"></slot>

    <!-- 虚拟容器 -->
    <!-- 撑开滚动条的总高度，让滚动条长度和真实数据量一致。
    虽然只渲染了部分数据，但通过设置虚拟容器的高度，用户滚动体验和渲染全部数据时一致。 -->
    <view class="virtual-container" :style="{ height: totalHeight + 'rpx' }">
        <!-- 占位区域 - 上方 -->
        <view class="placeholder-top" :style="{ height: offsetTop + 'rpx' }"></view>
        
        <!-- 可视区域 -->
        <view class="visible-items">
            <slot 
            :visibleItems="visibleItems" 
            :itemHeight="itemHeight"
            :startIndex="startIndex"
            :endIndex="endIndex"
            :getItemKey="getItemKey"
            >
              <!-- 默认渲染 -->
              <view 
                  v-for="(item, index) in visibleItems" 
                  :key="getItemKey(item, index)"
                  class="virtual-item"
                  :style="{ height: itemHeight + 'rpx' }"
              >
                  <view class="default-item">
                  <text>{{ JSON.stringify(item) }}</text>
                  </view>
              </view>

            </slot>
        </view>

        <!-- 占位区域 - 下方 -->
        <view class="placeholder-bottom" :style="{ height: offsetBottom + 'rpx' }"></view>
    </view>

    <!-- 加载更多区域 -->
    <view v-if="enableLoadMore" class="load-more-area" :class="{ loading: isLoadingMore }">
      <view v-if=" !hasMore" class="load-more-end">没有更多数据了</view>      
      <view v-else-if="!isLoadingMore && hasMore" class="load-more-text">上拉加载更多</view>
      <view v-else-if="isLoadingMore" class="load-more-loading">
          <text class="loading-icon">⟳</text>
          <text class="loading-text">加载中...</text>
      </view>
      
      <view v-else>
        <text>BUG</text>
      </view>
    </view>
</scroll-view>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  // 数据
  data: {
    type: Array,
    default: () => []
  },
  // 滚动区高度：仅用于计算
  scrollHeight: {
    type: Number,
    default: 1200
  },
  // 单个item的高度
  itemHeight: {
    type: Number,
    default: 120
  },
  // 缓冲区大小
  bufferSize: {
    type: Number,
    default: 4
  },
  // 是否启用上拉加载更多
  enableLoadMore: {
    type: Boolean,
    default: true
  },
  // 是否还有更多数据
  hasMore: {
    type: Boolean,
    default: true
  },
  // 是否启用回到顶部
  enableBackToTop: {
    type: Boolean,
    default: true
  },
  // 唯一标识字段
  // 注： 用于指明item的唯一标识的名字
  keyField: {
    type: String,
    default: 'id'
  }
})

const emit = defineEmits(['loadMore', 'scroll'])

// 响应式数据 - 关键修复：用不同变量避免循环依赖
const scrollViewRef = ref(null)
const scrollViewTop = ref(0) // 用于控制scroll-view的scroll-top
const currentScrollTop = ref(0) // 用于计算虚拟列表索引
const isLoadingMore = ref(false)
// 单位换算，任何函数获取的距离值都是px，需要换算成rpx
const windowInfo = uni.getWindowInfo()
const pxToRpx = 750 / windowInfo.screenWidth

// 防循环机制：标志防止滚动事件触发重复计算
const isProgrammaticScroll = ref(false)

// 数据总高度
const totalHeight = computed(() => {
  return props.data.length * props.itemHeight
})

// 可视区域数量
const visibleCount = computed(() => {
  if (!props.data.length || props.itemHeight <= 0) return 0
  
  const baseCount = Math.ceil(props.scrollHeight / props.itemHeight)
  // 基础数量 + 缓冲区数量 * 2 与 总数据长度 取最小值
  return Math.min(baseCount + props.bufferSize * 2, props.data.length)
})

// 起始索引
const startIndex = computed(() => {
  if (!props.data.length || props.itemHeight <= 0) return 0
  // 已滚动距离除以item高度，取整，得到当前滚动位置可视区对应的索引
  const scrollBasedIndex = Math.floor(currentScrollTop.value / props.itemHeight)
  // 当前索引减去缓冲区大小，得到要渲染的第一个item的索引
  const indexWithBuffer = scrollBasedIndex - props.bufferSize
  // 理论上要渲染的第一个item的索引和总数据长度取最小值，得到要渲染的第一个item的索引
  return Math.max(0, Math.min(indexWithBuffer, props.data.length - 1))
})

// 结束索引
const endIndex = computed(() => {
  if (!props.data.length) return 0
  
  const calculatedEnd = startIndex.value + visibleCount.value
 // 注： 左闭右开，要加一保证至少渲染一套数据
  return Math.min(props.data.length, Math.max(startIndex.value + 1, calculatedEnd))
})

// 渲染区域数据（可视+缓冲区）
const visibleItems = computed(() => {
  if (!props.data.length) return []
  
  const start = startIndex.value
  const end = endIndex.value
  
  if (start >= props.data.length || end <= start) {
    return []
  }
  
  try {
    const slicedData = props.data.slice(start, end)
    const result = slicedData.map((item, index) => ({
      ...item,
      virtualIndex: start + index, // 虚拟索引
      realIndex: index // 真实索引
    }))
    return result
  } catch (error) {
    console.error('数据切片错误:', error)
    return []
  }
})

// 上方占位区域高度
const offsetTop = computed(() => {
  return Math.max(0, startIndex.value * props.itemHeight)
})

// 下方占位区域高度
const offsetBottom = computed(() => {
  const remaining = props.data.length - endIndex.value//要减一
  return Math.max(0, remaining * props.itemHeight)
})

// 滚动到底部触发加载
const handleScrollToLower = () => {
  console.log('滚动到底部触发加载')
  if (props.enableLoadMore && props.hasMore && !isLoadingMore.value) {
    loadMore()
  }
}

// 获取item的唯一标识(该虚拟列表以一行作为一个item，而非最小单元)
// 注： item是一个包含两个itemCol对象的对象
const getItemKey = (item, index) => {
// 以每行数据的第一个item的唯一标识作为该行的唯一标识
return item[0][props.keyField] || `item-${startIndex.value + index}`
}


// 处理滚动事件
// 注：避免在编程式滚动时重复计算，避免循环
const handleScroll = (e) => {
  const { scrollTop: newScrollTop, scrollLeft, scrollHeight: sh, scrollWidth } = e.detail
  
  // 如果是编程式滚动，不更新currentScrollTop（避免循环）
  if (isProgrammaticScroll.value) {
    return
  }
  
  // 直接更新，保证渲染的即时性,注意单位换算
  currentScrollTop.value = Math.max(0, newScrollTop)*pxToRpx
  emit('scroll', {
    scrollTop: newScrollTop,
    scrollLeft,
    scrollHeight: sh,
    scrollWidth
  })
}

// 回到顶部
const scrollToTop = () => {
  isProgrammaticScroll.value = true
  
  // 注：uniapp官方文档解释：需要给一点随机值，避免出现不能滚动的BUG。微信端必须用此方法
  const randomOffset = Math.random() * 4 + 4
  scrollViewTop.value = 0 - randomOffset
  currentScrollTop.value = 0
  
  // 必须有
  // 使用 nextTick 确保响应式更新
  nextTick(() => {
    // 再次设置，确保生效
    scrollViewTop.value = 0
    currentScrollTop.value = 0
    
    // 延迟重置标志
    setTimeout(() => {
      isProgrammaticScroll.value = false
    }, 500) // 增加延迟时间
  })
}

// 上拉加载更多
const loadMore = async () => {
  if (isLoadingMore.value || !props.hasMore) return

  isLoadingMore.value = true

  try {
    await emit('loadMore')
  } catch (error) {
    console.error('加载更多失败:', error)
  } finally {
    isLoadingMore.value = false
  }
}

// 暴露方法
defineExpose({
  loadMore,
  scrollToTop,
  // getCurrentScrollTop: () => currentScrollTop.value,
  // currentScrollTop: currentScrollTop.value //错误暴露的是值，不是实时更新的
  currentScrollTop //正确暴露的是响应式引用，是实时更新的
})

// 监听数据变化
watch(() => props.data, (newData) => {
  nextTick(() => {
    if (!newData || !newData.length) {
      currentScrollTop.value = 0
      return
    }
    
    const maxScrollTop = Math.max(0, totalHeight.value - props.scrollHeight)
    if (currentScrollTop.value > maxScrollTop) {
      currentScrollTop.value = maxScrollTop
    }
  })
}, { deep: true })

</script>

<style scoped lang="scss">
.virtual-container {
position: relative;
width: 100%;
min-height: 100%; //注：当内容不足min-height时，底部的刷新栏依然会在外部，要上拉才能看见
display: flex;
flex-direction: column;
}

.placeholder-top,
.placeholder-bottom {
width: 100%;
}

.visible-items {
width: 100%;
}

.virtual-item {
width: 100%;
position: relative;
}

.default-item {
padding: 20rpx;
border-bottom: 1rpx solid #f0f0f0;
background-color: #fff;

text {
    font-size: 28rpx;
    color: $uni-text-color;
}
}

.load-more-area {
display: flex;
align-items: center;
justify-content: center;
height: 100rpx;
background-color: #f8f8f8;

&.loading {
    background-color: #fff;
}

.load-more-text {
    color: $uni-text-color-grey;
    font-size: 28rpx;
}

.load-more-loading {
    display: flex;
    align-items: center;
    gap: 16rpx;
    
    .loading-icon {
    font-size: 32rpx;
    color: $uni-color-primary;
    animation: rotate 1s linear infinite;
    }
    
    .loading-text {
    color: $uni-text-color-grey;
    font-size: 28rpx;
    }
}

.load-more-end {
    color: $uni-text-color-disable;
    font-size: 24rpx;
}
}

@keyframes rotate {
from {
    transform: rotate(0deg);
}
to {
    transform: rotate(360deg);
}
}
</style>