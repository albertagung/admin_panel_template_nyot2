$(document).ready(() => {

	// Loading start
	$.LoadingOverlay('show')

	// Define url get shipping methods
	const urlGetShippingMethods = 'http://localhost:3000/shippingMethod'

	// Define url get province data
	const urlGetProvince = 'http://localhost:3000/shipping/province'

	// Define url get countries data
	const urlGetCountries = 'https://restcountries.eu/rest/v2/all?fields=name'

	// Define url post new global settings
	const urlPostNewGlobalSettings = 'http://localhost:3000/globalSetting'

	// Define url get global settings
	const urlGetGlobalSettings = 'http://localhost:3000/globalSetting'

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

	// Populate shipping methods if previous global data settings are available
	populatePreviousShippingMethod = (dataGlobalSettings) => {
		// Empty previous shipping method data
		$('#shippingMethod').empty()
		// Get data from shipping method db
		axios({
			method: 'get',
			url: urlGetShippingMethods
		})
		.then((response) => {
			// Define dataShippingMethods
			let dataShippingMethods = response.data
			// Define arr for id shipping methods from global settings data
			let arrIdShippingFromDb = []
			// Breaking down shipping methods from db
			dataGlobalSettings.shippingMethods.forEach((dataShippingFromDb) => {
				// Push shipping methods id into array
				arrIdShippingFromDb.push(dataShippingFromDb._id)
			})
			// Filtering the shipping methods
			dataShippingMethods.filter((dataFilter) => {
				// Checked if the same
				if (arrIdShippingFromDb.indexOf(dataFilter._id) >= 0) {
					// Set options for shipping method
					$('#shippingMethod').append(`
						<label class="m-checkbox">
							<input name="method${dataFilter._id}" type="checkbox" value='${dataFilter._id}' checked>
							${dataFilter.shippingName}
							<span></span>
						</label>
					`)
				} else {
					// If not the same then un-checked
					// Set options for shipping method
					$('#shippingMethod').append(`
						<label class="m-checkbox">
							<input name="method${dataFilter._id}" type="checkbox" value='${dataFilter._id}'>
							${dataFilter.shippingName}
							<span></span>
						</label>
					`)
				}
			})
		})
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
	populateCountries = (dataGlobalSettings) => {
		// Check if data global settings available
		if (dataGlobalSettings) {
			// Get countries data from API
			axios({
				method: 'get',
				url: urlGetCountries
			})
			.then((response) => {
				response.data.forEach((dataCountries) => {
					// Check if dataCountries === dataGlobalSettings country
					if (dataCountries.name === dataGlobalSettings.shippingOrigin.country) {
						// Initiate select2 on country name dropdown
						$('#countryName').select2({
							placeholder: 'Select country',
							// Beacause used in modal, need to define modal parrent
							dropdownParent: $('#modalEditAddress')
						})
						// Populate data countries to country field
						$('#countryName').append(`
							<option value="${dataCountries.name}" selected>
								${dataCountries.name}
							</option>
						`)
					} else {
						// Populate the unmatched
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
					}
				})
			})
		} else {
			// If data global settings === null
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
	}

	// Populate province if previous global data settings are available
	populatePreviousProvince = (dataGlobalSettings) => {
		// If country === Indonesia show all cities
		// Get province data from db
		axios({
			method: 'get',
			url: urlGetProvince
		})
		.then((response) => {
			// Iterate the results
			response.data.rajaongkir.results.forEach((dataProvinces) => {
				// Check if dataGlobalSettings province id === dataProvince province id
				if (dataGlobalSettings.shippingOrigin.province === dataProvinces.province_id) {
					// Populate data provinces to province field
					$('#provinceName').append(`
						<option value="${dataProvinces.province_id}" selected>
							${dataProvinces.province}
						</option>
					`)
				} else {
					// Populate unmatched data provinces to province field
					$('#provinceName').append(`
						<option value="${dataProvinces.province_id}">
							${dataProvinces.province}
						</option>
					`)
				}
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

	// Populate city if previous global data settings are available
	populatePreviousCity = (dataGlobalSettings) => {
		// Define province ID
		let provinceId = dataGlobalSettings.shippingOrigin.province
		// Define url get city by province id
		const urlGetCities = `http://localhost:3000/shipping/city/${provinceId}`
		// Get city database
		axios({
			method: 'get',
			url: urlGetCities
		})
		.then((response) => {
			response.data.rajaongkir.results.forEach((dataCities) => {
				// Check if dataGlobalSettings city id === dataCities city id
				if (dataGlobalSettings.shippingOrigin.city === dataCities.city_id) {
					// Populate data cities to city field
					$('#cityName').append(`
						<option value="${dataCities.city_id}" selected>
							${dataCities.city_name}
						</option>
					`)
				} else {
					// Populate unmatched data cities to city field
					$('#cityName').append(`
						<option value="${dataCities.city_id}">
							${dataCities.city_name}
						</option>
					`)
				}
			})
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

	// Populate subdistrict if previous global data settings are available
	populatePreviousSubdistrict = (dataGlobalSettings) => {
		// Define province ID
		let cityId = dataGlobalSettings.shippingOrigin.city
		// Define url get subdistrict by province id
		const urlGetSubdistrict = `http://localhost:3000/shipping/subdistrict/${cityId}`
		// Get subdistrict database
		axios({
			method: 'get',
			url: urlGetSubdistrict
		})
		.then((response) => {
			response.data.rajaongkir.results.forEach((dataSubdistrict) => {
				// Check if dataGlobalSettings subdistrict id === dataSubdistrict subdistrict id
				if (dataGlobalSettings.shippingOrigin.subdistrict === dataSubdistrict.subdistrict_id) {
					// Populate data cities to subdistrict field
					$('#subdistrictName').append(`
						<option value="${dataSubdistrict.subdistrict_id}" selected>
							${dataSubdistrict.subdistrict_name}
						</option>
					`)
				} else {
					// Populate unmatched data cities to subdistrict field
					$('#subdistrictName').append(`
						<option value="${dataSubdistrict.subdistrict_id}">
							${dataSubdistrict.subdistrict_name}
						</option>
					`)
				}
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

	// Populate zipcode if previous global data settings are available
	populatePreviousZipCode = (dataGlobalSettings) => {
		let zipCode = $('#zipCode').val(dataGlobalSettings.shippingOrigin.zipCode)
		return zipCode
	}

	// Populate address details if previous global data settings are available
	populatePreviousAddressDetails = (dataGlobalSettings) => {
		let addressDetails = $('#addressDetails').val(dataGlobalSettings.shippingOrigin.street)
		return addressDetails
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

	// Populate shipping address if previous global data settings are available
	populatePreviousShippingAddress = () => {
		// Loader start
		$('#shippingFromAddress').LoadingOverlay('show')
		// Waiting for data to correctly populate
		setTimeout(() => {
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
			// Loader stop
			$('#shippingFromAddress').LoadingOverlay('hide')
		}, 2000)
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
			// Populate city code
			city: $('#cityName').val(),
			// Populate subdistrict code
			subdistrict: $('#subdistrictName').val(),
			// Populate province code
			province: $('#provinceName').val(),
			// Populate country code
			country: $('#countryName').val()
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

	// Populate all previous global settings data if exist
	// Get global setting from db
	axios({
		method: 'get',
		url: urlGetGlobalSettings
	})
	.then((response) => {
		// If previous global settings data are available
		if (response.data.length > 0) {
			// On load function
			modalEditAddressInit()
			populateCountries(response.data[0])
			populateProvinces()
			populateCities()
			populateSubdistrict()
			fillShippingAddress()
			// Populate previous store name
			$('#storeName').val(response.data[0].storeName)
			// Populate previous store email address
			$('#storeEmailAddress').val(response.data[0].storeEmailAddress)
			// Populate previous store office address
			$('#storeAddress').val(response.data[0].storeAddress)
			// Populate previous customer email address
			$('#customerEmailAddress').val(response.data[0].customerEmailAddress)
			// Populate previous province
			populatePreviousProvince(response.data[0])
			// Populate previous city
			populatePreviousCity(response.data[0])
			// Populate previous subdistrict
			populatePreviousSubdistrict(response.data[0])
			// Populate previous zipcode
			populatePreviousZipCode(response.data[0])
			// Populate previous address details
			populatePreviousAddressDetails(response.data[0])
			// Populate previous shipping address field
			populatePreviousShippingAddress()
			// Populate previous shipping methods
			populatePreviousShippingMethod(response.data[0])
			// Populate previous low stock alert
			$('#lowStockAlert').val(response.data[0].stockAlert.lowStock)
			// Populate previous medium stock alert
			$('#mediumStockAlert').val(response.data[0].stockAlert.mediumStock)
			// Populate previous high stock alert
			$('#highStockAlert').val(response.data[0].stockAlert.highStock)
			// Loading stop
			$.LoadingOverlay('hide')
		} else {
			// Else data global settings not available
			// On load function
			getShippingMethodAvailabilityData()
			modalEditAddressInit()
			populateCountries(response.data[0])
			populateProvinces()
			populateCities()
			populateSubdistrict()
			fillShippingAddress()
		}
	})

	// On submit
	$('#btnSubmit').click((e) => {
		e.preventDefault()
		// Define obj global settings
		let objGlobalSettings = {
			storeName: getStoreNameValue(),
			storeEmailAddress: getStoreEmailAddressValue(),
			storeAddress: getStoreAddressValue(),
			customerEmailAddress: getCustomerEmailAddressValue(),
			shippingOrigin: getShippingFromAddressValue(),
			stockAlert: {
				lowStock: getLowStockValue(),
				mediumStock: getMediumStockValue(),
				highStock: getHighStockValue()
			},
			shippingMethods: getShippingMethodValue(),
			createdAt: new Date(),
			updatedAt: new Date()
		}
		// Post new global settings to database
		axios({
			method: 'post',
			url: urlPostNewGlobalSettings,
			data: objGlobalSettings
		})
		.then((response) => {
			swal('Success', 'Your settings has been saved', 'success')
			.then(() => {
				console.log(response.data)
			})
		})
	})

	// TODO: Narik dari database (edit global settings)

})