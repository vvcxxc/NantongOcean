<template>
	<view class="page-container">
		<titleNView title="出库" titleIcon="/static/nav_pick.png"></titleNView>
		<view class="text-area">
			<view class="noBorder-area">
				<noBorderArea>
					<leftList :dataList="leftListData"></leftList>
				</noBorderArea>
			</view>
			<view class="list-area">
				<view class="list-item" v-for="(item, idx) in sideListData" :key="idx">
					<borderArea>
						<sideList :dataList="item"></sideList>
					</borderArea>
				</view>
				<div class="no-data" v-if="!sideListData.length">
					<noData></noData>
				</div>
			</view>
			<view class="list-tips">
				<image class="tips-icon" src="/static/icon_prompt.png"></image>
				<text class="tips-text">托盘货物详情信息，包括订单号及内容</text>
			</view>

			<view class="footerBtn-tips">
				<footerBtnList :btnList="footerBtn"></footerBtnList>
			</view>
		</view>
		<messagePop v-show="tipchange" :tipword="tipword" @close="closeMsg" @callBack="callBack"></messagePop>
	</view>
</template>

<script>
	import {
		PDA_CallTrayBack,
		GetPickList
	} from "@/api/api.js";
	export default {
		data() {
			return {
				tipchange: false,
				tipword: "",
				ptype: false,
				backType: false,
				footerBtn: [{
						title: "出库",
						background: " linear-gradient(180deg, #3882F4 0%, #2057EC 100%)",
						color: "#fff",
						callback: () => this.editPicking(),
					},
					{
						title: "退库",
						background: " linear-gradient(180deg, #3882F4 0%, #2057EC 100%)",
						color: "#fff",
						callback: () => this.openType(),
					},
				],
				leftListData: [],
				sideListData: [],
				_id:''
			};
		},
		methods: {
			closeMsg() {
				this.tipchange = false;
				this.tipword = "";
				this.ptype = false;
				this.backType = false;
			},
			editPicking() {
				if (!this.sideListData.length) {
					this.tipchange = true;
					this.tipword = "数据为空";
					return;
				}
				uni.navigateTo({
					url: `/pages/pickingIssue/pickingIssue`,
				});
			},
			openType() {
				this.tipword = "是否确认退库？";
				this.tipchange = true;
				this.ptype = true;
			},
			callBack() {
				if (this.ptype) {
					let data = {
						TaskId: this._id,
						NeedPick: false,
					};
					PDA_CallTrayBack(data)
						.then((res) => {
							if (res.responseCode == 0) {
								this.tipchange = true;
								this.tipword = "退库成功！";
								this.backType = true;
							} else {
								this.tipchange = true;
								this.tipword = res.responseMessage;
							}
						})
				} else if (this.backType) {
					uni.navigateBack();
				}
			},
			getData() {
				GetPickList()
					.then((res) => {
						if (res.responseCode == 0) {
							if (!res.TaskInfos.length) {
								this.tipchange = true;
								this.tipword = "数据为空";
								return;
							}
							const data = res.TaskInfos[0]; //这个数组只会有一条数据
							this._id = data.TaskId
							this.leftListData = [{
									key: "任务号",
									value: data.TaskId,
								},
								{
									key: "取货地址",
									value: data.ContainerNum,
								},
								{
									key: "出货数量",
									value: data.DeliveryAmount,
								},
							];
							this.sideListData = data.DeliverDetail.map((item) => {
								return [{
										key: "条码",
										value: item.Oid,
									},
									{
										key: "销售订单号",
										value: item.SalesOrderNumber,
									},
									{
										key: "销售订单行号",
										value: item.SalesOrderLine,
									},
									{
										key: "工单号",
										value: item.WorkOrderNumber,
									},
									{
										key: "重量",
										value: item.Weight,
									},
									{
										key: "长度",
										value: item.Length,
									},
									{
										key: "支号",
										value: item.RollNum,
									}
								];
							});
						} else {
							this.tipchange = true;
							this.tipword = res.responseMessage;
						}
					})
			},
		},
		onShow: function() {
			this.tipchange = false;
			this.tipword = "";
			this.getData();
		},

	};
</script>

<style>
	.text-area {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.list-area {
		margin-top: 10px;
		padding: 10px 10px 30px;
		width: 100%;
		flex: auto;
		background: #1c2c4a;
		border-radius: 8px;
		overflow-y: scroll;
		position: relative;
	}

	.no-data {
		width: 100%;
		height: 300px;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.list-tips {
		width: calc(100% - 20px);
		height: auto;
		font-size: 14px;
		color: #d8995b;
		padding: 5px;
		background: #1c2c4a;
		box-sizing: border-box;
		position: fixed;
		left: 10px;
		bottom: 55px;
		display: flex;
		justify-content: flex-start;
		padding-left: 10px;
		word-break: break-all;
	}

	.tips-icon {
		width: 14px;
		height: 14px;
		margin-right: 6px;
		vertical-align: top;
	}

	.tips-text {
		width: calc(100% - 14px);
	}

	.list-item {
		width: 100%;
		height: auto;
		margin-bottom: 10px;
	}

	.choose-box {
		width: 100%;
		height: 30px;

	}

	.choose-flex {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.choose-item {
		width: 130px;
		height: 20px;
	}
</style>
