$(document).ready(() => {

	// Get value from input
	getValue = () => {
		let newPost = {
			postTitle: $('#postTitle').val(),
			postDescription: $('#postDescription').val(),
			postContent: $('#postContent').val(),
			postAuthor: 'default',
			createdAt: new Date(),
			updatedAt: new Date()
		}
		return newPost
	}

	// Save to database
	$('#btnSubmitNewPost').click((e) => {
		e.preventDefault()
		// Save value to database
		let urlNewPost = 'http://localhost:3000/posts'
		axios.post(urlNewPost, getValue())
		.then((response) => {
			console.log(response.data)
		})
	})

})