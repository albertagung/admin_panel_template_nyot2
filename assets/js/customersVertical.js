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
						url: 'http://localhost:3000/users',
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

			columns: [{
				field: "_id",
				title: "#",
				sortable: false,
				width: 40,
				selector: {class: 'm-checkbox--solid m-checkbox--brand'}
			}, {
				field: "firstName",
				title: "Customer Name",
				template: function (row, index, datatable) {
					return `${row.firstName} ${row.middleName} ${row.lastName}`
				}
			}, {
				field: "email",
				title: "Email Address"
			}, {
				field: "phoneNumber",
				title: "Phone Number"
			}, {
				field: "registerDate",
				title: "Register Date",
				template: function (row, index, datatable) {
					let date = new Date(row.registerDate)
					return `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()} | ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
				}
			}, {
				field: "actions",
				width: 110,
				title: "Actions",
				sortable: false,
				overflow: 'visible',
				template: function (row, index, datatable) {
					return `\
						<a id='btnViewUser${index}' href="#" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="View order">\
							<i class="la la-align-justify"></i>\
						</a>\
						<a id='btnDeleteUser${index}' href="#" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\
							<i class="la la-trash"></i>\
						</a>\
					`;
				}
			}]
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