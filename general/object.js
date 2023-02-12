// Object functions

if(!Object.prototype.deepCopy){
	Object.prototype.deepCopy = function(){
		return JSON.parse(JSON.stringify(this));
	}
}
if(!Object.prototype.stringify){
	Object.prototype.stringify = function(){
		return JSON.stringify(this);
	}
}
if(!Object.prototype.log){
	Object.prototype.log = function(){
		console.log(this);
	}
}
if(!Object.prototype.logTable){
	Object.prototype.logTable = function(){
		console.table(this);
	}
}
if(!Object.prototype.toLocalStorage){
	Object.prototype.toLocalStorage = function(name){
		localStorage.setItem(name, this.stringify());
	}
}
if(!Object.prototype.toSessionStorage){
	Object.prototype.toSessionStorage = function(name){
		sessionStorage.setItem(name, this.stringify());
	}
}