// Number functions

if(!Number.prototype.toHex){
	Number.prototype.toHex = function(){
		return this.toString(16);
	}
}
if(!Number.prototype.toBinary){
	Number.prototype.toBinary = function(){
		let binaryString = this.toString(2);
		binStrLen = binaryString.length;
		return '0'.repeat(Math.ceil(binStrLen / 8) * 8 - binStrLen) + binaryString;
	}
}
if(!Number.prototype.toChar){
	Number.prototype.toChar = function(){
		return String.fromCharCode(this);
	}
}
if(!Number.prototype.toPercent){
	Number.prototype.toPercent = function(total = 100){
			if(total == undefined || total == 0){ return undefined; }
		// part / total = percent
		return this / total;
	}
}
if(!Number.prototype.percentOf){
	Number.prototype.percentOf = function(total = 100){
			if(total == undefined || total == 0){ return undefined; }
		// part = percent * total
		return this * total;
	}
}
if(!Number.prototype.average){
	Number.prototype.average = function(...numbers){
		let aver = this, averLen = numbers.length;
			if(averLen==0){ return aver; }
			for(let i=0;i<averLen;i++){
				aver += numbers[i];
			}
		return aver/averLen;
	}
}