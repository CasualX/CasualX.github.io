"use strict"

// Imports databinding.js

//----------------------------------------------------------------

function CvarTreeViewModel(cvar, desc) {
	this.cvar = new Property(cvar);
	this.name = new Property(cvar.split(".").pop());
	this.expand = new Property(false);
	this.leaf = new Property(false);
	this.navigate = new Event();
}
CvarTreeViewModel.prototype.poke = function(open, last) {
	this.expand.set(open);
	this.leaf.set(last);
	return true;
};
function CvarTreeView(vm) {
	this.vm = vm;
	// Generate the nav breadcrumb
	let nav_li = document.createElement('li');
	vm.expand.add(function(e) { nav_li.classList.toggle("select", e.value); });
	let nav_a = document.createElement('a');
	nav_a.addEventListener('click', this.onClick.bind(this));
	vm.name.add(function(e) { nav_a.textContent = e.value; });
	nav_li.appendChild(nav_a);
	this.nav_li = nav_li;
	// Generate the link html
	let li = document.createElement('li');
	vm.expand.add(function(e) { li.classList.toggle("select", e.value); });
	let a = document.createElement('a');
	a.addEventListener('click', this.onClick.bind(this));
	vm.name.add(function(e) { a.textContent = e.value; });
	li.appendChild(a);
	this.li = li;
	// Generate the value html
	let ul = document.createElement('ul');
	vm.expand.add(function(e) { ul.classList.toggle("expand", e.value); });
	vm.leaf.add(function(e) { ul.classList.toggle("leaf", e.value); });
	this.ul = ul;
}
CvarTreeView.prototype.onClick = function(e) {
	this.vm.navigate.invoke(this.vm.cvar.get());
	e.preventDefault();
};

//----------------------------------------------------------------

function CvarStringViewModel(cvar, desc) {
	this.cvar = new Property(cvar);
	this.name = new Property(cvar.split(".").pop());
	this.edit = new Property(false);
	this.string = new Property(desc.default);
	this.default = new Property(desc.default);
	this.change = new Event();
	this.string.add(this.onChange.bind(this));
	this.edit.add(this.onChange.bind(this));
}
CvarStringViewModel.prototype.value = function(value) {
	if (value === undefined) {
		return this.string.get();
	}
	else {
		this.string.set(value.toString());
	}
};
CvarStringViewModel.prototype.poke = function(open, last) {
	return false;
};
CvarStringViewModel.prototype.onChange = function(e) {
	let value;
	if (this.edit.get()) {
		value = this.string.get();
	}
	this.change.invoke({ cvar: this.cvar.get(), value: value });
};
function CvarStringView(vm) {
	this.vm = vm;
	// Generate the nav link html
	let nav_li = document.createElement('li');
	let nav_a = document.createElement('a');
	vm.name.add(function(e) { nav_a.textContent = e.value; });
	nav_a.addEventListener('click', this.onClick.bind(this));
	nav_li.appendChild(nav_a);
	this.nav_li = nav_li;
	// Generate the link html
	let li = document.createElement('li');
	li.classList.add("value");
	vm.edit.add(function(e) { li.classList.toggle("userset", e.value); });
	let a = document.createElement('a');
	a.addEventListener('click', this.onClick.bind(this));
	vm.name.add(function(e) { a.textContent = e.value; });
	this.li = li;
	// Generate the editor html
	let value = document.createElement('span');
	value.classList.add("value");
	let unset = document.createElement('unset');
	unset.classList.add("unset");
	vm.default.add(function(e) { unset.textContent = e.value; });
	value.appendChild(unset);
	let input = document.createElement('input');
	input.type = "text";
	input.classList.add("set");
	input.addEventListener('change', this.onEdit.bind(this));
	vm.string.add(function(e) { input.value = e.value; });
	value.appendChild(input);
	li.appendChild(value);
	li.appendChild(a);
}
CvarStringView.prototype.onClick = function(e) {
	let edit = this.vm.edit.get();
	this.vm.edit.set(!edit);
	e.preventDefault();
};
CvarStringView.prototype.onEdit = function(e) {
	let value = e.target.value;
	this.vm.string.set(value);
};

//----------------------------------------------------------------

