// Mock data for tattoo studio website

export const studioInfo = {
  name: "KauankArttato",
  phone: "+55 88 99232-8656",
  whatsapp: "5588992328656",
  address: "Rua José de Queiroz Pessoa, 2262 - Planalto Universitário, Quixadá - CE",
  contactAddress: "Quixadá/CE",
  mapsEmbedUrl: "https://maps.google.com/maps?q=Rua%20Jos%C3%A9%20de%20Queiroz%20Pessoa%202262%20Quixad%C3%A1&t=&z=15&ie=UTF8&iwloc=&output=embed",
  instagram: "https://www.instagram.com/kauank.art_tattoo/",
  mapLink: "https://maps.app.goo.gl/b2xpSXZPWiQuL6Xe7"
};

export const artistInfo = {
  name: "Kauan Keven",
  bio: "Sou tatuador há mais de 5 anos, dedicado à arte de tatuar e transformar ideias em arte permanente. Apaixonado pelo que faço, busco sempre criar tattoos exclusivas que contam a história de cada cliente. Cada projeto é uma nova oportunidade de criar algo único e significativo.",
  // Ajuste do caminho: Se a pasta assets estiver na raiz (fora da src), o ideal é mover para dentro da src/assets
  // e usar o caminho abaixo. Se mover para public/assets, mantenha apenas '/assets/foto.jpeg'
  photo: '/assets/foto.jpeg', 
  experience: "+5 anos"
};

export const tattooCategories = {
  realismo: [],
  arteSacra: [],
  blackwork: [],
  outros: []
};