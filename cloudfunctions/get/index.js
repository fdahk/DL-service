/* eslint-env node */
/* global exports */
/* global require */
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 初始化云环境
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext() //获取微信调用上下文，包括 openid、appid 等信息
  const openid = wxContext.OPENID //获取当前用户的 openid
  const { skip, limit, category } = event  
  let goods = []
  if(category === "首页"){
    goods = await db.collection('goods').orderBy('salesCount', 'desc').skip(skip).limit(limit).get()
  }
  else {
    goods = await db.collection('goods').where({ category }).skip(skip).limit(limit).get()
  }
  return goods
}
