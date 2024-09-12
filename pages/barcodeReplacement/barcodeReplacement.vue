<template>
	<view class="page-container inventoryModification">
		<titleNView title="条码替换" titleIcon="/static/nav_exchange.png"></titleNView>
		<view class="text-area">
			<view class="inventoryModification-content">
				<view class="search-bar">
					<uni-easyinput v-model="value" type="text" :styles="{ color: '#fff', borderColor: '#385A91' }"
						confirmType="done" @confirm="searchTraybarcode(false)">
					</uni-easyinput>
				</view>
				<view class="inventoryModification-list">
					<view class="inventoryModification-label">新码值</view>
					<view class="inventoryModification-list-item">
						<text class="inventoryModification-list-key">销售订单号</text>
						<text class="inventoryModification-list-value">{{
							itemInfo.salesOrderNumber
						}}</text>
					</view>
					<view class="inventoryModification-list-item">
						<text class="inventoryModification-list-key">销售订单行号</text>
						<text class="inventoryModification-list-value">{{
						  itemInfo.salesOrderLine
						}}</text>
					</view>
					<view class="inventoryModification-list-item">
						<text class="inventoryModification-list-key">工单号</text>
						<text class="inventoryModification-list-value">{{
							itemInfo.workOrderNumber
						}}</text>
					</view>
					<view class="inventoryModification-list-item inputPadding">
						<text class="inventoryModification-list-key">重量</text>
						<text class="inventoryModification-list-value">{{
						  itemInfo.weight
						}}</text>
					</view>
					<view class="inventoryModification-list-item inputPadding">
						<text class="inventoryModification-list-key">长度</text>
						<text class="inventoryModification-list-value">{{
						  itemInfo.length
						}}</text>
					</view>
					<view class="inventoryModification-list-item inputPadding">
						<text class="inventoryModification-list-key">支号</text>
						<text class="inventoryModification-list-value">{{itemInfo.rollNum }}</text>
					</view>
				</view>
				<view class="search-bar">
					<uni-easyinput v-model="value2" type="text" :styles="{ color: '#fff', borderColor: '#385A91' }"
						confirmType="done" @confirm="checkbarcode()">
					</uni-easyinput>
				</view>
				<view class="inventoryModification-list">
					<view class="inventoryModification-label">原库值</view>
					<view class="inventoryModification-list-item">
						<text class="inventoryModification-list-key">销售订单号</text>
						<text class="inventoryModification-list-value">{{
              initItemInfo.salesOrderNumber
            }}</text>
					</view>
					<view class="inventoryModification-list-item">
						<text class="inventoryModification-list-key">销售订单行号</text>
						<text class="inventoryModification-list-value">{{
              initItemInfo.salesOrderLine
            }}</text>
					</view>
					<view class="inventoryModification-list-item">
						<text class="inventoryModification-list-key">工单号</text>
						<text class="inventoryModification-list-value">{{
              initItemInfo.workOrderNumber
            }}</text>
					</view>
					<view class="inventoryModification-list-item">
						<text class="inventoryModification-list-key">重量</text>
						<text class="inventoryModification-list-value">{{
              initItemInfo.weight
            }}</text>
					</view>
					<view class="inventoryModification-list-item">
						<text class="inventoryModification-list-key">长度</text>
						<text class="inventoryModification-list-value">{{
              initItemInfo.length
            }}</text>
					</view>
					<view class="inventoryModification-list-item">
						<text class="inventoryModification-list-key">支号</text>
						<text class="inventoryModification-list-value">{{initItemInfo.rollNum }}</text>
					</view>
				</view>

			</view>
			<footerBtnList :btnList="footerBtn"></footerBtnList>
		</view>
		<messagePop v-show="tipchange" :tipword="tipword" @close="closeMsg" @callBack="callBack"
			:isShowCancle="isShowCancle"></messagePop>
	</view>
</template>

