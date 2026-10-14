/* ==========================================================
   EDIT THIS FILE to update your site. No HTML needed.
   Copy one { ... }, block, paste it at the TOP of its list, change the text.
   ========================================================== */

var SITE = {
  name: "Md Abdur Rahman",
  email: "a.rahman.ru1@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/abdur-rahman-in/",
    orcid: "https://orcid.org/0009-0006-9225-6039",
    scholar: "https://scholar.google.com/citations?user=lPc2e-UAAAAJ&hl=en",
    researchgate: "https://www.researchgate.net/profile/Md-Abdur-Rahman-39",
    linkedinActivity: "https://www.linkedin.com/in/abdur-rahman-in/recent-activity/all/"
  }
};

/* ---------- CONFERENCES, SUMMER SCHOOLS, NETWORK MEETINGS (newest first) ----------
   photos: upload pictures to the "images" folder on GitHub, then list them like
   photos: [ { src: "images/girona-1.jpg", alt: "Short description of the photo" } ]
*/
var EVENTS = [
  {
    date: "28 Sep – 1 Oct 2026",
    title: "2nd PhotoBrane & Interfaces4Life Networking Meeting",
    place: "Zaragoza, Spain",
    role: "Participant",
    summary: "Joint networking meeting of the PhotoBrane Doctoral Network and Interfaces4Life, held at the I+D+i building in Zaragoza.",
    photos: []
  },
  {
    date: "31 Aug – 4 Sep 2026",
    title: "41st EMS Summer School: Membrane Technologies for Water Treatment",
    place: "University of Girona, Spain",
    role: "Participant",
    award: "Best Group of the Summer School, with team AQUA SALMS",
    summary: "The school covered membrane fundamentals, laboratory practice and full-scale implementation. In the group project, our team developed an application-oriented solution for treating landfill leachate so that it can be discharged safely into rivers. The work combined membrane technology, process engineering and water treatment.",
    photos: []
  },
  {
    date: "",
    title: "1st PhotoBrane Network Meeting (kick-off)",
    place: "Jena, Germany",
    role: "Elected PhD student representative of the network",
    summary: "At the kick-off meeting of the PhotoBrane Doctoral Network I was elected PhD student representative. I am the contact point for the doctoral researchers in the consortium and support communication and exchange across the network.",
    photos: []
  }
];

/* ---------- PUBLICATIONS (newest first) ---------- */
var PUBLICATIONS = [
  {
    title: "Covalent Organic Framework (COF) based mixed matrix membranes as an alternative solution for gas separation",
    authors: "J. Alom, M. A. Rahman, M. Hossein, …, B. Zornoza",
    venue: "Journal of Membrane Science",
    year: "2026",
    type: "Review article",
    summary: "A systematic review of COF-based mixed matrix membranes for gas separation. It covers the design principles and synthesis routes of COF fillers, structure–performance relationships in the polymer matrix, gas transport under practical conditions, and molecular modeling and machine-learning approaches for rational design.",
    doi: "https://doi.org/10.1016/j.memsci.2026.125620"
  }
];

/* ---------- LINKEDIN POSTS (newest first) ----------
   Three ways to add a post. Use whichever you like:
   1) Text card: fill title, short, text and links (as below).
   2) Official LinkedIn embed: on a PUBLIC post on a computer, click the ⋯ menu,
      choose "Embed this post", copy the address inside src="..." and paste it as
      embed: "https://www.linkedin.com/embed/feed/update/urn:li:share:XXXX"
   3) Automatic feed: see the instructions in news.html.
*/
var POSTS = [
  {
    date: "",
    title: "Best Group at the 41st EMS Summer School",
    short: "My team AQUA SALMS was selected Best Group at the EMS Summer School in Girona.",
    text: "My team AQUA SALMS and I were selected as the Best Group of the 41st EMS Summer School, “Membrane Technologies for Water Treatment”, at the University of Girona, Spain. Our group project treated landfill leachate water so that it can be discharged safely into rivers. It combined membrane technology, process engineering and water treatment. The school brought together early-career researchers and professionals, and mixed scientific fundamentals with hands-on lab work and insight into full-scale applications.",
    links: [ { label: "Related link", url: "https://lnkd.in/e-aH4YHQ" } ]
  },
  {
    date: "",
    title: "Elected PhD student representative of the PhotoBrane network",
    short: "I was elected PhD student representative of the MSCA Doctoral Network PhotoBrane at its kick-off meeting in Jena.",
    text: "At the kick-off meeting in Jena, I was elected PhD student representative of the MSCA Doctoral Network PhotoBrane. I am the contact point for the doctoral researchers in the consortium and I support communication and exchange across the network. PhotoBrane is funded by the Marie Skłodowska-Curie Actions under Horizon Europe. It brings together experts in membrane technology, dye chemistry, photoswitches and computational chemistry, and trains doctoral researchers in molecular modeling and in synthesizing photoswitchable building blocks for molecular layers and phototunable membranes.",
    links: [ { label: "PhotoBrane website", url: "https://photobrane-dn.eu/" } ]
  }
];

/* ---------- BLOG (newest first) ----------
   The Blog link appears in the menu as soon as this list has at least one post.
   To add a post, copy the block inside this comment, paste it BELOW the comment
   (before the closing bracket), and change the text.

   Writing tips for "body" (leave a blank line between paragraphs):
     ## A heading
     - a bullet point
     **bold**   *italic*   [link text](https://example.com)
     ![Short photo description](images/my-photo.jpg)      (upload the photo to the images folder)

  {
    id: "my-first-post",              // short, lowercase, no spaces: it becomes part of the web address
    title: "Title of the post",
    date: "October 2026",
    summary: "One sentence that appears in the list of posts.",
    body: `
First paragraph.

Second paragraph.

## A heading

Another paragraph.
`
  },
*/
var BLOG = [
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
];
