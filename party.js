const COHORT = "2309-FSA-ET-WEB-FT-SF";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

let state = {
    parties: []
}

const partyList = document.querySelector("#party_list");

const addPartyForm = document.querySelector("#addParty");
addPartyForm.addEventListener("submit", addParty);

/**
 * Sync state with the API and rerender
 */
async function render() {
  await getParties();
  /* renderParties(); */
}
render();

/**
 * Update state with parties from API
 */
async function getParties() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.parties = json.data;
    console.log(json.data)
  } catch (err) {
    console.log(err);
  }
}

/**
 * Render parties from state
 */
function renderParties() {
  const partyCard = state.parties.map((party, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `
    <h2>${party.name}</h2>
    <p>${party.description}</p>
    <p>${party.date}</p>
    <p>${party.location}</p>
    `;
    const delete_btn = document.createElement("button")
    delete_btn.innerHTML = "Delete";
    delete_btn.addEventListener("click", () => {
        /* How to locate the object that needs to delete */
        li.remove();
        state.parties.splice(idx, 1);
    li.append(delete_btn);
    })
    return li
  })
  partyList.replaceChildren(...partyCard);
}

/**
 * Ask the API to create a new artist based on form data
 * @param {Event} event
 */
function addParty(event) {
  event.preventDefault();

  async function addParty(event) {
    event.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: addPartyForm.id.value,
          name: addPartyForm.name.value,
          imageUrl: addPartyForm.imageUrl.value,
          description: addPartyForm.description.value,
        }),
      });
      /* TODO: Need to add the new party to the state */

      if (!response.ok) {
        throw new Error("Failed to create artist");
      }
  
      render();
    } catch (error) {
      console.error(error);
    }
  }
}
