export type Lang = 'fr' | 'en' | 'nl'

/* ─── Static lodge data (language-independent) ─── */
export const teroLodge = {
  name: 'Tero Lodge',
  location: 'Herbeumont',
  address: {
    line1: 'Rue Champs Simon 45',
    city: 'Herbeumont',
    postalCode: '6870',
    country: 'Belgique',
    full: 'Rue Champs Simon 45, 6870 Herbeumont, Belgique',
    googleMapsLink: 'https://maps.google.com/?q=Tero+Lodge+Herbeumont',
    mapsEmbed:
      'https://maps.google.com/maps?q=Tero+Lodge+Herbeumont&t=&z=14&ie=UTF8&iwloc=&output=embed',
  },
  emergency: {
    name: 'Arthur (Tero)',
    phone: '+32 472 33 32 48',
    email: 'arthur.r@tero.be',
  },
  travelTimes: [
    { city: 'Bruxelles', time: '1h35', km: '~110 km' },
    { city: 'Anvers', time: '2h10', km: '~185 km' },
    { city: 'Luxembourg', time: '1h00', km: '~70 km' },
  ],
  wifi: { network: 'Tero Manoir', password: 'quite-naturally' },
  checkIn: {
    arrival: '18:00 – 21:00',
    departureWeekday: '10:00',
    departureWeekend: '16:00',
  },
  capacity: {
    chasseurs: { name: 'Maison des Chasseurs', guests: 12 },
    manoir: { name: 'Manoir', guests: 32 },
  },
  shops: [
    {
      type: 'butcher',
      name: "Le Gribou d'Ardenne",
      address: 'Le Routeux 52, 6887 Herbeumont (Saint-Médard)',
      phone: '+32 61 32 05 95',
    },
    {
      type: 'market',
      name: 'Ferme du Bijou',
      hours: 'Sam 15h–18h30',
      address: 'Rue Notre Dame 18, 6880 Orgéo',
      phone: '+32 61 41 16 30',
    },
    {
      type: 'grocery',
      name: 'Le Cellier du Baudets',
      address: 'Rue des Munos 100, 6880 Bertrix',
      phone: '+32 474 37 53 56',
    },
    {
      type: 'bakery',
      name: 'Boulangerie Piquard',
      address: 'Rue de Plannois 4, 6887 Herbeumont',
      phone: '+32 61 27 12 89',
    },
  ],
  activities: [
    {
      id: 'aventure',
      name: 'Parc Aventure Tero – Martué',
      phone: '+32 496 12 91 06',
      email: 'gauthier.v@tero.be',
      contactName: 'Gauthier Villé',
      icon: 'TreePine',
      highlight: true,
    },
    {
      id: 'karting',
      name: 'Karting Bouillon',
      address: 'Voie Jocquée 115, 6830 Bouillon',
      phone: '+32 61 46 78 07',
      website: 'kartingbouillon.com',
      icon: 'Flag',
    },
    {
      id: 'fungalaxy',
      name: 'Fun Galaxy',
      address: "L'Aliénau 100, 6800 Libramont-Chevigny",
      phone: '+32 491 30 16 67',
      website: 'fungalaxy.be',
      icon: 'Gamepad2',
    },
    {
      id: 'bike',
      name: 'E-Space Bike',
      phone: '+32 498 15 39 51',
      website: 'escapebike.be',
      icon: 'Bike',
    },
    {
      id: 'wine',
      name: 'Taste & Travel by Sabine',
      phone: '+32 498 67 04 19',
      email: 'tastingsabine@gmail.com',
      icon: 'Wine',
    },
    {
      id: 'chateau',
      name: "Château Médiéval d'Herbeumont",
      address: 'Rue du Château 1, 6887 Herbeumont',
      icon: 'Landmark',
      highlight: true,
    },
    {
      id: 'orval',
      name: "Abbaye d'Orval",
      address: 'Orval 1, 6823 Florenville',
      phone: '+32 61 31 10 60',
      website: 'orval.be',
      icon: 'Church',
      highlight: true,
    },
    {
      id: 'ardoise',
      name: "Au Cœur de l'Ardoise",
      address: 'Rue du Babinay 1, 6880 Bertrix',
      phone: '+32 61 41 45 21',
      website: 'aucoeurdelardoise.be',
      icon: 'Mountain',
      badWeather: true,
    },
  ],
  hiking: [
    {
      id: 'chatelaine',
      name: 'La Boucle de la Châtelaine',
      distance: '~6 km',
      walkTime: '±1h30',
      runTime: '±40 min',
      mapsUrl: 'https://www.google.com/maps/search/Herbeumont+Semois',
      difficulty: 'easy' as const,
    },
    {
      id: 'tombeau',
      name: 'Le Tombeau du Chevalier',
      distance: '~12 km',
      walkTime: '±3h',
      runTime: '±1h15',
      mapsUrl: 'https://www.google.com/maps/search/Tombeau+du+Chevalier+Herbeumont',
      difficulty: 'medium' as const,
    },
    {
      id: 'florenville',
      name: 'Les Crêtes de Florenville',
      distance: '~15 km',
      walkTime: '±4h',
      runTime: '±2h',
      mapsUrl: 'https://www.google.com/maps/search/Florenville+Semois+randonn%C3%A9e',
      difficulty: 'medium' as const,
    },
  ],
  cycling: [
    {
      id: 'ravel',
      name: 'RAVeL de la Semois',
      distance: '~35 km',
      duration: '±2h30',
      bikeType: 'Famille / Route',
      mapsUrl: 'https://www.google.com/maps/search/RAVeL+Semois+Belgique',
      difficulty: 'easy' as const,
    },
    {
      id: 'bouillon',
      name: 'Bouillon–Herbeumont',
      distance: '~50 km',
      duration: '±3h30',
      bikeType: 'Gravel / VTT',
      mapsUrl: 'https://www.google.com/maps/search/Bouillon+Herbeumont+v%C3%A9lo',
      difficulty: 'medium' as const,
    },
    {
      id: 'grandardennaise',
      name: 'La Grande Ardennaise',
      distance: '~85 km',
      duration: '±7h',
      bikeType: 'Route / Gravel',
      mapsUrl: 'https://www.google.com/maps/search/Grande+Ardennaise+v%C3%A9lo',
      difficulty: 'hard' as const,
    },
  ],
  emergencies: {
    mainNumbers: [
      { number: '112', color: 'red' },
      { number: '101', color: 'blue' },
      { number: '070 245 245', color: 'amber' },
      { number: '1722', color: 'sky' },
    ],
    otherNumbers: [
      { number: '0800 32 123' },
      { number: '107' },
      { number: '103' },
      { number: '116 000' },
      { number: '0800 30 030' },
    ],
    hospital: {
      name: 'Hôpital Vivalia – Libramont',
      address: 'Avenue de Houffalize 35, 6800 Libramont-Chevigny',
    },
    doctor: { name: 'Dr Calozet', address: 'Le Qur du Furgy 16, 6887 Herbeumont' },
    pharmacy: { name: 'Pharmacie Poncelet', address: 'Rue de Bravy 18, 6887 Herbeumont' },
    police: [
      { name: 'Police Zone Semois & Lesse', address: 'Rue Lauvaux 27, 6887 Herbeumont' },
      { name: 'Police Zone Bertrix-Bouillon', address: 'Rue du Dr Pierre Lifrange 12, 6880 Bertrix' },
    ],
    dentist: { name: 'Clinique dentaire Strycek', address: 'Rue de Renaumont 40, 6880 Bertrix' },
  },
  gallery: [
    { src: '/tero/gallery/tero vue aérienne .webp', aspect: 'wide' },
    { src: '/tero/gallery/Tero extérieur.webp', aspect: 'wide' },
    { src: '/tero/gallery/tero salon g.webp', aspect: 'square' },
    { src: '/tero/gallery/Tero chambre.webp', aspect: 'square' },
    { src: '/tero/gallery/Tero salle a manger.webp', aspect: 'wide' },
  ],
}

