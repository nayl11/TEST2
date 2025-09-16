const API_URL = 'https://68c92fd3ceef5a150f63bcc6.mockapi.io/Humeur';

const form = document.getElementById('moodForm');
const cardsContainer = document.getElementById('cardsContainer');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const entry = Object.fromEntries(formData.entries());

  // envoyer les données à MockAPI
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry)
  });

  if (res.ok) {
    alert('✅ Réponse enregistrée !');
    form.reset();
    loadResponses();
  } else {
    alert('❌ Erreur lors de l\'envoi');
    console.error(await res.text());
  }
});

// fonction pour récupérer et afficher les réponses
async function loadResponses() {
  const res = await fetch(API_URL);
  if (!res.ok) {
    console.error('Erreur récupération données', await res.text());
    return;
  }

  const data = await res.json();
  cardsContainer.innerHTML = '';
  data.reverse().forEach(d => { // reverse pour avoir les plus récentes en haut
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <strong>${d.name} (${d.moment})</strong><br>
      Humeur: ${d.mood} | Energie: ${d.energy} | Couleur: ${d.color}<br>
      Commentaire: ${d.comment}<br>
      <small>${d.createdAt ? new Date(d.createdAt).toLocaleString() : ''}</small>
    `;
    cardsContainer.appendChild(card);
  });
}

// charger les réponses au démarrage
loadResponses();
