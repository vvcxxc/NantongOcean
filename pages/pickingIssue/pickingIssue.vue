<template>
	<view class="page-container pickingIssue">
		<titleNView title="出库详情" titleIcon="/static/nav_pick.png"></titleNView>
		<view class="text-area">
			<view class="top-tips">请扫描需要出库的货物条码</view>
			<view class="pickingIssue-list-item">
				<view class="pickingIssue-list-value">
					<uni-easyinput v-model="inputValue" type="text" :focus="isFocus" confirmType="done"
						:styles="{ color: '#fff', borderColor: '#385A91' }" @confirm="checkOrder">
					</uni-easyinput>
				</view>
			</view>
			<view class="list-area">
				<view class="list-item" v-for="(item, idx) in sideListData" :key="idx">
					<borderArea>
						<sideList :dataList="item"></sideList>
					</borderArea>
				</view>
			</view>
			<view class="choose-box">
				<view class="choose-flex">
					<view class="choose-item">
						<uni-data-checkbox multiple v-model="radioChecked" :localdata="[{
								text: '托盘携带钢管',
								value: '托盘携带钢管'
							}]"></uni-data-checkbox>
					</view>
				</view>
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
		PDA_Picksubmit,
		PDA_CallTrayBack,
		GetPickList
	} from "@/api/api.js";
	export default {
		data() {
			return {
				isFocus: false,
				tipchange: false,
				tipword: "",
				backType: false,
				inputValue: "",
				footerBtn: [{
						title: "确认出库",
						background: " linear-gradient(180deg, #3882F4 0%, #2057EC 100%)",
						color: "#fff",
						callback: () => this.openSumbit(),
					},
					{
						title: "托盘回库",
						background: " linear-gradient(180deg, #3882F4 0%, #2057EC 100%)",
						color: "#fff",
						callback: () => this.openType(),
					},
				],
				deleType: false,
				timer: null,
				ptype: false,
				sumbittype: false,
				radioChecked: ['托盘携带钢管'],
				_id: '',
				DeliverDetail: [], //可以出库的所有货物的列表
				sideListData: [], //扫出来检验成功的列表
			};
		},
		methods: {
			closeMsg() {
				this.tipchange = false;
				this.tipword = "";
				this.ptype = false;
				this.backType = false;
				this.deleType = false;
				this.sumbittype = false;
				this.inputValue = "";
				clearTimeout(this.timer);
			},
			checkOrder() {
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
					return;
				} else {
					//检查第一次扫码还是第二次扫码
					let item = [];
					this.sideListData.map(_ => {
						_.map(_2 => {
							if (_2.key == "FullCode" && _2.value == str) {
								item = _; //是_数组,不是_2对象
							}
						})
					})
					console.log(item)
					if (!item.length) {
						this.sideListData.push(
							[{
									key: "序号",
									value: this.sideListData.length + 1,
								}, {
									key: "条码",
									value: _obj.Oid,
								},
								{
									key: "销售订单号",
									value: _obj.SalesOrderNumber,
								},
								{
									key: "销售订单行号",
									value: _obj.SalesOrderLine,
								},
								{
									key: "工单号",
									value: _obj.WorkOrderNumber,
								},
								{
									key: "重量",
									value: _obj.Weight,
								},
								{
									key: "长度",
									value: _obj.Length,
								},
								{
									key: "支号",
									value: _obj.RollNum,
								},
								{
									key: "FullCode",
									value: _obj.FullCode,
									hidden: true
								}
							])
						this.tipchange = true;
						this.tipword = "条码校验成功！";
					} else {
						this.tipchange = true;
						this.tipword = "是否删除条码信息？";
						this.deleType = true;
						//这个情况this.inputValue在callback还需要用
					}
				}
			},
			sumbit() { //出库
				let BarCodes = [];
				this.sideListData.map(_ => {
					_.map(_2 => {
						if (_2.key == "条码") {
							BarCodes.push(_2.value)
						}
					})
				})
				let data = {
					TaskId: this._id,
					BarCodes,
				};
				PDA_Picksubmit(data)
					.then((res) => {
						if (res.responseCode == 0) {
							this.tipchange = true;
							this.tipword = "出库成功！";
							this.sideListData = [];
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
			openSumbit() {
				this.tipword = "是否确认出库？";
				this.tipchange = true;
				this.sumbittype = true;
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
			callBack() {
				if (this.ptype) {
					let data = {
						TaskId: Number(this._id),
						NeedPick: true,
						IsExistsSteel: this.radioChecked.some(_ => _ == "托盘携带钢管")
					};
					PDA_CallTrayBack(data)
						.then((res) => {
							if (res.responseCode == 0) {
								this.tipchange = true;
								this.tipword = "托盘回库成功！";
								this.backType = true;
							} else {
								this.tipchange = true;
								this.tipword = res.responseMessage;
							}
						})
				} else if (this.deleType) {
					let temp = []
					let i = 1;
					this.sideListData.map(_ => {
						let item = _.find(_2 => _2.key == "FullCode" && _2.value == this.inputValue.trim())
						if (!item) {
							_.forEach(_2 => {
								if (_2.key == '序号') {
									_2.value = i;
								}
							})
							i += 1;
							temp.push(_)
						}
					})
					this.sideListData = temp;
				} else if (this.sumbittype) {
					this.sumbit();
				} else if (this.backType) {
					uni.navigateBack();
				}
			},
		},
		onLoad: function(option) {
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
					} else {
						this.tipchange = true;
						this.tipword = res.responseMessage;
					}
				})
		},
	};
</script>

<style>
	.pickingIssue {
		padding-top: 65px;
	}

	.pickingIssue /deep/ .uni-easyinput__content {
		min-height: 32px;
	}

	.pickingIssue /deep/ .uniui-clear {
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

	.top-tips {
		width: 100%;
		height: 32px;
		color: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
	}

	.list-area {
		padding: 10px;
		width: 100%;
		flex: 1;
		background: #1c2c4a;
		border-radius: 8px;
		overflow-y: scroll;
	}

	.list-item {
		width: 100%;
		height: auto;
		margin-bottom: 10px;
	}

	.pickingIssue-list-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
		line-height: 20px;
	}

	.pickingIssue-list-item:last-child {
		margin-bottom: 0;
	}

	.pickingIssue-list-key {
		width: 67px;
		color: #fff;
		font-size: 14px;
	}

	.pickingIssue-list-value {
		flex: 1;
		height: 34px;
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
