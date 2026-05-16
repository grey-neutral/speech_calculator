const transcriptEl = document.querySelector("#transcript");
const expressionEl = document.querySelector("#expression");
const resultEl = document.querySelector("#result");
const micButton = document.querySelector("#mic-button");
const recordingStateEl = document.querySelector("#recording-state");
const hintEl = document.querySelector("#hint");
const supportStatusEl = document.querySelector("#support-status");
const currentLineEl = document.querySelector("#current-line");
const lastLineEl = document.querySelector("#last-line");
const historyListEl = document.querySelector("#history-list");
const numbersDetectedEl = document.querySelector("#numbers-detected");
const precisionScoreEl = document.querySelector("#precision-score");
const templateButtons = document.querySelectorAll("[data-template]");
const getStartedButton = document.querySelector("#get-started-button");
const calculatorDashboard = document.querySelector("#calculator-dashboard");
const languageButton = document.querySelector("#language-button");
const languageMenu = document.querySelector("#language-menu");
const selectedLanguageLabel = document.querySelector("#selected-language-label");
const languageOptionButtons = document.querySelectorAll("[data-language]");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition || null;

let recognition = null;
let recording = false;
let recognitionActive = false;
let finalTranscript = "";
let restartTimer = null;
let currentTranscript = "";
let lastCommittedExpression = "";
let visibleCalculationOk = false;
let visibleNumberCount = 0;
const historyItems = [];

const brandHeroCopy = {
  eyebrow: "Next-gen calculation",
  titleLead: "Math at the",
  titleAccent: "Speed of Sound",
};

