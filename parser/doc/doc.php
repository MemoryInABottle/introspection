<?php
	const BIG_ENDIAN = 0;
	const LITTLE_ENDIAN = 1;
	const BINARY_PAD_LEFT=0;
	const BINARY_PAD_RIGHT=1;

	function setFileCursor($handle, $position){
		return fseek($handle, $position, SEEK_SET);
	}
	function moveFileCursor($handle, $position){
		return fseek($handle, $position, SEEK_CUR);
	}
	function getNextChar($handle){
		return fgetc($handle);
	}
	function getFilePart($handle, $length){
		return fread($handle, $length);
	}
	function getFilePartChars($handle, $length){
		return string2Char(getFilePart($handle, $length));
	}
	function getFilePartHexDec($handle, $length, $Endian=LITTLE_ENDIAN){
			if($Endian==LITTLE_ENDIAN){
				return hexdecs(fromLittleEndian(string2Char(getFilePart($handle, $length))));
			}
		return hexdecs(string2Char(getFilePart($handle, $length)));
	}
	function getFileHandle($filename){
		return fopen($filename, 'r');
	}
	function human_filesize($bytes, $decimals = 2) {
	/* From: https://www.php.net/manual/de/function.filesize.php - rommel at rommelsantor dot com */
		$sz = 'BKMGTP';
		$factor = floor((strlen($bytes) - 1) / 3);
		return sprintf("%.{$decimals}f", $bytes / pow(1024, $factor)) . @$sz[$factor];
	}
	function string2Char($string){
		$ret='';
		$len=strlen($string);
		for ($i=0; $i < $len; $i++){
			$hex=dechex(ord($string[$i]));
			$ret .= strlen($hex)==1?'0'.$hex:$hex;
		}
		return $ret;
	}
	function fromLittleEndian($hexString){
		$lE=''; $len=strlen($hexString);
			if($len<=2){
				return $hexString;
			}
			for ($i=0; $i < $len-1; $i+=2){
				$lE = $hexString[$i].$hexString[$i+1].$lE;
			}
		return $lE;
	}
	/* From: https://www.php.net/manual/en/function.hexdec.php - flurinj at gmx dot net ¶*/
	/*Signed Hex to Decimal*/
	function hexdecs($hex){
		// ignore non hex characters
		$hex = preg_replace('/[^0-9A-Fa-f]/', '', $hex);
	   
		// converted decimal value:
		$dec = hexdec($hex);
	   
		// maximum decimal value based on length of hex + 1:
		//   number of bits in hex number is 8 bits for each 2 hex -> max = 2^n
		//   use 'pow(2,n)' since '1 << n' is only for integers and therefore limited to integer size.
		$max = pow(2, 4 * (strlen($hex) + (strlen($hex) % 2)));
	   
		// complement = maximum - converted hex:
		$_dec = $max - $dec;
	   
		// if dec value is larger than its complement we have a negative value (first bit is set)
		return $dec > $_dec ? -$_dec : $dec;
	}
	function hexToBin($n, $blockSize=4, $padding=BINARY_PAD_LEFT){
		$v=base_convert($n,16,2);
		//Pad with zeroes
		$leftover=$blockSize-(strlen($v)%$blockSize);
			if($leftover==$blockSize){
				return $v;
			}
		$leftover=str_repeat('0',$leftover);
		return $padding==BINARY_PAD_LEFT?$leftover.$v:$v.$leftover;
	}
	function readZipFileSub($fileName, $subFile){
		return file_get_contents('zip://'.$fileName.'#'.$subFile);
	}
	function ZipStatusString( $status ){
		switch( (int) $status ){
			case ZipArchive::ER_OK           : return 'N No error';
			case ZipArchive::ER_MULTIDISK    : return 'N Multi-disk zip archives not supported';
			case ZipArchive::ER_RENAME       : return 'S Renaming temporary file failed';
			case ZipArchive::ER_CLOSE        : return 'S Closing zip archive failed';
			case ZipArchive::ER_SEEK         : return 'S Seek error';
			case ZipArchive::ER_READ         : return 'S Read error';
			case ZipArchive::ER_WRITE        : return 'S Write error';
			case ZipArchive::ER_CRC          : return 'N CRC error';
			case ZipArchive::ER_ZIPCLOSED    : return 'N Containing zip archive was closed';
			case ZipArchive::ER_NOENT        : return 'N No such file';
			case ZipArchive::ER_EXISTS       : return 'N File already exists';
			case ZipArchive::ER_OPEN         : return 'S Can\'t open file';
			case ZipArchive::ER_TMPOPEN      : return 'S Failure to create temporary file';
			case ZipArchive::ER_ZLIB         : return 'Z Zlib error';
			case ZipArchive::ER_MEMORY       : return 'N Malloc failure';
			case ZipArchive::ER_CHANGED      : return 'N Entry has been changed';
			case ZipArchive::ER_COMPNOTSUPP  : return 'N Compression method not supported';
			case ZipArchive::ER_EOF          : return 'N Premature EOF';
			case ZipArchive::ER_INVAL        : return 'N Invalid argument';
			case ZipArchive::ER_NOZIP        : return 'N Not a zip archive';
			case ZipArchive::ER_INTERNAL     : return 'N Internal error';
			case ZipArchive::ER_INCONS       : return 'N Zip archive inconsistent';
			case ZipArchive::ER_REMOVE       : return 'S Can\'t remove file';
			case ZipArchive::ER_DELETED      : return 'N Entry has been deleted';
		   
			default: return sprintf('Unknown status %s', $status );
		}
	}
	function readZipFileStream($fileName, $streamName){
		$z = new ZipArchive;
		$res=$z->open($fileName, ZipArchive::RDONLY);
			if ($res===TRUE) {
				$fp = $z->getStream($streamName);
					if(!$fp){
						return null;
					}
				$contents='';
					while (!feof($fp)) {
						$contents .= fread($fp, 2);
					}
				fclose($fp);
				return $contents;
			}
		return ZipStatusString($res);
	}
	function print_FancyLine($line){
		echo '<pre>'.print_r($line,true).'</pre>';
	}

	const DOC_SECTOR_TYPE_NORMAL=0;
	const DOC_SECTOR_TYPE_FREE=-1;
	//End of Chain
	const DOC_SECTOR_TYPE_EOC=-2;
	//Sector Allocation Table
	const DOC_SECTOR_TYPE_SAT=-3;
	//Master Sector Allocation Table
	const DOC_SECTOR_TYPE_MSAT=-4;
	
	const DOC_DIR_TYPE_EMPTY=0;
	const DOC_DIR_TYPE_USER_STORAGE=1;
	const DOC_DIR_TYPE_USER_STREAM=2;
	const DOC_DIR_TYPE_USER_LOCKBYTES=3;
	const DOC_DIR_TYPE_USER_PROPERTY=4;
	const DOC_DIR_TYPE_USER_ROOT_STORAGE=5;

	const DOC_DIR_NODE_COLOUR_RED=0;
	const DOC_DIR_NODE_COLOUR_BLACK=1;

		function getSectorPosition($sectorID, $sectorSize){
			return 512 + $sectorID * $sectorSize;
		}
		function getShortSectorPosition($sectorID, $sectorSize, $shortSectorSize){
			$offset=getShortSectorOffset($sectorID, $shortSectorSize);
			$box=floor($offset/$sectorSize);
			return array($box, $offset-$box*$sectorSize);
		}
		function getShortSectorOffset($sectorID, $shortSectorSize){
			return $sectorID * $shortSectorSize;
		}
		function getDirectoryEntryOffset($dirID){
			return 128*$dirID;
		}
		function getHeader($fileHandle){
			$info=array();
			rewind($fileHandle);
			$info['FileIdentifier']=getFilePartChars($fileHandle, 8);
			$info['UID']=getFilePartChars($fileHandle, 16);
			$info['RevisionNumber']=getFilePartChars($fileHandle, 2);
			$info['VersionNumber']=getFilePartChars($fileHandle, 2);
			$info['ByteOrder']=getFilePartChars($fileHandle, 2);
			$info['Endianness']=$info['ByteOrder']=='feff'?LITTLE_ENDIAN:BIG_ENDIAN;
				if($info['Endianness']==LITTLE_ENDIAN){
					$info['RevisionNumber']=hexdec(fromLittleEndian($info['RevisionNumber']));
					$info['VersionNumber'] =hexdec(fromLittleEndian($info['VersionNumber']));
				}
			$info['SectorSize']=pow(2,getFilePartHexDec($fileHandle, 2, $info['Endianness']));
			$info['ShortSectorSize']=pow(2,getFilePartHexDec($fileHandle, 2, $info['Endianness']));
			//Skip 10 unused bytes
			moveFileCursor($fileHandle, 10);
			$info['NumberOfSectors']=getFilePartHexDec($fileHandle, 4, $info['Endianness']);
			$info['SecID_DirectoryStream']=getFilePartHexDec($fileHandle, 4, $info['Endianness']);
			//Skip 4 unused bytes
			moveFileCursor($fileHandle, 4);
			$info['MinSize_StdStream']=getFilePartHexDec($fileHandle, 4, $info['Endianness']);
			$info['SecID_ShortSector']=getFilePartHexDec($fileHandle, 4, $info['Endianness']);
			$info['NumberOfSectors_ShortSector']=getFilePartHexDec($fileHandle, 4, $info['Endianness']);
			$info['SecID_MasterSector']=getFilePartHexDec($fileHandle, 4, $info['Endianness']);
			$info['NumberOfSectors_MasterSector']=getFilePartHexDec($fileHandle, 4, $info['Endianness']);
			$info['MasterSector']=array();
				for($i=0;$i<109;$i++){
					$id=getFilePartHexDec($fileHandle, 4, $info['Endianness']);
						if($id!=DOC_SECTOR_TYPE_FREE){
							$info['MasterSector'][$i]=$id;
						}
				}
			return $info;
		}
		function getSectorAllocationTable($fileHandle, $header){
			$sectorChain=array();
			$numOfSectors=count($header['MasterSector']);
				for($i=0;$i<$numOfSectors;$i++){
					setFileCursor($fileHandle,getSectorPosition($header['MasterSector'][$i], $header['SectorSize']));
					$sectorChain_Data_Size=$header['SectorSize']/2;
						for($j=0;$j<$sectorChain_Data_Size;$j+=4){
							$sectorID=getFilePartHexDec($fileHandle, 4, $header['Endianness']);
								if($sectorID!=DOC_SECTOR_TYPE_FREE){
									$sectorChain[$j/4]=$sectorID;
								}
						}
				}
			return $sectorChain;
		}
		function getShortSectorAllocationTable($fileHandle, $header, $sectorAllocationTable){
			$sectorChain=array();
			$nextID=$header['SecID_ShortSector'];
				while($nextID!=DOC_SECTOR_TYPE_EOC){
					setFileCursor($fileHandle,getSectorPosition($nextID, $header['SectorSize']));
					$sectorChain_Data_Size=$header['SectorSize']/2;
						for($j=0;$j<$sectorChain_Data_Size;$j+=4){
							$sectorID=getFilePartHexDec($fileHandle, 4, $header['Endianness']);
								if($sectorID!=DOC_SECTOR_TYPE_FREE){
									$sectorChain[$j/4]=$sectorID;
								}
						}
					$nextID=$sectorAllocationTable[$nextID];
				}
			return $sectorChain;
		}
		function getDirectory($fileHandle, $header, $sectorAllocationTable, $shortSectorAllocationTable){
			$directory=array();
			$nextID=$header['SecID_DirectoryStream'];
			$dirSize=$header['SectorSize']/128;
				while($nextID!=DOC_SECTOR_TYPE_EOC){
						for($i=0;$i<$dirSize;$i++){
							$tempDir=getDirectoryEntry($fileHandle, $header, $sectorAllocationTable, $shortSectorAllocationTable, $nextID, $i);
								if($tempDir['Type']!=DOC_DIR_TYPE_EMPTY){
									$directory[]=$tempDir;
								}
						}
					$nextID=$sectorAllocationTable[$nextID];
				}
			return $directory;
		}
		function getDirectoryEntry($fileHandle, $header, $sectorAllocationTable, $shortSectorAllocationTable, $directorySection, $dirID){
			$info=array();
			setFileCursor($fileHandle, getSectorPosition($directorySection, $header['SectorSize'])+getDirectoryEntryOffset($dirID));
			$info['Name']=getFilePart($fileHandle,64);
			$info['Name_Clean']=preg_replace('/[^[:print:]]/','',$info['Name']);
			//Skip 2 bytes used for EntryName size calculation
			moveFileCursor($fileHandle, 2);
			$info['Type']=getFilePartHexDec($fileHandle, 1, $header['Endianness']);
			$info['NodeColour']=getFilePartHexDec($fileHandle, 1, $header['Endianness']);
			$info['DirID_Left']=getFilePartHexDec($fileHandle, 4, $header['Endianness']);
			$info['DirID_Right']=getFilePartHexDec($fileHandle, 4, $header['Endianness']);
			$info['DirID_Root']=getFilePartHexDec($fileHandle, 4, $header['Endianness']);
			$info['UID']=getFilePartChars($fileHandle, 16, $header['Endianness']);
			$info['UserFlags']=getFilePartHexDec($fileHandle, 4, $header['Endianness']);
			$info['Time_Creation']=getFilePartHexDec($fileHandle, 8, $header['Endianness']);
			$info['Time_LastModified']=getFilePartHexDec($fileHandle, 8, $header['Endianness']);
			$info['SecID']=getFilePartHexDec($fileHandle, 4, $header['Endianness']);
			$info['StreamSize']=getFilePartHexDec($fileHandle, 4, $header['Endianness']);
			$info['ShortSectorAllocationTable']=$info['Type']!=DOC_DIR_TYPE_USER_ROOT_STORAGE && $info['StreamSize']<$header['MinSize_StdStream'];
			$allocationTable=$info['ShortSectorAllocationTable']?$shortSectorAllocationTable:$sectorAllocationTable;
			$info['SecIDChain']=array();
			$nextID=$info['SecID'];
				while($nextID!=DOC_SECTOR_TYPE_EOC){
					$info['SecIDChain'][]=$nextID;
					$nextID=$allocationTable[$nextID];
				}
			$numOfSections=count($info['SecIDChain']);
			$info['content']='';
				for($i=0;$i<$numOfSections;$i++){
					if(!$info['ShortSectorAllocationTable']){
						//SAT
						setFileCursor($fileHandle, getSectorPosition($info['SecIDChain'][$i], $header['SectorSize']));
						$info['content'].=getFilePart($fileHandle, $header['SectorSize']);
					}else{
						//SSAT
						$storagePos=getShortSectorPosition($info['SecIDChain'][$i], $header['SectorSize'], $header['ShortSectorSize']);
						setFileCursor($fileHandle, getSectorPosition($storagePos[0]+$storagePos[1], $header['ShortSectorSize']));
						$info['content'].=getFilePart($fileHandle, $header['ShortSectorSize']);
					}
				}
			return $info;
		}
		function getMicrosoftCompoundFile($fileName){
			$fileHandle=fopen($fileName, 'r');
			$header=getHeader($fileHandle);
			$sectors=getSectorAllocationTable($fileHandle, $header);
			$shortSectors=getShortSectorAllocationTable($fileHandle, $header, $sectors);
			$directory=getDirectory($fileHandle, $header, $sectors, $shortSectors);
			fclose($fileHandle);
			return array(htmlentities($fileName), $header, $sectors, $shortSectors, $directory);
		}
		function displayDocFile($fileName){
			$docFile=getMicrosoftCompoundFile($fileName);
			$wordDocument='-No Content-';
			$numDir=count($docFile[4]);
				for($i=0;$i<$numDir;$i++){
					if($docFile[4][$i]['Name_Clean']=='WordDocument'){
						$docPart=$docFile[4][$i]['content'];
						$temp=preg_split('/[\x0A]/',$docPart);
						$wordDocument=preg_replace(array('/\x09/','/[\x0A-\x0D]/','/[\x00-\x08\x0E-\x1F]/'),array('&nbsp;&nbsp;&nbsp;&nbsp;','<br>',''),$temp[1]);
						break;
					}
				}
			echo '<h1>'.$docFile[0].'</h1><pre>'.$wordDocument.'</pre>';
		}
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>title</title>
		<meta charset="UTF-8">
		<meta name="description" content="" />
		<meta name="keywords" content="" />
	</head>
	<body>
<?php
	displayDocFile('aDocFile.doc');
?>
	</body>
</html>
