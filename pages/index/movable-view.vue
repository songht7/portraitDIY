<template>
	<view class="content">
		<view class="uni-padding-wrap uni-common-mt">
			<view class="portrait-box">
				<imageWrapper ref="imageWrapper" :imgBg="imgBg" :maskImg="maskImg" :frame="frame">
					<view class="text" v-if="slots">
						头像
					</view>
				</imageWrapper>
			</view>
			<view class="imgSelect">
				<image-cropper :src="tempFilePath" :cropFixed="cropFixed" :cropWidth="cropWidth" :cropHeight="cropHeight" @confirm="confirm"
				 @cancel="cancel"></image-cropper>
				<view class="selBtn selPor" @tap="upload">上传头像</view>
				<view class="editBtn" @click="toImage">完成！</view>
			</view>
			<view class="ctgs">
				<view class="selBtn" @click="swithCth('dec')">装饰</view>
				<view class="selBtn" @click="swithCth('frame')">相框</view>
			</view>
			<view class="ctgBox">
				<block v-if="ctgis=='dec'">
					<view class="ctgCont">
						<img src="/static/3.png" @click="setDec('dec','/static/3.png')" class="ctgImg" alt="">
					</view>
				</block>
				<block v-if="ctgis=='frame'">
					<view class="ctgCont">
						<img src="/static/2.png" @click="setDec('frame','/static/2.png')" class="ctgImg" alt="">
					</view>
				</block>
			</view>
			<!-- <img src="" alt="" class="imgSmall"> -->
			<uni-popup :show="poptype === 'showNewImg'" position="middle" mode="fixed" @hidePopup="togglePopup('')">
				<view id="Generated">
					<img class="imgs" v-if="newImg" :src="newImg" alt="">
					<view>长按保存图片</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	var html2canvas = require("@/common/html2canvas.min.js");
	import imageWrapper from '@/components/image-wrapper.vue';
	import uniPopup from '@/components/uni-popup.vue'
	import ImageCropper from "@/components/invinbg-image-cropper/invinbg-image-cropper.vue";
	export default {
		data() {
			return {
				base64Img: "",
				tempFilePath: "",
				cropFixed: false, //true,
				cropWidth: 250,
				cropHeight: 250,
				imgBg: "",
				maskImg: [],
				newImg: "",
				frame: "",
				"slots": false,
				loading: false,
				poptype: "",
				ctgis: "dec"
			}
		},
		onLoad() {},
		onShow() {
			//this.getBase64Image();
		},
		components: {
			imageWrapper,
			ImageCropper,
			uniPopup
		},
		methods: {
			upload() {
				var that = this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						that.tempFilePath = res.tempFilePaths.shift()
					}
				});
			},
			confirm(e) {
				this.tempFilePath = ''
				this.imgBg = e.detail.tempFilePath;
			},
			cancel() {
				console.log('canceled')
			},
			swithCth(ctgis) {
				this.ctgis = ctgis;
			},
			async setDec(type, url) {
				var that = this;
				var _url = url;
				//var url = "http://img95.699pic.com/element/40121/1517.png_300.png";
				//var _base64Url = await getBase64Image(url);
				switch (type) {
					case "dec":
						that.maskImg.push(_url);
						break;
					case "frame":
						that.frame = _url;
						break;
					default:
						break;
				}
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
					console.log(dataURL)
					that.poptype = "showNewImg";
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
				this.poptype = type;
			}
		}
	}
</script>

<style>
	.portrait-box {
		display: flex;
		justify-content: center;
		flex-direction: row;
		align-content: center;
		align-items: center;
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

	.imgSelect {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		flex-wrap: wrap;
		align-content: center;
		align-items: center;
		padding: 10upx;
	}

	.imgSmall {
		width: 100upx;
		height: 100upx;
	}

	.ctgs {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: wrap;
		align-content: center;
		align-items: center;
		padding-bottom: 10upx;
		background: #FAFAFA;
	}

	.selBtn {
		font-size: 28upx;
		padding: 20upx;
	}

	.ctgBox {
		padding: 10upx;
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

	.ctgImg {
		width: 100upx;
		margin-bottom: 10upx;
	}

	.editBtn,
	.selPor {
		font-size: 32upx;
		display: flex;
		justify-content: center;
		flex-direction: row;
		align-content: center;
		align-items: center;
		color: #FFFFFF;
		line-height: 20px;
		border-radius: 10upx;
		padding: 15upx 0;
		width: 30%;
		background-color: #528BF0;
		background-image: linear-gradient(to right, #528BF0, #A5C1F0);
	}

	.selPor {
		background-color: #E56CCE;
		background-image: linear-gradient(to right, #EA17C1, #E56CCE);
	}
</style>
