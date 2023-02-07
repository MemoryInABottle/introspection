class QuickZip{
	
	zip_process(zipContents){
		let z_files = [];
		let pointer = zipContents.indexOf("PK"+chr(3)+chr(4)), numOfFiles = 0;
			while(pointer>=0){
				z_files[numOfFiles] = zip_readLocalFileHeader(pointer, zipContents);
				pointer = zipContents.indexOf("PK"+chr(3)+chr(4), pointer+1);
				numOfFiles++;
			}
		return z_files;
	}
	zip_readLocalFileHeader(pointer=0, zipContents){
		let z_file = {};
		let extractVersion_Values = {
			'1.0':'Default value',
			'1.1':'File is a volume label',
			'2.0':'File is a folder (directory)',
			'2.0':'File is compressed using Deflate compression',
			'2.0':'File is encrypted using traditional PKWARE encryption',
			'2.1':'File is compressed using Deflate64(tm)',
			'2.5':'File is compressed using PKWARE DCL Implode ',
			'2.7':'File is a patch data set ',
			'4.5':'File uses ZIP64 format extensions',
			'4.6':'File is compressed using BZIP2 compression*',
			'5.0':'File is encrypted using DES',
			'5.0':'File is encrypted using 3DES',
			'5.0':'File is encrypted using original RC2 encryption',
			'5.0':'File is encrypted using RC4 encryption',
			'5.1':'File is encrypted using AES encryption',
			'5.1':'File is encrypted using corrected RC2 encryption**',
			'5.2':'File is encrypted using corrected RC2-64 encryption**',
			'6.1':'File is encrypted using non-OAEP key wrapping***',
			'6.2':'Central directory encryption',
			'6.3':'File is compressed using LZMA',
			'6.3':'File is compressed using PPMd+',
			'6.3':'File is encrypted using Blowfish',
			'6.3':'File is encrypted using Twofish'
		};
		let compressionMode_Values = [
			'The file is stored (no compression)',
			'The file is Shrunk',
			'The file is Reduced with compression factor 1',
			'The file is Reduced with compression factor 2',
			'The file is Reduced with compression factor 3',
			'The file is Reduced with compression factor 4',
			'The file is Imploded',
			'Reserved for Tokenizing compression algorithm',
			'The file is Deflated',
			'Enhanced Deflating using Deflate64(tm)',
			'PKWARE Data Compression Library Imploding (old IBM TERSE)',
			'Reserved by PKWARE',
			'File is compressed using BZIP2 algorithm',
			'Reserved by PKWARE',
			'LZMA',
			'Reserved by PKWARE',
			'IBM z/OS CMPSC Compression',
			'Reserved by PKWARE',
			'File is compressed using IBM TERSE (new)',
			'IBM LZ77 z Architecture ',
			'deprecated (use method 93 for zstd)',
			'Zstandard (zstd) Compression ',
			'MP3 Compression ',
			'XZ Compression ',
			'JPEG variant',
			'WavPack compressed data',
			'PPMd version I, Rev 1',
			'AE-x encryption marker (see APPENDIX E)'
		];
		let extractVersion = getBytes(zipContents,pointer+4,2,2);
		extractVersion = ''+Math.floor(extractVersion/10)+'.'+(extractVersion%10);
		let generalPurposeBitFlag = getBytes(zipContents,pointer+6,2,2);
		let compressionMode = getBytes(zipContents,pointer+8,2,2);
		let generalPurposeBitFlag_Array=['Encrypted: '+((generalPurposeBitFlag & 1) == 1?'Yes':'No'),'-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'];
			switch(compressionMode){
				case 6:
					generalPurposeBitFlag_Array[1] = ((generalPurposeBitFlag & 2) == 2?8:4)+'K sliding dictionary used';
					generalPurposeBitFlag_Array[2] = ((generalPurposeBitFlag & 4) == 4?3:2)+'3 Shannon-Fano trees used';
					break;
				case 8:
				case 9:
						if((generalPurposeBitFlag & 3) == 0){
							generalPurposeBitFlag_Array[1] = 'Normal (-en) compression option';
						}else if((generalPurposeBitFlag & 3) == 1){
							generalPurposeBitFlag_Array[1] = 'Maximum (-exx/-ex) compression option';
						}else if((generalPurposeBitFlag & 3) == 2){
							generalPurposeBitFlag_Array[1] = 'Fast (-ef) compression option';
						}else if((generalPurposeBitFlag & 3) == 3){
							generalPurposeBitFlag_Array[1] = 'Super Fast (-es) compression option';
						}
					break;
				case 14:
					generalPurposeBitFlag_Array[1] = 'End-of-stream (EOS) marker is '+((generalPurposeBitFlag & 2) == 2?'':'not ')+'used';
					break;
			}
			if((generalPurposeBitFlag & 8) == 8){
				generalPurposeBitFlag_Array[3] = 'CRC-32, compressed size and uncompressed size values are put in the data descriptor';
			}
			if((generalPurposeBitFlag & 32) == 32){
				generalPurposeBitFlag_Array[5] = 'File is compressed patched data';
			}
			if((generalPurposeBitFlag & 64) == 64){
				generalPurposeBitFlag_Array[6] = 'Strong encryption';
			}
			if((generalPurposeBitFlag & 2048) == 2048){
				generalPurposeBitFlag_Array[11] = 'Filename and comment fields encoded using UTF-8';
			}
			if((generalPurposeBitFlag & 8192) == 8192){
				generalPurposeBitFlag_Array[12] = 'Selected data values in the Local Header are masked';
			}
		generalPurposeBitFlag = '<ul><li>'+generalPurposeBitFlag_Array.join('</li><li>')+'</li></ul>';
		generalPurposeBitFlag = generalPurposeBitFlag.replaceAll('<li>-</li>','');
		let compressed_size = getBytes(zipContents,pointer+18,4,2);
		let filenameLen = getBytes(zipContents,pointer+26,2,2);
		let extraFieldLen = getBytes(zipContents,pointer+28,2,2);
		
		let lm_time = getBytes(zipContents,pointer+10,2,2).toString(2);
		lm_time = '0'.repeat(16-lm_time.length)+lm_time;
		lm_time = parseInt(lm_time.substring(0,16-11),2) + ':' + parseInt(lm_time.substring(16-11,16-5),2) + ':' + parseInt(lm_time.substring(16-5,16),2);
		let lm_date = getBytes(zipContents,pointer+12,2,2).toString(2);
		lm_date = '0'.repeat(16-lm_date.length)+lm_date;
		lm_date = parseInt(lm_date.substring(16-5,16),2) + '.' + parseInt(lm_date.substring(16-9,16-5),2) + '.' + (parseInt(lm_date.substring(0,16-9),2)+1980);
		
		let crc = getBytes(zipContents,pointer+14,4);
		
		z_file['Extract-Version'] = [extractVersion, extractVersion_Values[extractVersion]];
		z_file['General-Purpose-Bit-Flag'] = [getBytes(zipContents,pointer+6,2,3), generalPurposeBitFlag];
		z_file['Compression-Mode'] = [getBytes(zipContents,pointer+8,2), compressionMode_Values[compressionMode]];
		z_file['Last Modified Time'] = [getBytes(zipContents,pointer+10,2,3), lm_time];
		z_file['Last Modified Date'] = [getBytes(zipContents,pointer+12,2,3), lm_date];
		z_file['CRC-32:'] = crc;
		z_file['Compressed Size'] = getBytes(zipContents,pointer+18,4,2);
		z_file['Uncompressed Size'] = getBytes(zipContents,pointer+22,4,2);
		z_file['Filename'] = getBytes(zipContents,pointer+30,filenameLen,1);
		z_file['Extra Field'] = getBytes(zipContents,pointer+30+filenameLen,extraFieldLen,1);
		
		let stored_data='';
		
			switch(compressionMode){
				case 0: //stored
					z_file['data'] = getBytes(zipContents,pointer+30+filenameLen+extraFieldLen,compressed_size,1);
					break;
				case 8: //DeFlate
					z_file['data'] = zip_deFlate(zipContents.substring(pointer+30+filenameLen+extraFieldLen,pointer+30+filenameLen+extraFieldLen+compressed_size));
					break;
			}
		z_file['Checksum'] = CRC_32(stored_data)==crc;
		
		return z_file;
	}
	zip_deFlate(data, pointer=0, throughData=false){
		//Read binary (bytes flipped)
		let binary;
			if(throughData){
				binary = data;
			}else{
				binary = getBytes(data,0,data.length,5);
			}
		let message = '', dictionaryChunk, ret = '', isLastBlock=false, blockType;
		let blockTypeStr = ['Stored','Fixed Huffman','Dynamic Huffman','Error'];
		
			while(!isLastBlock){
				isLastBlock = binary[pointer] == '1';
				blockType = parseInt(binary[pointer+2]+binary[pointer+1],2);

				pointer+=3;
				
					if(blockType==0){ //Stored
						pointer += (8-(pointer%8))%8;
						let len = binaryChunk(binary, pointer, 16);
						pointer+=16;
						let nlen = binaryChunk(binary, pointer, 16);
						pointer+=16;
							if(bitwise_not(len,2)!==nlen){
								console.err('Length of Data error ('+len+', '+nlen+')');
							}else{
								let binaryData = binary.substring(pointer, pointer+len*8);
									for(let i=0;i<len;i++){
										message+=String.fromCharCode(binaryData.substring(i*8,i*8+8));
									}
							}
					}else if(blockType==3){ //Error
						console.err('Error Block Type');
					}else{ //Huffman (fixed / dynamic)
						//Treat Numbers as Reversed Binary Chunk
						let treatAsReversed = true;
							if(blockType==2){ //Generate Alphabet
								let hlit = 257 + binaryChunk(binary, pointer, 5, treatAsReversed);
								pointer+=5;
								let hdist = 1 + binaryChunk(binary, pointer, 5, treatAsReversed);
								pointer+=5;
								let hclen = 4 + binaryChunk(binary, pointer, 4, treatAsReversed);
								pointer+=4;
								
								let CL_Data = [], CL_Data_Order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
									for(let i=0;i<19;i++){
										if(i<hclen){
											CL_Data[CL_Data_Order[i]] = binaryChunk(binary, pointer, 3, treatAsReversed);
											pointer+=3;
										}else{
											CL_Data[CL_Data_Order[i]] = 0;
										}
									}
								let CL_Codes = HuffmanTree.fromBitLengths(CL_Data);

								let next = CL_Codes.retrieveNextCodeWord(binary.substring(pointer,pointer+16)), usedCodes = 0, temp, lastLen;
								let LL_D_Lengths = [];
									while(usedCodes<hlit+hdist){
											if(next == undefined){
												console.err('Unexpected end of Stream');
												break;
											}
										pointer+=next[1];
											switch(next[0]){
												case 16: //Copy
													temp = binaryChunk(binary, pointer, 2, true)+3;
													pointer+=2;
													usedCodes+=temp;
														for(let i=0;i<temp;i++){
															LL_D_Lengths.push(lastLen);
														}
													break;
												case 17: //Add Zeros
													temp = binaryChunk(binary, pointer, 3, true)+3;
													pointer+=3;
													usedCodes+=temp;
														for(let i=0;i<temp;i++){
															LL_D_Lengths.push(0);
														}
													break;
												case 18: //Add more Zeros
													temp = binaryChunk(binary, pointer, 7, true)+11;
													pointer+=7;
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
										next = CL_Codes.retrieveNextCodeWord(binary.substring(pointer,pointer+16));
									}

								let DistanceCodes = LL_D_Lengths.slice(hlit);
								LL_D_Lengths = LL_D_Lengths.slice(0, hlit);

								let Distance_Codes = HuffmanTree.fromBitLengths(DistanceCodes);
								let LL_Codes = HuffmanTree.fromBitLengths(LL_D_Lengths);
								
								next = LL_Codes.retrieveNextCodeWord(binary.substring(pointer,pointer+16));
								let pointerMove;
								let lenDist;
									while(next!==undefined && next[0]!==256 && pointer<binary.length){
											if(next[0]<256){
												//Literal
												message+=String.fromCharCode(next[0]);
												pointer+=next[1];
											}else{
												//Length-Distance
												//First argument are the extrabits, Second argument is the LengthCode
												let buffer;
												lenDist = [deFlate_compressedBlocks_ExtraBits_LengthCode(next[0]),undefined];
												//Moving to the Distance-Code
												pointer+=next[1]+lenDist[0][0];
												pointerMove = next[1]+lenDist[0][0];
												lenDist[0][1] = lenDist[0][1] + (lenDist[0][0]==0 ? 0 : binaryChunk(binary,pointer-lenDist[0][0],lenDist[0][0], true));
												next = Distance_Codes.retrieveNextCodeWord(binary.substring(pointer,pointer+16));
												lenDist[1] = deFlate_compressedBlocks_ExtraBits_DistanceCode(next[0]);
												pointer+=next[1]+lenDist[1][0];
												pointerMove+=next[1]+lenDist[1][0];
												lenDist = [
													lenDist[0][1],
													lenDist[1][1] + (lenDist[1][0]==0 ? 0 : binaryChunk(binary,pointer-lenDist[1][0],lenDist[1][0],true))
												];
												dictionaryChunk = getDictionaryChunk(message, lenDist[0], lenDist[1]);
												message+=dictionaryChunk;
											}
										next = LL_Codes.retrieveNextCodeWord(binary.substring(pointer,pointer+16));
									}
							}else{
								let curVal=-1, isLiteral, curLen, curByte, extraBits, totalLen;
									while(curVal!==0){
										curVal=binaryChunk(binary, pointer, 8);
										//console.log('Reading',curVal);
											if(curVal==0){
												//End of Block
												break;
											}else if(curVal<24){
												isLiteral=false;
												curVal+=256;
												curLen=7;
											}else if(curVal<192){
												isLiteral=true;
												curByte = curVal;
												curVal-=24;
												curLen=8;
											}else if(curVal<200){
												isLiteral=false;
												curByte = curVal;
												curVal+=88;
												curLen=8;
											}else{
												isLiteral=true;
												curVal-=56;
												curLen=9;
											}
										
											if(curLen!==8){
												curByte = binaryChunk(binary, pointer, curLen);
											}
										pointer+=curLen;
										
											if(isLiteral){
												curByte = String.fromCharCode(curByte-48);
												message += curByte;
											}else{
												curByte+=256;
												extraBits = deFlate_compressedBlocks_ExtraBits_LengthCode(curByte);
													if(extraBits[0]>0){ //Has Extra Bits
														extraBits[1]+=binaryChunk(binary,pointer,extraBits[0], true);
														pointer+=extraBits[0];
													}
												totalLen=curLen+extraBits[0];
												curLen = extraBits[1]; //Length
												curByte = binaryChunk(binary, pointer, 5);
												pointer+=5;
												extraBits = deFlate_compressedBlocks_ExtraBits_DistanceCode(curByte);
													if(extraBits[0]>0){ //Has Extra Bits
														extraBits[1]+=binaryChunk(binary,pointer,extraBits[0], true);
														pointer+=extraBits[0];
													}
												totalLen+=5+extraBits[0];
												curByte = extraBits[1]; //Distance
												
												dictionaryChunk = getDictionaryChunk(message, curLen, curByte);
												
												message+=dictionaryChunk;
											}
									}
							}
					}
			}

		return message;
	}
}
