const contactsRouter = require('express').Router();
const User = require('../models/user');
const Contact = require('../models/contact');

contactsRouter.get('/', async (request, response) => {
    const user = request.user;
    const contacts = await Contact.find({ user: user.id });
    return response.status(200).json(contacts);
});

contactsRouter.post('/', async (request, response) => {
    const user = request.user;
    const { text } = request.body;
    const newContact = new Contact({
        text,
        checked: false,
        user: user._id
    });
    const savedContact = await newContact.save();
    user.contacts = user.contacts.concat(savedContact._id);
    await user.save();

    return response.status(201).json(savedContact);
});

contactsRouter.delete('/:id', async (request, response) => {
    const user = request.user;

    await Contact.findByIdAndDelete(request.params.id);

    user.contacts = user.contacts.filter(contact => contact.id !== request.params.id);

    await user.save();
    return response.sendStatus(204);
});

contactsRouter.patch('/:id', async (request, response) => {
    const user = request.user;

    const { checked } = request.body;

    await Contact.findByIdAndUpdate(request.params.id, { checked });

    return response.sendStatus(200);
});

module.exports = contactsRouter