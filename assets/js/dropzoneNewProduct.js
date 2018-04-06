// Cannot inside document ready because options need to go at the beginning

// Generate random id
generateRandomId = () => {
	let randomId = ''
	let possible = "abcdefghijklmnopqrstuvwxyz1234567890"
	for (let i = 0; i < 5; i++ ) {
		randomId += possible.charAt(Math.floor(Math.random() * possible.length))
	}
	return randomId
}

// multiple file upload
Dropzone.options.mDropzoneTwo = {
  paramName: "image", // The name that will be used to transfer the file
  maxFiles: 5,
  maxFilesize: 1, // 1 MB
  addRemoveLinks: true,
 	uploadMultiple: false,
 	headers: {'fileName': 'apa'},
 	headers: {'fileSection': 'product-11111'},
 	parallelUploads: 5,
 	createImageThumbnails: true,
 	autoProcessQueue: false,
 	// Change the file name
 	renameFile: (file) => {
 		return file.name = `${new Date()}-${generateRandomId()}`
 	},
 	// Adding extra imageName and imageSection object
  params: () => {
  	let imageData = {
  		'imageName': 'apa',
  		'imageSection': 'product-11111'
  	}
  	return imageData
  },
  init: () => {
  	// Add event listener on submit button to process queue manually
  	let btnSubmit = $('#btnSubmit')
  	mDropzoneTwo = Dropzone.forElement('.dropzone')
  	btnSubmit.click((e) => {
  		e.preventDefault()
  		mDropzoneTwo.processQueue()
  	})
  }
};