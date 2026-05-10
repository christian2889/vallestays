/* Bilingual copy + property data for Valle Stays */

export type Lang = "en" | "es";

export type Bilingual = { en: string; es: string };

export type Property = {
  id: string;
  name: string;
  type: "villa" | "casita" | "ranch";
  locale: Bilingual;
  desc: Bilingual;
  sleeps: number;
  beds: number;
  baths: number;
  nightly: number;
  tags: string[];
  palette: [string, string, string];
  shape: string;
};

export const COPY = {
  en: {
    nav: { stays: "Stays", valley: "The Valley", experiences: "Experiences", guide: "Guide", journal: "Journal", reserve: "Reserve", host: "Host with us", search: "Find a stay" },
    hero: {
      eyebrow: "Valle de Guadalupe · Baja California",
      title_1: "Sleep where the",
      title_em: "vines",
      title_2: "begin.",
      lede: "A small, hand-picked collection of homes, casitas and ranch houses across México's wine country — a 90-minute drive south of San Diego.",
      search_dates: "Dates",
      search_dates_v: "Apr 12 — Apr 16",
      search_guests: "Guests",
      search_guests_v: "2 adults",
      search_taste: "Taste",
      search_taste_v: "Vineyard view",
      search_cta: "Find a stay",
      featured: "Featured this week",
    },
    stays: {
      eyebrow: "01 — Stays",
      title: "Twelve homes,",
      title_em: "no two alike.",
      lede: "From off-grid adobe casitas tucked into olive groves to architect-built villas above the vineyards. Every home is visited, photographed and approved by us.",
      filter_all: "All",
      filter_villa: "Villas",
      filter_casita: "Casitas",
      filter_ranch: "Ranches",
      filter_off_grid: "Off-grid",
      from: "from",
      per_night: "/ night",
      sleeps: "sleeps",
      view_home: "View home",
      see_all: "See the full collection",
    },
    valley: {
      eyebrow: "02 — The Valley",
      title: "Mexico's quietest",
      title_em: "wine country.",
      body_1: "Valle de Guadalupe sits in a granite-rimmed bowl 25 km inland from the Pacific. The sea breeze and decomposed-granite soil make for a growing season that rivals Sonoma — but the valley is still mostly dirt roads, family ranches, and a tight community of 150 boutique wineries.",
      body_2: "We've lived here a decade. We know which winemaker pours late on Sundays, which goat farmer makes the best cheese, and which dirt road floods after a single afternoon of rain.",
      stat_1_n: "150+", stat_1_l: "boutique wineries",
      stat_2_n: "90 min", stat_2_l: "south of San Diego",
      stat_3_n: "320", stat_3_l: "days of sun",
      stat_4_n: "12", stat_4_l: "homes in the collection",
    },
    exp: {
      eyebrow: "03 — Experiences",
      title: "Long lunches,",
      title_em: "longer afternoons.",
      lede: "We'll book the table, send the driver, and leave the rest to the valley. Add any of these to your stay.",
      items: [
        { id: "cellar",    tag: "Wine", title: "Private cellar tour", who: "Bodegas F. Rubio, Vena Cava, Lechuza", price: "from $180 / pair" },
        { id: "campestre", tag: "Food", title: "Campestre tasting menu", who: "Deckman's en el Mogor or Fauna", price: "from $145 / guest" },
        { id: "horse",     tag: "Land", title: "Sunrise horseback ride", who: "Rancho Los Olivos · 2 hours", price: "from $95 / rider" },
        { id: "oyster",    tag: "Sea", title: "Oyster farm afternoon", who: "Bahía Falsa, Ensenada", price: "from $120 / guest" },
        { id: "temazcal",  tag: "Bath", title: "In-home temazcal ceremony", who: "Curandera María Elena", price: "from $260 / pair" },
        { id: "balloon",   tag: "Air", title: "Hot-air balloon at dawn", who: "Above the valley · 45 min", price: "from $310 / pair" },
      ],
    },
    journal: {
      eyebrow: "04 — Journal",
      title: "Field notes from the valley.",
      posts: [
        { kind: "Guide", date: "April 2026", title: "Where to eat the week of the harvest" },
        { kind: "Letter", date: "March 2026", title: "On the smell of wet granite, and other small reasons to come in spring" },
        { kind: "Map", date: "February 2026", title: "Twelve dirt roads, ranked by how lost you'll get" },
      ],
    },
    reserve: {
      eyebrow: "05 — Reserve",
      title: "Tell us when",
      title_em: "you're coming.",
      lede: "We answer every inquiry by hand, usually within four hours. No bots, no instant book, no surprises at check-in.",
      f_name: "Your name",
      f_email: "Email",
      f_dates: "Approximate dates",
      f_party: "Who's coming",
      f_notes: "Anything we should know?",
      f_notes_ph: "Anniversary, food allergies, dirt-road anxiety…",
      submit: "Send inquiry",
      reply: "We'll write back within four hours.",
    },
    footer: {
      tagline: "A quiet collection of homes in México's wine country.",
      contact: "Contact",
      address: "Carretera Federal 3, KM 78.5\nValle de Guadalupe, BC, México",
      phone: "+52 646 155 0000",
      email: "hola@vallestays.mx",
      follow: "Follow",
      legal: "© 2026 Valle Stays · Permiso SECTUR 04-2024",
    },
  },
  es: {
    nav: { stays: "Casas", valley: "El Valle", experiences: "Experiencias", guide: "Guía", journal: "Diario", reserve: "Reservar", host: "Sé anfitrión", search: "Buscar casa" },
    hero: {
      eyebrow: "Valle de Guadalupe · Baja California",
      title_1: "Duerme donde",
      title_em: "nacen",
      title_2: "las vides.",
      lede: "Una colección pequeña y curada de casas, casitas y ranchos en el corazón del país del vino mexicano — a 90 minutos al sur de San Diego.",
      search_dates: "Fechas",
      search_dates_v: "12 abr — 16 abr",
      search_guests: "Huéspedes",
      search_guests_v: "2 adultos",
      search_taste: "Estilo",
      search_taste_v: "Vista al viñedo",
      search_cta: "Buscar casa",
      featured: "Destacada esta semana",
    },
    stays: {
      eyebrow: "01 — Casas",
      title: "Doce casas,",
      title_em: "ninguna igual.",
      lede: "Desde casitas de adobe entre olivos hasta villas de arquitecto sobre los viñedos. Cada casa la visitamos, fotografiamos y aprobamos en persona.",
      filter_all: "Todas",
      filter_villa: "Villas",
      filter_casita: "Casitas",
      filter_ranch: "Ranchos",
      filter_off_grid: "Sin red",
      from: "desde",
      per_night: "/ noche",
      sleeps: "para",
      view_home: "Ver casa",
      see_all: "Ver la colección completa",
    },
    valley: {
      eyebrow: "02 — El Valle",
      title: "El país del vino",
      title_em: "más tranquilo de México.",
      body_1: "El Valle de Guadalupe está en una cuenca de granito a 25 km del Pacífico. La brisa del mar y el suelo de granito descompuesto crean una temporada de cultivo a la altura de Sonoma — pero el valle sigue siendo terracería, ranchos familiares y una comunidad cerrada de 150 vinícolas boutique.",
      body_2: "Llevamos una década viviendo aquí. Sabemos qué enólogo sirve tarde los domingos, qué cabrero hace el mejor queso, y qué terracería se inunda con una sola tarde de lluvia.",
      stat_1_n: "150+", stat_1_l: "vinícolas boutique",
      stat_2_n: "90 min", stat_2_l: "al sur de San Diego",
      stat_3_n: "320", stat_3_l: "días de sol",
      stat_4_n: "12", stat_4_l: "casas en la colección",
    },
    exp: {
      eyebrow: "03 — Experiencias",
      title: "Comidas largas,",
      title_em: "tardes más largas.",
      lede: "Reservamos la mesa, mandamos al chofer, y dejamos lo demás al valle. Agrega cualquiera a tu estancia.",
      items: [
        { id: "cellar",    tag: "Vino", title: "Cata privada en cava", who: "Bodegas F. Rubio, Vena Cava, Lechuza", price: "desde $180 / pareja" },
        { id: "campestre", tag: "Mesa", title: "Menú campestre de degustación", who: "Deckman's en el Mogor o Fauna", price: "desde $145 / persona" },
        { id: "horse",     tag: "Tierra", title: "Cabalgata al amanecer", who: "Rancho Los Olivos · 2 horas", price: "desde $95 / jinete" },
        { id: "oyster",    tag: "Mar", title: "Tarde en granja de ostras", who: "Bahía Falsa, Ensenada", price: "desde $120 / persona" },
        { id: "temazcal",  tag: "Baño", title: "Temazcal en casa", who: "Curandera María Elena", price: "desde $260 / pareja" },
        { id: "balloon",   tag: "Aire", title: "Globo aerostático al alba", who: "Sobre el valle · 45 min", price: "desde $310 / pareja" },
      ],
    },
    journal: {
      eyebrow: "04 — Diario",
      title: "Notas de campo desde el valle.",
      posts: [
        { kind: "Guía", date: "abril 2026", title: "Dónde comer la semana de la vendimia" },
        { kind: "Carta", date: "marzo 2026", title: "Sobre el olor a granito mojado y otras razones para venir en primavera" },
        { kind: "Mapa", date: "febrero 2026", title: "Doce terracerías, según qué tan perdido te vas a sentir" },
      ],
    },
    reserve: {
      eyebrow: "05 — Reservar",
      title: "Dinos cuándo",
      title_em: "vienes.",
      lede: "Respondemos cada solicitud a mano, casi siempre en menos de cuatro horas. Sin bots, sin reserva instantánea, sin sorpresas al llegar.",
      f_name: "Tu nombre",
      f_email: "Correo",
      f_dates: "Fechas aproximadas",
      f_party: "Quién viene",
      f_notes: "¿Algo que debamos saber?",
      f_notes_ph: "Aniversario, alergias, miedo a la terracería…",
      submit: "Enviar solicitud",
      reply: "Te respondemos en menos de cuatro horas.",
    },
    footer: {
      tagline: "Una colección discreta de casas en el país del vino mexicano.",
      contact: "Contacto",
      address: "Carretera Federal 3, KM 78.5\nValle de Guadalupe, BC, México",
      phone: "+52 646 155 0000",
      email: "hola@vallestays.mx",
      follow: "Síguenos",
      legal: "© 2026 Valle Stays · Permiso SECTUR 04-2024",
    },
  },
} as const;

