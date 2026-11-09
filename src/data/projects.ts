export interface ProjectItem {
  slug: string;
  title: string;
  date: string;
  category: string;
  description: string;
  recognition: string[];
  author: string[];
  ruler: string[];
  colorA: string;
  colorB: string;
  colorC: string;
  img: string;
  visitUrl: string;
  story: string;
  gallery: string[];
}

export const PROJECTS: ProjectItem[] = [
  {
    slug: "fromanother",
    title: "FROMANOTHER",
    date: "April 2026",
    category: "Agency & Studio",
    description:
      "A fresh website for the creative agency fromanother, founded by two artists I’ve long admired, Vicki and Robin.",
    recognition: [
      "Awwwards Site of the Day",
      "Awwwards Site of the Month Nominee",
      "CSS Design Awards Website of the Day",
      "FWA of the Day",
    ],
    author: ["Design Direction", "Website Design"],
    ruler: ["Role"],
    colorA: "rgb(5, 18, 54)",
    colorB: "rgb(255, 253, 226)",
    colorC: "rgb(4, 87, 212)",
    img: "/assets/huyml/projects/01-fromanother.jpg",
    visitUrl: "https://fromanother.ca",
    story:
      "I’ve been following Vicki Dang and Robin Mahieux for a long time, so it was a great opportunity to redesign their studio’s site. The challenge was taking their unique, abstract branding and turning it into a smooth, seamless experience. Every part of the site, from the layout and text animation to the page transitions and hover effects, was carefully chosen to really match their personality.",
    gallery: [
      "/assets/huyml/playground/cs-1.jpg",
      "/assets/huyml/playground/cs-2.jpg",
      "/assets/huyml/playground/cs-3.jpg",
      "/assets/huyml/playground/cs-4.jpg",
      "/assets/huyml/playground/cs-5.jpg",
      "/assets/huyml/playground/cs-6.jpg",
    ],
  },
  {
    slug: "iventions",
    title: "IVENTIONS",
    date: "October 2025",
    category: "Promotional",
    description:
      "Teamed up with the Serious Business agency to build a new website for Iventions, an event agency based in Barcelona.",
    recognition: [
      "Awwwards Site of the Day",
      "Awwwards Site of the Month Nominee",
      "CSSDA Website of the Day",
      "CSSDA Website of the Month",
      "CSSDA Website of the Year Nominee",
    ],
    author: ["Serious Business", "Website Design"],
    ruler: ["Team", "Role"],
    colorA: "rgb(156, 147, 232)",
    colorB: "rgb(224, 255, 152)",
    colorC: "rgb(30, 30, 30)",
    img: "/assets/huyml/projects/02-iventions.jpg",
    visitUrl: "https://iventions.com",
    story:
      "Partnering with Serious Business in Munich, we crafted an energetic, spatially expressive website for Barcelona-based experiential agency Iventions. The interface uses kinetic typography and immersive scroll choreography to mirror the energy of live global events.",
    gallery: [
      "/assets/huyml/projects/02-iventions.jpg",
      "/assets/huyml/playground/pg-1.jpg",
      "/assets/huyml/playground/pg-4.webp",
      "/assets/huyml/playground/pg-8.webp",
    ],
  },
  {
    slug: "wonjyou",
    title: "WON J. YOU STUDIOS",
    date: "September 2025",
    category: "Personal Brand",
    description:
      "A website for Won J. You, a veteran designer and professor focused on training the next generation through coaching, education, and mentorship.",
    recognition: [
      "Webby Nominee",
      "Awwwards Site of the Day",
      "FWA of the Day",
      "CSSDA Website of the Day",
      "CSSDA Website of the Month Nominee",
    ],
    author: ["Design Direction", "Design Lead"],
    ruler: ["Role"],
    colorA: "rgb(239, 81, 67)",
    colorB: "rgb(254, 233, 206)",
    colorC: "rgb(255, 178, 97)",
    img: "/assets/huyml/projects/03-wonjyou.jpg",
    visitUrl: "https://wonjyou.com",
    story:
      "Designed an editorial, Swiss-grid-inspired digital home for veteran industrial designer and ArtCenter professor Won J. You. Warm vermilion accents and crisp typographic hierarchy bring clarity to decades of industrial design leadership and mentorship.",
    gallery: [
      "/assets/huyml/projects/03-wonjyou.jpg",
      "/assets/huyml/playground/pg-2.jpg",
      "/assets/huyml/playground/pg-5.webp",
      "/assets/huyml/playground/pg-11.jpg",
    ],
  },
  {
    slug: "miuxstudio",
    title: "MIUX STUDIO",
    date: "June 2025",
    category: "Agency & Studio",
    description:
      "Translated Thai-born founder Nara’s vision for her young UX studio into a digital experience.",
    recognition: [
      "Awwwards Site of the Day",
      "FWA of the Day",
      "CSSDA Website of the Day",
      "Behance UI Gallery",
    ],
    author: ["Design Direction", "Design Lead"],
    ruler: ["Role"],
    colorA: "rgb(185, 189, 171)",
    colorB: "rgb(213, 200, 176)",
    colorC: "rgb(158, 143, 123)",
    img: "/assets/huyml/projects/04-miuxstudio.jpg",
    visitUrl: "https://miux.studio",
    story:
      "An organic, tactile digital presence for MIUX Studio. Using muted earth tones, custom micro-interactions, and fluid page transitions, we built a serene yet memorable showcase of their product design work.",
    gallery: [
      "/assets/huyml/projects/04-miuxstudio.jpg",
      "/assets/huyml/playground/pg-6.webp",
      "/assets/huyml/playground/pg-9.webp",
    ],
  },
  {
    slug: "markwoodland",
    title: "MARK WOODLAND",
    date: "October 2025",
    category: "Personal Brand",
    description:
      "Working with the talented team at Uncommon Studio to reshape entrepreneur Mark Woodland’s digital presence.",
    recognition: [
      "FWA of the Day",
      "CSSDA Website of the Day",
      "Behance UI Gallery",
    ],
    author: ["Uncommon Studio", "Interaction", "Showcase"],
    ruler: ["Team", "Role"],
    colorA: "rgb(0, 112, 255)",
    colorB: "rgb(7, 7, 7)",
    colorC: "rgb(26, 44, 70)",
    img: "/assets/huyml/projects/05-markwoodland.jpg",
    visitUrl: "https://markwoodland.com.au",
    story:
      "Collaborated with Melbourne’s Uncommon Studio to craft a narrative-driven personal platform for entrepreneur and investor Mark Woodland, blending documentary photography with high-contrast editorial storytelling.",
    gallery: [
      "/assets/huyml/projects/05-markwoodland.jpg",
      "/assets/huyml/playground/pg-3.jpg",
      "/assets/huyml/playground/pg-12.jpg",
    ],
  },
  {
    slug: "eislab",
    title: "EISLAB",
    date: "February 2025",
    category: "Food & Beverage",
    description:
      "Refreshed the digital identity for this German ice cream brand, transforming a more colorful and tasteful website experience.",
    recognition: [
      "Awwwards Site of the Day",
      "FWA of the Day",
      "CSSDA Website of the Day",
    ],
    author: ["Art Director", "Design Direction", "Design Lead"],
    ruler: ["Role"],
    colorA: "rgb(199, 179, 255)",
    colorB: "rgb(28, 20, 86)",
    colorC: "rgb(247, 226, 115)",
    img: "/assets/huyml/projects/06-eislab.jpg",
    visitUrl: "https://eislab.de",
    story:
      "Reimagined the digital flavor of German artisanal gelato makers Eislab. Playful pastel palettes, custom illustrations, and tactile scoop interactions turn browsing flavors into an appetite-inducing journey.",
    gallery: [
      "/assets/huyml/projects/06-eislab.jpg",
      "/assets/huyml/playground/pg-7.webp",
      "/assets/huyml/playground/pg-10.webp",
    ],
  },
  {
    slug: "mat-voyce",
    title: "MAT VOYCE",
    date: "January 2025",
    category: "Portfolio",
    description:
      "A new home for the moving work of legendary type designer Mat Voyce, built to push the boundaries of creativity and performance.",
    recognition: [
      "Awwwards Site of the Day",
      "Awwwards Typography Honors",
      "FWA of the Day",
      "CSSDA Website of the Day",
      "GSAP Site of the Year Nominee",
      "Good Design Award Green Tick",
      "AGDA Awards Merit",
    ],
    author: ["Uncommon", "Design Direction", "Website Design"],
    ruler: ["Team", "Role"],
    colorA: "rgb(0, 211, 255)",
    colorB: "rgb(223, 255, 107)",
    colorC: "rgb(3, 3, 3)",
    img: "/assets/huyml/projects/07-mat-voyce.jpg",
    visitUrl: "https://matvoyce.tv",
    story:
      "Known globally for his kinetic typography and expressive character animations, Mat Voyce needed a portfolio that felt alive. Built alongside Uncommon, every scroll, cursor movement, and transition celebrates motion type at 60fps.",
    gallery: [
      "/assets/huyml/projects/07-mat-voyce.jpg",
      "/assets/huyml/playground/pg-13.jpg",
      "/assets/huyml/playground/pg-14.webp",
    ],
  },
  {
    slug: "defiant",
    title: "DEFIANT",
    date: "January 2025",
    category: "Venture Capital",
    description:
      "A website designed to mirror the brand's minimal, clean identity and help them stand out from traditional VC firms.",
    recognition: ["CSSDA Website of the Day", "Behance UI Gallery"],
    author: ["Art Director", "Website Design", "Showcase"],
    ruler: ["Role"],
    colorA: "rgb(60, 40, 227)",
    colorB: "rgb(255, 255, 255)",
    colorC: "rgb(15, 15, 15)",
    img: "/assets/huyml/projects/08-defiant.jpg",
    visitUrl: "https://defiant.vc",
    story:
      "Breaking away from corporate venture capital clichés, Defiant pairs electric cobalt accents with razor-sharp grotesque typography and a structured grid that foregrounds founder conviction.",
    gallery: [
      "/assets/huyml/projects/08-defiant.jpg",
      "/assets/huyml/playground/pg-1.jpg",
      "/assets/huyml/playground/pg-6.webp",
    ],
  },
  {
    slug: "by-kin",
    title: "BY 'KIN",
    date: "November 2024",
    category: "Agency & Studio",
    description:
      "Crafted a playful digital experience for Manchester-based interior and brand studio kin, featuring the layout switch that reflect the studio’s multifaceted personality.",
    recognition: [
      "Awwwards Site of the Day",
      "FWA of the Day",
      "CSSDA Website of the Day",
      "Behance UI Gallery",
    ],
    author: ["Art Director", "Website Design", "Showcase"],
    ruler: ["Role"],
    colorA: "rgb(255, 101, 66)",
    colorB: "rgb(244, 242, 237)",
    colorC: "rgb(250, 237, 188)",
    img: "/assets/huyml/projects/09-by-kin.jpg",
    visitUrl: "https://bykin.co.uk",
    story:
      "Manchester-based interior architecture and brand studio 'kin bridges physical spaces and graphic identities. We designed an interactive dual-mode layout switch that seamlessly reconfigures their project archive.",
    gallery: [
      "/assets/huyml/projects/09-by-kin.jpg",
      "/assets/huyml/playground/pg-4.webp",
      "/assets/huyml/playground/pg-11.jpg",
    ],
  },
  {
    slug: "serious-business",
    title: "SERIOUS BUSINESS",
    date: "August 2024",
    category: "Agency & Studio",
    description:
      "Got a chance to help Serious Business transform their new brand into a website that is delicious and makes “people want to lick”.",
    recognition: [
      "Awwwards Site of the Day",
      "Awwwards Business & Services Honors",
      "FWA of the Day",
      "CSSDA Website of the Day",
    ],
    author: ["Serious Business", "Website Design"],
    ruler: ["Team", "Role"],
    colorA: "rgb(251, 193, 212)",
    colorB: "rgb(195, 171, 255)",
    colorC: "rgb(252, 248, 236)",
    img: "/assets/huyml/projects/10-serious-business.jpg",
    visitUrl: "https://serious.business",
    story:
      "When Munich branding agency Serious Business rebranded around joyful radicalism, we translated their candy-colored identity and irreverent manifesto into a tactile, unforgettable agency flagship.",
    gallery: [
      "/assets/huyml/projects/10-serious-business.jpg",
      "/assets/huyml/playground/pg-5.webp",
      "/assets/huyml/playground/pg-8.webp",
    ],
  },
  {
    slug: "uncommon-studio",
    title: "UNCOMMON STUDIO",
    date: "July 2026",
    category: "Agency & Studio",
    description:
      "Designed a bespoke digital experience for Uncommon, a Melbourne-based studio serving clients worldwide.",
    recognition: ["Awwwards Site of the Day", "FWA of the Day"],
    author: ["Design Direction", "Website Design"],
    ruler: ["Role"],
    colorA: "rgb(18, 18, 18)",
    colorB: "rgb(255, 255, 255)",
    colorC: "rgb(214, 214, 214)",
    img: "/assets/huyml/projects/11-uncommon-studio.png",
    visitUrl: "https://uncommonstudio.com.au",
    story:
      "A refined monochromatic portfolio for Melbourne’s Uncommon Studio, letting bespoke WebGL interactions, micro-typography, and client work command full attention.",
    gallery: [
      "/assets/huyml/projects/11-uncommon-studio.png",
      "/assets/huyml/playground/cs-2.jpg",
      "/assets/huyml/playground/cs-5.jpg",
    ],
  },
  {
    slug: "ascon-system",
    title: "ASCON SYSTEMS",
    date: "August 2023",
    category: "Corporate",
    description:
      "Working with Serious Business to build a website for ASCon that stands out from the typical corporate template while staying clean and professional.",
    recognition: [
      "Awwwards Site of the Day",
      "CSSDA Website of the Day",
      "Behance Graphic Gallery",
    ],
    author: ["Serious Business", "Website Design"],
    ruler: ["Team", "Role"],
    colorA: "rgb(255, 90, 54)",
    colorB: "rgb(106, 109, 119)",
    colorC: "rgb(255, 255, 255)",
    img: "/assets/huyml/projects/12-ascon-system.jpg",
    visitUrl: "https://ascon-systems.de",
    story:
      "Industrial digital twin and automation technology explained through architectural layouts, modular diagrams, and confident industrial-orange accents.",
    gallery: [
      "/assets/huyml/projects/12-ascon-system.jpg",
      "/assets/huyml/playground/pg-2.jpg",
    ],
  },
  {
    slug: "mathijs-hanenkamp",
    title: "MATHIJS HANENKAMP",
    date: "February 2023",
    category: "Photography",
    description:
      "Bringing the vision and personality of portrait and documentary photographer Mathijs Hanenkamp into pixels by using smooth transitions to highlight his imagery.",
    recognition: [
      "FWA Site of the Day",
      "CSSDA Website of the Day",
      "Behance UI Gallery",
      "Webby Honoree",
    ],
    author: ["Art Director", "Website Design"],
    ruler: ["Role"],
    colorA: "rgb(34, 34, 34)",
    colorB: "rgb(240, 240, 240)",
    colorC: "rgb(255, 0, 0)",
    img: "/assets/huyml/projects/13-mathijs-hanenkamp.jpg",
    visitUrl: "https://mathijshanenkamp.com",
    story:
      "A cinema-grade monograph archive for Dutch documentary photographer Mathijs Hanenkamp, featuring seamless canvas-to-fullscreen image transitions.",
    gallery: [
      "/assets/huyml/projects/13-mathijs-hanenkamp.jpg",
      "/assets/huyml/playground/pg-3.jpg",
    ],
  },
  {
    slug: "rly-network",
    title: "RLY NETWORK",
    date: "October 2022",
    category: "Blockchain - Web3",
    description:
      "Together with SB to create an outstanding website that showcases the RLY network's value and ecosystem and encourages developers to build with the RLY protocol.",
    recognition: [
      "Webby Nominee",
      "Awwwards Site of the Day",
      "FWA of the Day",
      "CSSDA Website of the Day",
      "Behance UI Gallery",
    ],
    author: ["Serious Business", "Website Design"],
    ruler: ["Team", "Role"],
    colorA: "rgb(206, 255, 69)",
    colorB: "rgb(33, 33, 33)",
    colorC: "rgb(222, 222, 222)",
    img: "/assets/huyml/projects/14-rly-network.jpg",
    visitUrl: "https://rly.network",
    story:
      "Featured on Abduzeedo and nominated for a Webby Award, RLY Network pairs high-voltage acid lime visuals with approachable developer documentation.",
    gallery: [
      "/assets/huyml/projects/14-rly-network.jpg",
      "/assets/huyml/playground/pg-9.webp",
    ],
  },
  {
    slug: "huyml-2022",
    title: "HUYML VOL.1",
    date: "August 2022",
    category: "Portfolio",
    description:
      "My first ever portfolio in 2022. The one that completely changed my whole career.",
    recognition: [
      "Awwwards Site of the Day",
      "FWA of the Day",
      "CSSDA Website of the Month",
      "CSSDA Website of the Day",
      "CSSDA Website of the Year Nominee",
      "Behance UI Gallery",
    ],
    author: ["Art Director", "Website Design"],
    ruler: ["Role"],
    colorA: "rgb(26, 26, 26)",
    colorB: "rgb(201, 201, 201)",
    colorC: "rgb(255, 255, 255)",
    img: "/assets/huyml/projects/15-huyml-2022.jpg",
    visitUrl: "https://huyml.co",
    story:
      "Launched in August 2022, Vol. 1 was my very first personal portfolio—earning Awwwards Site of the Day, FWA of the Day, and CSSDA Website of the Month, opening doors to global collaborations.",
    gallery: [
      "/assets/huyml/projects/15-huyml-2022.jpg",
      "/assets/huyml/playground/pg-12.jpg",
    ],
  },
  {
    slug: "bison-studio",
    title: "BISON STUDIO",
    date: "February 2022",
    category: "Agency & Studio",
    description:
      "New look and feel for Bison to reflect their vision and position them as a creative and award-winning studio.",
    recognition: ["CSSDA Website of the Day", "Behance UI Gallery"],
    author: ["Art Director", "Website Design", "Showcase"],
    ruler: ["Role"],
    colorA: "rgb(186, 55, 55)",
    colorB: "rgb(38, 38, 38)",
    colorC: "rgb(255, 255, 255)",
    img: "/assets/huyml/projects/16-bison-studio.jpg",
    visitUrl: "https://bison.studio",
    story:
      "Bold editorial grids and deep crimson accents define the digital presence for creative studio Bison.",
    gallery: ["/assets/huyml/projects/16-bison-studio.jpg"],
  },
  {
    slug: "est-populo",
    title: "EST POPULO",
    date: "February 2022",
    category: "Agency & Studio",
    description:
      "A bold digital experience for Est Populo, a Swedish marketing agency, balancing clean Scandinavian aesthetics with editorial-style typography.",
    recognition: ["Behance UI Gallery"],
    author: ["District2 Studio", "Website Design"],
    ruler: ["Team", "Role"],
    colorA: "rgb(229, 227, 219)",
    colorB: "rgb(33, 33, 37)",
    colorC: "rgb(219, 216, 205)",
    img: "/assets/huyml/projects/17-est-populo.jpg",
    visitUrl: "https://estpopulo.se",
    story:
      "Created for Stockholm-based agency Est Populo, blending warm Nordic paper tones with expressive serif headlines.",
    gallery: ["/assets/huyml/projects/17-est-populo.jpg"],
  },
  {
    slug: "dafi",
    title: "DAFI TROPICDANE",
    date: "May 2019",
    category: "Furniture",
    description:
      "A minimal, Scandinavian-inspired website for DAFI, a Danish company specializing in high-quality indoor and outdoor furniture.",
    recognition: ["Behance UI Gallery", "Top 11 Vietnam Halo Dot Award"],
    author: ["District2", "Website Design", "Showcase"],
    ruler: ["Team", "Role"],
    colorA: "rgb(227, 232, 236)",
    colorB: "rgb(235, 232, 226)",
    colorC: "rgb(20, 20, 20)",
    img: "/assets/huyml/projects/18-dafi.jpg",
    visitUrl: "https://dafi.dk",
    story:
      "Tactile material photography and calm spatial rhythm for Danish indoor/outdoor furniture makers DAFI Tropicdane.",
    gallery: ["/assets/huyml/projects/18-dafi.jpg"],
  },
  {
    slug: "district2-studio",
    title: "DISTRICT2 STUDIO",
    date: "September 2019",
    category: "Agency & Studio",
    description:
      "Designing the new website for District2, the first studio I ever worked at and my very first creative website project.",
    recognition: [
      "Awwwards Site of the Day",
      "CSSDA Website of the Day",
      "Behance UI Gallery",
      "Top 40 Vietnam Halo Dot Award",
    ],
    author: ["District2", "Website Design", "Showcase"],
    ruler: ["Team", "Role"],
    colorA: "rgb(255, 255, 255)",
    colorB: "rgb(0, 0, 0)",
    colorC: "rgb(61, 61, 61)",
    img: "/assets/huyml/projects/19-district2-studio.jpg",
    visitUrl: "https://district2.studio",
    story:
      "Where it all began—designing the flagship site for District2 Studio in Ho Chi Minh City, earning my first Awwwards Site of the Day.",
    gallery: ["/assets/huyml/projects/19-district2-studio.jpg"],
  },
];

