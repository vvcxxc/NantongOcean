<template>
	<view class="page-container largeVolumeWarehousing">
		<titleNView title="不合格品任务创建" titleIcon="/static/nav_ungrade.png"></titleNView>
		<view class="text-area">

			<view class="largeVolumeWarehousing-area">
				<view class="input-item">
					<uni-easyinput v-model="value" type="text" :focus="isFocus" confirmType="search"
						:styles="{ color: '#fff', borderColor: '#385A91' }" @confirm="barCodeBindTray">
					</uni-easyinput>
					<image class="search-icon" src="/static/icon_search.png" @click="barCodeBindTray"></image>
				</view>
				<view class="border-list">
					<view class="border-item">
						<view class="item-left title">工单号/成本中心号</view>
						<view class="item-middle title">数量</view>
						<view class="item-right title">物料描述</view>
					</view>
					<view :class="item.checked?'border-item check-item':'border-item'" v-for="item in dataList"
						:key="item.oid" @click="checkedItem(item)">
						<view class="item-left title">{{item.workOrderNumber || item.costCenter }}</view>
						<view class="item-middle title">{{item.quantity }}</view>
						<view class="item-right title">{{item.materialDescription }}</view>
					</view>
				</view>
			</view>
			<footerBtnList :btnList="footerBtn"></footerBtnList>
			<messagePop v-show="tipchange" :tipword="tipword" @close="closeMsg" @callBack="callBack"></messagePop>
		</view>
	</view>
</template>

<script>
	import {
		GetNGList,
		CreateNGTask
	} from "@/api/api.js";
	export default {
		data() {
			return {
				isFocus: false,
				tipchange: false,
				tipword: "",
				value: "",
				footerBtn: [{
					title: "创建任务",
					background: " linear-gradient(180deg, #3882F4 0%, #2057EC 100%)",
					color: "#fff",
					callback: () => this.openType(),
				}, ],
				dataList: [],
				ctype: false,
			};
		},
		methods: {
			callBack() {
				if (this.ctype) {
					this.sumbit()
				}
			},
			closeMsg() {
				this.ctype = false;
				this.tipchange = false;
				this.tipword = "";
			},
			checkedItem(item) {
				item.checked = !item.checked;
			},
			barCodeBindTray() {
				if (!this.value) {
					this.tipchange = true;
					this.tipword = "请输入条码！";
					return
				}
				GetNGList(this.value).then((res) => {
					if (res.responseCode == 0) {
						this.tipchange = true;
						this.tipword = "条码校验成功！";
						this.dataList = res.Data.map(_ => ({
							..._,
							checked: false
						}));
					} else {
						this.tipchange = true;
						this.tipword = res.responseMessage;
					}
				})
			},
			openType() {
				if (!this.dataList.some(_ => _.checked)) {
					this.tipchange = true;
					this.tipword = "请选择数据";
					return
				}
				this.tipword = "是否确认创建任务？";
				this.tipchange = true;
				this.ctype = true;
			},
			sumbit() {
				CreateNGTask({
					ng_list: this.dataList.filter(_ => _.checked)
				}).then((res) => {
					if (res.responseCode == 0) {
						this.tipchange = true;
						this.tipword = "创建成功！";
						this.dataList = [];
					} else {
						this.tipchange = true;
						this.tipword = res.responseMessage;
					}
				})
			},
		},
		mounted() {
			GetNGList('').then((res) => {
				if (res.responseCode == 0) {
					this.dataList = res.Data.map(_ => ({
						..._,
						checked: false
					}));
				}
			})
		}
	};
</script>

<style>
	.largeVolumeWarehousing {
		padding-top: 75px;
	}

	.largeVolumeWarehousing /deep/ .uni-easyinput__content {
		min-height: 32px;
	}

	.largeVolumeWarehousing /deep/ .uniui-clear {
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
		margin-bottom: 30px;
		display: flex;
		align-items: center;
	}

	.search-icon {
		width: 20px;
		height: 20px;
		margin-left: 10px;
	}

	.border-list {
		width: 100%;
		height: auto;
		border-radius: 8px;
		border: 1px solid #446FB4;
		border-bottom: none;
		overflow: hidden;
	}

	.border-item {
		width: 100%;
		height: 38px;
		border-bottom: 1px solid #446FB4;
		display: flex;
	}

	.check-item {
		background-color: #2B4678;
	}

	.item-left {
		width: 150px;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #FFFFFF;
		border-right: 1px solid #446FB4;
	}

	.item-middle {
		flex: auto;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #FFFFFF;
		border-right: 1px solid #446FB4;
	}

	.item-right {
		width: 80px;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #FFFFFF;
		line-height: 1;
		word-break: break-all;
	}

	.title {
		color: #B5C5E5;
	}
</style>
