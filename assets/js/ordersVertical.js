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
						method: 'GET'
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
					if ($(`#orderStatus${datatable}`).val() === 'Waiting for Payment') {
						$(`#orderStatus${datatable}`).css('background-color', 'orange').css('color', 'white')
					} else if ($(`#orderStatus${datatable}`).val() === 'Waiting for Shipment') {
						$(`#orderStatus${datatable}`).css('background-color', 'yellow')
					} else if ($(`#orderStatus${datatable}`).val() === 'Shipped') {
						$(`#orderStatus${datatable}`).css('background-color', 'green').css('color', 'white')
					} else if ($(`#orderStatus${datatable}`).val() === 'Cancelled') {
						$(`#orderStatus${datatable}`).css('background-color', 'red').css('color', 'white')
					}
					// Define request url to change status
					const urlChangeOrderStatus = `http://localhost:3000/transactions/edit/status/${index._id}`
					// On order status change, the color also changes
					$(`#orderStatus${datatable}`).change(() => {
						if ($(`#orderStatus${datatable}`).val() === 'Waiting for Payment') {
							$(`#orderStatus${datatable}`).css('background-color', 'orange').css('color', 'white')
						} else if ($(`#orderStatus${datatable}`).val() === 'Waiting for Shipment') {
							$(`#orderStatus${datatable}`).css('background-color', 'yellow').css('color', 'black')
						} else if ($(`#orderStatus${datatable}`).val() === 'Shipped') {
							$(`#orderStatus${datatable}`).css('background-color', 'green').css('color', 'white')
						} else if ($(`#orderStatus${datatable}`).val() === 'Cancelled') {
							$(`#orderStatus${datatable}`).css('background-color', 'red').css('color', 'white')
						}
						// On order status change, send changes to transactions server
						axios.post(urlChangeOrderStatus, {status: $(`#orderStatus${datatable}`).val()})
					})

					// Creating modal
					// Define date to normal date
					let rawDate = new Date(index.createdAt)
					let invoiceDate = rawDate.toString()
					$('.modals').append(`
						<div class="modal fade" id="modal${datatable}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
							<div class="modal-dialog modal-dialog-centered modal-lg" role="document">
								<div class="modal-content">
									<div class="modal-header">
										<h5 class="modal-title" id="exampleModalLongTitle">
											Invoice for Order ID: ${index._id}
										</h5>
										<button type="button" class="close" data-dismiss="modal" aria-label="Close">
											<span aria-hidden="true">
												&times;
											</span>
										</button>
									</div>
									<div class="modal-body">
										<div class="m-portlet">
											<div class="m-portlet__body m-portlet__body--no-padding">
												<div class="m-invoice-2">
													<div class="m-invoice__wrapper">
														<div class="m-invoice__head" style="background-image: url(../../assets/app/media/img//logos/bg-6.jpg);">
															<div class="m-invoice__container m-invoice__container--centered">
																<div class="m-invoice__logo">
																	<a href="#">
																		<h1>
																			INVOICE
																		</h1>
																	</a>
																	<a href="#">
																		<img  src="../../assets/app/media/img//logos/logo_client_color.png">
																	</a>
																</div>
																<span class="m-invoice__desc">
																	<span>
																		Cecilia Chapman, 711-2880 Nulla St, Mankato
																	</span>
																	<span>
																		Mississippi 96522
																	</span>
																</span>
																<div class="m-invoice__items">
																	<div class="m-invoice__item">
																		<span class="m-invoice__subtitle">
																			DATE
																		</span>
																		<span class="m-invoice__text">
																			${invoiceDate}
																		</span>
																	</div>
																	<div class="m-invoice__item">
																		<span class="m-invoice__subtitle">
																			INVOICE NO.
																		</span>
																		<span class="m-invoice__text">
																			${index.transactionId}
																		</span>
																	</div>
																	<div class="m-invoice__item">
																		<span class="m-invoice__subtitle">
																			INVOICE TO.
																		</span>
																		<span class="m-invoice__text">
																			${index.customer.firstName} 
																			${index.customer.middleName} 
																			${index.customer.lastName}
																			<br>
																			<strong>Email:</strong><br>${index.customer.email}
																			<br>
																			<strong>Phone Number:</strong><br>${index.customer.phoneNumber}
																		</span>
																	</div>
																	<div class="m-invoice__item">
																		<span class="m-invoice__subtitle">
																			PAYMENT METHOD
																		</span>
																		<span class="m-invoice__text">
																			Payment Method Option
																		</span>
																	</div>
																</div>
															</div>
														</div>
														<div class="m-invoice__body m-invoice__body--centered">
															<div class="table-responsive">
																<table class="table">
																	<thead>
																		<tr>
																			<th>
																				PRODUCT NAME
																			</th>
																			<th>
																				QTY
																			</th>
																			<th>
																				UNIT PRICE
																			</th>
																			<th>
																				TOTAL PRICE
																			</th>
																		</tr>
																	</thead>
																	<tbody id="invoiceBody"></tbody>
																</table>
															</div>
														</div>
														<div class="m-invoice__footer">
															<div class="m-invoice__table  m-invoice__table--centered table-responsive">
																<table class="table">
																	<thead>
																		<tr>
																			<th>
																				BANK
																			</th>
																			<th>
																				ACC.NO.
																			</th>
																			<th>
																				DUE DATE
																			</th>
																			<th>
																				TOTAL AMOUNT
																			</th>
																		</tr>
																	</thead>
																	<tbody>
																		<tr>
																			<td>
																				BARCLAYS UK
																			</td>
																			<td>
																				12345678909
																			</td>
																			<td>
																				Jan 07, 2018
																			</td>
																			<td class="m--font-danger">
																				20,600.00
																			</td>
																		</tr>
																	</tbody>
																</table>
															</div>
														</div>
													</div>
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
										<button type="button" class="btn btn-primary">
											Print
										</button>
									</div>
								</div>
							</div>
						</div>
					`)
					// Append invoice items
					index.products.forEach((dataProducts) => {
						$('#invoiceBody').append(`
							<tr>
								<td>
									${dataProducts.productName}
								</td>
								<td>
									80
								</td>
								<td>
									$40.00
								</td>
								<td class="m--font-danger">
									$3200.00
								</td>
							</tr>
						`)
					})
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
					return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} | ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
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
						<a id='btnDeleteOrder${index}' href="#" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\
							<i class="la la-trash"></i>\
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