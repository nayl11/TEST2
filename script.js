const API_URL = 'https://68c92fd3ceef5a150f63bcc6.mockapi.io/Humeur';

const form = document.getElementById('moodForm');
const cardsContainer = document.getElementById('cardsContainer');

// Fonction pour récupérer et afficher les réponses
async function loadResponses() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();
    cardsContainer.innerHTML = '';
    
    // Les plus récentes en haut
    data.reverse().forEach(d => {
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
    console.error('Erreur récupération données:', err);
  }
}

// Envoi du formulaire
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const entry = Object.fromEntries(formData.entries());

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });

    if (!res.ok) throw new Error(await res.text());

    alert('✅ Réponse enregistrée !');
    form.reset();
    loadResponses();

  } catch (err) {
    console.error('Erreur envoi:', err);
    alert('❌ Erreur lors de l\'envoi');
  }
});

// Charger les réponses au démarrage
loadResponses();
