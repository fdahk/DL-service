import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";

// 导出 ESLint 配置数组，供 ESLint 使用
export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,vue}"], plugins: { js }, extends: ["js/recommended"] },
  
  // 添加 wx 全局变量
  { files: ["**/*.{js,mjs,cjs,vue}"], languageOptions: { 
     globals: { ...globals.browser, wx: "readonly", uni: "readonly" },
   } },

  pluginVue.configs["flat/essential"],
  {
    rules: {
      // 关闭多单词组件名校验
      "vue/multi-word-component-names": "off"
    }
  }
]);
