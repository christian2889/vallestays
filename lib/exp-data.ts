import type { Bilingual, Lang } from "./data";

export type ExperienceDetail = {
  palette: [string, string, string];
  shape: string;
  duration: Bilingual;
  party: Bilingual;
  when: Bilingual;
  pickup: Bilingual;
  body: Bilingual;
  schedule: { t: string; en: string; es: string }[];
  includes: [string, string][];
  excludes: [string, string][];
  host: { name: string; role: Bilingual; since: number };
  nightly: number;
  unit: Bilingual;
  times: string[];
};

export const EXP_DETAIL: Record<string, ExperienceDetail> = {
  cellar: {
    palette: ["#8a4a2a", "#e6c8a0", "#2a1814"], shape: "arch",
    duration: { en: "2.5 hours", es: "2.5 horas" },
    party:    { en: "1 — 6 guests", es: "1 — 6 personas" },
    when:     { en: "Tue — Sat · 11am or 4pm", es: "Mar — Sáb · 11am o 4pm" },
    pickup:   { en: "Driver from your home", es: "Chofer desde tu casa" },
    body: {
      en: "Three boutique cellars in one afternoon, with the winemaker in each. We start at Lechuza for whites in the cool of the cave, walk the vineyard at F. Rubio while the Tempranillo is opened, and finish in the dim of Vena Cava with library reds you cannot buy off the shelf.",
      es: "Tres cavas boutique en una tarde, con el enólogo de cada una. Empezamos en Lechuza con blancos en la frescura de la cueva, caminamos el viñedo de F. Rubio mientras se abre el Tempranillo, y cerramos en la penumbra de Vena Cava con tintos de biblioteca que no puedes comprar en estante."
    },
    schedule: [
      { t: "11:00", en: "Pickup at your home, drive to Lechuza", es: "Salida desde tu casa hacia Lechuza" },
      { t: "11:30", en: "Cellar tour & 4 white pours with Ray", es: "Tour de cava y 4 catas de blancos con Ray" },
      { t: "12:30", en: "Walk to F. Rubio. Tempranillo and ranch lunch (small plates)", es: "Caminata a F. Rubio. Tempranillo y comida de rancho (entradas)" },
      { t: "14:00", en: "Drive to Vena Cava. Library reds, mezcal at the end", es: "Trayecto a Vena Cava. Tintos de biblioteca, mezcal al final" },
      { t: "15:30", en: "Driver returns you home (or to your dinner reservation)", es: "El chofer te lleva a casa (o a tu reservación de cena)" },
    ],
    includes: [
      ["Round-trip private driver", "Chofer privado redondo"],
      ["Three winery visits with the winemaker", "Tres visitas con el enólogo"],
      ["12 pours total", "12 catas en total"],
      ["Small ranch lunch at F. Rubio", "Comida pequeña en F. Rubio"],
      ["A bottle of your favorite to take home", "Una botella de tu favorita para llevar"],
    ],
    excludes: [
      ["Tips for the winemakers (we suggest $20 USD each)", "Propinas (sugerimos $20 USD por enólogo)"],
      ["Additional bottles to take home", "Botellas adicionales para llevar"],
    ],
    host: { name: "Diego R.", role: { en: "Host & sommelier", es: "Anfitrión y sommelier" }, since: 2018 },
    nightly: 180, unit: { en: "/ pair", es: "/ pareja" },
    times: ["11:00", "16:00"],
  },
  campestre: {
    palette: ["#5b6b3a", "#d8d2b8", "#1f2418"], shape: "rect",
    duration: { en: "3 hours", es: "3 horas" },
    party:    { en: "2 — 8 guests", es: "2 — 8 personas" },
    when:     { en: "Wed — Sun · 1pm or 7pm", es: "Mié — Dom · 1pm o 7pm" },
    pickup:   { en: "Driver from your home", es: "Chofer desde tu casa" },
    body: {
      en: "A long, slow lunch at one of the valley's open-fire kitchens — Deckman's in a vineyard or Fauna inside the Bruma compound. Twelve seasonal courses cooked over wood, wine pairings from the host's reserve, an end so unhurried you'll forget the time.",
      es: "Una comida larga y sin prisa en una de las cocinas al fuego del valle — Deckman's en el viñedo o Fauna dentro de Bruma. Doce tiempos de temporada cocinados con leña, maridajes de la reserva del anfitrión, un final tan tranquilo que se te olvida la hora."
    },
    schedule: [
      { t: "12:30", en: "Driver picks you up", es: "El chofer pasa por ti" },
      { t: "13:00", en: "Aperitif at the open-fire kitchen", es: "Aperitivo en la cocina al fuego" },
      { t: "13:30", en: "Twelve courses, six pairings", es: "Doce tiempos, seis maridajes" },
      { t: "16:00", en: "Café de olla and ride home", es: "Café de olla y regreso a casa" },
    ],
    includes: [
      ["Driver round-trip", "Chofer redondo"],
      ["Twelve-course tasting menu", "Menú de degustación de doce tiempos"],
      ["Six-glass wine pairing", "Maridaje de seis copas"],
      ["Reservation at peak time (we hold 5 tables/season)", "Reservación en hora prime (apartamos 5 mesas/temporada)"],
    ],
    excludes: [["Additional bottles", "Botellas adicionales"], ["Tip for the kitchen", "Propina para la cocina"]],
    host: { name: "Ana V.", role: { en: "Host & restaurant liaison", es: "Anfitriona" }, since: 2018 },
    nightly: 145, unit: { en: "/ guest", es: "/ persona" },
    times: ["13:00", "19:00"],
  },
  horse: {
    palette: ["#a06b3a", "#e8d4b0", "#2a1814"], shape: "circle-large",
    duration: { en: "2 hours", es: "2 horas" },
    party: { en: "1 — 4 riders", es: "1 — 4 jinetes" },
    when:  { en: "Daily · sunrise (around 6:15am)", es: "Diario · al amanecer (6:15am aprox)" },
    pickup: { en: "Meet at Rancho Los Olivos", es: "Punto de encuentro en Rancho Los Olivos" },
    body: {
      en: "An hour and a half on horseback through the olive groves of Rancho Los Olivos, just as the valley wakes up. The horses are sweet-tempered and well-trained — first-timers are fine. We end with coffee and pan dulce on the veranda.",
      es: "Hora y media a caballo entre los olivos del Rancho Los Olivos, justo cuando despierta el valle. Los caballos son nobles y bien entrenados — los principiantes lo disfrutan. Cerramos con café y pan dulce en el corredor."
    },
    schedule: [
      { t: "5:45",  en: "Arrive at the ranch, meet your horse", es: "Llegada al rancho, conoce tu caballo" },
      { t: "6:15",  en: "Sunrise ride into the olive grove", es: "Cabalgata al amanecer entre olivos" },
      { t: "7:30",  en: "Coffee, pan dulce, fresh oranges", es: "Café, pan dulce, naranjas frescas" },
      { t: "8:00",  en: "Back at your home", es: "De vuelta a tu casa" },
    ],
    includes: [
      ["Two hours with a private guide", "Dos horas con guía privado"],
      ["Helmet and instruction", "Casco e instrucción"],
      ["Light breakfast at the ranch", "Desayuno ligero en el rancho"],
    ],
    excludes: [["Pickup (we can add for $40)", "Transporte (lo agregamos por $40)"]],
    host: { name: "Don Refugio", role: { en: "Rancher & guide", es: "Ranchero y guía" }, since: 1997 },
    nightly: 95, unit: { en: "/ rider", es: "/ jinete" },
    times: ["6:15"],
  },
  oyster: {
    palette: ["#3a5e7e", "#c8d8e0", "#1a2228"], shape: "rect-tall",
    duration: { en: "4 hours including drive", es: "4 horas con traslado" },
    party: { en: "2 — 8 guests", es: "2 — 8 personas" },
    when: { en: "Daily, weather permitting · noon", es: "Diario, según el clima · 12pm" },
    pickup: { en: "Driver from your home", es: "Chofer desde tu casa" },
    body: {
      en: "An afternoon on the oyster rafts of Bahía Falsa, 40 minutes west of the valley. Eat a kilo straight from the water with lime and Valentina, drink a bottle of Chenin we pack for you, return slightly sunburned and very happy.",
      es: "Una tarde en las balsas ostioneras de Bahía Falsa, 40 minutos al oeste del valle. Te comes un kilo directo del agua con limón y Valentina, te tomas una botella de Chenin que empacamos, regresas algo quemado y muy feliz."
    },
    schedule: [
      { t: "11:00", en: "Driver picks you up", es: "El chofer pasa por ti" },
      { t: "11:45", en: "Arrive at the oyster co-op", es: "Llegada a la cooperativa" },
      { t: "12:00", en: "Out on the rafts: 1 kg per person", es: "Salida a las balsas: 1 kg por persona" },
      { t: "14:30", en: "Optional stop at Mercado de Mariscos", es: "Parada opcional en Mercado de Mariscos" },
      { t: "15:30", en: "Back at your home", es: "Regreso a casa" },
    ],
    includes: [
      ["Round-trip driver (40 min each way)", "Chofer redondo (40 min cada lado)"],
      ["1 kg of oysters per guest", "1 kg de ostras por persona"],
      ["Bottle of Chenin Blanc, lime, salt", "Botella de Chenin Blanc, limón, sal"],
    ],
    excludes: [["Additional kilos", "Kilos adicionales"], ["Mercado purchases", "Compras del mercado"]],
    host: { name: "Cooperativa Ramírez", role: { en: "Oyster farmers, third generation", es: "Ostioneros, tercera generación" }, since: 1968 },
    nightly: 120, unit: { en: "/ guest", es: "/ persona" },
    times: ["12:00"],
  },
  temazcal: {
    palette: ["#7a3a3a", "#d4a890", "#2a1410"], shape: "circle",
    duration: { en: "2.5 hours", es: "2.5 horas" },
    party: { en: "2 — 4 guests", es: "2 — 4 personas" },
    when: { en: "Wed, Fri, Sun · sunset", es: "Mié, Vie, Dom · al atardecer" },
    pickup: { en: "At your home", es: "En tu casa" },
    body: {
      en: "A traditional sweat ceremony in a portable temazcal raised in the patio of your home. Doña María Elena guides four rounds of herbs, song and breath. Cold plunge between rounds, atole at the end. Deep, ancient, not for the claustrophobic.",
      es: "Ceremonia tradicional de vapor en un temazcal portátil levantado en el patio de tu casa. Doña María Elena guía cuatro rondas de hierbas, canto y respiración. Inmersión fría entre rondas, atole al cierre. Profundo, antiguo, no apto para claustrofóbicos."
    },
    schedule: [
      { t: "16:00", en: "María arrives, builds the lodge", es: "María llega y arma el temazcal" },
      { t: "17:30", en: "First round — opening", es: "Primera ronda — apertura" },
      { t: "18:30", en: "Three more rounds with breaks", es: "Tres rondas más con pausas" },
      { t: "20:00", en: "Atole, blankets, quiet", es: "Atole, cobijas, silencio" },
    ],
    includes: [
      ["Curandera and assistant", "Curandera y asistente"],
      ["Portable temazcal setup at your home", "Montaje del temazcal en tu casa"],
      ["Herbs, atole, post-ceremony tea", "Hierbas, atole, té de cierre"],
    ],
    excludes: [["Donation to the curandera (we suggest $40)", "Donación a la curandera (sugerimos $40)"]],
    host: { name: "Doña María Elena", role: { en: "Curandera, 30 yrs", es: "Curandera, 30 años" }, since: 1996 },
    nightly: 260, unit: { en: "/ pair", es: "/ pareja" },
    times: ["17:30"],
  },
  balloon: {
    palette: ["#b56a3a", "#e8d4b0", "#2a1814"], shape: "arch-tall",
    duration: { en: "3 hours total · 45 min flight", es: "3 horas en total · 45 min de vuelo" },
    party: { en: "Up to 4 guests per basket", es: "Hasta 4 personas por canasta" },
    when: { en: "Daily, weather permitting · 5:30am", es: "Diario, según el clima · 5:30am" },
    pickup: { en: "Driver from your home", es: "Chofer desde tu casa" },
    body: {
      en: "Wake up at 4:45, drive to the launch field in the dark, watch the balloon fill in the headlights of the chase truck. Forty-five minutes of silence over the vineyards, then a champagne breakfast in the field where you land.",
      es: "Despertar a las 4:45, llegar al campo de despegue a oscuras, ver el globo inflarse en las luces del camión. Cuarenta y cinco minutos de silencio sobre los viñedos, después desayuno con champaña en el campo donde aterrizas."
    },
    schedule: [
      { t: "4:45", en: "Driver picks you up", es: "El chofer pasa por ti" },
      { t: "5:15", en: "Arrive at launch field", es: "Llegada al campo" },
      { t: "5:45", en: "Lift off", es: "Despegue" },
      { t: "6:30", en: "Land somewhere in the valley", es: "Aterrizaje en algún punto del valle" },
      { t: "7:00", en: "Champagne breakfast in the field", es: "Desayuno con champaña en el campo" },
      { t: "8:00", en: "Driver returns you home", es: "Regreso a casa" },
    ],
    includes: [
      ["Round-trip private driver", "Chofer privado redondo"],
      ["45-minute flight, certified pilot", "Vuelo de 45 min, piloto certificado"],
      ["Champagne breakfast on landing", "Desayuno con champaña al aterrizar"],
      ["Flight certificate", "Certificado de vuelo"],
    ],
    excludes: [["Tip for the pilot", "Propina para el piloto"]],
    host: { name: "Capt. Eliseo", role: { en: "Pilot, 1,200+ flights", es: "Piloto, 1,200+ vuelos" }, since: 2009 },
    nightly: 310, unit: { en: "/ pair", es: "/ pareja" },
    times: ["5:30"],
  },
};

