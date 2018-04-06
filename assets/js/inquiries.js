$(document).ready(() => {
	
	// Declaring dataInquiries array
	let dataInquiries = []

	// Get data
	let inquiriesGetUrl = 'http://localhost:3000/inquiries'
	axios.get(inquiriesGetUrl).then((response) => {
		dataInquiries = response.data.data
	})

	// Get inquiry id on click
	// Timer to detect changes in DOM elements every 2 seconds
	window.setInterval(() => {
		// Getting data length from database
		for (let i = 0; i < dataInquiries.length; i ++) {
			// iterate through dataInquiries and spread the button
			$(`#btnReplyInquiry${i}`).click(() => {
				// Getting the inquiry id based on button clicked
				let inquiryId = $(`#btnReplyInquiry${i}`)
											.parent()
											.parent()
											.parent()
											.children()
											.children()
											.children()
											.children().val()
				// Setting inquiryId into localStorage
				localStorage.setItem('inquiryId', inquiryId)
			})
		}
	}, 2000)

})