function ConfigViewModel() {
	this.text = new Property("");
	this.change = new Event();
}
ConfigViewModel.prototype.lines = function(value) {
	if (value === undefined) {
		return this.text.get().split("\n");
	}
	else {
		let text = value.join("\n");
		this.text.set(text);
	}
};
ConfigViewModel.prototype.load = function(text, internal) {
	if (internal) {
		this.text.value = text;
	}
	else {
		this.text.set(text);
	}
	// In any case let's fire up some cvar events
	let cvars = {};
	let lines = text.split("\n");
	for (let i = 0; i<lines.length; ++i) {
		let line = lines[i].trim();
		// Ignore comments and empty lines
		if (line.length == 0 || line.startsWith("//")) {
			continue;
		}
		// Get the cvar part
		let index = line.indexOf(" ");
		let path;
		if (index == 0) { continue; }
		else if (index > 0) { path = line.substring(0, index).toLowerCase(); }
		else { path = line.toLowerCase(); }
		// Get the value part
		let value = line.substring(index).trim().toLowerCase();
		if (value[0] == "\"" && value[value.length - 1] == "\"") {
			value = value.substring(1, value.length - 1).trim();
		}
		cvars[path] = value;
	}
	// Fire the event
	this.cvars.invoke(cvars);
};
ConfigViewModel.prototype.set = function(cvar, value) {
	// Explode the text
	let lines = this.lines();
	// Find an already matching cvar
	let cvar_names = cvar.split(".");
	let best_index = -1;
	let best_pre = 0;
	let replace = false;
	for (let i = 0; i<lines.length; ++i) {
		let line = lines[i].trim();
		// Ignore comments and empty lines
		if (line.length == 0 || line.startsWith("//")) {
			continue;
		}
		// Get the cvar part
		let index = line.indexOf(" ");
		let path;
		if (index == 0) { continue; }
		else if (index > 0) { path = line.substring(0, index).toLowerCase(); }
		else { path = line.toLowerCase(); }
		// Is this the cvar we're looking for
		if (path == cvar) {
			best_index = i;
			replace = true;
			break;
		}
		// How many prefixes are shared
		let path_names = path.split(".");
		let pre = 0;
		while (pre < cvar_names.length && pre < path_names.length && cvar_names[pre] == path_names[pre]) {
			pre += 1;
		}
		// Store better and later matches
		if (pre >= best_pre) {
			best_index = i;
			best_pre = pre;
		}
	}
	// If a match was found
	if (replace) {
		if (value === undefined) {
			lines.splice(best_index, 1);
		}
		else {
			let line = cvar + " \"" + value + "\"";
			lines[best_index] = line;
		}
	}
	else {
		// If unrelated and last line isn't empty, put some spacing
		if (best_pre == 0 && lines[best_index].length != 0) {
			lines.push("");
			best_index += 1;
		}
		// Insert new value
		let line = cvar + " \"" + value + "\"";
		lines.splice(best_index, 0, line);
	}
	// Edit the config
	this.lines(lines);
};
function ConfigView(vm) {
	this.vm = vm;
	// Build the config HTML
	let textarea = document.createElement('textarea');
	vm.text.add(function(e) { textarea.value = e.value; });
	textarea.addEventListener('change', this.onChange.bind(this));
	this.html = textarea;
}
ConfigView.prototype.onChange = function(e) {
	// Reload the entire config on manual edit
	let text = e.target.value;
	this.vm.load(text);
};

//----------------------------------------------------------------

function EditorViewModel(cvars) {
	this.enable = new Property(false);
	this.nav = new Property("");
	this.cvars = cvars;
	this.change = new Event();
	this.config = new ConfigViewModel();
}
EditorViewModel.prototype.change = function(cvars) {

};
function EditorView(vm) {
	this.vm = vm;
	let views = {};
	this.views = views;
	// Build the editor HTML
	let section = document.createElement('section');
	section.classList.add("editor");
	// Build the header HTML
	let header = document.createElement('h1');
	header.textContent = "Configuration";
	vm.enable.add(function(e) { header.classList.toggle("open", e.value); });
	header.addEventListener('click', this.onOpen.bind(this));
	section.appendChild(header);
	// Add a textarea
	let config = new ConfigView(vm.config);
	config.vm.cvars.add(function(e) {
		for (let key in e) {
			if (!e.hasOwnProperty(key)) {
				continue;
			}
		}
	});
	section.appendChild(config.html);
	// Build the scaffolding HTML
	let content = document.createElement('div');
	content.classList.add("content");
	vm.enable.add(function(e) { content.classList.toggle("open", e.value); });
	let nav = document.createElement('ol');
	nav.classList.add("nav");
	content.appendChild(nav);
	let tree = document.createElement('ol');
	tree.classList.add("tree");
	let levels = [];
	for (let i = 0; i<4; ++i) {
		let li = document.createElement('li');
		levels.push(li);
		tree.appendChild(li);
	}
	content.appendChild(tree);
	section.appendChild(content);
	// Build the cvars HTML
	let self = this;
	function tree_view(cvar, desc, lv, parent) {
		let view = new CvarTreeView(new CvarTreeViewModel(cvar, desc));
		view.vm.navigate.add(self.onNavigate.bind(self));
		nav.appendChild(view.nav_li);
		if (parent) {
			parent.ul.appendChild(view.li);
		}
		levels[lv + 1].appendChild(view.ul);
		views[cvar] = view;
	}
	function string_view(cvar, desc, parent) {
		let view = new CvarStringView(new CvarStringViewModel(cvar, desc));
		view.vm.change.add(self.onChange.bind(self));
		nav.appendChild(view.nav_li);
		parent.ul.appendChild(view.li);
	}
	tree_view("root", null, -1, null);
	for (let key in vm.cvars) {
		if (!vm.cvars.hasOwnProperty(key)) {
			continue;
		}
		let names = key.split(".");
		let parent = views.root;
		for (let i = 0; i<names.length; ++i) {
			if (i == names.length - 1) {
				string_view(key, vm.cvars[key], parent);
			}
			else {
				let path = names.slice(0, i + 1).join(".");
				if (!(path in views)) {
					tree_view(path, null, i, parent);
				}
				parent = views[path];
			}
		}
	}
	this.html = section;
	// Finally poke the bear
	this.onNavigate("root");
}
EditorView.prototype.navigate = function(cvar) {
	// Collapse all opened menus
	for (let key in this.views) {
		let view = this.views[key];
		view.vm.poke(false, false);
	}
	let names = cvar.split(".");
	let last = this.views.root;
	last.vm.poke(true, false);
	for (let i = 0; i<names.length; ++i) {
		let path = names.slice(0, i + 1).join(".");
		let view = this.views[path];
		if (view.vm.poke(true, false)) {
			last = view;
		}
	}
	last.vm.poke(true, true);
};
EditorView.prototype.onOpen = function(e) {
	let enable = this.vm.enable.get();
	this.vm.enable.set(!enable);
	e.preventDefault();
};
EditorView.prototype.onNavigate = function(cvar) {
	this.navigate(cvar);
};
EditorView.prototype.onChange = function(e) {
	console.log(e.cvar + " \"" + e.value + "\"");
	this.vm.change.invoke(e);
};

