<template>
	<view class="page-container homepage">
		<view class="home-page-nav">
			<view class="nav-l">
				<image class="nav-home-icon" src="/static/nav_home.png"></image>
				<text>主页</text>
			</view>
				<view class="nav-kuwei">{{kutaiName||'-'}}</view>
			<image class="nav-close-icon" src="/static/nav_close.png" @click="exit"></image>
		</view>

		<view class="btn-area">
			<image class="btn" src="/static/card_bind.png" mode="widthFix" @click="navigateToPage('binding')">
			</image>
			<div class="flex-area">
				<image class="flex-btn" src="/static/card_ruku.png" mode="widthFix"
					v-show="kutaiType==2 ||  kutaiType==0" @click="beforeNavigateToPage('wareHousing')"></image>

				<image class="flex-btn" src="/static/card_hujiao.png" mode="widthFix"
					@click="beforeNavigateToPage('callEmptyCarrier')"></image>

				<image class="flex-btn" src="/static/card_chuku.png" mode="widthFix"
					v-show="kutaiType==1 ||  kutaiType==0" @click="beforeNavigateToPage('pickingOut')">
				</image>
				<image class="flex-btn" src="/static/card_yuliao.png" mode="widthFix"
					v-show="kutaiType==1 ||  kutaiType==0" @click="beforeNavigateToPage('returnSurplusMaterials')">
				</image>

				<image class="flex-btn" src="/static/card_renwu.png" mode="widthFix" v-show="kutaiType==0"
					@click="beforeNavigateToPage('createTask')">
				</image>
				<image class="flex-btn" src="/static/card_buhege.png" mode="widthFix" v-show="kutaiType==0"
					@click="beforeNavigateToPage('deliveryNonconformingProducts')">
				</image>
				<image class="flex-btn" src="/static/card_tiaoma.png" mode="widthFix" v-show="kutaiType==0"
					@click="beforeNavigateToPage('barcodeReplacement')">
				</image>
				<image class="flex-btn" src="/static/card_choujian.png" mode="widthFix" v-show="kutaiType==0"
					@click="beforeNavigateToPage('inventory')"></image>

			</div>
		</view>
		<messagePop v-show="tipchange" :tipword="tipword" @close="closeMsg" @callBack="callBack"></messagePop>
	</view>
</template>

<script>
	import {
		PDA_CallEmptyTray,
	} from "@/api/api.js";
	export default {
		data() {
			return {
				tipchange: false,
				tipword: "",
				housingType: false,
				kutaiType: '',
				kutaiName: '',
			};
		},
		methods: {
			exit() {
				plus.runtime.quit();
			},
			closeMsg() {
				this.housingType = false;
				this.tipchange = false;
				this.tipword = "";
			},
			beforeNavigateToPage(type) {
				let that = this;
				uni.getStorage({
					key: "kutai",
					success: function(res) {
						if (res.data) {
							that.navigateToPage(type)
						} else {
							that.tipchange = true;
							that.tipword = "请先绑定库台";
						}
					},
					fail: function() {
						that.tipchange = true;
						that.tipword = "请先绑定库台";
					}
				})
			},
			navigateToPage(type) {
				switch (type) {
					case 'binding':
						uni.navigateTo({
							url: '/pages/binding/binding'
						});
						break;
					case 'wareHousing':
						uni.navigateTo({
							url: '/pages/wareHousing/wareHousing'
						});
						break;
					case 'pickingOut':
						uni.navigateTo({
							url: '/pages/pickingOut/pickingOut'
						});
						break;
					case 'inventory':
						uni.navigateTo({
							url: '/pages/inventory/inventory'
						});
						break;
					case 'callEmptyCarrier':
						this.housingType = true;
						this.tipword = "是否呼叫空托出库？";
						this.tipchange = true;
						break;
					case 'barcodeReplacement':
						uni.navigateTo({
							url: '/pages/barcodeReplacement/barcodeReplacement'
						});
						break;
					case 'deliveryNonconformingProducts':
						uni.navigateTo({
							url: '/pages/deliveryNonconformingProducts/deliveryNonconformingProducts'
						});
						break;
					case 'returnSurplusMaterials':
						uni.navigateTo({
							url: '/pages/returnSurplusMaterials/returnSurplusMaterials'
						});
						break;
					case 'createTask':
						uni.navigateTo({
							url: '/pages/createTask/createTask'
						});
						break;
				}
			},
			callBack() {
				if (this.housingType) {
					let data = {
						DeliverType: 1,
					};
					PDA_CallEmptyTray(data)
						.then((res) => {
							if (res.responseCode == 0) {
								this.tipchange = true;
								this.tipword = "空托出库成功！";
							} else {
								this.tipchange = true;
								this.tipword = "空托出库失败！";
							}
						}).catch((err) => {
							this.tipchange = true;
							this.tipword = err.responseMessage || err.Message;
						});
				}
				this.housingType = 0;
			}
		},
		onShow() {

			let that = this;
			uni.getStorage({
				key: "kutaiName",
				success: function(res) {
					let kutaiName = res.data || ''
					console.log('kutaiName', kutaiName)
					// if (['大卷出库口A9', '大卷出库口A7', '大卷出库口A5', '大卷出库口A3', '大卷出库口A1'].includes(
					// 		kutaiName)) {
					// 	that.kutaiType = 1;
					// } else if (['小卷入库口09', '大卷入库口07', '大卷入库口05', '大卷入库口03', '大卷入库口01'].includes(
					// 		kutaiName)) {
					// 	that.kutaiType = 2;
					// } else {
					// 	that.kutaiType = 0; //小卷出库口A0 全部展示
					// }
					that.kutaiName = kutaiName;
					if (kutaiName == '小卷出库口A0') {
						that.kutaiType = 0;
					} else if (kutaiName.indexOf('出库') > 0) {
						that.kutaiType = 1;
					} else if (kutaiName.indexOf('入库') > 0) {
						that.kutaiType = 2;
					} else {
						that.kutaiType = 0; //全部展示
					}

				}
			})
		}
	}
</script>

<style>
	.homepage {
		padding: 65px 36px 10px;
	}

	.home-page-nav {
		padding-top: 25px;
		width: 100vw;
		height: 65px;
		background: linear-gradient(327deg, #2F60E5 0%, #3984F5 100%);
		font-size: 15px;
		color: #FFFFFF;
		position: fixed;
		left: 0;
		top: 0;
	}

	.nav-l {
		position: absolute;
		left: 10px;
		top: 50%;
		transform: translate(0, -50%);
		display: flex;
		align-items: center;
		margin-top: 12.5px;
	}

	.nav-kuwei {
		padding-top: 20px;
		word-break: keep-all;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		font-size: 20px;
	}

	.nav-home-icon {
		width: 20px;
		height: 20px;
		margin-right: 8px;
	}

	.nav-close-icon {
		width: 15px;
		height: 15px;
		position: absolute;
		right: 15px;
		top: 50%;
		transform: translate(0, -50%);
		display: flex;
		align-items: center;
		margin-top: 12.5px;
	}

	.btn-area {
		width: 100%;
		height: 100%;
		overflow-y: scroll;
	}

	.flex-area {
		width: 100%;
		height: auto;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.btn {
		width: 100%;
		height: auto;
		margin-bottom: 23px;
		margin-top: 16px;
	}

	.flex-btn {
		width: calc(50% - 8px);
		height: auto;
		margin-bottom: 23px;
	}
</style>