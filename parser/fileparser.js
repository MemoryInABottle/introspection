class FileParser{
	/** The Bytes of the File as unsigned int8 Array */
	byteData;
	/** The Length of the Bytes in the File */
	byteData_Length;
	/** The current pointer Position in the File */
	byteData_Pointer;
	/** The current bit pointer Position in the current Byte */
	byteData_BitPointer;
	/**
	*  The Endian of the Reader (Reading of bits)
	*  true = Big Endian    01234567 89abcdef ghijklmn
	*  false = Little Endian 76543210 fedcba98 nmlkjihg
	*/
	endian = true;
	
	/**
		Opens a file to initialise, using the file-path
		@param filePath [File] file Object, [String] file Path, [undefined] uninitialised
		@param endianness true = BigEndian, false = LittleEndian
	*/
	constructor(filePath, callback_on_success, endian=true){
		this.byteData=undefined;
		this.byteData_Length=-1;
		this.byteData_Pointer=-1;
		this.byteData_BitPointer=-1;
		this.endian = endian;
			if(filePath!==undefined){
				let url = (typeof filePath === 'string' || filePath instanceof String) ? filePath : URL.createObjectURL(filePath);
				fetch(url).then(x => x.arrayBuffer()).then(y => this.init(new Uint8Array(y))).then(x => callback_on_success(this));
			}
	}
	/**
		Initialises byteData with a given byte-Array
		@param byteArray [Uint8Array]
	*/
	init(byteArray){
		this.byteData = byteArray;
		this.byteData_Length = byteArray.length;
		this.byteData_Pointer = 0;
		this.byteData_BitPointer=0;
	}
	/**
		Returns a boolean whether or not End-Of-File is reached
		Returns undefined if the byteData hasn't been initialised
	*/
	get eof(){
			if(this.byteData_Length==-1){
				return undefined;
			}
		return (this.byteData_Pointer>=this.byteData_Length);
	}
	/**
		Returns the length of the byteData
		Returns undefined if the byteData hasn't been initialised
	*/
	get size(){
			if(this.byteData_Length==-1){
				return undefined;
			}
		return this.byteData_Length;
	}
	/**
		Sets the Endian of the Reader (true = BigEndian, false = LittleEndian)
	*/
	set endian(endian){
		this.endian = endian;
	}
	/**
		Returns the Endian of the Reader
	*/
	get endian(){
		return this.endian;
	}
	/**
		Returns the pointer Position, -1 if byteData hasn't been initialised
	*/
	get pointer(){
		return [this.byteData_Pointer, this.byteData_BitPointer];
	}
	/**
		Sets the pointer to a given index between zero and byteData.length
	*/
	set pointer(bytePos){
		this.setPointer(bytePos,0);
	}
	/**
		Sets the pointer to a given index between zero and byteData.length
	*/
	setPointer(bytePos, bitPos=0){
		this.byteData_Pointer=(this.byteData_Length!==-1?Math.min(this.byteData_Length, Math.max(0, bytePos)):-1);
		this.byteData_BitPointer=(this.byteData_Length!==-1?Math.min(7, Math.max(0, bitPos)):-1);
	}
	/**
		Moves the pointer by a given amount
	*/
	move(byteAmount, bitAmount=0){
		if(this.byteData_Length!==-1){
			let bits = this.byteData_BitPointer + bitAmount;
			this.setPointer(this.byteData_Pointer + byteAmount + Math.floor(bits/8), bits%8);
		}
	}
	/**
		Resets the pointer to zero, or -1 if the byteData hasn't been initialised
	*/
	rewind(){
		this.pointer=0;
	}
	/**
		Returns the next part of the byte-Array
		@param MSB Most SignificantBit first - Boolean
	*/
	nextChunk(bytes=1, bits=0, MSB=true){
		let byteOffset = this.byteData_Pointer, bitOffset = this.byteData_BitPointer, bitLen = bytes*8+bits, littleEndian = !this.endian;
			if(bitLen==0){return '';}
		let partialBitOffset = Math.floor(bitOffset/8);
		byteOffset+=partialBitOffset;
		bitOffset%=8;
		
		let byteLen = Math.ceil((bitLen+bitOffset)/8);
		
		let binaryChunk = this.getBinaryBytes(byteOffset, byteLen);
		
		let pointer = 0;
		let byteChunk = '';
			if(littleEndian){
				let curBit, curByte, curVal, tempChunk='';
					while(bitLen>0){
						curByte=Math.floor((bitLen-1+bitOffset)/8);
						curBit=7-((bitLen-1+bitOffset)%8);
						curVal = binaryChunk.substring(pointer+curByte*8+curBit,pointer+curByte*8+curBit+1);
							if(curBit==0){
								byteChunk+=tempChunk;
								tempChunk='';
							}
						tempChunk=curVal+tempChunk;
						bitLen--;
					}
				byteChunk = tempChunk+byteChunk;
			}else{
				pointer += bitOffset;
				byteChunk = binaryChunk.substring(pointer, pointer+byteLen*8);
				byteChunk = binaryChunk.substring(pointer, pointer+bitLen);
			}
			if(!MSB){
				return byteChunk.split('').reverse().join('');
			}
		return byteChunk;
	}
	/**
		Moves the pointer by one Byte and returns the Byte at the current Position
	*/
	get nextByte(){
		let byt = this.curByte;
		this.move(1);
		return byt;
	}
	/**
		Moves the pointer by n Bytes and returns the Bytes
		Returns undefined when n smaller than one
	*/
	nextNBytes(n=1){
			if(n<1){return undefined;}
		let byts = [];
			while(this.eof===false && n>0){
				byts.push(this.nextByte);
				n--;
			}
		return byts;
	}
	/**
		Returns the Byte at the current Position
		Returns undefined if EOF
	*/
	get curByte(){
			if(this.eof===false){
				return this.byteData[this.byteData_Pointer];
			}
		return undefined;
	}
	/**
		Moves the pointer by n Bytes and returns the Bytes as int
		Returns undefined when n smaller than one
	*/
	nextNBytes_toInt(n=1){
			if(n<1){return undefined;}
		let hex = this.nextNHex(n);
		return parseInt(hex, 16);
	}
	/**
		Moves the pointer by one Byte and returns the Char at the current Position
	*/
	get nextChar(){
		let chr = this.curChar;
		this.move(1);
		return chr;
	}
	/**
		Moves the pointer by n Bytes and returns the Chars
		Returns undefined when n smaller than one
	*/
	nextNChars(n=1){
			if(n<1){return undefined;}
		let chrs = '';
			while(this.eof===false && n>0){
				chrs+=this.nextChar;
				n--;
			}
		return chrs;
	}
	/**
		Returns the Char at the current Position
		Returns undefined if EOF
	*/
	get curChar(){
			if(this.eof===false){
				return String.fromCharCode(this.byteData[this.byteData_Pointer]);
			}
		return undefined;
	}
	/**
		Moves the pointer by one Byte and returns the Hex at the current Position
	*/
	get nextHex(){
		let hx = this.curHex;
		//this.pointer = this.byteData_Pointer+1;
		this.move(1);
		return hx;
	}
	/**
		Moves the pointer by n Bytes and returns the Hex
		Returns undefined when n smaller than one
	*/
	nextNHex(n=1){
			if(n<1){return undefined;}
		let hx = '';
			while(this.eof===false && n>0){
				hx+=this.nextHex;
				n--;
			}
		return hx;
	}
	/**
		Returns the Hex at the current Position
		Returns undefined if EOF
	*/
	get curHex(){
			if(this.eof===false){
				let hex = this.byteData[this.byteData_Pointer].toString(16);
				return (hex.length==1?'0':'')+hex;
			}
		return undefined;
	}
	
	getByteChunk(index, byteLen){
			if(byteLen==1){
				return this.byteData[index];
			}
		return this.byteData.slice(index, index + byteLen);
	}
	getBinary(index, byteLen=1){
		return this.getByteChunk(index,byteLen).toString(2);
	}
	getBinaryBytes(index, byteLen=1){
		let temp = this.getByteChunk(index,byteLen).toString(2), tempLen = temp.length;
		return '0'.repeat(Math.ceil(tempLen/8)*8-tempLen)+temp;
	}
	getByte(index, byteLen=1){
		return this.getByteChunk(index,byteLen);
	}
	getHex(index, byteLen=1){
		return this.getByteChunk(index,byteLen).toString(16);
	}
	getChar(index, byteLen=1){
		let byteVal = this.getByteChunk(index,byteLen);
			if(byteLen>1){
				let sum=0;
				byteLen = byteVal.length;
					for(let i=0;i<byteLen;i++){
						sum+=byteVal[i];
					}
				byteVal=sum;
			}
		return String.fromCharCode(byteVal);
	}
	
	/**
	 *  Matches the data to given Name and Length Arrays
	 *  @return Object
	 */
	matchData(nameArray, lengthArray){
		//TODO Write matchData() Function
	}
	
	/**
	 *  Returns a FileParser for the given dataArray
	 *  @return FileParser
	 */
	static fromArray(dataArray){
		//TODO Write fromArray() Function
	}
}
