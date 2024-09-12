<template>
	<view class="page-container inventoryModification">
		<titleNView title="抽检详情" titleIcon="/static/nav_choujian.png"></titleNView>
		<view class="text-area">
			<view class="search-bar">
				<uni-easyinput v-model="inputValue" type="text" :styles="{ color: '#fff', borderColor: '#385A91' }"
					confirmType="done" @confirm="searchTraybarcode">
				</uni-easyinput>
				<image class="search-icon" src="/static/icon_search.png" @click="searchTraybarcode"></image>
			</view>
			<view class="inventoryModification-content" v-show="checkSuccess">
				<view class="inventoryModification-list">
					<view class="inventoryModification-label">原始值</view>
					<view class="inventoryModification-list-item">
						<text class="inventoryModification-list-key">销售订单号</text>
						<text class="inventoryModification-list-value">{{
              itemInfo.SalesOrderNumber
            }}</text>
					</view>
					<view class="inventoryModification-list-item">
						<text class="inventoryModification-list-key">销售订单行号</text>
						<text class="inventoryModification-list-value">{{
              itemInfo.SalesOrderLine
            }}</text>
					</view>
					<view class="inventoryModification-list-item">
						<text class="inventoryModification-list-key">工单号</text>
						<text class="inventoryModification-list-value">{{
              itemInfo.WorkOrderNumber
            }}</text>
					</view>
					<view class="inventoryModification-list-item">
						<text class="inventoryModification-list-key">重量</text>
						<text class="inventoryModification-list-value">{{
              itemInfo.Weight
            }}</text>
					</view>
					<view class="inventoryModification-list-item">
						<text class="inventoryModification-list-key">长度</text>
						<text class="inventoryModification-list-value">{{
              itemInfo.Length
            }}</text>
					</view>
					<view class="inventoryModification-list-item">
						<text class="inventoryModification-list-key">支号</text>
						<text class="inventoryModification-list-value">{{
              itemInfo.RollNum
            }}</text>
					</view>
				</view>
				<view class="inventoryModification-list">
					<view class="inventoryModification-label">修改值</view>
					<view class="inventoryModification-list-item">
						<text class="inventoryModification-list-key">销售订单号</text>
						<text class="inventoryModification-list-value">{{
					  itemInfo.SalesOrderNumber
					}}</text>
					</view>
					<view class="inventoryModification-list-item">
						<text class="inventoryModification-list-key">销售订单行号</text>
						<text class="inventoryModification-list-value">{{
					  itemInfo.SalesOrderLine
					}}</text>
					</view>
					<view class="inventoryModification-list-item">
						<text class="inventoryModification-list-key">工单号</text>
						<text class="inventoryModification-list-value">{{
							itemInfo.WorkOrderNumber
						}}</text>
					</view>
					<view class="inventoryModification-list-item inputPadding">
						<text class="inventoryModification-list-key">重量</text>
						<uni-easyinput v-model="newItemInfo.Weight" type="number" :focus="isFocus" :clearable="true"
							:styles="{ color: '#fff', borderColor: '#385A91' }">
						</uni-easyinput>
					</view>
					<view class="inventoryModification-list-item inputPadding">
						<text class="inventoryModification-list-key">长度</text>
						<uni-easyinput v-model="newItemInfo.Length" type="number" :clearable="true" :styles="{
							color: '#fff', borderColor: '#385A91', textAlign: 'right'}">
						</uni-easyinput>
					</view>
					<view class="inventoryModification-list-item inputPadding">
						<text class="inventoryModification-list-key">支号</text>
						<uni-easyinput v-model="newItemInfo.RollNum" type="number" :clearable="true"
							:styles="{ color: '#fff', borderColor: '#385A91' }">
						</uni-easyinput>
					</view>
				</view>
			</view>
			<footerBtnList :btnList="footerBtn" v-show="checkSuccess"></footerBtnList>
			<view class="choose-box" v-show="checkSuccess">
				<view class="choose-flex">
					<view class="choose-item">
						<uni-data-checkbox multiple v-model="radioChecked" :localdata="[{
								text: '托盘携带钢管',
								value: '托盘携带钢管'
							}]"></uni-data-checkbox>
					</view>
					<view class="choose-item-btn">
						<footerBtnList :btnList="footerBtn2" v-show="checkSuccess"></footerBtnList>
					</view>
				</view>
			</view>
		</view>
		<messagePop v-show="tipchange" :tipword="tipword" @close="closeMsg" @callBack="callBack"></messagePop>
	</view>
