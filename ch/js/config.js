"use strict"

// Imports databinding.js

function flatten(obj, kv, prefix) {
	kv = kv || {};
	prefix = prefix || "";
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
				let flat = flatten(obj[key], kv, prefix + key + ".");
			}
			else {
				kv[prefix + key] = obj[key];
			}
		}
	}
	return kv;
}

//----------------------------------------------------------------
// Model

function ConfigLine(line) {
	line = line.trim();
	if (line.length == 0) {
		this.type = ConfigLine.EMPTY;
	}
	else if (line[0] == "/" && line[1] == "/") {
		this.type = ConfigLine.COMMENT;
		this.comment = line;
	}
	else if (line[0] == "[" && line[line.length - 1] == "]") {
		this.type = ConfigLine.SECTION;
		this.section = line.substring(1, line.length - 1).toUpperCase();
	}
	else {
		this.type = ConfigLine.CVAR;
		let index = line.indexOf(" ");
		if (index > 0) {
			this.cvar = line.substring(0, index).toLowerCase();
			let value = line.substring(index).trim();
			if (value[0] == "\"" && value[value.length - 1] == "\"") {
				value = value.substring(1, value.length - 1).toLowerCase();
			}
			this.value = value;
		}
		else {
			this.cvar = line;
			this.value = null;
		}
	}
}
ConfigLine.EMPTY = 0;
ConfigLine.COMMENT = 1;
ConfigLine.SECTION = 2;
ConfigLine.CVAR = 3;
ConfigLine.cvar = function(cvar, value) {
	let line = {};
	line.__proto__ = ConfigLine.prototype;
	line.type = ConfigLine.CVAR;
	line.cvar = cvar;
	line.value = value;
	return line;
};
ConfigLine.prototype.toString = function() {
	switch (this.type) {
		case ConfigLine.EMPTY: return "";
		case ConfigLine.COMMENT: return this.comment;
		case ConfigLine.SECTION: return "[" + this.section + "]";
		case ConfigLine.CVAR: return this.cvar + " \"" + this.value + "\"";
		default: throw new Error("unexpected tag");
	}
};

function Config(text) {
	this.sections = {};
	let section = "DEFAULT";
	let lines = text.split("\n");
	for (let i = 0; i<lines.length; ++i) {
		let line = new ConfigLine(lines[i]);
		if (line.type == ConfigLine.SECTION) {
			section = line.section;
		}
		else if (line.type != ConfigLine.EMPTY) {
			this.add(section, line);
		}
	}
}
Config.DEFAULT_SECTION = "DEFAULT";
Config.SHARED_SECTION = "SHARED";
Config.prototype.add = function(section, line) {
	if (!(section in this.sections)) {
		this.sections[section] = [];
	}
	this.sections[section].push(line);
};
Config.prototype.toString = function() {
	function sectionToString(name, section) {
		if (section && section.length > 0) {
			let s = "";
			if (name) { s = "[" + name + "]\n"; }
			for (let i = 0; i<section.length; ++i) {
				s += section[i].toString() + "\n";
			}
			return s.trim() + "\n\n";
		}
		else {
			return "";
		}
	}
	let s = sectionToString(null, this.sections[Config.DEFAULT_SECTION]);
	s += sectionToString(Config.SHARED_SECTION, this.sections[Config.SHARED_SECTION]);
	for (let key in this.sections) {
		if (key != Config.DEFAULT_SECTION && key != Config.SHARED_SECTION) {
			s += sectionToString(key, this.sections[key]);
		}
	}
	return s.trim() + "\n";
};
Config.diffSections = function(from, to) {
	let diff = {};
	if (to) {
		// Add all cvars from `to` as a baseline
		for (let i = 0; i<to.length; ++i) {
			let line = to[i];
			if (line.type == ConfigLine.CVAR) {
				diff[line.cvar] = line.value;
			}
		}
	}
	if (from) {
		// Unset all cvars that were removed
		// Remove all that haven't changed
		for (let i = 0; i<from.length; ++i) {
			let line = from[i];
			if (line.type == ConfigLine.CVAR) {
				if (line.cvar in diff) {
					if (diff[line.cvar] == line.value) {
						delete diff[line.cvar];
					}
				}
				else {
					diff[line.cvar] = undefined;
				}
			}
		}
	}
	return diff;
};

//----------------------------------------------------------------

function ConfigViewModel(model, sections) {
	this.model = model;
	this.section = new Property(Config.DEFAULT_SECTION);
	this.sections = new Property(sections);
	this.text = new Property(model.toString());
	this.change = new Event();
	this.text.add(this.onTextChange.bind(this));
}
ConfigViewModel.prototype.onTextChange = function(e) {
	// Create a new model from changed text
	let model = new Config(e.value);
	// Diff to compare what really changed
	let section = this.section.get();
	let diff = Config.diffSections(this.model.sections[section], model.sections[section]);
	// Update the model
	this.model = model;
	// Fire events for all changed cvars
	for (let key in diff) {
		if (!diff.hasOwnProperty(key)) {
			continue;
		}
		this.change.invoke({ cvar: key, value: diff[key] });
	}
};
ConfigViewModel.prototype.set = function(cvar, value) {
	// Adjust the model
	this.model.add(this.section.get(), ConfigLine.cvar(cvar, value));
	// Fire the change event
	this.change.invoke({ cvar: cvar, value: value });
	// Update the textual representation
	let text = this.model.toString();
	this.text.set(text);
};

//----------------------------------------------------------------

function ConfigView(vm) {
	this.vm = vm;
	let section = document.createElement('section');
	// The header
	let h1 = document.createElement('h1');
	h1.textContent = "Configuration Editor";
	section.appendChild(h1);
	// The content
	let content = document.createElement('div');
	content.classList.add("content");
	let textarea = document.createElement('textarea');
	vm.text.add(function(e) {
		textarea.value = e.value;
	});
	textarea.addEventListener('change', this.onTextChange.bind(this));
	content.appendChild(textarea);
	section.appendChild(content);
	this.html = section;
}
ConfigView.prototype.onTextChange = function(e) {
	let text = e.target.value;
	this.vm.text.set(text);
};
