/* =====================================================================
   ALL THE TEXT ON YOUR WEBSITE LIVES IN THIS ONE FILE.

   Two ways to edit it:

   A) The easy way: open  yoursite/edit.html  in a browser. You get forms
      for every section. Click "Download content.js", then upload that file
      to GitHub in place of this one.

   B) Edit this file directly on GitHub (pencil icon). Rules:
      - Text goes between quotes: "like this". To use a quote inside, write \"
      - Every { } block and every "..." value is followed by a comma,
        except the last one in a list (a trailing comma is also fine).
      - Lists are shown in the order you write them. Put the newest on top.
      - Add  hide: true  to any block to keep it in the file but off the site.
      - Leave a field empty ("") and that line simply does not appear.
      If you make a typo, the site shows a red bar telling you the line number.

   Photos: upload them to the "images" folder on GitHub, then write the path,
   for example  photo: "images/me.jpg"
   ===================================================================== */

var CONTENT = {

  /* ---------- YOU, AND THE PARTS SHOWN ON EVERY PAGE ---------- */
  site: {
    name: "Md Abdur Rahman",
    role: "Doctoral researcher, photo-responsive membranes",
    description: "MSCA doctoral researcher in the PhotoBrane network, developing photo-responsive membranes for molecular separation.",
    photo: "",                 // e.g. "images/me.jpg"  (square works best)
    cvFile: "",                // optional: a PDF of your CV, e.g. "images/cv.pdf"
    email: "a.rahman.ru1@gmail.com",
    affiliation: "Leibniz Institute of Surface Engineering (IOM), Leipzig, and Friedrich Schiller University Jena",
    links: {
      linkedin: "https://www.linkedin.com/in/abdur-rahman-in/",
      orcid: "https://orcid.org/0009-0006-9225-6039",
      scholar: "https://scholar.google.com/citations?user=lPc2e-UAAAAJ&hl=en",
      researchgate: "https://www.researchgate.net/profile/Md-Abdur-Rahman-39",
      github: ""
    },
    // Turn whole pages on or off. The Blog only appears when it has a post.
    pages: { research: true, publications: true, cv: true, news: true, travel: true, blog: true }
  },

  /* ---------- HOME PAGE ---------- */
  home: {
    lede: "I develop membranes whose properties are controlled by light, for molecular separation.",
    intro: "Marie Skłodowska-Curie Actions (MSCA) Fellow in the PhotoBrane Doctoral Network. PhD student at Friedrich Schiller University Jena, working at the Leibniz Institute of Surface Engineering (IOM) in Leipzig, Germany.",
    about: [
      "I research photo-responsive membrane systems for molecular separation. PhotoBrane brings together membrane technology, materials science and photochemistry to build membranes whose properties are controlled by light, with the aims of better separation performance, less fouling and longer membrane lifetime.",
      "I study these systems with spectroscopy, from UV–Vis to transient absorption, to understand the light-induced processes in the materials. My background is in materials engineering, followed by the Erasmus Mundus Master's in Membrane Engineering for Sustainable Development."
    ],
    highlights: [
      { title: "PhD student representative, PhotoBrane Doctoral Network", text: "Elected at the kick-off meeting in Jena. I am the contact point for the doctoral researchers in the network.", link: "news.html" },
      { title: "Best Group, 41st EMS Summer School", text: "With team AQUA SALMS at the University of Girona, 2026, for a membrane-based solution to landfill leachate treatment.", link: "news.html" },
      { title: "Review on COF-based mixed matrix membranes", text: "Journal of Membrane Science, 2026.", link: "publications.html" }
    ],
    showMap: true,             // the "Where I have worked" map
    latestNews: 3              // how many news items to show on the home page
  },

  /* ---------- MAP: PLACES I HAVE STUDIED AND WORKED ----------
     Find coordinates by right-clicking a place in Google Maps.
     The map covers Europe; places in Bangladesh appear in the small inset. */
  places: [
    { city: "Rajshahi", country: "Bangladesh", lat: 24.37, lng: 88.64, years: "2018–2023", what: "BSc in Materials Science and Engineering, University of Rajshahi" },
    { city: "Montpellier", country: "France", lat: 43.61, lng: 3.88, years: "2023–2025", what: "Erasmus Mundus master's, Université de Montpellier" },
    { city: "Zaragoza", country: "Spain", lat: 41.65, lng: -0.88, years: "2024", what: "Master's study and research internships, Universidad de Zaragoza and INMA" },
    { city: "Enschede", country: "Netherlands", lat: 52.22, lng: 6.89, years: "2025", what: "Master's thesis, Twente Membranes, University of Twente" },
    { city: "Leipzig", country: "Germany", lat: 51.34, lng: 12.37, years: "2025–now", what: "Doctoral research, Leibniz Institute of Surface Engineering (IOM)" },
    { city: "Jena", country: "Germany", lat: 50.93, lng: 11.59, years: "2025–now", what: "PhD, Friedrich Schiller University Jena" },
    { city: "Nancy", country: "France", lat: 48.69, lng: 6.18, years: "2027", what: "Planned secondment, Institut Jean Lamour, Université de Lorraine", upcoming: true }
  ],

  /* ---------- RESEARCH PAGE ---------- */
  research: {
    intro: "Membranes whose properties are controlled by light, and the materials science behind them.",
    current: {
      title: "Photo-responsive membranes for molecular separation",
      where: "PhotoBrane Doctoral Network, department “Surfaces of Porous Membrane Filters”, Leibniz Institute of Surface Engineering (IOM), Leipzig",
      paragraphs: [
        "I am an MSCA Fellow in the PhotoBrane Doctoral Network. My research is on photo-responsive membrane systems for molecular separation.",
        "PhotoBrane brings together membrane technology, materials science and photochemistry to develop membranes whose properties can be controlled by light. The broader goals are better molecular separation performance, less fouling and longer membrane lifetime. I am especially interested in how material structure, photophysical processes and membrane function connect.",
        "I explore these systems with spectroscopy, from UV–Vis to transient absorption (TA), which lets me investigate the photophysical behaviour and light-induced processes of materials used in photo-tunable membranes.",
        "The network is funded by the Marie Skłodowska-Curie Actions under Horizon Europe. It gathers experts in membrane technology, dye chemistry, photoswitches and computational chemistry from across Europe and beyond. Doctoral researchers receive hands-on training in molecular modeling and in synthesizing photoswitchable building blocks for molecular layers and phototunable membranes."
      ],
      keywords: ["Photo-responsive membranes", "Molecular separation", "Membrane fouling", "Photoswitches", "UV–Vis spectroscopy", "Transient absorption spectroscopy"],
      link: { label: "PhotoBrane website", url: "https://photobrane-dn.eu/" }
    },
    // field: used for the filter buttons. Use the same spelling for projects in the same field.
    earlier: [
      { title: "Monovalent ion selectivity in PSS/PVAm saloplastics", field: "Membranes", where: "Master's thesis, Twente Membranes, University of Twente", text: "Improving K⁺/Na⁺ selectivity and mechanical stability of hot-pressed cation-exchange membranes through glutaraldehyde crosslinking." },
      { title: "Healing defects in ZIF membranes", field: "Membranes", where: "Inorganic Membranes group, University of Twente", text: "Preparing Zn₂(bim)₄ zeolitic imidazolate framework membranes for H₂/CO₂ separation and repairing defects with interfacial polymerization." },
      { title: "Mixed matrix membranes for heavy-metal removal", field: "Membranes", where: "Universidad de Zaragoza", text: "Incorporating MOFs into porous membranes to remove Pb²⁺ from simulated perovskite-contaminated rainwater, with the goal of reaching the WHO limit of 10 ppb." },
      { title: "Prussian blue cathodes for sodium-ion batteries", field: "Energy", where: "INMA, Zaragoza", text: "Synthesis and characterization of Prussian blue electrodes." },
      { title: "Green-synthesized magnetite nanoparticles", field: "Nanomaterials", where: "Bachelor's thesis, University of Rajshahi", text: "Co-precipitation using leaf extract of Alternanthera philoxeroides as a reducing agent, for wastewater treatment." },
      { title: "Eggshell waste to soda-lime glass", field: "Glass and ceramics", where: "University of Rajshahi", text: "Synthesizing and optimizing CaO/CaCO₃ from eggshells and using it to make glass, with energy storage as a long-term aim." },
      { title: "Lead borosilicate quenched glasses", field: "Glass and ceramics", where: "University of Rajshahi", text: "Characterizing how lead content changes the properties of borosilicate glass." },
      { title: "Perovskite solar cell performance", field: "Energy", where: "University of Rajshahi", text: "Numerical investigation of device performance in SCAPS-1D." }
    ]
  },

  /* ---------- PUBLICATIONS (newest first) ----------
     type: "Review article", "Research article", "Conference paper", "Preprint", "Book chapter" ...
     The filter buttons are made from the types you use. */
  publications: [
    {
      title: "Covalent Organic Framework (COF) based mixed matrix membranes as an alternative solution for gas separation",
      authors: "J. Alom, M. A. Rahman, M. Hossein, …, B. Zornoza",
      venue: "Journal of Membrane Science",
      year: "2026",
      type: "Review article",
      summary: "A systematic review of COF-based mixed matrix membranes for gas separation. It covers the design principles and synthesis routes of COF fillers, structure–performance relationships in the polymer matrix, gas transport under practical conditions, and molecular modeling and machine-learning approaches for rational design.",
      doi: "https://doi.org/10.1016/j.memsci.2026.125620",
      pdf: ""
    }
  ],
  // The part of the author list to show in bold
  myAuthorName: "M. A. Rahman",

  /* ---------- TALKS AND POSTERS (shown on the Publications page once you add one) ----------
     { title: "...", event: "...", place: "...", date: "Sep 2026", kind: "Poster", link: "" } */
  talks: [],

  /* ---------- CV PAGE ----------
     start / end: "2025-11" (year-month) or "2023" (year). end: "present" if ongoing.
     A bare year is drawn on the chart like an academic year (starts Sep, ends Jul).
     These dates also draw the timeline chart at the top of the CV page. */
  experience: [
    {
      start: "2027-01", end: "2027-03", upcoming: true,
      role: "Visiting doctoral researcher (secondment)",
      org: "Institut Jean Lamour, Université de Lorraine",
      place: "Nancy, France",
      text: "Planned secondment in the group of Prof. Alain Celzard, as part of the PhotoBrane Doctoral Network.",
      methods: []
    },
    {
      start: "2025-11", end: "present",
      role: "Junior Researcher, MSCA Doctoral Fellow",
      org: "Leibniz Institute of Surface Engineering (IOM), PhotoBrane Doctoral Network",
      place: "Leipzig, Germany",
      text: "Developing photo-responsive membrane systems for molecular separation in the research department “Surfaces of Porous Membrane Filters”, using UV–Vis and transient absorption spectroscopy.",
      methods: ["UV–Vis", "Transient absorption"]
    },
    {
      start: "2025-02", end: "2025-08",
      role: "Research intern, master's thesis",
      org: "Twente Membranes, University of Twente",
      place: "Enschede, Netherlands",
      text: "Worked in the Membrane Surface Science group under Prof. Wiebe de Vos on ion-exchange membranes. Modified saloplastic-based cation-exchange membranes to improve K⁺/Na⁺ selectivity and stability.",
      methods: ["FTIR", "NMR", "Ion-exchange capacity", "Permselectivity", "Resistance", "Water uptake", "Swelling ratio", "Tensile testing"]
    },
    {
      start: "2024-06", end: "2024-07",
      role: "Summer research intern",
      org: "Institute of Nanoscience and Materials of Aragón (INMA)",
      place: "Zaragoza, Spain",
      text: "Synthesized nanoparticles and electrode materials for sodium-ion batteries and evaluated their electrochemical performance.",
      methods: ["Hydrothermal synthesis", "SEM", "XRD", "FTIR", "Raman", "UV–Vis", "TGA", "VSM", "MP-AES", "Battery assembly"]
    },
    {
      start: "2024-05", end: "2024-06",
      role: "Research intern, first-year master's project",
      org: "Universidad de Zaragoza",
      place: "Zaragoza, Spain",
      text: "Synthesized and characterized MOFs and mixed matrix membranes for perovskite solar cell applications.",
      methods: ["SEM", "XRD", "FTIR", "UV–Vis", "TGA", "MP-AES", "Membrane synthesis"]
    },
    {
      start: "2022-01", end: "2023-08",
      role: "Undergraduate research assistant",
      org: "Nano and Biomedical Engineering Lab, University of Rajshahi",
      place: "Rajshahi, Bangladesh",
      text: "Developed and characterized magnetite nanoparticles for water treatment, and helped junior undergraduate students.",
      methods: ["Co-precipitation", "Sol-gel", "SEM", "XRD", "FTIR", "UV–Vis", "TGA", "VSM", "Zeta potential", "Photocatalysis"]
    },
    {
      start: "2021-11", end: "2022-11",
      role: "Undergraduate research trainee",
      org: "Simulation and Functional Ceramics Lab, University of Rajshahi",
      place: "Rajshahi, Bangladesh",
      text: "Synthesized and characterized glass and ABO₃ perovskite materials, ran SCAPS and CASTEP simulations, and analysed data.",
      methods: ["Melt quenching", "Sol-gel", "SEM", "XRD", "TGA", "FTIR", "VSM", "DFT analysis", "Mechanical characterization"]
    }
  ],

  education: [
    {
      start: "2025-11", end: "present",
      degree: "PhD in Physical Chemistry",
      org: "Friedrich Schiller University Jena, Institute of Physical Chemistry",
      place: "Jena, Germany",
      text: "MSCA Doctoral Network PhotoBrane. Research carried out at the Leibniz Institute of Surface Engineering (IOM), Leipzig."
    },
    {
      start: "2023", end: "2025",
      degree: "Erasmus Mundus Joint Master's in Membrane Engineering for Sustainable Development",
      org: "University of Twente, Universidad de Zaragoza, Université de Montpellier",
      place: "Netherlands, Spain and France",
      text: "Fully funded Erasmus Mundus scholarship (EACEA). Study periods in Chemical Science and Engineering (Twente), Nanostructured Materials for Nanotechnology Applications (Zaragoza) and Chemistry (Montpellier)."
    },
    {
      start: "2018", end: "2023",
      degree: "BSc in Materials Science and Engineering",
      org: "University of Rajshahi",
      place: "Rajshahi, Bangladesh",
      text: "Grade 3.83 / 4.00, first position in class."
    }
  ],

  awards: [
    { year: "2026", title: "Best Group, 41st EMS Summer School", text: "With team AQUA SALMS, University of Girona." },
    { year: "2025", title: "Marie Skłodowska-Curie Actions doctoral fellowship", text: "PhotoBrane Doctoral Network." },
    { year: "2023", title: "Erasmus Mundus Scholarship", text: "Fully funded joint master's programme, 2023–2025." },
    { year: "2023", title: "Dean's Award", text: "Faculty of Engineering, University of Rajshahi." },
    { year: "", title: "Academic Excellence Award", text: "University of Rajshahi, for first position in class." }
  ],

  roles: [
    { years: "2025–2026", title: "Treasurer, steering committee", org: "Leibniz PhD Network", text: "" },
    { years: "2025–now", title: "PhD student representative", org: "MSCA Doctoral Network PhotoBrane", text: "Elected at the kick-off meeting in Jena. Contact point for the doctoral researchers in the consortium." }
  ],

  skills: [
    { group: "Spectroscopy", items: ["UV–Vis", "Transient absorption", "IR", "Raman", "XRD", "XRR", "XPS", "DLS"] },
    { group: "Synthesis", items: ["Solvothermal", "Sol-gel", "Hot pressing", "Spin coating", "Dip coating", "Co-precipitation"] },
    { group: "Microscopy and physical", items: ["SEM", "Optical microscopy", "Hardness", "Tensile", "VSM", "SQUID"] },
    { group: "Chemical and electrochemical", items: ["Titration", "Zeta potential", "MP-AES", "CV", "GITT", "Resistance", "Permselectivity"] },
    { group: "Software", items: ["Origin", "CasaXPS", "CASTEP", "SCAPS-1D", "Olex", "ImageJ", "MATLAB", "Zotero", "Mendeley"] }
  ],

  languages: [
    { name: "English", level: "C1" },
    { name: "Bengali", level: "Native" }
  ],

  /* ---------- NEWS AND EVENTS (newest first) ----------
     type: "Event", "Award", "Publication", "Role" or "News". Filter buttons are made from these.
     photos: [ { src: "images/girona-1.jpg", alt: "Our team with the award" } ]
     links:  [ { label: "LinkedIn post", url: "https://..." } ]
     embed:  a LinkedIn embed address (on a public post: ⋯ menu > Embed this post,
             copy the address inside src="...")  */
  news: [
    {
      date: "28 Sep – 1 Oct 2026",
      type: "Event",
      title: "2nd PhotoBrane & Interfaces4Life Networking Meeting",
      place: "Zaragoza, Spain",
      text: "Joint networking meeting of the PhotoBrane Doctoral Network and Interfaces4Life, held at the I+D+i building in Zaragoza.",
      links: [], photos: []
    },
    {
      date: "31 Aug – 4 Sep 2026",
      type: "Award",
      title: "Best Group at the 41st EMS Summer School",
      place: "University of Girona, Spain",
      text: "At the summer school “Membrane Technologies for Water Treatment”, my team AQUA SALMS was selected Best Group. Our project treated landfill leachate so that it can be discharged safely into rivers, combining membrane technology, process engineering and water treatment. The school mixed scientific fundamentals with hands-on lab work and insight into full-scale applications.",
      links: [ { label: "LinkedIn post", url: "https://lnkd.in/e-aH4YHQ" } ],
      photos: []
    },
    {
      date: "2026",
      type: "Publication",
      title: "Review on COF-based mixed matrix membranes published",
      place: "Journal of Membrane Science",
      text: "Our systematic review of covalent organic framework fillers in mixed matrix membranes for gas separation is out.",
      links: [ { label: "Read the article", url: "https://doi.org/10.1016/j.memsci.2026.125620" } ],
      photos: []
    },
    {
      date: "",
      type: "Role",
      title: "Elected PhD student representative of PhotoBrane",
      place: "1st PhotoBrane Network Meeting, Jena, Germany",
      text: "At the kick-off meeting of the MSCA Doctoral Network PhotoBrane I was elected PhD student representative. I am the contact point for the doctoral researchers in the consortium and support communication and exchange across the network.",
      links: [ { label: "PhotoBrane website", url: "https://photobrane-dn.eu/" } ],
      photos: []
    }
  ],

  /* ---------- TRAVEL PAGE ----------
     One block per city. Write the country in English (e.g. "Spain", "USA", "Czech Republic");
     the country is then shaded on the world map. Coordinates: right-click the city in
     Google Maps and copy the two numbers (first is lat, second is lng).
     photos: [ { src: "images/travel/girona.jpg", alt: "The old town of Girona" } ]  */
  travel: {
    title: "Travel",
    intro: "Outside the lab, I travel. Studying and working across Europe has given me the chance to see many countries and cities. Here are the places I have been so far.",
    teaser: "Outside the lab, I travel.",   // shown in the "Beyond the lab" box on the home page
    showOnHome: true,
    places: [
      { city: "Leipzig", country: "Germany", lat: 51.34, lng: 12.37, year: "2025", note: "Where I live and work now.", photos: [] },
      { city: "Jena", country: "Germany", lat: 50.93, lng: 11.59, year: "2025", note: "", photos: [] },
      { city: "Berlin", country: "Germany", lat: 52.52, lng: 13.4, year: "", note: "", photos: [] },
      { city: "Dresden", country: "Germany", lat: 51.05, lng: 13.74, year: "", note: "", photos: [] },
      { city: "Munich", country: "Germany", lat: 48.14, lng: 11.58, year: "", note: "", photos: [] },
      { city: "Eibsee", country: "Germany", lat: 47.46, lng: 10.97, year: "", note: "", photos: [] },
      { city: "Münster", country: "Germany", lat: 51.96, lng: 7.63, year: "", note: "", photos: [] },
      { city: "Montpellier", country: "France", lat: 43.61, lng: 3.88, year: "2023", note: "", photos: [] },
      { city: "Nîmes", country: "France", lat: 43.84, lng: 4.36, year: "", note: "", photos: [] },
      { city: "Marseille", country: "France", lat: 43.3, lng: 5.37, year: "", note: "", photos: [] },
      { city: "Nice", country: "France", lat: 43.7, lng: 7.27, year: "", note: "", photos: [] },
      { city: "Lyon", country: "France", lat: 45.76, lng: 4.84, year: "", note: "", photos: [] },
      { city: "Paris", country: "France", lat: 48.86, lng: 2.35, year: "", note: "", photos: [] },
      { city: "Perpignan", country: "France", lat: 42.7, lng: 2.9, year: "", note: "", photos: [] },
      { city: "Zaragoza", country: "Spain", lat: 41.65, lng: -0.88, year: "2024", note: "", photos: [] },
      { city: "Girona", country: "Spain", lat: 41.98, lng: 2.82, year: "2026", note: "", photos: [] },
      { city: "Barcelona", country: "Spain", lat: 41.39, lng: 2.17, year: "", note: "", photos: [] },
      { city: "Madrid", country: "Spain", lat: 40.42, lng: -3.7, year: "", note: "", photos: [] },
      { city: "Valencia", country: "Spain", lat: 39.47, lng: -0.38, year: "", note: "", photos: [] },
      { city: "Córdoba", country: "Spain", lat: 37.88, lng: -4.78, year: "", note: "", photos: [] },
      { city: "Málaga", country: "Spain", lat: 36.72, lng: -4.42, year: "", note: "", photos: [] },
      { city: "Seville", country: "Spain", lat: 37.39, lng: -5.98, year: "", note: "", photos: [] },
      { city: "Lisbon", country: "Portugal", lat: 38.72, lng: -9.14, year: "", note: "", photos: [] },
      { city: "Milan", country: "Italy", lat: 45.46, lng: 9.19, year: "", note: "", photos: [] },
      { city: "Genoa", country: "Italy", lat: 44.41, lng: 8.93, year: "", note: "", photos: [] },
      { city: "Venice", country: "Italy", lat: 45.44, lng: 12.32, year: "", note: "", photos: [] },
      { city: "Dolomites", country: "Italy", lat: 46.41, lng: 11.84, year: "", note: "", photos: [] },
      { city: "Enschede", country: "Netherlands", lat: 52.22, lng: 6.89, year: "2025", note: "", photos: [] },
      { city: "Zwolle", country: "Netherlands", lat: 52.52, lng: 6.08, year: "", note: "", photos: [] },
      { city: "Utrecht", country: "Netherlands", lat: 52.09, lng: 5.12, year: "", note: "", photos: [] },
      { city: "Brussels", country: "Belgium", lat: 50.85, lng: 4.35, year: "", note: "", photos: [] },
      { city: "Geneva", country: "Switzerland", lat: 46.2, lng: 6.14, year: "", note: "", photos: [] },
      { city: "Vienna", country: "Austria", lat: 48.21, lng: 16.37, year: "", note: "", photos: [] },
      { city: "Prague", country: "Czechia", lat: 50.08, lng: 14.44, year: "", note: "", photos: [] },
      { city: "Bratislava", country: "Slovakia", lat: 48.15, lng: 17.11, year: "", note: "", photos: [] },
      { city: "Budapest", country: "Hungary", lat: 47.5, lng: 19.04, year: "", note: "", photos: [] },
      { city: "Ljubljana", country: "Slovenia", lat: 46.06, lng: 14.51, year: "", note: "", photos: [] },
      { city: "Zagreb", country: "Croatia", lat: 45.81, lng: 15.98, year: "", note: "", photos: [] },
      { city: "Łódź", country: "Poland", lat: 51.76, lng: 19.46, year: "", note: "", photos: [] },
      { city: "Gdańsk", country: "Poland", lat: 54.35, lng: 18.65, year: "", note: "", photos: [] },
      { city: "Istanbul", country: "Turkey", lat: 41.01, lng: 28.98, year: "", note: "", photos: [] },
      { city: "Cairo", country: "Egypt", lat: 30.04, lng: 31.24, year: "", note: "", photos: [] },
      { city: "Riyadh", country: "Saudi Arabia", lat: 24.71, lng: 46.68, year: "", note: "", photos: [] },
      { city: "Dubai", country: "United Arab Emirates", lat: 25.2, lng: 55.27, year: "", note: "", photos: [] },
      { city: "Rajshahi", country: "Bangladesh", lat: 24.37, lng: 88.64, year: "2018", note: "Where I studied for my bachelor's degree.", photos: [] }
    ]
  },

  /* ---------- BLOG (newest first) ----------
     id: short, lowercase, no spaces. It becomes the web address of the post.
     body: write between the ` ` marks. Leave a blank line between paragraphs.
       ## A heading
       - a bullet point
       **bold**   *italic*   [link text](https://example.com)
       ![Short photo description](images/my-photo.jpg)
       [[animation:foulant-cleaning]]   (the built-in membrane-cleaning animation) */
  blog: [
    {
      id: "light-controlled-membranes",
      title: "Cleaning membranes with light: why I joined PhotoBrane",
      date: "October 2026",
      summary: "How light could clean fouling from a membrane surface on demand, and what I study in the PhotoBrane Doctoral Network.",
      body: `
Membranes are thin barriers that let some molecules pass and hold others back. They sit at the heart of water treatment, desalination and resource recovery. But in use they face a persistent problem called fouling. Unwanted material such as particles, organic matter and microorganisms builds up on the membrane surface, blocks the pores and lowers performance. Removing it usually means interrupting the process to flush or chemically clean the membrane, and repeated cleaning can shorten the life of the membrane.

I am a doctoral researcher in the PhotoBrane Doctoral Network, funded by the Marie Skłodowska-Curie Actions. My work focuses on light-triggered cleaning of foulants from the membrane surface. The question is simple: can we clean a membrane on demand, just by switching on light?

[[animation:foulant-cleaning]]

## The idea

PhotoBrane aims to develop membranes whose properties can be controlled by light. For cleaning, the goal is a surface that releases or removes foulants when light is applied, instead of relying only on interruptions and chemicals. If it works, the hoped-for gains are better separation performance, less fouling and a longer membrane lifetime.

The animation above is a simplified picture. It shows the effect I am after, not the details of the mechanism.

## Two fields, one system

This topic sits between two worlds. Membrane science asks how a material separates molecules. Photochemistry and photophysics ask what happens to a molecule after it absorbs light. To connect the two, I study the materials with spectroscopy, from UV–Vis to transient absorption, which follows the short-lived states a molecule goes through after it is excited by light.

What interests me most is the link between three things: the structure of the material, the photophysical processes inside it and the way the membrane works in the end.

## Where I come from

My background is in materials engineering, followed by the Erasmus Mundus Master's in Membrane Engineering for Sustainable Development, which took me through the University of Twente, Universidad de Zaragoza and Université de Montpellier. This path developed my interest in membrane materials, in separation technologies and in how advanced materials can help with environmental and energy challenges.

## The network

PhotoBrane brings together experts in membrane technology, dye chemistry, photoswitches and computational chemistry from across Europe and beyond. As a doctoral researcher I receive training in areas such as molecular modeling and the synthesis of photoswitchable building blocks, and I work with researchers from very different fields. I am also the PhD student representative of the network, so I help the doctoral researchers stay in touch with each other.

I will use this blog to share what I learn along the way, from lab work to conferences and summer schools. If you work on membranes, photochemistry or a related topic and would like to talk, you can reach me through the icons at the top of the page.
`
    }
  ]
};