//----------------------------------------------------------------

/// Widget for boolean cvars.
function WidgetBool(cvar, info, editor) {
	this.cvar = cvar;
	this.info = info;
	this.editor = editor;
	this.onchange = null;

	// Create the HTML
	let value = document.createElement('span');
	value.classList.add('value');

	// Display the default value
	let unset = document.createElement('span');
	unset.classList.add('unset');
	unset.textContent = info.default;
	value.appendChild(unset);

	// Edit the value
	let input = document.createElement('input');
	input.type = "checkbox";
	input.classList.add("set");
	input.addEventListener('change', this.change.bind(this));
	value.appendChild(input);

	this.html = value;
}
WidgetBool.prototype.value = function(value) {
	let input = this.html.querySelector("input");
	if (value === undefined) {
		return input.checked.toString();
	}
	else {
		if (value === "true") {
			input.checked = true;
		}
		else if (value === "false") {
			input.checked = false;
		}
		else {
			throw new TypeError("expected boolean, got \"" + value + "\"");
		}
	}
};
WidgetBool.prototype.change = function(e) {
	if (this.onchange) {
		this.onchange(this);
	}
};

/// Widget for string cvars.
function WidgetText(cvar, info, editor) {
	this.cvar = cvar;
	this.info = info;
	this.editor = editor;
	this.onchange = null;

	// Create the HTML
	let value = document.createElement('span');
	value.classList.add('value');

	// Display the default value
	let unset = document.createElement('span');
	unset.classList.add('unset');
	unset.textContent = info.default;
	value.appendChild(unset);

	// Edit the value
	let input = document.createElement('input');
	input.type = "text";
	input.classList.add("set");
	input.addEventListener('change', this.change.bind(this));
	value.appendChild(input);

	this.html = value;
}
WidgetText.prototype.value = function(value) {
	let input = this.html.querySelector("input");
	if (value === undefined) {
		return input.value;
	}
	else {
		input.value = value;
	}
};
WidgetText.prototype.change = function(e) {
	if (this.onchange) {
		this.onchange(this);
	}
};

/// Widget for enum cvars.
function WidgetEnum(cvar, info, editor) {
	this.cvar = cvar;
	this.info = info;
	this.editor = editor;
	this.onchange = null;

	// Create the HTML
	let value = document.createElement('span');
	value.classList.add('value');

	// Display the default value
	let unset = document.createElement('span');
	unset.classList.add("unset");
	unset.textContent = info.default;
	value.appendChild(unset);

	// Edit the value
	let select = document.createElement('select');
	select.classList.add("set");
	for (let i = 0; i<info.type.variants.length; ++i) {
		let variant = info.type.variants[i];
		let option = document.createElement('option');
		option.textContent = variant;
		option.value = variant;
		select.appendChild(option);
	}
	select.addEventListener('change', this.change.bind(this));
	value.appendChild(select);

	this.html = value;
}
WidgetEnum.prototype.value = function(value) {
	let select = this.html.querySelector("select");
	if (value === undefined) {
		return select.value;
	}
	else {
		select.value = value;
	}
};
WidgetEnum.prototype.change = function(e) {
	if (this.onchange) {
		this.onchange(this);
	}
};
