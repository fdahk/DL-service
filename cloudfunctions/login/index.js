// 云函数入口文件
/* eslint-env node */
/* global exports */
/* global require */
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  // 获取前端传递的用户信息（可选）
  const { nickName, avatarUrl } = event

  // 查询用户是否已存在
  let userRes = await db.collection('users').where({ openid }).get()
  let userInfo

  if (userRes.data.length === 0) {
    // 新用户，插入数据库
    userInfo = {
      openid,
      createTime: new Date(),
      nickName: nickName || '',
      avatarUrl: avatarUrl || ''
    }
    await db.collection('users').add({ data: userInfo })
  } else {
    userInfo = userRes.data[0]
    // 可选：同步更新昵称和头像
    if (nickName && avatarUrl && (userInfo.nickName !== nickName || userInfo.avatarUrl !== avatarUrl)) {
      await db.collection('users').doc(userInfo._id).update({
        data: { nickName, avatarUrl }
      })
      userInfo.nickName = nickName
      userInfo.avatarUrl = avatarUrl
    }
  }

  return {
    code: 0,
    msg: '登录成功',
    data: userInfo
  }
}