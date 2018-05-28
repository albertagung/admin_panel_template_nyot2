$(document).ready(() => {

	// Check if any admin has logged in
	checkIsLoggedIn = () => {
		firebase.auth().onAuthStateChanged((user) => {
			// If user exist
			if (user) {
				// Check if user is admin
				if (user.email === 'featherworld.it@gmail.com') {
					swal('You already logged in', 'We will redirect you', 'warning')
					.then(() => {
						window.location.replace('products.html')
					})
					.catch((errSwal) => {
						console.log(errSwal)
					})
				}
			}
		})
	}

	// Get sign in credentials
	getCredentials = () => {
		// Define obj credentials
		let credentials = {
			email: $('#email').val(),
			password: $('#password').val()
		}
		// Return obj
		return credentials
	}

	// Firebase sign in user
	firebaseSignIn = () => {
		// Loading overlay start
		$.LoadingOverlay('show')
		return new Promise ((resolve, reject) => {
			firebase.auth().signInWithEmailAndPassword(getCredentials().email, getCredentials().password)
			.then((responseSignIn) => {
				// Loading overlay stop
				$.LoadingOverlay('hide')
				resolve(responseSignIn)
			})
			.catch((errSignin) => {
				// Loading overlay stop
				$.LoadingOverlay('hide')
				reject(errSignin)
			})
		})
	}

	// Firebase sign out user
	firebaseSignOut = () => {
		// Call firebase sign out function
		firebase.auth().signOut()
		.then(() => {
			// Swal confirmation
			swal('Signed out', 'You have been signed out', 'warning')
			.then(() => {
				resolve(true)
			})
			.catch((errSwal) => {
				reject(errSwall)
			})
		})
		.catch((errSignOut) => {
			reject(errSignOut)
		})
	}

	// Firebase check signed in user
	firebaseCheckSignedInUser = () => {
		// Loading overlay start
		$.LoadingOverlay('show')
		return new Promise ((resolve, reject) => {
			// Call firebase on auth state changed
			firebase.auth().onAuthStateChanged((user) => {
				// Check if user exist
				if (user) {
					// Check if user is admin
					if (user.email === 'featherworld.it@gmail.com') {
						// Loading overlay stop
						$.LoadingOverlay('hide')
						resolve(user)
					} else {
						// Loading overlay stop
						$.LoadingOverlay('hide')
						swal('Forbidden', 'Only admin can open this page', 'warning')
						.then(() => {
							// Sign out user
							firebaseSignOut()
						})
					}
				} else {
					// Loading overlay stop
					$.LoadingOverlay('hide')
					swal('No user', 'Please sign in with admin account to open this page', 'warning')
					resolve(false)
				}
			})
		})
	}

	// On load
	// Check if anyone has logged in or not
	checkIsLoggedIn()

	// On click sign in
	$('#m_login_signin_submit').click((e) => {
		e.preventDefault()
		// Call firebase sign in function
		firebaseSignIn()
		.then((responseSignIn) => {
			// Call firebase check signed in user
			firebaseCheckSignedInUser()
			.then((responseCheckUser) => {
				// If user is admin
				if (responseCheckUser) {
					swal('Success', 'You have been logged in as admin', 'success')
					.then(() => {
						// Redirect to product page
						window.location.replace('products.html')
					})
				}
			})
			.catch((errResponseCheckUser) => {
				swal('Error', errResponseCheckUser, 'warning')
			})
		})
		.catch((errSignin) => {
			swal('Error', errSignin.message, 'warning')
		})
	})

})