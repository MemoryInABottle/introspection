class HuffmanTree{
	symbol=undefined;
	left=undefined;
	right=undefined;
	
	constructor(huffmanCodes){ //{a:'1000110', b:'1000111'}
		if(huffmanCodes!==undefined){
			for(let symbol in huffmanCodes){
				this.insert(huffmanCodes[symbol], huffmanCodes[symbol].length, symbol);
			}
		}
	}
	
	insert(codeword, n, symbol){
		//Insert an entry into the tree mapping `codeword` of len `n` to `symbol`
		let node = this, code='';
			for(let i=0;i<n;i++){
					if(codeword[i] == '1'){
						code+='1';
							if(node.right==undefined){node.right = new HuffmanTree();}
						node = node.right;
					}else{
						code+='0';
							if(node.left==undefined){node.left = new HuffmanTree();}
						node = node.left;
					}
			}
		node.symbol = symbol;
		node.code = code;
	}
	
	decode_message(codedmessage){
		let pointer = 0, len = codedmessage.length, message='', temp;
			while(pointer<len){
				temp = this.decode_symbol(codedmessage, pointer);
				message+=temp[0];
				pointer=temp[1];
			}
		return message
	}
	decode_symbol(codedmessage, pointer=0){
		let node = this, cmLen = codedmessage.length;
			while(pointer<cmLen && (node.left || node.right)){
				node = (codedmessage[pointer]=='1'?node.right:node.left);
				pointer++;
			}
		return [node.symbol, pointer];
	}
	retrieveNextCodeWord(nextBits){
			if(nextBits==''){return undefined;}
		let node = this, pointer=0, bitLen = nextBits.length;
			while(node!==undefined && node.symbol==undefined){
					if(pointer>=bitLen){return undefined;}
				node = (nextBits[pointer]=='1'?node.right:node.left);
				pointer++;
			}
			if(node==undefined){
				return undefined;
			}
		return [node.symbol, pointer];
	}

	static bitLengthCodes(bitLengths, useReversedCodeWords=false, prependZero=true){
		//bl_count is the number of Codes of Length N
		let bl_count = [], bitMax = 0, bitLenCount = bitLengths.length, bitLenNonZero = 0;
		let bitLenObj = [];
			for(let i=0;i<bitLenCount;i++){
					if(bitLengths[i]==0){continue;}
				bitLenObj[bitLenNonZero] = {index:i, bitLen:bitLengths[i]};
				bitLenNonZero++;
					if(bitLengths[i]>bitMax){
						bitMax=bitLengths[i];
					}
					if(bl_count[bitLengths[i]]==undefined){
						bl_count[bitLengths[i]]=1;
					}else{
						bl_count[bitLengths[i]]++;
					}
			}
		bitLenObj.sort(function(a,b){
			return a.bitLen>b.bitLen;
		});
  
		let code = 0, binaryCode, codes = [];
			for(let i=0;i<bitLenNonZero;i++){
				binaryCode=code.toString(2);
				binaryCode = '0'.repeat(bitLenObj[i].bitLen - binaryCode.length) + binaryCode;
				codes[bitLenObj[i].index]=binaryCode;
					if(i<bitLenNonZero-1){
						code = (code + 1) << (bitLenObj[i+1].bitLen - bitLenObj[i].bitLen);
					}
			}
		return codes;
	}
	static bitLengthCodes2(bitLengths, useReversedCodeWords=false, prependZero=true){
		//bl_count is the number of Codes of Length N
		let bl_count = [], bitMax = 0, bitLenCount = bitLengths.length;
			for(let i=0;i<bitLenCount;i++){
					if(bitLengths[i]>bitMax){
						bitMax=bitLengths[i];
					}
					if(bl_count[bitLengths[i]]==undefined){
						bl_count[bitLengths[i]]=1;
					}else{
						bl_count[bitLengths[i]]++;
					}
			}
		let code = 0, next_code = [];
		bl_count[0]=0;
			for(let bits = 1;bits<=bitMax;bits++){
				code = (code + bl_count[bits-1]) << 1;
				next_code[bits] = code;
			}
  
		let codes = [], tempLen;
			for(let n = 0;n<bitLenCount;n++){
				tempLen = bitLengths[n];
					if(tempLen>0){
						//codes[n] = next_code[tempLen[n]];
						codes[n] = next_code[tempLen].toString(2);
							if(prependZero){
								codes[n] = '0'.repeat(tempLen-codes[n].length) + codes[n];
							}else{
								codes[n] = codes[n] + '0'.repeat(tempLen-codes[n].length);
							}
							if(useReversedCodeWords){codes[n] = codes[n].split('').reverse().join('');}
						next_code[tempLen]++;
					}
			}
		return codes;
	}
	static bitLengthCodes_old(bitLengths, useReversedCodeWords=false){
		//bl_count is the number of Codes of Length N
		let bl_count = [], bitMax = 0, bitLenCount = bitLengths.length, tempLen = [];
			for(let i=0;i<bitLenCount;i++){
				tempLen[i] = bitLengths[i];
					if(tempLen[i]>bitMax){
						bitMax=tempLen[i];
					}
					if(bl_count[tempLen[i]]==undefined){
						bl_count[tempLen[i]]=1;
					}else{
						bl_count[tempLen[i]]++;
					}
			}
		
  let code = 0, next_code = [];
		bl_count[0]=0;
			for(let bits = 1;bits<=bitMax;bits++){
				code = (code + bl_count[bits-1]) << 1;
				next_code[bits] = code;
			}
  
		let codes = [];
			for(let n = 0;n<bitLenCount;n++){
				if(tempLen[n]>0){
					//codes[n] = next_code[tempLen[n]];
					codes[n] = next_code[tempLen[n]].toString(2);
					codes[n] = '0'.repeat(tempLen[n]-codes[n].length) + codes[n];
						if(useReversedCodeWords){codes[n] = codes[n].split('').reverse().join('');}
					next_code[tempLen[n]]++;
				}
			}
		return codes;
	}
	static fromBitLengths(bitLengthArray, useReversedCodeWords=false){
		let bitLenCodes = this.bitLengthCodes(bitLengthArray, useReversedCodeWords), bLA_len = bitLengthArray.length;
		let hfmTree = new HuffmanTree();
			for(let i=0;i<bLA_len;i++){
					if(bitLenCodes[i]==undefined){continue;}
				hfmTree.insert(bitLenCodes[i], bitLenCodes[i].length, i);
			}
		return hfmTree;
	}
}

