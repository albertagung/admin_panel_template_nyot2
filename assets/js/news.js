$(document).ready(() => {
	
	// Declaring dataPosts array
	let dataPosts = []

	// Get data
	let postGetUrl = 'http://localhost:3000/posts'
	axios.get(postGetUrl).then((response) => {
		dataPosts = response.data.data
	})

	// Get post id on click
	// Timer to detect changes in DOM elements every 2 seconds
	window.setInterval(() => {
		// Getting data length from database
		for (let i = 0; i < dataPosts.length; i ++) {
			// iterate through dataPosts and spread the button
			$(`#btnEditPost${i}`).click(() => {
				// Getting the post id based on button clicked
				let postId = $(`#btnEditPost${i}`)
											.parent()
											.parent()
											.parent()
											.children()
											.children()
											.children()
											.children().val()
				// Setting postId into localStorage
				localStorage.setItem('postId', postId)
			})
		}
	}, 2000)

})