</template>

<script>
	import {
		PDA_Picksubmit,
		GetPickList,
		PDA_Inventorysubmit,
		PDA_CallTrayBack
	} from "@/api/api.js";
	export default {
		data() {
			return {
				isFocus: false,
				tipchange: false,
				tipword: "",
				inputValue: "",
				itemInfo: {},
				newItemInfo: {
					Weight: '',
					Length: '',
					RollNum: ''
				},
				footerBtn: [{
					title: "出库",
					background: "linear-gradient(180deg, #3882F4 0%, #2057EC 100%)",
					color: "#fff",
					callback: () => this.openSumbit(),
				}, {
					title: "修改",
					background: "linear-gradient(180deg, #F49638 0%, #EC7220 100%)",
					color: "#fff",
					callback: () => this.openEdit(),
				}],
				footerBtn2: [{
					title: "托盘回库",
					background: "linear-gradient(180deg, #3882F4 0%, #2057EC 100%",
					color: "#fff",
					callback: () => this.openType(),
				}],
				timer: null,
				edittype: false,
				ptype: false,
				sumbittype: false,
				backType: false,
				radioChecked: ['托盘携带钢管'],
				checkSuccess: false,
				_id: '',
				DeliverDetail: []
			};
		},
		methods: {
			closeMsg() {
				this.tipchange = false;
				this.tipword = "";
				this.ptype = false;
				this.edittype = false;
				this.sumbittype = false;
				this.backType = false;
				this.inputValue = "";
				clearTimeout(this.timer)
			},
			// 修改
			openEdit() {
				this.tipchange = true;
				this.tipword = "是否确认修改？";
				this.edittype = true;
			},
			openType() {
				if (this.radioChecked.some(_ => _ == "托盘携带钢管")) {
					this.tipword = "是否确认托盘携带钢管？";
				} else {
					this.tipword = "是否确认托盘未携带钢管？";
				}
				this.tipchange = true;
				this.ptype = true;
			},
			//出库
			openSumbit() {
				this.tipword = "是否确认出库？";
				this.tipchange = true;
				this.sumbittype = true;
			},
			sumbit() { //出库
				let data = {
					TaskId: this._id,
					BarCodes: [this.itemInfo.Oid],
				};
				PDA_Picksubmit(data)
					.then((res) => {
						if (res.responseCode == 0) {
							this.tipchange = true;
							this.tipword = "出库成功！";
						} else {
							this.tipchange = true;
							this.tipword = "出库失败！";
							this.timer = setTimeout(() => {
								this.closeMsg()
								clearTimeout(this.timer)
							}, 3000);
						}
					})
			},
			callBack() {
				if (this.ptype) {
					this.trayBackNew()
				} else if (this.edittype) {
					this.editFn()
				} else if (this.sumbittype) {
					this.sumbit();
				} else if (this.backType) {
					uni.navigateBack();
				}
			},
			searchTraybarcode() {
				let str = this.inputValue.trim();
				if (!str) {
					this.tipchange = true;
					this.tipword = "请录入条码！";
					this.timer = setTimeout(() => {
						this.closeMsg()
						clearTimeout(this.timer)
					}, 3000);
					return;
				}
				//检查是否在出货范围
				let _obj = this.DeliverDetail.find(_ => _.FullCode == str)
				if (!_obj) {
					this.tipchange = true;
					this.tipword = "条码校验失败！";
					this.timer = setTimeout(() => {
						this.closeMsg()
						clearTimeout(this.timer)
					}, 3000);
					this.itemInfo = {};
					this.checkSuccess = false;
					return;
				} else {
					this.itemInfo = _obj;
					this.checkSuccess = true;
					this.tipchange = true;
					this.tipword = "条码校验成功！";
				}
			},
			editFn() {
				let that = this;
				console.log(Number(this.newItemInfo.Weight), Number(this.newItemInfo.Weight) < 0)

				if (this.newItemInfo.Weight == '' || this.newItemInfo.Length == '' || this.newItemInfo.RollNum == '') {
					this.$nextTick(() => {
						this.tipchange = true;
						this.tipword = '请完整输入修改信息！';
					})
					return
				} else if (Number(this.newItemInfo.Length) < 0) {
					this.$nextTick(() => {
						this.tipchange = true;
						this.tipword = '长度请输入不小于0的数值';
					})
					return
				} else if (Number(this.newItemInfo.Weight) < 0) {
					console.log('--------')
					this.$nextTick(() => {
						this.tipchange = true;
						this.tipword = '重量请输入不小于0的数值';
					})
					return
				}
				let data = {
					TaskId: this._id,
					taskInventoryDetails: [{
						TrayInfoDetailId: this.itemInfo.TrayInfoDetailID,
						Oid: this.itemInfo.Oid,
						SaleNum: this.itemInfo.SalesOrderNumber,
						SaleLineNum: this.itemInfo.SalesOrderLine,
						WorkOrderNum: this.itemInfo.WorkOrderNumber,
						RollNum: this.newItemInfo.RollNum,
						Weight: this.newItemInfo.Weight,
						Length: this.newItemInfo.Length,
					}]
				};
				PDA_Inventorysubmit(data)
					.then((res) => {
						if (res.responseCode == 0) {
							this.tipchange = true;
							this.tipword = '修改成功';
							this.itemInfo.Weight = this.newItemInfo.Weight;
							this.itemInfo.Length = this.newItemInfo.Length;
							this.itemInfo.RollNum = this.newItemInfo.RollNum;
							this.newItemInfo = {
								Weight: '',
								Length: '',
								RollNum: ''
							};
							this.backType = true;//2023/4/27 智林的意思是点完后因为是自动生成了回库任务，不用再停在这个界面点托盘回库
						} else {
							this.tipchange = true;
							this.tipword = res.responseMessage;
						}
					})
			},
			trayBackNew() {
				let data = {
					TaskId: this._id,
					NeedPick: false,
					IsExistsSteel: this.radioChecked.some(_ => _ == "托盘携带钢管")
				};
				PDA_CallTrayBack(data)
					.then((res) => {
						if (res.responseCode == 0) {
							this.tipchange = true;
							this.tipword = '回库成功';
							this.backType = true;
						} else {
							this.tipchange = true;
							this.tipword = res.responseMessage;
						}
					})
			},
			GetPickListData() {
				GetPickList()
					.then((res) => {
						if (res.responseCode == 0) {
							if (!res.TaskInfos.length) {
								this.tipchange = true;
								this.tipword = "数据为空";
								return;
							}
							this._id = res.TaskInfos[0].TaskId;
							this.DeliverDetail = res.TaskInfos[0].DeliverDetail;
							// this.setInventoryData(res.TaskInfos[0].DeliverDetail);
						} else {
							this.tipchange = true;
							this.tipword = res.responseMessage;
						}
					})
			}
		},
		onLoad: function() {
			this.GetPickListData()
		},
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
		margin-bottom: 10px;
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

	.choose-box {
		width: 100%;
		height: 55px;
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
		margin-right: 6px;
	}

	.choose-item-btn {
		width: fit-content;
	}
</style>
