$(document).ready(() => {

	// Get user email from localStorage
	const objUserEmail = JSON.parse(localStorage.getItem('userEmail'))
	// Check if user has logged in or not
	if (objUserEmail) {
		// Check credentials
		let checkCredentialsUrl = 'http://localhost:3000/auth/check'
		axios.post(checkCredentialsUrl, objUserEmail)
		.then((response) => {
			console.log(response.data)
			// Set logged in user data in localStorage
			localStorage.setItem('dataUsers', JSON.stringify(response.data))
		})
		.catch((err) => {
			swal("Alert!", "Please log in first!", "warning").then(() => {
				window.location.replace('page-login.html')
			})
		})
	} else {
		swal("Alert!", "Please log in first!", "warning").then(() => {
			window.location.replace('page-login.html')
		})
	}

})