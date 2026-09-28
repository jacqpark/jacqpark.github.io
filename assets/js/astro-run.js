// Astro Run: easter-egg runner game on the landing page.
// Sprites are pixel grids traced from frontend-samples/game-astro-run-running-seq.png
// (standing pose, run strides from frames 1 and 7, knee-crossing pose drawn to match)
// and game-astro-run-assets.png (jump, crash, rockets, comet). The drifting poses (air*, fall, impact)
// are auto-traced from bouncy-assets.png.
// Palette keys: o outline, c/C monitor, s screen, y eyes, e smile, p/m suit, d/n far-side suit, h/r rocket.
(function () {
  var PAL = {
    o: '#171643', c: '#EBE3D9', C: '#D3C7C4', s: '#21435C', e: '#7AE7E3', y: '#7AE7E3',
    p: '#F3C0CE', m: '#B38DA3', d: '#D69CB2', n: '#94738A', h: '#E381A3', r: '#53487F'
  };
  var SPR = {
    stand: [
      '.......ooooooooooooooooooo..',
      '.......ooooooooooooooooooo..',
      '....ooooccccccccccccccccccoo',
      '...oooooccccccccccccccccccoo',
      '...ooCCCccssssssssssssssccoo',
      '...ooCCCccssssssssssssssccoo',
      '...ooCCCccssssssssssssssccoo',
      '...ooCCCccssssssssssssssccoo',
      '...ooCCCccssssyysssyysssccoo',
      '...ooCCCccssssyysssyysssccoo',
      '...ooCCCccssssssssssssssccoo',
      '...ooCCCccssssssssssssssccoo',
      '...ooCCCccssssesssssesssccoo',
      '...ooCCCccssssseeeeessssccoo',
      '..oooCCCccssssssssssssssccoo',
      '.ooooCCCccssssssssssssssccoo',
      '.ooooCCCccssssssssssssssccoo',
      '.oomooCCccccccccccccccccccoo',
      '.oommoCCccccccccccccccccccoo',
      '.ommoooooooooooooooooooooooo',
      '.oomoooooooooooooooooooooo..',
      '.oooooppppppppppppppoooooo..',
      '..ooooppppppppppppppoooooo..',
      'ooooppppppppmmmmmmppppppoooo',
      'ooppppppppppmmmmmmppppppppoo',
      'ooppppooppppmmmmmmppooppppoo',
      'ooppppooopppmmmmmmppooppppoo',
      'ooppppooopppmmmmmmppooppppoo',
      'ooppppooopppppppppppooppppoo',
      'ooppppooopppppppppppooppppoo',
      'ooppppooopppppppppppooppppoo',
      'ooppppooopppppppppppooppppoo',
      'ooppppooopppppppppppooppppoo',
      'ooppppooopppppppppppooppppoo',
      '..ooooooppppppppppppoooooo..',
      '..ooooooppppppppppppoooooo..',
      '......ooppppppppppppoo......',
      '......ooppppppppppppoo......',
      '....oopppppppoooppppppoo....',
      '....oopppppppoooppppppoo....',
      '....ooppppppooooppppppoo....',
      '....ooppppppooooppppppoo....',
      '....oommmmmmoooommmmmmoo....',
      '....oommmmmmoooommmmmmoo....',
      '....oommmmmmoooommmmmmoo....',
      '....oommmmmmoooommmmmmoo....',
      '....ooooooooo..ooooooooo....',
      '....ooooooooo..ooooooooo....'
    ],
    strideA: [
      '.............oooooooooooooooooo...',
      '.............oooooooooooooooooo...',
      '.........o..oooocooooooooooocccoo.',
      '.........ooooccccccccccccccccccoo.',
      '.........ooooccccssssssssssssccoo.',
      '.......oocCCCccccssssssssssssccoo.',
      '.......oocCCCccccssssssssssssccoo.',
      '.......oocCCCccccssssssssssssccoo.',
      '.......oocCCCccccsssyysssyyssccoo.',
      '.......oocCCCccccsssyysssyyssccoo.',
      '.......oocCCCccccssssssssssssccoo.',
      '.......oocCCCccccsssesssssessccoo.',
      '.....oooocCCCccccsssseeeeesssccoo.',
      '.....oommcCCCccccssssssssssssccoo.',
      '.....oommcCCCCcccssssssssssssccoo.',
      '.......mmoCCCCCccCCccccCCccCCccoo.',
      '........ooCCCCCccccccccccccccccoo.',
      '.......oooooCCCoooooooooooooooooo.',
      '.......oooooppoooooooooooooooooo..',
      '.....ooooooopppppppppppoooooooo...',
      '.....oooppppppppppppppppooooooo...',
      '..ooooppppppppppppmmmmpppooddddoo.',
      '..ooopppppppppppppmmmmpppooddddoo.',
      '..oooppppoooppppppmmmmpppooddddoo.',
      '..oooppppoooppppppmmmmppoooddddoo.',
      '..ooommmmoopppppppmmmmppoodddddoo.',
      '..oooppppoopppppppppppppooddddooo.',
      '..oooppppoopppppppppppppoooodoo...',
      '..oooppppoopppppppppppppooooooo...',
      '..ooooooooopppppppppppppooooooo...',
      '....ooooooopppppppppppppoo........',
      '.........oopppppppppppppooo.......',
      '.........ooppppppppppppppoo.......',
      '........oooppppppppppppppppoo.....',
      '.......ooooddddddooppppppppoo.....',
      '.....oonnddddddddooppppppppoo.....',
      '.....oonnddddddddooopppppppoo.....',
      '.....oonnddddddddooooppppppoo.....',
      '.....oonnndddddoo..ooppppppoo.....',
      '.....oonnnddddooo..oommmmmooo.....',
      '.....oonnnoooooo...oommmmmmoo.....',
      '.....oonnoooooo....oommmmmmoo.....',
      '.....ooooo.........oommmmmmoo.....',
      '.....ooooo.........oooooooooo.....',
      '...................oooooooooo.....',
      '..................................',
      '..................................'
    ],
    cross: [
      '.........o.oooooooooooooooooooooo.',
      '........oooooooooooooooooooooooooo',
      '.......ooooooooocooooooooooocccooo',
      '.......ooooooccccccccccccccccccooo',
      '......oooooooccccssssssssssssccooo',
      '.....oooocCCCccccssssssssssssccooo',
      '.....oooocCCCccccssssssssssssccooo',
      '.....oooocCCCccccssssssssssssccooo',
      '.....oooocCCCccccsssyysssyyssccooo',
      '.....oooocCCCccccsssyysssyyssccooo',
      '.....oooocCCCccccssssssssssssccooo',
      '....ooooocCCCccccsssesssssessccooo',
      '...oooooocCCCccccsssseeeeesssccooo',
      '...oooommcCCCccccssssssssssssccooo',
      '...oooommcCCCCcccssssssssssssccooo',
      '....ooommoCCCCCccCCccccCCccCCccooo',
      '.....oooooCCCCCccccccccccccccccooo',
      '.....oooooooCCCooooooooooooooooooo',
      '.....oooooooppoooooooooooooooooooo',
      '......ooooopppppppppppppooooooooo.',
      '.......oooopppppppppppoooooooooo..',
      '.........oopppppppmmmoppppoo......',
      '.........oopppppppmmmoppppoo......',
      '.......oooopppppppmmmoppppoo......',
      '......ooooopppppppmmmoppppooo.....',
      '.....oodddopppppppmmmopppppooo....',
      '....ooddddoppppppppppopppmpppoo...',
      '....ooddddoppppppppppopppmpppoo...',
      '.....oodddopppppppppppoppmpppoo...',
      '......oooooppppppppppppooooooo....',
      '.......oooopppppppppppppooooo.....',
      '..........oopppppppppppoooo.......',
      '..........oopppppppppppooooo......',
      '..........ooooooooopppoddddoo.....',
      '..........oopppppppoooddddddoo....',
      '..........oopppppppoodddddddoo....',
      '..........oopppppppoooddddddoo....',
      '..........oopppppppooodddddoo.....',
      '..........oopppppppooddddddoo.....',
      '..........oopppppppoodddddoo......',
      '..........ooppppppponnnnnnoo......',
      '..........oommmmmmmmmnnnnnoo......',
      '..........oommmmmmmmmonnnnoo......',
      '..........oommmmmmmmmoooooo.......',
      '..........oommmmmmmmmooooo........',
      '...........ooooooooooo............',
      '............ooooooooo.............'
    ],
    strideB: [
      '.............ooooooooooooooooo....',
      '.............oooooooooooooooooo...',
      '............ooooooooooooooooocc...',
      '.........oooooccccccccccccccccco..',
      '.........ooooccccsssssssssssscco..',
      '.......oocCCcccccsssssssssssscco..',
      '.......oocCCCccccsssssssssssscco..',
      '.......oocCCCccccsssssssssssscco..',
      '.......oocCCCccccsssyysssyysscco..',
      '.......oocCCCccccsssyysssyysscco..',
      '.......oocCCCccccsssssssssssscco..',
      '.......oocCCCccccsssesssssesscco..',
      '......ooocCCCccccsssseeeeessscco..',
      '......ommCCCCccccsssssssssssscco..',
      '......ommcccCccccsssssssssssscco..',
      '.......mmcccCccccCCCssssssssccco..',
      '........ooCCccccccccccccccccccco..',
      '.......ooooooooooooooooooooooooo..',
      '.......oooooopoooooooooooooooooo..',
      '.....oooopppppppccpppppoooooooo...',
      '....oooppppppppppppppppooooooooo..',
      '..oooodddppppppppmmmmmpppopppppoo.',
      '..oooddddppppppppmmmmmpppopppppoo.',
      '..oodddddppppppppmmmmmpppopppppoo.',
      '..oodddddooopppppmmmmmpooppppppoo.',
      '..oonnnnnooppppppmmmmmpoopppppooo.',
      '..oodddddooppppppppppppooppppoooo.',
      '..oodddddooppppppppppppoooppooo...',
      '..oodddddooppppppppppppoooooooo...',
      '..oooooooooppppppppppppoooooooo...',
      '....ooooooopppppppppppooo.........',
      '.........oopppppppppppoooo........',
      '.........opppppppppppppppo........',
      '.......oooppppppppoopppppooo......',
      '.......oopppppppooooddddddoo......',
      '......oopppppppoooodddddddoo......',
      '......oppppppppoooooddddddoo......',
      '....oooppppppppoooooddddddoo......',
      '..oooompppppppoo...oddddddoo......',
      '..ooommppppppoo....onnnnnnoo......',
      '..ooommmpppppo.....onnnnnnoo......',
      '..ooommmmmmoo......onnnnnnno......',
      '..oooommmmmoo......onnnnnnno......',
      '....ooommmmoo......ooooooooo......',
      '.....ooommmoo......ooooooooo......',
      '......ooooooo.....................',
      '......ooooooo.....................'
    ],
    jump: [
      '.............oooooooooooooooooooooo...',
      '.............oooooooooooooooooooooo...',
      '.........ooooooccccccccccccccccccoo...',
      '.........ooooooccccccccccccccccccoo...',
      '.........ooCCCCccssssssssssssssccoo...',
      '.........ooCCCCccssssssssssssssccoo...',
      '.........ooCCCCccssssssssssssssccoo...',
      '.........ooCCCCccssssssssssssssccoo...',
      '.........ooCCCCccssssssssssssssccoo...',
      '.........ooCCCCccssssyysssyysssccoo...',
      '.........ooCCCCccssssyysssyysssccoo...',
      '.........ooCCCCccssssssssssssssccoo...',
      '.........ooCCCCccssssssssssssssccoo...',
      '.........ooCCCCccssssesssssesssccoo...',
      '.........ooCCCCccssssseeeeessssccoo...',
      '........oooCCCCccssssssssssssssccoo...',
      '.......ooooCCCCccssssssssssssssccoo...',
      '.......oommCCCCccccccccccccccccccoo...',
      '.......oommCCCCccccccccccccccccccoo...',
      '.......oommoooooooooooooooooooooooo...',
      '.......oommooooooooooooooooooooooooo..',
      '.......ooooopppppppppppppppooooooooooo',
      '.....ooooppppppppppppppppppoooooopppoo',
      '.....ooooppppppppppmmmmmmppoooooopppoo',
      '.....ooppppppppppppmmmmmmppoopppppppoo',
      '.....ooppppppppppppmmmmmmppoopppppppoo',
      '.....ooppppooooppppmmmmmmppoopppppppoo',
      '.....ooppppooooppppmmmmmmppooppppppooo',
      '.....ooppppooooppppppppppppooooooooo..',
      '.....ooppppooooppppppppppppooooooooo..',
      '.....ooppppooooppppppppppppppppoo.....',
      '.....ooooooooooppppppppppppppppoo.....',
      '.....ooooooooooppppppppppppppppoo.....',
      '.............ooppppppppppppppppoo.....',
      '.............oopppppppoooooppppoo.....',
      '.............oooppppppoooooppppoo.....',
      '..............ooppppppooommppppoo.....',
      '..............ooppppppooommppppoo.....',
      '...........oooopppppppooommmmoooo.....',
      '...........oooopppppppooommmmoooo.....',
      '...........oommmmpppooooommmmoo.......',
      '...........oommmmpppoo.oommmmoo.......',
      '...........oommmmooo.....oooooo.......',
      '...........oommmmooo.....oooooo.......',
      '...........oommmmoo...................',
      '...........oooooooo...................',
      '...........oooooooo...................'
    ],
    crash: [
      '.......................oooooooooo.......',
      '................ooooooooooooooooo.......',
      '............oooooooooooocccccccoo.......',
      '............oooooccccccccccccccoo.......',
      '...........ooCccccccccccsssssccmo.......',
      '.......ooooooCccccsssssssssssscco.......',
      '.......oooCCCCccssssssssssssssccoo......',
      '.......oooCCCCccssssssssssssssccoo......',
      '........ooCCCCccssssssssssssssccoo......',
      '........ooCCCCccsssssssssessssccoo......',
      '........ooCCCCccssssssesseeessccoo......',
      '........ooCCCCccsssseeesssssssscoo......',
      '........ooCCCCcccssesssssssssssccoo.....',
      '........ooCCCCcccsssssseeesssssccoo.....',
      '.........oCCCCcccssssseeeeessssccoo.....',
      '.........ooCCCCccssssesssssssssccoo.....',
      '.........ooCCCCccssssssssssssscccoo.....',
      '.......ooooCCCCccssssssscccccccccoo.....',
      '.......ooooCCCCccccccccccccccccccoo.....',
      '.......ooooCCCCcccccccccccooooooooo.....',
      '.......ooooCCCCccccooooooooooooooooooooo',
      '.......oommooooooooooooooppppooooooooooo',
      '.......oommooooooooppppppppppoooooppppoo',
      '.......ooooooppppppppppmmmmppoopppppppoo',
      '.......oooopppppppppmmmmmmmppoopppppppoo',
      '......oooppppppppppppmmmmmmppoopppppppoo',
      '.....ooppppppppmoppppmmmmmmppooppooooooo',
      '.....ooppppppooooppppmmmmmmppooooooooooo',
      '.....ooppppooooooppppmmmmppppoooooo.....',
      '.....ooppppoommooopppppppppppoooooo.....',
      '.....ooppppoommoooppppppppppppppppooo...',
      '.....ooppppoommmooppppppppppppppppooo...',
      '.....oooooooommmoopppppppppppppppppoo...',
      '.....ooooooooooooopppppppppppppppppoo...',
      '...........oooooooopppppppoooopppppoo...',
      '.................oooppppppoooopppppoo...',
      '.................oooppppppoooopppppoo...',
      '.................oooppppppoooopppppoo...',
      '................oompppppppoooommmmmmmoo.',
      '................oommmmmmmmoooommmmmmmoo.',
      '................oommmmmmmoo.oommmmmmmoo.',
      '................oommmmmmmoo.oommmmmmmoo.',
      '................oommmmmmmoo.ooooooooooo.',
      '................ooooooooooo.ooooooooooo.',
      '................ooooooooooo.............'
    ],
    airUp: [
      '........ooooooooooooooooooo......',
      '.......ooooooooooooooooooooo.....',
      '.....ooooCccccccccccccccccooo....',
      '....oooooCCccccccccccccccccoo....',
      '...oooCCCcccCssssssssssssscoo....',
      '...ooCCCCcccCssssssssssssscoo....',
      '...ooCCCCcccCssssssssssssscoo....',
      '...ooCCCCcccCsssyysssyyssscoo....',
      '...ooCCCCcccCsssyysssyyssscoo....',
      '...ooCCCCcccCssssssssssssscoo....',
      '...ooCCCCcccCssssssssssssscoo....',
      '...ooCCCCcccCsssesssssessscoo....',
      '...ooCCCCcccCsssseeeeesssscoo....',
      '...ooCCCCcccCssssssssssssscoo....',
      '...oomCCCcccCssssssssssssscoo....',
      '..oooooCCCCccCCCCCCCCCCCCCcoooo..',
      '..oooooCCCCcccccccccccCCCcooooo..',
      'oooppoooooooooooooooooooooooopooo',
      'oopppmoooppmmmmmmmmmmmmoooopppmoo',
      'oopppppooppppppppppppppooopppppoo',
      'oopppppooppppppppppppppooppppppoo',
      'oopppppppppppppmmmmmmpppoppppppoo',
      'oopppppmpppppppmmmmmmppmopppppmoo',
      'oooppppopppppppmmmmmmppooppppcooo',
      '.ooomppooppppppmmmmmmppoopppoooo.',
      '..oooppooppppppmmmmmmppoocppooo..',
      '...ooooooppppppppppppppoooooo....',
      '....oooooppppppppppppppooooo.....',
      '.......ooppppppppppppppoo........',
      '.......ooppppppppppppppoo........',
      '.......ooppppppppppppppoo........',
      '.......oopppppppppppppooo........',
      '.......oomppppppppppppooo........',
      '.......ooppppppppppppppooo.......',
      '......ooopppppppppppppppoo.......',
      '......oopppppppoomppppppoo.......',
      '......oopppppppoooppppppoo.......',
      '......omppppppooooppppppoo.......',
      '......ommpppppoooomppppmoo.......',
      '......ommmmmmpoooommmmmmoo.......',
      '......ommmmmmoo.oommmmmoo........',
      '......ommmmmmo..oommmmmoo........',
      '......ommmmmmo..oommmmmoo........',
      '......ooommmmo..ooommmmoo........',
      '.......ooooooo...oooooooo........',
      '........ooooo.....oooooo.........'
    ],
    fall: [
      '........oooooooooooooooooooo....',
      '........oooooooooooooooooooo....',
      '.....oooooCccccccccccccccccooo..',
      '...oooooomCccccCcCCCCCcccCccoo..',
      '...oomCCCCccccssssssssssssscoo..',
      '...ooCCCCCcccCssssssssssssscoo..',
      '...ooCCCCCcccCssssssssssssscoo..',
      '...ooCCCCccccCsssyysssyyssscoo..',
      '...ooCCCCccccCsssyysssyyssscoo..',
      '...ooCCCCCcccCssseessssessscoo..',
      '...ooCCCCccccCssssssssssssscoo..',
      '...ooCCCCccccCssseeeeeeessscoo..',
      '..oooCCCCCcccCsssseeeeesssscoo..',
      '..oooCCCCCcccCssssssssssssscoo..',
      '..ommoCCCCCcccssssssssssssscoo..',
      '..ommomCCCCcccmmmmmoooooooccoo..',
      '..oomoopCpCccccccccccccccccooo..',
      '..ooooooomooooooooooooooooooooo.',
      '...oooooopoooooooooooooooooomooo',
      '.ooooppppppppppppppppppoooppppoo',
      'oooppppppppppppppppppppoopppppoo',
      'oopppppppppppppmmmmmmppoppppppoo',
      'oopppppppppppppmmmmmmppoppppppoo',
      'ooppppcooppppppmmmmmmppopppppmoo',
      'ooppppoopppppppmmmmmmpmoppppooo.',
      'ooppppoomppppppmmmmmppmocppooo..',
      'ooppppoompppppppppppppmoooooo...',
      '.oopppoompppppppppppppoooooo....',
      '.ooooooompppppppppppppoo........',
      '...ooooompppppppppppppoo........',
      '.......omppppppppppppooo........',
      '.......ooppppppppppppooo........',
      '.......oopppppppppppppoo........',
      '......oomppppppompppppmo........',
      '......oopppppppooppppppo........',
      '......ooppppppmooppppppo........',
      '.....oomppppppoooppppppoo.......',
      '.....oompppppoooomppppmoo.......',
      '.....oommmmmpooommmmmmoo........',
      '.....oommmmmoooommmmmoo.........',
      '.....oommmmmoo.ommmmmoo.........',
      '.....oommmmoo..ommmmmo..........',
      '......oommmoo..ooommmo..........',
      '.......oooooo...ooooo...........',
      '.......ooooo.....oooo...........'
    ],
    impact: [
      '.......oooooooooooooooooooo....',
      '.......ooooooooooooooooooooo...',
      '.....oooomCcccccccccccccccooo..',
      '....ooooomCCcccccccccccccccoo..',
      '...oooccCcccccssoooooooosocco..',
      '...ooCCCCCcccssssssssssssscco..',
      '...ooCCCCccccmsssssssssssscco..',
      '...ooCCCCccccmsssssssssssscco..',
      '...ooCCCCccccmssyyossyyysscco..',
      '...ooCCCCccccmssyyssssyysscco..',
      '...ooCCCCccccmsssssssssssscco..',
      '...ooCCCCccccmsssessssessscco..',
      '...ooCCCCccccmsseeeeeesssscco..',
      '..oooCCCCCcccmsssssssssssscco..',
      '..ommCCCCCcccmsssssssssssscco..',
      '..ommomCCCCccCsssssssssssscco..',
      '..ommooCCCCccccccccccccccccCo..',
      '..oomoomCmmCCCCCCCCCCCCCCCooo..',
      '..ooooooopoooooooooooooooooo...',
      '...ooooooppmmmmmmmmmmmoooooo...',
      '.oooopppppppppppppppppoooppooo.',
      'oooppppppppppppmmmmmppooppppmoo',
      'oopppppppppppppmmmmmppmopppppoo',
      'ooppppppoppppppmmmmmppmopppppoo',
      'ooppppoooppppppmmmmmppoomppppoo',
      'oopppooopppppppmmmmmppoooppppoo',
      'ooppppooppppppppppppppooopppooo',
      'ooppppooppppppppppppppooommooo.',
      'ooopppooppppppppppppppooooooo..',
      '.ooooooopppppppppppppooooooo...',
      '..oooooopppppppppppppoooo......',
      '......ooopppppppppppppooo......',
      '......oooppppppppppppppooo.....',
      '.....ooopppppppoopppppppoo.....',
      '....ooopppppppooomppppppmo.....',
      '....oompppppppooooppppppmo.....',
      '....oommppppppooooppppppoo.....',
      '....oommmppppoooommmmmpcoo.....',
      '....oommmmmmooooommmmmmoo......',
      '....oommmmmoo..oopmmmmoo.......',
      '....ooommmmmo...ooommmmoo......',
      '......ooooooo....oooooooo......',
      '......ooooooo....oooooooo......'
    ],
    airLeft: [
      '.........oooooooooooooooooo......',
      '.........ooooooooooooooooooo.....',
      '......oooooCccccccccccccccmoo....',
      '....oooooooCcCsssssssssssocCo....',
      '....ooCCCCCccossssssssssssCCo....',
      '....ooCCCCcccossssssssssssCCo....',
      '....ooCCCCcccossyyssssyyssCCo....',
      '....ooCCCCcccsssyyssssyyssmCo....',
      '....ooCCCCcccossssssssssssmCo....',
      '....ooCCCCcccosseessssssssmCo....',
      '....ooCCCCcccosssseeeeesssmCo....',
      '....ooCCCCcccosssseeeessssmCo....',
      '....ooCCCCcccssssssooossssmCo....',
      '...ommoCCpcCccsooooooooooocco....',
      '..ooooocpppcccccccccccccccCooooo.',
      '.oooomoooppmoooooooooooooooommooo',
      '.ooppppppppppppppppppmmoooomppmoo',
      'oopppppppppppppppppppppooopppppoo',
      'ompppppppppppppmmmmmpppopppppppoo',
      'oopppppooppppppmmmmmpppopppppppoo',
      'oopppooomppppppmmmmmppomppppppoo.',
      'ooppppoopppppppmmmmmpmomppppoooo.',
      '.oommmoopppppppppppppooooooooo...',
      '.ooooooopppppppppppppoooooooo....',
      '...ooooopppppppppppppoo..........',
      '......ooppppppppppppoo...........',
      '......oopppppppppppmoo...........',
      '......oopppppppppppoo............',
      '.....oompppppppppppmo............',
      '....oocppppppoopppppoo...........',
      '...ooopppppppoopppppoo...........',
      '...oopppppppooopppppoo...........',
      '...ommmppppoooppppppoo...........',
      '...ommmmmmoommmmmppoo............',
      '...ommmmmooommmmmooo.............',
      '...oommmmooommmmmoo..............',
      '....oommmssooommmo...............',
      '....ooooooo.ooommo...............',
      '.....ooooo...oooo................'
    ],
    airUpLeft: [
      '.......oooooooooooooooo......',
      '.....ooooccccccCCCCCccoo.....',
      '....oooomcCCCCCCCCCCcccoo....',
      '...oocCCcCsssssssssssscco....',
      '...ssCCCcCsssssssssssscco....',
      '...ssCCCccsssyssssyssscco....',
      '...ssCCCccsssyyssyyssscco....',
      '...ssCCCcCsssssssssssscco....',
      '...soCCCcCsssessssessscco....',
      '...ooCCCcCsssseeeesssscco....',
      '...ooCCCcCsssssssssssscco....',
      '..oooCCCcCsssssssssssmccooo..',
      '.oooooCCCcCCCCCCmmmmmcCCoooo.',
      'oopppooCmCCmmmmmmmmmomoooppoo',
      'ompppmoooommoooooooooooopppoo',
      'omppppmompppppppppppoommpppoo',
      'ompppppppppppmmmmmppoopppppoo',
      'oomppppppppppmmmmmppopppppmoo',
      '.ooopppopppppmmmmmpmoppppooo.',
      '...oomooppppppmmmpppopppoo...',
      '....oooopppppppppppoooooo....',
      '......sspppppppppppoo........',
      '......ssppppppppppmo.........',
      '......oompppppppppoo.........',
      '......ooopppppppppoo.........',
      '.....oomppppppppppoo.........',
      '.....oopppppmopppppo.........',
      '....ooppppppoopppppo.........',
      '....oCmpppppoopppppo.........',
      '....oCmmmmmoommpppoo.........',
      '....ommmmmooommmmoo..........',
      '....oommmmooommmoo...........',
      '.....oommmo.ommmoo...........',
      '......ooooo..ooooo...........',
      '......oooo....ooo............'
    ],
    airDownLeft: [
      '...........ooooo.............',
      '........oooooCmoooo..........',
      '.......ooooocccCcoooo........',
      '......ooCccccssscccoooo......',
      '......oCCCCccsssssCcccoooo...',
      '.....ooCCCccosssssssocCcooo..',
      '.....oCCCCccsssysssssssccCoo.',
      '.....oCCCCcosssyysssssssscoo.',
      '....ooCCCccssssssssseessscoo.',
      '....ooCCCcssssesssssessscoo..',
      '....oCCCccsssssesssssssmcoo..',
      '....CCCCccssssseeessssscco...',
      '.oooooCCCccssssssessssocmo...',
      'ooppoooomCcccCssssssssccoo...',
      'oppppoooCoooccccsssssocoooo..',
      'oppppmooppppmocccccooccooooo.',
      'oppppppopppppppmmCccccoooppoo',
      'oopppppmpppppmmmmmmooooppppoo',
      '.opppppppppppmmmmpppoopppppoo',
      '..oopppopppppmmmmpppmpppppmoo',
      '..oooooopppppmmmmpppoopppooo.',
      '....ooooppppppppppppooooooo..',
      '.......oppppppppppppooooo....',
      '.......ompppppppppppo........',
      '.......ooppppppppppoo........',
      '........oopppppppppooo.......',
      '.......oopppppppppppoo.......',
      '.......oppppppompppppoo......',
      '.......oppppppoopppppmo......',
      '.......oopppppoooppppmo......',
      '........ompppmmoommmmoo......',
      '........oommmmmoommmmoo......',
      '.........oommmmoommmoo.......',
      '..........oommmoommmo........',
      '..........oomoo.ooooo........',
      '...........ooo...oooo........'
    ],
    rocketS: [
      '.....oooo.....',
      '.....ohho.....',
      '....ohhhho....',
      '...ohhhhhho...',
      '...ohhhhhho...',
      '..oorrrrrrro..',
      '..oorrrrrrro..',
      '..oorrhhrrro..',
      '..oorrhhhrro..',
      '..oorrhhrrro..',
      '..oorrrrrrro..',
      '..oorrrrrrro..',
      '..oorrrrrrro..',
      '..oorrrrrrro..',
      'oooorrhhrrrooo',
      'ohhrrrhhrrrhho',
      'ohhhrrhhrrrhho',
      'ohhooohhooohho',
      'ohhooohho.ohho',
      'ooooooooo.oooo'
    ],
    rocketM: [
      '.......oooooo.......',
      '.......oooooo.......',
      '.......oohhoo.......',
      '.......oohhoo.......',
      '.....oohhhhhhoo.....',
      '.....oohhhhhhoo.....',
      '.....oohhhhhhoo.....',
      '.....oohhhhhhoo.....',
      '...oorrrrrrrrrroo...',
      '...oorrrrrrrrrroo...',
      '...oorrrrrrrrrroo...',
      '...oorrrhhhhrrroo...',
      '...oorrrhhhhrrroo...',
      '...oorrrhhhhrrroo...',
      '...oorrrhhhhrrroo...',
      '...oorrrrrrrrrroo...',
      '...oorrrrrrrrrroo...',
      '...oorrrrrrrrrroo...',
      '...oorrrrrrrrrroo...',
      '...oorrrrrrrrrroo...',
      'ooooorrrrhhrrrrooooo',
      'ooooorrrrhhrrrrooooo',
      'oohhhrrrrhhrrrrhhhoo',
      'oohhhrrrrhhrrrrhhhoo',
      'oohhhoooohhoooohhhoo',
      'oohhhoooohhoooohhhoo',
      'oooooo.oooooo.oooooo',
      'oooooo.oooooo.oooooo'
    ],
    rocketL: [
      '...........oooo..........',
      '...........oooo..........',
      '.........oohhhhoo........',
      '.........oohhhhoo........',
      '.......oohhhhhhhhoo......',
      '.......oohhhhhhhhoo......',
      '.....oohhhhhhhhhhhhoo....',
      '.....oohhhhhhhhhhhhoo....',
      '.....oohhhhhhhhhhhhoo....',
      '.....oohhhhhhhhhhhhoo....',
      '.....oorrrrrrrrrrrroo....',
      '.....oorrrrrrrrrrrroo....',
      '.....oorrrrrrrrrrrroo....',
      '.....oorrrrhhhhrrrroo....',
      '.....oorrrrhhhhrrrroo....',
      '.....oorrrrhhhhrrrroo....',
      '.....oorrrrhhhhrrrroo....',
      '.....oorrrrhhhhrrrroo....',
      '.....oorrrrrrrrrrrroo....',
      '.....oorrrrrrrrrrrroo....',
      '.....oorrrrrrrrrrrroo....',
      '.....oorrrrrrrrrrrroo....',
      '.....oorrrrrrrrrrrroo....',
      '.....oorrrrrrrrrrrroo....',
      'ooooooorrrrhhhhrrrroooooo',
      'ooooooorrrrhhhhrrrroooooo',
      'oohhhhhrrrrhhhhrrrrhhhhoo',
      'oohhhhhrrrrhhhhrrrrhhhhoo',
      'oohhhhhrrrrhhhhrrrrhhhhoo',
      'oohhhhhrrrrhhhhrrrrhhhhoo',
      'oohhhhooooohhhhoooohhhhoo',
      'oohhhhooooohhhhoooohhhhoo',
      'oohhhhooooohhhhoooohhhhoo',
      'oohhhhooooohhhhoooohhhhoo',
      'ooooooooooooooooooooooooo',
      'ooooooooooooooooooooooooo'
    ],
    comet: [
      '.............oooooooooooooooo....',
      '.............oooooooooooooooo....',
      '.............oohhhhhhhhhhhhho....',
      '.............oohhhhhhhhhhhhhooooo',
      '.............oohhhhhhhhhhhhhhhhoo',
      '.............ooooohhhhhhhhhhhhhoo',
      'oooooooooooo.oooooohhmeeeeeehhhoo',
      'ohhhoohhhhho.....oohheeeeeeehhhoo',
      'ohhhoohhhhho.....oohheeeeeeehhhoo',
      'ohhhoohhhhho.....oohheeeeeeehhhoo',
      'oooooohhhhho.oooooohheeeeeeehhhoo',
      '.....ooooooo.oooooohheeeeeeehhhoo',
      '.............oohhhhhhhmmmmhmooooo',
      '.............oohhhhhhhhhhhhhooooo',
      '.............oohhhhhhhhhhhhho....',
      '.............oooooooooooooooo....',
      '.............oooooooooooooooo....'
    ]
  };

  // Pre-render every grid to a 1px-per-cell canvas. [0] eyes on, [1] eyes off.
  var SP = {};
  Object.keys(SPR).forEach(function (k) {
    SP[k] = [false, true].map(function (blink) {
      var g = SPR[k], c = document.createElement('canvas'), x = c.getContext('2d');
      c.width = g[0].length;
      c.height = g.length;
      g.forEach(function (row, j) {
        for (var i = 0; i < row.length; i++) {
          if (row[i] === '.') continue;
          x.fillStyle = PAL[blink && row[i] === 'y' ? 's' : row[i]];
          x.fillRect(i, j, 1, 1);
        }
      });
      return c;
    });
  });

  // --- Idle astronaut. Drifts around a side margin on wide screens, stands at the bottom otherwise ---
  var egg = document.createElement('button');
  egg.type = 'button';
  egg.className = 'astro-egg';
  egg.setAttribute('aria-label', 'Play Astro Run');
  var eggCv = document.createElement('canvas'), eggCtx = eggCv.getContext('2d');
  var POSES = ['stand', 'airUp', 'fall', 'impact', 'airLeft', 'airUpLeft', 'airDownLeft'];
  // One canvas that fits every pose, so they all draw at the same scale.
  eggCv.width = Math.max.apply(null, POSES.map(function (k) { return SP[k][0].width; }));
  eggCv.height = Math.max.apply(null, POSES.map(function (k) { return SP[k][0].height; }));
  egg.appendChild(eggCv);
  document.body.insertBefore(egg, document.querySelector('.site-footer'));  // in flow on phones

  var eyesOff = false, pose = 'stand', flip = false;
  function drawEgg() {
    var im = SP[pose][+eyesOff];
    eggCtx.setTransform(flip ? -1 : 1, 0, 0, 1, flip ? eggCv.width : 0, 0);
    eggCtx.clearRect(0, 0, eggCv.width, eggCv.height);
    eggCtx.drawImage(im, (eggCv.width - im.width) >> 1, (eggCv.height - im.height) >> 1);
  }
  (function flicker() {
    eyesOff = !eyesOff;
    drawEgg();
    setTimeout(flicker, eyesOff ? 60 + Math.random() * 90 : 150 + Math.random() * 1600);
  })();

  // Pose for each 45 degree heading, counterclockwise from "moving right". [grid, mirrored]
  var HEADING = [['airLeft', 1], ['airUpLeft', 1], ['airUp', 0], ['airUpLeft', 0],
                 ['airLeft', 0], ['airDownLeft', 0], ['fall', 0], ['airDownLeft', 1]];
  function heading(vx, vy) { return HEADING[Math.round(Math.atan2(-vy, vx) / (Math.PI / 4)) & 7]; }  // screen y points down
  console.assert(heading(0, 1)[0] === 'fall' && heading(-1, -1)[0] === 'airUpLeft' && heading(1, 0)[1],
    'Astro Run: drift poses point the wrong way');
  var DRIFT = 40, PAD = 16;                       // css px/s, gap to the walls
  var calm = matchMedia('(prefers-reduced-motion: reduce)'), page = document.querySelector('main');
  var ex = PAD, ey = 1e9, vx = 0, vy = 0, hitT = 0, prevT, right = Math.random() < 0.5;  // side picked per load

  // New heading within 69 degrees of the wall's inward normal, so the path never settles into a loop.
  function bounce(nx, ny) {
    var a = Math.atan2(ny, nx) + (Math.random() - 0.5) * 2.4;
    vx = Math.cos(a) * DRIFT;
    vy = Math.sin(a) * DRIFT;
    hitT = 0.25;
  }

  (function drift(t) {
    requestAnimationFrame(drift);
    var dt = prevT == null ? 0 : Math.min(0.05, (t - prevT) / 1000);
    prevT = t;
    var r = page.getBoundingClientRect(), w = egg.offsetWidth;
    var minX = right ? r.right + PAD : PAD;
    var maxX = right ? document.documentElement.clientWidth - w - PAD : r.left - w - PAD;
    var maxY = innerHeight - egg.offsetHeight - PAD;
    if (maxX < minX || calm.matches) {             // no room beside the content: park (see CSS)
      if (egg.classList.contains('drift')) {
        egg.classList.remove('drift');
        egg.style.transform = '';
        pose = 'stand';
        flip = false;
        drawEgg();
      }
      return;
    }
    egg.classList.add('drift');
    if (!vx && !vy) { ex = right ? maxX : minX; ey = maxY; bounce(0, -1); }  // first frame: push off from the bottom outer corner
    ex += vx * dt;
    ey += vy * dt;
    if (ex < minX) { ex = minX; bounce(1, 0); } else if (ex > maxX) { ex = maxX; bounce(-1, 0); }
    if (ey < PAD) { ey = PAD; bounce(0, 1); } else if (ey > maxY) { ey = maxY; bounce(0, -1); }
    var h = heading(vx, vy);
    pose = (hitT -= dt) > 0 ? 'impact' : h[0];
    flip = hitT <= 0 && !!h[1];
    egg.style.transform = 'translate(' + Math.round(ex) + 'px,' + Math.round(ey) + 'px)';
    drawEgg();
  })();

  // --- Game ---
  // World is measured in sprite cells. H is the visible height, the ground sits 28 cells up.
  var G = 1100, V0 = 420;                        // jump peaks ~80 cells, ~0.76 s in the air
  var SPEED0 = 210, SPEED_MAX = 420, ACCEL = 6;  // cells/s
  var AX = 28, HIT_W = 19;                       // astronaut x and (forgiving) hitbox width
  var ROCKETS = [SP.rocketS[0], SP.rocketM[0], SP.rocketL[0]];
  // Stride, knees crossing, opposite stride, knees crossing. Far-side limbs are drawn darker (d, n).
  var RUN = [SP.strideA, SP.cross, SP.strideB, SP.cross];

  // One tap must clear the widest cluster (3 large rockets) even at the starting speed.
  var L = SP.rocketL[0];
  console.assert(
    2 * Math.sqrt(V0 * V0 - 2 * G * (L.height - 6)) / G * SPEED0 > (3 * L.width - 10) + HIT_W + 30,
    'Astro Run: jump too short for the widest rocket cluster');

  var ov = document.createElement('div');
  ov.className = 'astro-game';
  ov.hidden = true;
  ov.tabIndex = -1;
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-label', 'Astro Run. Tap, click, or press space to jump.');
  ov.innerHTML = '<canvas></canvas><button type="button" class="astro-close" aria-label="Close game">&times;</button>';
  document.body.appendChild(ov);
  var cv = ov.firstChild, ctx = cv.getContext('2d'), closeBtn = ov.lastChild;

  var coarse = matchMedia('(pointer: coarse)').matches;
  var H, GROUND, W, scale, st, raf, last, hi = 0;
  try { hi = +localStorage.getItem('astroRunHi') || 0; } catch (e) {}

  var stars = [];
  for (var i = 0; i < 70; i++) {
    stars.push({ x: Math.random() * 2000, y: Math.random(), z: 0.03 + Math.random() * 0.15,
                 c: ['#5EDCF4', '#F4D03F', '#F0A6CA'][i % 3] });
  }

  function resize() {
    var rot = coarse && innerHeight > innerWidth;  // portrait phone: rotate the game to landscape
    var w = rot ? innerHeight : innerWidth, h = rot ? innerWidth : innerHeight, dpr = devicePixelRatio || 1;
    ov.classList.toggle('rot', rot);
    ov.style.width = w + 'px';
    ov.style.height = h + 'px';
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    H = Math.max(200, h / 3);                     // ponytail: cap at 3 css px per cell on big screens
    GROUND = Math.round(H - 28);
    scale = cv.height / H;
    W = cv.width / scale;
  }

  function reset() {
    st = { y: 0, vy: 0, speed: SPEED0, dist: 0, obs: [], next: 150, over: false, overAt: 0 };
  }

  function score() { return Math.floor(st.dist / 20); }

  // Spawns a comet or a cluster of 1 to 3 rockets at the right edge. Returns its width.
  function spawn() {
    var x = W + 10;
    if (st.dist > 3000 && Math.random() < 0.3) {
      // Flies over a standing astronaut's head but across the jump peak, so any jump runs into it.
      st.obs.push({ img: SP.comet[0], x: x, y: GROUND - 87, hit: [15, 2, 17, 13] });
      return SP.comet[0].width;
    }
    var n = 1 + Math.floor(Math.random() * 3), w = 0;
    for (var k = 0; k < n; k++) {
      var im = ROCKETS[Math.floor(Math.random() * 3)];
      st.obs.push({ img: im, x: x + w, y: GROUND - im.height, hit: [3, 4, im.width - 6, im.height - 4] });
      w += im.width - 2;
    }
    return w;
  }

  function hits(o) {
    var ax = AX + 11, ab = GROUND - st.y - 2, at = ab - 41;
    var bx = o.x + o.hit[0], by = o.y + o.hit[1];
    return ax < bx + o.hit[2] && ax + HIT_W > bx && at < by + o.hit[3] && ab > by;
  }

  function update(dt) {
    st.speed = Math.min(SPEED_MAX, st.speed + ACCEL * dt);
    var dx = st.speed * dt;
    st.dist += dx;
    if (st.y > 0 || st.vy > 0) {                   // exact kinematics, same arc at any frame rate
      st.y += st.vy * dt - G * dt * dt / 2;
      st.vy -= G * dt;
      if (st.y <= 0) st.y = st.vy = 0;
    }
    st.obs.forEach(function (o) { o.x -= dx; });
    st.obs = st.obs.filter(function (o) { return o.x + o.img.width > 0; });
    // Gaps are at least 1.1 s, longer than a jump, so a landing never drops into a comet.
    if ((st.next -= dx) <= 0) st.next = spawn() + st.speed * (1.1 + Math.random() * 0.9);
    if (st.obs.some(hits)) {
      st.over = true;
      st.overAt = performance.now();
      if (score() > hi) {
        hi = score();
        try { localStorage.setItem('astroRunHi', hi); } catch (e) {}
      }
    }
  }

  function jump() {
    if (st.over) {
      if (performance.now() - st.overAt > 500) reset();
    } else if (st.y === 0) {
      st.vy = V0;
    }
  }

  function pad(n) { return ('0000' + n).slice(-5); }

  function text(s, x, y, font, color) {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(s, x, y);
  }

  function draw() {
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#0A0E27';
    ctx.fillRect(0, 0, W, H);

    ctx.globalAlpha = 0.7;
    stars.forEach(function (s) {
      ctx.fillStyle = s.c;
      ctx.fillRect(Math.round(((s.x - st.dist * s.z) % W + W) % W), Math.round(s.y * (GROUND - 10)), 1, 1);
    });
    ctx.fillStyle = '#5EDCF4';
    for (var x = -(st.dist % 23); x < W; x += 23) ctx.fillRect(Math.round(x), GROUND + 6, 7, 1);
    for (x = -((st.dist + 11) % 37); x < W; x += 37) ctx.fillRect(Math.round(x), GROUND + 13, 3, 1);
    ctx.globalAlpha = 1;
    ctx.fillRect(0, GROUND, W, 1);

    st.obs.forEach(function (o) { ctx.drawImage(o.img, Math.round(o.x), o.y); });
    var f = st.over ? SP.crash : st.y > 0 ? SP.jump
      : RUN[Math.floor(st.dist / 30) % 4];  // ~7 poses/s at start, ~14 at top speed
    var im = f[+eyesOff];
    ctx.drawImage(im, AX, Math.round(GROUND - st.y - im.height));

    var mono = '"Space Mono", monospace';
    ctx.textAlign = 'right';
    text('HI ' + pad(hi), W - 62, 20, '700 9px ' + mono, 'rgba(226, 213, 242, 0.62)');
    text(pad(score()), W - 12, 20, '700 9px ' + mono, '#5EDCF4');
    ctx.textAlign = 'center';
    if (st.over) {
      text('GAME OVER', W / 2, H * 0.36, '700 18px Tektur, monospace', '#F0A6CA');
      text((coarse ? 'TAP' : 'CLICK') + ' TO PLAY AGAIN', W / 2, H * 0.36 + 18, '8px ' + mono, '#E2D5F2');
    } else if (st.dist < 900) {
      text((coarse ? 'TAP' : 'CLICK') + ' TO JUMP THE ROCKETS', W / 2, H * 0.36, '8px ' + mono, '#E2D5F2');
      text('STAY LOW FOR COMETS', W / 2, H * 0.36 + 14, '8px ' + mono, '#E2D5F2');
    }
  }

  function loop(t) {
    var dt = last == null ? 0 : Math.min(0.05, (t - last) / 1000);
    last = t;
    if (!st.over) update(dt);
    draw();
    raf = requestAnimationFrame(loop);
  }

  function open() {
    ov.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    if (coarse && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().then(function () {
        return screen.orientation && screen.orientation.lock && screen.orientation.lock('landscape');
      }).catch(function () {});                  // iPhone has no fullscreen API; .rot covers it
    }
    resize();
    reset();
    last = null;
    raf = requestAnimationFrame(loop);
    ov.focus();
  }

  function close() {
    ov.hidden = true;
    document.documentElement.style.overflow = '';
    cancelAnimationFrame(raf);
    if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
    egg.focus();
  }

  egg.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  closeBtn.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
  ov.addEventListener('pointerdown', function (e) { e.preventDefault(); jump(); });
  document.addEventListener('keydown', function (e) {
    if (ov.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); jump(); }
  });
  addEventListener('resize', function () { if (!ov.hidden) resize(); });
})();
