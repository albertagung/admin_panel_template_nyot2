$(document).ready(() => {

	// Generate random id
	generateRandomId = () => {
		let randomId = ''
		let possible = "abcdefghijklmnopqrstuvwxyz1234567890"
		for (let i = 0; i < 5; i++ ) {
			randomId += possible.charAt(Math.floor(Math.random() * possible.length))
		}
		return randomId.toUpperCase() // Make random ID uppercase
	}

	// Populate data on forms
	populateData = () => {
		$('body').loading('start')
		// TODO: LOADER = START
		// Get product id
		let productId = localStorage.getItem('productId')
		// Define url get product by id
		const urlGetProductById = `http://localhost:3000/products/${productId}`
		// Get data from product DB
		axios.get(urlGetProductById)
		.then((response) => {
			let dataProduct = response.data[0]
			// Populate header
			$('#h3ProductName').text(dataProduct.productName)
			// Populate product name field
			$('#productName').val(dataProduct.productName)
			// Populate product type field
			getProductTypeData()
			$('#productType').val(dataProduct.productType)
			// Populate product category field
			getProductCategoryData(dataProduct.productCategory)
			$('#productCategory').val(dataProduct.productCategory)
			// Populate product SKU field
			$('#productSKU').val(dataProduct.productSKU)
			// Populate product description
			$('#productDescription').summernote('code', dataProduct.productDescription)
			// TODO: Populate product images into dropzone
			// Populate product images field
			getProductImagesData(productId)
			// Populate product price field
			$('#productPrice').val(dataProduct.productPrice)
			// Populate product availability field
			getProductAvailabilityData(dataProduct.productAvailability)
			// Populate product stock type field
			getProductStockTypeData(dataProduct.productQty)
			// Populate product stock QTY
			$('#productQty').val(dataProduct.productQty)
			// Populate product shipping method field
			getProductShippingMethodData(dataProduct.productShippingMethods)
			// Populate product weight field
			$('#productWeight').val(dataProduct.productWeight)
			// Populate product variants field
			getProductVariantsData(dataProduct.productVariance)
			// TODO: LOADER = STOP
			$('body').loading('stop')
		})
	}

	// Get product type data
	getProductTypeData = () => {
		// Set option for product type select
		$('#productType').append(`
			<option value="None" selected>None</option>
			<option value="New Arrival">New Arrival</option>
			<option value="Sale">Sale</option>
			<option value="Best Seller">Best Seller</option>
		`)
	}

	// Get product category data
	getProductCategoryData = (previousCategory) => {
		return new Promise ((resolve, reject) => {
			// Get all categories
			// Define url get categories
			const urlGetCategories = 'http://localhost:3000/categories'
			// Get categories from database
			resolve(axios.get(urlGetCategories).then((response) => {
				response.data.data.forEach((dataCategories) => {
					// Set option for product category select
			    $('#productCategory').select2({
			        placeholder: "Add a tag",
			        tags: true,
			        allowClear: true
			    })
			    // Populate categories
			    // If product category from db === previous category add selected attr
			    if (dataCategories.categoryName === previousCategory) {
			    	$('#productCategory').append(`
							<option value="${dataCategories.categoryName}" selected>${dataCategories.categoryName}</option>
				  	`)
			    } else {
			    	// If not, then dont add attribute
			    	$('#productCategory').append(`
							<option value="${dataCategories.categoryName}">${dataCategories.categoryName}</option>
				  	`)
			    }
				})
			}))
		})
	}

	// Get product images data
	getProductImagesData = (productId) => {
		// TODO: Send data images using axios to database (using dropzone)
		// Define url for previously chosen images getter
		const urlGetSelectedImages = `http://localhost:3000/products/${productId}`
		// Get image from products database
		axios.get(urlGetSelectedImages)
		.then((response) => {
			response.data[0].productImages.forEach((dataImages) => {
				$('#productImages').append(`
					<div id="col-md-${dataImages._id}" class="col-md-3" style="padding-bottom: 1em">
						<a id="btnDeleteImage-${dataImages._id}" href="#" style="color: red">
							<i class="fa fa-trash-o"></i>
						</a>
						<img src="${dataImages.imageUrl}" style="max-width: 100%"></img>
					</div>
				`)
				// Btn delete image
				$(`#btnDeleteImage-${dataImages._id}`).click((e) => {
					e.preventDefault()
					swal({
					  title: "Are you sure?",
					  text: "Once deleted, you will not be able to recover this file!",
					  icon: "warning",
					  buttons: true,
					  dangerMode: true,
					})
					.then((willDelete) => {
						if (willDelete) {
							// Define url delete image from image DB
							const urlRemoveImageById = `http://localhost:3000/images/delete/${dataImages._id}`
							// Remove image from image database
							axios.post(urlRemoveImageById, {imageUrl: dataImages.imageUrl})
							.then(() => {
								// Removing col-md that have the image
								$(`#col-md-${dataImages._id}`).remove()
								swal("Your image has successfully deleted!", {
						      icon: "success",
						    })
							})
						} else {
							swal("Your file is save")
						}
					})
				})
			})
		})
	}

	// Get product availability bootstrap switch data
	getProductAvailabilityData = (dataAvailability) => {
		// Check if data availability is "Available"
		if (dataAvailability === 'Available') {
			$('#productAvailability').attr('checked', 'checked')
		} else {
			// Else, if "Out of Stock"
			$('#productAvailability').removeAttr('checked')
		}
		let productAvailability = ''
		// BootstrapSwitch init for product availability
		$('[id=productAvailability]').bootstrapSwitch({
			onSwitchChange: (e, state) => {
				productAvailability = state
			}
		})
		// Get bootstrap switch value at loading
		productAvailability = $('[id=productAvailability]').bootstrapSwitch('state')
		return productAvailability
	}

	// Get product stock type value
	getProductStockTypeData = async (dataQty) => {
		// Define url get global settings
		const urlGetGlobalSettings = 'http://localhost:3000/globalSetting'
		// Populate the data
		await axios.get(urlGetGlobalSettings).then((response) => {
			let dataSettings = response.data[0]
			// Check on load, if dataQty met one of these conditions
			if (dataQty >= dataSettings.stockAlert.highStock) {
				$('#productStockType').val('High')
				$('#productStockType').css('background-color', 'green')
				.css('color', 'white')
			} else if (dataQty >= dataSettings.stockAlert.mediumStock) {
				$('#productStockType').val('Medium')
				$('#productStockType').css('background-color', 'yellow')
				.css('color', 'black')
			} else {
				$('#productStockType').val('Low')
				$('#productStockType').css('background-color', 'red')
				.css('color', 'white')
			}
			// Change product stock type on product QTY change
			$('#productQty').change(() => {
				// Change product stock type based on how much the stock
				// compared to the global settings
				if (
						$('#productQty').val() >= dataSettings.stockAlert.highStock) {
					$('#productStockType').val('High')
					$('#productStockType').css('background-color', 'green')
					.css('color', 'white')
				} else if (
					$('#productQty').val() >= dataSettings.stockAlert.mediumStock) {
					$('#productStockType').val('Medium')
					$('#productStockType').css('background-color', 'yellow')
					.css('color', 'black')
				} else {
					$('#productStockType').val('Low')
					$('#productStockType').css('background-color', 'red')
					.css('color', 'white')
				}
			})
		})
	}

	// Get shipping method
	getProductShippingMethodData = (dataShippingMethods) => {
		// Define get global setting url
		const urlGetGlobalSettings = 'http://localhost:3000/globalSetting'
		// Get global settings data
		axios.get(urlGetGlobalSettings).then((response) => {
			// Define shipping methods from db
			let shippingMethodsFromDb = response.data[0].shippingMethods
			// Check if shipping method in product === shipping method in database
			// Define arr for id shipping methods from product data
			let arrIdShippingFromProduct = []
			// Breaking down shipping methods from db
			dataShippingMethods.forEach((dataShippingFromDb) => {
				// Push shipping methods id into array
				arrIdShippingFromProduct.push(dataShippingFromDb._id)
			})
			// Filtering the shipping methods
			shippingMethodsFromDb.filter((dataFilter) => {
				// Checked if the same
				if (arrIdShippingFromProduct.indexOf(dataFilter._id) >= 0) {
					// Set options for shipping method
					$('#shippingMethod').append(`
						<label class="m-checkbox">
							<input name="method${dataFilter._id}" type="checkbox" value='${dataFilter._id}' checked>
							${dataFilter.shippingName} - Price: ${dataFilter.shippingPrice} / Kg
							<span></span>
						</label>
					`)
				} else {
					// If not the same then un-checked
					// Set options for shipping method
					$('#shippingMethod').append(`
						<label class="m-checkbox">
							<input name="method${dataFilter._id}" type="checkbox" value='${dataFilter._id}'>
							${dataFilter.shippingName} - Price: ${dataFilter.shippingPrice} / Kg
							<span></span>
						</label>
					`)
				}
			})
		})
	}

	// Get product variants bootstrap switch data
	getProductVariantsData = (productVariance) => {
		// Hide the button add variant selectione
		$('#btnAddVariantSelections').hide()
		let productVariants = ''
		// BootstrapSwitch init for product availability
		$('[id=productVariants]').bootstrapSwitch({
			onSwitchChange: (e, state) => {
				productVariants = state
				// Show variant options when state changed to "true"
				if (productVariants) {
					$('#variantSelection').loading('start')
					// Remove previous variant selections
					$("#variantSelection").html('')
					// Show add more variant selection button
					$('#btnAddVariantSelections').show()
					// Break product variance data
					productVariance.forEach((dataVariance) => {
						// Show variant options
						$("#variantSelection").append(`
							<div class="entry row">
								<div class="col-md-5">
									<div class="form-group m-form__group">
										<label style="font-weight: bold" for="variantName">Variant Name</label>
										<select class="form-control m-select2 classVariantName" id="variantName-${dataVariance._id}" name="variantName-${dataVariance._id}">
											<option value="${dataVariance.variantName}" selected="selected">${dataVariance.variantName}</option>
										</select>
									</div>
								</div>
								<div class="col-md-5">
									<div class="form-group m-form__group">
										<label style="font-weight: bold" for="variantOptions">Variant Options</label>
										<select class="form-control m-select2 classVariantOptions" id="variantOptions-${dataVariance._id}" multiple name="variantOptions-${dataVariance._id}">
										</select>
									</div>
								</div>
								<div class="col-md-2">
									<div class="form-group m-form__group">
										<label style="font-weight: bold" for="actions">Actions</label>
										<a id="btnDeleteVariantSelections${generateRandomId()}" class="btn btn-danger classBtnDeleteVariantSelections">Delete</a>
									</div>
								</div>
							</div>
							<br>
						`)
						// Poupulate previously selected options
						dataVariance.variantOption.forEach((dataSelectedOptions) => {
							$(`#variantOptions-${dataVariance._id}`).append(`
								<option value="${dataSelectedOptions}" selected="selected">${dataSelectedOptions}</option>
							`)
						})
						// Select2 variant name and variant options init (by class)
						axios.get('http://localhost:3000/variance')
						.then((response) => {
							response.data.data.forEach((dataVarianceName) => {
								let arrDataName = []
								let objDataName = {
									id: dataVarianceName.variantName,
					        text: dataVarianceName.variantName
								}
								arrDataName.push(objDataName)
								$('.classVariantName').select2({
									placeholder: "Add a tag",
					        tags: true,
					        data: arrDataName
								})
							})
						})
						// Getting remote data from variance database
						axios.get('http://localhost:3000/variance')
						.then((response) => {
							response.data.data.forEach((dataVariance) => {
								dataVariance.variantOption.forEach((dataOption, i) => {
									let arrDataOptions = []
									let objDataOptions = {
										id: dataOption,
										text: dataOption
									}
									arrDataOptions.push(objDataOptions)
									$('.classVariantOptions').select2({
										placeholder: "Add a tag",
						        tags: true,
						        data: arrDataOptions
									})
								})
							})
						})
					})
					$('#variantSelection').loading('stop')
					// Delete variant selections (using e.target to know which one clicked)
					$('.classBtnDeleteVariantSelections').click((e) => {
						$(`#${e.target.id}`).parents('.entry').remove()
					})
				} else {
					// Make empty when productVariants is "false"
					$('#variantSelection').empty()
					// Hide button add variant selections
					$('#btnAddVariantSelections').hide()
				}
			}
		})
		// Get bootstrap switch value at loading
		productVariants = $('[id=productVariants]').bootstrapSwitch('state')
		return productVariants
	}

	// Add more variant selections
	$('#btnAddVariantSelections').click(() => {
		$('#variantSelection').append(`
			<div class="entry row" style="padding-bottom: 1em">
				<div class="col-md-5">
					<div class="form-group m-form__group">
						<label style="font-weight: bold" for="variantName${generateRandomId()}">Variant Name</label>
						<select class="form-control m-select2 classVariantName" id="variantName${generateRandomId()}" name="variantName${generateRandomId()}">
						</select>
					</div>
				</div>
				<div class="col-md-5">
					<div class="form-group m-form__group">
						<label style="font-weight: bold" for="variantOptions${generateRandomId()}">Variant Options</label>
						<select class="form-control m-select2 classVariantOptions" id="variantOptions${generateRandomId()}" multiple name="variantOptions${generateRandomId()}">
						</select>
					</div>
				</div>
				<div class="col-md-2">
					<div class="form-group m-form__group">
						<label style="font-weight: bold" for="actions">Actions</label>
						<a id="btnDeleteVariantSelections${generateRandomId()}" class="btn btn-danger classBtnDeleteVariantSelections">Delete</a>
					</div>
				</div>
			</div>
		`)
		// Select2 variant name and variant options init (by class)
		$('.classVariantName').select2({
			placeholder: "Add a tag",
      tags: true,
      // Getting remote data from variance database
      ajax: {
      	url: 'http://localhost:3000/variance',
      	processResults: (response) => {
    			return {
      			results: response.data.map((dataVariantName) => {
      				return {
      					id: dataVariantName.variantName,
      					text: dataVariantName.variantName
      				}
      			})
      		}
      	}
      }
		})
		// Getting remote data from variance database
		axios.get('http://localhost:3000/variance')
		.then((response) => {
			response.data.data.forEach((dataVariance) => {
				dataVariance.variantOption.forEach((dataOption, i) => {
					let arrDataOptions = []
					let objDataOptions = {
						id: dataOption,
						text: dataOption
					}
					arrDataOptions.push(objDataOptions)
					$('.classVariantOptions').select2({
						placeholder: "Add a tag",
		        tags: true,
		        data: arrDataOptions
					})
				})
			})
		})
		// Delete variant selections (using e.target to know which one clicked)
		$('.classBtnDeleteVariantSelections').click((e) => {
			$(`#${e.target.id}`).parents('.entry').remove()
		})
	})

	// Get all value
	// Get product name value
	getProductNameValue = () => {
		// Get value
		let productName = $('#productName').val()
		return productName
	}

	// Get product type value
	getProductTypeValue = () => {
		// Get the value
		let productType = $('#productType').val()
		return productType
	}

	// Get product category value
	getProductCategoryValue = () => {
		// Get value
    let productCategory = $('#productCategory').val()
    return productCategory
	}

	// Send new category to category DB
	sendNewProductCategory = (productId) => {
		// Return promise to send axios request to DB
		return new Promise ((resolve, reject) => {
			// Define url post new category
			const urlPostNewCategory = 'http://localhost:3000/categories'
			// Define obj new category
			let newCategory = {
				categoryName: $('#productCategory').val(),
				categoryProducts: productId,
				createdAt: new Date(),
				updatedAt: new Date()
			}
			console.log(newCategory)
			// Send new catagory to category DB
			axios.post(urlPostNewCategory, newCategory)
			.then((response) => {
				resolve(response.data)
			})
		})
		.then((dataNewCategory) => {
			return dataNewCategory
		})
	}

	// Get product SKU value
	getProductSKUValue = () => {
		// Get value
		let productSKU = $('#productSKU').val()
		return productSKU
	}

	// Get product description value
	getProductDescriptionValue = () => {
		// Get value
		let productDescription = $('#productDescription').summernote('code')
		return productDescription
	}

	// Get product price
	getProductPriceValue = () => {
		// Get value
		let productPrice = $('#productPrice').val()
		return productPrice
	}

	// Get product availability value
	getProductAvailabilityValue = () => {
		// Get value
		productAvailability = $('[id=productAvailability]').bootstrapSwitch('state')
		// if value false = "Out of Stock", true = "Available"
		if (productAvailability) {
			return 'Available'
		} else {
			return 'Out of Stock'
		}
	}

	// Get product stock type value
	getProductStockTypeValue = () => {
		// Get value
		let productStockType = $('#productStockType').val()
		return productStockType
	}

	// Get product QTY value
	getProductQtyValue = () => {
		// Get value
		let productQty = $('#productQty').val()
		return productQty
	}

	// Get shipping method value
	getProductShippingMethodValue = () => {
		// Define arr for the selected shipping methods
		let arrShippingMethods = []
		// Get value
		$('#shippingMethod input[type="checkbox"]:checked').each((i) => {
			let shippingMethodObjectId = $('#shippingMethod input[type="checkbox"]:checked')[i].value
			// Push into shippingMethods arr
			arrShippingMethods.push(shippingMethodObjectId)
		})
		if (arrShippingMethods.length < 1) {
			return 'No shipping method'
		} else {
			return arrShippingMethods
		}
	}

	// Get product weight value
	getProductWeightValue = () => {
		// Get value
		let productWeight = $('#productWeight').val()
		return productWeight
	}

	// Get variant names and variant options value (object format)
	getVariantSelectionsValue = (productImages) => {
		let classVariantName = $('.classVariantName')
		let classVariantOptions = $('.classVariantOptions')
		let productVariance = []
		let productVarianceById = []
		return new Promise ((resolve, reject) => {
			// Check if add variants is checked or not
			if (classVariantName.length > 0) {
				// if checked, then proceed to process the variants
				for (let i = 0; i < classVariantName.length; i++) {
					// Define arr options for data.text
					let arrOptions = []
					// Breaking down the array of object to get just the text
					$(`#${classVariantOptions[i].id}`).select2('data').forEach((dataOptions) => {
						// Push the text into arr options
						arrOptions.push(dataOptions.text)
					})
					// Make each variant selection as an object
					let objVariantSelections = {
						variantName: $(`#${classVariantName[i].id}`).val(),
						variantOption: arrOptions,
						createdAt: new Date(),
						updatedAt: new Date()
					}
					// Check if variant field has been filled
					if (objVariantSelections.variantName) {
						// Push productVariance to array
						resolve(productVariance.push(objVariantSelections))
					} else {
						// do something if no variants filled
						// TODO: Validation when no variants is filled
						resolve('no variants')
					}
				}
			} else {
				// If not, then just resolve empty and proceed to then
				resolve('variant option unchecked')
			}
		})
		.then((response) => {
			if (response !== 'variant option unchecked') {
				return new Promise ((resolve, reject) => {
					// Define url insert new variance
					const urlInsertNewVariant = 'http://localhost:3000/variance'
					// Send data to variance database
					axios.post(urlInsertNewVariant, productVariance)
					.then((response) => {
						let dataVariants = response.data
						resolve(dataVariants)
					})
				})
				.then((dataVariants) => {
					return dataVariants
				})
			} else {
				return false
			}
		})
	}

	// Combine form data as object
	getCombinedForm = (productImages) => {
		// Get product id
		let productId = localStorage.getItem('productId')
		// Using promise to get dataVariants
		getVariantSelectionsValue().then((dataVariants) => {
			if (dataVariants) {
				// Getting previous product data to populate unchanged item
				// Define url get product by product id
				const urlGetProductById = `http://localhost:3000/products/${productId}`
				// Get the product
				axios.get(urlGetProductById).then((response) => {
					// Define the object
					return new Promise ((resolve, reject) => {
						let newProduct = {
							productAvailability: getProductAvailabilityValue(),
							productName: getProductNameValue(),
							productCategory: getProductCategoryValue(),
							productDescription: getProductDescriptionValue(),
							productPrice: getProductPriceValue(),
							productType: getProductTypeValue(),
							productStockType: getProductStockTypeValue(),
							productQty: getProductQtyValue(),
							productVariance: dataVariants,
							productSKU: getProductSKUValue(),
							productWeight: getProductWeightValue(),
							productImages: productImages,
							productShippingMethods: getProductShippingMethodValue(),
							createdAt: response.data[0].createdAt,
							updatedAt: new Date()
						}
						resolve(newProduct)
					})
					.then((newProduct) => {
						// Define url post edit product
						urlPostEditProduct = `http://localhost:3000/products/edit/${productId}`
						// Post new product
						axios.put(urlPostEditProduct, newProduct)
						.then((response) => {
							// Define product ID
							let productId = response.data._id
							sendNewProductCategory(productId)
						})
					})
				})
			} else {
				// Get variants data from db because no variant update
				// Define url get product by product id
				const urlGetProductById = `http://localhost:3000/products/${productId}`
				// Get the product
				axios.get(urlGetProductById).then((response) => {
					// Define the object
					return new Promise ((resolve, reject) => {
						let newProduct = {
							productAvailability: getProductAvailabilityValue(),
							productName: getProductNameValue(),
							productCategory: getProductCategoryValue(),
							productDescription: getProductDescriptionValue(),
							productPrice: getProductPriceValue(),
							productType: getProductTypeValue(),
							productStockType: getProductStockTypeValue(),
							productQty: getProductQtyValue(),
							productVariance: response.data[0].productVariance,
							productSKU: getProductSKUValue(),
							productWeight: getProductWeightValue(),
							productImages: productImages,
							productShippingMethods: getProductShippingMethodValue(),
							createdAt: response.data[0].createdAt,
							updatedAt: new Date()
						}
						resolve(newProduct)
					})
					.then((newProduct) => {
						// Define url post edit product
						urlPostEditProduct = `http://localhost:3000/products/edit/${productId}`
						// Post new product
						axios.put(urlPostEditProduct, newProduct)
						.then((response) => {
							// Define product ID
							let productId = response.data._id
							sendNewProductCategory(productId)
						})
					})
				})
			}
		})
	}

	// On load
	// Populate data on forms
	populateData()

	// Upload if there are new images
	// Taking mDropzoneTwo element from dropzoneEditProduct script
	processUploadWithNewImages = async () => {
    // TODO: Butuh LOADER = START
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
  }

  // Upload if there are no new images
  processUploadWithoutNewImages = () => {
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
  }

	// On submit
	$('#btnSubmit').click((e) => {
		e.preventDefault()
		// Get mDropzoneTwo element from dropzoneEditProduct script
		// Check if there are files in dropzone
		if (mDropzoneTwo.files.length > 0) {
			// if any, then upload using dropzone
			processUploadWithNewImages()
		} else {
			// If not, then normal upload
			processUploadWithoutNewImages()
		}
	})

})