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
	getStoreEmailAddressValue = () => {
		// Define store email address
		let storeEmailAddress = $('#storeEmailAddress').val()
		return storeEmailAddress
	}

	// Get store address
	getStoreAddressValue = () => {
		// Define store address
		let storeAddress = $('#storeAddress').val()
		return storeAddress
	}

	// Get customer email address
	getCustomerEmailAddressValue = () => {
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
					placeholder: 'Select country',
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

	// Populate provinces
	populateProvinces = () => {
		// Initiate select2 on province name dropdown
		$('#provinceName').select2({
			placeholder: 'Select province',
			// Beacause used in modal, need to define modal parrent
			dropdownParent: $('#modalEditAddress')
		})
		// Add event listener on country name change
		$('#countryName').change((e) => {
			// Empty previous data
			$('#provinceName').empty()
			// Make empty options in order for placeholder to work
			$('#provinceName').append(`
				<option value=""></option>
			`)
			// If country === Indonesia show all cities
			if (e.target.value === 'Indonesia') {
				// Get province data from db
				axios({
					method: 'get',
					url: urlGetProvince
				})
				.then((response) => {
					// Iterate the results
					response.data.rajaongkir.results.forEach((dataProvinces) => {
						// Populate data provinces to province field
						$('#provinceName').append(`
							<option value="${dataProvinces.province_id}">
								${dataProvinces.province}
							</option>
						`)
					})
				})
			}
		})
	}

	// Populate cities
	populateCities = () => {
		// Initiate select2 on city name dropdown
		$('#cityName').select2({
			placeholder: 'Select city',
			// Beacause used in modal, need to define modal parrent
			dropdownParent: $('#modalEditAddress')
		})
		// Add event listener on change
		$('#provinceName').change(() => {
			// Empty the previous data
			$('#cityName').empty()
			// Make empty options in order for placeholder to work
			$('#cityName').append(`
				<option value=""></option>
			`)
			// Define province ID
			let provinceId = $('#provinceName').val()
			// Define url get city by province id
			const urlGetCities = `http://localhost:3000/shipping/city/${provinceId}`
			// Get city database
			axios({
				method: 'get',
				url: urlGetCities
			})
			.then((response) => {
				response.data.rajaongkir.results.forEach((dataCities) => {
					// Populate data cities to city field
					$('#cityName').append(`
						<option value="${dataCities.city_id}">
							${dataCities.city_name}
						</option>
					`)
				})
			})
		})
	}

	// Populate cities
	populateSubdistrict = () => {
		// Initiate select2 on subdistrict name dropdown
		$('#subdistrictName').select2({
			placeholder: 'Select subdistrict',
			// Beacause used in modal, need to define modal parrent
			dropdownParent: $('#modalEditAddress')
		})
		// Add event listener on change
		$('#cityName').change(() => {
			// Empty the previous data
			$('#subdistrictName').empty()
			// Make empty options in order for placeholder to work
			$('#subdistrictName').append(`
				<option value=""></option>
			`)
			// Define province ID
			let cityId = $('#cityName').val()
			// Define url get subdistrict by province id
			const urlGetSubdistrict = `http://localhost:3000/shipping/subdistrict/${cityId}`
			// Get subdistrict database
			axios({
				method: 'get',
				url: urlGetSubdistrict
			})
			.then((response) => {
				response.data.rajaongkir.results.forEach((dataSubdistrict) => {
					// Populate data cities to subdistrict field
					$('#subdistrictName').append(`
						<option value="${dataSubdistrict.subdistrict_id}">
							${dataSubdistrict.subdistrict_name}
						</option>
					`)
				})
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
										<select class="form-control m-select2 js-states " id="countryName" style="width: 100%">
											<option></option>
										</select>
									</div>
								</div>
								<div class="col-md">
									<div class="form-group m-form__group">
										<label for="provinceName">
											Province Name
										</label>
										<select class="form-control m-select2 js-states " id="provinceName" style="width: 100%">
											<option></option>
										</select>
									</div>
								</div>
							</div>
							<br>
							<div class="row">
								<div class="col-md">
									<div class="form-group m-form__group">
										<label for="cityName">
											City Name
										</label>
										<select class="form-control m-select2 js-states " id="cityName" style="width: 100%">
											<option></option>
										</select>
									</div>
								</div>
								<div class="col-md">
									<div class="form-group m-form__group">
										<label for="subdistrictName">
											Subdistrict Name
										</label>
										<select class="form-control m-select2 js-states " id="subdistrictName" style="width: 100%">
											<option></option>
										</select>
									</div>
								</div>
							</div>
							<br>
							<div class="row">
								<div class="col-md">
									<div class="form-group m-form__group">
										<label for="zipCode">
											zipCode
										</label>
										<input class="form-control m-input " id="zipCode" style="width: 100%">
										</input>
									</div>
								</div>
								<div class="col-md"></div>
							</div>
							<br>
							<div class="row">
								<div class="col-md">
									<div class="form-group m-form__group">
									<label for="addressDetails">
										Street / Apt / Suites Details
									</label>
									<textarea class="form-control m-input" id="addressDetails" rows="4"></textarea>
								</div>
							</div>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-dismiss="modal">
								Close
							</button>
							<button id="btnSaveShippingAddress" type="button" class="btn btn-primary">
								Save changes
							</button>
						</div>
					</div>
				</div>
			</div>
		`)
	}

	// Fill the shipping from address portlet
	fillShippingAddress = () => {
		// On click button save changes
		$('#btnSaveShippingAddress').click((e) => {
			e.preventDefault()
			// Empty previous data
			$('#shippingFromAddress').empty()
			// Populate value to shipping from address portlet
			$('#shippingFromAddress').html(`
				<p><b>Country:</b> <br> ${$('#countryName option:selected').text()}</p>
				<p><b>Province:</b> <br> ${$('#provinceName option:selected').text()}</p>
				<p><b>City:</b> <br> ${$('#cityName option:selected').text()}</p>
				<p><b>Subdistrict:</b> <br> ${$('#subdistrictName option:selected').text()}</p>
				<p><b>zipCode:</b> <br> ${$('#zipCode').val()}</p>
				<p><b>Street / Apt. / Suites Details:</b> <br> ${$('#addressDetails').val()}</p>
			`)
			// Close modal
			$('#modalEditAddress').modal('toggle')
		})
	}

	// Get shipping from address value
	getShippingFromAddressValue = () => {
		// Define shipping origin object
		let objShippingOrigin = {
			street: $('#addressDetails').val(),
			zipCode: $('#zipCode').val(),
			city: $('#cityName option:selected').text(),
			subdistrict: $('#subdistrictName option:selected').text(),
			province: $('#provinceName option:selected').text(),
			country: $('#countryName option:selected').text()
		}
		return objShippingOrigin
	}

	// Get low stock value
	getLowStockValue = () => {
		// Define low stock
		let lowStock = $('#lowStockAlert').val()
		return lowStock
	}

	// Get medium stock value
	getMediumStockValue = () => {
		// Define medium stock
		let mediumStock = $('#mediumStockAlert').val()
		return mediumStock
	}

	// Get high stock value
	getHighStockValue = () => {
		// Define high stock
		let highStock = $('#highStockAlert').val()
		return highStock
	}

	// On load
	getShippingMethodAvailabilityData()
	modalEditAddressInit()
	populateCountries()
	populateProvinces()
	populateCities()
	populateSubdistrict()
	fillShippingAddress()

	// On submit
	$('#btnSubmit').click((e) => {
		e.preventDefault()
		// Define obj global settings
		let objGlobalSettings = {
			storeName: getStoreNameValue(),
			storeEmailAddress: getStoreEmailAddressValue(),
			storeAddress: getStoreAddressValue(),
			customerEmailAddress: getCustomerEmailAddressValue(),
			shippingOrigin: '',
			stockAlert: {
				lowStock: getLowStockValue(),
				mediumStock: getMediumStockValue(),
				highStock: getHighStockValue()
			},
			shippingMethods: getShippingMethodValue(),
			createdAt: new Date(),
			updatedAt: new Date()
		}
		console.log(objGlobalSettings)
	})

	// TODO: Masukkin ke database dan narik dari database (edit)

})