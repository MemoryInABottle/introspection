// Ogg Vobis

const MemoryInABottle_FileFormat_Multimedia_OggVorbis = {
	type: 'plugin',
	plugin: {
		// Unique name
		id: 'multimedia-ogg',
		// Plugin path
		fileName: 'ogg.plugin.js',
		// Name descriptor (friendly name)
		name: 'Ogg Vorbis',
		type: 'file-format',
		category: 'multimedia',
		description: 'Ogg Vorbis is a multimedia file format. It supports multi-tracks.',
		// List of public function names (excluding miabPlugin-specifics),
		//   if entry isArray => [name, ...description]
		//   if entry isObject => property: value (required: name)
		functions: [
			{name: 'isValidHeader', type: 'bool', parameter: {}, description: 'Checks the magic number.'},
		],
		// List of public property names (excluding miabPlugin-specifics),
		//   if entry isObject => property: value (required: name)
		properties: [
			{name: 'prefix', type: 'string', description: 'File name ending. (*.prefix)'},
			{name: 'magicByteLen', type: 'int', description: 'Number of bytes representing the file format\'s magic number'},
		],
		// List of requirements.
		requirements: [
			//{type: 'file', path: 'librarypath', version: '3.6'},
		],
		register: function(){
			if(MemoryInABottle_PluginManager){
				MemoryInABottle_PluginManager.registerPlugin(MemoryInABottle_FileFormat_Multimedia_OggVorbis);
			}
		},
	},
	
	prefix: 'ogg',
	magicByteLen: 4,
	
	isValidHeader: function(magicbytes){
		//4f 67 67 53
		if(magicbytes.length>3){
			if(magicbytes[0] === 79 && magicbytes[1] === 103 && magicbytes[2] === 103 && magicbytes[3] === 83){
				return true;
			}
		}
		return false;
	},
	
	read: function(bytes){
		let header = [
			['magic', '4'],
			['version', '1'],
			['type', '1'],
			// 1: [fresh/continued packet]
			// 2: [[not/-] first page of logical bitstream]
			// 4: [[not/-] last page of logical bitstream]
			['granule', '8'],
			['serial', '4'],
			['sequence', '4'],
			['checksum', '4'],
			['segment', '1'],
		];
	},
};
MemoryInABottle_FileFormat_Multimedia_OggVorbis.plugin.register();
