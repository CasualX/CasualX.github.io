"use strict"

let chcs = (function(){
	let t_string = {
		type: "string",
	};
	let t_bool = {
		type: "bool",
		variants: ["false", "true"],
	};
	let t_color = {
		type: "color",
	};
	let t_float = {
		type: "float",
	};
	let t_int = {
		type: "int",
	};
	let t_key = {
		type: "key",
	};
	let t_region = {
		type: "enum",
		variants: ["ne", "n", "nw", "e", "c", "w", "se", "s", "sw"],
	};
	let t_skins = {
		type: "enum",
		variants: ["local", "friends", "team", "none"],
	};
	let t_knife = {
		type: "enum",
		variants: ["false", "bayonet", "butterfly", "flip", "gut", "huntsman", "karambit", "m9", "falchion", "daggers", "bowie"],
	};
	let t_norecoil = {
		type: "enum",
		variants: ["false", "rcs", "true", "psilent"],
	};
	let t_novisrecoil = {
		type: "enum",
		variants: ["false", "jitter", "true"],
	};
	let t_antiaim = {
		type: "enum",
		variants: ["off", "spin", "flip", "alt"],
	};
	let t_nospread = {
		type: "enum",
		variants: ["false", "true", "psilent", "pspread"],
	};
	let t_xhair = {
		type: "enum",
		variants: ["false", "recoil", "true", "3d"],
	};
	let t_rcs_smooth = {
		type: "enum",
		variants: ["linear", "bezier", "bspline"],
	};
	let t_toggle = {
		type: "enum",
		variants: ["off", "always", "hold", "hold_inv", "disable", "enable", "toggle"],
	};
	let t_trbot = {
		type: "enum",
		variants: ["false", "true", "seed"],
	};
	let t_csknife = {
		type: "enum",
		variants: ["false", "stab", "smart"],
	};
	let t_hsonly = {
		type: "enum",
		variants: ["false", "onkill", "true"],
	};
	let t_trburst = {
		type: "enum",
		variants: ["false", "auto", "true"],
	};
	let t_espfeature = {
		type: "flags",
		variants: ["clear", "bounds", "bones", "aim", "visible", "icon", "barrel", "select", "trace", "tag_square", "tag_triangle", "tag_plus", "tag_cross", "name", "class", "hptext", "weapon", "dist", "info", "textbg", "health", "style"],
	};
	let t_espsound = {
		type: "enum",
		variants: ["false", "local", "foe", "true"],
	};
	let t_bhop = {
		type: "enum",
		variants: ["false", "scroll", "true"],
	};
	let t_speed = {
		type: "enum",
		variants: ["timescale", "platform", "pspeed"],
	};
	let t_freeze = {
		type: "enum",
		variants: ["drop", "smac", "tc"],
	};
	let t_aim = {
		type: "enum",
		variants: ["false", "silent", "psilent", "feedback", "true"],
	};
	let t_smooth = {
		type: "enum",
		variants: ["linear", "log", "square", "wave", "root"],
	};
	let t_autofire = {
		type: "enum",
		variants: ["false", "true", "aim"],
	};
	let t_autotrack = {
		type: "enum",
		variants: ["false", "first_shot", "true"],
	};
	let t_rclamp = {
		type: "enum",
		variants: ["false", "spill", "true"],
	};
	let t_rshape = {
		type: "enum",
		variants: ["rect", "round"],
	};
	let t_rstyle = {
		type: "enum",
		variants: ["clear", "dot", "icon1", "icon2", "icon1+hp", "icon2+hp"],
	};
	let t_namer = {
		type: "enum",
		variants: ["idle", "track", "spam"],
	};
	let t_vis = {
		type: "enum",
		variants: ["normal", "overdraw", "batching", "wireframe"],
	};
	let t_restrict = {
		type: "enum",
		variants: ["panic", "safe", "legit", "rage", "unsafe"],
	};
	let t_mdx = {
		type: "enum",
		variants: ["false", "bhop", "true"],
	};


let cvars = {
	"config.spec": { type: t_string, default: "" },
	"info.enable": { type: t_bool, default: "false" },
	"info.region": { type: t_region, default: "e" },
	"info.verbose": { type: t_bool, default: "true" },
	"info.bomb": { type: t_bool, default: "false" },
	"traject.enable": { type: t_bool, default: "false" },
	"traject.debug": { type: t_bool, default: "false" },
	"traject.colors.path": { type: t_color, default: "[0,255,0,128]" },
	"traject.colors.impact": { type: t_color, default: "[255,0,0]" },
	"hit.sound": { type: t_bool, default: "false" },
	"hit.sndfile": { type: t_string, default: "" },
	"hit.marker": { type: t_bool, default: "false" },
	"hit.impacts": { type: t_bool, default: "false" },
	"hit.show": { type: t_bool, default: "false" },
	"hit.alt": { type: t_bool, default: "false" },
	"hit.fadetime": { type: t_float, default: "1.500000", range: { min: 0.000000, max: 179.000000 } },
	"skins.enable": { type: t_bool, default: "false" },
	"skins.debug": { type: t_bool, default: "false" },
	"skins.knife": { type: t_knife, default: "false" },
	"skins.filter": { type: t_skins, default: "local" },
	"skins.stock": { type: t_bool, default: "true" },
	"hints.enable": { type: t_bool, default: "false" },
	"hints.debug": { type: t_bool, default: "false" },
	"hints.aimspots": { type: t_bool, default: "false" },
	"game.fov": { type: t_float, default: "0.000000", range: { min: 0.000000, max: 179.000000 } },
	"game.timeout": { type: t_bool, default: "false" },
	"game.radar": { type: t_bool, default: "false" },
	"game.noflash": { type: t_bool, default: "false" },
	"game.maxflash": { type: t_float, default: "255.000000", range: { min: 0.000000, max: 255.000000 } },
	"game.nofog": { type: t_bool, default: "false" },
	"game.showranks": { type: t_bool, default: "false" },
	"game.loadout": { type: t_bool, default: "true" },
	"misc.norecoil": { type: t_norecoil, default: "false" },
	"misc.novisrecoil": { type: t_novisrecoil, default: "false" },
	"misc.nospread": { type: t_nospread, default: "false" },
	"misc.antiaim": { type: t_antiaim, default: "off" },
	"misc.xhair": { type: t_xhair, default: "false" },
	"misc.rcs.debug": { type: t_bool, default: "false" },
	"misc.rcs.pitch": { type: t_float, default: "1.000000", range: { min: 0.000000, max: 1.000000 } },
	"misc.rcs.yaw": { type: t_float, default: "0.500000", range: { min: 0.000000, max: 1.000000 } },
	"misc.rcs.interp": { type: t_rcs_smooth, default: "bezier" },
	"misc.rcs.smooth": { type: t_float, default: "0.500000", range: { min: 0.000000, max: 1.000000 } },
	"misc.rcs.jitter": { type: t_float, default: "0.100000", range: { min: 0.000000, max: 1.000000 } },
	"misc.rcs.drift": { type: t_float, default: "0.100000", range: { min: 0.000000, max: 1.000000 } },
	"trbot.enable": { type: t_bool, default: "false" },
	"trbot.debug": { type: t_bool, default: "false" },
	"trbot.toggle.mode": { type: t_toggle, default: "off" },
	"trbot.toggle.key": { type: t_key, default: "none" },
	"trbot.delay": { type: t_float, default: "0.000000", range: { min: 0.000000, max: 1.000000 } },
	"trbot.force": { type: t_bool, default: "true" },
	"trbot.trdelta": { type: t_float, default: "1.500000", range: { min: 0.000000, max: 5.000000 } },
	"trbot.nospread": { type: t_trbot, default: "false" },
	"trbot.rules.friends": { type: t_bool, default: "true" },
	"trbot.rules.rivals": { type: t_bool, default: "false" },
	"trbot.rules.chickens": { type: t_bool, default: "false" },
	"trbot.rules.ownteam": { type: t_bool, default: "false" },
	"trbot.hsonly": { type: t_hsonly, default: "false" },
	"trbot.burst": { type: t_trburst, default: "false" },
	"trbot.bursttime": { type: t_float, default: "0.210000" },
	"trbot.burstdown": { type: t_float, default: "0.500000" },
	"trbot.minspread": { type: t_float, default: "0.000000" },
	"trbot.spreadcap": { type: t_float, default: "10.000000" },
	"trbot.hitchance": { type: t_float, default: "0.800000" },
	"trbot.autowall": { type: t_int, default: "0", range: { min: 0, max: 100 } },
	"trbot.autosmoke": { type: t_bool, default: "false" },
	"trbot.nquantum": { type: t_int, default: "128", range: { min: 0, max: 255 } },
	"trbot.knife": { type: t_csknife, default: "smart" },
	"esp.enable": { type: t_bool, default: "false" },
	"esp.debug": { type: t_bool, default: "false" },
	"esp.fadetime": { type: t_float, default: "0.300000", range: { min: 0.000000, max: 1.000000 } },
	"esp.zsort": { type: t_bool, default: "true" },
	"esp.hdcolors": { type: t_bool, default: "false" },
	"esp.fatbounds": { type: t_float, default: "0.500000", range: { min: 0.000000, max: 2.000000 } },
	"esp.tagsize": { type: t_int, default: "10", range: { min: 0, max: 50 } },
	"esp.bgcolor": { type: t_color, default: "[0,0,0,128]" },
	"esp.rules.players": { type: t_espfeature, default: "clear" },
	"esp.rules.defusing": { type: t_espfeature, default: "clear" },
	"esp.rules.hostages": { type: t_espfeature, default: "clear" },
	"esp.rules.weapons": { type: t_espfeature, default: "clear" },
	"esp.rules.grenades": { type: t_espfeature, default: "clear" },
	"esp.rules.bomb": { type: t_espfeature, default: "clear" },
	"esp.rules.planted": { type: t_espfeature, default: "clear" },
	"esp.rules.chickens": { type: t_espfeature, default: "clear" },
	"esp.rules.showteam": { type: t_bool, default: "true" },
	"scripts.warmode": { type: t_bool, default: "true" },
	"scripts.debug": { type: t_bool, default: "false" },
	"scripts.bhop": { type: t_bhop, default: "false" },
	"scripts.autostrafe": { type: t_bool, default: "false" },
	"scripts.duckjump": { type: t_bool, default: "false" },
	"scripts.edgejump": { type: t_bool, default: "false" },
	"scripts.jumpbug": { type: t_bool, default: "false" },
	"scripts.rapidfire": { type: t_bool, default: "false" },
	"scripts.hidevm": { type: t_int, default: "0", range: { min: 0, max: 5 } },
	"scripts.transvm": { type: t_color, default: "[255,255,255]" },
	"scripts.setspeed": { type: t_float, default: "0.000000", range: { min: 0.000000, max: 1.000000 } },
	"scripts.script": { type: t_string, default: "" },
	"scripts.nullmov": { type: t_bool, default: "false" },
	"scripts.quickswitch": { type: t_int, default: "0", range: { min: 0, max: 20 } },
	"scripts.lastinv": { type: t_key, default: "none" },
	"speed.enable": { type: t_bool, default: "false" },
	"speed.toggle.mode": { type: t_toggle, default: "off" },
	"speed.toggle.key": { type: t_key, default: "none" },
	"speed.factor": { type: t_float, default: "3.000000" },
	"speed.method": { type: t_speed, default: "pspeed" },
	"speed.freeze.mode": { type: t_toggle, default: "off" },
	"speed.freeze.key": { type: t_key, default: "none" },
	"speed.freeze.type": { type: t_freeze, default: "drop" },
	"speed.lagticks": { type: t_int, default: "0", range: { min: 0, max: 20 } },
	"speed.lagswitch": { type: t_int, default: "0", range: { min: 0, max: 20 } },
	"speed.walk": { type: t_bool, default: "false" },
	"speed.smart": { type: t_bool, default: "false" },
	"ragebot.enable": { type: t_bool, default: "false" },
	"ragebot.debug": { type: t_bool, default: "false" },
	"ragebot.toggle.mode": { type: t_toggle, default: "off" },
	"ragebot.toggle.key": { type: t_key, default: "none" },
	"ragebot.trdelta": { type: t_float, default: "0.000000", range: { min: 0.000000, max: 5.000000 } },
	"ragebot.priority.mult": { type: t_float, default: "4.000000" },
	"ragebot.priority.lowcat": { type: t_bool, default: "true" },
	"ragebot.project.maxtime": { type: t_float, default: "1.200000" },
	"ragebot.project.gravity": { type: t_float, default: "800.000000" },
	"ragebot.project.aironly": { type: t_bool, default: "false" },
	"ragebot.rage.aim": { type: t_aim, default: "feedback" },
	"ragebot.rage.autofire": { type: t_autofire, default: "false" },
	"ragebot.rage.fov": { type: t_float, default: "0.000000", range: { min: 0.000000, max: 179.000000 } },
	"ragebot.rage.distmod": { type: t_float, default: "15.000000" },
	"ragebot.rage.sticky": { type: t_bool, default: "false" },
	"ragebot.rage.smart": { type: t_bool, default: "false" },
	"ragebot.rage.burstfov": { type: t_bool, default: "false" },
	"ragebot.rage.autoburst": { type: t_float, default: "0.210000" },
	"ragebot.rage.spreadcap": { type: t_float, default: "2.000000" },
	"ragebot.rules.friends": { type: t_bool, default: "true" },
	"ragebot.rules.rivals": { type: t_bool, default: "false" },
	"ragebot.rules.chickens": { type: t_bool, default: "false" },
	"ragebot.rules.ownteam": { type: t_bool, default: "false" },
	"ragebot.autowall": { type: t_bool, default: "false" },
	"ragebot.autosmoke": { type: t_bool, default: "false" },
	"trackbot.enable": { type: t_bool, default: "false" },
	"trackbot.debug": { type: t_bool, default: "false" },
	"trackbot.toggle.mode": { type: t_toggle, default: "off" },
	"trackbot.toggle.key": { type: t_key, default: "none" },
	"trackbot.trdelta": { type: t_float, default: "0.000000" },
	"trackbot.priority.mult": { type: t_float, default: "4.000000" },
	"trackbot.priority.lowcat": { type: t_bool, default: "true" },
	"trackbot.project.maxtime": { type: t_float, default: "1.200000" },
	"trackbot.project.gravity": { type: t_float, default: "800.000000" },
	"trackbot.project.aironly": { type: t_bool, default: "false" },
	"trackbot.track.fov": { type: t_float, default: "15.000000", range: { min: 0.000000, max: 179.000000 } },
	"trackbot.track.dropfov": { type: t_float, default: "20.000000", range: { min: 0.000000, max: 179.000000 } },
	"trackbot.track.minfov": { type: t_float, default: "0.500000", range: { min: 0.000000, max: 179.000000 } },
	"trackbot.track.triggerfov": { type: t_float, default: "0.000000", range: { min: 0.000000, max: 179.000000 } },
	"trackbot.track.burst": { type: t_bool, default: "false" },
	"trackbot.track.bursttime": { type: t_float, default: "0.210000" },
	"trackbot.track.burstdown": { type: t_float, default: "0.500000" },
	"trackbot.track.distmod": { type: t_bool, default: "false" },
	"trackbot.track.idletime": { type: t_float, default: "0.300000" },
	"trackbot.track.fadetime": { type: t_float, default: "0.100000" },
	"trackbot.track.advanced": { type: t_bool, default: "true" },
	"trackbot.track.aimahead": { type: t_float, default: "0.050000" },
	"trackbot.track.aimsmooth": { type: t_float, default: "0.100000" },
	"trackbot.track.function": { type: t_smooth, default: "log" },
	"trackbot.track.scale": { type: t_float, default: "1.000000" },
	"trackbot.track.smooth": { type: t_float, default: "1.000000" },
	"trackbot.track.trans": { type: t_float, default: "1.000000" },
	"trackbot.track.airfactor": { type: t_float, default: "1.000000" },
	"trackbot.track.autotrack": { type: t_autotrack, default: "false" },
	"trackbot.track.soften": { type: t_int, default: "0" },
	"trackbot.rules.friends": { type: t_bool, default: "true" },
	"trackbot.rules.rivals": { type: t_bool, default: "false" },
	"trackbot.rules.chickens": { type: t_bool, default: "false" },
	"trackbot.rules.ownteam": { type: t_bool, default: "false" },
	"trackbot.autowall": { type: t_bool, default: "false" },
	"trackbot.autosmoke": { type: t_bool, default: "false" },
	"radar.enable": { type: t_bool, default: "false" },
	"radar.lock": { type: t_bool, default: "false" },
	"radar.clamp": { type: t_rclamp, default: "spill" },
	"radar.scale": { type: t_float, default: "0.100000" },
	"radar.shape": { type: t_rshape, default: "rect" },
	"radar.region": { type: t_region, default: "ne" },
	"radar.size": { type: t_float, default: "3.000000" },
	"radar.style": { type: t_rstyle, default: "dot" },
	"radar.fadetime": { type: t_float, default: "0.300000" },
	"radar.trails": { type: t_float, default: "3.000000" },
	"radar.axis": { type: t_bool, default: "true" },
	"radar.minimap": { type: t_bool, default: "false" },
	"radar.bgcolor": { type: t_color, default: "[0,0,0,32]" },
	"radar.sound": { type: t_bool, default: "false" },
	"players.steam": { type: t_bool, default: "true" },
	"namer.debug": { type: t_bool, default: "false" },
	"namer.mode": { type: t_namer, default: "idle" },
	"namer.clantag": { type: t_string, default: "" },
	"namer.interval": { type: t_float, default: "4.000000" },
	"namer.sameteam": { type: t_bool, default: "true" },
	"theme.spec.front": { type: t_color, default: "[128,128,128]" },
	"theme.spec.back": { type: t_color, default: "[128,128,128]" },
	"theme.other.front": { type: t_color, default: "[0,255,0]" },
	"theme.other.back": { type: t_color, default: "[0,255,0]" },
	"theme.teamx.front": { type: t_color, default: "[255,0,0]" },
	"theme.teamx.back": { type: t_color, default: "[255,255,0]" },
	"theme.teamy.front": { type: t_color, default: "[0,96,255]" },
	"theme.teamy.back": { type: t_color, default: "[0,255,255]" },
	"theme.enemy.front": { type: t_color, default: "[0,255,127]" },
	"theme.enemy.back": { type: t_color, default: "[0,255,127]" },
	"theme.ally.front": { type: t_color, default: "[128,128,128]" },
	"theme.ally.back": { type: t_color, default: "[128,128,128]" },
	"theme.friends.front": { type: t_color, default: "[153,50,204]" },
	"theme.friends.back": { type: t_color, default: "[218,112,214]" },
	"theme.rivals.front": { type: t_color, default: "[153,50,204]" },
	"theme.rivals.back": { type: t_color, default: "[218,112,214]" },
	"theme.useteam": { type: t_bool, default: "true" },
	"gui.vis": { type: t_vis, default: "normal" },
	"gui.key": { type: t_key, default: "ins" },
	"gui.effect": { type: t_bool, default: "false" },
	"guard.debug": { type: t_bool, default: "false" },
	"guard.abuse": { type: t_bool, default: "false" },
	"guard.restrict": { type: t_restrict, default: "legit" },
	"guard.psfix": { type: t_bool, default: "true" },
	"guard.clickvis": { type: t_bool, default: "false" },
	"guard.clickms": { type: t_int, default: "63", range: { min: 0, max: 200 } },
	"guard.quantize": { type: t_bool, default: "true" },
	"guard.demosafe": { type: t_bool, default: "true" },
	"guard.mdx": { type: t_mdx, default: "false" },
	"guard.smac": { type: t_bool, default: "true" }
};

	let sections = [
		{ id: "DEFAULT", name: "Default" },
		{ id: "SHARED", name: "Shared" },

		{ id: "KNIFE", name: "Knife" },
		{ id: "TAZER", name: "Tazer" },
		{ id: "ZEUS", name: "Zeus" },

		{ id: "PISTOL", name: "Pistols" },
		{ id: "GLOCK", name: "Glock-18" },
		{ id: "P2000", name: "P2000" },
		{ id: "USP", name: "USP-S" },
		{ id: "P250", name: "P250" },
		{ id: "TEC9", name: "Tec-9" },
		{ id: "FIVESEVEN", name: "Five-SeveN" },
		{ id: "CZ75", name: "CZ75-Auto" },
		{ id: "DEAGLE", name: "Desert Eagle" },
		{ id: "ELITES", name: "Dual Berettas" },
		{ id: "REVOLVER", name: "R8 Revolver" },

		{ id: "SHOTGUN", name: "Shotguns" },
		{ id: "NOVA", name: "Nova" },
		{ id: "XM1014", name: "XM1014" },
		{ id: "MAG7", name: "MAG-7" },
		{ id: "SAWEDOFF", name: "Sawed-Off" },

		{ id: "HEAVY", name: "Heavy Machineguns" },
		{ id: "M249", name: "M249" },
		{ id: "NEGEV", name: "Negev" },

		{ id: "SMG", name: "Submachineguns" },
		{ id: "MAC10", name: "MAC-10" },
		{ id: "MP9", name: "MP9" },
		{ id: "MP7", name: "MP7" },
		{ id: "UMP45", name: "UMP-45" },
		{ id: "P90", name: "P90" },
		{ id: "BIZON", name: "PP-Bizon" },

		{ id: "RIFLE", name: "Rifles" },
		{ id: "GALIL", name: "Galil AR" },
		{ id: "FAMAS", name: "Famas" },
		{ id: "M4A4", name: "M4A4" },
		{ id: "M4A1s", name: "M4A1-S" },
		{ id: "AK47", name: "AK-47" },
		{ id: "AUG", name: "AUG" },
		{ id: "SG556", name: "SG 553" },

		{ id: "SNIPER", name: "Sniper Rifles" },
		{ id: "SCOUT", name: "SSG 08" },
		{ id: "AWP", name: "AWP" },

		{ id: "AUTOSNIPER", name: "Autosnipers" },
		{ id: "SCAR20", name: "SCAR-20" },
		{ id: "G3SG1", name: "G3SG1" },

		{ id: "GRENADE", name: "Grenades" }
	];

	return {
		cvars: cvars,
		sections: sections,
	};
})();