const uiCopy = {
  en: {
    documentTitle: "Speech Calc Pro",
    ...brandHeroCopy,
    subtitle:
      "Experience the weightless intelligence of Voice-to-Math. Speech Calc Pro translates complex speech into precise equations with effortless clarity.",
    getStarted: "Get Started",
    chooseLanguage: "Choose dictation language",
    languageMenu: "Dictation language",
    dashboardAria: "Speech calculator dashboard",
    panelLabel: "Ready to calculate",
    ready: "Ready",
    checkingMic: "Checking mic",
    voiceReady: "Voice ready · {lang}",
    textMode: "Text mode · {lang}",
    recordingStatus: "Recording · {lang}",
    recordAria: "Record voice calculation",
    startAria: "Start voice calculation",
    stopAria: "Stop voice calculation",
    readyListen: "Ready to listen",
    recordingUntilStopped: "Recording until stopped",
    stillListening: "Still listening",
    micPaused: "Mic paused",
    speechPaused: "Speech recognition paused. Tap the mic to retry.",
    voiceUnavailable: "Voice input unavailable",
    unsupportedSpeech: "Your browser does not expose Speech Recognition.",
    micPermission: "Microphone permission is required for voice input.",
    speechStopped: "Speech recognition stopped. Try again.",
    listening: "Listening...",
    listeningShort: "Listening",
    speakCalculation: "Speak a calculation",
    pauseHint: "Pause whenever you need. Tap again to stop.",
    typeOrSpeak: "Type or speak a calculation.",
    sayCalculation:
      "Say a calculation with plus, minus, times, divide, powers, or roots.",
    noActive: "No active calculation",
    noPrevious: "No previous result",
    liveResults: "Live Results",
    current: "Current",
    lastResult: "Last Result",
    recentCalculations: "Recent calculations",
    quickTemplates: "Quick Templates",
    manualAria: "Manual calculator entry",
    manualInputAria: "Type a calculation",
    calculate: "Calculate",
    numbersDetected: "Numbers detected",
    recognitionState: "Recognition state",
    possibilities: "Possibilities",
    footer: "© 2026 Built for focus.",
    readyState: "Ready",
    liveState: "Live",
    numberHintSingular: "{count} number detected",
    numberHintPlural: "{count} numbers detected",
    templateLabels: {
      sum: "Sum",
      subtract: "Subtract",
      multiply: "Multiply",
      divide: "Divide",
      root: "Root",
      power: "Power",
      percent: "Percent",
      factorial: "Factorial",
    },
  },
  es: {
    documentTitle: "Speech Calc Pro",
    ...brandHeroCopy,
    subtitle:
      "Experimenta la inteligencia ligera de voz a matemáticas. Speech Calc Pro traduce habla compleja en ecuaciones precisas con claridad.",
    getStarted: "Comenzar",
    chooseLanguage: "Elegir idioma de dictado",
    languageMenu: "Idioma de dictado",
    dashboardAria: "Panel de calculadora por voz",
    panelLabel: "Listo para calcular",
    ready: "Listo",
    checkingMic: "Comprobando micrófono",
    voiceReady: "Voz lista · {lang}",
    textMode: "Modo texto · {lang}",
    recordingStatus: "Grabando · {lang}",
    recordAria: "Grabar cálculo por voz",
    startAria: "Iniciar cálculo por voz",
    stopAria: "Detener cálculo por voz",
    readyListen: "Listo para escuchar",
    recordingUntilStopped: "Grabando hasta que lo detengas",
    stillListening: "Sigo escuchando",
    micPaused: "Micrófono en pausa",
    speechPaused: "El reconocimiento se pausó. Toca el micrófono para reintentar.",
    voiceUnavailable: "Entrada de voz no disponible",
    unsupportedSpeech: "Tu navegador no ofrece reconocimiento de voz.",
    micPermission: "Se necesita permiso del micrófono para usar la voz.",
    speechStopped: "El reconocimiento de voz se detuvo. Inténtalo de nuevo.",
    listening: "Escuchando...",
    listeningShort: "Escuchando",
    speakCalculation: "Di un cálculo",
    pauseHint: "Pausa cuando quieras. Toca otra vez para detener.",
    typeOrSpeak: "Escribe o dicta un cálculo.",
    sayCalculation:
      "Di un cálculo con más, menos, por, dividir, potencias o raíces.",
    noActive: "Sin cálculo activo",
    noPrevious: "Sin resultado anterior",
    liveResults: "Resultados en vivo",
    current: "Actual",
    lastResult: "Último resultado",
    recentCalculations: "Cálculos recientes",
    quickTemplates: "Plantillas rápidas",
    manualAria: "Entrada manual de calculadora",
    manualInputAria: "Escribe un cálculo",
    calculate: "Calcular",
    numbersDetected: "Números detectados",
    recognitionState: "Estado de reconocimiento",
    possibilities: "Posibilidades",
    footer: "© 2026 Diseñado para enfocarte.",
    readyState: "Listo",
    liveState: "En vivo",
    numberHintSingular: "{count} número detectado",
    numberHintPlural: "{count} números detectados",
    templateLabels: {
      sum: "Suma",
      subtract: "Resta",
      multiply: "Multiplica",
      divide: "Divide",
      root: "Raíz",
      power: "Potencia",
      percent: "Porcentaje",
      factorial: "Factorial",
    },
  },
  fr: {
    documentTitle: "Speech Calc Pro",
    ...brandHeroCopy,
    subtitle:
      "Découvrez l’intelligence légère de la voix vers les maths. Speech Calc Pro transforme une parole complexe en équations précises avec clarté.",
    getStarted: "Commencer",
    chooseLanguage: "Choisir la langue de dictée",
    languageMenu: "Langue de dictée",
    dashboardAria: "Tableau de bord de la calculatrice vocale",
    panelLabel: "Prêt à calculer",
    ready: "Prêt",
    checkingMic: "Vérification du micro",
    voiceReady: "Voix prête · {lang}",
    textMode: "Mode texte · {lang}",
    recordingStatus: "Enregistrement · {lang}",
    recordAria: "Enregistrer un calcul vocal",
    startAria: "Démarrer le calcul vocal",
    stopAria: "Arrêter le calcul vocal",
    readyListen: "Prêt à écouter",
    recordingUntilStopped: "Enregistrement jusqu’à l’arrêt",
    stillListening: "Toujours à l’écoute",
    micPaused: "Micro en pause",
    speechPaused: "La reconnaissance vocale est en pause. Touchez le micro pour réessayer.",
    voiceUnavailable: "Entrée vocale indisponible",
    unsupportedSpeech: "Votre navigateur n’expose pas la reconnaissance vocale.",
    micPermission: "L’autorisation du micro est requise pour l’entrée vocale.",
    speechStopped: "La reconnaissance vocale s’est arrêtée. Réessayez.",
    listening: "Écoute...",
    listeningShort: "Écoute",
    speakCalculation: "Dictez un calcul",
    pauseHint: "Faites une pause quand vous voulez. Touchez encore pour arrêter.",
    typeOrSpeak: "Saisissez ou dictez un calcul.",
    sayCalculation:
      "Dictez un calcul avec plus, moins, fois, diviser, puissances ou racines.",
    noActive: "Aucun calcul actif",
    noPrevious: "Aucun résultat précédent",
    liveResults: "Résultats en direct",
    current: "Actuel",
    lastResult: "Dernier résultat",
    recentCalculations: "Calculs récents",
    quickTemplates: "Modèles rapides",
    manualAria: "Saisie manuelle de la calculatrice",
    manualInputAria: "Saisir un calcul",
    calculate: "Calculer",
    numbersDetected: "Nombres détectés",
    recognitionState: "État de reconnaissance",
    possibilities: "Possibilités",
    footer: "© 2026 Conçu pour la concentration.",
    readyState: "Prêt",
    liveState: "Direct",
    numberHintSingular: "{count} nombre détecté",
    numberHintPlural: "{count} nombres détectés",
    templateLabels: {
      sum: "Somme",
      subtract: "Soustraire",
      multiply: "Multiplier",
      divide: "Diviser",
      root: "Racine",
      power: "Puissance",
      percent: "Pourcentage",
      factorial: "Factorielle",
    },
  },
  de: {
    documentTitle: "Speech Calc Pro",
    ...brandHeroCopy,
    subtitle:
      "Erlebe die leichte Intelligenz von Voice-to-Math. Speech Calc Pro verwandelt komplexe Sprache mühelos in präzise Gleichungen.",
    getStarted: "Loslegen",
    chooseLanguage: "Diktatsprache wählen",
    languageMenu: "Diktatsprache",
    dashboardAria: "Dashboard des Sprachrechners",
    panelLabel: "Bereit zum Rechnen",
    ready: "Bereit",
    checkingMic: "Mikrofon wird geprüft",
    voiceReady: "Sprache bereit · {lang}",
    textMode: "Textmodus · {lang}",
    recordingStatus: "Aufnahme · {lang}",
    recordAria: "Sprachrechnung aufnehmen",
    startAria: "Sprachrechnung starten",
    stopAria: "Sprachrechnung stoppen",
    readyListen: "Bereit zuzuhören",
    recordingUntilStopped: "Aufnahme bis zum Stoppen",
    stillListening: "Höre weiter zu",
    micPaused: "Mikrofon pausiert",
    speechPaused: "Spracherkennung pausiert. Tippe auf das Mikrofon, um es erneut zu versuchen.",
    voiceUnavailable: "Spracheingabe nicht verfügbar",
    unsupportedSpeech: "Dein Browser stellt keine Spracherkennung bereit.",
    micPermission: "Für die Spracheingabe ist Mikrofonzugriff erforderlich.",
    speechStopped: "Die Spracherkennung wurde gestoppt. Versuche es erneut.",
    listening: "Hört zu...",
    listeningShort: "Hört zu",
    speakCalculation: "Sag eine Rechnung",
    pauseHint: "Pausiere jederzeit. Tippe erneut, um zu stoppen.",
    typeOrSpeak: "Gib eine Rechnung ein oder sprich sie.",
    sayCalculation:
      "Sag eine Rechnung mit plus, minus, mal, geteilt, Potenzen oder Wurzeln.",
    noActive: "Keine aktive Rechnung",
    noPrevious: "Kein vorheriges Ergebnis",
    liveResults: "Live-Ergebnisse",
    current: "Aktuell",
    lastResult: "Letztes Ergebnis",
    recentCalculations: "Letzte Rechnungen",
    quickTemplates: "Schnellvorlagen",
    manualAria: "Manuelle Rechnereingabe",
    manualInputAria: "Rechnung eingeben",
    calculate: "Berechnen",
    numbersDetected: "Zahlen erkannt",
    recognitionState: "Erkennungsstatus",
    possibilities: "Möglichkeiten",
    footer: "© 2026 Gebaut für Fokus.",
    readyState: "Bereit",
    liveState: "Live",
    numberHintSingular: "{count} Zahl erkannt",
    numberHintPlural: "{count} Zahlen erkannt",
    templateLabels: {
      sum: "Summe",
      subtract: "Subtrahieren",
      multiply: "Multiplizieren",
      divide: "Dividieren",
      root: "Wurzel",
      power: "Potenz",
      percent: "Prozent",
      factorial: "Fakultät",
    },
  },
  it: {
    documentTitle: "Speech Calc Pro",
    ...brandHeroCopy,
    subtitle:
      "Scopri l’intelligenza leggera di Voice-to-Math. Speech Calc Pro traduce parlato complesso in equazioni precise con chiarezza.",
    getStarted: "Inizia",
    chooseLanguage: "Scegli lingua di dettatura",
    languageMenu: "Lingua di dettatura",
    dashboardAria: "Dashboard della calcolatrice vocale",
    panelLabel: "Pronto a calcolare",
    ready: "Pronto",
    checkingMic: "Controllo microfono",
    voiceReady: "Voce pronta · {lang}",
    textMode: "Modalità testo · {lang}",
    recordingStatus: "Registrazione · {lang}",
    recordAria: "Registra calcolo vocale",
    startAria: "Avvia calcolo vocale",
    stopAria: "Ferma calcolo vocale",
    readyListen: "Pronto ad ascoltare",
    recordingUntilStopped: "Registrazione finché non la fermi",
    stillListening: "Sto ancora ascoltando",
    micPaused: "Microfono in pausa",
    speechPaused: "Il riconoscimento vocale è in pausa. Tocca il microfono per riprovare.",
    voiceUnavailable: "Input vocale non disponibile",
    unsupportedSpeech: "Il tuo browser non espone il riconoscimento vocale.",
    micPermission: "Serve il permesso del microfono per l’input vocale.",
    speechStopped: "Il riconoscimento vocale si è fermato. Riprova.",
    listening: "Ascolto...",
    listeningShort: "Ascolto",
    speakCalculation: "Pronuncia un calcolo",
    pauseHint: "Fai una pausa quando vuoi. Tocca di nuovo per fermare.",
    typeOrSpeak: "Scrivi o pronuncia un calcolo.",
    sayCalculation:
      "Pronuncia un calcolo con più, meno, per, diviso, potenze o radici.",
    noActive: "Nessun calcolo attivo",
    noPrevious: "Nessun risultato precedente",
    liveResults: "Risultati in tempo reale",
    current: "Attuale",
    lastResult: "Ultimo risultato",
    recentCalculations: "Calcoli recenti",
    quickTemplates: "Modelli rapidi",
    manualAria: "Inserimento manuale della calcolatrice",
    manualInputAria: "Scrivi un calcolo",
    calculate: "Calcola",
    numbersDetected: "Numeri rilevati",
    recognitionState: "Stato del riconoscimento",
    possibilities: "Possibilità",
    footer: "© 2026 Creato per la concentrazione.",
    readyState: "Pronto",
    liveState: "Live",
    numberHintSingular: "{count} numero rilevato",
    numberHintPlural: "{count} numeri rilevati",
    templateLabels: {
      sum: "Somma",
      subtract: "Sottrai",
      multiply: "Moltiplica",
      divide: "Dividi",
      root: "Radice",
      power: "Potenza",
      percent: "Percento",
      factorial: "Fattoriale",
    },
  },
  pt: {
    documentTitle: "Speech Calc Pro",
    ...brandHeroCopy,
    subtitle:
      "Experimente a inteligência leve de voz para matemática. O Speech Calc Pro traduz fala complexa em equações precisas com clareza.",
    getStarted: "Começar",
    chooseLanguage: "Escolher idioma de ditado",
    languageMenu: "Idioma de ditado",
    dashboardAria: "Painel da calculadora por voz",
    panelLabel: "Pronto para calcular",
    ready: "Pronto",
    checkingMic: "A verificar microfone",
    voiceReady: "Voz pronta · {lang}",
    textMode: "Modo texto · {lang}",
    recordingStatus: "A gravar · {lang}",
    recordAria: "Gravar cálculo por voz",
    startAria: "Iniciar cálculo por voz",
    stopAria: "Parar cálculo por voz",
    readyListen: "Pronto para ouvir",
    recordingUntilStopped: "A gravar até parar",
    stillListening: "Ainda a ouvir",
    micPaused: "Microfone em pausa",
    speechPaused: "O reconhecimento de voz ficou em pausa. Toque no microfone para tentar novamente.",
    voiceUnavailable: "Entrada de voz indisponível",
    unsupportedSpeech: "O seu navegador não expõe reconhecimento de voz.",
    micPermission: "É necessária permissão do microfone para entrada de voz.",
    speechStopped: "O reconhecimento de voz parou. Tente novamente.",
    listening: "A ouvir...",
    listeningShort: "A ouvir",
    speakCalculation: "Diga um cálculo",
    pauseHint: "Faça pausas quando precisar. Toque de novo para parar.",
    typeOrSpeak: "Digite ou dite um cálculo.",
    sayCalculation:
      "Diga um cálculo com mais, menos, vezes, dividir, potências ou raízes.",
    noActive: "Sem cálculo ativo",
    noPrevious: "Sem resultado anterior",
    liveResults: "Resultados ao vivo",
    current: "Atual",
    lastResult: "Último resultado",
    recentCalculations: "Cálculos recentes",
    quickTemplates: "Modelos rápidos",
    manualAria: "Entrada manual da calculadora",
    manualInputAria: "Digite um cálculo",
    calculate: "Calcular",
    numbersDetected: "Números detetados",
    recognitionState: "Estado do reconhecimento",
    possibilities: "Possibilidades",
    footer: "© 2026 Criado para foco.",
    readyState: "Pronto",
    liveState: "Ao vivo",
    numberHintSingular: "{count} número detetado",
    numberHintPlural: "{count} números detetados",
    templateLabels: {
      sum: "Soma",
      subtract: "Subtrair",
      multiply: "Multiplicar",
      divide: "Dividir",
      root: "Raiz",
      power: "Potência",
      percent: "Percentagem",
      factorial: "Fatorial",
    },
  },
};