export interface AboutFactCard {
  id: string;
  label: string;
  title: string;
  description: string;
  image: string;
  rotation: number;
}

export const ABOUT_FACTS: AboutFactCard[] = [
  {
    id: "plant",
    label: "Plant Daddy",
    title: "Plant Daddy",
    description:
      "Turning my studio balcony in Saigon into a miniature tropical jungle—monstera, philodendrons, and caudex plants everywhere.",
    image: "/assets/huyml/about/about-1.jpg",
    rotation: -4,
  },
  {
    id: "gooner",
    label: "Gooner since the Invincibles",
    title: "Gooner since the Invincibles",
    description:
      "Supporting Arsenal FC since the 2003/04 unbeaten season. Late-night Premier League matches in HCMC are non-negotiable.",
    image: "/assets/huyml/about/about-2.jpg",
    rotation: 3.5,
  },
  {
    id: "married",
    label: "Married to a beautiful knitter",
    title: "Married to a beautiful knitter",
    description:
      "My wife Ha Nguyen (@theimpulsivestitch) is an incredible knitwear designer—and also the copywriter behind this portfolio.",
    image: "/assets/huyml/about/about-3.jpg",
    rotation: -3,
  },
  {
    id: "cats",
    label: "3 cats call him dad",
    title: "3 cats call him dad",
    description:
      "Sharing the desk (and keyboard) with three rescue cats who supervise every pixel and Zoom call.",
    image: "/assets/huyml/about/about-4.jpg",
    rotation: 4,
  },
  {
    id: "blackberry",
    label: "BlackBerry Collector",
    title: "BlackBerry Collector",
    description:
      "Obsessed with tactile physical keyboards and industrial hardware design from the golden era of BlackBerry Bold & Classic.",
    image: "/assets/huyml/about/about-5.jpg",
    rotation: -3.5,
  },
  {
    id: "pool",
    label: "Pool Player but Chicken level",
    title: "Pool Player (Chicken Level)",
    description:
      "Enthusiastic 8-ball & 9-ball player with the gear of a pro and the consistency of a rookie.",
    image: "/assets/huyml/about/about-6.jpg",
    rotation: 3,
  },
  {
    id: "watches",
    label: "into watches now...",
    title: "Into mechanical watches now...",
    description:
      "Fell down the vintage horology rabbit hole—appreciating micro-mechanical proportions, dials, and timeless typography.",
    image: "/assets/huyml/about/about-8.jpg",
    rotation: -4,
  },
];

