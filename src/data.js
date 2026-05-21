export const D = Math.PI / 180;

// Orbital radii use power-0.4 compression so relative sizes look realistic
// (sun > jupiter >> earth) without going to true scale.
export const PD = [
  { name:'sun',     a:  0, e:0,     omega:0,        theta0:0,        r:10,  speed:0      },
  { name:'mercury', a: 14, e:0.206, omega: 29*D,    theta0: 25*D,    r:1.7, speed:0.040  },
  { name:'venus',   a: 22, e:0.007, omega: 55*D,    theta0:150*D,    r:2.3, speed:0.025  },
  { name:'earth',   a: 32, e:0.017, omega:103*D,    theta0: 65*D,    r:2.5, speed:0.018  },
  { name:'mars',    a: 48, e:0.093, omega:336*D,    theta0:-35*D,    r:1.9, speed:0.012  },
  { name:'jupiter', a: 85, e:0.049, omega: 14*D,    theta0:110*D,    r:5.5, speed:0.006  },
  { name:'saturn',  a:111, e:0.057, omega: 93*D,    theta0:-85*D,    r:4.8, speed:0.004  },
  { name:'uranus',  a:134, e:0.046, omega:173*D,    theta0:195*D,    r:3.2, speed:0.003  },
  { name:'neptune', a:153, e:0.010, omega: 48*D,    theta0:-155*D,   r:3.1, speed:0.0022 },
  { name:'pluto',   a:170, e:0.249, omega:224*D,    theta0:230*D,    r:1.2, speed:0.0018 },
];

// STOP_PLANET: null=overview, number=PD index, 'belt'=special
// STOP_SIDE:   +1=planet right (card left), -1=planet left (card right), 0=centred
export const STOP_PLANET = [null,  0,   1,   2,   3,   4, 'belt',  5,   6,   7,   8,   9];
export const STOP_SIDE   = [   0, +1,  -1,  +1,  -1,  +1,    +1,  -1,  +1,  -1,  +1,  -1];
