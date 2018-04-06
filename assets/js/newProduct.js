$(document).ready(() => {

	// Generate random id
	generateRandomId = () => {
		let randomId = ''
		let possible = "abcdefghijklmnopqrstuvwxyz1234567890"
		for (let i = 0; i < 5; i++ ) {
			randomId += possible.charAt(Math.floor(Math.random() * possible.length))
		}
		return randomId
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
	getProductCategoryValue = () => {
		// TODO: Get data product category from database
		// Set option for product category select
    $('#productCategory').select2({
        placeholder: "Add a tag",
        tags: true,
        allowClear: true
    })
    .append(`
			<option value="cat1">Dummy Cat 1</option>
			<option value="cat2">Dummy Cat 2</option>
			<option value="cat3">Dummy Cat 3</option>
    `)
    // Get value
    let productCategory = $('#productCategory').val()
    return productCategory
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

	// Get product availability bootstrap switch value
	getProductAvailabilityValue = () => {
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
	getProductStockTypeValue = () => {
		// Get value
		// TODO: Ambil data dari global settings
		// user set stock trigger (low, medium, high) di angka berapa
		// setelah itu baru dicocokkan dengan stock yang tersedia
	}

	// Get product QTY value
	getProductQtyValue = () => {
		// Get value
		let productQty = $('#productQty').val()
		return productQty
	}

	// Get shipping method
	getProductShippingMethodValue = () => {
		// TODO: Ambil data shipping method dari global setting user
		// Set options for shipping method
		$('#shippingMethod').append(`
			<option value="dummyShipping1">Dummy Shipping 1</option>
			<option value="dummyShipping2">Dummy Shipping 2</option>
			<option value="dummyShipping3">Dummy Shipping 3</option>
		`)
		// Get value
		let shippingMethod = $('#shippingMethod').val()
		return shippingMethod
	}

	// Get product weight value
	getProductWeightValue = () => {
		// Get value
		let productWeight = $('#productWeight').val()
		return productWeight
	}

	// Get product variants bootstrap switch value
	getProductVariantsValue = () => {
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
									<label for="variantName">Variant Name</label>
									<select class="form-control m-select2 classVariantName" id="variantName" name="variantName">
									</select>
								</div>
							</div>
							<div class="col-md">
								<div class="form-group m-form__group">
									<label for="variantName">Variant Options</label>
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
		        tags: true
					})
					$('.classVariantOptions').select2({
						placeholder: "Add a tag",
		        tags: true
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
						<label for="variantName${generateRandomId()}">Variant Name</label>
						<select class="form-control m-select2 classVariantName" id="variantName${generateRandomId()}" name="variantName${generateRandomId()}">
						</select>
					</div>
				</div>
				<div class="col-md-5">
					<div class="form-group m-form__group">
						<label for="variantOptions${generateRandomId()}">Variant Options</label>
						<select class="form-control m-select2 classVariantOptions" id="variantOptions${generateRandomId()}" multiple name="variantOptions${generateRandomId()}">
						</select>
					</div>
				</div>
				<div class="col-md-2">
					<div class="form-group m-form__group">
						<label for="actions">Actions</label>
						<a id="btnDeleteVariantSelections${generateRandomId()}" class="btn btn-danger classBtnDeleteVariantSelections">Delete</a>
					</div>
				</div>
			</div>
		`)
		// Select2 variant name and variant options init (by class)
		$('.classVariantName').select2({
			placeholder: "Add a tag",
      tags: true
		})
		$('.classVariantOptions').select2({
			placeholder: "Add a tag",
      tags: true
		})
		// Delete variant selections (using e.target to know which on is clicked)
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
				variantOptions: arrOptions
			}
			// TODO: push each object into product variants database
			// TODO: setelah itu id response.data.id setiap object
			// harus di input ke productVariance product schema
			// Check if variant field has been filled
			if (objVariantSelections.variantName) {
				console.log(objVariantSelections)
			}
		}
	}


	console.log(
		getProductTypeValue(), 
		getProductCategoryValue(), 
		getProductVariantsValue(), 
		getProductAvailabilityValue(),
		getProductShippingMethodValue())


	// On Submit
	$('#btnSubmit').click((e) => {
		e.preventDefault()
		getVariantSelectionsValue()
	})

})