$(document).ready(() => {

	// Get id from news page
	let inquiryId = localStorage.getItem('inquiryId')

	// Set inquiry status to read
	let urlChangeInquiryStatus = `http://localhost:3000/inquiries/edit/${inquiryId}`
	axios.put(urlChangeInquiryStatus, {
		inquiryStatus: 'Read' 
	})

	// Declare dataPost
	let dataInquiry = {}

	// Get inquiry by id
	let urlGetInquiryById = `http://localhost:3000/inquiries/${inquiryId}`
	axios.get(urlGetInquiryById).then( async (response) => {
		dataInquiry = response.data[0]
		console.log(dataInquiry)
		await $('#inquirySubject').text(dataInquiry.inquirySubject)
		await $('#inquiryDescription')
		.text(`
			Description: ${dataInquiry.inquiryDescription} - By: ${dataInquiry.authorName} - Email: ${dataInquiry.authorEmail} - Phone: ${dataInquiry.authorPhone}
		`)
		$('#inquiryContent').text(dataInquiry.inquiryContent)
	})

})