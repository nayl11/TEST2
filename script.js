// --- Configuration Supabase ---
const SUPABASE_URL = 'https://sngzcdoprwvgwpqwmhpb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuZ3pjZG9wcnd2Z3dwcXdtaHBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwOTMzODEsImV4cCI6MjA3MzY2OTM4MX0.lEug6-GEUXVEPO52raaYGJnk35XTyf74teAZXpgs2gQ';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Sélection des éléments DOM ---
const form = document.getElementById('moodForm');
const cardsContainer = document.getElementById('cardsContainer');

// --- Fonction pour charger et afficher les réponses ---
async function loadResponses() {
  try {
    const { data, error } = await supabase
      .from('moods')
      .select('*')
      .order('created_at', { ascending: false }); // les plus récentes en haut

    if (error) throw error;

    cardsContainer.innerHTML = '';

    data.forEach(d => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <strong>${d.name} (${d.moment})</strong><br>
        Humeur: ${d.mood} | Energie: ${d.energy} | Couleur: ${d.color}<br>
        Commentaire: ${d.comment}<br>
        <small>${d.created_at ? new Date(d.created_at).toLocaleString() : ''}</small>
      `;
      cardsContainer.appendChild(card);
    });

  } catch (err) {
    console.error('Erreur récupération données:', err);
  }
}

// --- Envoi du formulaire ---
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const entry = Object.fromEntries(formData.entries());

  try {
    const { data, error } = await supabase
      .from('moods')
      .insert([entry]);

    if (error) throw error;

    alert('✅ Réponse enregistrée !');
    form.reset();
    loadResponses();

  } catch (err) {
    console.error('Erreur envoi:', err);
    alert('❌ Erreur lors de l\'envoi');
  }
});

// --- Charger les réponses au démarrage ---
loadResponses();
