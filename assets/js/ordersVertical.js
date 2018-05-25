//== Class definition

var DefaultDatatableDemo = function () {
	//== Private functions

	// basic demo
	var demo = function () {

		var datatable = $('.m_datatable').mDatatable({
			data: {
				type: 'remote',
				source: {
					read: {
						url: 'http://localhost:3000/transactions',
						method: 'GET',
						headers: {
							'key': 'K2AaM8j6KhvcZT7YRuJN'
						}
					}
				},
				pageSize: 20
			},

			layout: {
				theme: 'default',
				class: '',
				scroll: true,
				height: 550,
				footer: false
			},

			sortable: true,

			filterable: false,

			pagination: true,

			search: {
				input: $('#generalSearch')
			},

			rows: {
				afterTemplate: function (row, index, datatable) {
					console.log(index)
					// Send email every change in order status (to admin)
					sendEmailToAdmin = () => {
						return new Promise ((resolve, reject) => {
							// Define url send email to admin
							const urlEmailToAdmin = 'http://localhost:3000/email/adminOrderConfirmation'
							// Send email using axios
							axios({
								method: 'post',
								url: urlEmailToAdmin,
								data: {
									emailSender: 'Feather World Team',
									emailText: 'Order confirmation admin',
									transactionId: index.transactionId,
									transactionStatus: $(`#orderStatus${datatable}`).val(),
									invoiceUrl: index.invoice
								}
							})
							.then((response) => {
								resolve(response.data)
							})
							.catch((err) => {
								reject(err.response)
							})
						})
					}
					// Send email every change in order status (to customer) 
					sendEmailToCustomer = () => {
						return new Promise ((resolve, reject) => {
							// Define url send email to customer
							const urlEmailToCustomer = 'http://localhost:3000/email/customerOrderConfirmation'
							// Send email using axios
							axios({
								method: 'post',
								url: urlEmailToCustomer,
								data: {
									emailSender: 'Feather World Team',
									customerEmail: index.customer.email,
									emailText: 'Order confirmation customer',
									customerOrderId: index.transactionId,
									customerOrderStatus: $(`#orderStatus${datatable}`).val(),
									customerFirstName: index.customer.firstName + ' ' + index.customer.middleName,
									customerLastName: index.customer.lastName,
									urlInvoiceAttachment: index.invoice
								}
							})
							.then((response) => {
								resolve(response.data)
							})
							.catch((err) => {
								reject(err.response)
							})
						})
					}
					// Send shipment confirmation email (to customer)
					sendShipmentConfirmationEmail = (shippingTrackingNumber) => {
						return new Promise ((resolve, reject) => {
							// Define url send shipment confirmation
							const urlEmailShipmentConfirmation = 'http://localhost:3000/email/shippingConfirmation'
							// Send email using axios
							axios({
								method: 'post',
								url: urlEmailShipmentConfirmation,
								data: {
									emailSenderName: 'Feather World Team',
									customerEmail: index.customer.email,
									customerOrderId: index.transactionId,
									customerOrderStatus: $(`#orderStatus${datatable}`).val(),
									customerFirstName: index.customer.firstName + ' ' + index.customer.middleName,
									customerLastName: index.customer.lastName,
									shippingName: index.shippingMethod,
									shippingTrackingNumber: shippingTrackingNumber,
									urlInvoiceAttachment: index.invoice,
									emailText: `Shipping confirmation to customer - ${index.transactionId}`
								}
							})
							.then((response) => {
								resolve(response.data)
							})
							.catch((err) => {
								reject(err.response)
							})
						})
					}
					// Change the shipping method into shipped
					isShipped = () => {
						return new Promise ((resolve, reject) => {
							// In order to change status, admin must input the shipping tracking number
							// Swal for tracking number input
							swal({
								title: 'Tracking Number',
								text: 'Please input the shipping tracking number',
								content: 'input',
								button: {
									text: 'Save'
								}
							})
							.then((input) => {
								if (input) {
									// Call the send shipping confirmation email function
									sendShipmentConfirmationEmail(input)
									.then(() => {
										// Call the send email to admin function
										sendEmailToAdmin()
										.then((response) => {
											resolve(response)
										})
										.catch((errEmailToAdmin) => {
											reject(errEmailToAdmin)
										})
									})
									.catch((errShippingConfirmation) => {
										reject(errShippingConfirmation)
									})
								} else {
									swal.close()
									resolve(false)
								}
							})
						})
					}
					// Change the shipping method into cancelled
					isCancelled = () => {
						return new Promise ((resolve, reject) => {
							// Swal cancel confirmation
							swal('Are you sure?', 'Click sure if you want to cancel this order', {
								icon: 'warning',
								buttons: true,
								dangerMode: true
							})
							.then((willCancel) => {
								if (willCancel) {
									// Swal confirmation deleted
									swal('Success', 'You have successfuly cancelled this order', 'success')
									.then(() => {
										resolve(true)
									})
									.catch((errSwalDeleted) => {
										reject(errSwalDeleted)
									})
								} else {
									swal.close()
									resolve(false)
								}
							})
							.catch((errSwalConfirmation) => {
								reject(errSwalConfirmation)
							})
						})
					}
					// Define data for dropdown
					let data = [ 
						"Shipped",
						"Cancelled"
					]
					// Break down data
					data.forEach((dataStatus) => {
						// If !== order status from DB, then append the options
						if (dataStatus !== index.status) {
							$(`#orderStatus${datatable}`).append(`
								<option value="${dataStatus}">${dataStatus}</option>
							`)
						}
					})
					// If === order status from DB, then change the color
					if ($(`#orderStatus${datatable}`).val().toLowerCase() === 'waiting for payment') {
						$(`#orderStatus${datatable}`).css('background-color', 'orange').css('color', 'white')
					} else if ($(`#orderStatus${datatable}`).val().toLowerCase() === 'waiting for shipment') {
						$(`#orderStatus${datatable}`).css('background-color', 'yellow')
					} else if ($(`#orderStatus${datatable}`).val().toLowerCase() === 'shipped') {
						$(`#orderStatus${datatable}`).css('background-color', 'green').css('color', 'white')
					} else if ($(`#orderStatus${datatable}`).val().toLowerCase() === 'cancelled') {
						$(`#orderStatus${datatable}`).css('background-color', 'red').css('color', 'white')
					}
					// Define request url to change status
					const urlChangeOrderStatus = `http://localhost:3000/transactions/edit/status/${index._id}`
					// On order status change, the color also changes
					$(`#orderStatus${datatable}`).change(() => {
						if ($(`#orderStatus${datatable}`).val().toLowerCase() === 'shipped') {
							// Call isShipped function
							isShipped()
							.then((response) => {
								if (response) {
									// On order status change, send changes to transactions server
									axios.post(urlChangeOrderStatus, {status: $(`#orderStatus${datatable}`).val()})
									.then(() => {
										// Change the color
										$(`#orderStatus${datatable}`).css('background-color', 'green').css('color', 'white')
									})
									.catch((errChangeColor) => {
										console.log(errChangeColor)
									})
								} else {
									// Change back the value into before
									$(`#orderStatus${datatable}`).val(index.status)
								}
							})
						} else if ($(`#orderStatus${datatable}`).val().toLowerCase() === 'cancelled') {
							// Call isCancelled function
							isCancelled()
							.then((response) => {
								if (response) {
									// On order status change, send changes to transactions server
									axios.post(urlChangeOrderStatus, {status: $(`#orderStatus${datatable}`).val()})
									.then(() => {
										// Change the color
										$(`#orderStatus${datatable}`).css('background-color', 'red').css('color', 'white')
									})
									.catch((errChangeColor) => {
										console.log(errChangeColor)
									})
								} else {
									// Change back the value into before
									$(`#orderStatus${datatable}`).val(index.status)
								}
							})
						}
					})

					// Creating modal
					// Define date to normal date
					let rawDate = new Date(index.createdAt)
					let invoiceDate = rawDate.toString()
					// Get total ammount of invoice
					let totalInvoiceAmmount = 0
					index.products.forEach((eachProductForTotal) => {
						totalInvoiceAmmount += parseInt(eachProductForTotal.productId.productPrice)
					})
					// Checking if the invoice has already paid or not
					if (index.status.toLowerCase() === "waiting for payment") {
						$('.modals').append(`
							<div class="modal fade" id="modal${datatable}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
								<div class="modal-dialog modal-dialog-centered modal-lg" role="document">
									<div class="modal-content">
										<div class="modal-header">
											<h5 class="modal-title" id="exampleModalLongTitle">
												<b>Invoice Status:</b> <br> <img src="../../assets/img/Cloudxier-receipt-icon-02-02.png" style="max-width: 200px">
											</h5>
											<button type="button" class="close" data-dismiss="modal" aria-label="Close">
												<span aria-hidden="true">
													&times;
												</span>
											</button>
										</div>
										<div class="modal-body" style="">
											<img src="${index.invoice}" alt="" style="display: block; margin-left: auto; margin-right: auto; width: 100%"/>
										</div>
										<div class="modal-footer">
											<button type="button" class="btn btn-secondary" data-dismiss="modal">
												Close
											</button>
											<button type="button" class="btn btn-primary">
												Print
											</button>
										</div>
									</div>
								</div>
							</div>
						`)
					} else if (index.status.toLowerCase() === 'cancelled') {
						$('.modals').append(`
							<div class="modal fade" id="modal${datatable}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
								<div class="modal-dialog modal-dialog-centered modal-lg" role="document">
									<div class="modal-content">
										<div class="modal-header">
											<h5 class="modal-title" id="exampleModalLongTitle">
												<b>Invoice Status:</b> <br> <h5 style="color: red">Cancelled</h5>
											</h5>
											<button type="button" class="close" data-dismiss="modal" aria-label="Close">
												<span aria-hidden="true">
													&times;
												</span>
											</button>
										</div>
										<div class="modal-body" style="">
											<img src="${index.invoice}" alt="" style="display: block; margin-left: auto; margin-right: auto; width: 100%"/>
										</div>
										<div class="modal-footer">
											<button type="button" class="btn btn-secondary" data-dismiss="modal">
												Close
											</button>
											<button type="button" class="btn btn-primary">
												Print
											</button>
										</div>
									</div>
								</div>
							</div>
						`)
					} else {
						$('.modals').append(`
							<div class="modal fade" id="modal${datatable}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
								<div class="modal-dialog modal-dialog-centered modal-lg" role="document">
									<div class="modal-content">
										<div class="modal-header">
											<h5 class="modal-title" id="exampleModalLongTitle">
												<b>Invoice Status:</b> <br> <img src="../../assets/img/Cloudxier-receipt-icon-02-01.png" style="max-width: 200px">
											</h5>
											<button type="button" class="close" data-dismiss="modal" aria-label="Close">
												<span aria-hidden="true">
													&times;
												</span>
											</button>
										</div>
										<div class="modal-body">
											<img src="${index.invoice}" alt="" style="display: block; margin-left: auto; margin-right: auto; width: 100%"/>
										</div>
										<div class="modal-footer">
											<button type="button" class="btn btn-secondary" data-dismiss="modal">
												Close
											</button>
											<button type="button" class="btn btn-primary">
												Print
											</button>
										</div>
									</div>
								</div>
							</div>
						`)
					}
				}
			},

			columns: [{
				field: "_id",
				title: "#",
				sortable: false,
				width: 40,
				selector: {class: 'm-checkbox--solid m-checkbox--brand'}
			}, {
				field: "transactionId",
				title: "Transaction ID"
			}, {
				field: "customer",
				title: "Customer Name",
				template: function (row, index, datatable) {
					return `${row.customer.firstName} ${row.customer.lastName}`
				}
			}, {
				field: "createdAt",
				title: "Order Date",
				template: function (row, index, datatable) {
					let date = new Date(row.createdAt)
					return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
				}
			}, {
				field: "status",
				title: "Status",
				template: function (row, index, datatable) {
					return `
						<select id="orderStatus${index}" class="form-control m-input">
							<option value="${row.status}" selected>${row.status}</option>
						</select>
					`
				}
			}, {
				field: "totalAmmount",
				title: "Total Purchase",
				type: "number"
			}, {
				field: "actions",
				width: 110,
				title: "Actions",
				sortable: false,
				overflow: 'visible',
				template: function (row, index, datatable) {
					// Open modal
					return `\
						<a 
							id='btnViewOrder${index}' 
							href="#" 
							class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" 
							title="View order" 
							data-toggle="modal"
							data-target="#modal${index}">\
							<i class="la la-align-justify"></i>\
						</a>\
					`;
				}
			}]
		});

		// Sorting based on status
		$('#sortByStatus').on('change', function() {
      datatable.search($(this).val(), 'status');
    });

	};

	return {
		// public functions
		init: function () {
			demo();
		}
	};
}();

jQuery(document).ready(function () {
	DefaultDatatableDemo.init();
});