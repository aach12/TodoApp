const input = document.querySelector('input');
const ul = document.querySelector('ul');
const addBtn = document.querySelector('.add-btn');
const invalidCheck = document.querySelector('.invalid-check');
const form = document.querySelector('#form');
const totalCountSpan = document.querySelector('.total-count');
const completedCountSpan = document.querySelector('.completed-count');
const incompletedCountSpan = document.querySelector('.incompleted-count');

const totalCount = () => {
	const howMany = document.querySelector('ul').children.length; 
	totalCountSpan.innerHTML = howMany;
};

const todoCount = () => {
	totalCount();
};

form.addEventListener('submit', async e => {
	e.preventDefault();

	// Check if the input is empty
	if (input.value === '') {
		input.classList.remove('focus:ring-2', 'focus:ring-violet-600');
		input.classList.add('focus:ring-2', 'focus:ring-rose-600');
		invalidCheck.classList.remove('hidden');
		return
	}

	// Remove classes and hide invalidCheck
	input.classList.remove('focus:ring-2', 'focus:ring-rose-600', 'border-2', 'border-rose-600');
	input.classList.add('focus:ring-2', 'focus:ring-violet-600');
	invalidCheck.classList.add('hidden');

	// Create list item

	const { data } = await axios.post('/api/todos', { text: input.value });
	console.log(data);

	const listItem = document.createElement('li');
	listItem.id = data.id;
	listItem.classList.add('flex', 'flex-row');
	listItem.innerHTML = `
		<div class="group grow flex flex-row justify-between">
			<button class=" delete-icon w-12 md:w-14 hidden group-hover:flex group-hover:justify-center group-hover:items-center cursor-pointer bg-red-500 origin-left ease-out duration-300">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-7 md:w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
			<p class="p-4 break-words grow">${data.text}</p>
		</div>

	`;

	// Append listItem
	ul.append(listItem);

	// Empty input
	input.value = ''

	todoCount();
});

ul.addEventListener('click', async e => {

	// Select delete-icon
	if (e.target.closest('.delete-icon')) {
		const li = e.target.closest('.delete-icon').parentElement.parentElement;
		await axios.delete(`/api/todos/${li.id}`);
		li.remove();
		todoCount();
	}



		// Save in local storage
		todoCount();
		localStorage.setItem('todoList', ul.innerHTML);
	}
);

(async () => {
	try {
		const { data } = await axios.get('/api/todos', {
			withCredentials: true
		});

		data.forEach(todo => {

			const listItem = document.createElement('li');
			listItem.id = todo.id;
			listItem.classList.add('flex', 'flex-row');
			listItem.innerHTML = `
				<div class="group grow flex flex-row justify-between">
					<button class="delete-icon w-12 md:w-14 hidden group-hover:flex group-hover:justify-center group-hover:items-center cursor-pointer bg-red-500 origin-left ease-out duration-300">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-7 md:w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
					<p class="p-4 break-words grow">${todo.text}</p>
				</div>
				
			`;

			ul.append(listItem);
		})
		todoCount();

	} catch (error) {
		window.location.pathname = '/login'
	}

})();