const languageProfiles = [
  {
    code: "en-US",
    htmlLang: "en",
    label: "English",
    flag: "🇺🇸",
    short: "EN",
    ui: uiCopy.en,
    transcript: "Tap record and say “subtract three from five hundred”.",
    hint: "Try “500 minus 3”, “42 times 12”, or “square root of 144”.",
    placeholder: "Type a calculation, e.g. subtract 3 from 500",
    templates: {
      sum: "12 plus 8 plus 30",
      subtract: "subtract 3 from 500",
      multiply: "42 times 12",
      divide: "144 divided by 12",
      root: "square root of 144",
      power: "2 to the power of 8",
      percent: "20 percent of 150",
      factorial: "5 factorial",
    },
  },
  {
    code: "es-ES",
    htmlLang: "es",
    label: "Español",
    flag: "🇪🇸",
    short: "ES",
    ui: uiCopy.es,
    transcript: "Pulsa grabar y di “resta tres de quinientos”.",
    hint: "Prueba “500 menos 3”, “42 por 12” o “raíz cuadrada de 144”.",
    placeholder: "Escribe un cálculo, p. ej. resta 3 de 500",
    templates: {
      sum: "12 más 8 más 30",
      subtract: "resta 3 de 500",
      multiply: "42 por 12",
      divide: "144 dividido por 12",
      root: "raíz cuadrada de 144",
      power: "2 elevado a 8",
      percent: "20 por ciento de 150",
      factorial: "5 factorial",
    },
  },
  {
    code: "fr-FR",
    htmlLang: "fr",
    label: "Français",
    flag: "🇫🇷",
    short: "FR",
    ui: uiCopy.fr,
    transcript: "Appuyez sur enregistrer et dites « soustraire trois de cinq cents ».",
    hint: "Essayez « 500 moins 3 », « 42 fois 12 » ou « racine carrée de 144 ».",
    placeholder: "Saisissez un calcul, p. ex. soustraire 3 de 500",
    templates: {
      sum: "12 plus 8 plus 30",
      subtract: "soustraire 3 de 500",
      multiply: "42 fois 12",
      divide: "144 divisé par 12",
      root: "racine carrée de 144",
      power: "2 puissance 8",
      percent: "20 pour cent de 150",
      factorial: "5 factorielle",
    },
  },
  {
    code: "de-DE",
    htmlLang: "de",
    label: "Deutsch",
    flag: "🇩🇪",
    short: "DE",
    ui: uiCopy.de,
    transcript: "Tippe auf Aufnahme und sage „subtrahiere drei von fünfhundert”.",
    hint: "Probiere „500 minus 3”, „42 mal 12” oder „Wurzel aus 144”.",
    placeholder: "Rechnung eingeben, z. B. subtrahiere 3 von 500",
    templates: {
      sum: "12 plus 8 plus 30",
      subtract: "subtrahiere 3 von 500",
      multiply: "42 mal 12",
      divide: "144 geteilt durch 12",
      root: "Wurzel aus 144",
      power: "2 hoch 8",
      percent: "20 Prozent von 150",
      factorial: "5 Fakultät",
    },
  },
  {
    code: "it-IT",
    htmlLang: "it",
    label: "Italiano",
    flag: "🇮🇹",
    short: "IT",
    ui: uiCopy.it,
    transcript: "Premi registra e di’ “sottrai tre da cinquecento”.",
    hint: "Prova “500 meno 3”, “42 per 12” o “radice quadrata di 144”.",
    placeholder: "Scrivi un calcolo, es. sottrai 3 da 500",
    templates: {
      sum: "12 più 8 più 30",
      subtract: "sottrai 3 da 500",
      multiply: "42 per 12",
      divide: "144 diviso per 12",
      root: "radice quadrata di 144",
      power: "2 alla potenza di 8",
      percent: "20 percento di 150",
      factorial: "5 fattoriale",
    },
  },
  {
    code: "pt-PT",
    htmlLang: "pt",
    label: "Português",
    flag: "🇵🇹",
    short: "PT",
    ui: uiCopy.pt,
    transcript: "Toque em gravar e diga “subtrair três de quinhentos”.",
    hint: "Experimente “500 menos 3”, “42 vezes 12” ou “raiz quadrada de 144”.",
    placeholder: "Digite um cálculo, ex. subtrair 3 de 500",
    templates: {
      sum: "12 mais 8 mais 30",
      subtract: "subtrair 3 de 500",
      multiply: "42 vezes 12",
      divide: "144 dividido por 12",
      root: "raiz quadrada de 144",
      power: "2 elevado a 8",
      percent: "20 por cento de 150",
      factorial: "5 fatorial",
    },
  },
];

