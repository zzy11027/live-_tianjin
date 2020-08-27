import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import QS from "qs";
import wx from "weixin-js-sdk";
import wxConfig from "@/utils/wxshare.js"; //全局微信js-sdk
import $ from "jquery"; //全局jquery
import HTTPS from "@/utils/https.js"; //全局axios
import ENV from "@/utils/env.js"; //全局环境
import webSocket from "@/utils/socket.js"; //全局socket
import "@/assets/hotcss/hotcss.js"; //全局rem
import "./assets/css/reset.css"; //全局css
import "./assets/font/font.scss"; //全局字体图标

const baseURL = {
    value: process.env.VUE_APP_BASE_API,
    writable: false,
    env: process.env.NODE_ENV
};
Vue.config.productionTip = false;
Vue.prototype.wxConfig = wxConfig;
Vue.prototype.$axios = axios;
Vue.prototype.qs = QS;
Vue.prototype.$ = $;
Vue.prototype.HTTPS = HTTPS;
Vue.prototype.baseURL = baseURL;
Vue.prototype.ENV = ENV;
Vue.prototype.webSocket = webSocket;
Vue.prototype.wx = wx;

//按需引入 需注册babel.config.js
// Vue.component('Button', Button);
// Vue.component('Table', Table);

new Vue({
    router,
    store,
    render: (h) => h(App)
}).$mount("#app");
