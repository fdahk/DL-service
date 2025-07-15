"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uv_list2 = common_vendor.resolveComponent("uv-list");
  _easycom_uv_list2();
}
const _easycom_uv_list = () => "../../uni_modules/uv-list/components/uv-list/uv-list.js";
if (!Math) {
  (SearchBar + ScrollProductDisplay + _easycom_uv_list)();
}
const SearchBar = () => "../../components/search.js";
const ScrollProductDisplay = () => "../../components/scrollProductDisplay.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    common_vendor.useCssVars((_ctx) => ({
      "7646fb8b": fixedTopHeight.value + "rpx"
    }));
    const statusBarHeight = common_vendor.ref(0);
    const activeTab = common_vendor.ref(1);
    const fixedTopHeight = common_vendor.ref(0);
    const brand = common_vendor.ref({
      logo: "/static/pngs/baiyi.png",
      title: "百亿补贴",
      desc: "大牌正品"
    });
    const goodsList = common_vendor.ref([
      { id: 1, img: "/static/pngs/cxk.png", price: 3590 },
      { id: 2, img: "/static/pngs/cxk.png", price: 1790 },
      { id: 3, img: "/static/pngs/cxk.png", price: 1599 },
      { id: 4, img: "/static/pngs/cxk.png", price: 4657 }
    ]);
    const brand2 = common_vendor.ref({
      logo: "/static/pngs/maicai.png",
      title: "多多买菜",
      desc: "次日自提"
    });
    const goodsList2 = common_vendor.ref([
      { id: 1, img: "/static/pngs/cgx.jpg", price: 3590 },
      { id: 2, img: "/static/pngs/cgx.jpg", price: 1790 },
      { id: 3, img: "/static/pngs/cgx.jpg", price: 1599 },
      { id: 4, img: "/static/pngs/cgx.jpg", price: 4657 }
    ]);
    const handleTabTap = (id) => {
      activeTab.value = id;
    };
    const tabList = common_vendor.ref([
      { id: 1, name: "首页" },
      { id: 2, name: "食品" },
      { id: 3, name: "百货" },
      { id: 4, name: "运动" },
      { id: 5, name: "医药" },
      { id: 6, name: "手机" },
      { id: 7, name: "水果" },
      { id: 8, name: "男装" },
      { id: 9, name: "女装" },
      { id: 10, name: "电器" },
      { id: 11, name: "鞋包" }
    ]);
    common_vendor.onMounted(() => {
      common_vendor.index.getSystemInfo({
        success: (res) => {
          statusBarHeight.value = (res.statusBarHeight || 44) * 2;
          fixedTopHeight.value = statusBarHeight.value + 88 + 20 + 65 + 10;
        }
      });
    });
    const handleSearchTap = () => {
      try {
        common_vendor.index.navigateTo({
          url: "/pages/search/index"
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:112", "跳转失败:", error);
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleSearchTap),
        b: common_vendor.f(tabList.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: item.id,
            c: common_vendor.o(($event) => handleTabTap(item.id), item.id),
            d: item.id === activeTab.value ? 1 : ""
          };
        }),
        c: statusBarHeight.value + "rpx",
        d: common_vendor.p({
          brand: brand.value,
          goodsList: goodsList.value
        }),
        e: common_vendor.p({
          brand: brand2.value,
          goodsList: goodsList2.value
        }),
        f: common_vendor.w(({
          item,
          index
        }, s0, i0) => {
          return {
            a: item.img,
            b: common_vendor.t(item.price),
            c: i0,
            d: s0
          };
        }, {
          name: "d",
          path: "f",
          vueId: "1cf27b2a-3"
        }),
        g: common_vendor.o(_ctx.loadMore),
        h: common_vendor.p({
          list: goodsList.value,
          finished: _ctx.finished
        }),
        i: common_vendor.s(_ctx.__cssVars())
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
