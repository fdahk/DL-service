/* eslint-env node */
/* global exports */
/* global require */
const cloud = require('wx-server-sdk') 
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database() 
exports.main = async (event, context) => {
    const {searchValue} = event 
    try {
        const res = await db.collection('goods').where({
            title: db.RegExp({
                regexp: searchValue,
                options: 'i'
            })
        }).get()
        return {
            code: 0,
            msg: '搜索成功',
            data: res.data
        } 
    } catch (error) {
        console.error(error)
        return {
            code: 1,
            msg: '搜索失败',
            data: []
        }
    }
}