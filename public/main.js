const url = `https://us-central1-vet-app-971c0.cloudfunctions.net/api/pets`

const fetchPets = async () => {
    const response = await fetch(url)
    const json = await response.json()

    return json
}

const dischargePet = async id => {
    event.target.parentElement.parentElement.remove()
    await fetch(`${url}/${id}/discharge`, {
        method: 'DELETE'
    })
}

const registerPet = async data => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/text',
        },
        body: JSON.stringify(data)
    })
    const json  = await response.json()

    return json
}

const rowTemplate = ({ _id, name, type, description }) => `
    <tr>
        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
            <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                </div>
                <div class="ml-4">
                    <div class="text-sm leading-5 font-medium text-gray-900">${name}</div>
                </div>
            </div>
        </td>
        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">${type}</span>
        </td>
        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">${description}</td>
        <td class="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium">
            <button class="text-red-600 hover:text-red-900" onclick="dischargePet('${_id}')">Discharge</button>
        </td>
    </tr>
`

const handleSubmit = async event => {
    event.preventDefault()
    const { name, type, description } = event.target
    const data = {
        name: name.value,
        type: type.value,
        description: description.value,
    }
    name.value = ''
    type.value = ''
    description.value = ''

    const pet = await registerPet(data)

    const template = rowTemplate({
        ...data,
        _id: pet._id,
    })
    const table = document.getElementById('table')
    table.insertAdjacentHTML('beforeend', template)
}

window.onload = async () => {
    const petForm = document.getElementById('pet-form')
    petForm.onsubmit = handleSubmit
    const pets = await fetchPets()
    const template = pets.reduce((acc, el) => acc + rowTemplate(el), '')

    const table = document.getElementById('table')
    table.innerHTML = template
}
