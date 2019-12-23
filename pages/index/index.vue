<template>
	<view class="content">
		<view class="uni-padding-wrap uni-common-mt">
			<view class="portrait-box" v-show="!selectImg">
				<imageWrapper ref="imageWrapper" :imgBg="imgBg" :maskImg="maskImg" :frame="frame">
					<view class="text" v-if="slots">
						头像
					</view>
				</imageWrapper>
			</view>
			<view class="portrait-main">
				<view class="ctgs">
					<view :class="['selBtn',ctgis=='special'?'selBtnOn':'']" @click="swithCth('special')">圣诞专题</view>
					<view :class="['selBtn',ctgis=='dec'?'selBtnOn':'']" @click="swithCth('dec')">挂件</view>
					<view :class="['selBtn',ctgis=='logo'?'selBtnOn':'']" @click="swithCth('logo')">企业LOGO</view>
				</view>
				<view class="ctgBox">
					<block v-if="ctgis=='special'">
						<view class="ctgCont">
							<block v-for="i of 10" :key="i+1">
								<view class="ctgImgBlock" @click="setDec('dec',`/static/c/${i}.png`)">
									<img :src="`/static/c/${i}.png`" class="ctgImg" alt="">
								</view>
							</block>
						</view>
					</block>
					<block v-if="ctgis=='dec'">
						<view class="ctgCont">
							<view class="ctgImgBlock" @click="setDec('dec','/static/3.png')">
								<img src="/static/3.png" class="ctgImg" alt="">
							</view>
							<view class="ctgImgBlock" @click="setDec('frame','/static/2.png')">
								<img src="/static/2.png" class="ctgImg" alt="">
							</view>
						</view>
					</block>
					<block v-if="ctgis=='logo'">
						<view class="ctgCont">
							<view class="ctgImgBlock" @click="setDec('dec','/static/logo-1.png')">
								<img src="/static/logo-1.png" class="ctgImg" alt="">
							</view>
						</view>
					</block>
				</view>
				<sunui-upimg-tencent v-show="false" :upImgConfig="upImgCos" @onUpImg="upCosData" @onImgDel="delImgInfo" ref="uImage"></sunui-upimg-tencent>
				<!-- <button type="primary" @tap="getUpImgInfoCos">获取上传Cos图片信息</button>
				<button type="primary" @tap="uImageTap">手动上传图片</button> -->
				<view class="imgSelect">
					<image-cropper :src="tempFilePath" :cropFixed="cropFixed" :cropWidth="cropWidth" :cropHeight="cropHeight" @confirm="confirm"
					 @cancel="cancel"></image-cropper>
					<view class="selPor" @tap="upload()">更改头像</view>
					<view class="selPor" @tap="upload('dec')">自定义挂件</view>
					<view class="editBtns">
						<view class="editBtn reSet" @click="resetImg">重置</view>
						<view class="editBtn" @click="toImage">完成</view>
					</view>
				</view>
			</view>
			<!-- <img src="" alt="" class="imgSmall"> -->
			<uni-popup :show="poptype === 'showNewImg'" position="full" mode="fixed" width='100' @hidePopup="togglePopup('')">
				<view id="Generated">
					<view class="close-btn" @click="togglePopup('')">
						X
					</view>
					<img class="imgs" v-if="newImg" :src="newImg" alt="">
					<view>长按保存图片</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	var html2canvas = require("@/common/html2canvas.min.js");
	import sunuiUpimgTencent from '@/components/sunui-upimg/sunui-upimg-tencent.vue'
	import imageWrapper from '@/components/image-wrapper.vue';
	import uniPopup from '@/components/uni-popup.vue'
	import ImageCropper from "@/components/invinbg-image-cropper/invinbg-image-cropper.vue";
	export default {
		data() {
			return {
				base64Img: "",
				tempFilePath: "",
				cropFixed: true, //true false,
				cropWidth: 250,
				cropHeight: 250,
				imgBg: "/static/c/default.jpg",
				maskImg: [],
				newImg: "",
				frame: "",
				"slots": false,
				loading: false,
				poptype: "",
				ctgis: "special",
				selectImg: false,
				decType: '',
				picture_list: [],
				cosFlag: true,
				cosArr: [],
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
		onLoad() {},
		onShow() {
			//this.getBase64Image();
		},
		components: {
			sunuiUpimgTencent,
			imageWrapper,
			ImageCropper,
			uniPopup
		},
		methods: {
			upload(type) {
				var that = this;
				that.decType = type || '';
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						if (type == 'dec') {
							var mk = {
								"url": res.tempFilePaths.shift(),
								"rotate": 0,
								"scale": 1
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
				that.imgBg = e.detail.tempFilePath;
			},
			cancel() {
				this.selectImg = false;
				console.log('canceled')
			},
			swithCth(ctgis) {
				this.ctgis = ctgis;
			},
			setDec(type, url) {
				var that = this;
				var _url = url;
				console.log(type, _url)
				//var url = "http://img95.699pic.com/element/40121/1517.png_300.png";
				//var _base64Url = await getBase64Image(url);
				setTimeout(() => {
					switch (type) {
						case "dec":
							var mk = {
								"url": _url,
								"rotate": 0,
								"scale": 1
							}
							that.maskImg.push(mk);
							break;
						case "frame":
							that.frame = _url;
							break;
						default:
							break;
					}
				}, 500)
				console.log(that.maskImg)
			},
			resetImg() {
				var that = this;
				that.maskImg = [];
				that.frame = "";
			},
			async toImage() {
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
				html2canvas(obj, {
					backgroundColor: null,
					allowTaint: true,
					tainttest: true,
					width: width,
					height: height
				}).then((canvas) => {
					that.loading = false;
					uni.hideLoading()
					let dataURL = canvas.toDataURL("image/png");
					that.poptype = "showNewImg";
					that.$store.state.portrait = [{
						"path": dataURL,
						"imgType": 'base64Img',
						"upload_percent": 0
					}];
					console.log("portrait:", that.$store.state.portrait)
					that.uImageTap();
					that.newImg = dataURL;
				});
			},
			resetEditType() {
				this.$refs.imageWrapper.editType = "";
			},
			getBase64Image(dataURL) {
				var that = this;
				var img = new Image();
				img.src = dataURL;
				img.onload = function() {
					var canvas = document.createElement("canvas");
					canvas.width = img.width;
					canvas.height = img.height;
					var ctx = canvas.getContext("2d");
					ctx.drawImage(img, 0, 0, img.width, img.height);
					var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
					var dataURL = canvas.toDataURL("image/" + ext);
					that.base64Img = dataURL;
					console.log(dataURL);
					return dataURL;
				}
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
	page {
		height: 100%;
	}

	.content {
		height: 100%;
		background: #b0ecd2;
	}

	.uni-padding-wrap {
		height: 100%;
	}

	.portrait-box {
		padding: 40upx 0 0;
		display: flex;
		justify-content: center;
		flex-direction: row;
		align-content: center;
		align-items: center;
		background-image: linear-gradient(#e6eca6, #b0ecd2);
	}

	.portrait-main {
		min-height: calc(100% - 690upx);
		background-image: linear-gradient(#151c26, #242b3b);
	}

	.imgs {
		width: 100%;
	}

	#Generated {
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-content: center;
		align-items: center;
	}

	#Generated .imgs {
		width: 90%;
	}

	.imgSmall {
		width: 100upx;
		height: 100upx;
	}

	.ctgs {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-content: center;
		text-align: center;
		align-items: center;
		background: #FAFAFA;
		overflow: hidden;
	}

	.imgSelect {
		position: fixed;
		width: 90%;
		padding: 10upx 5%;
		left: 0;
		bottom: 0;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		flex-wrap: wrap;
		align-content: center;
		align-items: center;
	}

	.editBtns {
		width: 50%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-content: center;
		align-items: center;
	}

	.selBtn {
		font-size: 28upx;
		padding: 20upx;
		flex: 1;
		position: relative;
	}

	.selBtn::after {
		content: "";
		height: 50%;
		width: 1px;
		background: #e7e7e7;
		overflow: hidden;
		position: absolute;
		right: -1px;
	}

	.selBtnOn {
		background: #151c26;
		color: #f17f5a;
	}

	.selBtn:last-child()::after {
		width: 0;
		background: none;
	}

	.ctgBox {
		padding: 10upx 10upx 100upx;
	}

	.ctgCont {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: wrap;
		align-content: center;
		align-items: center;
		padding-bottom: 10upx;
	}

	.ctgImgBlock {
		width: 16.66%;
		display: flex;
		justify-content: center;
		align-content: center;
		align-items: center;
		padding-bottom: 10upx;
	}

	.ctgImg {
		width: 70%;
	}

	.editBtn,
	.selPor {
		font-size: 28upx;
		display: flex;
		justify-content: center;
		flex-direction: row;
		align-content: center;
		align-items: center;
		color: #f17f5a;
		line-height: 1;
		border-radius: 10upx;
		padding: 15upx 0;
	}

	.editBtn {
		width: 48%;
		color: #FFFFFF;
		border-radius: 20upx;
		background-image: linear-gradient(to right, #E5A590, #f17f5a);
		background: #f17f5a;
	}

	.reSet {
		background: #E5A590;
	}
</style>
