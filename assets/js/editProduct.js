$(document).ready(() => {

	// Populate data on forms
	populateData = () => {
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
			getProductCategoryData()
			$('#productCategory').val(dataProduct.productCategory)
			// Populate product SKU field
			$('#productSKU').val(dataProduct.productSKU)
			// Populate product description
			$('#productDescription').summernote('code', dataProduct.productDescription)
			// TODO: Populate product images into dropzone
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
	getProductCategoryData = () => {
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
			  	$('#productCategory').append(`
						<option value="${dataCategories.categoryName}">${dataCategories.categoryName}</option>
			  	`)
				})
			}))
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
					// Remove previous variant selections
					$("#variantSelection").html('')
					// Show add more variant selection button
					$('#btnAddVariantSelections').show()
					// Break product variance data
					productVariance.forEach((dataVariance) => {
						// Show variant options
						$("#variantSelection").append(`
							<div class="row">
								<div class="col-md">
									<div class="form-group m-form__group">
										<label style="font-weight: bold" for="variantName">Variant Name</label>
										<select class="form-control m-select2 classVariantName" id="variantName-${dataVariance._id}" name="variantName-${dataVariance._id}">
											<option value="${dataVariance.variantName}" selected="selected">${dataVariance.variantName}</option>
										</select>
									</div>
								</div>
								<div class="col-md">
									<label style="font-weight: bold" for="variantOptions">Variant Options</label>
									<select class="form-control m-select2 classVariantOptions" id="variantOptions-${dataVariance._id}" multiple name="variantOptions-${dataVariance._id}">
									</select>
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

	// On load
	// Populate data on forms
	populateData()

})