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

	// Get product name value
	getProductNameValue = () => {
		// Get value
		let productName = $('#productName').val()
		return productName
	}

	// Get product type value
	getProductTypeValue = () => {
		// Set option for product type select
		$('#productType').append(`
			<option value="noType" selected>None</option>
			<option value="newArrival">New Arrival</option>
			<option value="sale">Sale</option>
			<option value="bestSeller">Best Seller</option>
		`)
		// Get the value
		let productType = $('#productType').val()
		return productType
	}

	// Get product category value
	getProductCategoryData = async () => {
		// Define url get categories
		const urlGetCategories = 'http://localhost:3000/categories'
		// Get all categories
		await axios.get(urlGetCategories).then((response) => {
			// Set option for product category select
	    $('#productCategory').select2({
	        placeholder: "Add a tag",
	        tags: true,
	        allowClear: true
	    })
	    // Populate categories
	    response.data.data.forEach((dataCategories) => {
	    	$('#productCategory').append(`
					<option value="${dataCategories.categoryName}">${dataCategories.categoryName}</option>
	    	`)
	    })
		})
		// Get product SKU data (waiting for category data to be finished)
		getProductSKUData()
	}

	// Get product category value
	getProductCategoryValue = () => {
		// Get value
    let productCategory = $('#productCategory').val()
    console.log(productCategory)
    return productCategory
	}

	// Get product SKU data
	getProductSKUData = () => {
		// Get initial selection based on product category
		let catName = $('#productCategory').val().substr(0,3).toUpperCase()
		$('#productSKU').val(`${catName}${generateRandomId()}`)
		// Change SKU based on product category + random ID
		$('#productCategory').change(() => {
			// Check category not null
			if ($('#productCategory').val()) {
				let catName = $('#productCategory').val().substr(0,3).toUpperCase()
				$('#productSKU').val(`${catName}${generateRandomId()}`)
			}
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
		let productDescription = $('#postContent').summernote('code')
		return productDescription
	}

	// Get product images
	getProductImages = () => {
		// TODO: Send data images using axios to database (using dropzone)
	}

	// Get product price
	getProductPriceValue = () => {
		// Get value
		let productPrice = $('#productPrice').val()
		return productPrice
	}

	// Get product availability bootstrap switch data
	getProductAvailabilityData = () => {
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
	getProductStockTypeData = async () => {
		// Define url get global settings
		const urlGetGlobalSettings = 'http://localhost:3000/globalSetting'
		// Populate the data
		await axios.get(urlGetGlobalSettings).then((response) => {
			let dataSettings = response.data[0]
			// Change product stock type on product QTY change
			$('#productQty').change(() => {
				// Change product stock type based on how much the stock
				// compared to the global settings
				if ($('#productQty').val() >= dataSettings.stockAlert.highStock) {
					$('#productStockType').val('High')
					$('#productStockType').css('background-color', 'green')
					.css('color', 'white')
				} else if ($('#productQty').val() >= dataSettings.stockAlert.mediumStock) {
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

	// Get shipping method
	getProductShippingMethodData = () => {
		// Define get global setting url
		const urlGetGlobalSettings = 'http://localhost:3000/globalSetting'
		// Get global settings data
		axios.get(urlGetGlobalSettings).then((response) => {
			let dataSettings = response.data[0]
			dataSettings.shippingMethods.forEach((dataShipping) => {
				// Set options for shipping method
				$('#shippingMethod').append(`
					<label class="m-checkbox">
						<input name="method${dataShipping._id}" type="checkbox" value='${dataShipping._id}'>
						${dataShipping.shippingName} - Price: ${dataShipping.shippingPrice} / Kg
						<span></span>
					</label>
				`)
			})
		})
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

	// Get product variants bootstrap switch data
	getProductVariantsData = () => {
		// Hide the button add variant selectione
		$('#btnAddVariantSelections').hide()
		let productVariants = ''
		// BootstrapSwitch init for product availability
		$('[id=productVariants]').bootstrapSwitch({
			onSwitchChange: (e, state) => {
				productVariants = state
				// Show variant options when state changed to "true"
				if (productVariants) {
					// Show add more variant selection button
					$('#btnAddVariantSelections').show()
					// Show variant options
					$("#variantSelection").html(`
						<div class="row">
							<div class="col-md">
								<div class="form-group m-form__group">
									<label style="font-weight: bold" for="variantName">Variant Name</label>
									<select class="form-control m-select2 classVariantName" id="variantName" name="variantName">
									</select>
								</div>
							</div>
							<div class="col-md">
								<div class="form-group m-form__group">
									<label style="font-weight: bold" for="variantName">Variant Options</label>
									<select class="form-control m-select2 classVariantOptions" id="variantOptions" multiple name="variantOptions">
									</select>
								</div>
							</div>
						</div>
						<br>
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
		        					id: dataVariantName._id,
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
									id: i,
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
      					id: dataVariantName._id,
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
						id: i,
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

	// Get variant names and variant options value (object format)
	getVariantSelectionsValue = () => {
		let classVariantName = $('.classVariantName')
		let classVariantOptions = $('.classVariantOptions')
		let productVariance = []
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
				variantOptions: arrOptions,
				createdAt: new Date(),
				updatedAt: new Date()
			}
			// TODO: push each object into product variants database
			// TODO: setelah itu id response.data.id setiap object
			// harus di input ke productVariance product schema
			// Check if variant field has been filled
			if (objVariantSelections.variantName) {
				console.log(objVariantSelections)
				// // Define url insert new variance
				// const urlInsertNewVariant = 'http://localhost:3000/variance'
				// // Send data to variance database
				// axios.post(urlInsertNewVariant, objVariantSelections)
				// .then((response) => {
				// 	let dataVariants = response.data[0]
				// 	// Define arr for variants object id
				// 	let arrVariants = []

				// })
			} else {
				// do something if no variants filled
			}
		}
	}

	// Onload
	// Get product type data
	getProductTypeValue()
	// Get product categories data
	getProductCategoryData()
	// Get product availability data
	getProductAvailabilityData()
	// Get product stock type data
	getProductStockTypeData()
	// Get product shipping method data
	getProductShippingMethodData()
	// get product variants data
	getProductVariantsData()

	// Combine form data as object
	getCombinedForm = () => {
		let newProduct = {
			productAvailability: getProductAvailabilityValue(),
			productName: getProductNameValue(),
			productCategory: getProductCategoryValue(),
			productPrice: getProductPriceValue(),
			productType: getProductTypeValue(),
			productStockType: getProductStockTypeValue(),
			productQty: getProductQtyValue()
		}
	}

	// On Submit (will be called in dropzoneNewProduct script)
	$('#btnSubmit').click((e) => {
		e.preventDefault()
		getProductCategoryValue()
		getVariantSelectionsValue()
		console.log(getProductShippingMethodValue())
		console.log(getProductAvailabilityValue())
	})

})