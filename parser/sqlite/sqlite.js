const SQLITE = {
	sqlite_readFile: function(data){
		let ret = '', sqlFile = {};
		
		let fP = new FileParser();
		fP.init(Uint8Array.from(data.split('').map(x => x.charCodeAt())));
		sqlFile.filesize = fP.size;
			if(sqlFile.filesize>1073741824){
				sqlFile.LockBytePage = {};
			}
		
		ret+=sqlite_readHeader(fP, sqlFile);
		
		console.log('---');
		
		ret+=sqlite_readPages(fP, sqlFile);
		
		let pageNumber = 0;
		ret+=sqlite_readPage(fP, sqlFile, pageNumber);

		console.log(sqlFile);
		return ret;
	}
	sqlite_readHeader: function(fP, sqlFile){ //FileParser
		let ret = '';
		fP.rewind(0);
		sqlFile.header = {};
		
		sqlFile.header.signature = fP.nextNChars(16);
		ret+='Signature: '+sqlFile.header.signature+' ('+((sqlFile.header.signature=="\x53\x51\x4c\x69\x74\x65\x20\x66\x6f\x72\x6d\x61\x74\x20\x33\x00")?'':'in')+'valid)<br>';
		
		sqlFile.header.pageSize = fP.nextNBytes_toInt(2);
			if(sqlFile.header.pageSize==1){
				sqlFile.header.pageSize=65536;
			}
		ret+='Database Page Size: '+sqlFile.header.pageSize+'<br>';

		sqlFile.header.writeVersion = fP.nextByte;
		ret += 'File Format Write Version [1 - legacy, 2 - WAL]: ' + sqlFile.header.writeVersion + '<br>';
		sqlFile.header.readVersion = fP.nextByte;
		ret += 'File Format Read Version [1 - legacy, 2 - WAL]: ' + sqlFile.header.readVersion + '<br>';
		sqlFile.header.reservedPageSpace = fP.nextByte;
		ret += 'Reserved Page Space (End of Page): ' + sqlFile.header.reservedPageSpace + '<br>';
		sqlFile.header.maxPayload = fP.nextByte;
		ret += 'Maximum Embedded Payload Fraction (64): ' + sqlFile.header.maxPayload + '<br>';
		sqlFile.header.minPayload = fP.nextByte;
		ret += 'Minimum Embedded Payload Fraction (32): ' + sqlFile.header.minPayload + '<br>';
		sqlFile.header.leafPayload = fP.nextByte;
		ret += 'Leaf Payload Fraction (32): ' + sqlFile.header.leafPayload + '<br>';
		sqlFile.header.changeCounter = fP.nextNBytes_toInt(4);
		ret += 'File Change Counter: ' + sqlFile.header.changeCounter + '<br>';
		sqlFile.header.dbSizeInPage = fP.nextNBytes_toInt(4);
		ret += 'Database File-Size in Pages: ' + sqlFile.header.dbSizeInPage + '<br>';
		sqlFile.header.freelistPageOffset = fP.nextNBytes_toInt(4);
		ret += 'Page Number of First Freelist Trunk Page: ' + sqlFile.header.freelistPageOffset + '<br>';
		sqlFile.header.numOfFreelistPages = fP.nextNBytes_toInt(4);
		ret += 'Total Number of Freelist Pages: ' + sqlFile.header.numOfFreelistPages + '<br>';
		sqlFile.header.schemaCookie = fP.nextNBytes_toInt(4);
		ret += 'Schema-Cookie: ' + sqlFile.header.schemaCookie + '<br>';
		sqlFile.header.schemaFormat = fP.nextNBytes_toInt(4);
		ret += 'Schema-Format-Number (1,2,3,4): ' + sqlFile.header.schemaFormat + '<br>';
		sqlFile.header.suggestedCacheSize = fP.nextNBytes_toInt(4);
		ret += 'Suggested Cache Size: ' + sqlFile.header.suggestedCacheSize + '<br>';
		sqlFile.header.incrementalVacuum = fP.nextNBytes_toInt(4);
		ret += 'Page Number of largest root b-Tree Page in auto-vacuum/incremental-vacuum, or zero: ' + sqlFile.header.incrementalVacuum + '<br>';
		sqlFile.header.textEncoding = fP.nextNBytes_toInt(4);
		ret += 'Text Encoding [1 - UTF-8, 2 - UTF-16le, 3 - UTF-16be]: ' + sqlFile.header.textEncoding + '<br>';
		sqlFile.header.userVersion = fP.nextNBytes_toInt(4);
		ret += 'User Version: ' + sqlFile.header.userVersion + '<br>';
		sqlFile.header.incrementalVacuumMode = fP.nextNBytes_toInt(4);
		ret += 'Incremental-Vacuum-Mode if non zero: ' + sqlFile.header.incrementalVacuumMode + '<br>';
		sqlFile.header.applicationID = fP.nextNBytes_toInt(4);
		ret += 'Application ID: ' + sqlFile.header.applicationID + '<br>';
		sqlFile.header.reservedHeaderSpace = fP.nextNBytes_toInt(20);
		ret += 'Reserved Header Space (0): ' + sqlFile.header.reservedHeaderSpace + '<br>';
		sqlFile.header.versionValidFor = fP.nextNBytes_toInt(4);
		ret += 'Version-Valid-For: ' + sqlFile.header.versionValidFor + '<br>';
		sqlFile.header.sqliteVersionNumber = fP.nextNBytes_toInt(4);
		ret += 'SQLite Version Number: ' + sqlFile.header.sqliteVersionNumber + '<br>';
		
		sqlFile.header.numOfPages = sqlFile.filesize / sqlFile.header.pageSize;
		ret += 'Number of Pages: '+sqlFile.header.numOfPages+'<br>';
		
		return ret;
	}
	sqlite_readPages: function(fP, sqlFile){
		let ret = '', page;
		sqlFile.pages = [];
		
		//Scan Freelist-Pages
			if(sqlFile.header.numOfFreelistPages>0){
				page = sqlFile.header.freelistPageOffset-1;
				fP.pointer = page*sqlFile.header.pageSize;
					for(let i = 0;i<sqlFile.header.numOfFreelistPages;i++){
						//Insert current Page
						sqlFile.pages[page] = {type:'Freelist', offset:fP.pointer};
						ret+=sqlite_readPage_freelist_trunk(fP, sqlFile.pages[page]);
						//Scan next pageNumber
						//Scan free Pages
						//Insert free Pages
						//Move pointer to next pageNumber
					}
			}
		//Scan bTree-Pages
			for(let i=0;i<sqlFile.header.numOfPages;i++){
				ret+=sqlite_readPage(fP, sqlFile, i);
			}
		
		return ret;
	}
	sqlite_readPage: function(fP, sqlFile, pageNumber=0){
		let ret='';
		let offset = sqlFile.header.pageSize*pageNumber;
			if(pageNumber==0){offset+=100;}
		fP.pointer = offset;
		//console.log(fP.nextNHex(sqlFile.header.pageSize-sqlFile.header.reservedPageSpace-(pageNumber==0?100:0)));
		
			if(sqlFile.pages[pageNumber]!==undefined){ //Already scanned
				//return contents
			}else{
				//Page Header
				let pageObj, bTreePageType = fP.nextByte;
					switch(bTreePageType){
						case 2: //Interior index bTree
							pageObj = {type:'index', offset:fP.pointer};
							break;
						case 5: //Interior table bTree
							pageObj = {type:'table', offset:fP.pointer};
							break;
						case 10: //Leaf index bTree
							pageObj = {type:'indexLeaf', offset:fP.pointer};
							break;
						case 13: //Leaf table bTree
							pageObj = {type:'tableLeaf', offset:fP.pointer};
							break;
						default: //Error
							sqlFile.pages[pageNumber] = {type:'Error', offset:fP.pointer};
							ret+='Page-Type-Error['+pageNumber+']: '+bTreePageType+'<br>';
							return ret;
					}
				pageObj.freeBlockOffset = fP.nextNBytes_toInt(2);
				pageObj.numOfCells = fP.nextNBytes_toInt(2);
				pageObj.cellContentOffset = fP.nextNBytes_toInt(2);
					if(pageObj.cellContentOffset==0){
						pageObj.cellContentOffset = 65536;
					}
				pageObj.numOfFragmentedFreeBytes = fP.nextNBytes_toInt(1);
					if(bTreePageType<6){
						pageObj.lastPointerOffset= fP.nextNBytes_toInt(4);
					}
				//Cell Pointer Array
				pageObj.cellPointers = [];
				pageObj.cells = [];
				let cellOffset, cell, curPointer;
				
				//Overflow Variables
				let _U = sqlFile.header.pageSize-sqlFile.header.reservedHeaderSpace-(pageNumber==0?100:0), partialPayload;
				
					for(let i=0;i<pageObj.numOfCells;i++){
						cellOffset = fP.nextNBytes_toInt(2);
						curPointer = fP.pointer;
						
						pageObj.cellPointers.push(cellOffset);
						cell = {offset: cellOffset};
						
						fP.pointer = offset + cellOffset;
							switch(bTreePageType){
								case 2:
									//4 bytes pageNumber of left pointer
									cell.leftPointer = fP.nextNBytes_toInt(4);
									//Varint - payload number of bytes
									cell.payloadLen = sqlite_readVarInt(fP);
									//Calculate Overflow
									partialPayload = sqlite_readOverflow(bTreePageType, cell.payloadLen, _U);
									//Payload without overflow (Key)
									cell.payload = fP.nextNChars(partialPayload);
									//optional 4 byte pageNumber of first overflow page
										if(partialPayload!==cell.payloadLen){
											cell.overflowPages = [fP.nextNBytes_toInt(4)];
										}
									break;
								case 5:
									//4 byte pageNumber of left pointer
									cell.leftPointer = fP.nextNBytes_toInt(4);
									//Varint - key
									cell.key = sqlite_readVarInt(fP);
									break;
								case 10:
									//Varint - payload number of bytes
									cell.payloadLen = sqlite_readVarInt(fP);
									//Calculate Overflow
									partialPayload = sqlite_readOverflow(bTreePageType, cell.payloadLen, _U);
									//Payload without overflow (Key)
									cell.payload = fP.nextNChars(partialPayload);
									//optional 4 byte pageNumber of first overflow page
										if(partialPayload!==cell.payloadLen){
											cell.overflowPages = [fP.nextNBytes_toInt(4)];
										}
									break;
								case 13:
									//Varint - payload number of bytes
									cell.payloadLen = sqlite_readVarInt(fP);
									//Varint - key
									cell.key = sqlite_readVarInt(fP);
									//Calculate Overflow
									partialPayload = sqlite_readOverflow(bTreePageType, cell.payloadLen, _U);
									//Payload without overflow (Data)
									cell.payload = fP.nextNChars(partialPayload);
									//optional 4 byte pageNumber of first overflow page
										if(partialPayload!==cell.payloadLen){
											cell.overflowPages = [fP.nextNBytes_toInt(4)];
										}
									break;
							}
						
						pageObj.cells.push(cell);
						console.log(cell);
						fP.pointer = curPointer[0];
					}
				
				
				//Insert Page
				sqlFile.pages[pageNumber] = pageObj;
				ret+='<p>'+htmlentities(JSON.stringify(pageObj))+'</p>';
			}

		return ret;
	}
	sqlite_readOverflow: function(pageType, payloadLen, usableSpace){
		/*
		U = Usable Space on Page
		P = Payload Size
		X = Max. Len before Overflow
		M = Min. Len before Overflow can occur
		*/
		let _U = usableSpace, _P = payloadLen, overflowing;
		let _M = ((_U-12)*32/255)-23;
		let _K = _M+((_P-_M)%(_U-4));
		let _X = pageType==13?(_U-35):(((_U-12)*64/255)-23);
		overflowing = _P > _X;
			if(overflowing){
				return (_K<=_X?_K:_M);
			}else{
				return _P;
			}
	}
	sqlite_readVarInt: function(fP){
		let pointer = fP.pointer, curByte;
		let varInt='', numOfBytesUsed=0, curBin;
			while(((curByte = fP.nextByte) & 128) == 128 && numOfBytesUsed<9){ //While Highest-Bit is set & number of bytes max. 9
				curBin = (curByte & (numOfBytesUsed==8?255:127)).toString(2);
				varInt += '0'.repeat((numOfBytesUsed==8?8:7)-curBin.length)+curBin;
				numOfBytesUsed++;
			}
			if(numOfBytesUsed<9){
				curBin = (curByte & 255).toString(2);
				varInt += '0'.repeat(8-curBin.length)+curBin;
			}
		varInt = varInt.replaceAll(0,2).replaceAll(1,0).replaceAll(2,1);
		return parseInt(varInt,2);
	}
	sqlite_readPage_freelist_trunk: function(fP, pageObj){
		//4-byte integers
		//integers[0] = next freelist-trunk pageNumber, or zero
		//integers[1] = number of freelist-leaf pages numbers
		//integers[2, ..., integers[1]+1] = freelist-leaf pageNumber

		//The last 6 numbers integers[integers[1]-5, ..., integers[1]+1] should be zero
	}
	sqlite_readPage_freelist_leaf: function(fP, pageObj){
		//Should contain no data
	}
	sqlite_readPage_btree: function(fP, pageObj){ //bTree-Page
		/*Struct:
			Header(on page 1): 100 bytes
			bTree-Header: 8 or 12 bytes
			Cell-Pointer-Array
			Unallocated Space
			Cell Content Area
			Reserved Space
		*/

		//hasParent / isRoot / isLeaf
		//Root: root pageNumber
		//Parent: parent-bTree pageNumber
		//Type: table, index
		//Children: [bTree pageNumber]
	}
	sqlite_readPage_btree_table: function(fP, pageObj){ //TablePage
		//Keys and associated Data
		//Key = 64-bit signed integer => RowID
		//Data = payload
	}
	sqlite_readPage_btree_index: function(fP, pageObj){ //InteriorPage
		//K Keys || K:2+, only pageNumber==1 K:1+
		//K+1 pointers to btree-Pages || pointer = 32-bit unsigned pageNumber
		//Key = payload
		//[pointerN, [keyN, pointerN+1]+]
		//[pointerN, keyN] = Cell
	}
};