function deflate(r, literal_length_tree, distance_tree, out){
	LengthExtraBits = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
	LengthBase = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258];
	DistanceExtraBits = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
	DistanceBase = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577];
	
// TODO: Generalise
}
function array_removeAt(arr, index){ // Removes the given index
		if(index==0){
			arr.shift();
		}else if(index==arr.length-1){
			arr.pop();
		}else{
			arr= arr.slice(0, index).concat(arr.slice(index+1));
		}
	return arr;
}
function treeWalk(treeNode, branchAttributeName, callback, walkVariable){
	//Walk the tree with a given branch attribute and run the callback function(curBranch, branchIndex, curTree, walkVariable)
		if(treeNode==undefined || treeNode==null || treeNode[branchAttributeName]==undefined){return false;}
	let numOf = treeNode[branchAttributeName].length;
		for(let i=0;i<numOf;i++){
			callback(treeNode[branchAttributeName][i], i, treeNode, walkVariable);
		}
	return true;
}
function treeLeafs(treeNode, branchAttributeName){
	//Return leafs
		if(treeNode==undefined || treeNode==null){return undefined;}
		if(treeNode[branchAttributeName]==undefined){
			return treeNode;
		}
	let leafs = [], branchLeafs;
	let numOf = treeNode[branchAttributeName].length;
		for(let i=0;i<numOf;i++){
			branchLeafs = treeLeafs(treeNode[branchAttributeName][i], branchAttributeName);
				if(branchLeafs!==undefined){
					leafs.push(branchLeafs);
				}
		}
	return leafs.flat();
}
function sort_Huffman_ByFrequency(a,b){
	return a.frequency>b.frequency?1:-1;
}
function callback_HuffmanCode(node, index, arr, walkVariable){
	walkVariable = (walkVariable==undefined?'':walkVariable)+index;
		if(node['children']==undefined){
			node['huffmanCode'] = walkVariable;
		}else{
			treeWalk(node, 'children', callback_HuffmanCode, walkVariable);
		}
}
function Huffman_Encode(message){
	let charIndex, charBank = [], charFrequency = [], messageLen = message.length;
		for(let i=0;i<messageLen;i++){
			charIndex = charBank.indexOf(message[i]);
				if(charIndex!==-1){
					charFrequency[charIndex].frequency++;
				}else{
					charBank.push(message[i]);
					charFrequency.push({character:message[i], frequency:1});
				}
		}

	let numberOfChars = charFrequency.length, loopCount = 10000;
	charFrequency.sort(sort_Huffman_ByFrequency);

		while(numberOfChars>1 && loopCount>0){
			/*
			d2 c3 a4 e4 b7
			a4 e4 [d c]5 b7
			[d c]5 b7 [a e]8
			[a e]8 [[d c] b]12
			[[a e] [[d c] b]]20
			*/
			charFrequency[0] = {children: [charFrequency[0], charFrequency[1]], frequency:charFrequency[0].frequency+charFrequency[1].frequency};
			charFrequency = array_removeAt(charFrequency, 1);
			
			charFrequency.sort(sort_Huffman_ByFrequency);
			numberOfChars = charFrequency.length;
			loopCount--;
		}
	treeWalk(charFrequency[0], 'children', callback_HuffmanCode);
	charFrequency = treeLeafs(charFrequency[0], 'children');
	numberOfChars = charFrequency.length;
	let characterMap = {};
		for(let i=0;i<numberOfChars;i++){
			characterMap[charFrequency[i].character]=charFrequency[i].huffmanCode;
		}
	let newMessage = '', oldMessage = '';;
		for(let i=0;i<messageLen;i++){
			oldMessage+=message.charCodeAt(i).toString(2);
			newMessage+=characterMap[message[i]];
		}
	
	let numOf = newMessage.length, hex='';
	return [characterMap, newMessage];
}
function Huffman_Decode(characterMap, message){
	let messageLen=message.length, pointer=0, content='', curChar;
		while(pointer<messageLen){
			for(let character in characterMap){
				curChar = characterMap[character];
					if(curChar==message.substring(pointer,pointer+curChar.length)){
						content+=character
						pointer+=curChar.length;
					}
			}
		}
	return content;
}

