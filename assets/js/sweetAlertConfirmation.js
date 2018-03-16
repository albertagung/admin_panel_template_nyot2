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
		for (let i = 0; i < dataPosts.length; i++) {
			// iterate through dataPosts and spread the button
			$(`#btnDeletePost${i}`).click( async function(e) {
				// Getting the post id based on button clicked
				let postId = $(`#btnEditPost${i}`)
											.parent()
											.parent()
											.parent()
											.children()
											.children()
											.children()
											.children().val()
			  swal({
			      title: 'Are you sure?',
			      text: "You won't be able to revert this!",
			      type: 'warning',
			      showCancelButton: true,
			      confirmButtonText: 'Yes, delete it!'
			  }).then(function(result) {
			      if (result.value) {
			      	let urlDeletePost = `http://localhost:3000/posts/delete/${postId}`
			      	axios.delete(urlDeletePost)
			      	.then((dataPost) => {
			      		console.log('deleted', dataPost)
			      		return new Promise ((resolve, reject) => {
			      			resolve(swal(
			              'Deleted!',
			              'Your post has been deleted.',
			              'success'
			          	))
			      		})
			      		.then(() => {
		      				window.location.reload(true)
		          	})
			      	})
			      }
			  });
			});
		}
	}, 2000)

})