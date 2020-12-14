<template>
	<view class="lucky-box">
		<view class="lucky-numb">
			<block v-for="(obj,k) in numb" :key="k">
				<view class="numb" @click="getData(k)">
					{{obj}}
				</view>
			</block>
		</view>
		<view class="lucky-value">
			<view class="lb-row">
				{{lucky}}等奖{{luckyCount}}名
			</view>
			<view class="lb-row"> 幸运号码
				<block v-for="(obj,key) in isLucked['v'+lucky]" :key="key">
					<text class="lk-val">‘{{obj}}’</text>
				</block>。
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
				hasBlockBox: false
			}
		},
		onLoad(option) {},
		onShow() {
			var that = this;
			that.getAction();
			that.getLucked();
			that.getmyLuck();
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
						that.luckyCount = parseInt(res.data.luckyCount);
						that.pCount = parseInt(res.data.pCount);
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
						let sl = [...v1, ...v2, ...v3, ...v4, ...v5]
						that.StorageLucked = sl;
						let v = "v" + that.lucky;
						if (res.data[v] && res.data[v].length > 0) {
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
						if (that.luckyV1.length || that.luckyV2.length || that.luckyV3.length) {
							console.log("myLuck::", that.luckyV1, that.luckyV2, that.luckyV3)
							that.hasBlockBox = true;
						}
					},
					fail() {
						that.luckyV1 = [];
						that.luckyV2 = [];
						that.luckyV3 = [];
						that.hasBlockBox = false;
					}
				});
			},
			getData(k) {
				const that = this;
				let v = "v" + that.lucky;
				console.log(v)
				if (that.isLucked[v] && (that.isLucked[v].length >= that.luckyCount)) {
					uni.showToast({
						title: "本轮抽奖结束"
					})
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
								let k = that.isLucked[v] && that.isLucked[v].length ? that.luckyCount - that.isLucked[v].length : 0;
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
								let k = that.isLucked[v] && that.isLucked[v].length ? that.luckyCount - that.isLucked[v].length : 0;
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
								let k = that.isLucked[v] && that.isLucked[v].length ? that.luckyCount - that.isLucked[v].length : 0;
								that.numb = [that.luckyV4[k]];
							}
							LN = {
								v4: [...vv4, ...that.numb]
							}
							break;
						case "5":
							let vv5 = that.isLucked['v5'] ? that.isLucked['v5'] : [];
							if (that.hasBlockBox) {
								let k = that.isLucked[v] && that.isLucked[v].length ? that.luckyCount - that.isLucked[v].length : 0;
								that.numb = [that.luckyV5[k]];
							}
							LN = {
								v5: [...vv5, ...that.numb]
							}
							break;
						default:
							break;
					}
					let __isLucked = { ...that.isLucked,
						...LN
					}
					that.isLucked = __isLucked;
					uni.getStorage({
						key: 'rbdLucked',
						success: function(res) {
							uni.setStorage({
								key: 'rbdLucked',
								data: { ...res.data,
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
			random(k) {
				const that = this;
				let minAdd = 1;
				let maxNum = that.pCount;
				let minNum = that.minNum;
				r0 = setInterval(() => {
					// let r = parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
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
		padding: 20upx;
	}

	.ipt {
		font-size: 12upx;
		border-bottom: 1px solid #ddd;
		width: 100px;
		text-align: center;
	}

	.lucky-box {
		width: 100%;
		padding-top: 30upx;
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
		width: 150upx;
		height: 150upx;
		font-size: 60upx;
		border: 5upx solid #DDDDDD;
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
		padding: 50upx 0;
		font-size: 30upx;
	}

	.lucky-value {
		top: 20upx;
		bottom: auto;
	}

	.lk-val {
		padding: 0 2upx;
	}

	.lb-row {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		align-content: center;
	}
</style>
