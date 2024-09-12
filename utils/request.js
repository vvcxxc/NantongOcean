import urlConfig from './config.js'
const baseRequest = (url, method, data) => {
	//请求拦截
	uni.showLoading({
		title: '加载中',
		mask: true
	});

	let timer = 60000
	// let newData = data
	const kutai = uni.getStorageSync('kutai');
	if (kutai) {
		data = {
			...data,
			Kutai: Number(kutai)
		}
	}

	return new Promise((resolve, reject) => {
		uni.getNetworkType({
			success: function(res) {
				if (res.networkType != 'none') {
					uni.request({
						url: urlConfig + url,
						data: data,
						method: method,
						timeout: timer,
						header: {
							// 'token': token
						},
						sslVerify: false,
						success(res) {
							uni.hideLoading();
							if (res.statusCode === 200) {
								resolve(res.data)
							} else if (res.statusCode === 503) {
								uni.showToast({
									title: '请求服务器失败',
									icon: "none",
									duration: 2500,
									mask: true,
								});
							} else {
								console.log("res.errMsg", res)
								uni.showToast({
									title: res.data.responseMessage || res.data
										.Message,
									icon: "none",
									duration: 2500,
									mask: true,
								});
							}
						},
						fail(err) {
							uni.hideLoading();
							if (err.errMsg != 'request:fail abort') {
								uni.showToast({
									title: '请求失败,请重新尝试',
									icon: "none",
									duration: 2500,
									mask: true,
								});
							} else {
								reject(err)
							}
						},
						complete(res) {}
					})
				}
			},
		})

	})
}

export default {
	baseRequest,
}
