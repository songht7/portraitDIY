var api = {
	"formal": {
		"interface": "https://api.bdmartech.com", //接口
		"domain": "http://m.bdmartech.com"
	},
	"dev": {
		"interface": "https://api-test.wsshanghai.com", //接口
		"domain": "http://train.wsshanghai.com"
	}
}
var lks = "dev";
export default {
	Interface: {
		"apiurl": api[lks]["interface"],
		"domain": api[lks]["domain"],
		"addr": {}
	}
}
