var Contact = function (name, email, phone) {
	this.name = name;
	this.email = email;
	this.phone = phone;
}

const inputName = document.querySelector('#inputName');
const inputEmail = document.querySelector('#inputEmail');
const inputPhone = document.querySelector('#inputPhone');
const addButton = document.querySelector('#addbutton');


// regex validation

const EMAIL_VALIDATION = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const NAME_VALIDATION = /^[A-Z\u00d1][a-zA-Z-ÿ\u00f1\u00d1]+(\s*[A-Z\u00d1][a-zA-Z-ÿáéíóú\u00f1\u00d1\s]*)$/;
const PHONE_VALIDATIO = /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/;

// Validatons
let nameValidation = false;
let emailValidation = false;
let phoneValidation = false;

const validation = (input, regexValidation) => {
	addButton.disabled = nameValidation && emailValidation && phoneValidation ? false : true;
	console.log(addButton, nameValidation, emailValidation, phoneValidation); 

	if (input.value === '') {
		input.classList.remove('focus:outline-red-700,');
		input.classList.remove('focus:outline-green-700');
		input.classList.add('focus:outline-indigo-700');
	} else if (regexValidation) {
		input.classList.remove('focus:outline-indigo-700');
		input.classList.add('focus:outline-green-700');
	} else if (!nameValidation){
		input.classList.remove('focus:outline-indigo-700');
		input.classList.remove('focus:outline-green-700');
		input.classList.add('focus:outline-red-700');
	}
};

// Events

inputName.addEventListener('input', e => {
	nameValidation = NAME_VALIDATION.test(e.target.value);
	validation(inputName,nameValidation);
});

inputEmail.addEventListener('input', e => {
	emailValidation = EMAIL_VALIDATION.test(e.target.value);
 	validation(inputEmail,emailValidation);
});

 inputPhone.addEventListener('input', e => {
	phoneValidation = PHONE_VALIDATIO.test(e.target.value);
	validation(inputPhone,phoneValidation);
 });


var contacts = [];

var obtenercontactos = function () {
	peticion('http://localhost:3003/obtenercontactos', 'get')
		.then(data => {
			contacts = []
			if (Array.isArray(data)) {

				contacts = data
			}
			console.log(data);
			listContacts();
		});
}

var listContacts = function () {
	document.getElementById('displayContacts').innerHTML = " ";
	for (var i = 0; i < contacts.length; i++) {
		document.getElementById('displayContacts').innerHTML += '<tr><td id="name' + i + '" class="border-blue-400 mt-6 flex space-x-2 mx-2 font-serif rounded-tl-lg rounded-tr-lg p-2 text-white bg-blue-950 focus:outline-indigo-700">' + contacts[i].name + '</td><td id="email' + i + '" class="flex space-x-2 mx-2 font-serif p-2 text-white bg-blue-950 focus:outline-indigo-700">' + contacts[i].email + '</td><td id="phone' + i + '" class="flex space-x-2 mx-2 font-serif rounded-br-lg rounded-bl-lg p-2 text-white bg-blue-950 focus:outline-indigo-700">' + contacts[i].phone + '</td><td><button class="editbut mx-2 bg-blue-950 transition ease-in-out text-white font-bold delay-300 duration-300 hover:bg-blue-600 py-1 px-2 rounded-full font-serif"  onclick=updateContact(' + i + ')>Edit</button></div><button class="deletebut bg-blue-950 transition ease-in-out text-white font-bold delay-300 duration-300 hover:bg-blue-600 py-1 px-2 rounded-full font-serif" onclick=deleteContact(' + i + ')>Delete</button></td></tr>';
	}
};

var guardarcontactos = function () {
	peticion('http://localhost:3003/guardarcontactos', 'post', contacts)
		.then(data => {
			console.log(data);
		});
}

var addNewContact = function () {
	var name = document.getElementById('inputName').value;
	var email = document.getElementById('inputEmail').value;
	var phone = document.getElementById('inputPhone').value;
	var contact = new Contact(name, email, phone);
	contacts.push(contact);
	guardarcontactos();
	listContacts();
}

var deleteContact = function (i) {
	contacts.splice(i, 1);
	guardarcontactos();
	listContacts();
}

var updateContact = function (i) {
	contactId = i;
	document.getElementById("inputName").value = contacts[i].name;
	document.getElementById("inputEmail").value = contacts[i].email;
	document.getElementById("inputPhone").value = contacts[i].phone;
	// addButton.innerHTML = 'jgjgjg'
	// addButton.disabled = false;
	document.getElementById("submitButtons").innerHTML = '<button id="updateButton" class="editbut bg-blue-950 transition ease-in-out text-white font-bold delay-300 duration-300 hover:bg-blue-600 py-2 px-4 rounded-lg font-serif" onclick=submitUpdatedContact(contactId)>Change</button>';

}

var submitUpdatedContact = function (i) {
	contacts[i].name = document.getElementById("inputName").value;
	contacts[i].email = document.getElementById("inputEmail").value;
	contacts[i].phone = document.getElementById("inputPhone").value;
	document.getElementById("submitButtons").innerHTML = '<button type="button" id="addButton" class="agregarbut bg-blue-950 transition ease-in-out text-white font-bold delay-300 duration-300 hover:bg-blue-600 py-2 px-4 rounded-lg font-serif" onclick="addNewContact()">Add</button>';
	// addButton.disabled = true
	document.getElementById("inputName").value = "";
	document.getElementById("inputEmail").value = "";
	document.getElementById("inputPhone").value = "";

	guardarcontactos();
	listContacts();
}

obtenercontactos();

async function peticion(url, method, data = {}) {

	var options = {
		method: method,
		headers: {
			'Access-Control-Allow-Origin': '1',
			'Content-Type': 'application/json'
		},
	}
	if (method == "post") {
		options.body = JSON.stringify(data)
	}
	const response = await fetch(url, options);
	return response.json();
}