function getDictionaryChunk(dictionary, len, distance){
	let strBlock = dictionary.substr(distance*-1, len);
		if(len>distance){
			strBlock=strBlock.repeat(Math.ceil(len/distance));
			return strBlock.substring(0,len);
		}
	return strBlock;
}
function deFlate_compressedBlocks_ExtraBits_DistanceCode(code){
	//[N/2]-1
		if(code ==undefined || code == null || code<0 || code>29){return undefined;}
		if(code<4){return [0,code+1];}
	let extraBitLen=0, lenOffset = 5;
		for(let offset=6;offset<31;offset+=2){
				if(code < offset){
					return [extraBitLen+1, (code-offset+2)*Math.pow(2,extraBitLen)*2 + lenOffset];
				}
			lenOffset+=4*Math.pow(2,extraBitLen);
			extraBitLen++;
		}
}
function deFlate_compressedBlocks_ExtraBits_LengthCode(code){
		if(code ==undefined || code == null || code<257 || code>285){return undefined;}
		if(code == 285){return [0,258];}
		if(code<265){return [0,3+code-257];}
	let extraBitLen=1, lenOffset = 11;	
		for(let offset=269;offset<286;offset+=4){
				if(code < offset){
					return [extraBitLen, (code-offset+4)*Math.pow(2,extraBitLen)+lenOffset];
				}
			lenOffset+=4*Math.pow(2,extraBitLen);
			extraBitLen++;
		}
}
function CRC_32(bitStreamString, CRC32POLY_Reversed=0xEDB88320){
	let crc = CRC32_Create_FromString(bitStreamString,CRC32POLY_Reversed);
	crc = (~crc).toString(2);
	crc = ('0'.repeat(32-crc.length))+crc;
	crc = crc.replaceAll(1,2).replaceAll(0,1).replaceAll(2,0);
	return parseInt(crc,2).toString(16);
}
function CRC32_Create_FromString_Hex(bitStreamString, CRC32POLY_Reversed=0xEDB88320){
	return CRC32_Create_FromString(bitStreamString,CRC32POLY_Reversed).toString(16);
}
function CRC32_Create_FromString(bitStreamString, CRC32POLY_Reversed=0xEDB88320){
	let bitStreamArray=[], bitStreamLen=bitStreamString.length, tempByte, tempLen;
		for(let i=0;i<bitStreamLen;i++){
			tempByte = bitStreamString.charCodeAt(i).toString(2);
			tempLen = tempByte.length;
				for(let j=0;j<8;j++){
					bitStreamArray[i*8+j] = tempLen>j?(tempByte[tempLen-j-1]=='1'?1:0):0;
				}
		}
	return CRC32_Create(bitStreamArray,CRC32POLY_Reversed);
}
function CRC32_Create(bitStreamArray, CRC32POLY_Reversed=0xEDB88320){
	let bitCount = bitStreamArray.length;
	let crc32 = ~0;
		for(let i=0;i<bitCount; i++){
			if ((crc32 & 1) != bitStreamArray[i])
				crc32 = (crc32 >>> 1) ^ CRC32POLY_Reversed;
			else
				crc32 = (crc32 >>> 1);
		}
	return ~crc32;
}

