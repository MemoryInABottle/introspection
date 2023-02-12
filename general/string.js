// String functions

if(!String.prototype.sanitize){
	String.prototype.sanitize = function(){
		return this.toString().replaceAll('<', '&lt;').replaceAll('>', '&gt;');;
	}
}
if(!String.prototype.chr){
	String.prototype.chr = function(charCode){
		return String.fromCharCode(charCode);
	}
}
if(!String.prototype.toInt){
	String.prototype.toInt = function(radix = 10){
		return parseInt(this.toString(), radix);
	}
}
if(!String.prototype.toHex){
	String.prototype.toHex = function(radix = 10){
		return this.toString().toInt(radix).toString(16);
	}
}
if(!String.prototype.toBinary){
	String.prototype.toBinary = function(radix = 10){
		let binaryString = this.toString().toInt(radix).toString(2);
		binStrLen = binaryString.length;
		return '0'.repeat(Math.ceil(binStrLen / 8) * 8 - binStrLen) + binaryString;
	}
}
if(!String.prototype.randomID){
	String.prototype.randomID = function(prefix, suffix){
		return prefix + (new Date().getTime() + '_' + Math.trunc(Math.random() * 1000)) + suffix;
	}
}
if(!String.prototype.bytesAt){
	String.prototype.bytesAt = function(){
		//Return the bytes of a partial string
		//return 1;
	}
}