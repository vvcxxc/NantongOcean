<template>
	<view class="page-container">
		<titleNView title="抽检" titleIcon="/static/nav_choujian.png"></titleNView>
		<view class="text-area">
			<view class="noBorder-area">
				<noBorderArea>
					<leftList :dataList="leftListData"></leftList>
				</noBorderArea>
			</view>
			<view class="list-area">
				<view class="list-item" v-for="(item, idx) in sideListData" :key="idx">
					<view class="item-background">
						<borderArea>
							<sideList :dataList="item"></sideList>
						</borderArea>
					</view>
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
		<messagePop v-show="tipchange" :tipword="tipword" @close="closeMsg"></messagePop>
	</view>
</template>

<script>
	import {
		GetPickList,
	} from "@/api/api.js";
	export default {
		data() {
			return {
				tipchange: false,
				tipword: "",
				footerBtn: [{
						title: "开始抽检",
						background: "linear-gradient(180deg, #3882F4 0%, #2057EC 100%)",
						color: "#fff",
						callback: () => this.editInventory(),
					},

				],
				leftListData: [],
				sideListData: [],

			};
		},
		methods: {
			closeMsg() {
				this.tipchange = false;
				this.tipword = "";
			},
			editInventory() {
				if (!this.sideListData.length) {
					this.tipchange = true;
					this.tipword = "数据为空";
					return;
				}
				uni.navigateTo({
					url: `/pages/inventoryModification/inventoryModification`,
				});
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
							this.leftListData = [{
									key: "任务号",
									value: data.TaskId,
								},
								{
									key: "取货地址",
									value: data.ContainerNum,
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
		padding: 10px 10px 50px;
		width: 100%;
		flex: 1;
		background: #1c2c4a;
		border-radius: 8px;
		overflow-y: scroll;
	}

	.item-background {
		width: 100%;
		height: auto;
		position: relative;
	}

	.select-icon {
		width: 35px;
		height: 30px;
		position: absolute;
		right: 0;
		top: 0;
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
		/* margin-top: 4px; */
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
</style>
