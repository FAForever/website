var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Enquiry Model
 * =============
 */

var Enquiry = new keystone.List('Enquiry', {
	nocreate: true,
	noedit: true
});

Enquiry.add({
	name: { type: Types.Name, required: false },
	email: { type: Types.Email, required: false },
	enquiryType: { type: Types.Select, options: [
		{ value: 'message', label: 'I want to report a bug' },
		{ value: 'message1', label: 'I want to report a player for misconduct' },
		{ value: 'message2', label: 'I have a suggestion' },
		{ value: 'other', label: 'Something else...' }
	] },
	message: { type: Types.Markdown, required: true },
	createdAt: { type: Date, default: Date.now }
});

Enquiry.defaultSort = '-createdAt';
Enquiry.defaultColumns = 'name, email, enquiryType, createdAt';
Enquiry.register();
