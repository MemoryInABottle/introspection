class MuseScore{
	//Constants
	static ts_4_4 = {type:'timeSignature', numerator:4, denominator:4};
	static ts_3_4 = {type:'timeSignature', numerator:3, denominator:4};
	static ts_6_8 = {type:'timeSignature', numerator:6, denominator:8};
	static ts_2_2 = {type:'timeSignature', numerator:2, denominator:2};
	static ts_12_8 = {type:'timeSignature', numerator:12, denominator:8};
	
	static ALL_INSTRUMENTS = 0; static NO_DRUMS = 1; static ONLY_DRUMS = 2;
	
	data={
		raw:undefined,
		xml:undefined
	};
	
	eventListeners={};
	
	knownTags = ['?xml', 'museScore', /*Meta Data*/ 'programVersion', 'programRevision', 'Score', 'LayerTag', 'currentLayer', 'Division', 'Style', 'harmonyPlay', 'hideEmptyStaves', 'dontHidStavesInFirstSystm', 'usePre_3_6_defaults', 'defaultsVersion', 'Spatium', 'showInvisible', 'showUnprintable', 'showFrames', 'showMargins', 'metaTag', /*Formatting Data*/ 'minMeasureWidth', 'bracketDistance', 'clefLeftMargin', 'minNoteDistance', 'measureSpacing', 'ledgerLineWidth', 'beamWidth', 'beamMinLen', 'propertyDistanceStem', 'pageWidth', 'pageHeight', 'staffDistance', 'pagePrintableWidth', 'pageEvenLeftMargin', 'pageOddLeftMargin', 'pageEvenTopMargin', 'pageEvenBottomMargin', 'pageOddTopMargin', 'pageOddBottomMargin', 'staffUpperBorder', 'staffLowerBorder', 'minSystemDistance', 'lyricsMinDistance', 'lyricsDashYposRatio', 'lyricsOddFontFace', 'lyricsOddFontSize', 'lyricsEvenFontFace', 'lyricsEvenFontSize', 'barWidth', 'doubleBarWidth', 'endBarWidth', 'doubleBarDistance', 'endBarDistance', 'repeatBarlineDotSeparation', 'bracketWidth', 'stemWidth', 'staffLineWidth', 'ledgerLineLength', 'lastSystemFillLimit', 'hairpinWidth', 'hairpinFontFace', 'hairpinFontSize', 'pedalLineWidth', 'pedalFontFace', 'chordSymbolAFontFace', 'chordSymbolAFontSize', 'chordSymbolBFontFace', 'chordSymbolBFontSize', 'nashvilleNumberFontFace', 'slurMidWidth', 'musicalSymbolFont', 'musicalTextFont', 'voltaLineWidth', 'ottavaLineWidth', 'ottavaFontFace', 'tupletFontFace', 'tupletFontSize', 'defaultFontFace', 'titleFontFace', 'titleFontSize', 'subTitleFontFace', 'subTitleFontSize', 'composerFontFace', 'composerFontSize', 'lyricistFontFace', 'lyricistFontSize', 'fingeringFontFace', 'lhGuitarFingeringFontFace', 'rhGuitarFingeringFontFace', 'rhGuitarFingeringFontStyle', 'stringNumberFontFace', 'longInstrumentFontFace', 'longInstrumentFontSize', 'shortInstrumentFontFace', 'shortInstrumentFontSize', 'partInstrumentFontFace', 'partInstrumentFontSize', 'dynamicsFontFace', 'dynamicsFontSize', 'expressionFontFace', 'expressionFontSize', 'tempoFontFace', 'metronomeFontFace', 'metronomeFontStyle', 'measureNumberFontFace', 'measureNumberFontSpatiumDependent', 'measureNumberFontStyle', 'translatorFontFace', 'translatorFontSize', 'systemFontFace', 'staffFontFace', 'rehearsalMarkFontFace', 'rehearsalMarkFrameWidth', 'rehearsalMarkFrameRound', 'repeatLeftFontFace', 'repeatLeftFontSize', 'repeatRightFontFace', 'repeatRightFontSize', 'frameFontFace', 'frameFontSize','systemFrameDistance', 'frameSystemDistance','lyricsOddFramePadding', 'lyricsOddFrameWidth', /*Part Data*/ 'Part', 'Staff', 'bracket', 'small', 'barLineSpan', 'showIfSystemEmpty', 'StaffType', 'name', 'trackName', 'Instrument', 'longName', 'shortName', 'minPitchP', 'maxPitchP', 'minPitchA', 'maxPitchA', 'transposeDiatonic', 'transposeChromatic', 'instrumentId', 'defaultClef', 'Articulation', 'velocity', 'gateTime', 'Channel', 'controller', 'program', 'synti', 'clef', 'singleNoteDynamics', 'show', 'mute', 'StringData', 'frets', 'string', 'keysig', 'useDrumset', 'Drum', 'head', 'line', 'stem', 'shortcut', 'show', 'chordSymbolPosBelow', 'chordSymbolAFramePadding', 'chordSymbolAFrameWidth', 'chordStyle', 'chordsXmlFile', 'chordDescriptionFile', 'hideInstrumentNameIfOneInstrument', 'keySigNaturals', 'tupletOufOfStaff', 'ChordList', 'mag', 'renderRoot', 'renderFunction', 'renderBase', 'chord', 'xml', 'voicing', 'render', 'degree', /*Score Data*/ 'VBox', 'height', 'boxAutoSize', 'Text', 'linkedMain/', 'style', 'text', 'Measure', 'voice', 'Lyrics', 'syllabic', 'stretch', 'SystemText', 'ticks', 'ticks_f', 'Clef', 'concertClefType', 'transposingClefType', 'KeySig', 'accidental', 'TimeSig', 'sigN', 'sigD', 'textD', 'Groups', 'Node', 'Tempo', 'tempo', 'followText', 'Chord', 'durationType', 'Note', 'Accidental', 'role', 'Tremolo', 'subtype', 'pitch', 'tpc', 'tpc2', 'visible', 'location', 'measures', 'fractions', 'BarLine', 'prev', 'Breath', 'symbol', 'pause', 'duration', 'dots', 'b', 'font', 'Rest', 'sym', 'Fermata', 'headType', 'SystemText', 'StaffText', 'LayoutBreak', 'voices', 'notes', 'StemDirection', 'linkedTo', 'linked', 'startRepeat', 'startRepeat/', 'endRepeat', 'Ambitus', 'topPitch', 'topTpc', 'bottomPitch', 'bottomTpc', 'topAccidental', 'no', 'offset', 'concertPitch', 'RehearsalMark', 'Symbol', 'veloType', 'voice/', 'up', 'createMultiMeasureRests', 'multiMeasureRest', 'staves', 'indexDiff', 'HairPin', 'score', 'bottomGap', 'irregular', 'BeamMode' /*Not processed Data*/, 'Tuplet', 'normalNotes', 'actualNotes', 'baseNote', 'Number', 'endTuplet/', 'Stem', 'Harmony', 'root', 'base' /*Known SubTags: visible */, 'Spanner', 'Slur', 'Tie', 'TieSegment', 'next'];
	//offset can be used as a general Tag for manual Positioning
	
	constructor(filePath=undefined){
		if(filePath!==undefined){
			this.readFile(filePath);
		}
	}
	
	//Events: file-parsed, file-loaded
	addEventListener(eventName, callback){
			if(this.eventListeners[eventName]==undefined){
				this.eventListeners[eventName]=[];
			}
		this.eventListeners[eventName].push(callback);
	}
	callEvent(eventName, e){
			if(this.eventListeners[eventName]==undefined){return;}
		let listenerLen = this.eventListeners[eventName].length;
			for(let i=0;i<listenerLen;i++){
				this.eventListeners[eventName][i](e);
			}
	}
	getUnknownTags(xmlTree){
		let unknownTags = [];
		//console.log('Checking', xmlTree.name);
			if(xmlTree.type=='root' || xmlTree.type=='tag'){
				//console.log('Is Tag/Root');
					if(xmlTree.type=='tag' && this.knownTags.indexOf(xmlTree.name)==-1){
						//console.log('Found', xmlTree.name);
						unknownTags.push(xmlTree.name);
						this.knownTags.push(xmlTree.name);
					}
				let numOf = xmlTree.content.length, unT;
					if(numOf>0){
						//console.log('Has Children');
						for(let i=0;i<numOf;i++){
							unT = this.getUnknownTags(xmlTree.content[i]);
								if(unT.length>0){
									unknownTags.push(unT.flat());
								}
						}
					}
			}
		return unknownTags;
	}
	static museScoreNote_to_spn(noteObj){ //Scientific Pitch Notation (C4 == middle C)
		return noteObj.tpc+awesomechords.note.octave(awesomechords.note.fromMidiNoteNumber(noteObj.pitch-awesomechords.note.accidentals(noteObj.tpc+'0')));
	}
	static tonalPitchClass(aNumberOrString){
		if(parseInt(aNumberOrString,10)===aNumberOrString){
			switch(aNumberOrString){
				case -1: return 'Fbb';
				case 0: return 'Cbb';
				case 1: return 'Gbb';
				case 2: return 'Dbb';
				case 3: return 'Abb';
				case 4: return 'Ebb';
				case 5: return 'Bbb';
				case 6: return 'Fb';
				case 7: return 'Cb';
				case 8: return 'Gb';
				case 9: return 'Db';
				case 10: return 'Ab';
				case 11: return 'Eb';
				case 12: return 'Bb';
				case 13: return 'F';
				case 14: return 'C';
				case 15: return 'G';
				case 16: return 'D';
				case 17: return 'A';
				case 18: return 'E';
				case 19: return 'B';
				case 20: return 'F#';
				case 21: return 'C#';
				case 22: return 'G#';
				case 23: return 'D#';
				case 24: return 'A#';
				case 25: return 'E#';
				case 26: return 'B#';
				case 27: return 'F##';
				case 28: return 'C##';
				case 29: return 'G##';
				case 30: return 'D##';
				case 31: return 'A##';
				case 32: return 'E##';
				case 33: return 'B##';
				default: return undefined;
			}
		}else{
			switch(aNumberOrString){
				case 'Fbb': return -1;
				case 'Cbb': return 0;
				case 'Gbb': return 1;
				case 'Dbb': return 2;
				case 'Abb': return 3;
				case 'Ebb': return 4;
				case 'Bbb': return 5;
				case 'Fb': return 6;
				case 'Cb': return 7;
				case 'Gb': return 8;
				case 'Db': return 9;
				case 'Ab': return 10;
				case 'Eb': return 11;
				case 'Bb': return 12;
				case 'F': return 13;
				case 'C': return 14;
				case 'G': return 15;
				case 'D': return 16;
				case 'A': return 17;
				case 'E': return 18;
				case 'B': return 19;
				case 'F#': return 20;
				case 'C#': return 21;
				case 'G#': return 22;
				case 'D#': return 23;
				case 'A#': return 24;
				case 'E#': return 25;
				case 'B#': return 26;
				case 'F##': return 27;
				case 'C##': return 28;
				case 'G##': return 29;
				case 'D##': return 30;
				case 'A##': return 31;
				case 'E##': return 32;
				case 'B##': return 33;
				default: return undefined;
			}
		}
	}
	get raw(){
		return this.data.raw;
	}
	get xml(){
		return this.data.xml;
	}
	readFile(path){
		let file = fetch(path);
		let myThis = this;
		file.then(function(response){return response.text()}).then(function(data){myThis.readData(data)});
	}
	readData(data){
		this.data.raw = data;
		//console.log(this.data.raw);
		this.data.xml = new XMLTree(this.data.raw);
		this.callEvent('file-parsed', this.data.xml);
		
		/*let unknownTags = this.getUnknownTags(this.data.xml.root).flat();
			if(unknownTags.length>0){
				console.log('Found Unknown Tags',"['"+unknownTags.join("', '")+"']");
				unknownTags=undefined;
			}
		this.knownTags=undefined;*/
		
		//this.domElement.innerHTML = this.data.xml.toHTML();
		//this.domElement.innerHTML = '<pre>'+this.data.xml.toString()+'</pre>';
		
		//Read Attributes
		let numOf, numOfInner;
		let scoreElem = XMLTree.walk(['museScore','Score'], this.data.xml.root);
			if(scoreElem==undefined){
				console.warn('No Score found');
				return;
			}
		//TODO: Check if more than one Score is available [Auszüge]
		//TODO: Feature Layers?
		scoreElem=scoreElem[0];
		
		this.meta = {};
		//museScore - Score - metaTag[]
		let metaElements = XMLTree.walk(['metaTag'], scoreElem);
		numOf = metaElements.length;
			for(let i=0;i<numOf;i++){
		//		->[name] //arranger, composer, copyright, creationDate, lyricist, movementNumber, movementTitle, mscVersion, platform, poet, source, translator, workNumber, workTitle
				if(metaElements[i].content.length==1){
					if(metaElements[i].attributes.name=='creationDate'){
						let dateData = metaElements[i].content[0].content.split('-');
						this.meta['creationDate'] = dateData[2]+'.'+dateData[1]+'.'+dateData[0];
					}else{
						this.meta[metaElements[i].attributes.name]=metaElements[i].content[0].content;
					}
				}
			}
		
		this.parts = [];
		this.partCount = 0;
		this.staffCount = 0;
		this.staffIDToPart = {};
		//museScore - Score - Part[]
		let partElements = XMLTree.walk(['Part'],scoreElem), curPart;
		numOf = partElements.length;
			for(let i=0;i<numOf;i++){
				this.partCount++;
				curPart = {staves:[], instrument:{}, staffOffset:{}, hide:XMLTree.walkContent(['show'], partElements[i])=='0'};
				let staves = XMLTree.walk(['Staff'], partElements[i]), staffID, staffClef;
					if(staves==undefined){continue;}
				numOfInner = staves.length;
					for(let j=0;j<numOfInner;j++){
						this.staffCount++;
		//		->Staff[]
		//			->[id] //Staff ID number
		//			->showIfSystemEmpty //bool
		//			->bracket [type: 1, span: 2, col: 0]
		//			->barLineSpan //int
		//			->small //bool
		//			->defaultClef //G, F, PERC
		//			->StaffType
		//				->[group] //percussion
		//				->name //perc5line
		//				->keysig //0
						//TODO: Add StaffType
						staffID = parseInt(staves[j].attributes.id, 10);
						staffClef = XMLTree.walkContent(['defaultClef'],staves[j]);
						curPart.staves.push({id:staffID, clef:staffClef==undefined?'G':staffClef, showIfEmpty:XMLTree.walkContent(['showIfSystemEmpty'],staves[j]),small:XMLTree.walkContent(['showIfSystemEmpty'],staves[j])=='1', barLineSpan:XMLTree.walkContent(['barLineSpan'],staves[j]), bracket:XMLTree.walk(['bracket'],staves[j])});
						
						curPart.staffOffset[staffID] = j;
						this.staffIDToPart[staffID] = i;
					}
				let instrument = XMLTree.walk(['Instrument'], partElements[i])[0];
				numOfInner = instrument.content.length;
					for(let j=0;j<numOfInner;j++){
		//		->Instrument
		//			->longName   //Instrument name
		//			->shortName  //Instrument name
		//			->instrumentId  //Instrument name
		//			->StringData
		//				->frets //Number of Frets
		//				->string[] //Midi Note
		//			->Drum
		//				->[pitch] //Midi Pitch
		//				->head //normal
		//				->line //int
		//				->voice //int
		//				->name //Drum name
		//				->stem //2
		//				->shortcut //[char]
		//			->clef[?id]  // if undefined ? G : Clef //Moved to part of the staff
						switch(instrument.content[j].name){
							case 'useDrumset':
								curPart.instrument.useDrumset = instrument.content[j].content[0].content=='1';
								break;
							case 'Drum':
									if(curPart.instrument.drums==undefined){curPart.instrument.drums=[];}
								curPart.instrument.drums.push({
									pitch:parseInt(instrument.content[j].attributes.pitch,10),
									line:parseInt(XMLTree.walkContent(['line'], instrument.content[j]),10),
									voice:parseInt(XMLTree.walkContent(['voice'], instrument.content[j]),10),
									name:XMLTree.walkContent(['name'], instrument.content[j]),
									stem:XMLTree.walkContent(['stem'], instrument.content[j]),
									shortcut:XMLTree.walkContent(['shortcut'], instrument.content[j])
								});
								break;
							case 'StringData':
								curPart.instrument.stringData = {frets: parseInt(XMLTree.walkContent(['frets'], instrument.content[j]),10), strings:[]};
								let strings = XMLTree.walk(['string'], instrument.content[j]), numOfStrings=strings.length;
									for(let k=0;k<numOfStrings;k++){
										curPart.instrument.stringData.strings.push(parseInt(strings[k].content[0].content,10));
									}
								break;
							case 'clef':
								//Should be the same as curPart.staves[].clef
								//curPart.instrument[instrument[j].name] = instrument[j].content[0].content;
								break;
							case 'trackName':
							case 'longName':
							case 'shortName':
							case 'instrumentId':
								if(instrument.content[j].content.length>0){curPart.instrument[instrument.content[j].name] = instrument.content[j].content[0].content;}
						}
					}
				this.parts.push(curPart);
			}
		
		//Read Score
		
		this.measureCount=0;
		//museScore - Score - Staff
		let staffElements = XMLTree.walk(['Staff'], scoreElem), curStaff, curMeasure, firstClefAdded, timeStamp, curTime, preMeasureClef;
		numOf = staffElements.length;
			for(let i=0;i<numOf;i++){
		//		->[id]	//Staff ID
				curStaff = {id: parseInt(staffElements[i].attributes.id, 10), obj:[], measureIDs:[]};
				//Walk through children
				numOfInner = staffElements[i].content.length;
				curMeasure=0;
				curTime = MuseScore.ts_4_4;
				let myPart = this.parts[this.staffIDToPart[curStaff.id]];
				let myStaff = myPart.staves[myPart.staffOffset[curStaff.id]];
				let curStaffObj, lastUsedClef=[myStaff.clef,myStaff.clef];
					for(let j=0;j<numOfInner;j++){
						let internals, numOfInternal;
							if(staffElements[i].content[j].name == 'VBox'){
								curStaffObj = {type:'card', texts:{}};
								internals = XMLTree.walk(['Text'],staffElements[i].content[j]);
									if(internals==undefined){internals=[];}
								numOfInternal = internals.length;
									for(let k=0;k<numOfInternal;k++){
		//		->VBox
		//			->Text
		//				->style //Title, Composer, Subtitle, ...
		//				->text  //Value
										curStaffObj.texts[XMLTree.walkContent(['style'], internals[k])] = XMLTree.walkContent(['text'], internals[k]);
									}
									if(this.meta['workTitle']==undefined){
										this.meta['workTitle']=curStaffObj.texts['Title'];
									}
									if(this.meta['composer']==undefined){
										this.meta['composer']=curStaffObj.texts['Composer'];
									}
							}else if(staffElements[i].content[j].name == 'Measure'){
								curStaff.measureIDs.push(curStaff.obj.length);
								curStaffObj = {type:'measure', obj:[], len:staffElements[i].content[j].attributes.len, start:curMeasure==0};
									if(i==0){this.measureCount++;}
								firstClefAdded=false;
								curMeasure++;
								preMeasureClef = lastUsedClef;
								timeStamp=0;
		//		->Measure[]
		//			->startRepeat //SelfClosing
		//						Replaced by 'Barline'
									if(XMLTree.walk(['startRepeat/'],staffElements[i].content[j])!==undefined){
										curStaffObj.obj.push({type:'repeat', subtype:'start'});
										curStaffObj.repeatStart=true;
									}
		//			->endRepeat // 2 ? Number of Repetitions?
								let endRepeat = XMLTree.walkContent(['endRepeat'],staffElements[i].content[j]);
									if(endRepeat!==undefined){
										curStaffObj.obj.push({type:'repeat', subtype:'end', val: parseInt(endRepeat,10)});
										curStaffObj.repeatEnd=true;
									}
		//			->multiMeasureRest // int
								curStaffObj.multiMeasureRest=parseInt(XMLTree.walkContent(['multiMeasureRest'],staffElements[i].content[j]),10);
		//			->irregular // int::numberOfBeats Auftakt
								curStaffObj.multiMeasureRest=parseInt(XMLTree.walkContent(['irregular'],staffElements[i].content[j]),10);
		//			->stretch // 0.8
								let stretchM = XMLTree.walkContent(['stretch'],staffElements[i].content[j]);
									if(stretchM!==undefined){
										curStaffObj.obj.push({type:'stretch', val: parseFloat(stretchM)});
									}
		//			->LayoutBreak
		//				->subtype //line
								let layoutBreak = XMLTree.walkContent(['layoutBreak'],staffElements[i].content[j]);
									if(layoutBreak!==undefined){
										curStaffObj.obj.push({type:'layoutBreak', subtype:layoutBreak});
									}
		//			->voice[]
								internals = XMLTree.walk(['voice'],staffElements[i].content[j]);
									if(internals!==undefined){
										for(let voice=0;voice<internals.length;voice++){
											let curVoice = [];
											numOfInternal = internals[voice].content.length;
												for(let k=0;k<numOfInternal;k++){
													switch(internals[voice].content[k].name){
			//				->SystemText
			//					->text //'Rit.' etc.
														case 'SystemText':
															curVoice.push({type:'systemText', text:XMLTree.walkLeavesContent(['text'], internals[voice].content[k])});
															break;
			//				->StaffText
			//					->text //'Rit.' etc.
														case 'StaffText':
															curVoice.push({type:'staffText', text:XMLTree.walkLeavesContent(['text'], internals[voice].content[k])});
															break;
			//				->KeySig
			//					->accidental //Number
														case 'KeySig':
															curVoice.push({type:'keySignature', accidental:parseInt(XMLTree.walkContent(['accidental'], internals[voice].content[k]),10)});
															break;
			//				->Clef
			//					->concertClefType //F8vb
			//					->transposingClefType //F8vb
														case 'Clef':
															lastUsedClef = [XMLTree.walkContent(['concertClefType'], internals[voice].content[k]),XMLTree.walkContent(['transposingClefType'], internals[voice].content[k])];
															curVoice.push({type:'clef', concertClef:lastUsedClef[0], transposingClef:lastUsedClef[1]});
																if(timeStamp==0){firstClefAdded=true;}
															break;
			//				->RehearsalMark
			//					->text //A
														case 'RehearsalMark':
															curVoice.push({type:'RehearsalMark', text:XMLTree.walkContent(['text'], internals[voice].content[k])});
															break;
			//				->Symbol
			//					->name // ornamentTrill
			//					->font // Bravura
														case 'Symbol':
															curVoice.push({type:'Symbol', name:XMLTree.walkContent(['name'], internals[voice].content[k]), font:XMLTree.walkContent(['font'], internals[voice].content[k])});
															break;
			//				->TimeSig
			//					->sigN //Numerator
			//					->sigD //Denominator
			//					->textD //2
			//					->Groups
			//						->Node [pos: 4, action: 512]
														case 'TimeSig':
															//TODO: What is TextD?
															//TODO: What is Groups? Node.pos[Multiples of 4?]
															curVoice.push({type:'timeSignature', numerator:parseInt(XMLTree.walkContent(['sigN'], internals[voice].content[k]),10), denominator:parseInt(XMLTree.walkContent(['sigD'], internals[voice].content[k]),10), textD:XMLTree.walkContent(['textD'], internals[voice].content[k]), groups:XMLTree.walk(['Groups'], internals[voice].content[k])});
															curTime = curVoice[curVoice.length-1];
															break;
			//				->Tempo
			//					->tempo //Float value of the length of this bar relative to 60bpm. TimeSignature[2/2] 70bpm => 1Beat = 1,16_ => 2 Beat per Bar => [2.3_]
			//					->text //TempoText '*qN* = 55'. Values following <font />
														case 'Tempo':
														//TODO: Parse ->text->sym->metNoteQuarterUp
															curVoice.push({type:'tempo', tempo:parseInt(XMLTree.walkContent(['tempo'], internals[voice].content[k]),10), text:XMLTree.walkContent(['text'], internals[voice].content[k]), followText:XMLTree.walkContent(['followText'], internals[voice].content[k])==='1'});
															break;
			//				->?Rest
			//					->durationType //measure, quarter, whole, half, ...
			//					->duration //Fraction -> TimeSignature
														case 'Rest':
															curVoice.push({type:'rest', durationType:XMLTree.walkContent(['durationType'], internals[voice].content[k]), duration:XMLTree.walkContent(['duration'], internals[voice].content[k])});
															timeStamp+=MuseScore.getDuration(curVoice[curVoice.length-1], curTime);
															break;
			//				->Harmony
			//					->root //Tonal Pitch Class
			//					->base //Tonal Pitch Class
			//					->name //m (minor)
														case 'Harmony':
															let myHarmony = {type:'Harmony', root:MuseScore.tonalPitchClass(parseInt(XMLTree.walkContent(['root'], internals[voice].content[k]),10)), base:MuseScore.tonalPitchClass(parseInt(XMLTree.walkContent(['base'], internals[voice].content[k]),10)), name:XMLTree.walkContent(['name'], internals[voice].content[k])};
															myHarmony.chord=myHarmony.root+(myHarmony.name==undefined?'':myHarmony.name)+(myHarmony.base==undefined?'':'/'+myHarmony.base);
															curVoice.push(myHarmony);
															break;
			//				->?Chord
			//					->dots //Number
			//					->durationType
			//					->Tremolo
			//						->subtype //c16
			//					->Lyrics[]
			//						->?ticks // Number
			//						->?ticks_f // Fraction: 1/1
			//						->?syllabic //begin, middle, end //Dashed
			//						->?no //Lyric Line Offset [Verse Number]
			//						->text //Lyric
			//					->Note[] //https://musescore.org/en/handbook/developers-handbook/plugin-development/note-object
			//						->pitch //Midi Pitch
			//						->tpc //Tonal Pitch Class [-1: Fbb, 0: Cbb, 1: Gbb, ..., 31: A##, 32: E##, 33: B##]
			//						->Accidental
			//							->subtype //accidentalSharp, accidentalFlat, accidentalNatural
			//							->role //1
			//							->velocity //80
			//							->veloType //user
			//						->Spanner
			//							->[type] //Slur, Tie, Hairpin
			//							->?Hairpin
			//								->subtype //0
			//							->?Tie
			//								->visible //Bool
			//								->?up
			//									->?down
			//								->TieSegment [no: 0]
			//									->visible //Bool
			//							->next/prev
			//								->location
			//									->voices //1
			//									->notes //-1
			//									->measures // -1, 1
			//									->fractions // -3/4
			//						[?]->?tied //0: no tie, 1: tied to next, 2: tied to previous, 3: tied to both
			//						[?]->?tuning //in cents
			//						[?]->?visible //boolean
			//						[?]->?userAccidental //0: None, 1: #, 2: b, 3: ##, 4: bb, 5: natural, [6..26 QuarterTone Symbols]
			//						[?]->?velocity //0 - 127
			//						[?]->?color //QColor Value
			//						[?]->?name //[String]
			//						[?]->?noteHead //0: normal [1..13] https://musescore.org/en/handbook/developers-handbook/plugin-development/note-object#Addendum-2%3A-Codes-for-note-head
														case 'Chord':
															let myLyrics=[], myNotes=[];
															let theLyrics=XMLTree.walk(['Lyrics'], internals[voice].content[k]), theNotes=XMLTree.walk(['Note'], internals[voice].content[k]);
																if(theLyrics!==undefined){
																	let lineNumber;
																		for(let L=0;L<theLyrics.length;L++){
																			lineNumber = XMLTree.walkContent(['no'], theLyrics[L]);
																			myLyrics.push({type:'lyric',ticks:parseInt(XMLTree.walkContent(['ticks'], theLyrics[L]),10), ticks_f:XMLTree.walkContent(['ticks_f'], theLyrics[L]), syllabic:XMLTree.walkContent(['syllabic'], theLyrics[L]), line:(lineNumber==undefined?0:parseInt(lineNumber,10)), lyric:XMLTree.walkContent(['text'], theLyrics[L])});
																		}
																}
																if(theNotes!==undefined){
																	let numOfNotes = theNotes.length, curNote;
																		for(let L=0;L<numOfNotes;L++){
																			//TODO: Add Spanner[Slur/Tie] //Can also be added in Note
																			curNote = {
																				type:'note',
																				pitch:parseInt(XMLTree.walkContent(['pitch'], theNotes[L]),10),
																				velocity:parseInt(XMLTree.walkContent(['velocity'], theNotes[L]),10),
																				veloType:XMLTree.walkContent(['veloType'], theNotes[L]),
																				tpc:MuseScore.tonalPitchClass(parseInt(XMLTree.walkContent(['tpc'], theNotes[L]), 10)),
																				tpc2:MuseScore.tonalPitchClass(parseInt(XMLTree.walkContent(['tpc2'], theNotes[L]), 10)),
																				accidental:XMLTree.walk(['Accidental'], theNotes[L]),
																				headType:XMLTree.walkContent(['headType'], theNotes[L])
																			};
																			curNote.name = MuseScore.museScoreNote_to_spn(curNote);
																			myNotes.push(curNote);
																		}
																}
															//TODO: Add Spanner[Slur/Tie]
															//TODO: Add Stem[visible]
															curVoice.push({type:'chord', dots:parseInt(XMLTree.walkContent(['dots'], internals[voice].content[k]),10), durationType:XMLTree.walkContent(['durationType'], internals[voice].content[k]), tremolo:XMLTree.walkContent(['Tremolo'], internals[voice].content[k]), stemDirection:XMLTree.walkContent(['StemDirection'], internals[voice].content[k]), lyrics:myLyrics, notes:myNotes});
															timeStamp+=MuseScore.getDuration(curVoice[curVoice.length-1], curTime);
															break;

			//				->location
			//					->fractions //-5/8
														case 'location':
															//TODO: Find out what this means. Maybe move by [fractions] Units on X-Axis? Manual Positioning?
															curVoice.push({type:'location', fractions:XMLTree.walkContent(['fractions'], internals[voice].content[k])});
															break;
			//				->Fermata
			//					->subtype //fermataAbove
														case 'Fermata':
															curVoice.push({type:'fermata', subtype:XMLTree.walkContent(['subtype'], internals[voice].content[k])});
															break;
			//				->BarLine
			//					->subtype //start-repeat, double
			//					->visible //bool
														case 'BarLine':
															//TODO: auto insert Start and End Barlines if non existant
															curVoice.push({type:'barline', subtype:XMLTree.walkContent(['subtype'], internals[voice].content[k]), invisible:XMLTree.walkContent(['subtype'], internals[voice].content[k])==='0'});
															break;
			//				->Ambitus
			//					->topPitch //Midi Pitch
			//					->topTpc //Tonal Pitch Class
			//					->bottomPitch //Midi Pitch
			//					->bottomTpc //Tonal Pitch Class
			//					->topAccidental
			//						->Accidental
			//							->subtype //accidentalSharp
			//					->bottomAccidental
			//						->Accidental
			//							->subtype //accidentalSharp
														case 'Ambitus':
															curVoice.push({
																type:'ambitus',
																top:{
																	pitch:parseInt(XMLTree.walkContent(['topPitch'], internals[voice].content[k]),10),
																	tpc:MuseScore.tonalPitchClass(parseInt(XMLTree.walkContent(['topTpc'], internals[voice].content[k]), 10)),
																	accidental:XMLTree.walkContent(['topAccidental'], internals[voice].content[k])
																}, bottom:{
																	pitch:parseInt(XMLTree.walkContent(['bottomPitch'], internals[voice].content[k]),10),
																	tpc:MuseScore.tonalPitchClass(parseInt(XMLTree.walkContent(['bottomTpc'], internals[voice].content[k]),10)),
																	accidental:XMLTree.walkContent(['bottomAccidental'], internals[voice].content[k])
																}
															});
															break;
			//				->Breath
			//					->symbol //breathMarkComma
			//					->pause //[int]
														case 'Breath':
															curVoice.push({type:'breath', symbol:XMLTree.walkContent(['symbol'], internals[voice].content[k]), pause:parseFloat(XMLTree.walkContent(['pause'], internals[voice].content[k]))});
															break;
														default:
															console.warn('Unknown Measure Element', internals[voice].content[k].name);
													}
												}
											curStaffObj.obj.push(curVoice);
										}
									}else{
										console.warn('No Voice found in Measure', staffElements[i].content[j]);
									}
									if(!firstClefAdded && Array.isArray(curStaffObj.obj[0])){
										curStaffObj.obj[0].unshift({type:'clef', concertClef:preMeasureClef[0], transposingClef:preMeasureClef[1], hide:!curStaffObj.start});
									}
								curStaffObj.timeSignature = curTime;
							}else{
								console.warn('Unknown Staff Child', staffElements[i].content[j]);
							}
						curStaff.obj.push(curStaffObj);
					}
				
				//Add to [Part].[staves][index].data
				this.parts[this.staffIDToPart[curStaff.id]].staves[this.parts[this.staffIDToPart[curStaff.id]].staffOffset[curStaff.id]].data=curStaff;
			}
		this.callEvent('file-loaded', this);
	}
	getAllStaves(instrument_filter=MuseScore.ALL_INSTRUMENTS){ //MuseScore.ALL_INSTRUMENTS, MuseScore.NO_DRUMS, MuseScore.ONLY_DRUMS
		let staves = [], numOfParts=this.partCount;
			for(let i=0;i<numOfParts;i++){
				if((instrument_filter==MuseScore.ALL_INSTRUMENTS) || (instrument_filter==MuseScore.NO_DRUMS && this.parts[i].instrument.drums == undefined) || (instrument_filter==MuseScore.ONLY_DRUMS && this.parts[i].instrument.drums !== undefined)){
					staves.push(this.parts[i].staves);
				}
			}
		return staves.flat();
	}
	getStaves(partNumber){
		let staves = this.parts[partNumber].staves;
		return staves;
	}
	getMeasuresOfPart(partNumber, measureNumber){
		let numOfStaves = this.parts[partNumber].staves.length;
		let measures = [];
			for(let i=0;i<numOfStaves;i++){
				measures[i]=this.getMeasureFromStaff(this.parts[partNumber].staves[i], measureNumber);
			}
		return measures;
	}
	getMeasure(partNumber, staffNumber, measureNumber){
		return MuseScore.getMeasureFromStaff(this.parts[partNumber].staves[staffNumber], measureNumber);
	}
	static getMeasureFromStaves(staves, measureNumber){
		let numOf = staves.length, measures = [];
			for(let i=0;i<numOf;i++){
				measures.push(MuseScore.getMeasureFromStaff(staves[i], measureNumber));
			}
		return measures;
	}
	static getMeasureFromStaff(staff, measureNumber){
		return staff.data.obj[staff.data.measureIDs[measureNumber]];
	}
	/*static getMeasureFromStaff(staff, measureNumber){
		let staffElements = staff.data.obj, numOf = staffElements.length, i=0, measureCount=-1;
			while(i<numOf){
					if(staffElements[i].type=='measure'){
						measureCount++;
					}
					if(measureCount==measureNumber){
						return staffElements[i];
					}
				i++;
			}
		return undefined;
	}*/
	static convert_duration(durationType, timeSignature=MuseScore.ts_4_4){ //Convert from MuseScore->durationType to Awesomechords->duration
		/*[-3= large [maxima]
		-2= long
		-1= breve]
		0 = whole
		1 = half
		2 = quarter
		3 = eighth
		4 = sixteenth
		5 = thirtysecond
		6 = sixtyfourth
		'p' = Practise / Unspecified*/
			switch(durationType){
				case 'long': return -2; break;
				case 'breve': return -1; break;
				case 'whole': return 0; break;
				case 'half': return 1; break;
				case 'quarter': return 2; break;
				case 'eighth': return 3; break;
				case '16th': return 4; break;
				case '32nd': return 5; break;
				case '64th': return 6; break;
				case '128th': return 7; break;
				case 'measure':
				default:
					console.warn('Unknown DurationType', durationType);
			}
	}
	static getMeasureBaseUnit(timeSignature=MuseScore.ts_4_4){
		switch(timeSignature.denominator){
			case 1: return 128; break;
			case 2: return 64; break;
			case 4: return 32; break;
			case 8: return 16; break;
			case 16: return 8; break;
			case 32: return 4; break;
			case 64: return 2; break;
			case 128: return 1; break;
			default:
				console.warn('Invalid Time Signature: Denominator not power of two [1-128]', JSON.stringify(timeSignature));
				return 1;
		}
	}
	static getMeasureLength(timeSignature=MuseScore.ts_4_4){
		let mLen=MuseScore.getMeasureBaseUnit(timeSignature);
		return timeSignature.numerator*mLen;
	}
	static getDuration(musicElement, timeSignature=MuseScore.ts_4_4){
			if(musicElement.durationType !==undefined){
				let dotted = 1 + ((Number.isNaN(musicElement.dots) || musicElement.dots==undefined)?0:Math.pow(0.5,musicElement.dots));
				switch(musicElement.durationType){
					case 'measure':
						return MuseScore.getMeasureLength(timeSignature)*dotted;
						break;
					case 'long': return 512*dotted; break;
					case 'breve': return 256*dotted; break;
					case 'whole': return 128*dotted; break;
					case 'half': return 64*dotted; break;
					case 'quarter': return 32*dotted; break;
					case 'eighth': return 16*dotted; break;
					case '16th': return 8*dotted; break;
					case '32nd': return 4*dotted; break;
					case '64th': return 2*dotted; break;
					case '128th': return 1*dotted; break;
					default:
						console.warn('Unknown DurationType', musicElement.durationType);
				}
			}
		return 0;
	}
	static getTimeLineOffsets(musicObj, timeSignature = MuseScore.ts_4_4){ //mscFile / Part / Staff / Measure / Voice
		//TODO: Add all possibilities
		let timeLine = {};
			switch(musicObj.type){
				case 'measure':
					let numOfVoices = musicObj.obj.length, numOfElements, timeStamp;
						for(let voice=0;voice<numOfVoices;voice++){
							timeStamp=0;
							numOfElements = musicObj.obj[voice].length;
								for(let j=0;j<numOfElements;j++){
										if(timeLine[timeStamp]==undefined){timeLine[timeStamp]=[];}
									timeLine[timeStamp].push(musicObj.obj[voice][j]);
									timeStamp+=MuseScore.getDuration(musicObj.obj[voice][j]);
								}
						}
					timeLine.last = timeStamp;
					return timeLine;
					break;
				case 'card':
					return {};
				default:
					console.warn('Unprocessed MusicObj', musicObj.type);
			}
		return undefined;
	}
	static getTimeLine(measure, smallestUnit=1){
		let timeLine={};
		let numOfVoices = measure.obj.length, numOfElements, timeStamp;
		let dump = [], dumpTimes=[], dumpElem;
			for(let voice=0;voice<numOfVoices;voice++){
				timeStamp=0;
				numOfElements = measure.obj[voice].length;
					for(let j=0;j<numOfElements;j++){
						dumpElem = {id:[voice,j], start:timeStamp, added:0};
							if((timeStamp%smallestUnit==0) && dumpTimes.indexOf(timeStamp)==-1){dumpTimes.push(timeStamp);}
						timeStamp+=MuseScore.getDuration(measure.obj[voice][j]);
						dumpElem.end = timeStamp;
							if((timeStamp%smallestUnit==0) && dumpTimes.indexOf(timeStamp)==-1){dumpTimes.push(timeStamp);}
						dump.push(dumpElem);
					}
			}
		let measureLen = MuseScore.getMeasureLength(measure.timeSignature), baseUnit = MuseScore.getMeasureBaseUnit(measure.timeSignature);
		let insertedIndices = [], isInserted;
			for(let beatTime = 0;beatTime<measureLen;beatTime+=baseUnit){
				if(dumpTimes.indexOf(beatTime)==-1){
					dumpTimes.push(beatTime);
					insertedIndices.push(beatTime);
				}
			}
		dumpTimes.sort(function(a,b){return a<b?-1:(a==b?0:1);});
		let currentTime, lastCurrentTime=0;
		numOfElements = dump.length;
			while(dumpTimes.length>0){
				currentTime = dumpTimes.shift();
				isInserted = insertedIndices.indexOf(currentTime)>=0;
					if(dumpTimes.length>0 && !isInserted){timeLine[currentTime]=[];}
					for(let i=0;i<numOfElements;i++){
						if(dump[i]==undefined){continue;}
						if(dump[i].start>currentTime){continue;}
						if(dump[i].end<=currentTime){
								if(dump[i].added==0){
									timeLine[lastCurrentTime].push(measure.obj[dump[i].id[0]][dump[i].id[1]]);
								}
							dump[i]=undefined;
						}else if(dump[i].start<=currentTime){
								if(timeLine[isInserted?lastCurrentTime:currentTime]==undefined){timeLine[isInserted?lastCurrentTime:currentTime]=[];}
							timeLine[isInserted?lastCurrentTime:currentTime].push(measure.obj[dump[i].id[0]][dump[i].id[1]]);
							dump[i].added++;
						}
					}
					if(!isInserted){lastCurrentTime = currentTime;}
			}
		return timeLine;
	}
	static getMeasureTimeBlocks(measure, baseUnit){
		//Packs timeLine elements into TimeSignature Beat-Blocks
		return MuseScore.getTimeLine(measure, baseUnit==undefined?MuseScore.getMeasureBaseUnit(measure.timeSignature):baseUnit);
	}
	static analyseMeasure(staves, measureNumber, baseUnit, callback){
		let myMeasures = MuseScore.getMeasureFromStaves(staves, measureNumber), numOf = myMeasures.length, timeBlocks={}, tempBlocks;
		let beat, beatLen = MuseScore.getMeasureBaseUnit(myMeasures[0].timeSignature), maxBeat = beatLen * myMeasures[0].timeSignature.numerator;
			for(let i=0;i<numOf;i++){
				tempBlocks = MuseScore.getMeasureTimeBlocks(myMeasures[i], baseUnit);
					for(beat = 0;beat<maxBeat;beat+=beatLen){
						if(timeBlocks[beat]==undefined){timeBlocks[beat]=[];}
						if(tempBlocks[beat]!==undefined){
							timeBlocks[beat].push(tempBlocks[beat]);
						}
					}
			}
		let numOfElements, notes, numOfNotes;
			for(beat = 0;beat<maxBeat;beat+=beatLen){
				timeBlocks[beat] = timeBlocks[beat].flat();
				numOfElements = timeBlocks[beat].length;
					for(let i=0;i<numOfElements;i++){
						if(timeBlocks[beat][i].type!=='chord'){
							timeBlocks[beat][i]=undefined;
						}else{
							//timeBlocks[beat][i] = timeBlocks[beat][i].notes;
							numOfNotes = timeBlocks[beat][i].notes.length
							notes=[];
								for(let j=0;j<numOfNotes;j++){
									notes[j] = timeBlocks[beat][i].notes[j].name;
								}
							timeBlocks[beat][i] = notes;
						}
					}
				timeBlocks[beat]=timeBlocks[beat].filter(function(a){return a!==undefined && a!==null}).flat();
					if(callback!==undefined){timeBlocks[beat] = callback(timeBlocks[beat], beat/beatLen);}
			}
		return timeBlocks;
	}
	static getScoreWidths(museScoreObj){
		let numOfParts=museScoreObj.parts.length, numOfMeasures=museScoreObj.measureCount, maxWidths=MuseScore.getPartWidths(museScoreObj.parts[0]), tempMaxWidths, scoreWidth=0;
		scoreWidth=maxWidths[0];
		maxWidths=maxWidths[1];
			for(let i=1;i<numOfParts;i++){
				tempMaxWidths = MuseScore.getPartWidths(museScoreObj.parts[i]);
				scoreWidth=Math.max(scoreWidth, tempMaxWidths[0]);
					for(let j=0;j<numOfMeasures;j++){
						maxWidths[j]=Math.max(maxWidths[j], tempMaxWidths[1][j]);
					}
			}
		return [scoreWidth, maxWidths];
	}
	static getPartWidths(part){
		let numOfStaves = part.staves.length, numOfMeasures=part.staves[0].data.obj.length, partWidth=0, maxWidths=[], curMeasure;
			for(let i=0;i<numOfStaves;i++){
				curMeasure=0;
					for(let j=0;j<numOfMeasures;j++){
							if(part.staves[i].data.obj[j]==undefined){continue;}
							if(part.staves[i].data.obj[j].type!=='measure'){continue;}
							if(i==0){maxWidths[curMeasure]=0;}
						maxWidths[curMeasure]=Math.max(maxWidths[curMeasure], MuseScore.getMeasureWidth(part.staves[i].data.obj[j]));
							if(i==numOfStaves-1){partWidth+=maxWidths[curMeasure];}
						curMeasure++;
					}
			}
		return [partWidth, maxWidths];
	}
	static drawScore(cnvCtx, museScoreObj, x=0, y=0, staffHeight=awesomechords.canvas.sheetmusic.staffLinesHeight*9, startMeasure=0, endMeasure=undefined, maxWidths){
		let numOfStaves = 0;
			if(maxWidths==undefined){maxWidths = MuseScore.getScoreWidths(museScoreObj)[1];}
		for(let i=0;i<museScoreObj.partCount;i++){
			MuseScore.drawPart(cnvCtx, museScoreObj.parts[i],x,y+numOfStaves*staffHeight, staffHeight, startMeasure, endMeasure, maxWidths);
			numOfStaves+=museScoreObj.parts[i].staves.length;
		}
	}
	static drawPart(cnvCtx, part, x=0, y=0, staffHeight=awesomechords.canvas.sheetmusic.staffLinesHeight*9, startMeasure=0, endMeasure=undefined, maxWidths){
			if(endMeasure==undefined){endMeasure=part.staves[0].data.obj.length;}
			if(endMeasure<startMeasure){
				console.warn('Invalid measure number: start value larger than end value');
				return;
			}
		let numOfStaves = part.staves.length, curX=0, curMeasure;
			if(maxWidths==undefined){maxWidths=MuseScore.getPartWidths(part)[1];}
			for(let i=0;i<numOfStaves;i++){
				MuseScore.drawStaff(cnvCtx, part.staves[i], x, y+i*staffHeight,startMeasure,endMeasure, maxWidths);
			}
			if(numOfStaves>1){
				cnvCtx.fillRect(x-1, y+awesomechords.canvas.sheetmusic.staffLinesHeight, 3, staffHeight*(numOfStaves-1)+awesomechords.canvas.sheetmusic.staffLinesHeight*4);
			}
	}
	static drawStaff(cnvCtx, staff, x=0, y=0, startMeasure=0, endMeasure=undefined, maxWidths=undefined){
			if(endMeasure==undefined){endMeasure=staff.data.obj.length;}
			if(endMeasure<startMeasure){
				console.warn('Invalid measure number: start value larger than end value');
				return;
			}
		let curX=0, curMeasure=0, numOfMeasures = staff.data.obj.length;
			for(let i=0;i<numOfMeasures;i++){
					if(staff.data.obj[i].type!=='measure'){continue;}
					if(curMeasure>=startMeasure && curMeasure<endMeasure){
						curX += MuseScore.drawMeasure(cnvCtx, staff.data.obj[i], x+curX, y, maxWidths==undefined?undefined:maxWidths[curMeasure]);
					}
				curMeasure++;
			}
	}
	static drawMeasure(cnvCtx, measure, x=0, y=0, measureWidth=undefined){
		let mWidth=(measureWidth==undefined?MuseScore.getMeasureWidth(measure, 20):measureWidth), mHeight=100, tempX=x, tempY;
		let measureTimeline = MuseScore.getTimeLineOffsets(measure, measure.timeSignature);
		//console.log('TimeLine',measureTimeline);
		cnvCtx.strokeStyle='#FFFFFF';
		cnvCtx.fillStyle='#FFFFFF';
		
		awesomechords.canvas.sheetmusic.drawStaffLines(x, y, mWidth, 5, cnvCtx);
		//tempX+=10;
		
		let numOfElements, numOfVoices= measure.obj.length, elemWidth, curClef;
			for(let voice=0;voice<numOfVoices;voice++){
				numOfElements = measure.obj[voice].length;
				tempX=x;
					for(let i=0;i<numOfElements;i++){
						elemWidth=0;
						//console.log('Found',measure.obj[voice][i].type);
							switch(measure.obj[voice][i].type){
								case 'barline':
									awesomechords.canvas.sheetmusic.drawBarline(x, y, measure.obj[voice][i].subtype, cnvCtx);
									elemWidth=awesomechords.canvas.sheetmusic.getBarlineWidth(measure.obj[voice][i].subtype);
									x+=elemWidth;
									break;
								case 'breath': break;
								case 'fermata': break;
								case 'Harmony':
									let font = cnvCtx.font;
									cnvCtx.font = font.replace(/\d+(.*)/,20+'$1');
									cnvCtx.fillText(measure.obj[voice][i].chord, tempX, y-awesomechords.canvas.sheetmusic.staffLinesHeight);
									cnvCtx.font = font;
									break;
								case 'chord':
									let numOfNotes = measure.obj[voice][i].notes.length, chordDuration = MuseScore.convert_duration(measure.obj[voice][i].durationType), note;
										for(let j=0;j<numOfNotes;j++){
											note=awesomechords.note.fromMidiNoteNumber(measure.obj[voice][i].notes[j].pitch);
												if(measure.obj[voice][i].hide!==true){elemWidth=awesomechords.canvas.sheetmusic.drawNote(tempX,y,note,undefined,curClef,chordDuration,false,cnvCtx)};
										}
									break;
								case 'rest':
									let theRest = MuseScore.convert_duration(measure.obj[voice][i].durationType);
									elemWidth=awesomechords.canvas.sheetmusic.getRestWidth(theRest);
										if(measure.obj[voice][i].hide!==true){awesomechords.canvas.sheetmusic.drawRest(tempX, y, theRest, cnvCtx)};
									break;
								case 'clef':
								//TODO: move to the parser
									let theClef=awesomechords.classes.sheetmusic.clef.getClefInformation(measure.obj[voice][i].transposingClef.toLowerCase());
										if(theClef.transposition!==undefined){
											tempY=theClef.direction==undefined?(awesomechords.canvas.sheetmusic.staffLinesHeight*(5-theClef.transposition+(theClef.type=='f'?-1:(theClef.type=='c'?-2:-3)))):0;
											curClef=[theClef.type, theClef.transposition+(theClef.direction==undefined?'':theClef.direction), theClef.transposition, theClef.direction];
										}else{
											tempY=0;
											curClef=theClef.type;
												if(curClef[0]=='p'){
													curClef='p';
												}
										}
									elemWidth=awesomechords.canvas.sheetmusic.getClefWidth(curClef);
									x+=elemWidth;
										if(measure.obj[voice][i].hide!==true){awesomechords.canvas.sheetmusic.drawClef(tempX, y+tempY, curClef, cnvCtx)};
									break;
								case 'timeSignature': break;
								case 'keySignature': break;
							}
							if(measure.obj[voice][i].hide!==true){tempX+=elemWidth+20;}
					}
			}
		return mWidth;
	}
	static getMeasureWidth(measure, breathingSpace=20){
		let mWidth=0, voiceWidth;
		let numOfElements, numOfVoices= measure.obj.length, curObj;
			for(let voice=0;voice<numOfVoices;voice++){
				numOfElements = measure.obj[voice].length;
				voiceWidth=0;
					for(let i=0;i<numOfElements;i++){
						curObj=measure.obj[voice][i];
							if(curObj.hide==true){continue;}
							switch(curObj.type){
								case 'chord': voiceWidth+=breathingSpace+awesomechords.canvas.sheetmusic.getGeneralNoteWidth(MuseScore.convert_duration(curObj.durationType), false);
									let accidentalMax=0;
										for(let note in curObj.notes){
											accidentalMax=Math.max(accidentalMax, awesomechords.canvas.sheetmusic.getAccidentalWidth(awesomechords.note.accidentals(note.tpc+'4')));
										}
									voiceWidth+=accidentalMax;
									break;
								case 'rest': voiceWidth+=breathingSpace+awesomechords.canvas.sheetmusic.getRestWidth(MuseScore.convert_duration(curObj.durationType)); break;
								case 'barline': voiceWidth+=breathingSpace+awesomechords.canvas.sheetmusic.getBarlineWidth(curObj.subtype); break;
								case 'clef': voiceWidth+=breathingSpace+awesomechords.canvas.sheetmusic.getClefWidth(awesomechords.classes.sheetmusic.clef.getClefInformation(curObj.concertClef).type); break;
							}
					}
				mWidth=Math.max(mWidth, voiceWidth);
			}
		return mWidth+breathingSpace*2;
	}
	static downloadMuseScoreFile(mscObj){
		let mscx = '<?xml version="1.0" encoding="UTF-8"?><museScore version="3.02"><programVersion>3.6.2</programVersion><programRevision>3224f34</programRevision><Score>';
		
		//Meta: arranger, composer, copyright, creationDate, lyricist, movementNumber, movementTitle, mscVersion, platform, poet, source, translator, workNumber, workTitle
			for(let metaKey in mscObj.meta){
				mscx+='<metaTag name="'+metaKey+'">'+mscObj.meta[metaKey]+'</metaTag>';
			}
		
		//Part
		mscx+='<Part><Staff id="1"></Staff><trackName>Piano</trackName><Instrument><longName>Piano</longName><shortName>Pno.</shortName><trackName>Piano</trackName><minPitchP>21</minPitchP><maxPitchP>108</maxPitchP><minPitchA>21</minPitchA><maxPitchA>108</maxPitchA><instrumentId>keyboard.piano</instrumentId><Channel><program value="0"/><synti>Fluid</synti></Channel><Channel name="harmony"><controller ctrl="0" value="3"/><controller ctrl="32" value="17"/><program value="0"/><synti>Fluid</synti></Channel></Instrument></Part>';
		
		//Staff Data
		mscx+='<Staff id="1">';
		
		//TitleBox
		
		mscx+='<VBox><Text><style>Title</style><text>'+mscObj.meta['workTitle']+'</text></Text><Text><style>Composer</style><text>'+mscObj.meta['composer']+'</text></Text></VBox>';
		
		//Musical Magic
		let numOf = mscObj.measures.length, curChord, rootTPC;
			for(let i=0;i<numOf;i++){
				mscx+='<Measure><voice>';
					if(i==0){mscx+='<BarLine><subtype>start</subtype></BarLine>';}
				curChord = awesomechords.chordSheet.chordText.elements_as_obj(mscObj.measures[i]);
				rootTPC = MuseScore.tonalPitchClass(curChord.root);
				mscx+='<Harmony><root>'+rootTPC+'</root>'+(curChord.bass==undefined?'':'<base>'+MuseScore.tonalPitchClass(curChord.bass)+'</base>')+'<name>'+curChord.chord.substring(curChord.root.length, curChord.chord.length-(curChord.bass==undefined?0:curChord.bass.length+1))+'</name></Harmony>';
				//<Lyrics><text>Höh\'</text></Lyrics>
				mscx+='<Chord><durationType>whole</durationType><Note><pitch>'+awesomechords.note.midiNoteNumber(curChord.root+'4')+'</pitch><tpc>'+rootTPC+'</tpc></Note></Chord>';
					if(i==numOf-1){mscx+='<BarLine><subtype>end</subtype></BarLine>';}
				mscx+='</voice></Measure>';
			}
		
		mscx+='</Staff></Score></museScore>';
		
		return mscx;
	}
}

