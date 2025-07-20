/* eslint-env node */
/* global exports */
/* global require */
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID
    const { goodsId, type, orderId = null, status = '' } = event 
    if(type === 'add'){
        const res = await db.collection('orders').add({
            data: {
                openid,
                goodsId,
                status,
                createTime: new Date()
            }
        })
        // 注：添加商品时，前端是在商品详情页的，前端有商品信息，后端不做处理
        return {
            code: 0,
            msg: '添加订单成功',
            data: res
        }
    }else if(type === 'delete'){
        const res = await db.collection('orders').doc(orderId).remove() 
        return {
            code: 0,
            msg: '删除订单成功',
            data: res
        }
    }else if(type === 'update'){
        const res = await db.collection('orders').doc(orderId).update({
            data: {
                status
            }
        })
        return {
            code: 0,
            msg: '更新订单状态成功',
            data: res
        }
    }else if(type === 'get'){
        const orderListRes = await db.collection('orders').where({openid}).get()
        const orderList = orderListRes.data // 订单数组
        const goodsIds = orderList.map(item => item.goodsId)
        const goodsListRes = await db.collection('goods').where({
            _id: db.command.in(goodsIds)
        }).get()
        const goodsList = goodsListRes.data // 商品数组
        const res = orderList.reduce((acc, item) => {
            const goods = goodsList.find(goods => goods._id === item.goodsId)
            acc[item._id] = {
                status: item.status,
                ...goods
            }
            return acc
        }, {})
        return {
            code: 0,
            msg: '获取订单成功',
            data: res
        }
    }
}
