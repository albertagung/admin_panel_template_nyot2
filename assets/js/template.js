$(document).ready(() => {

	// Define url get all email templates
	const urlGetEmailTemplates = 'http://localhost:3000/emailTemplate'

	// Populate customer email template
	populateCustomerEmailTemplate = () => {
		// Get data  email templates from db
		axios({
			method: 'get',
			url: urlGetEmailTemplates
		})
		.then((response) => {
			// Iterate through the data
			response.data.data.forEach((dataEmailTemplates) => {
				$('#customerEmailTemplates').append(`
					<div class="m-portlet m-portlet--bordered m-portlet--unair">
						<div class="m-portlet__head">
							<div class="m-portlet__head-caption">
								<div class="m-portlet__head-title">
									<h3 class="m-portlet__head-text">
										${dataEmailTemplates.templateName}
									</h3>
								</div>
							</div>
						</div>
						<div class="m-portlet__body">
							<div class="d-flex">
								<div class="mr-auto">
									${dataEmailTemplates.templateHelper}
								</div>
								<div>
									<a 
										id="btnEditTemplate${dataEmailTemplates._id}"
										class="btn btn-brand"
										style="color: white"
										data-toggle="modal"
										data-target="#modalEditTemplateInit${dataEmailTemplates._id}">
										Edit Template
									</a>
								</div>
						</div>
					</div>
				`)
				// Modal edit template init
				modalEditTemplateInit(dataEmailTemplates)
			})
		})
	}

	// Modal edit template init
	modalEditTemplateInit = (dataEmailTemplates) => {
		$('body').append(`
			<div class="modal fade" id="modalEditTemplateInit${dataEmailTemplates._id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" style="display: none;" aria-hidden="true">
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" id="exampleModalLabel">
								Edit customer email template
							</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">
									×
								</span>
							</button>
						</div>
						<div class="modal-body">
							<div class="form-group m-form__group">
								<label for="templateName">
									Template Name
								</label>
								<input class="form-control m-input" id="templateName" value="${dataEmailTemplates.templateName}" disabled>
								</input>
							</div>
							<div class="form-group m-form__group">
								<label for="templateDescription">
									Template Content
								</label>
								<textarea class="form-control m-input m-input--solid" id="templateDescription" rows="4">
								</textarea>
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


	// On load
	populateCustomerEmailTemplate()

})