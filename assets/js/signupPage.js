$(document).ready(() => {
	
	// Define sign up url
	const signUpUrl = 'https://server.mmsustainability.ac.id/auth/signup'

	// Get data user and credentials
	getDataUser = () => {
		let email = $('#email').val()
		let password = $('#password').val()
		let firstName = $('#firstName').val()
		let lastName = $('#lastName').val()
		let phoneNumber = $('#phoneNumber').val()
		let dayOfBirth = $('#dayOfBirth').val()
		let monthOfBirth = $('#monthOfBirth').val()
		let yearOfBirth = $('#yearOfBirth').val()
		// Creating obj user
		let objUser = {
			email: email,
			password: password,
			firstName: firstName,
			lastName: lastName,
			phoneNumber: phoneNumber,
			dateOfBirth: {
				dayOfBirth: dayOfBirth,
				monthOfBirth: monthOfBirth,
				yearOfBirth: yearOfBirth
			}
		}
		return objUser
	}

	// Sign up user
	$('#btnSignUp').click((e) => {
		// Loading overlay start
		$('body').loading('start')
		e.preventDefault()
		// Send signup data to server
		axios.post(signUpUrl, getDataUser())
		.then((response) => {
			console.log(response.data)
			swal("Sucess", "Thanks for signing up, please now log in with your new email and password", "success")
			.then(() => {
				// Loading overlay stop
				$('body').loading('stop')
				window.location.replace('page-login.html')
			})
		})
		.catch((err) => {
			console.log(err)
		})
	})

	// Redirect login button
	$('#btnRedirectLogin').click((e) => {
		e.preventDefault()
		// Redirect to login page
		window.location.replace('page-login.html')
	})

})