export const AWARDS_RECOGNITIONS = [
  "Awwwards Independent of the Year Nominee (4)",
  "CSSDA Designer of the Year Nominee (3)",
  "Webby Nominee (2)",
  "Webby Honoree (2)",
  "Awwwards Site of the Month Nominees (4)",
  "Awwwards Site of the Day (13)",
  "CSSDA Website of the Month (2)",
  "CSSDA Website of the Day (14)",
  "FWA of the Day (12)",
  "Behance Feature (17)",
  "Good Design Awards",
  "Best Awards",
];

export const PUBLICATIONS_LINKS = [
  {
    title: "Codrops - Designer Spotlight",
    url: "https://tympanus.net/codrops/2025/03/21/designer-spotlight-huy-phan/",
  },
  {
    title: "Sandu Publishing: Interactive Design for Screen",
    url: "https://huyml.co",
  },
  {
    title: "Pint of Design | December 2024",
    url: "https://huyml.co",
  },
  {
    title: "Commarts: Mat Voyce",
    url: "https://www.commarts.com/webpicks/mat-voyce",
  },
  {
    title: "Commarts: Iventions",
    url: "https://www.commarts.com/webpicks/iventions",
  },
  {
    title: "Commarts: Won J. You Studios",
    url: "https://www.commarts.com/webpicks/won-j-you-studios",
  },
  {
    title: "Awwwards Case Study | Serious Business",
    url: "https://www.awwwards.com/redefining-serious-case-study.html",
  },
  {
    title: "Awwwards Case Study | Mat Voyce",
    url: "https://www.awwwards.com/case-study-mat-voyce-designing-a-digital-home-for-a-kinetic-creative.html",
  },
  {
    title: "Awwwards Case Study | Fromanother",
    url: "https://www.awwwards.com/designing-for-an-identity-that-shapeshifts.html",
  },
  {
    title: "Abduzeedo | RLY Network",
    url: "https://abduzeedo.com/rly-network-token-protocol-platform-brand-identity-serious-business",
  },
];