let currentLanguage = languageProfiles[0];

const ignoredWords = new Set([
  "aura",
  "what",
  "is",
  "the",
  "answer",
  "calculate",
  "calculator",
  "total",
  "equals",
  "equal",
  "please",
  "to",
  "me",
  "give",
  "tell",
  "up",
  "if",
  "i",
  "want",
  "wanna",
  "would",
  "could",
  "can",
  "you",
  "find",
  "compute",
  "solve",
  "result",
  "be",
  "does",
  "that",
  "its",
  "it's",
  "uh",
  "um",
  "er",
  "ah",
  "hmm",
  "like",
  "actually",
]);

const ones = {
  a: 1,
  an: 1,
  zero: 0,
  oh: 0,
  o: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  for: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  ate: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
};

const tens = {
  twenty: 20,
  thirty: 30,
  forty: 40,
  fourty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
};

const scales = {
  hundred: 100,
  thousand: 1000,
  million: 1000000,
  billion: 1000000000,
};

const numberWordSet = new Set([
  ...Object.keys(ones),
  ...Object.keys(tens),
  ...Object.keys(scales),
  "point",
  "dot",
  "negative",
]);

const subtractWords = new Set([
  "subtract",
  "subtracting",
  "subtracted",
  "minus",
  "deduct",
  "deducted",
  "remove",
  "take",
]);

const tokenAliases = {
  // Connectors and filler shared across supported languages.
  y: "and",
  e: "and",
  et: "and",
  und: "and",
  de: "of",
  del: "of",
  du: "of",
  des: "of",
  di: "of",
  do: "of",
  das: "of",
  von: "of",
  desde: "from",
  da: "from",
  aus: "of",
  par: "by",
  entre: "by",
  durch: "by",
  negativo: "negative",
  negatif: "negative",
  negativ: "negative",
  negativo: "negative",
  coma: "point",
  virgule: "point",
  komma: "point",
  virgola: "point",
  virgula: "point",
  punto: "point",
  komma: "point",

  // Spanish.
  cero: "zero",
  uno: "one",
  una: "one",
  un: "one",
  dos: "two",
  tres: "three",
  cuatro: "four",
  cinco: "five",
  seis: "six",
  siete: "seven",
  ocho: "eight",
  nueve: "nine",
  diez: "ten",
  once: "eleven",
  doce: "twelve",
  trece: "thirteen",
  catorce: "fourteen",
  quince: "fifteen",
  dieciseis: "sixteen",
  diecisiete: "seventeen",
  dieciocho: "eighteen",
  diecinueve: "nineteen",
  veinte: "twenty",
  treinta: "thirty",
  cuarenta: "forty",
  cincuenta: "fifty",
  sesenta: "sixty",
  setenta: "seventy",
  ochenta: "eighty",
  noventa: "ninety",
  cien: "hundred",
  ciento: "hundred",
  quinientos: "500",
  mil: "thousand",
  millon: "million",
  millones: "million",
  mas: "plus",
  menos: "minus",
  por: "times",
  veces: "times",
  multiplicar: "multiply",
  multiplicado: "multiplied",
  dividir: "divide",
  dividido: "divided",
  raiz: "root",
  cuadrada: "",
  cuadrado: "squared",
  potencia: "power",
  elevado: "raised",
  porcentaje: "percent",
  resta: "subtract",
  restar: "subtract",
  restale: "subtract",

  // French.
  zero: "zero",
  une: "one",
  deux: "two",
  trois: "three",
  quatre: "four",
  cinq: "five",
  sept: "seven",
  huit: "eight",
  neuf: "nine",
  dix: "ten",
  onze: "eleven",
  douze: "twelve",
  treize: "thirteen",
  quatorze: "fourteen",
  quinze: "fifteen",
  seize: "sixteen",
  dixsept: "seventeen",
  dixhuit: "eighteen",
  dixneuf: "nineteen",
  vingt: "twenty",
  trente: "thirty",
  quarante: "forty",
  cinquante: "fifty",
  soixante: "sixty",
  cent: "hundred",
  mille: "thousand",
  moins: "minus",
  fois: "times",
  multiplie: "multiplied",
  multiplier: "multiply",
  divise: "divided",
  diviser: "divide",
  racine: "root",
  carree: "",
  carre: "squared",
  puissance: "power",
  pourcentage: "percent",
  pourcent: "percent",
  soustraire: "subtract",
  soustrais: "subtract",

  // German.
  null: "zero",
  eins: "one",
  ein: "one",
  eine: "one",
  einen: "one",
  zwei: "two",
  drei: "three",
  vier: "four",
  funf: "five",
  fuenf: "five",
  sechs: "six",
  sieben: "seven",
  acht: "eight",
  neun: "nine",
  zehn: "ten",
  elf: "eleven",
  zwolf: "twelve",
  zwoelf: "twelve",
  dreizehn: "thirteen",
  vierzehn: "fourteen",
  funfzehn: "fifteen",
  fuenfzehn: "fifteen",
  sechzehn: "sixteen",
  siebzehn: "seventeen",
  achtzehn: "eighteen",
  neunzehn: "nineteen",
  zwanzig: "twenty",
  dreissig: "thirty",
  vierzig: "forty",
  funfzig: "fifty",
  fuenfzig: "fifty",
  sechzig: "sixty",
  siebzig: "seventy",
  achtzig: "eighty",
  neunzig: "ninety",
  hundert: "hundred",
  tausend: "thousand",
  mal: "times",
  multipliziert: "multiplied",
  geteilt: "divided",
  teilen: "divide",
  wurzel: "root",
  quadratwurzel: "root",
  hoch: "power",
  prozent: "percent",
  subtrahiere: "subtract",
  subtrahieren: "subtract",
  ziehe: "subtract",
  ab: "",
  fakultat: "factorial",

  // Italian.
  uno: "one",
  due: "two",
  tre: "three",
  quattro: "four",
  cinque: "five",
  sei: "six",
  sette: "seven",
  otto: "eight",
  nove: "nine",
  dieci: "ten",
  undici: "eleven",
  dodici: "twelve",
  tredici: "thirteen",
  quattordici: "fourteen",
  quindici: "fifteen",
  sedici: "sixteen",
  diciassette: "seventeen",
  diciotto: "eighteen",
  diciannove: "nineteen",
  venti: "twenty",
  trenta: "thirty",
  quaranta: "forty",
  cinquanta: "fifty",
  sessanta: "sixty",
  settanta: "seventy",
  ottanta: "eighty",
  novanta: "ninety",
  cento: "hundred",
  milione: "million",
  milioni: "million",
  piu: "plus",
  meno: "minus",
  per: "times",
  volte: "times",
  moltiplicare: "multiply",
  moltiplicato: "multiplied",
  diviso: "divided",
  dividere: "divide",
  radice: "root",
  quadrata: "",
  quadrato: "squared",
  percento: "percent",
  percentuale: "percent",
  sottrai: "subtract",
  sottrarre: "subtract",
  fattoriale: "factorial",

  // Portuguese.
  um: "one",
  uma: "one",
  dois: "two",
  duas: "two",
  quatro: "four",
  sete: "seven",
  oito: "eight",
  dez: "ten",
  doze: "twelve",
  treze: "thirteen",
  quatorze: "fourteen",
  catorze: "fourteen",
  dezesseis: "sixteen",
  dezasseis: "sixteen",
  dezessete: "seventeen",
  dezassete: "seventeen",
  dezoito: "eighteen",
  dezenove: "nineteen",
  dezanove: "nineteen",
  vinte: "twenty",
  trinta: "thirty",
  quarenta: "forty",
  cinquenta: "fifty",
  sessenta: "sixty",
  setenta: "seventy",
  oitenta: "eighty",
  noventa: "ninety",
  cem: "hundred",
  milhao: "million",
  milhoes: "million",
  mais: "plus",
  porcentagem: "percent",
  porcento: "percent",
  subtrair: "subtract",
  fatorial: "factorial",
};

