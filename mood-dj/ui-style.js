// Mood DJ — styles du panneau (injectés dans un Shadow DOM pour ne pas
// interférer avec ceux de YouTube Music).
/* exported MDJ_CSS */
var MDJ_CSS = `
:host { all: initial; }
* { box-sizing: border-box; }
[hidden] { display: none !important; }
.root { font-family: Roboto, Arial, sans-serif; color: #fff; color-scheme: dark; font-size: 14px; }
svg { display: block; }
button { font-family: inherit; }

.launch { position: fixed; right: 20px; bottom: 88px; width: 52px; height: 52px; border-radius: 26px; border: none;
  background: #cc0000; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer;
  box-shadow: 0 4px 14px rgba(0,0,0,.5); z-index: 2147483000; }
.launch:hover { background: #e00000; }
.launch.on svg { animation: mdjspin 3s linear infinite; }
.launch.shift { right: 400px; }
@keyframes mdjspin { to { transform: rotate(360deg); } }

.panel { position: fixed; top: 64px; right: 0; bottom: 72px; width: 380px; max-width: 100vw; background: #181818;
  border-left: 1px solid #2c2c2c; display: flex; flex-direction: column; z-index: 2147482999;
  box-shadow: -8px 0 24px rgba(0,0,0,.35); }
.head { display: flex; align-items: center; justify-content: space-between; padding: 8px 6px 8px 16px; }
.brand { display: flex; align-items: center; gap: 10px; font-size: 18px; font-weight: 700; }
.logo { width: 30px; height: 30px; border-radius: 15px; background: #cc0000; display: flex; align-items: center; justify-content: center; }
.status { font-size: 12px; color: #aaaaaa; }
.iconbtn { width: 44px; height: 44px; border: none; background: transparent; color: #fff; border-radius: 22px;
  display: flex; align-items: center; justify-content: center; cursor: pointer; }
.iconbtn:hover { background: #2a2a2a; }
.tabs { display: flex; gap: 2px; padding: 0 8px; border-bottom: 1px solid #2c2c2c; }
.tabs { overflow-x: auto; scrollbar-width: none; }
.tab { flex: none; padding: 12px 7px; font-size: 14px; font-weight: 500; color: #aaaaaa; background: none; border: none;
  border-bottom: 2px solid transparent; cursor: pointer; }
.tab:hover { color: #fff; }
.tab.on { color: #fff; border-bottom-color: #ff3b3b; }
.body { flex: 1; overflow-y: auto; padding: 18px 16px; display: flex; flex-direction: column; gap: 20px; }
.body::-webkit-scrollbar { width: 8px; }
.body::-webkit-scrollbar-thumb { background: #3d3d3d; border-radius: 4px; }
.foot { padding: 12px 16px 16px; border-top: 1px solid #2c2c2c; display: flex; flex-direction: column; gap: 10px; }

.label { font-size: 13px; font-weight: 500; color: #aaaaaa; margin: 0; }
.label.white { color: #fff; font-size: 14px; }
.light { font-weight: 400; }
.muted { font-size: 12px; color: #aaaaaa; line-height: 1.45; }
.radiolog { display: flex; flex-direction: column; gap: 4px; margin-top: 8px; max-height: 180px; overflow-y: auto; }
.section { display: flex; flex-direction: column; gap: 10px; }
.row { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.row.start { justify-content: flex-start; }
.grow { flex: 1; min-width: 0; }

.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip { min-height: 40px; padding: 0 13px; border-radius: 20px; border: 1px solid #3d3d3d; background: #2a2a2a; color: #fff;
  font-size: 13px; font-weight: 500; cursor: pointer; }
.chip:hover { border-color: #5a5a5a; }
.chip.on { background: #fff; color: #0f0f0f; border-color: #fff; }
/* Mes ambiances : une pastille pour charger, une petite croix pour supprimer. */
.ambchip { display: inline-flex; align-items: center; min-height: 40px; border-radius: 20px; border: 1px solid #3d3d3d; background: #2a2a2a; }
.ambchip:hover { border-color: #5a5a5a; }
.ambchip.on { background: #fff; border-color: #fff; }
.ambchip button { border: none; background: transparent; color: #fff; cursor: pointer; font-family: inherit; }
.ambchip.on button { color: #0f0f0f; }
.ambload { padding: 0 6px 0 14px; min-height: 38px; font-size: 13px; font-weight: 500; }
.ambdel { width: 30px; height: 30px; margin-right: 4px; border-radius: 15px; display: flex; align-items: center; justify-content: center; opacity: .7; }
.ambdel:hover { opacity: 1; background: rgba(128,128,128,.25); }
.ambload:focus-visible, .ambdel:focus-visible { outline: 2px solid #ff3b3b; outline-offset: 1px; }

.input { flex: 1; min-width: 0; height: 44px; background: #2a2a2a; border: 1px solid #3d3d3d; border-radius: 8px; color: #fff;
  font: inherit; font-size: 14px; padding: 0 12px; }
.input::placeholder { color: #9e9e9e; }
.input:focus, .select:focus, .chip:focus-visible, .btn:focus-visible, .tab:focus-visible, .switch:focus-visible, .iconbtn:focus-visible, .sq:focus-visible {
  outline: 2px solid #ff3b3b; outline-offset: 1px; }
.select { width: 100%; height: 44px; background: #2a2a2a; border: 1px solid #3d3d3d; border-radius: 8px; color: #fff;
  font: inherit; font-size: 14px; padding: 0 10px; }
.sq { width: 44px; height: 44px; flex: none; border-radius: 8px; border: none; background: #fff; color: #0f0f0f;
  display: flex; align-items: center; justify-content: center; cursor: pointer; }
.divider { display: flex; align-items: center; gap: 12px; color: #aaaaaa; font-size: 12px; }
.divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: #2c2c2c; }
input[type=range] { width: 100%; height: 28px; margin: 0; accent-color: #ff3b3b; cursor: pointer; }
/* Courbe d'énergie modifiable : des points ronds à faire glisser de haut en bas. */
.curvedit { position: relative; height: 80px; touch-action: none; cursor: ns-resize; border-radius: 6px; }
.curvedit:hover { background: rgba(255,59,59,.05); }
.curvedit.drag { background: rgba(255,59,59,.09); cursor: grabbing; }
.cdot { position: absolute; width: 14px; height: 14px; margin: -7px 0 0 -7px; border-radius: 7px; background: #ff3b3b;
  border: 2px solid #fff; pointer-events: none; box-shadow: 0 0 0 4px rgba(255,59,59,.25); }
.curvedit svg { position: absolute; inset: 0; }
.cpt { position: absolute; width: 18px; height: 18px; margin: -9px 0 0 -9px; padding: 0; border-radius: 9px;
  border: 2px solid #ff3b3b; background: #181818; cursor: ns-resize; touch-action: none; }
.cpt:hover, .cpt.drag { background: #ff3b3b; transform: scale(1.15); }
.curvedit.dense .cpt { width: 13px; height: 13px; margin: -6.5px 0 0 -6.5px; border-width: 2px; }.cpt:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
input[type=range].cyclebar.auto { accent-color: #8a8a8a; }
.ticklabels { position: relative; height: 14px; margin-top: -6px; font-size: 10.5px; color: #8a8a8a; }
.ticklabels span { position: absolute; transform: translateX(-50%); white-space: nowrap; }
.scale { display: flex; justify-content: space-between; font-size: 12px; color: #aaaaaa; }
.card { background: #212121; border-radius: 10px; padding: 14px; display: flex; flex-direction: column; gap: 10px; }
.card .row + .row { border-top: 1px solid #2c2c2c; padding-top: 6px; }
.keyblock { display: flex; flex-direction: column; gap: 8px; }
.keyblock + .keyblock { border-top: 1px solid #2c2c2c; padding-top: 12px; }
.card .keyblock .row + .row { border-top: none; padding-top: 0; }
.subhead { display: flex; flex-direction: column; gap: 2px; margin-top: 6px; padding-top: 10px; border-top: 1px solid #2c2c2c; }
.subhead > span:first-child { font-size: 13px; font-weight: 600; color: #fff; }
.card h2 + .subhead { border-top: none; padding-top: 0; margin-top: 0; }
.muted.warn { color: #ffb4a8; }
.section > .input, .section > .select { flex: none; }

.btn { height: 44px; padding: 0 16px; border-radius: 22px; border: 1px solid #4a4a4a; background: #2a2a2a; color: #fff;
  font-size: 14px; font-weight: 500; cursor: pointer; white-space: nowrap; }
.btn:hover { background: #333; }
.btn.small { height: 36px; padding: 0 12px; font-size: 13px; }
.btn.primary { border: none; background: #cc0000; font-weight: 700; }
.btn.primary:hover { background: #e00000; }
.btn:disabled { opacity: .5; cursor: default; }
.btns { display: flex; gap: 10px; flex-wrap: wrap; }
.btns .btn.grow { flex: 1; }
.voicepick { display: flex; gap: 8px; align-items: center; }
.qlock { color: #8ab4f8; font-size: 11px; }
.voicepick .select { flex: 1; min-width: 0; }

.seg { display: flex; gap: 3px; padding: 3px; border-radius: 23px; background: #2a2a2a; }
.seg button { flex: 1; min-height: 40px; border-radius: 20px; border: none; background: transparent; color: #fff;
  font-size: 13px; font-weight: 500; cursor: pointer; }
.seg button.on { background: #fff; color: #0f0f0f; }

.switch { width: 52px; height: 44px; flex: none; border: none; background: transparent; padding: 0; display: flex;
  align-items: center; justify-content: center; cursor: pointer; }
.switch .tr { position: relative; width: 44px; height: 26px; border-radius: 13px; background: #555; display: block; transition: background .15s; }
.switch .kn { position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; border-radius: 10px; background: #fff; display: block; transition: left .15s; }
.switch[aria-pressed="true"] .tr { background: #ff3b3b; }
.switch[aria-pressed="true"] .kn { left: 21px; }
.swtext { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.swtitle { font-size: 14px; font-weight: 500; }

.pills { display: flex; flex-wrap: wrap; gap: 6px; }
.pill { padding: 5px 10px; border-radius: 12px; background: #2a2a2a; font-size: 12px; }
.now { display: flex; gap: 14px; align-items: center; }
.art { width: 64px; height: 64px; flex: none; border-radius: 6px; background: #2a2a2a; display: flex; align-items: center;
  justify-content: center; color: #ff3b3b; overflow: hidden; }
.art img { width: 100%; height: 100%; object-fit: cover; }
.bar { height: 4px; border-radius: 2px; background: #3d3d3d; overflow: hidden; margin-top: 4px; }
.bar > div { height: 4px; background: #ff3b3b; width: 0; }
.accent { color: #ff6b6b; font-weight: 500; font-size: 12px; }
.big { font-size: 16px; font-weight: 500; line-height: 1.35; }

.qitem { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid #242424; }
.qtext { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.qt { font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.qa { font-size: 12px; color: #aaaaaa; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ebars { display: flex; align-items: flex-end; gap: 3px; height: 18px; flex: none; }
.ebars span { width: 4px; border-radius: 1px; background: #3d3d3d; display: block; }
.ebars span.on { background: #ff3b3b; }
.x { width: 32px; height: 32px; flex: none; border: none; background: transparent; color: #aaaaaa; border-radius: 16px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; }
.x:hover { background: #2a2a2a; color: #fff; }
.stat { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #aaaaaa; min-height: 16px; }

.toast { position: fixed; right: 20px; bottom: 150px; max-width: 340px; background: #2a2a2a; color: #fff; border: 1px solid #3d3d3d;
  border-radius: 10px; padding: 12px 14px; font-size: 13px; line-height: 1.4; display: flex; gap: 12px; align-items: center;
  box-shadow: 0 6px 20px rgba(0,0,0,.5); z-index: 2147483001; }
.toast.shift { right: 400px; }
.toast.shift.full { right: 28px; }

/* Pleine page : le panneau occupe la zone de contenu de YouTube Music (entre le bandeau du haut,
   le menu de gauche et le lecteur du bas). Les rubriques se rangent en colonnes. */
.panel.full { width: auto; max-width: none; border-left: none; box-shadow: none; background: #121212; }
.panel.full .head { padding: 10px 14px 6px 28px; }
.panel.full .tabs { padding: 0 20px; }
.panel.full .tab { padding: 14px 16px; font-size: 15px; }
.panel.full .body { padding: 24px 28px 32px; container-type: inline-size; }
.panel.full .radiolog { max-height: 460px; }
.panel.full .foot, .panel.full .mini { padding-left: 28px; padding-right: 28px; }
/* Pied de page en une ligne : le résumé à gauche, les boutons à droite. */
.panel.full .foot { flex-direction: row; align-items: center; flex-wrap: wrap; gap: 10px 24px; }
/* Changements d'ambiance en attente pendant une émission. */
.pendingamb { border: 1px solid rgba(255, 59, 59, .45); background: #2a1c1c; }
.foot .pendingamb { flex: 1 1 100%; }
.panel.full .foot > .muted { flex: 1 1 320px; }
.panel.full .foot > .btns { flex: 0 1 460px; margin-left: auto; }
.panel.full .foot > .btn { margin-left: auto; }
/* Mini-lecteur en barre unique (il remplace celui de YouTube Music quand celui-ci est masqué). */
.panel.full .mini { display: grid; grid-template-columns: minmax(220px, 1.1fr) auto minmax(220px, 2fr); align-items: center;
  gap: 4px 28px; padding-top: 8px; padding-bottom: 8px; }
.panel.full .mini > .row:first-child { order: 1; min-width: 0; }
.panel.full .mini > .ctrls { order: 2; }
.panel.full .mini > .seekrow { order: 3; }
.panel.full .mini > .muted { grid-column: 1 / -1; }
.panel.full .now .art { width: 112px; height: 112px; border-radius: 8px; }
.panel.full .card { padding: 18px; }

.cols { display: grid; grid-template-columns: repeat(var(--n, 1), minmax(0, 1fr)); gap: 24px 36px; align-items: start; }
.cols.n2 { --n: 2; }
.cols.n3 { --n: 3; }
.col { display: flex; flex-direction: column; gap: 20px; min-width: 0; }
.coltitle { font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #ff6b6b; margin-bottom: -8px; }
@container (max-width: 1080px) {
  .cols.n3 { --n: 2; }
  .cols.n3 > .col:last-child { grid-column: 1 / -1; }
}
@container (max-width: 700px) {
  .cols.n2, .cols.n3 { --n: 1; }
}
/* Ambiance en pleine page : départ à gauche, sélecteur en cinq colonnes au centre, énergie à droite. */
.ambgrid { display: grid; grid-template-columns: minmax(250px, 1fr) minmax(0, 2.8fr) minmax(270px, 1fr); gap: 24px 32px; align-items: start; }
.picker { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 14px; align-items: start; }
.pcol { display: flex; flex-direction: column; gap: 14px; min-width: 0; padding: 12px 10px; background: #181818;
  border: 1px solid #262626; border-radius: 10px; }
.pcol .section { gap: 8px; }
.pcol .chips { flex-direction: column; flex-wrap: nowrap; gap: 5px; }
.pcol .chip { width: 100%; min-height: 34px; padding: 6px 12px; text-align: left; border-radius: 17px; line-height: 1.25; }
.pcol .muted { font-size: 11.5px; }
@container (max-width: 1350px) {
  .ambgrid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ambgrid > .amid { grid-column: 1 / -1; order: -1; }
}
@container (max-width: 760px) {
  .ambgrid { grid-template-columns: minmax(0, 1fr); }
  .picker { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
.card > .subhead:first-child { border-top: none; padding-top: 0; margin-top: 0; }

/* Réglages en pleine page : un menu de rubriques à gauche. */
.regwrap { display: grid; grid-template-columns: 230px minmax(0, 1fr); gap: 36px; align-items: start; }
.subnav { display: flex; flex-direction: column; gap: 4px; position: sticky; top: 0; }
.subnav > button { display: flex; flex-direction: column; gap: 3px; text-align: left; padding: 11px 14px; border-radius: 8px; border: none;
  background: transparent; color: #aaaaaa; font: inherit; font-size: 14px; font-weight: 500; cursor: pointer; }
.subnav > button:hover { background: #1e1e1e; color: #fff; }
.subnav > button.on { background: #242424; color: #fff; box-shadow: inset 3px 0 0 #ff3b3b; }
.subnav > button:focus-visible { outline: 2px solid #ff3b3b; outline-offset: 1px; }
.subnav .hint { font-size: 12px; font-weight: 400; color: #8a8a8a; line-height: 1.35; }
.navfoot { padding: 14px 14px 0; }
.regmain { display: flex; flex-direction: column; gap: 20px; min-width: 0; container-type: inline-size; }
.regtitle { margin: 0; font-size: 20px; font-weight: 700; color: #fff; }
@container (max-width: 760px) {
  .regwrap { grid-template-columns: minmax(0, 1fr); gap: 20px; }
  .subnav { position: static; flex-direction: row; flex-wrap: wrap; }
  .subnav .hint, .navfoot { display: none; }
}
.toast button { flex: none; height: 34px; padding: 0 12px; border-radius: 17px; border: none; background: #fff; color: #0f0f0f;
  font-size: 13px; font-weight: 500; cursor: pointer; }
.empty { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }

.mini { border-top: 1px solid #2c2c2c; padding: 10px 12px 10px 14px; display: flex; flex-direction: column; gap: 4px; background: #141414; }
.rate { display: flex; flex: none; }
.histlist { display: flex; flex-direction: column; max-height: 320px; overflow-y: auto; }
.panel.full .histlist { max-height: 480px; }
.ambchip > span.ambload { display: inline-flex; align-items: center; color: #fff; font-size: 13px; font-weight: 500; }
.rate .iconbtn { width: 40px; height: 40px; }
.art.small { width: 40px; height: 40px; border-radius: 4px; }
.seekrow { gap: 8px; }
.tm { font-size: 11px; color: #aaaaaa; min-width: 36px; font-variant-numeric: tabular-nums; }
.seekrow .tm:last-child { text-align: right; }
input[type=range].seekbar { flex: 1; min-width: 0; height: 20px; }
.ctrls { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; }
.volbox { display: flex; align-items: center; min-width: 0; }
input[type=range].vol { width: 72px; height: 20px; }
.transport { display: flex; align-items: center; gap: 4px; }
.playbtn { width: 48px; height: 48px; border-radius: 24px; border: none; background: #fff; color: #0f0f0f; display: flex;
  align-items: center; justify-content: center; cursor: pointer; }
.playbtn:hover { background: #e6e6e6; }
.playbtn:focus-visible { outline: 2px solid #ff3b3b; outline-offset: 2px; }
`;