export const PROPERTIES: Property[] = [
  {
    id: "casa-de-piedra",
    name: "Casa de Piedra",
    type: "villa",
    locale: { en: "El Porvenir · 4 km from Decantos", es: "El Porvenir · 4 km de Decantos" },
    desc: { en: "Stone villa cantilevered above the Cabernet block. Cold pool, outdoor shower, library of 600 Mexican wines.", es: "Villa de piedra suspendida sobre el bloque de Cabernet. Alberca fría, regadera al aire libre, cava con 600 vinos mexicanos." },
    sleeps: 6, beds: 3, baths: 3, nightly: 685,
    tags: ["villa", "vineyard"],
    palette: ["#8a4a2a", "#d4b896", "#3a2418"],
    shape: "arch",
  },
  {
    id: "casita-adelina",
    name: "Casita Adelina",
    type: "casita",
    locale: { en: "San Antonio de las Minas", es: "San Antonio de las Minas" },
    desc: { en: "One-room adobe with a wood-burning kitchen and an outdoor copper bathtub under the pepper tree.", es: "Adobe de un cuarto con cocina de leña y tina de cobre al aire libre bajo el pirul." },
    sleeps: 2, beds: 1, baths: 1, nightly: 245,
    tags: ["casita", "off-grid"],
    palette: ["#c98e5a", "#e8d8b8", "#2a1f17"],
    shape: "circle",
  },
  {
    id: "rancho-los-olivos",
    name: "Rancho Los Olivos",
    type: "ranch",
    locale: { en: "Francisco Zarco · working olive ranch", es: "Francisco Zarco · rancho olivarero" },
    desc: { en: "Restored 1932 ranch house, four bedrooms, long farm table for ten, two horses on the property.", es: "Casa de rancho de 1932 restaurada, cuatro recámaras, mesa larga para diez, dos caballos en la propiedad." },
    sleeps: 8, beds: 4, baths: 3, nightly: 540,
    tags: ["ranch", "vineyard"],
    palette: ["#5e6b3a", "#d8d2b8", "#1f2418"],
    shape: "rect",
  },
  {
    id: "el-mirador",
    name: "El Mirador",
    type: "villa",
    locale: { en: "Cañón de Doña Petra · ridge house", es: "Cañón de Doña Petra · casa en cresta" },
    desc: { en: "All-glass pavilion at the top of the canyon. Sunset over the entire valley from the bath.", es: "Pabellón de vidrio en la cima del cañón. Atardecer sobre todo el valle desde la bañera." },
    sleeps: 4, beds: 2, baths: 2, nightly: 825,
    tags: ["villa", "view"],
    palette: ["#3a4a52", "#c8d2d4", "#181f24"],
    shape: "rect-tall",
  },
  {
    id: "casita-pirul",
    name: "Casita del Pirul",
    type: "casita",
    locale: { en: "El Tigre · vineyard edge", es: "El Tigre · linde de viñedo" },
    desc: { en: "Rammed-earth studio with a private patio and outdoor kitchen. Solar power, well water, no Wi-Fi.", es: "Estudio de tapial con patio privado y cocina al aire libre. Energía solar, agua de pozo, sin Wi-Fi." },
    sleeps: 2, beds: 1, baths: 1, nightly: 215,
    tags: ["casita", "off-grid"],
    palette: ["#a06b3a", "#e8dcc4", "#241814"],
    shape: "arch-tall",
  },
  {
    id: "casa-tres-mujeres",
    name: "Casa Tres Mujeres",
    type: "ranch",
    locale: { en: "El Porvenir · 6 acres", es: "El Porvenir · 2.4 hectáreas" },
    desc: { en: "Three connected adobes around a shared courtyard and lap pool. Sleeps a wedding party.", es: "Tres adobes conectados alrededor de un patio compartido y alberca. Para una boda completa." },
    sleeps: 12, beds: 6, baths: 5, nightly: 1180,
    tags: ["ranch", "vineyard"],
    palette: ["#b56a3a", "#e8d4b0", "#2a1814"],
    shape: "circle-large",
  },
];

