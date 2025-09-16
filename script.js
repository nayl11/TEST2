const API_URL = 'https://68c92fd3ceef5a150f63bcc6.mockapi.io/Humeur';

const form = document.getElementById('moodForm');
const cardsContainer = document.getElementById('cardsContainer');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const entry = Object.fromEntries(formData.entries());

  // Convertir energy en nombre et mettre 0 si vide
  entry.energy = entry.energy ? Number(entry.energy) : 0;

  try {
    // Envoyer les données à MockAPI
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
      const errorText = await res.text();
      alert('❌ Erreur lors de l\'envoi : ' + errorText);
      console.error('Erreur MockAPI :', errorText);
    }
  } catch (err) {
    alert('❌ Erreur réseau ou autre : ' + err.message);
    console.error(err);
  }
});

// Fonction pour récupérer et afficher les réponses
async function loadResponses() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Erreur récupération données :', errorText);
      return;
    }

    const data = await res.json();
    cardsContainer.innerHTML = '';
    data.reverse().forEach(d => { // les plus récentes en haut
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
  } catch (err) {
    console.error('Erreur récupération données :', err);
  }
}

// Charger les réponses au démarrage
loadResponses();
