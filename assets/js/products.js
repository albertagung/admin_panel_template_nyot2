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
				// Redirect to edit product page (kenapa disini? karena harus menunggu
				// localStorage di setting terlebih dahulu)
				window.location.replace('editProduct.html')
			})
			// Iterate through dataPosts and spread delete button
			$(`#btnDeleteProduct${i}`).click(() => {
				// Swal confirmation delete
				swal('Delete product?', 'Are you sure to delete this product?', 'warning', {
					buttons: ['Cancel', 'Delete'],
					dangerMode: true
				})
				.then((responseDelete) => {
					if (responseDelete) {
						// Loading overlay start
						$.LoadingOverlay('show')
						// Getting the post id based on button clicked
						let productId = $(`#btnEditProduct${i}`)
													.parent()
													.parent()
													.parent()
													.children()
													.children()
													.children()
													.children().val()
						// Define product delete by id 
						let urlDeleteProduct = `http://localhost:3000/products/delete/${productId}`
						// Axios delete product based on product id
						axios({
							method: 'delete',
							url: urlDeleteProduct
						})
						.then((response) => {
							// Loading overlay stop
							$.LoadingOverlay('hide')
							// Swal confirmation deleted
							swal('File Deleted', 'Your file has been deleted', 'success')
							.then(() => {
								console.log(response.data)
								// Refresh page
								window.location.replace('')
							})
						})
					} else {
						// Close swal
						swal.close()
					}
				})
			})
		}
	}, 2000)

})