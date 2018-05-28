$(document).ready(() => {

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
	firebaseCheckSignedInUser()

})