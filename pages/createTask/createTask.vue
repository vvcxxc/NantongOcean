<template>
	<view class="page-container createTask">
		<titleNView title="任务创建" titleIcon="/static/nav_task.png"></titleNView>
		<view class="text-area">
			<view class="createTask">
				<view class="inventoryModification-list">
					<view class="inventoryModification-label">指定工单</view>
					<view class="inventoryModification-list-item inputPadding">
						<text class="inventoryModification-list-key">工单号</text>
						<uni-combox v-model="itemInfo.WorkOrder" :candidates="workNumList"></uni-combox>
					</view>
					<view class="inventoryModification-list-item inputPadding">
						<text class="inventoryModification-list-key">支号</text>
						<uni-easyinput v-model="itemInfo.branch" :clearable="true"
							:styles="{ color: '#fff', borderColor: '#385A91' }">
						</uni-easyinput>
					</view>
				</view>

				<footerBtnList :btnList="footerBtn0"></footerBtnList>
				<view class="inventoryModification-list">
					<view class="inventoryModification-label">指定库位</view>
					<view class="inventoryModification-list-item inputPadding">
						<text class="inventoryModification-list-key">抽检排</text>
						<uni-easyinput v-model="itemInfo.p" type="number" :clearable="true" :styles="{
					 		color: '#fff', borderColor: '#385A91', textAlign: 'right'}">
						</uni-easyinput>
					</view>
					<view class="inventoryModification-list-item inputPadding">
						<text class="inventoryModification-list-key">抽检列</text>
						<uni-easyinput v-model="itemInfo.l" type="number" :clearable="true"
							:styles="{ color: '#fff', borderColor: '#385A91' }">
						</uni-easyinput>
					</view>
					<view class="inventoryModification-list-item inputPadding">
						<text class="inventoryModification-list-key">抽检层</text>
						<uni-easyinput v-model="itemInfo.c" type="number" :clearable="true"
							:styles="{ color: '#fff', borderColor: '#385A91' }">
						</uni-easyinput>
					</view>
				</view>
				<footerBtnList :btnList="footerBtn"></footerBtnList>
			</view>

		</view>
		<messagePop v-show="tipchange" :tipword="tipword" @close="closeMsg"></messagePop>
	</view>
</template>

<script>
	import {
		GetWorkOrderStock,
		CreateInventoryTask,
	} from "@/api/api.js";
	export default {
		data() {
			return {
				tipchange: false,
				tipword: "",
				value: "",
				itemInfo: {
					WorkOrder: '',
					branch: '',
					p: '',
					l: '',
					c: ''
				},
				ResTaskInventoryDetails: [],
				footerBtn0: [{
					title: "创建任务",
					background: "linear-gradient(180deg, #3882F4 0%, #2057EC 100%)",
					color: "#fff",
					callback: () => this.sumbit(1),
				}, ],
				footerBtn: [{
					title: "创建任务",
					background: "linear-gradient(180deg, #3882F4 0%, #2057EC 100%)",
					color: "#fff",
					callback: () => this.sumbit(2),
				}],
				timer: null,
				workNumList: []
			};
		},
		methods: {
			closeMsg() {
				this.tipchange = false;
				this.tipword = "";
				clearTimeout(this.timer)
			},
			sumbit(type) {
				let data = {};
				if (type == 1) {
					if (!this.itemInfo.WorkOrder) {
						this.tipword = "请输入工单号";
						this.tipchange = true;
						return
					}
					data = {
						WorkOrderNum: this.itemInfo.WorkOrder,
						RollNum: this.itemInfo.branch.replace('，', ','),
						TaskRow: '',
						TaskLine: '',
						TaskPlie: ''
					}
				} else if (type == 2) {
					if (!this.itemInfo.p || !this.itemInfo.l || !this.itemInfo.c || !this.isPositiveInteger(this.itemInfo
							.p) || !this.isPositiveInteger(this.itemInfo.l) || !this.isPositiveInteger(this.itemInfo.c)) {
						this.tipword = "请正确输入库位";
						this.tipchange = true;
						return
					}
					data = {
						WorkOrderNum: '',
						RollNum: '',
						TaskRow: Number(this.itemInfo.p),
						TaskLine: Number(this.itemInfo.l),
						TaskPlie: Number(this.itemInfo.c)
					}
				}
				CreateInventoryTask(data).then((res) => {
					if (res.responseCode == 0) {
						this.tipchange = true;
						this.tipword = "创建成功！";
						this.itemInfo = {
							WorkOrder: '',
							branch: '',
							p: '',
							l: '',
							c: ''
						};
					} else {
						this.tipchange = true;
						this.tipword = res.responseMessage;
					}
				})
			},
			isPositiveInteger(s) {
				//是否为正整数
				var re = /^[0-9]+$/;
				return re.test(s);
			},
			searchTraybarcode() {
				let itemId = this.value.split(',')[1];
				let that = this;
				uni.getStorage({
					key: "createTask",
					success: function(res) {
						if (res.data) {
							let list = JSON.parse(res.data)
							if (list && list.length) {
								let item = list.find(_ => _.Oid == itemId)
								if (!item || !item.Oid) {
									that.tipchange = true;
									that.tipword = "条码校验失败！请重新扫描条码";
								} else {
									that.itemInfo = {
										...item,
									}
									that.tipchange = true;
									that.tipword = "条码校验成功！";
								}
							} else {
								that.setItemInfo(itemId, true)
							}
						} else {
							that.setItemInfo(itemId, true)
						}
					},
					fail: function() {
						that.setItemInfo(itemId, true)
					}
				})
			},
		},
		onLoad: function(option) {
			GetWorkOrderStock().then((res) => {
				if (res.responseCode == 0) {

					this.workNumList = Array.from(new Set(res.Data.map(_ => _.workOrderNum)));
					console.log("res.Data", this.workNumList)
				} else {
					this.tipchange = true;
					this.tipword = res.responseMessage;
				}
			})
		}
	}
</script>
<style scoped>
	/deep/ .uni-combox {
		width: calc(100% - 100px);
		height: 32px;
		border-color: #385A91;
		color: #fff;
	}

	/deep/ .uni-combox .uni-input-input {
		padding-right: 10px;
		box-sizing: border-box;
	}

	/deep/ .uni-combox .uni-combox__selector {
		background-color: #0c1a4c;
	}
</style>
<style>
	.createTask {
		padding-top: 40px;
	}

	.createTask /deep/ .uni-easyinput__content {
		min-height: 32px;
	}

	.createTask /deep/ .uniui-clear {
		width: 28px;
		height: 28px;
		color: #446fb4 !important;
		font-size: 28px !important;
		line-height: 28px !important;
		padding: 0;
		margin-right: 5px;
	}

	.createTask .inventoryModification-list-item /deep/ .uni-input-input {
		text-align: right;
	}

	.text-area {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.createTask {
		width: 100%;
		flex: 1;
		border-radius: 8px;
		overflow-y: scroll;
	}

	.inventoryModification-list {
		width: 100%;
		height: auto;
		background: #1c2c4a;
		border-radius: 4px;
		padding: 40px 13px 20px;
		position: relative;
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
		border-top-left-radius: 8px;
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
