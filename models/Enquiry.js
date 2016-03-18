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
		{ value: 'message', label: 'I have a FAF Client Issues' },
		{ value: 'message1', label: 'I have a FAF Website Issues' },
		{ value: 'message2', label: 'I have a suggestion' },
		{ value: 'question', label: 'I\'ve got a question' },
		{ value: 'other', label: 'Something else3...' }
	] },
	message: { type: Types.Markdown, required: true },
	createdAt: { type: Date, default: Date.now }
});

Enquiry.defaultSort = '-createdAt';
Enquiry.defaultColumns = 'name, email, enquiryType, createdAt';
Enquiry.register();
