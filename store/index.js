import Vue from 'vue'
import Vuex from 'vuex'
import common from "../common.js"
var jweixin = require('jweixin-module')
Vue.use(Vuex)


/*
 *	dispatch.actions
 * 	commit.mutations
 * */
const store = new Vuex.Store({
	state: {
		loading: "0",
		data: {},
		interface: common.Interface,
		systemInfo: {},
		imgTemp: "",
		wxInfo: common.Interface.wxInfo,
		isWeixin: false,
		portrait: "",
		cosConfig: common.Interface.cosConfig
	},
	mutations: {
		update_data(state, data) {
			state.data = data
		},
		setSystemInfo(state, data) {
			state.systemInfo = data
		}
	},
	actions: {
		getData(ctx, parm) {
			let _parm = parm.parm || '';
			let _url = ctx.state.interface.apiurl + ctx.state.interface.addr[parm.inter] + _parm
			console.log("getData-url-", parm.inter, "：", _url)
			console.log("getData-parm-", parm.inter, "：", parm)
			var result = [];
			uni.request({
				url: _url,
				data: parm.data || {},
				method: parm.method || "GET",
				header: parm.header || {},
				success(res) {
					console.log("getData-success-", parm.inter, "：", res)
					//console.log(res)
					if (res.success) {
						ctx.commit("update_data", res.data.data)
					}
					result = res.data
				},
				fail(err) {
					console.log("getData-err-", parm.inter, "：", err)
					result = {
						"success": false,
						"msg": "接口请求失败",
						"err": err
					}
				},
				complete() {
					ctx.commit("switch_loading", "0")
					if (parm.fun) {
						new parm.fun(result)
					}
				}
			})
		},
		isWeixin(ctx) {
			let _isWeixin = !!/micromessenger/i.test(navigator.userAgent.toLowerCase());
			ctx.state.isWeixin = _isWeixin;
		},
		getWXCode(ctx) {
			var appid = ctx.state.interface.wxInfo.AppID;
			if (!ctx.state.isWeixin) {
				return
			}
			var _uWXInfo = "";
			uni.getStorage({
				key: 'uWXInfo',
				success: function(res) {
					_uWXInfo = res.data;
				},
				complete: function() {
					// console.log("=====getStorage-_uWXInfo======")
					// console.log(_uWXInfo)
					if (_uWXInfo && _uWXInfo.openid) {
						var __openid = _uWXInfo.openid;
					} else {
						let redirect_uri = ctx.state.interface.domain;
						let REDIRECT_URI = encodeURIComponent(redirect_uri), //授权后重定向的回调链接地址， 请使用 urlEncode 对链接进行处理
							scope = "snsapi_userinfo", //snsapi_base，snsapi_userinfo （弹出授权页面，获取更多信息）
							state = "STATE"; //重定向后会带上state参数，开发者可以填写a-zA-Z0-9的参数值，最多128字节
						var _url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' +
							REDIRECT_URI +
							'&response_type=code&scope=' + scope + '&state=' + state + '#wechat_redirect';
						let code = ctx.dispatch("queryString", 'code');
						//console.log(_url)
						if (code) {
							//console.log(code)
							ctx.dispatch("userLogin", code);
						} else {
							window.location.href = _url;
						}
					}
				}
			});

		},
		getSystemInfo(ctx) {
			var systemInfo = {}
			uni.getSystemInfo({
				success(res) {
					systemInfo = res
					console.log(systemInfo);
				},
				complete() {
					ctx.commit("setSystemInfo", systemInfo)
				}
			});
		}
	},
	modules: {}
})
export default store
