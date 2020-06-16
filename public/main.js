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
        <td>${name}</td>
        <td>${type}</td>
        <td>${description}</td>
        <td>
            <button onclick="dischargePet('${_id}')">Discharge</button>
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
