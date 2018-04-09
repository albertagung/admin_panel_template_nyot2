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
						url: 'http://localhost:3000/products',
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
				field: "productName",
				title: "Name"
			}, {
				field: "productCategory",
				title: "Category"
			}, {
				field: "productPrice",
				title: "Price"
			}, {
				field: "productType",
				title: "Type"
			}, {
				field: "productQty",
				title: "Stock"
			}, {
				field: "actions",
				width: 110,
				title: "Actions",
				sortable: false,
				overflow: 'visible',
				template: function (row, index, datatable) {
					return `\
						<a id='btnEditProduct${index}' href="#" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit product">\
							<i class="la la-edit"></i>\
						</a>\
						<a id='btnDeleteProduct${index}' href="#" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\
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