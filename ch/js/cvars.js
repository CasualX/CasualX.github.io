"use strict"

function analyze(s) {
	let lines = s.split('\n');
	let re = /^([^ ]*) "([^"]*)"$/;
	let cvars = {};
	for (let i = 0; i<lines.length; ++i) {
		let mach = lines[i].match(re);
		if (mach) {
			let path = mach[1].split('.');
			let value = mach[2];
			let ctx = cvars;
			let j = 0;
			for (; j<path.length - 1; ++j) {
				let item = path[j];
				if (ctx[item] == undefined) {
					ctx[item] = {};
				}
				ctx = ctx[item];
			}
			let item = path[j];
			ctx[item] = value;
		}
	}
	return cvars;
}
function navigate(path) {
	// Hide all uls
	let uls = document.querySelectorAll("#cvars ul");
	for (let i = 0; i<uls.length; ++i) {
		uls[i].classList.remove("expand", "leaf");
	}
	// Unmark all lis
	let lis = document.querySelectorAll("#cvars li");
	for (let i = 0; i<lis.length; ++i) {
		lis[i].classList.remove("select");
	}
	// Show specific ones
	let root = document.getElementById("root");
	root.classList.add("expand");
	path = path.split('.');
	for (let i = 0; i<path.length; ++i) {
		let id = path.slice(0, i + 1).join('.');
		let ul = document.getElementById("root." + id);
		ul.classList.add("expand");
		let li = document.querySelector("a[href=\"#" + id + "\"]").parentNode;
		li.classList.add("select");
		if (i == path.length - 1) {
			ul.classList.add("leaf");
		}
	}
}
function create_gui(tree) {
	function nav_a(e) {
		let id = e.target.hash.substring(1);
		navigate(id);
		e.preventDefault();
	}
	function edit_a(e) {
		let li = e.target.parentNode;
		li.classList.toggle("edit");
		e.preventDefault();
	}
	let root = (function rec(prefix, tree, depth) {
		let ul = document.createElement('ul');
		let id = "";
		if (prefix == "") {
			id = "root";
			ul.classList.add("expand");
		}
		else {
			id = "root." + prefix.substring(0, prefix.length - 1);
		}
		ul.id = id;
		for (let key in tree) {
			if (tree.hasOwnProperty(key)) {
				let item = tree[key];
				let li = document.createElement('li');
				let a = document.createElement('a');
				a.href = "#" + prefix + key;
				a.textContent = key;
				li.appendChild(a);
				if (typeof item == "string") {
					a.addEventListener('click', edit_a);
					let span = document.createElement('span');
					span.classList.add("unset", "value");
					span.textContent = item;
					li.appendChild(span);
					let input = document.createElement('input');
					input.classList.add("set", "value");
					input.type = "text";
					input.value = item;
					li.appendChild(input);
				}
				else {
					a.addEventListener('click', nav_a);
					let subtree = rec(prefix + key + ".", item, depth + 1);
					let level = document.querySelector("#cvars-level" + depth);
					level.appendChild(subtree);
				}
				ul.appendChild(li);
			}
		}
		return ul;
	}("", tree, 2));
	let level1 = document.querySelector("#cvars-level1");
	level1.appendChild(root);
}