function prepareRawTokens(input) {
  const cleaned = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/\bpor ciento\b/g, " percent ")
    .replace(/\bpor cento\b/g, " percent ")
    .replace(/\bpour cent\b/g, " percent ")
    .replace(/\bper cento\b/g, " percent ")
    .replace(/\bdividido por\b/g, " divided by ")
    .replace(/\bdividido entre\b/g, " divided by ")
    .replace(/\bdivise par\b/g, " divided by ")
    .replace(/\bdiviso per\b/g, " divided by ")
    .replace(/\bgeteilt durch\b/g, " divided by ")
    .replace(/\braiz cuadrada\b/g, " square root ")
    .replace(/\braiz quadrada\b/g, " square root ")
    .replace(/\bracine carree\b/g, " square root ")
    .replace(/\bradice quadrata\b/g, " square root ")
    .replace(/\bquadratwurzel\b/g, " square root ")
    .replace(/\belevado a la potencia de\b/g, " to the power of ")
    .replace(/\ba la potencia de\b/g, " to the power of ")
    .replace(/\balla potenza di\b/g, " to the power of ")
    .replace(/\belevado a\b/g, " raised to ")
    .replace(/[×✕]/g, " * ")
    .replace(/[÷]/g, " / ")
    .replace(/[√]/g, " sqrt ")
    .replace(/[–—]/g, " - ")
    .replace(/(\d),(\d)/g, "$1$2")
    .replace(/([()+\-*/^%!])/g, " $1 ")
    .replace(/[,?;:"“”]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned
    ? cleaned
        .split(" ")
        .map((token) => tokenAliases[token] ?? token)
        .filter(Boolean)
    : [];
}

function isNumericToken(token) {
  return /^[+-]?\d+(\.\d+)?$/.test(token);
}

function isNumberWord(token) {
  return numberWordSet.has(token);
}

function isValueToken(token) {
  return (
    token?.type === "number" ||
    token?.value === ")" ||
    token?.type === "postfix"
  );
}

function parseNumberPhrase(tokens, startIndex) {
  let total = 0;
  let current = 0;
  let decimal = "";
  let inDecimal = false;
  let isNegative = false;
  let consumed = false;
  let usedMagnitude = false;
  let index = startIndex;

  if (tokens[index] === "negative") {
    isNegative = true;
    index += 1;
  }

  while (index < tokens.length) {
    const word = tokens[index];

    if ((word === "point" || word === "dot") && consumed) {
      inDecimal = true;
      index += 1;
      continue;
    }

    if (inDecimal) {
      if (word in ones && ones[word] < 10) {
        decimal += String(ones[word]);
        index += 1;
        continue;
      }

      if (/^\d+$/.test(word)) {
        decimal += word;
        index += 1;
        continue;
      }

      break;
    }

    if (word in ones) {
      current += ones[word];
      consumed = true;
      index += 1;
      continue;
    }

    if (word in tens) {
      current += tens[word];
      consumed = true;
      index += 1;
      continue;
    }

    if (word === "hundred") {
      current = (current || 1) * 100;
      consumed = true;
      usedMagnitude = true;
      index += 1;
      continue;
    }

    if (word === "thousand" || word === "million" || word === "billion") {
      total += (current || 1) * scales[word];
      current = 0;
      consumed = true;
      usedMagnitude = true;
      index += 1;
      continue;
    }

    if (word === "and" && usedMagnitude && isNumberWord(tokens[index + 1])) {
      index += 1;
      continue;
    }

    break;
  }

  if (!consumed) {
    return null;
  }

  const numeric = total + current + (decimal ? Number(`0.${decimal}`) : 0);
  return {
    value: isNegative ? -numeric : numeric,
    nextIndex: index,
  };
}

function rawStartsValue(rawTokens, startIndex) {
  let index = startIndex;

  while (ignoredWords.has(rawTokens[index]) || rawTokens[index] === "of") {
    index += 1;
  }

  const token = rawTokens[index];
  return (
    token === "(" ||
    token === "-" ||
    token === "minus" ||
    token === "sqrt" ||
    token === "root" ||
    token === "square" ||
    token === "cube" ||
    token === "absolute" ||
    token === "abs" ||
    isNumericToken(token) ||
    isNumberWord(token)
  );
}

function collectNumberOperands(rawTokens) {
  const numbers = [];

  for (let index = 0; index < rawTokens.length; index += 1) {
    const token = rawTokens[index];

    if (isNumericToken(token)) {
      numbers.push(Number(token));
      continue;
    }

    const phrase = parseNumberPhrase(rawTokens, index);
    if (phrase) {
      numbers.push(phrase.value);
      index = phrase.nextIndex - 1;
    }
  }

  return numbers;
}

function tokenizeExpression(rawTokens) {
  const tokens = [];
  const numbers = [];

  for (let index = 0; index < rawTokens.length; ) {
    const word = rawTokens[index];
    const previous = tokens[tokens.length - 1];
    const previousIsValue = isValueToken(previous);

    if (ignoredWords.has(word) || word === "by") {
      index += 1;
      continue;
    }

    if (word === "of") {
      if (previous?.type === "postfix" && previous.value === "%") {
        tokens.push({ type: "op", value: "*" });
      }

      index += 1;
      continue;
    }

    if (word === "and") {
      if (previousIsValue && rawStartsValue(rawTokens, index + 1)) {
        tokens.push({ type: "op", value: "+" });
      }

      index += 1;
      continue;
    }

    if (
      (word === "add" || word === "plus") &&
      !previousIsValue &&
      rawStartsValue(rawTokens, index + 1)
    ) {
      index += 1;
      continue;
    }

    if (word === "square" && rawTokens[index + 1] === "root") {
      tokens.push({ type: "func", value: "sqrt" });
      index += rawTokens[index + 2] === "of" ? 3 : 2;
      continue;
    }

    if (word === "cube" && rawTokens[index + 1] === "root") {
      tokens.push({ type: "func", value: "cbrt" });
      index += rawTokens[index + 2] === "of" ? 3 : 2;
      continue;
    }

    if (word === "sqrt" || word === "root") {
      tokens.push({ type: "func", value: "sqrt" });
      index += 1;
      continue;
    }

    if (word === "absolute" || word === "abs") {
      tokens.push({ type: "func", value: "abs" });
      index += rawTokens[index + 1] === "of" ? 2 : 1;
      continue;
    }

    const phrase = parseNumberPhrase(rawTokens, index);
    if (phrase) {
      tokens.push({ type: "number", value: phrase.value });
      numbers.push(phrase.value);
      index = phrase.nextIndex;
      continue;
    }

    if (isNumericToken(word)) {
      const value = Number(word);
      tokens.push({ type: "number", value });
      numbers.push(value);
      index += 1;
      continue;
    }

    if (word === "(" || word === ")") {
      tokens.push({ type: "paren", value: word });
      index += 1;
      continue;
    }

    if (
      word === "to" &&
      rawTokens[index + 1] === "the" &&
      rawTokens[index + 2] === "power"
    ) {
      tokens.push({ type: "op", value: "^" });
      index += rawTokens[index + 3] === "of" ? 4 : 3;
      continue;
    }

    if (word === "raised" && rawTokens[index + 1] === "to") {
      tokens.push({ type: "op", value: "^" });
      index += rawTokens[index + 2] === "the" ? 4 : 2;
      continue;
    }

    if (word === "squared") {
      tokens.push({ type: "op", value: "^" });
      tokens.push({ type: "number", value: 2 });
      numbers.push(2);
      index += 1;
      continue;
    }

    if (word === "cubed") {
      tokens.push({ type: "op", value: "^" });
      tokens.push({ type: "number", value: 3 });
      numbers.push(3);
      index += 1;
      continue;
    }

    if (word === "%" || word === "percent" || word === "percentage") {
      if (previousIsValue && word === "%" && rawStartsValue(rawTokens, index + 1)) {
        tokens.push({ type: "op", value: "mod" });
      } else {
        tokens.push({ type: "postfix", value: "%" });
      }

      index += 1;
      continue;
    }

    if (word === "!" || word === "factorial") {
      tokens.push({ type: "postfix", value: "!" });
      index += 1;
      continue;
    }

    const operator = {
      "+": "+",
      plus: "+",
      with: "+",
      "-": "-",
      minus: "-",
      subtract: "-",
      subtracted: "-",
      less: "-",
      "*": "*",
      x: "*",
      times: "*",
      multiply: "*",
      multiplied: "*",
      "/": "/",
      divide: "/",
      divided: "/",
      over: "/",
      "^": "^",
      power: "^",
      exponent: "^",
      modulo: "mod",
      mod: "mod",
      remainder: "mod",
    }[word];

    if (operator) {
      tokens.push({ type: "op", value: operator });
    }

    index += 1;
  }

  return { tokens, numbers };
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 4,
  }).format(value);
}

