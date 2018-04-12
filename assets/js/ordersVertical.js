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
						"Waiting for Payment", 
						"Waiting for Shipment", 
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
				}
			},

			columns: [{
				field: "_id",
				title: "#",
				sortable: false,
				width: 40,
				selector: {class: 'm-checkbox--solid m-checkbox--brand'}
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
					return `\
						<a id='btnViewOrder${index}' href="#" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="View order">\
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