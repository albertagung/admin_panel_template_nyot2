$(document).ready(() => {
	
	// Declaring dataPosts array
	let dataProducts = []

	// Get data
	let productGetUrl = 'http://localhost:3000/products'
	axios.get(productGetUrl).then((response) => {
		dataProducts = response.data.data
	})

	// Get post id on click
	// Timer to detect changes in DOM elements every 2 seconds
	window.setInterval(() => {
		// Getting data length from database
		for (let i = 0; i < dataProducts.length; i ++) {
			// iterate through dataPosts and spread the button
			$(`#btnEditProduct${i}`).click(() => {
				// Getting the post id based on button clicked
				let productId = $(`#btnEditProduct${i}`)
											.parent()
											.parent()
											.parent()
											.children()
											.children()
											.children()
											.children().val()
				// Setting postId into localStorage
				localStorage.setItem('productId', productId)
				console.log(productId)
			})
		}
	}, 2000)

})