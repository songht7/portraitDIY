<template>
	<view class="lucky-main">
		<!-- <view class="lucky-block lucky-info">
			<view class="">

			</view>
		</view> -->
		<view class="lucky-block lucky-box">
			<view class="lucky-numb">
				<view class="numb" @click="start(1)">
					开始
				</view>
				<block v-for="(obj,k) in numb" :key="k" v-show="false">
					<view class="numb">
						{{obj}}
					</view>
				</block>
			</view>
			<view class="lucky-value">
				<view class="lb-row lucky-no">
					{{lucky}}等奖{{luckyCount}}名
				</view>
				<view class="lb-row" v-show="showLuck">
					<text class="lk-val">幸运号码</text>
					<block v-show="showLuck" v-for="(obj,key) in isLucked['v'+lucky]" :key="key">
						<text class="lk-val" @longpress="delt" @dblclick="delt" :data-key="key"
							:data-val="obj">‘{{obj}}’</text>
					</block>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	var r0 = "";
	export default {
		data() {
			return {
				lucky: 1, //奖号
				luckyCount: 1, //抽奖次数
				pCount: 200, //共多少人参与
				minNum: 1, //最小值
				isLucked: {}, //已抽取的号
				numb: [], //抽奖号
				StorageLucked: [], //历史抽奖值、避免重复
				luckyV1: [], //暗箱抽奖号
				luckyV2: [],
				luckyV3: [],
				luckyV4: [],
				luckyV5: [],
				luckyV6: [],
				luckyV7: [],
				luckyV8: [],
				luckyV9: [],
				luckyV10: [],
				hasBlockBox: false,
				showLuck: false
			}
		},
		onLoad(option) {},
		onShow() {
			var that = this;
			that.getAction();
			that.getLucked();
			that.getmyLuck();
			// that.LuckyDraw(1);
		},
		onReady() {
			var that = this;
			that.random(0)
		},
		components: {},
		methods: {
			getAction() {
				const that = this;
				uni.getStorage({
					key: 'rbdAction',
					success: function(res) {
						that.lucky = parseInt(res.data.lucky);
						let leng = parseInt(res.data.luckyCount)
						that.luckyCount = leng;
						let pleng = parseInt(res.data.pCount)
						that.pCount = pleng;
						var json = [];
						for (var i = 0; i < pleng; i++) {
							json.push(i + 1)
						}
						console.log("json::", json)
					}
				});
			},
			getLucked() {
				const that = this;
				uni.getStorage({
					key: 'rbdLucked',
					success: function(res) {
						let v1 = res.data.v1 ? res.data.v1 : [];
						let v2 = res.data.v2 ? res.data.v2 : [];
						let v3 = res.data.v3 ? res.data.v3 : [];
						let v4 = res.data.v4 ? res.data.v4 : [];
						let v5 = res.data.v5 ? res.data.v5 : [];
						let v6 = res.data.v6 ? res.data.v6 : [];
						let v7 = res.data.v7 ? res.data.v7 : [];
						let v8 = res.data.v8 ? res.data.v8 : [];
						let v9 = res.data.v9 ? res.data.v9 : [];
						let v10 = res.data.v10 ? res.data.v10 : [];
						let sl = [...v1, ...v2, ...v3, ...v4, ...v5, ...v6, ...v7, ...v8, ...v9, ...v10]
						that.StorageLucked = sl;
						let v = "v" + that.lucky;
						if (res.data[v]) { //&& res.data[v].length > 0
							that.isLucked[v] = res.data[v];
						}
						console.log("StorageLucked::", sl)

					},
					fail() {
						that.StorageLucked = [];
						that.isLucked = {};
					}
				});
			},
			getmyLuck() {
				const that = this;
				uni.getStorage({
					key: 'myLuck',
					success: function(res) {
						that.luckyV1 = res.data.v1 ? res.data.v1 : [];
						that.luckyV2 = res.data.v2 ? res.data.v2 : [];
						that.luckyV3 = res.data.v3 ? res.data.v3 : [];
						that.luckyV4 = res.data.v4 ? res.data.v4 : [];
						that.luckyV5 = res.data.v5 ? res.data.v5 : [];
						that.luckyV6 = res.data.v6 ? res.data.v6 : [];
						that.luckyV7 = res.data.v7 ? res.data.v7 : [];
						that.luckyV8 = res.data.v8 ? res.data.v8 : [];
						that.luckyV9 = res.data.v9 ? res.data.v9 : [];
						that.luckyV10 = res.data.v10 ? res.data.v10 : [];
						if (that.luckyV1.length || that.luckyV2.length || that.luckyV3.length || that.luckyV4
							.length || that.luckyV5.length ||
							that.luckyV6.length || that.luckyV7.length || that.luckyV8.length || that.luckyV9
							.length || that.luckyV10.length) {
							console.log("myLuck::", that.luckyV1, that.luckyV2, that.luckyV3)
							that.hasBlockBox = true;
						}
					},
					fail() {
						that.luckyV1 = [];
						that.luckyV2 = [];
						that.luckyV3 = [];
						that.luckyV4 = [];
						that.luckyV5 = [];
						that.luckyV6 = [];
						that.luckyV7 = [];
						that.luckyV8 = [];
						that.luckyV9 = [];
						that.luckyV10 = [];
						that.hasBlockBox = false;
					}
				});
			},
			start(k) {
				const that = this;
				setTimeout(() => {
					that.showLuck = true;
				}, 3000);
			},
			LuckyDraw(k) {
				const that = this;
				let v = "v" + that.lucky;
				if (that.isLucked[v] && (that.isLucked[v].length >= that.luckyCount)) {
					// uni.showToast({
					// 	title: "本轮抽奖结束"
					// })
					return false
				} else {
					for (var i = 0; i < that.luckyCount * 2; i++) {
						let r1 = setTimeout(() => {
							that.getData(k);
						}, 1000 * (i + 1));
					}
				}
			},
			getData(k) {
				const that = this;
				let v = "v" + that.lucky;
				console.log(v)
				if (that.isLucked[v] && (that.isLucked[v].length >= that.luckyCount)) {
					// uni.showToast({
					// 	title: "本轮抽奖结束"
					// })
					return false
				}
				if (r0) {
					clearInterval(r0);
					r0 = "";
					let LN = {}
					switch (that.lucky.toString()) {
						case "1":
							let vv1 = that.isLucked['v1'] ? that.isLucked['v1'] : [];
							if (that.hasBlockBox && that.luckyV1.length) {
								that.numb = that.luckyV1;
							}
							LN = {
								v1: [...vv1, ...that.numb]
							}
							break;
						case "2":
							let vv2 = that.isLucked['v2'] ? that.isLucked['v2'] : [];
							if (that.hasBlockBox) {
								let k = that.isLucked[v] && that.isLucked[v].length ? that.luckyCount - that.isLucked[v]
									.length : 0;
								if (that.luckyV2[k]) {
									that.numb = [that.luckyV2[k]];
								}
							}
							LN = {
								v2: [...vv2, ...that.numb]
							}
							break;
						case "3":
							let vv3 = that.isLucked['v3'] ? that.isLucked['v3'] : [];
							if (that.hasBlockBox) {
								let k = that.isLucked[v] && that.isLucked[v].length ? that.luckyCount - that.isLucked[v]
									.length : 0;
								if (that.luckyV3[k]) {
									that.numb = [that.luckyV3[k]];
								}
							}
							LN = {
								v3: [...vv3, ...that.numb]
							}
							break;
						case "4":
							let vv4 = that.isLucked['v4'] ? that.isLucked['v4'] : [];
							if (that.hasBlockBox) {
								let k = that.isLucked[v] && that.isLucked[v].length ? that.luckyCount - that.isLucked[v]
									.length : 0;
								that.numb = [that.luckyV4[k]];
							}
							LN = {
								v4: [...vv4, ...that.numb]
							}
							break;
						case "5":
							let vv5 = that.isLucked['v5'] ? that.isLucked['v5'] : [];
							if (that.hasBlockBox) {
								let k = that.isLucked[v] && that.isLucked[v].length ? that.luckyCount - that.isLucked[v]
									.length : 0;
								that.numb = [that.luckyV5[k]];
							}
							LN = {
								v5: [...vv5, ...that.numb]
							}
							break;
						case "6":
							let vv6 = that.isLucked['v6'] ? that.isLucked['v6'] : [];
							if (that.hasBlockBox) {
								let k = that.isLucked[v] && that.isLucked[v].length ? that.luckyCount - that.isLucked[v]
									.length : 0;
								that.numb = [that.luckyV6[k]];
							}
							LN = {
								v6: [...vv6, ...that.numb]
							}
							break;
						case "7":
							let vv7 = that.isLucked['v7'] ? that.isLucked['v7'] : [];
							if (that.hasBlockBox) {
								let k = that.isLucked[v] && that.isLucked[v].length ? that.luckyCount - that.isLucked[v]
									.length : 0;
								that.numb = [that.luckyV7[k]];
							}
							LN = {
								v7: [...vv7, ...that.numb]
							}
							break;
						case "8":
							let vv8 = that.isLucked['v8'] ? that.isLucked['v8'] : [];
							if (that.hasBlockBox) {
								let k = that.isLucked[v] && that.isLucked[v].length ? that.luckyCount - that.isLucked[v]
									.length : 0;
								that.numb = [that.luckyV8[k]];
							}
							LN = {
								v8: [...vv8, ...that.numb]
							}
							break;
						case "9":
							let vv9 = that.isLucked['v9'] ? that.isLucked['v9'] : [];
							if (that.hasBlockBox) {
								let k = that.isLucked[v] && that.isLucked[v].length ? that.luckyCount - that.isLucked[v]
									.length : 0;
								that.numb = [that.luckyV9[k]];
							}
							LN = {
								v9: [...vv9, ...that.numb]
							}
							break;
						case "10":
							let vv10 = that.isLucked['v10'] ? that.isLucked['v10'] : [];
							if (that.hasBlockBox) {
								let k = that.isLucked[v] && that.isLucked[v].length ? that.luckyCount - that.isLucked[v]
									.length : 0;
								that.numb = [that.luckyV10[k]];
							}
							LN = {
								v10: [...vv10, ...that.numb]
							}
							break;
						default:
							break;
					}
					let __isLucked = {
						...that.isLucked,
						...LN
					}
					that.isLucked = __isLucked;
					uni.getStorage({
						key: 'rbdLucked',
						success: function(res) {
							uni.setStorage({
								key: 'rbdLucked',
								data: {
									...res.data,
									...__isLucked
								},
								success: function() {
									that.getLucked();
								}
							});
						},
						fail() {
							uni.setStorage({
								key: 'rbdLucked',
								data: __isLucked,
								success: function() {
									that.getLucked();
								}
							});
						}
					});
					console.log("isLucked:::", __isLucked, LN)
				} else {
					if (that.isLucked[v] && (that.isLucked[v].length < that.luckyCount)) {
						// console.log("that.isLucked[v].length：：：", that.isLucked[v].length, that.luckyCount)
						that.random(r0);
					} else if (!that.isLucked[v]) {
						that.random(r0);
					}
				}
			},
			delt(e) {
				const that = this;
				let key = e.currentTarget.dataset.key;
				let val = e.currentTarget.dataset.val;
				let v = "v" + that.lucky;
				console.log(key, val, v)
				uni.getStorage({
					key: 'rbdLucked',
					success: function(res) {
						let _data = res.data;
						let _dataVal = _data[v][key];
						console.log(_data);
						uni.showModal({
							title: "放弃？",
							content: "幸运号：" + val,
							success: function(res) {
								if (res.confirm) {
									console.log('用户点击确定');
									_data[v] = _data[v].filter((obj, k) => {
										if (k != key) {
											return obj
										}
									});
									uni.setStorage({
										key: 'rbdLucked',
										data: _data,
										success: function() {
											that.getLucked();
										}
									});
								} else if (res.cancel) {
									// console.log('用户点击取消');
								}
							}
						})
						// uni.setStorage({
						// 	key: 'rbdLucked',
						// 	data: { ..._data},
						// 	success: function() {
						// 		that.getLucked();
						// 	}
						// });
					},
					fail() {}
				});
			},
			random(k) {
				const that = this;
				let minAdd = 1;
				let maxNum = that.pCount;
				let minNum = that.minNum;
				r0 = setInterval(() => {
					// let r = (minNum, maxNum) => (Math.random() * (max - min + 1) | 0) + min;
					let r = (minAdd + 1) <= maxNum ? (minAdd + 1) : 1;
					if (!that.StorageLucked.includes(r)) {
						// console.log(minNum, maxNum, r)
						that.numb = [r];
					} else {
						// console.log(r)
					}
					minAdd = r;
					// that.minNum = r;
				}, 0.1)
			},
			getLucky(e) {
				console.log(e.detail.value)
				const that = this;
			},
			getLuckyCount(e) {
				console.log(e.detail.value)
				const that = this;
			},
			getPCount(e) {
				console.log(e.detail.value)
				const that = this;
			}
		}
	}
</script>

<style scoped>
	page {
		font-size: 12upx;
		height: 100%;
	}

	.ipt {
		font-size: 12upx;
		border-bottom: 1px solid #ddd;
		width: 100px;
		text-align: center;
	}

	.lucky-main,
	.lucky-block {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		align-content: center;
		height: 100%;
	}

	.lucky-main {
		background: url(../../static/cj.png) no-repeat 50% 50%;
		background-size: cover;
	}

	.lucky-block {
		width: 65%;
	}

	.lucky-box {
		flex-direction: row;
	}

	.lucky-numb {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		align-content: center;
	}

	.numb {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		align-content: center;
		width: 180upx;
		height: 180upx;
		font-size: 60upx;
		border: 5upx solid #35a6df;
		color: #3c74ba;
		border-radius: 50%;
		margin: 0 10upx;
	}

	.lucky-value {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		align-content: center;
		padding: 10upx 0;
		font-size: 26upx;
		color: #3c74ba;
	}

	.lucky-value {
		top: 20upx;
		bottom: auto;
	}

	.lk-val {
		padding: 0 1upx;
	}

	.lb-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		align-content: center;
		flex-wrap: wrap;
	}

	.lucky-no {
		font-size: 28upx;
	}
</style>
