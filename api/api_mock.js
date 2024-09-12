import request from '../utils/request.js'
const kutai = uni.getStorageSync('kutai');
export function PDA_Login(params) {
	return new Promise((resolve, reject) => {
		setTimeout(function() {
			resolve({
				"responseCode": 0,
				"responseMessage": "string",
				"Data": {}
			});
		});
	})
}

// 以下是重构新接口
export function PDA_KutaiList(id) {
	return new Promise((resolve, reject) => {
		setTimeout(function() {
			resolve({
				"KutaiInfos": [{
						"Kutai": 1,
						"Description": "小卷出库口A0"
					},
					{
						"Kutai": 10,
						"Description": "大卷入库口03"
					},
					{
						"Kutai": 11,
						"Description": "大卷入库口01"
					},
					{
						"Kutai": 2,
						"Description": "大卷出库口A5"
					},
					{
						"Kutai": 3,
						"Description": "大卷出库口A4"
					},
					{
						"Kutai": 4,
						"Description": "大卷出库口A3"
					},
					{
						"Kutai": 5,
						"Description": "大卷出库口A2"
					},
					{
						"Kutai": 6,
						"Description": "大卷出库口A1"
					},
					{
						"Kutai": 7,
						"Description": "小卷入库口09"
					},
					{
						"Kutai": 8,
						"Description": "大卷入库口07"
					},
					{
						"Kutai": 9,
						"Description": "大卷入库口05"
					}
				],
				"responseCode": 0,
				"responseMessage": "",
				"Data": null
			});
		});
	})
}

export function PDA_EntryTray(params) {
	return new Promise((resolve, reject) => {
		setTimeout(function() {
			resolve({
				"responseCode": 0,
				"responseMessage": "string",
				"Data": {}
			});
		});
	})
}

export function PDA_CallEmptyTray(params) {
	return new Promise((resolve, reject) => {
		setTimeout(function() {
			resolve({
				"responseCode": 0,
				"responseMessage": "string",
				"Data": {}
			});
		});
	})
}

// 盘点
export function PDA_InventoryTasklist() {
	return new Promise((resolve, reject) => {
		setTimeout(function() {
			resolve({
				"TaskInfos": [{
					"TaskId": 0,
					"ContainerNum": "string",
					"DeliveryAmount": "string",
					"DeliverDetail": [{
						"NeedPick": 0,
						"TrayInfoDetailID": "string",
						"TrayInfoID": "string",
						"EntryType": 0,
						"FullCode": "string",
						"Sign": "string",
						"GroupNo": "string",
						"Oid": "string",
						"NgProductDesc": "string",
						"ProductTime": "string",
						"TeamDesc": "string",
						"WorkOrderNumber": "string",
						"RollNum": 0,
						"SalesOrderNumber": "string",
						"SalesOrderLine": "string",
						"MaterialCode": "string",
						"MaterialDescription": "string",
						"Weight": 0,
						"Length": 0,
						"Quantity": 0,
						"CostCenter": "string",
						"State": 0,
						"Mask": 0,
						"IsHold": 0,
						"CreateTime": "2023-02-09T02:02:54.369Z",
						"CreateUser": "string",
						"ModifyTime": "2023-02-09T02:02:54.369Z",
						"ModifyUser": "string",
						"Remark": "string",
						"colorCode": "string",
						"features": "string",
						"embossing": "string",
						"width": "string",
						"thickness": "string",
						"hardness": "string"
					}]
				}],
				"responseCode": 0,
				"responseMessage": "string",
				"Data": {}
			});
		});
	})
}

export function PDA_InventoryTaskDetail(id) {
	return new Promise((resolve, reject) => {
		setTimeout(function() {
			resolve({
				"ResTaskInventoryDetails": [{
					"TrayInfoDetailId": "string",
					"Oid": "string",
					"SaleNum": "string",
					"SaleLineNum": "string",
					"WorkOrderNum": "string",
					"RollNum": 0,
					"Weight": 0,
					"Length": 0
				}],
				"responseCode": 0,
				"responseMessage": "string",
				"Data": {}
			});
		});
	})
}

export function PDA_Inventorysubmit(params) {
	return new Promise((resolve, reject) => {
		setTimeout(function() {
			resolve({
				"responseCode": 0,
				"responseMessage": "string",
				"Data": {}
			});
		});
	})
}

// 拣选
export function PDA_PickTasklist() {
	return new Promise((resolve, reject) => {
		setTimeout(function() {
			resolve({
				"TaskInfos": [{
					"TaskId": 0,
					"ContainerNum": "string",
					"DeliveryAmount": "string",
					"DeliverDetail": [{
						"NeedPick": 0,
						"TrayInfoDetailID": "string",
						"TrayInfoID": "string",
						"EntryType": 0,
						"FullCode": "string",
						"Sign": "string",
						"GroupNo": "string",
						"Oid": "string",
						"NgProductDesc": "string",
						"ProductTime": "string",
						"TeamDesc": "string",
						"WorkOrderNumber": "string",
						"RollNum": 0,
						"SalesOrderNumber": "string",
						"SalesOrderLine": "string",
						"MaterialCode": "string",
						"MaterialDescription": "string",
						"Weight": 0,
						"Length": 0,
						"Quantity": 0,
						"CostCenter": "string",
						"State": 0,
						"Mask": 0,
						"IsHold": 0,
						"CreateTime": "2023-02-09T02:02:54.421Z",
						"CreateUser": "string",
						"ModifyTime": "2023-02-09T02:02:54.422Z",
						"ModifyUser": "string",
						"Remark": "string",
						"colorCode": "string",
						"features": "string",
						"embossing": "string",
						"width": "string",
						"thickness": "string",
						"hardness": "string"
					}]
				}],
				"responseCode": 0,
				"responseMessage": "string",
				"Data": {}
			});
		});
	})
}