export type StayDetailData = {
  galleryShapes: string[];
  sqft: number;
  year: number;
  restored: number;
  rooms: Bilingual[];
  amenities: [string, string][];
  host: { name: string; since: number; lang: string; quote: Bilingual };
  reviews: { name: string; from: Bilingual; body: Bilingual; rating: number }[];
};

const STAY_DETAIL: Record<string, StayDetailData> = {
  "casa-de-piedra": {
    galleryShapes: ["arch", "rect-tall", "circle", "rect", "arch-tall"],
    sqft: 2400, year: 1972, restored: 2021,
    rooms: [
      { en: "Primary suite with king bed", es: "Recámara principal con king" },
      { en: "Two guest rooms with queen beds", es: "Dos recámaras con queen" },
      { en: "Open-plan kitchen + farm table for 10", es: "Cocina abierta + mesa para 10" },
      { en: "Library with 600 Mexican wines", es: "Biblioteca con 600 vinos mexicanos" },
      { en: "Cantilevered terrace + cold pool", es: "Terraza voladiza + alberca fría" },
    ],
    amenities: [
      ["Wi-Fi", "Wi-Fi"], ["Cold pool", "Alberca fría"], ["Outdoor shower", "Regadera al aire libre"],
      ["Wood-burning oven", "Horno de leña"], ["Espresso machine", "Máquina de espresso"],
      ["EV charger", "Cargador EV"], ["Wine cellar", "Cava"], ["Stargazing platform", "Plataforma para estrellas"],
      ["Bose sound system", "Sonido Bose"], ["Air conditioning", "Aire acondicionado"],
      ["Outdoor fireplace", "Chimenea exterior"], ["Bocce court", "Cancha de bocce"],
    ],
    host: { name: "Ana & Diego", since: 2018, lang: "ES · EN · FR", quote: { en: "We grew up between Tijuana and the valley. We host the way our grandmothers hosted us — with too much food and a fire in the courtyard.", es: "Crecimos entre Tijuana y el valle. Recibimos como nos recibían nuestras abuelas — con demasiada comida y una fogata en el patio." } },
    reviews: [
      { name: "Maya R.", from: { en: "San Francisco · 4 nights", es: "San Francisco · 4 noches" }, body: { en: "We came for a wedding nearby and ended up hiding here for two extra days. The light at 5pm hits the Cabernet block and the whole house goes orange. Ana left fresh tortillas at the door each morning.", es: "Vinimos por una boda cercana y acabamos escondidos aquí dos días extra. La luz de las 5 pm pega en el bloque de Cabernet y toda la casa se pone naranja. Ana nos dejaba tortillas frescas cada mañana." }, rating: 5 },
      { name: "Hiro T.", from: { en: "Los Angeles · 6 nights", es: "Los Angeles · 6 noches" }, body: { en: "Diego drove us to three wineries that aren't on the map and made us promise not to write them down. The cellar at the house alone is worth the trip.", es: "Diego nos llevó a tres vinícolas que no están en el mapa y nos hizo prometer no anotarlas. La cava de la casa por sí sola vale el viaje." }, rating: 5 },
      { name: "Camila S.", from: { en: "Mexico City · 3 nights", es: "CDMX · 3 noches" }, body: { en: "I work in design and I'm picky about houses. This one is the real thing — old stone, restored carefully, no influencer nonsense. Slept ten hours every night.", es: "Trabajo en diseño y soy exigente con las casas. Esta es de verdad — piedra vieja, restaurada con cuidado, sin tonterías de influencer. Dormí diez horas cada noche." }, rating: 5 },
    ],
  },
};