function writeZIP(fileName, fileContents){
	/*
		local file header signature     4 bytes  (0x04034b50)
		version needed to extract       2 bytes
		general purpose bit flag        2 bytes
		compression method              2 bytes
		last mod file time              2 bytes
		last mod file date              2 bytes
		crc-32                          4 bytes
		compressed size                 4 bytes
		uncompressed size               4 bytes
		file name length                2 bytes
		extra field length              2 bytes

		file name (variable size)
		extra field (variable size)
		
		[encryption header]
		compressed data (variable size)
		
		crc-32                          4 bytes
		compressed size                 4 bytes
		uncompressed size               4 bytes
		
		
		central file header signature   4 bytes  (0x02014b50)
		version made by                 2 bytes
		version needed to extract       2 bytes
		general purpose bit flag        2 bytes
		compression method              2 bytes
		last mod file time              2 bytes
		last mod file date              2 bytes
		crc-32                          4 bytes
		compressed size                 4 bytes
		uncompressed size               4 bytes
		file name length                2 bytes
		extra field length              2 bytes
		file comment length             2 bytes
		disk number start               2 bytes
		internal file attributes        2 bytes
		external file attributes        4 bytes
		relative offset of local header 4 bytes

		file name (variable size)
		extra field (variable size)
		file comment (variable size)
		
		end of central dir signature    4 bytes  (0x06054b50)
		number of this disk             2 bytes
		number of the disk with the
		start of the central directory  2 bytes
		total number of entries in the
		central directory on this disk  2 bytes
		total number of entries in
		the central directory           2 bytes
		size of the central directory   4 bytes
		offset of start of central
		directory with respect to
		the starting disk number        4 bytes
		.ZIP file comment length        2 bytes
		.ZIP file comment       (variable size)
	*/
	let bytes = [0x50, 0x4b, 3, 4] //File Header
	bytes.push(14,0); //2.0		 //Extract Version
	bytes.push(0,0);			 //General Purpose Flag
	//0 = Stored, 8 = Deflate
	bytes.push(0,0);			 //Compression Method
	
}

