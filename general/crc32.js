const CRC_32 = {
	CRC_32: function(bitStreamString, CRC32POLY_Reversed=0xEDB88320){
		let crc = CRC32_Create_FromString(bitStreamString,CRC32POLY_Reversed);
		crc = (~crc).toString(2);
		crc = ('0'.repeat(32-crc.length))+crc;
		crc = crc.replaceAll(1,2).replaceAll(0,1).replaceAll(2,0);
		return parseInt(crc,2).toString(16);
	},
	CRC32_Create_FromString_Hex: function(bitStreamString, CRC32POLY_Reversed=0xEDB88320){
		return CRC32_Create_FromString(bitStreamString,CRC32POLY_Reversed).toString(16);
	},
	CRC32_Create_FromString: function(bitStreamString, CRC32POLY_Reversed=0xEDB88320){
		let bitStreamArray=[], bitStreamLen=bitStreamString.length, tempByte, tempLen;
			for(let i=0;i<bitStreamLen;i++){
				tempByte = bitStreamString.charCodeAt(i).toString(2);
				tempLen = tempByte.length;
					for(let j=0;j<8;j++){
						bitStreamArray[i*8+j] = tempLen>j?(tempByte[tempLen-j-1]=='1'?1:0):0;
					}
			}
		return CRC32_Create(bitStreamArray,CRC32POLY_Reversed);
	},
	CRC32_Create: function(bitStreamArray, CRC32POLY_Reversed=0xEDB88320){
		let bitCount = bitStreamArray.length;
		let crc32 = ~0;
			for(let i=0;i<bitCount; i++){
				if ((crc32 & 1) != bitStreamArray[i])
					crc32 = (crc32 >>> 1) ^ CRC32POLY_Reversed;
				else
					crc32 = (crc32 >>> 1);
			}
		return ~crc32;
	},
};