const STAY_DETAIL_DEFAULT: StayDetailData = {
  galleryShapes: ["arch", "rect", "circle", "arch-tall", "rect-tall"],
  sqft: 1400, year: 1968, restored: 2022,
  rooms: [
    { en: "Bedroom with king bed", es: "Recámara con king" },
    { en: "Open kitchen + dining for six", es: "Cocina abierta + comedor para seis" },
    { en: "Living room with fireplace", es: "Sala con chimenea" },
    { en: "Patio with outdoor shower", es: "Patio con regadera al aire libre" },
  ],
  amenities: [
    ["Wi-Fi", "Wi-Fi"], ["Outdoor shower", "Regadera al aire libre"],
    ["Wood-burning kitchen", "Cocina de leña"], ["Espresso machine", "Máquina de espresso"],
    ["Solar power", "Energía solar"], ["Well water", "Agua de pozo"],
    ["Hammock", "Hamaca"], ["Outdoor fireplace", "Chimenea exterior"],
    ["Yoga mats", "Tapetes de yoga"], ["Bicycles (2)", "Bicicletas (2)"],
  ],
  host: { name: "Ana & Diego", since: 2018, lang: "ES · EN · FR", quote: { en: "We host the way our grandmothers hosted us — with too much food and a fire in the courtyard.", es: "Recibimos como nos recibían nuestras abuelas — con demasiada comida y una fogata en el patio." } },
  reviews: [
    { name: "Sara K.", from: { en: "Portland · 3 nights", es: "Portland · 3 noches" }, body: { en: "The simplest, most considered space we've stayed in this year. We left already planning when to come back.", es: "El espacio más simple y mejor pensado del año. Nos fuimos ya planeando volver." }, rating: 5 },
    { name: "Joaquín P.", from: { en: "Mexico City · 5 nights", es: "CDMX · 5 noches" }, body: { en: "Coffee on the patio at 6:30am, fog still in the canyon, no traffic for an hour. Worth every peso.", es: "Café en el patio a las 6:30 am, neblina aún en el cañón, sin tráfico por una hora. Vale cada peso." }, rating: 5 },
  ],
};

