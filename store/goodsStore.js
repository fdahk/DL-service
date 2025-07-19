import {defineStore} from 'pinia'
import {ref} from 'vue'
// 第一个参数：
export const useGoodsStore = defineStore('goods', () => {
    // 商品状态
    const goodsInfo = ref(null) 

    const setCurrentGoods = (goods) => {
        goodsInfo.value = goods 
    }

    // 返回商品状态
    return {goodsInfo, setCurrentGoods}
})