function BinaryZIPDataTestRun(){
	//YouTube Video
	//https://www.youtube.com/watch?v=oi2lMBBjQ8s
	//BillBird - Data Compression - Lecture 11 - DEFLATE (gzip)

	let rawdata = '011010100101011010100101001111000111111110110100100011100011010000110100100111010011110000010100111010011101101101001111000001010011101001110110110100';
	let bitOffset=0;

	let hLit = 264, hDist = 7;
	let CL_Data = [4, 3, 0, 2, 3, 0, 0, 0, 0, 0, 0,  0,  0,  0,  0,  0,  4,  3,  2];
	let CL_Codes = HuffmanTree.fromBitLengths(CL_Data);

	let next = CL_Codes.retrieveNextCodeWord(rawdata.substring(bitOffset,bitOffset+16)), usedCodes = 0, temp, lastLen;
	let LL_D_Lengths = [];
		while(usedCodes<hLit+hDist){
				if(next == undefined){
					console.warn('Unexpected ending of BitStream');
					break;
				}
			bitOffset+=next[1];
				switch(next[0]){
					case 16: //Copy
						temp = parseInt(rawdata.substring(bitOffset,bitOffset+2).split('').reverse().join(''),2)+3;
						bitOffset+=2;
						usedCodes+=temp;
							for(let i=0;i<temp;i++){
								LL_D_Lengths.push(lastLen);
							}
						break;
					case 17: //Add Zeros
						temp = parseInt(rawdata.substring(bitOffset,bitOffset+3).split('').reverse().join(''),2)+3;
						bitOffset+=3;
						usedCodes+=temp;
							for(let i=0;i<temp;i++){
								LL_D_Lengths.push(0);
							}
						break;
					case 18: //Add more Zeros
						temp = parseInt(rawdata.substring(bitOffset,bitOffset+7).split('').reverse().join(''),2)+11;
						bitOffset+=7;
						usedCodes+=temp;
							for(let i=0;i<temp;i++){
								LL_D_Lengths.push(0);
							}
						break;
					default: //Literal
						LL_D_Lengths.push(next[0]);
						lastLen = next[0];
						usedCodes++;
				}
			next = CL_Codes.retrieveNextCodeWord(rawdata.substring(bitOffset,bitOffset+16));
		}

	let DistanceCodes = LL_D_Lengths.slice(hLit);
	LL_D_Lengths = LL_D_Lengths.slice(0, hLit);

	let Distance_Codes = HuffmanTree.fromBitLengths(DistanceCodes);
	let LL_Codes = HuffmanTree.fromBitLengths(LL_D_Lengths);

	next = LL_Codes.retrieveNextCodeWord(rawdata.substring(bitOffset,bitOffset+16));
	let message = '';
	let lenDist;
		while(next!==undefined && next[0]!==256 && bitOffset<rawdata.length){
				if(next[0]<256){
					//Literal
					message+=String.fromCharCode(next[0]);
					bitOffset+=next[1];
				}else{
					//Length-Distance
					//First argument are the extrabits, Second argument is the LengthCode
					lenDist = [deFlate_compressedBlocks_ExtraBits_LengthCode(next[0]),undefined];
					//Moving to the Distance-Code
					bitOffset+=next[1]+lenDist[0][0];
					
					next = Distance_Codes.retrieveNextCodeWord(rawdata.substring(bitOffset,bitOffset+16));
					lenDist[1] = deFlate_compressedBlocks_ExtraBits_DistanceCode(next[0]);
					bitOffset+=next[1]+lenDist[1][0];
					lenDist = [lenDist[0][1]+(lenDist[0][0]==0?0:parseInt(rawdata.substring(bitOffset,bitOffset+lenDist[0][0]),2)), lenDist[1][1]+(lenDist[1][0]==0?0:parseInt(rawdata.substring(bitOffset,bitOffset+lenDist[1][0]),2))];
					message+=getDictionaryChunk(message, lenDist[0], lenDist[1]);
				}
			next = LL_Codes.retrieveNextCodeWord(rawdata.substring(bitOffset,bitOffset+16));
		}
	console.log('Message', message);
}
