$(document).ready(() => {

	// Get id from news page
	let postId = localStorage.getItem('postId')

	// Declare dataPost
	let dataPost = {}

	// Get post data by id
	let urlGetPostById = `http://localhost:3000/posts/${postId}`
	axios.get(urlGetPostById).then( async (response) => {
		dataPost = response.data[0]
		// Assigning dataPost object to input fields
		await $('#h3PostTitle').text(dataPost.postTitle)
		await $('#postTitle').val(dataPost.postTitle)
		await $('#postDescription').val(dataPost.postDescription)
		$('#postContent').val(dataPost.postContent)
	})

	// Get edited value
	getEdit = () => {
		let editedPost = {
			postTitle: $('#postTitle').val(),
			postDescription: $('#postDescription').val(),
			postContent: $('#postContent').val(),
			postAuthor: 'default',
			createdAt: new Date(),
			updatedAt: new Date()
		}
		return editedPost
	}

	// Save to database
	$('#btnSubmitEditPost').click((e) => {
		e.preventDefault()
		// Save value to database
		let urlEditPost = `http://localhost:3000/posts/edit/${postId}`
		axios.put(urlEditPost, getEdit())
		.then((response) => {
			console.log(response.data)
		})
	})

})