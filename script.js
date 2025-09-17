// Importer la librairie Supabase
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

// 🔑 Mets ici les infos de ton projet Supabase
const SUPABASE_URL = 'https://TON-PROJET.supabase.co'
const SUPABASE_ANON_KEY = 'TA-ANON-KEY'

// Connexion au projet
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const form = document.getElementById('moodForm')
const cardsContainer = document.getElementById('cardsContainer')

// Fonction pour charger les réponses
async function loadResponses() {
  const { data, error } = await supabase
    .from('moods')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('❌ Erreur récupération:', error)
    return
  }

  cardsContainer.innerHTML = ''
  data.forEach(d => {
    const card = document.createElement('div')
    card.className = 'card'
    card.innerHTML = `
      <strong>${d.name} (${d.moment})</strong><br>
      Humeur: ${d.mood} | Energie: ${d.energy} | Couleur: ${d.color}<br>
      Commentaire: ${d.comment}<br>
      <small>${new Date(d.created_at).toLocaleString()}</small>
    `
    cardsContainer.appendChild(card)
  })
}

// Gestion du formulaire
form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const formData = new FormData(form)
  const entry = Object.fromEntries(formData.entries())

  const { error } = await supabase.from('moods').insert([entry])

  if (error) {
    console.error('❌ Erreur envoi:', error)
    alert('❌ Erreur lors de l\'envoi')
  } else {
    alert('✅ Réponse enregistrée !')
    form.reset()
    loadResponses()
  }
})

// Charger les réponses au démarrage
loadResponses()
