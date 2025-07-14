"use strict";
const common_vendor = require("../../common/vendor.js");
const Nav = () => "../../components/nav.js";
const _sfc_main = {
  // Vue3 就需要注册组件，只是现代工具链vibe或组合式api自动化了这个过程
  components: {
    Nav
    // 注：必须注册组件，否则无法使用
  },
  data() {
    return {
      title: "Hello"
    };
  },
  onLoad() {
  },
  methods: {}
};
if (!Array) {
  const _component_Nav = common_vendor.resolveComponent("Nav");
  _component_Nav();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {};
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
