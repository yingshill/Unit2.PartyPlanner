// Setup CONSTANT for the events API url
const COHORT = "2309-FSA-ET-WEB-FT-SF";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

// Setup state to track parties
let state = {
    parties: []
}

const partyList = document.querySelector("#party_list");
const addPartyForm = document.querySelector("#addParty");
addPartyForm.addEventListener("submit", addParty);

/**
 * Update state with parties from API
 */
async function getParties() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.parties = json.data;
    console.log(json.data) //json.date -> array of objects
  } catch (err) {
    console.log(err);
  }
}

/**
 * Ask the API to create a new event based on form data
 * @param {Event} event
 */
async function addParty(event) {
    event.preventDefault();
    try {
        const date = new Date(addPartyForm.date.value);
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                location: addPartyForm.location.value,
                name: addPartyForm.name.value,
                date: date.toISOString(),
                description: addPartyForm.description.value,
            }),
        })
        const json = await response.json();
        if (json.error) {
            console.log(json.message)
        }
        render()
    } catch (err) {
        console.log(err)
    }
    // Dont forget to reset the form
    addPartyForm.name.value = "";
    addPartyForm.description.value = "";
    addPartyForm.location.value = "";
}

/**
 * Ask the API to delete an existing event based on form data
 * @param {Event} event
 */
async function deleteParty(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        })
        if (!response.ok) {
            throw new Error("Event can't be deleted!")
        }
        render();
    } catch (err) {
        console.log(err)
    }
}

/**
 * Render parties from state
 */

function renderSingleParty (party) {
    const partyCard = document.createElement("section");
    partyCard.classList.add("party-card");
    partyCard.innerHTML = `
        <h2>${party.name}</h2>
        <p>${party.description}</p>
        <p>${party.date}</p>
        <p>${party.location}</p>
    `
    const delete_btn = document.createElement("button");
    delete_btn.textContent = "Delete";
    delete_btn.addEventListener("click", () => deleteParty(party.id));
    partyCard.append(delete_btn);
    return partyCard
}

function renderParties() {
    if (!state.parties.length) {
        state.parties.innerHTML = `
        <li>There is no parties!</li>`;
        return
    }
  const singlePartyCard = state.parties.map(renderSingleParty)
  partyList.replaceChildren(...singlePartyCard);
}

/**
 * Sync state with the API and rerender
 */
async function render() {
    await getParties();
    renderParties(); 
}
render();