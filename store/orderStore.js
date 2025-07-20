import { defineStore } from 'pinia' 
import { ref } from 'vue'
export const useOrderStore = defineStore('order', () => {
    const orderList = ref({})
    // 添加订单
    const addOrder = async ({goods, status}) => {
        // 可能存在未付款等情况
        const res = await wx.cloud.callFunction({
            name: 'order',
            data: {
                type: 'add',
                goodsId: goods._id,
                status
            }
        })
        orderList.value[res.result.data._id] = {
            ...goods,
            status
        }
    }
    // 删除订单
    const deleteOrder = (orderId) => {
        orderList.value = orderList.value.filter(order => order.id !== orderId)
        wx.cloud.callFunction({
            name: 'order',
            data: {
                type: 'delete',
                orderId
            }
        })
    }
    // 获取订单列表
    const getOrderList = async () => {
        const res = await wx.cloud.callFunction({
            name: 'order',
            data: {
                type: 'get'
            }
        })
        // 后端已处理好数据结构：{orderId: {status, ...goods}}
        orderList.value = res.result.data
    }
    // 更新订单状态
    const updateOrder = async (orderId, status) => {
        await wx.cloud.callFunction({
            name: 'order',
            data: {
                type: 'update',
                orderId,
                status
            }
        })
        orderList.value[orderId].status = status
    }
    
    return { orderList, addOrder, deleteOrder, getOrderList, updateOrder }
})