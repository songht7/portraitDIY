<template>
	<view :class="['content',theme,customStyle,$store.state.systemInfo.platform == 'ios'?'t2ios':'']"
		:style="{'height':homePage?'100%':'auto'}">
		<view class="uni-padding-wrap uni-common-mt">
			<block v-if="homePage">
				<view class="home-box">
					<view class="home-main" @tap="upload()"></view>
				</view>
			</block>
			<block v-else>
				<block v-if="eCode=='xinda2021'">
					<view class="top-btns">
						<view class="reSet" @click="resetImg">
							< 返回 </view>
						</view>
				</block>
				<view class="p-boxxx">
					<view class="portrait-box" v-show="!selectImg">
						<imageWrapper ref="imageWrapper" :imgBg="imgBg" :imgBgEdit="imgBgEdit" :waterState="waterState"
							:watermark="watermark" :wmSize="wmSize" :maskImg="maskImg" :frame="frame">
							<view class="text" v-if="slots">
								头像
							</view>
						</imageWrapper>
					</view>
				</view>
				<view class="imgSelect">
					<view class="webQRCode" v-if="apiWaterState">
						<canvas class="tki-qrcode-canvas" canvas-id="tki-qrcode-canvas"
							:style="{width:QRSize+'px',height:QRSize+'px'}" />
					</view>
					<!-- <img v-if="watermark" :src="watermark" alt=""> -->
					<block v-if="qrtst">
						<view class=""
							style="width: 100%;padding-bottom: 50upx;background: #FFFFFF;position: relative;z-index: 102;">
							<view class="">
								透明度(0.1-1)
								<input type="text" style="background: #DDDDDD;" v-model="QROpacity">
							</view>
							<view class="">
								大小(0.1-10)
								<input type="text" style="background: #DDDDDD;" v-model="wmSize">
							</view>
							<view class="">
								颜色(0-150)
								<input type="text" style="background: #DDDDDD;" v-model="QRColor">
							</view>
							<view @click="setWebQRcode">生成二维码(button)</view>
						</view>
					</block>
					<view class="editBtnBox">
						<block v-if="eCode!='xinda2021'">
							<view class="editBtns">
								<view class="selPor" @tap="upload()">更换头像</view>
								<view class="selPor" @tap="upload('dec')">自定义挂件</view>
							</view>
							<view class="editBtns">
								<view class="editBtn reSet" @click="resetImg">重置</view>
								<view class="editBtn" @click="toImage">完成</view>
							</view>
						</block>
					</view>
				</view>
				<view class="portrait-main">
					<view class="ctgs">
						<view class="ctgs-line"></view>
						<block v-for="(obj,k) in swithCthType" v-if="imgList[obj.key].length" :key="k">
							<view :class="['selBtn',ctgis==obj.key?'selBtnOn':'']" @click="swithCth(obj.key)">
								{{obj.key=='logo'?company:''}}{{obj.name}}
							</view>
						</block>
						<block v-if="eCode=='xinda2021'">
							<view class="editBtn-confirm-box">
								<view class="editBtn-confirm" @click="toImage">确认</view>
							</view>
						</block>
					</view>
					<view class="ctgBox">
						<scroll-view class="ctgCont contList" scroll-x scroll-left="0">
							<view v-if="ctgis=='logo'&&apiWaterState"
								:class="['ctgImgBlock','watermark',waterState?'waterOn':'waterOff']"
								@click="setDec('watermark')">
								<img :src="watermark" class="ctgImg" alt="">
							</view>
							<block v-for="(obj,k) in imgList[ctgis]" :key="k">
								<view class="ctgImgBlock" @click="setDec(obj.st,`${obj.original_src}`)">
									<img :src="`${obj.original_src}`" class="ctgImg" alt="">
								</view>
							</block>
						</scroll-view>
					</view>
				</view>
			</block>
			<sunui-upimg-tencent v-show="false" :upImgConfig="upImgCos" @onUpImg="upCosData" @onImgDel="delImgInfo"
				ref="uImage">
			</sunui-upimg-tencent>
			<!-- <button type="primary" @tap="getUpImgInfoCos">获取上传Cos图片信息</button>
				<button type="primary" @tap="uImageTap">手动上传图片</button> -->
			<image-cropper :src="tempFilePath" :cropFixed="cropFixed" :cropWidth="cropWidth" :cropHeight="cropHeight"
				@confirm="confirm" @cancel="cancel"></image-cropper>
			<!-- <img src="" alt="" class="imgSmall"> -->
			<uni-popup :show="poptype === 'showNewImg'" position="full" mode="fixed" width='100' :bgStye="bgStye"
				@hidePopup="togglePopup('')">
				<view id="Generated">
					<!-- newImg.replace(/[\r\n]/g, "") -->
					<!-- <image class="imgs uni-newimg" id="NewImg" v-if="newImg" :src='newImg' mode="aspectFit"></image> -->
					<img class="imgs" id="NewImg" v-if="newImg" :src='newImg' alt="">
					<!-- 	<view class="imgs" id="ImgWrapper"></view> -->
					<view>长按保存图片</view>
					<view class="imgErr" v-if="imgErr">{{imgErr}}</view>
					<block class="showTst" v-if='showTst'>
						<view>{{newImg}}</view>
						<view><textarea class="textarea" v-model="base64Head"></textarea></view>
					</block>
					<view class="gen-btns">
						<view class="close-btn" @click="togglePopup('')">返回</view>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	// var html2canvas = require("@/common/html2canvas-1.3.2.js");
	import html2canvas from 'html2canvas'
	//Canvas2Image https://blog.csdn.net/qinleo6/article/details/109725952
	import Canvas2Image from '@/common/canvas2image'
	import QRCode from "@/common/qrcode.js";
	var cQRcode;
	import sunuiUpimgTencent from '@/components/sunui-upimg/sunui-upimg-tencent.vue';
	import imageWrapper from '@/components/image-wrapper.vue';
	import uniPopup from '@/components/uni-popup.vue';
	import ImageCropper from "@/components/invinbg-image-cropper/invinbg-image-cropper.vue";
	let COS = require('@/components/sunui-upimg/tencent-cos/cos-wx-sdk-v5.js');
	import {
		Base64
	} from 'js-base64';
	/***
	 *image-tools:: 图像转换工具，可用于图像和base64的转换
	 * https://ext.dcloud.net.cn/plugin?id=123#detail
	 * **/
	import {
		pathToBase64,
		base64ToPath
	} from '@/components/image-tools/index.js'
	export default {
		data() {
			return {
				company: "", //公司
				homePage: false, //定义是否有首页
				hasHome: false, //是否有首页
				theme: "", //主题色："","1"
				customStyle: "", //定制主题
				watermark: "", //站点水印二维码、logo
				waterState: false, //是否有水印
				apiWaterState: false, //后台是否允许开始水印
				QROpacity: 1, //水印透明度
				QRSize: 70, //水印大小
				wmSize: "0.5", //水印缩放大小
				QRColor: 0, //水印前景色
				qrtst: false, //水印测试
				showTst: false, //图片链接显示
				eCode: "aleinqi", //后台对应企业code: aleinqi, xinda
				base64Img: "",
				base64Head: "", //合成头像的64图
				tempFilePath: "",
				loclPath: "", //转义后图的本地路径
				cropFixed: true, //true false,
				cropWidth: 250, //裁切比 宽
				cropHeight: 250, //裁切比 高
				imgErr: "", //图片生成错误信息
				imgBg: {
					"src": "/static/default.jpg",
					"rotate": 0,
					"scale": 2.5,
					"delt": 0,
					"position": {}
				},
				imgBgEdit: false, //背景图是否可编辑
				maskImg: [],
				newImg: "",
				frame: "",
				"slots": false,
				loading: false,
				poptype: "",
				ctgis: "box", //当前选中tab类型
				selectImg: false,
				decType: '',
				picture_list: [],
				cosFlag: true,
				cosArr: [],
				swithCthType: [
					// {
					// 	"name": "挂件",
					// 	"key": "dec",
					// 	"myKey": "dec"
					// }, 
					{
						"name": "相框",
						"key": "box",
						"myKey": "frame"
					}, {
						"name": "LOGO",
						"key": "logo",
						"myKey": "logo"
					}, {
						"name": "挂件",
						"key": "img",
						"myKey": "special"
					}
				],
				imgType: ['img', 'box', 'logo'],
				imgList: {
					'img': [],
					'box': [],
					'logo': []
				},
				bgStye: "#FFF", //确认后弹框背景样式 background:bgStye
				upImgCos: {
					cosConfig: this.$store.state.cosConfig,
					// 是否开启notli(开启的话就是选择完直接上传，关闭的话当count满足数量时才上传)
					notli: false,
					// 图片数量
					count: 1,
					// 上传图片背景修改 
					upBgColor: '#E8A400',
					// 上传icon图标颜色修改(仅限于iconfont)
					upIconColor: '#eee',
					// 上传svg图标名称
					upSvgIconName: 'icon-certificate',
					//是否压缩上传照片(仅小程序生效)
					sizeType: true,
					//相机来源(相机->camera,相册->album,两者都有->all,默认all)
					sourceType: "all",
					path: 'data/portrait/',
					photoType: "portrait-diy-"
				}
			}
		},
		onLoad(option) {
			var that = this;
			var ws = option.ws ? true : false;
			var _qrtst = option.qrtst ? option.qrtst : false;
			var eCode = option.eCode ? option.eCode : that.eCode;
			var _theme = option.tm ? option.tm : "";
			var _company = option.company ? option.company : "";
			that.imgBgEdit = option.ib == 1 ? true : false;
			that.homePage = option.hp == 1 ? true : false;
			that.showTst = option.showTst ? option.showTst : false;
			that.hasHome = that.homePage;
			//that.waterState = ws;//url判断是否显示QR 现接接口
			that.qrtst = _qrtst; //qr测试
			that.eCode = eCode;
			that.company = _company;
			that.theme = "theme-" + _theme;
			if (eCode == 'xinda') {
				that.imgBg['src'] = "/static/default-xd.jpg";
			} else if (eCode == 'zhizhen') {
				that.imgBg['src'] = "/static/default-zhizhen.jpg";
			} else {
				that.imgBg['src'] = "/static/default2.jpg";
			}
			if (eCode == 'xinda2021') {
				that.swithCthType = [{
					"name": "相框",
					"key": "box",
					"myKey": "frame"
				}, {
					"name": "LOGO",
					"key": "logo",
					"myKey": "logo"
				}, {
					"name": "感言",
					"key": "img",
					"myKey": "special"
				}];
				that.customStyle = "xinda2021";
				that.frame = "/static/xinda/logo-box2.png";
				that.bgStye = "linear-gradient(#90f2fa, #c6f9fb)";
				uni.setNavigationBarTitle({
					title: '始于信 达于行'
				});
			}
			if (_theme == '2') {
				that.cropWidth = 200; //裁切比 宽
				that.cropHeight = 400; //裁切比 高
			}
			that.getImgList();
			that.checkQR();
		},
		onShow() {
			this.getBase64Image();
		},
		onReady() {
			var that = this;
		},
		components: {
			sunuiUpimgTencent,
			imageWrapper,
			ImageCropper,
			uniPopup
		},
		methods: {
			getImgList() { //获取图片列表
				var that = this;
				var _imgType = that.imgType;
				_imgType.forEach((obj, k) => {
					var imgKey = obj;
					var _data = {
						inter: "getMaterialList",
						parm: `?eCode=${that.eCode}&st=${imgKey}`,
						fun: function(res) {
							if (res.success) {
								let result = res.data;
								if (result.list) {
									let _list = result.list;
									var cList = [];
									if (that.imgList[imgKey]) {
										cList = that.imgList[imgKey];
									}
									that.imgList[imgKey] = [...cList, ..._list];
								}
								if (imgKey == 'box' && that.customStyle == "xinda2021") {
									//相框默认第一个
									that.frame = that.imgList[imgKey][0]['original_src'];
								}
								// console.log(imgKey);
								// console.log('------imgList-------');
								console.log("that.imgList：", that.imgList);
							}
						}
					};
					that.$store.dispatch("getData", _data)
				})
			},
			checkQR() { //检测是否显示QR
				var that = this;
				var _data = {
					inter: "qrcodeStatus",
					parm: `?eCode=${that.eCode}`,
					fun: function(res) {
						that.apiWaterState = false;
						that.waterState = false;
						if (res.success) {
							let result = res.data;
							//console.log(result.info)
							if (result.info == "1") {
								that.apiWaterState = true;
								that.waterState = true;
								that.setWebQRcode(); //生成站点二维码
							}
						}
					}
				};
				that.$store.dispatch("getData", _data)
			},
			upload(type) { //自定义上传图片
				var that = this;
				that.decType = type || '';
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: (res) => {
						if (type == 'dec') {
							var mk = {
								"url": res.tempFilePaths.shift(),
								"rotate": 0,
								"scale": 1,
								"delt": 0
							}
							that.maskImg.push(mk);
							return
						} else {
							that.tempFilePath = res.tempFilePaths.shift()
							that.selectImg = true;
						}
					}
				});
			},
			confirm(e) {
				var that = this;
				that.selectImg = false;
				that.tempFilePath = ''
				that.imgBg['src'] = e.detail.tempFilePath;
				that.homePage = false;
			},
			cancel() {
				this.selectImg = false;
				this.tempFilePath = '';
				console.log('canceled')
			},
			swithCth(ctgis) {
				this.ctgis = ctgis;
			},
			setWebQRcode() { //生成QR 站点URL
				var that = this;
				var webUrl = that.$store.state.interface.domain + '#/?eCode=' + that.eCode + '&company=' + that.company +
					'&tm=' + that.theme + '&ib' + that.imgBgEdit + '&hp' + that.homePage;
				if (cQRcode) {
					cQRcode.clear()
				}
				cQRcode = new QRCode({
					context: that, // 上下文环境
					canvasId: "tki-qrcode-canvas", // canvas-id
					text: webUrl, // 生成内容
					correctLevel: 0, // 容错级别0、1、2、3，数字越大说明所需纠错级别越大
					background: `rgba(255, 255, 255, ${that.QROpacity})`, //背景色
					foreground: `rgba(${that.QRColor}, ${that.QRColor}, ${that.QRColor}, ${that.QROpacity})`, //前景色
					size: that.QRSize, // 二维码大小
					cbResult: function(res) { // 生成二维码的回调
						that.watermark = res;
					},
				});
			},
			setDec(type, url) {
				var that = this;
				if (type == 'watermark') {
					that.waterState = !that.waterState;
				} else {
					that.getBase64Image(type, url); //网络图片需先转base64
					//that.setImgToCanvas(type, url); //点击图片放入容器
				}
			},
			resetImg() {
				var that = this;
				that.maskImg = [];
				if (that.eCode == 'xinda2021') {
					// that.frame = "/static/xinda/logo-box2.png"
				} else {
					that.frame = "";
				}
				if (that.hasHome) {
					that.homePage = true;
				}
			},
			async toImage() {
				//使用html2canvas
				var that = this;
				await that.resetEditType();
				if (that.loading) {
					return false
				};
				var obj = document.getElementById("ImageWrapper");
				var width = obj.offsetWidth;
				var height = obj.offsetHeight;
				that.loading = true;
				uni.showLoading({
					title: "正在生成..."
				})
				var __platform = that.$store.state.systemInfo.platform;
				let opts = {
					backgroundColor: "transparent",
					useCORS: true, //网络图片
					allowTaint: true,
					tainttest: true,
					scale: __platform == 'ios' ? window.devicePixelRatio / 2 : window.devicePixelRatio,
					width: width,
					height: height
				};
				(window.html2canvas || html2canvas)(obj, opts)
				// html2canvas(obj, opts)
				.then(canvas => {
						that.loading = false;
						uni.hideLoading()
						let dataURL = canvas.toDataURL("image/png", 0.6); //转成base64压缩 image/png  image/jpeg
						let imgName = Date.parse(new Date()) + '.png';

						that.poptype = "showNewImg";
						that.$store.state.portrait = dataURL;
						if (__platform == 'ios') {
							dataURL = canvas.toDataURL("image/jpeg", 0.8); //转成base64压缩 image/png  image/jpeg
							// that.base64Head = dataURL;
							// if (that.showTst) {
							// 	that.putToCos({
							// 		//file: that.dataURLtoBlob(bbb)
							// 		file: that.dataURLtoBlob(dataURL)
							// 	});
							// } else {
							// 	that.putToCos({
							// 		file: that.dataURLtoBlob(dataURL)
							// 	});
							// }
						} else {
							// let u=''
							// that.base64Head = dataURL;
							// that.newImg = dataURL;
						}
							that.base64Head = dataURL;
							that.newImg = dataURL;
							
						// console.log("portrait:", that.$store.state.portrait)
						// ----------
						// that.newImg = "http://plbs-test-1257286922.cos.ap-shanghai.myqcloud.com/data/image_doc/1623056782061.png";
						// ----------
						// base64ToPath(dataURL)
						// 	.then(path => {
						// 		console.log(path)
						// 		that.loclPath = path;
						// 		that.putToCos({blob, file, formData, path});
						// 	})
						// 	.catch(error => {
						// 		console.error(error)
						// 		that.newImg = dataURL;
						// 	})
						// ----------
					})
					.catch(err => {
						// do sth
						that.imgErr = err;
					});
			},
			blobToFile: function(theBlob) { //将blob转换为file
				var that = this;
				theBlob.lastModifiedDate = new Date();
				theBlob.name = Date.parse(new Date()) + '.png';
				//that.putToCos({file:theBlob});
				return theBlob;
			},
			dataURLtoBlob(dataurl) { //将base64转换为blob
				var arr = dataurl.split(',');
				var mime = arr[0].match(/:(.*?);/)[1];
				var bstr = atob(arr[1]);
				var n = bstr.length;
				var u8arr = new Uint8Array(n);
				while (n--) {
					u8arr[n] = bstr.charCodeAt(n);
				}
				return new Blob([u8arr], {
					type: mime
				});
			},
			putToCos(parms = {}) {
				/*
					{file}
					file【file, blob,formData, path, buffer】
				*/
				var that = this;
				var configs = that.upImgCos;

				let cosConfig = {
					Bucket: configs.cosConfig.Bucket,
					Region: configs.cosConfig.Region,
					SecretId: configs.cosConfig.SecretId,
					SecretKey: Base64.decode(configs.cosConfig.SKey)
				}

				let cos = new COS({
					getAuthorization: (params, callback) => { //获取签名 必填参数
						console.log("params:", params)
						let authorization = COS.getAuthorization({
							SecretId: cosConfig.SecretId,
							SecretKey: cosConfig.SecretKey,
							Method: params.Method,
							Key: params.Key
						});
						callback(authorization);
					}
				});
				var __platform = that.$store.state.systemInfo.platform;
				let fileName = Date.parse(new Date()) / 1000 + (__platform == 'ios' ? '.jpg' : '.png');
				// let fileName = Date.parse(new Date()) / 1000 + '.png';
				let platform = that.$store.state.systemInfo.platform;
				let opt = {
					Bucket: cosConfig.Bucket,
					Region: cosConfig.Region,
					Key: configs.path + configs.photoType + '-' + platform + '-' + fileName
				};
				var __callBack = function(err, data) {
					if (err == null) {
						// console.log(`%c 腾讯云上传(成功返回地址):${data.headers.Location}`, 'color:#1AAD19');
						// upload_picture_list[j]['path_server'] = data.headers.Location;
						let path_server = `https://${opt.Bucket}.cos.${opt.Region}.myqcloud.com/${opt.Key}`;
						console.log("path_server:", path_server)
						that.newImg = path_server;
					} else {
						console.log(`%c 腾讯云上传失败:${JSON.stringify(err)}`, 'color:#f00');
						return;
					}
				}
				// --- postObject -------
				// cos.postObject({
				// 	...opt,
				// 	FilePath: parms.file
				// }, (err, data) => {
				// 	// console.log("err:", err)
				// 	// console.log("data:", data)
				// 	__callBack(err, data)
				// });
				// --- putObject -------
				console.log("parms.file:", parms.file)
				cos.putObject({
					...opt,
					Body: parms.file,
					onTaskReady: function(tid) {
						console.log('onTaskReady', tid);
					},
					onTaskStart: function(info) {
						console.log('onTaskStart', info);
					},
					onProgress: function(progressData) {
						console.log(JSON.stringify(progressData));
					},
					Headers: {
						// 万象持久化接口，上传时持久化
						// 'Pic-Operations': '{"is_pic_info": 1, "rules": [{"fileid": "test.jpg", "rule": "imageMogr2/thumbnail/!50p"}]}'
					},
				}, function(err, data) {
					__callBack(err, data)
					console.log("putToCos:", err, data)
				});

			},
			resetEditType() {
				this.$refs.imageWrapper.editType = "";
			},
			getBase64Image(type, dataURL) {
				var that = this;
				uni.showToast({
					title: '',
					icon: 'loading',
					duration: 1500
				});
				var img = new Image();
				img.crossOrigin = 'Anonymous'; // 重点！设置image对象可跨域请求
				img.setAttribute('crossorigin', ' *');
				img.src = dataURL + "?t=" + new Date().getTime();
				img.onload = function() {
					var canvas = document.createElement("canvas");
					canvas.width = img.width;
					canvas.height = img.height;
					var ctx = canvas.getContext("2d");
					// ctx.setFillStyle('transparent');
					// ctx.fillRect(0, 0, img.width, img.height);
					// ctx.save()
					ctx.drawImage(img, 0, 0, img.width, img.height);
					var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
					var dataURL = canvas.toDataURL("image/" + ext);
					that.base64Img = dataURL;
					uni.hideToast();
					that.setImgToCanvas(type, dataURL) //转译为base64后放入容器
					return dataURL;
				}

			},
			setImgToCanvas(type, _url) {
				var that = this;
				setTimeout(() => {
					if (type == 'logo' || type == 'img') {
						var mk = {
							"url": _url,
							"rotate": 0,
							"scale": 1,
							"delt": 0
						}
						that.maskImg.push(mk);
					} else if (type == 'box') {
						that.frame = _url;
					}
				}, 500)
			},
			togglePopup(type) {
				var that = this;
				that.poptype = type;
				if (type == '') {
					that.$refs.uImage.upload_picture_list = [];
					//console.log(that.$refs.uImage.upload_picture_list)
				}
			}, // 手动上传图片(适用于表单等上传)
			uImageTap() {
				this.$refs.uImage.uploadimage(this.upImgCos);
			},
			// 删除图片 -(本地图片进行删除)
			async delImgInfo(e) {
				console.log('你删除的图片地址为:', e);
			},
			// 腾讯云
			async upCosData(e) {
				if (this.cosFlag) {
					this.cosArr = await e;
					// 可以根据长度来判断图片是否上传成功.
					if (this.cosArr.length == this.upImgCos.cosConfig.count) {
						uni.showToast({
							title: `上传成功`,
							icon: 'none'
						});
					}
				}
				this.cosFlag = false;

			},
			// 获取上传图片腾讯云
			async getUpImgInfoCos() {
				let arrImg = [];
				for (let i = 0, len = this.cosArr.length; i < len; i++) {
					try {
						if (this.cosArr[i].path_server != "") {
							await arrImg.push(this.cosArr[i].path_server.split(','));
						}
					} catch (err) {
						console.log('上传失败...');
					}
				}
				console.log('腾讯云转成一维数组:', arrImg.join().split(','));
			}
		}
	}
</script>

<style scoped>
	@import "/common/index.css";
</style>
