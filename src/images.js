// NASA Images thumbnails: https://images-assets.nasa.gov/image/{id}/{id}~thumb.jpg
// All images are NASA public domain / freely licensed.
export const STOP_IMAGES = [
  null, // stop 0: overview — no gallery
  // stop 1: Sun
  [
    { id: 'GSFC_20171208_Archive_e000963', alt: 'Mid-level solar flare (SDO/NASA)' },
    { id: 'PIA03149',                      alt: 'Handle-shaped solar prominence' },
  ],
  // stop 2: Mercury
  [
    { id: 'PIA10173', alt: 'Mercury cratered surface (MESSENGER)' },
    { id: 'PIA10175', alt: 'Mercury revealed in new detail (MESSENGER)' },
  ],
  // stop 3: Venus
  [
    { id: 'PIA01544', alt: 'Venus cloud tops (Hubble)' },
    { id: 'PIA00256', alt: 'Venus surface map (Magellan)' },
  ],
  // stop 4: Earth
  [
    { id: 'GSFC_20171208_Archive_e001386', alt: 'Blue Marble 2012 (NASA/GSFC)' },
    { id: 'GSFC_20171208_Archive_e002131', alt: 'Blue Marble 2007 West (NASA/GSFC)' },
  ],
  // stop 5: Mars
  [
    { id: 'PIA01253', alt: 'Mars springtime (Hubble)' },
    { id: 'S91-32389', alt: 'Mars (Hubble Space Telescope)' },
  ],
  // stop 6: Asteroid Belt
  [
    { id: 'GSFC_20171208_Archive_e001341', alt: 'Asteroid P/2013 P5 — six comet tails (Hubble)' },
    { id: 'PIA10235',                      alt: 'Ceres colour view (Hubble)' },
  ],
  // stop 7: Jupiter
  [
    { id: 'GSFC_20171208_Archive_e000537', alt: 'Jupiter Great Red Spot (Hubble)' },
    { id: 'GSFC_20171208_Archive_e001095', alt: "Jupiter's shrinking Great Red Spot (Hubble)" },
  ],
  // stop 8: Saturn
  [
    { id: 'PIA01273', alt: 'Saturn rings edge-on (Hubble)' },
    { id: 'PIA05982', alt: 'Saturn from far and near (Hubble)' },
  ],
  // stop 9: Uranus
  [
    { id: 'PIA01282', alt: 'Uranus (Hubble)' },
    { id: 'PIA01280', alt: 'Uranus with rings (Hubble)' },
  ],
  // stop 10: Neptune
  [
    { id: 'PIA01285', alt: 'Neptune (Hubble)' },
    { id: 'PIA01492', alt: 'Neptune full disk (Voyager 2)' },
  ],
  // stop 11: Pluto
  [
    { id: 'PIA18179',                      alt: 'Pluto surface changes (Hubble)' },
    { id: 'GSFC_20171208_Archive_e000714', alt: 'Pluto and its chaotic moons (Hubble)' },
  ],
];