<script>
	import {
		PDA_CallTrayBack,
		GetReplaceBarcode,
		ChangeBarcode
	} from "@/api/api.js";
	export default {
		data() {
			return {
				TaskId: '',
				isFocus: false,
				_tasknumber: "",
				_Traybarcode: "",
				tipchange: false,
				tipword: "",
				isShowCancle: false,
				ctype: false,
				ptype: false,
				value: "",
				value2: "",
				itemInfo: {
					length: '',
					oid: "",
					rollNum: '',
					salesOrderLine: "",
					salesOrderNumber: "",
					weight: '',
					workOrderNumber: ""
				},
				initItemInfo: {
					length: '',
					oid: "",
					rollNum: '',
					salesOrderLine: "",
					salesOrderNumber: "",
					weight: '',
					workOrderNumber: ""
				},
				ResTaskInventoryDetails: [],
				footerBtn: [{
					title: "替换",
					background: "linear-gradient(180deg, #F49638 0%, #EC7220 100%)",
					color: "#fff",
					callback: () => this.openType(),
				}, {
					title: "托盘回库",
					background: "linear-gradient(180deg, #3882F4 0%, #2057EC 100%)",
					color: "#fff",
					callback: () => this.backType(),
				}],
				timer: null,
				WeightConfirm: false

			};
		},
		methods: {
			closeMsg() {
				this.tipchange = false;
				this.tipword = "";
				this.ctype = false;
				this.ptype = false;
				this.WeightConfirm = false;
				this.value = '';
				this.value2 = '';
				this.isShowCancle = false;
				clearTimeout(this.timer)
			},
			clearInfo() {
				this.itemInfo = {
					length: '',
					oid: "",
					rollNum: '',
					salesOrderLine: "",
					salesOrderNumber: "",
					weight: '',
					workOrderNumber: ""
				};
				this.initItemInfo = {
					length: '',
					oid: "",
					rollNum: '',
					salesOrderLine: "",
					salesOrderNumber: "",
					weight: '',
					workOrderNumber: ""
				};
				this.value = '';
			},
			openType() {
				if (!this.itemInfo.verificationCode) {
					this.tipword = "请扫描新条码！";
					this.tipchange = true;
					return
				}
				if (!this.initItemInfo.verificationCode) {
					this.tipword = "请扫描原条码！";
					this.tipchange = true;
					return
				}
				this.tipchange = true;
				this.tipword = "是否确认修改？";
				this.ctype = true;
			},
			backType() {
				this.tipword = "是否确认回库？";
				this.tipchange = true;
				this.ptype = true;
			},
			callBack() {
				if (this.WeightConfirm) {
					this.searchTraybarcode(true)
				} else if (this.ctype) {
					let _new = this.itemInfo;
					let old = this.initItemInfo;
					//materialCode没值传空
					const kutai = uni.getStorageSync('kutai');

					ChangeBarcode({
						"taskid": this.itemInfo.taskid || '',
						"verificationCode": _new.verificationCode || '',
						"old_p": {
							"fullcode": old.fullcode || '',
							"materialCode": "",
							"oid": old.oid || '',
							"workOrderNumber": old.workOrderNumber || '',
							"rollNum": old.rollNum || '',
							"salesOrderNumber": old.salesOrderNumber || '',
							"salesOrderLine": old.salesOrderLine || '',
							"weight": old.weight || '',
							"length": old.length || ''
						},
						"new_p": {
							"fullcode": _new.fullcode || '',
							"materialCode": "",
							"oid": _new.oid || '',
							"workOrderNumber": _new.workOrderNumber || '',
							"rollNum": _new.rollNum || '',
							"salesOrderNumber": _new.salesOrderNumber || '',
							"salesOrderLine": _new.salesOrderLine || '',
							"weight": _new.weight || '',
							"length": _new.length || ''
						}
					}).then((res) => {
						if (res.responseCode == 0) {
							this.tipchange = true;
							this.tipword = "替换成功！";
							this.clearInfo();
						} else {
							this.tipchange = true;
							this.tipword = res.responseMessage;
						}
					})
				} else if (this.ptype) {
					let data = {
						TaskId: this.TaskId,
						NeedPick: false,
					};
					PDA_CallTrayBack(data)
						.then((res) => {
							if (res.responseCode == 0) {
								this.tipchange = true;
								this.tipword = "托盘回库成功！";
								this.clearInfo();
								uni.setStorage({
									key: "ReplacementList",
									data: JSON.stringify([]),
									fail: function() {
										that.tipchange = true;
										that.tipword = '清空缓存失败';
									}
								});

							} else {
								this.tipchange = true;
								this.tipword = res.responseMessage;
							}
						})
				}
			},
			searchTraybarcode(_WeightConfirm) {
				let str = this.value;
				let that = this;
				//WeightConfirm后端用取反的
				const kutai = uni.getStorageSync('kutai');
				GetReplaceBarcode(kutai, str, _WeightConfirm).then((res) => {
					if (res.responseCode == 1) {
						this.tipchange = true;
						this.tipword = '重量不一致，是否坚持出库?';
						this.WeightConfirm = true;
					} else if (res.responseCode == 0) {
						let verificationCode = res.Data.verificationCode;
						let taskid = res.Data.taskid;
						this.TaskId = taskid;
						this.itemInfo = {
							...res.Data.new_p,
							verificationCode,
							taskid
						};
						let old_p = {
							...res.Data.old_p,
							verificationCode,
							taskid
						};
						uni.getStorage({
							key: "ReplacementList",
							success: function(res) {
								console.log('stro', res);
								let list = [];
								let data = JSON.parse(res.data);
								if (data && data.length) {
									list = data;
								} else {
									list = [];
								}
								list = list.filter(_ => _.verificationCode != verificationCode);
								list.push(old_p)
								uni.setStorage({
									key: "ReplacementList",
									data: JSON.stringify(list),
									success: function() {
										that.tipchange = true;
										that.tipword = '条码校验成功！';
									},
									fail: function() {
										that.tipchange = true;
										that.tipword = '缓存失败';
									}
								});

							},
							fail: function() {
								let list = [{
									...old_p,
									verificationCode
								}];
								uni.setStorage({
									key: "ReplacementList",
									data: JSON.stringify(list),
									fail: function() {
										that.tipchange = true;
										that.tipword = '缓存失败';
									}
								});

							}
						})
					} else {
						this.tipchange = true;
						this.tipword = res.responseMessage;
					}
				})
			},
			checkbarcode() {
				console.log("checkbarcode")
				let str = this.value2;
				let that = this;
				uni.getStorage({
					key: "ReplacementList",
					success: function(res) {
						console.log('stro1', res);
						let data = JSON.parse(res.data);
						if (data && data.length) {
							let b = data.find(_ => _.verificationCode == str)
							if (b) {
								that.initItemInfo = b;
								that.tipchange = true;
								that.tipword = "条码校验成功！";
							} else {
								that.tipchange = true;
								that.tipword = '条码校验失败!';
							}
						} else {
							that.tipchange = true;
							that.tipword = '条码校验失败!';
						}
					},
					fail: function() {
						that.tipchange = true;
						that.tipword = '条码校验失败!';
					}
				});
			},
		},
		onLoad: function(option) {

		}
	}
