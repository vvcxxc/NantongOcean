<template>
	<view class="page-container returnSurplusMaterials">
		<titleNView title="余料回库" titleIcon="/static/nav_yuliaohuiku.png"></titleNView>
		<view class="text-area">
			<noBorderArea>
				<view class="input-item">
					<uni-easyinput v-model="value" type="text" :focus="isFocus" confirmType="search"
						:styles="{ color: '#fff', borderColor: '#385A91' }" @confirm="barCodeBindTray">
					</uni-easyinput>
				</view>
			</noBorderArea>
			<view class="largeVolumeWarehousing-area">

				<view class="list-item" v-for="(item, idx) in returnSurplusMaterialsList" :key="idx">
					<borderArea>
						<sideList :dataList="item"></sideList>
					</borderArea>
				</view>
				<div class="no-data" v-if="!returnSurplusMaterialsList.length">
					<noData></noData>
				</div>

			</view>
			<footerBtnList :btnList="footerBtn"></footerBtnList>
			<messagePop v-show="tipchange" :tipword="tipword" @close="closeMsg" @callBack="callBack"></messagePop>
		</view>
	</view>
</template>

<script>
	import {
		GetScanBarcodeInfo,
		SurplusBack
	} from "@/api/api.js";
	export default {
		data() {
			return {
				isFocus: false,
				tipchange: false,
				tipword: "",
				value: "",
				returnSurplusMaterialsList: [

				],
				footerBtn: [{
					title: "余料回库",
					background: " linear-gradient(180deg, #3882F4 0%, #2057EC 100%)",
					color: "#fff",
					callback: () => this.sumbit(),
				}],
				deleType: false,
			};
		},
		methods: {
			callBack() {
				if (this.deleType) {
					let temp = []
					let i = 1;
					this.returnSurplusMaterialsList.map(_ => {
						let item = _.find(_2 => _2.key == "FullCode" && _2.value == this.value.trim())
						if (!item) {
							temp.push(_)
						}
					})
					this.returnSurplusMaterialsList = temp;
				}
			},
			closeMsg() {
				this.tipchange = false;
				this.deleType = false;
				this.value = "";
				this.tipword = "";
			},
			barCodeBindTray() {
				let str = this.value.trim();
				let item = [];
				this.returnSurplusMaterialsList.map(_ => {
					_.map(_2 => {
						if (_2.key == "FullCode" && _2.value == str) {
							item = _; //是_数组,不是_2对象
						}
					})
				})
				console.log(item)
				if (!item.length) {
					GetScanBarcodeInfo(this.value).then((res) => {
						if (res.responseCode == 0) {
							const item = res.BarCodeInfos[0];
							this.returnSurplusMaterialsList.push(
								[{
										key: "条码",
										value: item.Oid,
									},
									{
										key: "销售订单号",
										value: item.SaleNum,
									},
									{
										key: "销售订单行号",
										value: item.SaleLine,
									},
									{
										key: "工单号",
										value: item.WorkOrderNum,
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
									},
									{
										key: "FullCode",
										value: str,
										hidden: true
									}
								]
							);
							this.tipchange = true;
							this.tipword = "条码校验成功！";
						} else {
							this.tipchange = true;
							this.tipword = res.responseMessage;
						}
					})
				} else {
					this.tipchange = true;
					this.tipword = "是否删除条码信息？";
					this.deleType = true;
				}
			},
			sumbit() {
				if (!this.returnSurplusMaterialsList.length) {
					this.tipchange = true;
					this.tipword = "请扫描条码！";
					return;
				}
				let temp = [];
				this.returnSurplusMaterialsList.map(_ => {
					let obj = {
						materialCode: ''
					};
					_.map(_2 => {
						if (_2.key == '条码') {
							obj.oid = _2.value;
						} else if (_2.key == '销售订单号') {
							obj.salesOrderNumber = _2.value;
						} else if (_2.key == '销售订单行号') {
							obj.salesOrderLine = _2.value || '';
						} else if (_2.key == '工单号') {
							obj.workOrderNumber = _2.value;
						} else if (_2.key == '重量') {
							obj.weight = _2.value;
						} else if (_2.key == '长度') {
							obj.length = _2.value;
						} else if (_2.key == '支号') {
							obj.rollNum = _2.value;
						}

					})
					temp.push(obj)
				})
				SurplusBack({
					li_Surplus: temp
				}).then((res) => {
					if (res.responseCode == 0) {
						this.tipchange = true;
						this.tipword = "余料回库成功！";
						this.returnSurplusMaterialsList = [];
					} else {
						this.tipchange = true;
						this.tipword = res.responseMessage;
					}
				})
			},
		}
	};
</script>

<style>
	.returnSurplusMaterials {
		padding-top: 75px;
	}

	.returnSurplusMaterials /deep/ .uni-easyinput__content {
		min-height: 32px;
	}

	.returnSurplusMaterials /deep/ .uniui-clear {
		width: 28px;
		height: 28px;
		color: #446fb4 !important;
		font-size: 28px !important;
		line-height: 28px !important;
		padding: 0;
		margin-right: 5px;
	}

	.text-area {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.largeVolumeWarehousing-area {
		margin-top: 10px;
		padding: 10px;
		width: 100%;
		flex: 1;
		background: #1c2c4a;
		border-radius: 8px;
		overflow-y: scroll;

	}

	.input-item {
		width: 100%;
		height: 30px;
	}

	.list-item {
		width: 100%;
		height: auto;
		margin-bottom: 10px;
	}

	.no-data {
		width: 100%;
		height: 300px;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
</style>
