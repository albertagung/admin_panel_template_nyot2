$(document).ready(() => {

	// Define url get shipping methods
	const urlGetShippingMethods = 'http://localhost:3000/shippingMethod'

	// Define url get province data
	const urlGetProvince = 'http://localhost:3000/shipping/province'

	// Define url get countries data
	const urlGetCountries = 'https://restcountries.eu/rest/v2/all?fields=name'

	// Get store name value
	getStoreNameValue = () => {
		// Define store name
		let storeName = $('#storeName').val()
		return storeName
	}

	// Get store email address
	getStoreEmailAddress = () => {
		// Define store email address
		let storeEmailAddress = $('#storeEmailAddress').val()
		return storeEmailAddress
	}

	// Get store address
	getStoreAddress = () => {
		// Define store address
		let storeAddress = $('#storeAddress').val()
		return storeAddress
	}

	// Get customer email address
	getCustomerEmailAddress = () => {
		// Define customer email address
		let customerEmailAddress = $('#customerEmailAddress').val()
		return customerEmailAddress
	}

	// Get shipping method availability data
	getShippingMethodAvailabilityData = () => {
		// Get data from shipping method db
		axios({
			method: 'get',
			url: urlGetShippingMethods
		})
		.then((response) => {
			// Iterate through shipping method data
			response.data.forEach((dataShippingMethods) => {
				// Set options for shipping method
				$('#shippingMethod').append(`
					<label class="m-checkbox">
						<input name="method${dataShippingMethods._id}" type="checkbox" value='${dataShippingMethods._id}'>
						${dataShippingMethods.shippingName}
						<span></span>
					</label>
				`)
			})
		})
	}

	// Get shipping method value
	getShippingMethodValue = () => {
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

	// Populate data coountries from API
	populateCountries = () => {
		// Get countries data from API
		axios({
			method: 'get',
			url: urlGetCountries
		})
		.then((response) => {
			response.data.forEach((dataCountries) => {
				// Initiate select2 on country name dropdown
				$('#countryName').select2({
					// Beacause used in modal, need to define modal parrent
					dropdownParent: $('#modalEditAddress')
				})
				// Populate data countries to country field
				$('#countryName').append(`
					<option value="${dataCountries.name}">
						${dataCountries.name}
					</option>
				`)
			})
		})
	}

	// Populate data address from db to edit shipping address modal
	populateAddress = () => {
		// Get province data from db
		axios({
			method: 'get',
			url: urlGetProvince
		})
		.then((response) => {
			// Iterate the results
			response.data.rajaongkir.results.forEach((dataProvinces) => {
				// Initiate select2 on province name dropdown
				$('#provinceName').select2({
					// Beacause used in modal, need to define modal parrent
					dropdownParent: $('#modalEditAddress')
				})
				// Populate data provinces to province field
				$('#provinceName').append(`
					<option value="${dataProvinces.province_id}">
						${dataProvinces.province}
					</option>
				`)
			})
		})
	}

	// Initiate edit address modal
	modalEditAddressInit = () => {
		$('body').append(`
			<div class="modal fade" id="modalEditAddress" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" style="display: none;" aria-hidden="true">
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" id="exampleModalLabel">
								Edit Shipping Address
							</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">
									×
								</span>
							</button>
						</div>
						<div class="modal-body">
							<div class="row">
								<div class="col-md">
									<div class="form-group m-form__group">
										<label for="countryName">
											Country
										</label>
										<select class="form-control m-select2" id="countryName" style="width: 100%"></select>
									</div>
								</div>
								<div class="col-md">
									<div class="form-group m-form__group">
										<label for="provinceName">
											Province Name
										</label>
										<select class="form-control m-select2" id="provinceName" style="width: 100%"></select>
									</div>
								</div>
							</div>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-dismiss="modal">
								Close
							</button>
							<button type="button" class="btn btn-primary">
								Save changes
							</button>
						</div>
					</div>
				</div>
			</div>
		`)
	}

	// On load
	modalEditAddressInit()
	populateCountries()
	populateAddress()

})