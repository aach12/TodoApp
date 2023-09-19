const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    text: String,
    checked: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const contact = mongoose.model('contact', contactSchema);

module.exports = contact;