function expressionToString(tokens) {
  const parts = [];

  for (const token of tokens) {
    if (token.type === "number") {
      parts.push(formatNumber(token.value));
      continue;
    }

    if (token.type === "postfix") {
      parts[parts.length - 1] = `${parts[parts.length - 1] ?? ""}${token.value}`;
      continue;
    }

    parts.push(token.value);
  }

  return parts.join(" ").replace(/\s+([)!%])/g, "$1").replace(/\(\s+/g, "(");
}

function factorial(value) {
  if (!Number.isInteger(value) || value < 0 || value > 170) {
    throw new Error("Factorial needs a whole number from 0 to 170");
  }

  let result = 1;
  for (let index = 2; index <= value; index += 1) {
    result *= index;
  }

  return result;
}

const precedence = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
  mod: 2,
  neg: 3,
  "^": 4,
};

const rightAssociative = new Set(["^", "neg"]);

function toRpn(tokens) {
  const output = [];
  const operators = [];
  let expectsValue = true;

  for (const token of tokens) {
    if (token.type === "number") {
      output.push(token);
      expectsValue = false;
      continue;
    }

    if (token.type === "func") {
      operators.push(token);
      expectsValue = true;
      continue;
    }

    if (token.type === "postfix") {
      if (expectsValue) {
        throw new Error("Postfix operator is missing a number");
      }

      output.push(token);
      expectsValue = false;
      continue;
    }

    if (token.type === "paren" && token.value === "(") {
      operators.push(token);
      expectsValue = true;
      continue;
    }

    if (token.type === "paren" && token.value === ")") {
      while (
        operators.length > 0 &&
        operators[operators.length - 1].value !== "("
      ) {
        output.push(operators.pop());
      }

      if (operators.length === 0) {
        throw new Error("Mismatched parentheses");
      }

      operators.pop();

      if (operators[operators.length - 1]?.type === "func") {
        output.push(operators.pop());
      }

      expectsValue = false;
      continue;
    }

    if (token.type === "op") {
      const operator = expectsValue && token.value === "-" ? "neg" : token.value;

      if (expectsValue && token.value === "+") {
        continue;
      }

      if (expectsValue && operator !== "neg") {
        throw new Error("Operator is missing a left operand");
      }

      while (operators.length > 0) {
        const top = operators[operators.length - 1];

        if (top.type === "func") {
          output.push(operators.pop());
          continue;
        }

        if (top.type !== "op") {
          break;
        }

        const topPrecedence = precedence[top.value];
        const operatorPrecedence = precedence[operator];
        const shouldPop = rightAssociative.has(operator)
          ? operatorPrecedence < topPrecedence
          : operatorPrecedence <= topPrecedence;

        if (!shouldPop) {
          break;
        }

        output.push(operators.pop());
      }

      operators.push({ type: "op", value: operator });
      expectsValue = true;
    }
  }

  if (expectsValue && output.length > 0) {
    throw new Error("Expression is incomplete");
  }

  while (operators.length > 0) {
    const operator = operators.pop();

    if (operator.type === "paren") {
      throw new Error("Mismatched parentheses");
    }

    output.push(operator);
  }

  return output;
}

function evaluateRpn(tokens) {
  const stack = [];

  for (const token of tokens) {
    if (token.type === "number") {
      stack.push(token.value);
      continue;
    }

    if (token.type === "postfix") {
      const value = stack.pop();

      if (value === undefined) {
        throw new Error("Postfix operator is missing a number");
      }

      stack.push(token.value === "%" ? value / 100 : factorial(value));
      continue;
    }

    if (token.type === "func") {
      const value = stack.pop();

      if (value === undefined) {
        throw new Error("Function is missing a number");
      }

      if (token.value === "sqrt") {
        if (value < 0) {
          throw new Error("Square root cannot use a negative number");
        }

        stack.push(Math.sqrt(value));
      } else if (token.value === "cbrt") {
        stack.push(Math.cbrt(value));
      } else if (token.value === "abs") {
        stack.push(Math.abs(value));
      }

      continue;
    }

    if (token.type === "op" && token.value === "neg") {
      const value = stack.pop();

      if (value === undefined) {
        throw new Error("Negative sign is missing a number");
      }

      stack.push(-value);
      continue;
    }

    const right = stack.pop();
    const left = stack.pop();

    if (left === undefined || right === undefined) {
      throw new Error("Operator is missing a number");
    }

    if (token.value === "+") {
      stack.push(left + right);
    } else if (token.value === "-") {
      stack.push(left - right);
    } else if (token.value === "*") {
      stack.push(left * right);
    } else if (token.value === "/") {
      if (right === 0) {
        throw new Error("Cannot divide by zero");
      }

      stack.push(left / right);
    } else if (token.value === "^") {
      stack.push(left ** right);
    } else if (token.value === "mod") {
      stack.push(left % right);
    }
  }

  if (stack.length !== 1 || !Number.isFinite(stack[0])) {
    throw new Error("Could not resolve the full expression");
  }

  return stack[0];
}

function makeCalculation(value, expression, numbers) {
  if (!Number.isFinite(value)) {
    return {
      ok: false,
      expression: "Result is not finite",
      result: "0",
      numbers,
      value: null,
    };
  }

  return {
    ok: true,
    expression,
    result: formatNumber(value),
    numbers,
    value,
  };
}

function splitAround(tokens, startIndex, separatorWords) {
  for (let index = startIndex; index < tokens.length; index += 1) {
    if (separatorWords.has(tokens[index])) {
      return [tokens.slice(startIndex, index), tokens.slice(index + 1)];
    }
  }

  return null;
}

function evaluateOperand(tokens, depth) {
  const calculation = calculateCore(tokens.join(" "), depth + 1);

  if (calculation.ok) {
    return calculation;
  }

  const numbers = collectNumberOperands(tokens);
  const lastNumber = numbers[numbers.length - 1];

  if (lastNumber !== undefined) {
    return makeCalculation(lastNumber, formatNumber(lastNumber), [lastNumber]);
  }

  return calculation;
}