export const CAPABILITIES_LIST = [
  "Digital Art Direction",
  "Website Design",
  "Application Design",
  "Interactive Storytelling",
  "Website Motion & Animation",
  "Design System",
  "User Experience",
];

export const TRUSTED_BY_LIST = [
  "Unilever",
  "VinPearl",
  "Autonomous",
  "Soravia",
  "NanoTemper",
  "Arvid Nordquist",
  "Soluis Group",
  "Klingit",
  "ToyFight",
  "Stockfiller",
  "Serious Business",
  "and many more",
];

export const PROCESS_STEPS = [
  {
    code: "P1.",
    title: "Discovery",
    description: "Align on the brief, scope, budget and timeline.",
  },
  {
    code: "P2.",
    title: "One page first",
    description: "Usually the homepage to establish the direction.",
  },
  {
    code: "P3.",
    title: "Build the rest",
    description:
      "Complete the remaining pages with feedback and iterations once the direction is approved.",
  },
  {
    code: "P4.",
    title: "Mobile matters",
    description: "Adapt and refine the experience for mobile.",
  },
  {
    code: "P5.",
    title: "Final review",
    description: "Polish everything before development.",
  },
  {
    code: "P6.",
    title: "Pixels to production",
    description:
      "Work with either my long-term development team (run by my close friend) or your in-house developers to bring the design to life.",
  },
];

