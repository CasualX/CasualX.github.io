"use strict"

function Property(value) {
	this.callbacks = [];
	this.value = value;
}
Property.MODEL = 1;
Property.VIEW = 2;
Property.EXTERNAL = 3;
Property.prototype.add = function(callback) {
	this.callbacks.push(callback);
	callback({ value: this.value, old: undefined, prop: this });
};
Property.prototype.set = function(value) {
	let old = this.value;
	this.value = value;
	if (old != value) {
		this.invoke(value, old);
	}
};
Property.prototype.get = function() {
	return this.value;
};
Property.prototype.invoke = function(value, old) {
	let e = { value: value, old: old, prop: this };
	for (let i = 0; i<this.callbacks.length; ++i) {
		this.callbacks[i](e);
	}
};

function Event() {
	this.callbacks = [];
}
Event.prototype.add = function(callback) {
	this.callbacks.push(callback);
};
Event.prototype.invoke = function(e) {
	for (let i = 0; i<this.callbacks.length; ++i) {
		this.callbacks[i](e);
	}
};