export function getStayDetail(id: string): StayDetailData {
  return STAY_DETAIL[id] || STAY_DETAIL_DEFAULT;
}

export const STAY_COPY = {
  en: {
    back: "All stays",
    overview: "Overview",
    rooms_h: "The home",
    amen_h: "Amenities",
    host_h: "Your hosts",
    host_since: "Hosting since",
    host_lang: "Speaks",
    rev_h: "Recent stays",
    sim_h: "Other homes you might like",
    map_h: "The neighborhood",
    map_body: "Five minutes by dirt road from the main valley artery (Carretera 3). Twelve wineries within bicycle distance; six within walking distance after lunch.",
    map_legend: "Walking · 15 min radius",
    book_h: "Reserve this home",
    book_check_in: "Check in",
    book_check_out: "Check out",
    book_guests: "Guests",
    book_nights: "nights",
    book_subtotal: "Subtotal",
    book_clean: "Cleaning",
    book_steward: "Steward fee",
    book_total: "Total",
    book_cta: "Request these dates",
    book_note: "We confirm by hand within four hours. No charge until we approve.",
    sleeps_n: "Sleeps",
    bed_n: "Beds",
    bath_n: "Baths",
    sqft_n: "Sq ft",
    year_n: "Built",
    restored_n: "Restored",
    cal_legend_avail: "Available",
    cal_legend_busy: "Booked",
    cal_legend_min: "2-night minimum",
    rating: "rating",
    reviews_count: "reviews",
    months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
    days: ["S","M","T","W","T","F","S"],
  },
  es: {
    back: "Todas las casas",
    overview: "Resumen",
    rooms_h: "La casa",
    amen_h: "Amenidades",
    host_h: "Tus anfitriones",
    host_since: "Recibiendo desde",
    host_lang: "Habla",
    rev_h: "Estancias recientes",
    sim_h: "Otras casas que te pueden gustar",
    map_h: "El vecindario",
    map_body: "A cinco minutos por terracería de la carretera principal (Carretera 3). Doce vinícolas en bicicleta; seis a pie después de comer.",
    map_legend: "Caminando · 15 min",
    book_h: "Reservar esta casa",
    book_check_in: "Llegada",
    book_check_out: "Salida",
    book_guests: "Huéspedes",
    book_nights: "noches",
    book_subtotal: "Subtotal",
    book_clean: "Limpieza",
    book_steward: "Anfitrión",
    book_total: "Total",
    book_cta: "Solicitar estas fechas",
    book_note: "Confirmamos a mano en menos de cuatro horas. No cobramos hasta aprobar.",
    sleeps_n: "Para",
    bed_n: "Camas",
    bath_n: "Baños",
    sqft_n: "Pies²",
    year_n: "Construida",
    restored_n: "Restaurada",
    cal_legend_avail: "Disponible",
    cal_legend_busy: "Reservada",
    cal_legend_min: "Mínimo 2 noches",
    rating: "calificación",
    reviews_count: "reseñas",
    months: ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],
    days: ["D","L","M","M","J","V","S"],
  },
} as const;
