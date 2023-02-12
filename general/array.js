// Array functions

if(!Array.prototype.remove){
	Array.prototype.remove = function(arr, item, onlyFirstOccurence){
		return Array.prototype.replace(arr, item, undefined, onlyFirstOccurence);
	}
}
if(!Array.prototype.removeAt){
	Array.prototype.removeAt = function(arr, index){
			if(index==0){
				arr.shift();
			}else if(index==arr.length-1){
				arr.pop();
			}else{
				arr = arr.slice(0, index).concat(arr.slice(index+1));
			}
		return arr;
	}
}
if(!Array.prototype.copy){
	Array.prototype.copy = function(){
		return this.slice();
	}
}
if(!Array.prototype.itemAt){
	Array.prototype.itemAt = function(index){
		if(index>=0){
			return arr[index%arr.length];
		}else{
			return arr[(arr.length-Math.abs(index)%arr.length)%arr.length];
		}
	}
}
if(!Array.prototype.replace){
	Array.prototype.replace = function(arr, item, replacement, onlyFirstOccurence){
			if (arr == undefined || arr == null || arr.length == 0) { return arr; }
		let index = arr.indexOf(item);
			if (index == -1) { return arr; }
		arr[index] = replacement;
			if (onlyFirstOccurence == undefined || onlyFirstOccurence == false) {
				Array.prototype.replace(arr, item, replacement, undefined);
			}
		return arr;
	}
}
if(!Array.prototype.flattenArray){
	Array.prototype.flattenArray = function(arr, depth){
		if (depth == undefined) {
			depth = 1;
		}
		if (depth < 1) {
			return arr;
		}
		return Array.prototype.flattenArray([].concat.apply([], arr), depth - 1);
	}
}
if(!Array.prototype.flatten){
	Array.prototype.flatten = function(depth){
		if (depth == undefined) {
			depth = 1;
		}
		if (depth < 1) {
			return this;
		}
		return Array.prototype.flattenArray([].concat.apply([], this), depth - 1);
	}
}