"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/nearby/index.js";
  "./pages/market/index.js";
  "./pages/message/index.js";
  "./pages/user/index.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:7", "App Launch");
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:10", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:13", "App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    // 注：仅返回应用实例，uni-app 框架会自动处理挂载流程
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