class XMLTree{
	//loopcount=1000000;
	root;

	constructor(xmlData){
		this.root = {type:'root', name:'root', content:this.parse(xmlData)[0]};
	}
	toHTML(node=undefined, depth=0){
			if(node==undefined){
				node = this.root;
			}
		let str = '', paddingChar='<span class="xml-indent"></span>', padding = paddingChar.repeat(depth), contentLen = node.content.length;
			switch(node.type){
				case 'text':
				case 'comment':
				case 'string':
					//str+=padding+node.type+'\n'+padding+paddingChar+node.content;
					str+=padding+'<span class="xml-text">'+node.content+'<span><br>';
					break;
				case 'tag':
					str+=padding+'<span class="xml-node">'+node.name+'</span>';
					let attributeString = '';
						for(let key in node.attributes){
							attributeString+=(attributeString==''?'':', ')+'<span class="xml-attribute-key">'+key+'</span>: <span class="xml-attribute-value">'+node.attributes[key]+'</span>';
						}
						if(attributeString!==''){
							str+=' <span class="xml-attributes">['+attributeString+']</span>';
						}
					str+='<br>';
				case 'root':
						for(let i=0;i<contentLen;i++){
							str+=this.toHTML(node.content[i],depth+1);
						}
					break;
			}
		return str;
	}
	toString(node=undefined, depth=0){
			if(node==undefined){
				node = this.root;
			}
		let str = '', paddingChar='  ', padding = paddingChar.repeat(depth), contentLen = node.content.length;
			switch(node.type){
				case 'text':
				case 'comment':
				case 'string':
					//str+=padding+node.type+'\n'+padding+paddingChar+node.content;
					str+=padding+node.content+'\n';
					break;
				case 'tag':
					str+=padding+node.name;
					let attributeString = '';
						for(let key in node.attributes){
							attributeString+=(attributeString==''?'':', ')+key+': '+node.attributes[key];
						}
						if(attributeString!==''){
							str+=' ['+attributeString+']';
						}
					str+='\n';
				case 'root':
						for(let i=0;i<contentLen;i++){
							str+=this.toString(node.content[i],depth+1);
						}
					break;
			}
		return str;
	}
	parse(xmlData, pointer=0){
			if(xmlData==undefined){return undefined;}
		let xmlDataLength=xmlData.length, dataTree = [];
		let curChar, curTag={type:'text', content:''}, inString=false, inComment=false, isMeta=false;
			while(pointer<xmlDataLength){// && this.loopcount>0){
				//this.loopcount--;
				curChar = xmlData[pointer];
					if(inString!==false){
						if(xmlData.substring(pointer, pointer+1)===inString){
							dataTree.push(curTag);
							curTag = {type:'text', content:''};
							inString=false;
						}else{
							curTag.content+=curChar;
						}
					}else if(inComment==true){
						if(xmlData.substring(pointer, pointer+2)==='-->'){
							dataTree.push(curTag);
							curTag = {type:'text', content:''};
							inComment=false;
						}else{
							curTag.content+=curChar;
						}
					}else if(isMeta!==false){
						console.log('\\'+curChar);
						isMeta=false;
					}else{
						if(xmlData.substring(pointer, pointer+4)==='<!--'){
								if(this.notEmptyNode(curTag)){
									dataTree.push(curTag);
								}
							curTag = {type:'comment', content:''};
							inComment = true;
							pointer+=3;
						}else{
							switch(curChar){
								case '<': //Start Tag
										if(this.notEmptyNode(curTag)){
											dataTree.push(curTag);
										}
									curTag = {type:'tag', content:''};
									let sub = this.parseAttributes(xmlData, pointer+1);
									//console.log(xmlData.substring(pointer+1, sub[1]));
									let tree = sub[0];
										if(tree[0]!==undefined){
												if(tree[0].content[0]==='/'){ //End Tag
												//TODO: Check whether [sub[1]-1] is always neccessary
													return [dataTree, sub[1]-1];
												}
											curTag.name = tree[0].content;
												if(curTag.name === '?xml'){
													curTag.xmlSignature = true;
												}
											curTag.attributes = {};
											let numOfAttributes = tree.length, i=1, attributeName, attributeValue;
												while(i<numOfAttributes){
														if(tree[i].type==='attribute'){
															attributeName = tree[i].content;
																if(attributeName[attributeName.length-1]==='=' && tree[i+1]!==undefined){
																	attributeValue = tree[i+1].content;
																	attributeName=attributeName.substring(0, attributeName.length-1);
																}else{
																	attributeValue = true;
																}
															curTag.attributes[attributeName.trim()]=attributeValue;
														}
													i++;
												}
											curTag.selfClosing=curTag.name[curTag.name.length-1]=='/' || (numOfAttributes>1 && ['/','?'].indexOf(tree[numOfAttributes-1].content)>=0);
										}
									//console.log(curTag.name);
										if(!curTag.selfClosing){
											//console.log('Searching for Subtree', curTag.name);
											sub = this.parse(xmlData, sub[1]);
											curTag.content = sub[0];
											//console.log('Stopped searching Subtree', xmlData.substring(pointer, pointer+5));
											//console.log('/'+curTag.name);
										}
									pointer=sub[1];
									break;
								case '"': //Start/End String
								//case '\'':
										if(this.notEmptyNode(curTag)){
											dataTree.push(curTag);
										}
									curTag = {type:'string', content:''};
									inString = curChar;
									break;
								default:
										if(curTag.type!=='text'){
											dataTree.push(curTag);
											curTag = {type:'text', content:''};
										}
									curTag.content+=curChar;
							}
						}
					}
				pointer++;
			}
			if(this.notEmptyNode(curTag)){
				dataTree.push(curTag);
			}
		return [dataTree, pointer];
	}
	notEmptyNode(node){
			if(node==undefined){return undefined;}
			if(node.type==='text' && node.content.trim()===''){//replaceAll(/\s/g,'')===''){
				return false;
			}
		return true;
	}
	parseAttributes(xmlData, pointer=0){
			if(xmlData==undefined){return undefined;}
		let xmlDataLength=xmlData.length, dataTree = [];
		let curChar, curTag={type:'tagname', content:''}, inString=false, inComment=false, isMeta=false;
			while(pointer<xmlDataLength){
				curChar = xmlData[pointer];
					if(inString!==false){
						if(xmlData.substring(pointer, pointer+1)===inString){
							dataTree.push(curTag);
							curTag = {type:undefined, content:''};
							inString=false;
						}else{
							curTag.content+=curChar;
						}
					}else if(inComment==true){
						if(xmlData.substring(pointer, pointer+2)==='-->'){
							dataTree.push(curTag);
							curTag = {type:undefined, content:''};
							inComment=false;
						}else{
							curTag.content+=curChar;
						}
					}else if(isMeta!==false){
						console.log('\\'+curChar);
						isMeta=false;
					}else{
							if(xmlData.substring(pointer, pointer+4)==='<!--'){
								dataTree.push(curTag);
								curTag = {type:'comment', content:''};
								inComment = true;
								pointer+=3;
							}else{
								switch(curChar){
									case '>': //End Tag
										dataTree.push(curTag);
										return [dataTree, pointer+1];
									case '"': //Start/End String
									case '\'':
										dataTree.push(curTag);
										curTag = {type:'string', content:''};
										inString = curChar;
										break;
									case ' ':
										dataTree.push(curTag);
										curTag = {type:'attribute', content:''};
									default:
										curTag.content+=curChar;
								}
							}
					}
				pointer++;
			}
		return dataTree;
	}
	static walkLeavesContent(path, node=undefined, pointer=0){ //Returns content of Path[Array of Strings] leaves or []
		let myNodes = this.walk(path,node,pointer);
			if(myNodes==undefined){return undefined;}
		let numOf = myNodes.length;
			for(let i=0;i<numOf;i++){
				while(myNodes[i]!==undefined && Array.isArray(myNodes[i].content)){
					myNodes[i] = myNodes[i].content[0];
				}
			}
		return myNodes;
	}
	static walkContent(path, node=undefined, pointer=0){ //Returns content at Path[Array of Strings] or undefined
		let myNode = this.walk(path,node,pointer);
			if(myNode==undefined){return undefined;}
		myNode=myNode[0];
			while(myNode!==undefined && Array.isArray(myNode.content)){
				myNode = myNode.content[0];
			}
		return myNode==undefined?undefined:myNode.content;
	}
	static walk(path, node=undefined, pointer=0){ //Returns node at Path[Array of Strings] or undefined
			if(path==undefined || node==undefined || pointer<0){return undefined;}
		let pathLen = path.length;
			if(pathLen==0 || pointer>=pathLen){
				return undefined;
			}
		//console.log('At', node.name);
			if(!Array.isArray(node.content)){
				//console.log('x Leaf::Invalid Type');
				return undefined;
			}
		let numOfChildren = node.content.length, ret=[];
			if(numOfChildren==0){
				//console.log('x Leaf::No Children');
				return undefined;
			}
		//console.log('Checking Children[',numOfChildren,'] for', path[pointer]);
				for(let i=0;i<numOfChildren;i++){
					//console.log('  Check', path[pointer], node.content[i].name);
					if(path[pointer]==node.content[i].name){
						if(pointer==pathLen-1){ //End Of Path. If multiples exist, return
							//console.log('Adding', node.content[i].name);
							ret.push(node.content[i]);
						}else{
							//console.log('Checking', node.content[i].name);
							ret.push(this.walk(path, node.content[i], pointer+1));
						}
					}
				}
				if(ret.length==0){
					//console.log('no Match');
					return undefined;
				}
		//console.log(ret.length, 'Matches');
		return ret.flat();
	}
}