/* ─── Translations ─── */
export const t: Record<Lang, {
  langName: string
  nav: string[]
  hero: { badge: string; welcome: string; emergencyContact: string }
  access: { label: string; title: string; travelTimes: string; openMaps: string; copied: string }
  rules: {
    label: string; title: string; wifi: string; network: string; password: string
    checkinTitle: string; arrival: string; departure: string
    capacityTitle: string
    items: { icon: string; title: string; text: string }[]
  }
  practical: { label: string; title: string; categories: Record<string, string>; supermarketNote: string }
  tourism: { label: string; title: string; category: Record<string, string>; recommended: string; badWeather: string; descs: Record<string, string> }
  hiking: { label: string; title: string; walk: string; run: string; distance: string; duration: string; loop: string; openMaps: string; descs: Record<string, string> }
  cycling: { label: string; title: string; bikeType: string; distance: string; duration: string; loop: string; openMaps: string; descs: Record<string, string> }
  emergencies: {
    label: string; title: string; mainNumbers: string; otherNumbers: string
    hospital: string; doctor: string; pharmacy: string; police: string; dentist: string
    teroContact: string; numberDescs: Record<string, string>
  }
  gallery: { label: string; title: string; tapToExpand: string; captions: string[] }
}> = {
  fr: {
    langName: 'Français',
    nav: ['Accueil', 'Accès', 'Règlement', 'Pratique', 'Tourisme', 'À pied', 'À vélo', 'Urgences', 'Galerie'],
    hero: { badge: 'Guide numérique', welcome: 'Bienvenue au', emergencyContact: "Contact d'urgence Tero" },
    access: { label: 'Comment nous trouver', title: "Plan d'accès", travelTimes: 'Temps de trajet', openMaps: 'Ouvrir dans Google Maps', copied: 'Copié !' },
    rules: {
      label: 'Pour un séjour harmonieux', title: 'Règlement', wifi: 'Wi-Fi',
      network: 'Réseau', password: 'Mot de passe',
      checkinTitle: 'Arrivée & Départ', arrival: 'Arrivée', departure: 'Départ',
      capacityTitle: 'Capacités des gîtes',
      items: [
        { icon: 'ArrowLeftRight', title: 'Arrivée & Départ', text: "L'arrivée est prévue entre 18h00 et 21h00. Départ avant 10h00 en semaine, avant 16h00 les dimanches et jours fériés. En cas d'arrivée tardive, contacter le responsable des réservations." },
        { icon: 'Package', title: 'Inventaire', text: "Restituer le logement dans le même état qu'à l'arrivée. Tout dommage sera déduit du dépôt. Ne pas déplacer les meubles. Portes coupe-feu fermées en permanence." },
        { icon: 'Sparkles', title: 'Entretien & Propreté', text: "Le ménage est inclus. Respecter les consignes de tri des déchets. Vider les poubelles dans les conteneurs au bout de l'allée avant le départ." },
        { icon: 'CigaretteOff', title: 'Non-fumeur', text: "Le lodge est non-fumeur. Les fumeurs peuvent fumer à l'extérieur. Ne pas jeter les mégots par terre." },
        { icon: 'Volume2', title: 'Respect du voisinage', text: "Silence obligatoire entre 22h00 et 6h00. Les nuisances sonores nocturnes sont passibles de poursuites judiciaires." },
        { icon: 'Car', title: 'Parking', text: "Stationner dans les zones désignées. Dépose-minute autorisée pour charger/décharger les bagages." },
        { icon: 'Lock', title: 'Espaces privés', text: "Ne pas ouvrir les placards ni les portes verrouillées — réservés à un usage privé." },
        { icon: 'Zap', title: 'Chauffage & Électricité', text: "Chauffage et électricité inclus. Pensez à la planète et évitez le gaspillage inutile." },
      ],
    },
    practical: {
      label: 'Dans les environs', title: 'Informations pratiques',
      categories: { butcher: 'Boucher', market: 'Marché des producteurs', grocery: 'Épicerie locale', bakery: 'Boulangerie', convenience: 'Magasin de proximité' },
      supermarketNote: 'Pour les grands supermarchés (Delhaize, Lidl), rendez-vous au centre commercial Bertrix – Frun (~10 min en voiture). Rte des Gohineaux 1, 6880 Bertrix.',
    },
    tourism: {
      label: 'Explorer la région', title: 'Dans la région',
      category: { Sport: 'Sport', Famille: 'Famille', Vélo: 'Vélo', Dégustation: 'Dégustation', Culture: 'Culture', Nature: 'Nature', Aventure: 'Aventure' },
      recommended: 'Incontournable', badWeather: 'Par mauvais temps',
      descs: {
        karting: 'Circuit de karting professionnel pour tous niveaux.',
        fungalaxy: 'Bowling, laser game, mini golf & arcades en famille.',
        bike: 'Location de vélos — plusieurs itinéraires balisés partent du magasin. Réservation recommandée.',
        wine: 'Dégustation de vins organisée à la maison. Une expérience unique !',
        chateau: 'Ruines médiévales du XIe siècle à 2 minutes à pied du lodge. Vue imprenable.',
        orval: "Abbaye cistercienne mondialement connue pour sa bière. Visite guidée recommandée.",
        ardoise: "Visite fascinante d'une mine d'ardoise. Idéal par mauvais temps.",
        aventure: "Accrobranche adapté à tous les niveaux — grimper, sauter et voler d'arbre en arbre en pleine nature. Activités TeamBooster pour les groupes : cohésion, dépassement de soi, esprit d'équipe.",
      },
    },
    hiking: {
      label: 'Explorez à pied', title: 'Balades & Randonnées',
      walk: 'Marche', run: 'Course', distance: 'Distance', duration: 'Durée', loop: 'Boucle', openMaps: 'Voir sur Google Maps',
      descs: {
        chatelaine: 'Boucle le long de la Semois au départ du lodge.',
        tombeau: 'La randonnée emblématique de la région avec sentiers forestiers et vues sur la rivière.',
        florenville: 'Vues panoramiques exceptionnelles sur la vallée de la Semois.',
      },
    },
    cycling: {
      label: 'Explorez à vélo', title: 'Itinéraires cyclables',
      bikeType: 'Type de vélo', distance: 'Distance', duration: 'Durée estimée', loop: 'Boucle', openMaps: 'Voir sur Google Maps',
      descs: {
        ravel: 'Itinéraire balisé officiel longeant la Semois, quasi plat, idéal en famille.',
        bouillon: 'Gravel à travers forêts, collines et sites remarquables des Ardennes.',
        grandardennaise: "L'aventure longue distance pour les cyclistes aguerris à travers toute la région.",
      },
    },
    emergencies: {
      label: 'En cas de besoin', title: 'Urgences', mainNumbers: "Numéros d'urgence",
      otherNumbers: 'Autres numéros utiles',
      hospital: 'Hôpital le plus proche', doctor: 'Médecin généraliste', pharmacy: 'Pharmacie',
      police: 'Police', dentist: 'Dentiste', teroContact: "Contact d'urgence Tero",
      numberDescs: {
        '112': 'Urgences médicales & incendie', '101': 'Assistance policière',
        '070 245 245': 'Centre antipoison', '1722': 'Météo extrême (orange/rouge)',
        '0800 32 123': 'Prévention suicide', '107': 'Télé-Accueil',
        '103': "Service d'écoute enfants", '116 000': 'Child Focus', '0800 30 030': 'Violence domestique',
      },
    },
    gallery: {
      label: 'Le lodge en images', title: 'Galerie photo', tapToExpand: 'Appuyez pour agrandir',
      captions: ['Vue aérienne du domaine', 'Vue extérieure du domaine', 'Salon de la Maison des Chasseurs', 'Chambre avec cheminée', 'Salle à manger'],
    },
  },

  en: {
    langName: 'English',
    nav: ['Home', 'Access', 'Rules', 'Practical', 'Tourism', 'Walks', 'Cycling', 'Emergency', 'Gallery'],
    hero: { badge: 'Digital Guide', welcome: 'Welcome to', emergencyContact: 'Tero Emergency Contact' },
    access: { label: 'How to find us', title: 'Getting Here', travelTimes: 'Travel times', openMaps: 'Open in Google Maps', copied: 'Copied!' },
    rules: {
      label: 'For a harmonious stay', title: 'House Rules', wifi: 'Wi-Fi',
      network: 'Network', password: 'Password',
      checkinTitle: 'Check-in & Check-out', arrival: 'Check-in', departure: 'Check-out',
      capacityTitle: 'Lodge Capacities',
      items: [
        { icon: 'ArrowLeftRight', title: 'Check-in & Check-out', text: 'Check-in is between 6:00 PM and 9:00 PM. Check-out before 10:00 AM on weekdays, before 4:00 PM on Sundays and public holidays. Contact us for late arrivals.' },
        { icon: 'Package', title: 'Inventory', text: 'Return the property in the same condition as upon arrival. Any damage will be deducted from the deposit. Do not move furniture. Fire doors must remain closed at all times.' },
        { icon: 'Sparkles', title: 'Cleanliness', text: 'Cleaning is included. Follow waste sorting instructions. Empty bins in the containers at the end of the driveway before departure.' },
        { icon: 'CigaretteOff', title: 'Non-smoking', text: 'The lodge is non-smoking. Smokers may smoke outdoors. Do not throw cigarette butts on the ground.' },
        { icon: 'Volume2', title: 'Quiet hours', text: 'Silence required between 10:00 PM and 6:00 AM. Nocturnal noise disturbances may result in legal prosecution.' },
        { icon: 'Car', title: 'Parking', text: 'Park only in designated areas. Drop-off is allowed for loading/unloading luggage.' },
        { icon: 'Lock', title: 'Private areas', text: 'Do not open locked cupboards or doors — reserved for private use.' },
        { icon: 'Zap', title: 'Heating & Electricity', text: 'Heating and electricity are included. Please be mindful of the planet and avoid unnecessary waste.' },
      ],
    },
    practical: {
      label: 'In the area', title: 'Practical Information',
      categories: { butcher: 'Butcher', market: "Farmer's Market", grocery: 'Local Grocery', bakery: 'Bakery', convenience: 'Convenience Store' },
      supermarketNote: 'For large supermarkets (Delhaize, Lidl), visit the Bertrix – Frun shopping centre (~10 min drive). Rte des Gohineaux 1, 6880 Bertrix.',
    },
    tourism: {
      label: 'Explore the region', title: 'In the Region',
      category: { Sport: 'Sport', Famille: 'Family', Vélo: 'Cycling', Dégustation: 'Tasting', Culture: 'Culture', Nature: 'Nature', Aventure: 'Adventure' },
      recommended: 'Must-see', badWeather: 'Rainy day',
      descs: {
        karting: 'Professional karting circuit for all levels.',
        fungalaxy: 'Bowling, laser game, mini golf & arcades for the whole family.',
        bike: 'Bike rental — several marked routes start from the shop. Booking recommended.',
        wine: 'Wine tasting organised at home. A unique experience!',
        chateau: '11th-century medieval ruins 2 minutes walk from the lodge. Stunning views.',
        orval: 'World-famous Cistercian abbey known for its beer. Guided tour recommended.',
        ardoise: 'Fascinating slate mine tour. Ideal for rainy days.',
        aventure: 'Tree climbing for all levels — climb, jump and fly from tree to tree in the heart of nature. TeamBooster activities for groups: team building, self-surpassing, team spirit.',
      },
    },
    hiking: {
      label: 'Explore on foot', title: 'Walks & Hikes',
      walk: 'Walking', run: 'Running', distance: 'Distance', duration: 'Duration', loop: 'Loop', openMaps: 'View on Google Maps',
      descs: {
        chatelaine: 'Loop along the Semois starting from the lodge.',
        tombeau: 'The iconic hike of the region with forest trails and river views.',
        florenville: 'Exceptional panoramic views over the Semois valley.',
      },
    },
    cycling: {
      label: 'Explore by bike', title: 'Cycling Routes',
      bikeType: 'Bike type', distance: 'Distance', duration: 'Estimated time', loop: 'Loop', openMaps: 'View on Google Maps',
      descs: {
        ravel: 'Official marked route following the Semois, nearly flat, ideal for families.',
        bouillon: 'Gravel through forests, hills and remarkable sites of the Ardennes.',
        grandardennaise: 'The long-distance adventure for seasoned cyclists across the entire region.',
      },
    },
    emergencies: {
      label: 'In case of need', title: 'Emergencies', mainNumbers: 'Emergency numbers',
      otherNumbers: 'Other useful numbers',
      hospital: 'Nearest hospital', doctor: 'General practitioner', pharmacy: 'Pharmacy',
      police: 'Police', dentist: 'Dentist', teroContact: 'Tero Emergency Contact',
      numberDescs: {
        '112': 'Medical emergency & fire', '101': 'Police emergency',
        '070 245 245': 'Poison control centre', '1722': 'Extreme weather (orange/red alert)',
        '0800 32 123': 'Suicide prevention', '107': 'Social / psychological crisis',
        '103': "Children's helpline", '116 000': 'Child Focus', '0800 30 030': 'Domestic violence',
      },
    },
    gallery: {
      label: 'The lodge in pictures', title: 'Photo Gallery', tapToExpand: 'Tap to expand',
      captions: ['Aerial view of the estate', 'Exterior view', 'Maison des Chasseurs lounge', 'Bedroom with fireplace', 'Dining room'],
    },
  },

  nl: {
    langName: 'Nederlands',
    nav: ['Welkom', 'Toegang', 'Regels', 'Praktisch', 'Toerisme', 'Wandelen', 'Fietsen', 'Noodgeval', 'Galerij'],
    hero: { badge: 'Digitale Gids', welcome: 'Welkom bij', emergencyContact: 'Tero Noodcontact' },
    access: { label: 'Hoe ons te vinden', title: 'Routebeschrijving', travelTimes: 'Reistijden', openMaps: 'Openen in Google Maps', copied: 'Gekopieerd!' },
    rules: {
      label: 'Voor een harmonieus verblijf', title: 'Huisregels', wifi: 'Wi-Fi',
      network: 'Netwerk', password: 'Wachtwoord',
      checkinTitle: 'Aankomst & Vertrek', arrival: 'Aankomst', departure: 'Vertrek',
      capacityTitle: 'Capaciteit van de verblijven',
      items: [
        { icon: 'ArrowLeftRight', title: 'Aankomst & Vertrek', text: 'Aankomst tussen 18u00 en 21u00. Vertrek voor 10u00 op weekdagen, voor 16u00 op zondag en feestdagen. Contacteer ons bij late aankomst.' },
        { icon: 'Package', title: 'Inventaris', text: 'Lever het verblijf in dezelfde staat terug als bij aankomst. Schade wordt ingehouden op de waarborg. Verplaats geen meubels. Branddeuren moeten te allen tijde gesloten blijven.' },
        { icon: 'Sparkles', title: 'Netheid', text: 'Schoonmaak is inbegrepen. Volg de sorteerinstructies voor afval. Breng de vuilnisbakken voor vertrek naar de containers aan het einde van de oprit.' },
        { icon: 'CigaretteOff', title: 'Rookvrij', text: 'Het lodge is rookvrij. Rokers mogen buiten roken. Gooi geen sigarettenpeuken op de grond.' },
        { icon: 'Volume2', title: 'Nachtrust', text: 'Stilte verplicht tussen 22u00 en 6u00. Nachtelijke geluidsoverlast kan leiden tot gerechtelijke vervolging.' },
        { icon: 'Car', title: 'Parking', text: 'Parkeer uitsluitend op de aangewezen plaatsen. Afzetten voor laden/lossen is toegestaan.' },
        { icon: 'Lock', title: 'Privéruimten', text: 'Open geen afgesloten kasten of deuren — gereserveerd voor privégebruik.' },
        { icon: 'Zap', title: 'Verwarming & Elektriciteit', text: 'Verwarming en elektriciteit zijn inbegrepen. Denk aan het milieu en vermijd onnodige verspilling.' },
      ],
    },
    practical: {
      label: 'In de omgeving', title: 'Praktische informatie',
      categories: { butcher: 'Slager', market: 'Boerenmarkt', grocery: 'Lokale winkel', bakery: 'Bakkerij', convenience: 'Buurtwinkel' },
      supermarketNote: 'Voor grote supermarkten (Delhaize, Lidl), bezoek het winkelcentrum Bertrix – Frun (~10 min rijden). Rte des Gohineaux 1, 6880 Bertrix.',
    },
    tourism: {
      label: 'Verken de regio', title: 'In de regio',
      category: { Sport: 'Sport', Famille: 'Familie', Vélo: 'Fietsen', Dégustation: 'Proeverij', Culture: 'Cultuur', Nature: 'Natuur', Aventure: 'Avontuur' },
      recommended: 'Aanrader', badWeather: 'Bij slecht weer',
      descs: {
        karting: 'Professioneel kartingcircuit voor alle niveaus.',
        fungalaxy: 'Bowling, lasergame, minigolf & arcades voor het hele gezin.',
        bike: 'Fietsverhuur — meerdere bewegwijzerde routes vertrekken vanuit de winkel. Reservatie aanbevolen.',
        wine: 'Wijnproeverij georganiseerd aan huis. Een unieke ervaring!',
        chateau: '11e-eeuwse middeleeuwse ruïnes op 2 minuten wandelen van het lodge. Verbluffend uitzicht.',
        orval: 'Wereldberoemde Cisterciënzerabdij bekend om zijn bier. Rondleiding aanbevolen.',
        ardoise: 'Fascinerende rondleiding in een leisteenmijn. Ideaal bij slecht weer.',
        aventure: 'Klauteren voor alle niveaus — klimmen, springen en vliegen van boom tot boom in het hart van de natuur. TeamBooster-activiteiten voor groepen: teambuilding, zelfoverstijging, teamgeest.',
      },
    },
    hiking: {
      label: 'Verken te voet', title: 'Wandel- & Looproutes',
      walk: 'Wandelen', run: 'Lopen', distance: 'Afstand', duration: 'Duur', loop: 'Lus', openMaps: 'Bekijk op Google Maps',
      descs: {
        chatelaine: 'Lus langs de Semois, vertrekkend vanaf het lodge.',
        tombeau: 'De iconische wandeling van de regio met bospaden en uitzicht op de rivier.',
        florenville: 'Uitzonderlijk panoramisch uitzicht over de Semois vallei.',
      },
    },
    cycling: {
      label: 'Verken per fiets', title: 'Fietsroutes',
      bikeType: 'Fietstype', distance: 'Afstand', duration: 'Geschatte tijd', loop: 'Lus', openMaps: 'Bekijk op Google Maps',
      descs: {
        ravel: 'Officieel bewegwijzerde route langs de Semois, bijna vlak, ideaal voor families.',
        bouillon: 'Gravel door bossen, heuvels en opmerkelijke plaatsen van de Ardennen.',
        grandardennaise: 'Het langeafstandsavontuur voor ervaren fietsers door de hele regio.',
      },
    },
    emergencies: {
      label: 'In geval van nood', title: 'Noodgevallen', mainNumbers: 'Noodnummers',
      otherNumbers: 'Andere nuttige nummers',
      hospital: 'Dichtstbijzijnd ziekenhuis', doctor: 'Huisarts', pharmacy: 'Apotheek',
      police: 'Politie', dentist: 'Tandarts', teroContact: 'Tero Noodcontact',
      numberDescs: {
        '112': 'Medische noodgevallen & brand', '101': 'Politie noodoproep',
        '070 245 245': 'Antigifcentrum', '1722': 'Extreem weer (oranje/rode code)',
        '0800 32 123': 'Zelfmoordpreventie', '107': 'Sociale / psychologische crisis',
        '103': 'Kindertelefoon', '116 000': 'Child Focus', '0800 30 030': 'Partnergeweld',
      },
    },
    gallery: {
      label: 'Het lodge in beelden', title: 'Fotogalerij', tapToExpand: 'Tik om te vergroten',
      captions: ['Luchtfoto van het domein', 'Buitenaanzicht', 'Salon van de Maison des Chasseurs', 'Slaapkamer met open haard', 'Eetkamer'],
    },
  },
}