</script>

<style>
	.inventoryModification {
		padding-top: 70px;
	}

	.inventoryModification /deep/ .uni-easyinput__content {
		min-height: 32px;
	}

	.inventoryModification /deep/ .uniui-clear {
		width: 28px;
		height: 28px;
		color: #446fb4 !important;
		font-size: 28px !important;
		line-height: 28px !important;
		padding: 0;
		margin-right: 5px;
	}

	.inventoryModification .inventoryModification-list-item /deep/ .uni-input-input {
		text-align: right;
	}

	.text-area {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.inventoryModification-content {
		width: 100%;
		flex: 1;
		border-radius: 8px;
		overflow-y: scroll;
	}

	.search-bar {
		width: 100%;
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.search-icon {
		width: 20px;
		height: 20px;
		margin-left: 10px;
	}

	.inventoryModification-list {
		width: 100%;
		height: auto;
		background: #1c2c4a;
		border-radius: 4px;
		overflow: hidden;
		padding: 40px 13px 20px;
		position: relative;
		margin-bottom: 10px;
	}

	.inventoryModification-label {
		width: 82px;
		height: 25px;
		background: linear-gradient(134deg, #7586a5 0%, #243655 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 15px;
		position: absolute;
		left: 0;
		top: 0;
	}

	.inventoryModification-list-item {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 12px;
		line-height: 20px;
	}

	.inputPadding {
		align-items: center;
		margin-bottom: 20px;
	}

	.inventoryModification-list-item:last-child {
		margin-bottom: 0;
	}

	.inventoryModification-list-key {
		width: 100px;
		color: #b5c5e5;
	}

	.inventoryModification-list-value {
		flex: 1;
		color: #ffffff;
		text-align: right;
	}

	.inventoryModification-list-input {
		width: 152px;
		height: 32px;
		background: rgba(47, 64, 96, 0.39);
		border: 1px solid #385a91;
		opacity: 1;
		border-radius: 2px;
		text-align: right;
		color: #fff;
	}
</style>
