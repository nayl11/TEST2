// Initialiser Supabase
const SUPABASE_URL = 'https://sngzcdoprwvgwpqwmhpb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuZ3pjZG9wcnd2Z3dwcXdtaHBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwOTMzODEsImV4cCI6MjA3MzY2OTM4MX0.lEug6-GEUXVEPO52raaYGJnk35XTyf74teAZXpgs2gQ';

// On renomme la variable pour éviter le conflit
const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById('moodForm');
const cardsContainer = document.getElementById('cardsContainer');

// Charger les réponses depuis Supabase
async function loadResponses() {
  const { data, error } = await client
    .from('moods')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur récupération:', error);
    return;
  }

  cardsContainer.innerHTML = '';
  data.forEach(d => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <strong>${d.name} (${d.moment})</strong><br>
      Humeur: ${d.mood} | Energie: ${d.energy || '-'} | Couleur: ${d.color || '-'}<br>
      Commentaire: ${d.comment || '-'}<br>
      <small>${d.created_at ? new Date(d.created_at).toLocaleString() : ''}</small>
    `;
    cardsContainer.appendChild(card);
  });
}

// Envoi du formulaire vers Supabase
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const entry = Object.fromEntries(formData.entries());
  if (entry.energy) entry.energy = parseInt(entry.energy);

  const { data, error } = await client
    .from('moods')
    .insert([entry]);

  if (error) {
    console.error('Erreur envoi:', error);
    alert('❌ Erreur lors de l\'envoi');
    return;
  }

  alert('✅ Réponse enregistrée !');
  form.reset();
  loadResponses();
});

// Charger les réponses au démarrage
loadResponses();