export interface PlaygroundItem {
  id: string;
  title: string;
  year: string;
  tag: string;
  src: string;
  aspect: string;
}

export const PLAYGROUND_ITEMS: PlaygroundItem[] = [
  {
    id: "pg-1",
    title: "Editorial Spread Exploration 01",
    year: "2025",
    tag: "Art Direction · Typography",
    src: "/assets/huyml/playground/pg-1.jpg",
    aspect: "4/3",
  },
  {
    id: "pg-2",
    title: "Kinetic Grid Concept — Type Specimen",
    year: "2025",
    tag: "Concept · Motion",
    src: "/assets/huyml/playground/pg-2.jpg",
    aspect: "16/10",
  },
  {
    id: "pg-3",
    title: "Monograph Portfolio Study",
    year: "2025",
    tag: "Web Design · Editorial",
    src: "/assets/huyml/playground/pg-3.jpg",
    aspect: "16/9",
  },
  {
    id: "pg-4",
    title: "Interactive Sound & Scroll Experiment",
    year: "2025",
    tag: "Interaction · Prototype",
    src: "/assets/huyml/playground/pg-4.webp",
    aspect: "4/3",
  },
  {
    id: "pg-5",
    title: "Brutalist Fashion Archive",
    year: "2024",
    tag: "Art Direction",
    src: "/assets/huyml/playground/pg-5.webp",
    aspect: "4/3",
  },
  {
    id: "pg-6",
    title: "Tactile Product Showcase",
    year: "2024",
    tag: "UI/UX · E-Commerce",
    src: "/assets/huyml/playground/pg-6.webp",
    aspect: "16/10",
  },
  {
    id: "pg-7",
    title: "Gelato Flavor Selector Concept",
    year: "2025",
    tag: "Visual Identity · Web",
    src: "/assets/huyml/playground/pg-7.webp",
    aspect: "4/3",
  },
  {
    id: "pg-8",
    title: "Spatial Exhibition Landing",
    year: "2024",
    tag: "Experimental · 3D",
    src: "/assets/huyml/playground/pg-8.webp",
    aspect: "16/10",
  },
  {
    id: "pg-9",
    title: "Web3 Protocol Visual System",
    year: "2024",
    tag: "Design System",
    src: "/assets/huyml/playground/pg-9.webp",
    aspect: "16/9",
  },
  {
    id: "pg-10",
    title: "Minimalist Architecture Monograph",
    year: "2024",
    tag: "Editorial · Grid",
    src: "/assets/huyml/playground/pg-10.webp",
    aspect: "4/3",
  },
  {
    id: "pg-11",
    title: "Swiss Poster Series — Saigon",
    year: "2023",
    tag: "Print · Graphic",
    src: "/assets/huyml/playground/pg-11.jpg",
    aspect: "4/3",
  },
  {
    id: "pg-12",
    title: "Audio Hardware Interface Study",
    year: "2023",
    tag: "Industrial UI",
    src: "/assets/huyml/playground/pg-12.jpg",
    aspect: "16/10",
  },
  {
    id: "pg-13",
    title: "Variable Font Playground",
    year: "2025",
    tag: "Typography · Code",
    src: "/assets/huyml/playground/pg-13.jpg",
    aspect: "4/3",
  },
  {
    id: "pg-14",
    title: "Dark Mode Creative Studio Concept",
    year: "2025",
    tag: "Art Direction",
    src: "/assets/huyml/playground/pg-14.webp",
    aspect: "16/10",
  },
  {
    id: "cs-1",
    title: "Fromanother — Identity & Motion Study",
    year: "2026",
    tag: "Selected Work Study",
    src: "/assets/huyml/playground/cs-1.jpg",
    aspect: "16/10",
  },
  {
    id: "cs-3",
    title: "Fromanother — Editorial Index Layout",
    year: "2026",
    tag: "Selected Work Study",
    src: "/assets/huyml/playground/cs-3.jpg",
    aspect: "16/10",
  },
];
