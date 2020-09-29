<template>
	<div class="vote">
		<h1>
			<img src="@i/vote-title.png" alt="" />
		</h1>
		<div class="food">
			<h1>
				<img src="@i/food-title.png" alt="" />
			</h1>
			<div class="contai">
				<div v-for="(item, index) in vote.food" :key="item.anchorId">
					<!-- <p></p> -->
					<span v-html="`0${index + 1}`">01</span>
					<a :href="item.link">
						<img :src="item.img" alt="" class="foods" />
					</a>
					<h1>{{ item.name }}</h1>
					<button v-if="item.state == 0">
						<img src="@i/vote1.png" alt="" @click="voteClick($event, index, 'buttonFood', item)" ref="buttonFood" />
					</button>
					<button v-else>
						<img src="@i/already1.png" alt="" />
					</button>
				</div>
			</div>
		</div>
		<div class="literature">
			<h1>
				<img src="@i/literature-title.png" alt="" />
			</h1>
			<div class="contai">
				<div v-for="(item, index) in vote.literature" :key="item.anchorId">
					<!-- <p></p> -->
					<span v-html="`0${index + 1}`">01</span>
					<a :href="item.link">
						<img :src="item.img" alt="" class="foods" />
					</a>
					<h1>{{ item.name }}</h1>
					<button v-if="item.state == 0">
						<img src="@i/vote2.png" alt="" @click="voteClick($event, index, 'buttonLit', item)" ref="buttonLit" />
					</button>
					<button v-else>
						<img src="@i/already1.png" alt="" />
					</button>
				</div>
			</div>
		</div>
		<div class="scenery">
			<h1>
				<img src="@i/scenery-title.png" alt="" />
			</h1>
			<div class="contai">
				<div v-for="(item, index) in vote.scenery" :key="item.anchorId">
					<!-- <p></p> -->
					<span v-html="`0${index + 1}`">01</span>
					<a :href="item.link">
						<img :src="item.img" alt="" class="foods" />
					</a>
					<h1>{{ item.name }}</h1>
					<button v-if="item.state == 0">
						<img src="@i/vote3.png" alt="" @click="voteClick($event, index, 'buttonSce', item)" ref="buttonSce" />
					</button>
					<button v-else>
						<img src="@i/already1.png" alt="" />
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import food from '@/data/food';
export default {
	name: 'vote',
	data() {
		return {
			vote: food.food,
			imgUrl1: require('../assets/images/vote1.png'),
			imgUrl2: require('../assets/images/vote2.png'),
			imgUrl3: require('../assets/images/vote3.png'),
			arrTime: {
				food: [{}, {}, {}, {}, {}, {}, {}, {}],
				literature: [{}, {}, {}, {}, {}, {}, {}, {}],
				scenery: [{}, {}, {}, {}, {}, {}, {}, {}]
			}
		};
	},
	created() {
		if (localStorage.getItem('arr') === null) {
			localStorage.setItem('arr', JSON.stringify(this.arrTime));
		}
		for (const key in this.arrTime) {
			const element = this.arrTime[key];
			for (const key in element) {
				const container = element[key];
				container.state = 0;
				container.time = 0;
				container.nowTime = 0;
			}
		}
		var data = JSON.parse(localStorage.getItem('arr'));
		for (const key in data) {
			const element = data[key];
			element.forEach((item, index) => {
				if (JSON.stringify(item) !== '{}') {
					if (parseInt(item.time) + parseInt(item.nowTime) < new Date().getTime()) {
						this.vote[key][index].state = 0;
					} else {
						this.vote[key][index].state = 1;
					}
				}
			});
		}
	},
	mounted() {},
	methods: {
		/* 
			点赞接口
			调取百度接口，增加点赞次数
		*/
		voteClick(event, index, type, item) {
			// const buttonDom = this.$refs[type][index];
			// buttonDom.src = require(`../assets/images/already1.png`);

			const params = {
				anchorId: item.anchorId,
				anchorType: item.anchorType
			};
			this.HTTPS.fetchPost(
				// `${this.baseURL.value}/api/vote-add`,
				`${window.location.protocol}//kanzhibo.baidu.com/liveshow/api/proxybzchina?type=vote-add`,
				params
			)
				.then((res) => {
					if (res.data.code == 200) {
						//new一个新对象，赋值给arrTime并记录到缓存中
						const objTime = new Object();
						objTime.nowTime = new Date().getTime();
						objTime.time = 600000; //缓存有效期10分钟
						objTime.type = item.anchorId;
						objTime.state = 0;
						console.log(
							'object :>> ',
							item.parent,
							'把之前的name更为汉字之后会找不到对应的模块json所以重新获取parent'
						);
						if (!this.vote[item.parent][index].state) {
							this.vote[item.parent][index].state = 1; //已经投票更改状态值
							this.arrTime[item.parent][index] = objTime;
						}

						//根据后台返回数据重新计算百分比
						const anchorArr = [];
						res.data.data.anchor.forEach((item, index) => {
							const fixedNum = parseFloat(Number(parseInt(item.vote_num) / res.data.data.total).toFixed(3));
							anchorArr.push(fixedNum);
						});
						//通过计算的百分比重新遍历赋值给json数据
						for (const key in food.foodPopup[item.parent]) {
							food.foodPopup[item.parent][key].number = anchorArr[key];
						}
						this.$parent.popupList = food.foodPopup;
						const localTime = JSON.parse(localStorage.getItem('arr'));
						localTime[item.parent][index] = objTime;
						localStorage.setItem('arr', JSON.stringify(localTime));
						this.$parent.popupList = food.foodPopup[item.parent];
						this.$parent.isPopup = true;
						this.$nextTick(() => {
							this.$parent.$refs.strip.forEach((item, index) => {
								console.log('item :>> ', item, anchorArr[index] * 100 + '%');
								item.style.width = anchorArr[index] * 100 + '%';
							});
						});
					}
				})
				.catch((res) => {});
		}
	},
	computed: {}
};
</script>
<style lang="scss" scope>
.vote {
	h1 {
		img {
			@include imgwh(548, 52);
			margin-top: px2rem(68);
		}
		font-size: px2rem(40);
		font-weight: bold;
		text-align: center;
	}
	.food {
		width: px2rem(629);
		height: px2rem(572);
		margin: 0 auto;
		margin-top: px2rem(30);
		@include bg('~@i/food-bg.png');
		h1 img {
			@include imgwh(197, 51);
			padding-top: px2rem(36);
		}
		.contai {
			margin-top: px2rem(14);
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-wrap: wrap;
			@include pd(0, 30, 0, 30);
			div {
				position: relative;
				overflow: hidden;
				width: px2rem(134);
				height: px2rem(207);
				margin-top: px2rem(6);
				@include bg('~@i/food-border.png');
				span {
					display: block;
					font-family: 'fangzheng';
					font-size: px2rem(14);
					color: #ffffff;
					transform: rotate(-40deg);
					position: absolute;
					left: 2%;
					top: 2%;
				}
				.foods {
					@include imgwh(123, 106);
					margin-top: px2rem(4);
				}
				> h1 {
					font-family: 'fangzheng';
					font-size: px2rem(22);
					color: #4157a6;
					margin-top: px2rem(6);
				}
				> button {
					width: px2rem(113);
					height: px2rem(27);
					padding: 0;
					margin: 0 auto;
					border: none;
					outline: none;
					display: block;
					img {
						width: 100%;
					}
				}
			}
		}
	}
	.literature {
		width: px2rem(630);
		height: px2rem(572);
		margin: 0 auto;
		margin-top: px2rem(30);
		@include bg('~@i/literature-bg.png');
		h1 img {
			@include imgwh(256, 99);
			padding-top: px2rem(12);
		}
		.contai {
			margin-top: px2rem(0);
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-wrap: wrap;
			@include pd(0, 30, 0, 30);
			div {
				position: relative;
				overflow: hidden;
				width: px2rem(134);
				height: px2rem(207);
				margin-top: px2rem(6);
				@include bg('~@i/literature--border.png');
				span {
					display: block;
					font-family: 'fangzheng';
					font-size: px2rem(14);
					color: #ffffff;
					transform: rotate(-40deg);
					position: absolute;
					left: 8%;
					top: 2%;
				}
				.foods {
					@include imgwh(109, 69);
					margin-top: px2rem(4);
					margin-left: px2rem(18);
				}
				> h1 {
					font-family: 'fangzheng';
					font-size: px2rem(22);
					color: #56419c;
					margin-top: px2rem(14);
					margin-left: px2rem(12);
				}
				> button {
					width: px2rem(108);
					height: px2rem(24);
					padding: 0;
					margin: 0 auto;
					border: none;
					outline: none;
					display: block;
					margin-left: px2rem(18);
					background: none;
					img {
						width: 100%;
					}
				}
			}
		}
	}
	.scenery {
		width: px2rem(629);
		height: px2rem(591);
		margin: 0 auto;
		margin-top: px2rem(30);
		@include bg('~@i/scenery-bg.png');
		h1 img {
			@include imgwh(184, 54);
			padding-top: px2rem(40);
		}
		.contai {
			margin-top: px2rem(0);
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-wrap: wrap;
			@include pd(0, 30, 0, 30);
			div {
				position: relative;
				overflow: hidden;
				width: px2rem(142);
				height: px2rem(221);
				margin-top: px2rem(6);
				@include bg('~@i/scenery-border.png');
				span {
					display: block;
					font-family: 'fangzheng';
					font-size: px2rem(14);
					color: #ffffff;
					transform: rotate(-40deg);
					position: absolute;
					left: 10%;
					top: 10%;
				}
				.foods {
					@include imgwh(123, 108);
					margin-top: px2rem(19);
					margin-left: px2rem(12);
				}
				> h1 {
					font-family: 'fangzheng';
					font-weight: normal;
					font-size: px2rem(22);
					color: #ffffff;
					margin-top: px2rem(6);
					margin-left: px2rem(10);
				}
				> button {
					width: px2rem(114);
					height: px2rem(26);
					padding: 0;
					margin: 0 auto;
					border: none;
					outline: none;
					display: block;
					margin-left: px2rem(18);
					background: none;
					img {
						width: 100%;
					}
				}
			}
		}
	}
}
</style>