function evaluateSpecialCommand(rawTokens, depth) {
  if (depth > 4) {
    return null;
  }

  const tokens = rawTokens.filter((word) => !ignoredWords.has(word));
  const explicitFromIndex = tokens.lastIndexOf("from");
  const subtractIndexForOf = tokens.findIndex((word) => subtractWords.has(word));
  const ofAfterSubtractIndex =
    subtractIndexForOf >= 0 ? tokens.indexOf("of", subtractIndexForOf + 1) : -1;
  const fromIndex =
    explicitFromIndex > 0 ? explicitFromIndex : ofAfterSubtractIndex;

  if (fromIndex > 0 && fromIndex < tokens.length - 1) {
    const beforeFrom = tokens.slice(0, fromIndex);
    const afterFrom = tokens.slice(fromIndex + 1);
    let leftTokens = null;

    if (beforeFrom[beforeFrom.length - 1] === "subtracted") {
      leftTokens = beforeFrom.slice(0, -1);
    } else {
      const subtractIndex = beforeFrom.findIndex((word) =>
        subtractWords.has(word),
      );

      if (subtractIndex >= 0) {
        leftTokens = beforeFrom.slice(subtractIndex + 1);

        if (leftTokens[0] === "away") {
          leftTokens = leftTokens.slice(1);
        }
      } else {
        leftTokens = beforeFrom;
      }
    }

    const left = evaluateOperand(leftTokens, depth);
    const right = evaluateOperand(afterFrom, depth);

    if (left.ok && right.ok) {
      return makeCalculation(
        right.value - left.value,
        `${right.expression} - ${left.expression}`,
        [...right.numbers, ...left.numbers],
      );
    }
  }

  const betweenIndex = tokens.indexOf("between");
  if (betweenIndex >= 0 && tokens[betweenIndex - 1] === "difference") {
    const split = splitAround(tokens, betweenIndex + 1, new Set(["and"]));

    if (split) {
      const left = evaluateOperand(split[0], depth);
      const right = evaluateOperand(split[1], depth);

      if (left.ok && right.ok) {
        return makeCalculation(
          left.value - right.value,
          `${left.expression} - ${right.expression}`,
          [...left.numbers, ...right.numbers],
        );
      }
    }
  }

  const firstCommandIndex = tokens.findIndex((word) =>
    ["multiply", "divide", "subtract"].includes(word),
  );

  if (firstCommandIndex >= 0) {
    const command = tokens[firstCommandIndex];
    const separator = command === "subtract" ? new Set(["and"]) : new Set(["by"]);
    const split = splitAround(tokens, firstCommandIndex + 1, separator);

    if (split) {
      const left = evaluateOperand(split[0], depth);
      const right = evaluateOperand(split[1], depth);

      if (left.ok && right.ok) {
        const leftValue = left.value;
        const rightValue = right.value;
        const value =
          command === "multiply"
            ? leftValue * rightValue
            : command === "divide"
              ? leftValue / rightValue
              : leftValue - rightValue;
        const operator =
          command === "multiply" ? "*" : command === "divide" ? "/" : "-";

        return makeCalculation(
          value,
          `${left.expression} ${operator} ${right.expression}`,
          [...left.numbers, ...right.numbers],
        );
      }
    }
  }

  const ofIndex = tokens.indexOf("of");
  const commandBeforeOf = tokens[ofIndex - 1];

  if (
    ofIndex > 0 &&
    ["sum", "product", "quotient"].includes(commandBeforeOf)
  ) {
    const split = splitAround(tokens, ofIndex + 1, new Set(["and", "by"]));

    if (split) {
      const left = evaluateOperand(split[0], depth);
      const right = evaluateOperand(split[1], depth);

      if (left.ok && right.ok) {
        const leftValue = left.value;
        const rightValue = right.value;
        const value =
          commandBeforeOf === "sum"
            ? leftValue + rightValue
            : commandBeforeOf === "product"
              ? leftValue * rightValue
              : leftValue / rightValue;
        const operator =
          commandBeforeOf === "sum" ? "+" : commandBeforeOf === "product" ? "*" : "/";

        return makeCalculation(
          value,
          `${left.expression} ${operator} ${right.expression}`,
          [...left.numbers, ...right.numbers],
        );
      }
    }
  }

  return null;
}

function calculateCore(text, depth = 0) {
  const rawTokens = prepareRawTokens(text);

  if (rawTokens.length === 0) {
    return {
      ok: false,
      expression: "No numbers found",
      result: "0",
      numbers: [],
      value: null,
    };
  }

  const special = evaluateSpecialCommand(rawTokens, depth);

  if (special) {
    return special;
  }

  const { tokens, numbers } = tokenizeExpression(rawTokens);

  if (numbers.length === 0) {
    return {
      ok: false,
      expression: "No numbers found",
      result: "0",
      numbers,
      value: null,
    };
  }

  try {
    const value = evaluateRpn(toRpn(tokens));
    return makeCalculation(value, expressionToString(tokens), numbers);
  } catch (error) {
    return {
      ok: false,
      expression: error.message,
      result: "0",
      numbers,
      value: null,
    };
  }
}

function calculateFromText(text) {
  return calculateCore(text);
}

function t(key) {
  return currentLanguage.ui[key] ?? languageProfiles[0].ui[key] ?? key;
}

function formatUi(key, values = {}) {
  return String(t(key)).replace(/\{(\w+)\}/g, (_, name) => values[name] ?? "");
}

function hasLocalizedText(element, key) {
  return languageProfiles.some((language) => element.textContent === language.ui[key]);
}

function getEditableExpression() {
  return expressionEl.value.trim();
}

function setEditableExpression(value) {
  expressionEl.value = value;
}

function summarizeText(text) {
  const compact = text.replace(/\s+/g, " ").trim();
  if (compact.length <= 46) {
    return compact || t("noActive");
  }

  return `${compact.slice(0, 43)}...`;
}

function renderHistory() {
  historyListEl.innerHTML = historyItems
    .slice(0, 3)
    .map(
      (item) =>
        `<li><span>${item.expression}</span><strong>${item.result}</strong></li>`,
    )
    .join("");
}

function commitHistory(text, calculation) {
  if (!calculation.ok || calculation.expression === lastCommittedExpression) {
    return;
  }

  lastCommittedExpression = calculation.expression;
  historyItems.unshift({
    expression: calculation.expression,
    result: calculation.result,
    text,
  });
  lastLineEl.textContent = `${calculation.expression} = ${calculation.result}`;
  renderHistory();
}

function updateCalculation(text, fallbackText = null, options = {}) {
  const { syncExpression = true } = options;
  const sourceText = String(text ?? "").trim();
  const calculation = calculateFromText(sourceText);
  visibleCalculationOk = calculation.ok;
  visibleNumberCount = calculation.numbers.length;
  transcriptEl.textContent = sourceText || fallbackText || t("listening");

  if (syncExpression) {
    setEditableExpression(calculation.ok ? calculation.expression : sourceText);
  }

  resultEl.textContent = calculation.ok ? calculation.result : "0.00";
  hintEl.textContent = calculation.ok
    ? formatUi(
        calculation.numbers.length === 1
          ? "numberHintSingular"
          : "numberHintPlural",
        { count: calculation.numbers.length },
      )
    : t("sayCalculation");
  currentLineEl.textContent = calculation.ok
    ? `${summarizeText(sourceText)} = ${calculation.result}`
    : t("noActive");
  numbersDetectedEl.textContent = String(calculation.numbers.length);
  return calculation;
}

function voiceReadyText() {
  return formatUi("voiceReady", { lang: currentLanguage.short });
}

function textModeText() {
  return formatUi("textMode", { lang: currentLanguage.short });
}

