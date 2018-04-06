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
						url: 'http://localhost:3000/inquiries',
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
				field: "authorEmail",
				title: "Email"
			}, {
				field: "inquirySubject",
				title: "Subject"
			}, {
				field: "inquiryDescription",
				title: "Description"
			}, {
				field: "inquiryStatus",
				title: "Status",
				template: (row, index, datatable) => {
					if (row.inquiryStatus === 'Unread') {
						return `\
							<span class="m-badge m-badge--danger m-badge--wide">\
								UNREAD
							</span>\
						`
					} else if (row.inquiryStatus === 'Read') {
						return `
							<span class="m-badge m-badge--warning m-badge--wide">
								READ
							</span>
						`
					}
				}
			}, {
				field: "createdAt",
				title: "Date Posted"
			}, {
				field: "actions",
				width: 110,
				title: "Actions",
				sortable: false,
				overflow: 'visible',
				template: function (row, index, datatable) {
					return `\
						<a id='btnReplyInquiry${index}' href="replyInquiry.html" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="View Inquiry">\
							<i class="la la-eye"></i>\
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