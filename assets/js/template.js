$(document).ready(() => {

	// Loading overlay start
	$.LoadingOverlay('show')

	// Define url get all email templates
	const urlGetEmailTemplates = 'http://localhost:3000/emailTemplate'

	// Define url update email template
	const urlUpdateEmailTemplate = 'http://localhost:3000/emailTemplate/edit'

	// Populate customer email template
	populateCustomerEmailTemplate = (dataEmailTemplates) => {
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
								data-target="#modalEditTemplateInit${dataEmailTemplates._id}"
								value="${dataEmailTemplates._id}">
								Edit Template
							</a>
						</div>
				</div>
			</div>
		`)
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
								<label for="templateName${dataEmailTemplates._id}">
									Template Name
								</label>
								<input class="form-control m-input" id="templateName${dataEmailTemplates._id}" value="${dataEmailTemplates.templateName}" disabled>
								</input>
							</div>
							<div class="form-group m-form__group">
								<label for="templateDescription${dataEmailTemplates._id}">
									Template Content
								</label>
								<textarea 
									class="form-control m-input m-input--solid" 
									id="templateDescription${dataEmailTemplates._id}" 
									rows="4">${dataEmailTemplates.templateDescription}</textarea>
							</div>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-dismiss="modal">
								Close
							</button>
							<button id="btnSaveEditTemplate${dataEmailTemplates._id}" type="button" class="btn btn-primary">
								Save changes
							</button>
						</div>
					</div>
				</div>
			</div>
		`)
	}

	// Get email template value
	getEmailTemplateValue = (emailTemplateId, dataCreatedAt) => {
		// Define obj email template
		let objEmailTemplate = {
			templateName: $(`#templateName${emailTemplateId}`).val(),
			templateHelper: $(`#templateHelper${emailTemplateId}`).val(),
			templateDescription: $(`#templateDescription${emailTemplateId}`).val(),
			createdAt: dataCreatedAt,
			updatedAt: new Date()
		}
		return objEmailTemplate
	}

	// On submit email template change
	onSubmitEditTemplate = (e, emailTemplateId, emailTemplateCreatedAt) => {
		e.preventDefault()
		// Loader start
		$.LoadingOverlay('show')
		// Send edited email template to db
		axios({
			method: 'put',
			url: `${urlUpdateEmailTemplate}/${emailTemplateId}`,
			data: getEmailTemplateValue(emailTemplateId, emailTemplateCreatedAt)
		})
		.then((response) => {
			// Loading overlay stop
			$.LoadingOverlay('hide')
			swal('Success', 'Your changes has been saved', 'success')
			.then(() => {
				window.location.replace('')
			})
		})
	}

	// On load
	// Get previous email template data from db
	axios({
		method: 'get',
		url: urlGetEmailTemplates
	})
	.then((response) => {
		// Iterate through the data
		response.data.data.forEach((dataEmailTemplates) => {
			// All function called here so it only request one time from server db
			// Populate customer email template
			populateCustomerEmailTemplate(dataEmailTemplates)
			// Modal edit template init
			modalEditTemplateInit(dataEmailTemplates)
			$(`#btnEditTemplate${dataEmailTemplates._id}`).click((e) => {
				// Define clicked email template id
				let emailTemplateId = e.target.attributes.value.nodeValue
				// On submit edit email template
				$(`#btnSaveEditTemplate${emailTemplateId}`).click((e) => {
					// Get email template value
					onSubmitEditTemplate(e, emailTemplateId, dataEmailTemplates.createdAt)
				})
			})
			// Loading overlay stop
			$.LoadingOverlay('hide')
		})
	})

})