function updateLocalizedControls() {
  document.documentElement.lang = currentLanguage.htmlLang;
  document.title = t("documentTitle");
  selectedLanguageLabel.textContent = currentLanguage.flag;
  expressionEl.placeholder = currentLanguage.placeholder;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });

  templateButtons.forEach((button) => {
    const template = currentLanguage.templates[button.dataset.templateKey];
    const label = currentLanguage.ui.templateLabels[button.dataset.templateKey];

    if (template) {
      button.dataset.template = template;
    }

    if (label) {
      button.textContent = label;
      button.setAttribute("aria-label", label);
    }
  });

  languageOptionButtons.forEach((button) => {
    const language = languageProfiles.find(
      (profile) => profile.code === button.dataset.language,
    );

    if (language) {
      button.textContent = `${language.flag} ${language.label}`;
    }

    button.setAttribute(
      "aria-selected",
      String(button.dataset.language === currentLanguage.code),
    );
  });

  if (hasLocalizedText(currentLineEl, "noActive")) {
    currentLineEl.textContent = t("noActive");
  }

  if (hasLocalizedText(lastLineEl, "noPrevious")) {
    lastLineEl.textContent = t("noPrevious");
  }

  if (visibleCalculationOk) {
    hintEl.textContent = formatUi(
      visibleNumberCount === 1 ? "numberHintSingular" : "numberHintPlural",
      { count: visibleNumberCount },
    );
  } else if (
    !currentTranscript &&
    resultEl.textContent === "0.00" &&
    !getEditableExpression()
  ) {
    transcriptEl.textContent = currentLanguage.transcript;
    hintEl.textContent = currentLanguage.hint;
    currentLineEl.textContent = t("noActive");
  }

  if (micButton.disabled) {
    recordingStateEl.textContent = t("voiceUnavailable");
    supportStatusEl.textContent = textModeText();
  } else if (recording) {
    recordingStateEl.textContent = t("recordingUntilStopped");
    supportStatusEl.textContent = formatUi("recordingStatus", {
      lang: currentLanguage.short,
    });
    precisionScoreEl.textContent = t("liveState");
  } else {
    recordingStateEl.textContent = t("readyListen");
    supportStatusEl.textContent = SpeechRecognition
      ? voiceReadyText()
      : textModeText();
    precisionScoreEl.textContent = t("readyState");
  }
}

function closeLanguageMenu() {
  languageMenu.classList.remove("is-open");
  languageButton.setAttribute("aria-expanded", "false");
}

function setLanguage(languageCode) {
  const nextLanguage =
    languageProfiles.find((language) => language.code === languageCode) ??
    languageProfiles[0];

  currentLanguage = nextLanguage;
  updateLocalizedControls();

  if (recognition) {
    recognition.lang = currentLanguage.code;

    if (recording && recognitionActive) {
      recognition.stop();
    } else if (recording) {
      startRecognition();
    }
  }

  closeLanguageMenu();
}

function setRecordingUI(nextRecording) {
  recording = nextRecording;
  micButton.classList.toggle("is-listening", recording);
  micButton.setAttribute(
    "aria-label",
    recording ? t("stopAria") : t("startAria"),
  );
  recordingStateEl.textContent = recording
    ? t("recordingUntilStopped")
    : t("readyListen");
  supportStatusEl.textContent = recording
    ? formatUi("recordingStatus", { lang: currentLanguage.short })
    : voiceReadyText();
  precisionScoreEl.textContent = recording ? t("liveState") : t("readyState");

  if (!recording) {
    expressionEl.placeholder = currentLanguage.placeholder;
  }
}

function scheduleRecognitionRestart() {
  if (!recording || restartTimer) {
    return;
  }

  recordingStateEl.textContent = t("stillListening");
  restartTimer = window.setTimeout(() => {
    restartTimer = null;
    startRecognition();
  }, 250);
}

function startRecognition() {
  if (!recognition || recognitionActive || !recording) {
    return;
  }

  try {
    recognition.start();
  } catch (error) {
    if (error.name !== "InvalidStateError") {
      recordingStateEl.textContent = t("micPaused");
      hintEl.textContent = t("speechPaused");
      setRecordingUI(false);
    }
  }
}

function stopRecording() {
  window.clearTimeout(restartTimer);
  restartTimer = null;
  setRecordingUI(false);
  commitHistory(currentTranscript || finalTranscript, calculateFromText(currentTranscript || finalTranscript));

  if (recognition && recognitionActive) {
    recognition.stop();
  }
}

function configureSpeechRecognition() {
  if (!SpeechRecognition) {
    supportStatusEl.textContent = textModeText();
    recordingStateEl.textContent = t("voiceUnavailable");
    hintEl.textContent = t("unsupportedSpeech");
    micButton.disabled = true;
    return;
  }

  supportStatusEl.textContent = voiceReadyText();
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = currentLanguage.code;

  recognition.addEventListener("start", () => {
    recognitionActive = true;
    setRecordingUI(true);
  });

  recognition.addEventListener("end", () => {
    recognitionActive = false;

    if (recording) {
      scheduleRecognitionRestart();
      return;
    }

    supportStatusEl.textContent = voiceReadyText();
    recordingStateEl.textContent = t("readyListen");
  });

  recognition.addEventListener("result", (event) => {
    let interimTranscript = "";

    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const result = event.results[index];
      const text = result[0].transcript.trim();

      if (!text) {
        continue;
      }

      if (result.isFinal) {
        finalTranscript = `${finalTranscript} ${text}`.trim();
      } else {
        interimTranscript = `${interimTranscript} ${text}`.trim();
      }
    }

    const transcript = `${finalTranscript} ${interimTranscript}`.trim();

    if (transcript) {
      currentTranscript = transcript;
      updateCalculation(transcript);
    }
  });

  recognition.addEventListener("error", (event) => {
    recognitionActive = false;

    if (event.error === "no-speech" && recording) {
      scheduleRecognitionRestart();
      return;
    }

    setRecordingUI(false);
    recordingStateEl.textContent = t("micPaused");
    hintEl.textContent =
      event.error === "not-allowed"
        ? t("micPermission")
        : t("speechStopped");
  });
}

function handleMicClick() {
  if (!recognition) {
    return;
  }

  if (recording) {
    stopRecording();
    return;
  }

  finalTranscript = "";
  currentTranscript = "";
  visibleCalculationOk = false;
  visibleNumberCount = 0;
  setRecordingUI(true);
  transcriptEl.textContent = t("listening");
  setEditableExpression("");
  expressionEl.placeholder = t("speakCalculation");
  resultEl.textContent = "0.00";
  hintEl.textContent = t("pauseHint");
  currentLineEl.textContent = t("listeningShort");
  numbersDetectedEl.textContent = "0";
  startRecognition();
}

function calculateEditableExpression(options = {}) {
  const { commit = false } = options;
  const text = getEditableExpression();
  currentTranscript = text;
  const calculation = updateCalculation(text, t("typeOrSpeak"), {
    syncExpression: false,
  });

  if (commit) {
    commitHistory(text, calculation);
  }

  return calculation;
}

micButton.addEventListener("click", handleMicClick);
expressionEl.addEventListener("input", () => {
  calculateEditableExpression();
});
expressionEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    calculateEditableExpression({ commit: true });
    expressionEl.blur();
  }
});
expressionEl.addEventListener("blur", () => {
  calculateEditableExpression({ commit: true });
});
templateButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentTranscript = button.dataset.template;
    const calculation = updateCalculation(button.dataset.template, t("typeOrSpeak"));
    commitHistory(button.dataset.template, calculation);
  });
});
getStartedButton.addEventListener("click", () => {
  calculatorDashboard.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});
languageButton.addEventListener("click", () => {
  const isOpen = languageMenu.classList.toggle("is-open");
  languageButton.setAttribute("aria-expanded", String(isOpen));
});
languageOptionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setLanguage(button.dataset.language);
  });
});
document.addEventListener("click", (event) => {
  if (
    !languageMenu.contains(event.target) &&
    !languageButton.contains(event.target)
  ) {
    closeLanguageMenu();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLanguageMenu();
  }
});

window.speechCalc = { calculateFromText };
updateLocalizedControls();
configureSpeechRecognition();