export function PDA_PickTaskDetail(id) {
	return new Promise((resolve, reject) => {
		setTimeout(function() {
			resolve({
				"ResTaskDetails": [{
					"TaskId": 0,
					"GroupNo": "string",
					"Oid": "string",
					"SaleNum": "string",
					"SaleLineNum": "string",
					"WorkOrderNum": "string",
					"RollNum": 0,
					"Weight": 0,
					"Length": 0,
					"NeedPick": true
				}],
				"responseCode": 0,
				"responseMessage": "string",
				"Data": {}
			});
		});
	})
}

export function PDA_CallTrayBack(params) {
	return new Promise((resolve, reject) => {
		setTimeout(function() {
			resolve({
				"responseCode": 0,
				"responseMessage": "string",
				"Data": {}
			});
		});
	})
}

export function PDA_Picksubmit(params) {
	return new Promise((resolve, reject) => {
		setTimeout(function() {
			resolve({
				"responseCode": 0,
				"responseMessage": "string",
				"Data": {}
			});
		});
	})
}

export function PDA_BarCodeBindTray(params) {
	return new Promise((resolve, reject) => {
		setTimeout(function() {
			resolve({
				"BarCodeInfos": [{
					"Oid": "string",
					"SaleNum": "string",
					"SaleLine": "string",
					"WorkOrderNum": "string",
					"Weight": 0,
					"Length": 0,
					"RollNum": 0
				}],
				"responseCode": 0,
				"responseMessage": "string",
				"Data": {}
			});
		});
	})
}

export function PDA_BindBarCodeData(params) {
	return new Promise((resolve, reject) => {
		setTimeout(function() {
			resolve({
				"BindBarCodeInfos": [{
					"GroupNo": "string",
					"Oid": "string",
					"SaleNum": "string",
					"SaleLine": "string",
					"WorkOrderNum": "string",
					"Weight": 0,
					"Length": 0,
					"RollNum": 0
				}],
				"responseCode": 0,
				"responseMessage": "string",
				"Data": {}
			});
		});
	})
}

export function GetPickList() {
	return new Promise((resolve, reject) => {
		setTimeout(function() {
			resolve({
				"TaskInfos": [{
					"TaskId": 0,
					"ContainerNum": "string",
					"DeliveryAmount": "string",
					"DeliverDetail": [{
						"NeedPick": 0,
						"TrayInfoDetailID": "string",
						"TrayInfoID": "string",
						"EntryType": 0,
						"FullCode": "string",
						"Sign": "string",
						"GroupNo": "string",
						"Oid": "string",
						"NgProductDesc": "string",
						"ProductTime": "string",
						"TeamDesc": "string",
						"WorkOrderNumber": "string",
						"RollNum": 0,
						"SalesOrderNumber": "string",
						"SalesOrderLine": "string",
						"MaterialCode": "string",
						"MaterialDescription": "string",
						"Weight": 0,
						"Length": 0,
						"Quantity": 0,
						"CostCenter": "string",
						"State": 0,
						"Mask": 0,
						"IsHold": 0,
						"CreateTime": "2023-02-09T02:02:54.421Z",
						"CreateUser": "string",
						"ModifyTime": "2023-02-09T02:02:54.422Z",
						"ModifyUser": "string",
						"Remark": "string",
						"colorCode": "string",
						"features": "string",
						"embossing": "string",
						"width": "string",
						"thickness": "string",
						"hardness": "string"
					}]
				}],
				"responseCode": 0,
				"responseMessage": "string",
				"Data": {}
			});
		});
	})
}

export function GetScanBarcodeInfo(barcode) {
	return new Promise((resolve, reject) => {
		setTimeout(function() {
			resolve({
				"BarCodeInfos": [{
					"Oid": "string",
					"SaleNum": "string",
					"SaleLine": "string",
					"WorkOrderNum": "string",
					"Weight": 0,
					"Length": 0,
					"RollNum": 0
				}],
				"responseCode": 0,
				"responseMessage": "string",
				"Data": {}
			});
		});
	})
}

export function GetNGList(id) {
	return new Promise((resolve, reject) => {
		setTimeout(function() {
			resolve({
				"responseCode": 0,
				"responseMessage": "string",
				"Data": {}
			});
		});
	})
}

export function CreateNGTask(data) {
	return new Promise((resolve, reject) => {
		setTimeout(function() {
			resolve({
				"responseCode": 0,
				"responseMessage": "string",
				"Data": {}
			});
		});
	})
}

export function CreateInventoryTask(data) {
	return new Promise((resolve, reject) => {
		setTimeout(function() {
			resolve({
				"responseCode": 0,
				"responseMessage": "string",
				"Data": {}
			});
		});
	})
}

export function GetWorkOrderStock() {
	return new Promise((resolve, reject) => {
		setTimeout(function() {
			resolve({
				"responseCode": 0,
				"responseMessage": "string",
				"Data": {}
			});
		});
	})
}

export function GetReplaceBarcode(kutai, barcode, WeightConfirm) {
	return new Promise((resolve, reject) => {
		setTimeout(function() {
			resolve({
				"responseCode": 0,
				"responseMessage": "string",
				"Data": {}
			});
		});
	})
}

export function ChangeBarcode(data) {
	return new Promise((resolve, reject) => {
		setTimeout(function() {
			resolve({
				"responseCode": 0,
				"responseMessage": "string",
				"Data": {}
			});
		});
	})
}

export function SurplusBack(data) {
	return new Promise((resolve, reject) => {
		setTimeout(function() {
			resolve({
				"responseCode": 0,
				"responseMessage": "string",
				"Data": {}
			});
		});
	})
}