export const EXP_COPY = {
  en: {
    back: "All experiences",
    overview: "Overview",
    schedule_h: "How the day goes",
    includes_h: "What's included",
    excludes_h: "Not included",
    host_h: "Hosted by",
    book_h: "Book this experience",
    book_when: "Date",
    book_time: "Time",
    book_party: "Party",
    book_total: "Total",
    book_cta: "Request this experience",
    book_note: "We confirm by hand within four hours. No charge until we approve.",
    book_subtotal: "Subtotal",
    book_steward: "Steward fee",
    sim_h: "Other afternoons in the valley",
    facts: ["Duration", "Party", "When", "Pickup"],
    months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    days: ["S","M","T","W","T","F","S"],
  },
  es: {
    back: "Todas las experiencias",
    overview: "Resumen",
    schedule_h: "Cómo va el día",
    includes_h: "Qué incluye",
    excludes_h: "No incluye",
    host_h: "Anfitrión",
    book_h: "Reservar esta experiencia",
    book_when: "Fecha",
    book_time: "Hora",
    book_party: "Personas",
    book_total: "Total",
    book_cta: "Solicitar esta experiencia",
    book_note: "Confirmamos a mano en menos de cuatro horas. No cobramos hasta aprobar.",
    book_subtotal: "Subtotal",
    book_steward: "Anfitrión",
    sim_h: "Otras tardes en el valle",
    facts: ["Duración", "Personas", "Cuándo", "Traslado"],
    months: ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"],
    days: ["D","L","M","M","J","V","S"],
  },
} as const;
