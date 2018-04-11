// Cannot inside document ready because dropzone options need to go at the beginning

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
  		// Get product SKU value from newProduct script
  		'imageSection': `product-${getProductSKUValue()}`
  	}
  	return imageData
  },
  init: () => {
  	// Add event listener on submit button to process queue manually
  	let btnSubmit = $('#btnSubmit')
  	mDropzoneTwo = Dropzone.forElement('.dropzone')
  	btnSubmit.click( async (e) => {
  		// TODO: Butuh LOADER = START
  		await e.preventDefault()
  		// Start the upload process
  		await mDropzoneTwo.processQueue()
  		// After upload finished call the rest of the object from newProduct script
  		// TODO: Setelah image masuk ke database, maka harus di panggil lagi
  		// dan dimasukkan ke product images
  		mDropzoneTwo.on('queuecomplete', () => {
  			// Define url get image by section
  			const urlGetImageBySection = 'http://localhost:3000/images/section'
  			// Get the images
  			axios.post(urlGetImageBySection, {imageSection: `product-${getProductSKUValue()}`})
  			.then( async (response) => {
  				// Define arr images
  				let arrProductImages = []
  				// Break down the images
  				await response.data.forEach((dataImages) => {
  					arrProductImages.push(dataImages._id)
  				})
  				// Get the combined object from newProduct script
  				await getCombinedForm(arrProductImages)
  				// TODO: butuh LOADER = STOP and swal(blablabla), then redirect
  				// ke halaman products
  			})
  		})
  	})
  }
};