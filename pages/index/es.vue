<template>
	<view class="content">
		<view class="es6btn" @click="es6Symbol()">Symbol</view>
		<view class="es6btn" @click="es6Set()">Set</view>
		<view class="es6btn" @click="es6Map()">Map</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				es: ""
			}
		},
		onLoad() {
			console.log("onLoad")
			this.es6Map()
		},
		onShow() {
			console.log("onShow")
		},
		onReady() {
			console.log("onReady")
		},
		onHide() {
			console.log("onReady")
		},
		onUnload() {
			console.log("onUnload")
		},
		onBackPress() {
			console.log("onBackPress")
		},
		components: {},
		methods: {
			es6Symbol() {
				console.log("凡是属性名属于 Symbol 类型，就都是独一无二的，可以保证不会与其他属性名产生冲突。")
				const clr = {
					red: Symbol(),
					green: Symbol()
				};

				function getArea(c, options) {
					let area = 0;
					switch (c) {
						case clr.red:
							return "red"
							break;
						case clr.green:
							return "green"
							break;
					}
					return area;
				}

				let s = getArea(clr.red);
				console.log(s)
			},
			es6Set() {
				console.log("Set本身是一个构造函数,成员的值都是唯一")
				console.log(new Set("abvvvabbbb"))
				console.log([...new Set("abvvvabbbb")]) //Array.from(items)
				console.log([...new Set("abvvvabbbb")].join(""))
				let a = [1, 2, 3, 4, 5],
					b = [2, 4, 6, 7, 8],
					c = [7, 9, 9, 10, 11],
					n = [...a, ...b, ...c];
				let st = new Set(n);
				console.log("st:", st);
				st.forEach((v, k, m) => {
					console.log("Key: %s, Value: %s", k, v);
				})
				let s = [...new Set(n)]; //Array.from(st)
				console.log("s:", s);
				// 交集
				let _b = new Set(b);
				let intersect = new Set([...a].filter(x => _b.has(x)));
				console.log("intersect;", intersect);
				// 差集
				let difference = new Set([...a].filter(x => !_b.has(x)));
				console.log("difference;", difference);

				let set = new Set([...a].map(val => val * 2));
				console.log([...set])
			},
			es6Map() {
				console.log("Map “键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键")
				let m = new Map();
				let o = {
					p: 'Hello World',
					404: "Not found"
				};
				m.set(o, "content");
				m.set(true, 1);
				m.set('true', 2);
				console.log(m)
				console.log(m.get(o))
				let map = new Map([
					['name', '张三'],
					['title', 'Author']
				]);
				map.forEach((v, k, m) => {
					console.log("Key: %s, Value: %s", k, v);
				})
				console.log(map)
				console.log(map.get("name"))

				console.log("注意，只有对同一个对象的引用，Map 结构才将其视为同一个键。这一点要非常小心")
				let a = new Map();
				let _a = ['a'];
				a.set(['a'], 555);
				a.set(_a, 555);
				console.log(a.get(['a']))
				console.log(a.get(_a))
			}
		}
	}
</script>

<style>
	.es6btn {
		color: #666;
		line-height: 1.6;
		font-size: 32upx;
		margin: 5upx 0;
		padding-left: 50upx;
	}
</style>
