var api = {
	"formal": {
		"interface": "https://api.bdmartech.com", //接口
		"domain": "http://m.bdmartech.com",
		"cosConfig": { //`https://plbs-test-1257286922.cos.ap-shanghai.myqcloud.com/...`
			"Bucket": 'plbs-test-1257286922',
			"Region": 'ap-shanghai',
			"SecretId": 'AKIDujJnIXMBSeeOuVMVt0sa2Jh5A90rcJoh',
			"SecretKey": 'tDI8jS2VWaXPDwUryoGblz2Z8B1k1QtF'
		}
	},
	"dev": {
		"interface": "https://api-test.wsshanghai.com", //接口
		"domain": "http://train.wsshanghai.com",
		"cosConfig": { //`https://jobpassport-1259247972.cos.ap-shanghai.myqcloud.com/...`
			"Bucket": 'jobpassport-1259247972',
			"Region": 'ap-shanghai',
			"SecretId": 'AKIDRbLQM4DqRnKgpzR1NlEUWP9jD7pJt1K3',
			"SecretKey": 'mNnzhBSUHtb6SWP4bulOmwwazA8RWTCV'
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
		"addr": {}
	}
}
