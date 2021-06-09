/* ********************************************************
 * url 参数说明 ?eCode=abc&tm=2&ib=1&hp=1
 * eCode: 企业码
 * tm: theme主题 =1(1:1) =2(2:3)
 * ib: imgBgEdit编辑照片是否可编辑（放大缩小旋转），默认false,1=true
 * hp: homePage是否有首页（添加图片），默认false,1=true
 * ********************************************************
 * 信达2020 ?eCode=xinda&tm=1
 * 信达2021 ?eCode=xinda2021&tm=2&ib=1&hp=1
 * 质贞 ?eCode=zhizhen
 * ********************************************************
 * 小图标，logo：200*X , X*200 (以下)
 * 相框：1:1（400*400）,2:3（400*600）。50kb以内（100kb以内必须）
 * */
var api = {
	"formal": {
		"interface": "https://api.bdmartech.com", //接口
		"domain": "http://m.bdmartech.com",
		"cosConfig": { //`https://plbs-test-1257286922.cos.ap-shanghai.myqcloud.com/...`
			"Bucket": 'plbs-test-1257286922',
			"Region": 'ap-shanghai',
			"SecretId": '',
			"SecretKey": ''
		},
		"wx": {
			"AppID": "wx11eb371cd85adfd4",
			"ast": ""
		}
	},
	"dev": {
		"interface": "http://api-head.wsshanghai.com", //接口
		"domain": "http://portrait.bdmartech.com/",
		"cosConfig": { //`https://jobpassport-1259247972.cos.ap-shanghai.myqcloud.com/...`
			"Bucket": 'plbs-test-1257286922',
			"Region": 'ap-shanghai',
			"SecretId": '',
			"SecretKey": ''
		},
		"wx": {
			"AppID": "wxb33e824504e4a764",
			"ast": ""
		}
	}
}
var lks = "dev";
export default {
	Interface: {
		"site": lks,
		"apiurl": api[lks]["interface"],
		"domain": api[lks]["domain"],
		"cosConfig": api[lks]["cosConfig"],
		"wxInfo": api[lks]["wx"],
		"addr": {
			"getCos": "/v6/ApiBase-getCos.htm", //获取腾讯云cos临时密钥
			"getWeChatInfo": "/v6/ApiWeChat-getWeChatInfo.htm", //用户授权后获取用户信息 ?code=xxx
			"getWeChatOpenId": "/v6/ApiWeChat-getWeChatOpenId.htm", //静默授权后获取用户信息 ?code=xxx
			"getMaterialList": "/v6/ApiMaterial-getMaterialList.htm", //获取头像所需素材接口?eCode=aleinqi&st=logo(logo:logo,img:图标，box：相框)
			"slideShow": "/v6/ApiBase-slideShow.htm", //广告位列表 ?eCode=aleinqi
			"slideShow2": "/v6/ApiBase-slideShow.htm", //记录广告位点击 [POST] ?id=1
			"headImage": "/v6/ApiCustomer-headImage.htm", //上传头像接口 [POST] ?eCode=aleinqi&openid=123
			"qrcodeStatus": "/v6/ApiBase-qrcodeStatus.htm" //QR是否显示 ?eCode=aleinqi
		}
	}
}
