import './minio-browser';

// let authData = {
// 	url: '',
// 	port: '',
// 	ssl: true,
// 	login: '',
// 	pass: '',
// 	theme: '',
// 	folder: ''
// };

// var s3Client;
// let trig = false, policySet=true;

// function setLoginData({url, port, ssl, login, pass, theme, folder}) {
// 	if (trig) {
// 		if (folder[0]==='/') folder=folder.substr(1);
// 		if ((folder!='')&&(folder.substr(-1)!=='/')) folder+='/';
// 		authData = {url: url, port: port, ssl:ssl, login: login, pass: pass, theme: theme, folder: folder};
// 		s3Client = new Minio.Client({
// 			endPoint: authData.url,
// 			port: Number(authData.port),
// 			useSSL: authData.ssl,
// 			accessKey: authData.login,
// 			secretKey: authData.pass
// 		});
// 	}
// }

// let data, authRes=false, errName='';

// let dataZ = {
// 	colors: {
// 	  	primary: {
// 			main: '#000000',
// 			light: '#000000',
// 			dark: '#000000',
// 			contrastText: '#000000'
// 	  	},
// 	  	secondary: {
// 			main: '#000000'
// 	  	},
// 	  	error: {
// 			main: '#000000'
// 	  	},
// 	  	warning: {
// 			main: '#000000'
// 	  	},
// 	  	info: {
// 			main: '#000000'
// 	  	},
// 	  	success: {
// 			main: '#000000'
// 	  	}
// 	},
// 	company_name: "",
// 	images: {
// 	  	favicon: "",
// 		logo_mini: "",
// 	  	logo: ""
// 	},
// 	resources: {
// 		webpage: "",
// 		facebook: "",
// 		linkedin: "",
// 		twitter: "",
// 		github: "",
// 		docs: "",
// 		android_market: "",
// 		ios_market: "",
// 		android_sdk: "",
// 		ios_sdk: "",
// 		privacyPolicy: ""
// 	}
// };

export const auth = ({url, port, ssl, login, pass, theme, folder}) => {
		// eslint-disable-next-line no-undef
		const s3Client = new Minio.Client({
			endPoint: url,
			port: Number(port),
			useSSL: ssl,
			accessKey: login,
			secretKey: pass
		});
		console.log(s3Client);

		// setLoginData({url, port, ssl, login, pass, theme, folder});
		let loginHidden, dataS, errName, authRes, data, dataZ
		s3Client.getObject(theme, folder+'theme.json', function(e, dataStream) {
			if (e) {
				console.log('f');
				console.log(e);
				errName=e.code;
				if ((e.code==='NoSuchBucket')||(e.code==='NoSuchKey')) loginHidden={error: true, general: false, makeBucket: false};
				else loginHidden={error: false, general: false, makeBucket: false};
				authRes=false;
			}
			try {
				dataStream.on('data', function(chunk) {
					dataS += chunk
				});
				dataStream.on('end', function() {
					data=JSON.parse(dataS);
					authRes=true;
					loginHidden={error: true, general: true, makeBucket: false};
				})
				dataStream.on('error', function(e) {
					authRes=false;
				})
			}
			catch(e) {
				console.log('g');
				data=dataZ;
			};
		});
		// return authRes;
	// }
}


// function jsonSave() {  //функция должна передать json в минио
// 	if (trig) {
// 		console.log('save');
// 		if (authRes) {
// 			s3Client.putObject(authData.theme, authData.folder+'theme.json', JSON.stringify(data), function(e) {
// 				if (e) {
// 				return console.log(e)
// 				}
// 				console.log("Successfully uploaded the Buffer")
// 			})
// 			setPolicy();
// 		}
// 	}
// }
// let mfile, newFile, newFileData;
// async function imageSave(addr, type, file) {
//   console.log(file.current.files[0]);
//   console.log(type);
//   mfile=file;
//   if (file.current.files[0]) {
// 	//let reader = new FileReader();
// 	loading(true);
// 	newFile=file.current.files[0];
// 	newFileData = newFile.slice(0, newFile.size, newFile.size);
// 	let fName=newFile.name.slice(-4);
// 	if (fName.indexOf('.')==(-1)) fName='.'+fName;
// 	if (type=='favicon')fName='favicon'+fName;
// 	if (type=='flogo')fName='logo'+fName;
// 	if (type=='slogo')fName='logo_mini'+fName;
// 	let url = (authData.ssl?'https://':'http://')+authData.url+':'+authData.port+'/'+authData.theme+'/'+authData.folder+fName;
// 	let sendData={method: 'PUT', headers: {'Content-type': newFile.type}, body: newFile}
// 	const respons = await fetch(url, sendData);
// 	console.log (respons);
// 	if (respons.ok) {
// 		if (type=='favicon') data.images.favicon=url;
// 		if (type=='flogo') data.images.logo=url;
// 		if (type=='slogo') data.images.logo_mini=url;
// 		jsonSave();
// 	}
// 	loading(false);
// 	rend();
// 	/*if (type==='favicon')
// 		newFile = new File([newFileData],
// 			'favicon'+newFile.name.substr(newFile.name.indexOf('.')),
// 			{type: newFile.type});
// 	if (type==='flogo') 
// 		newFile = new File([newFileData],
// 			'logo'+newFile.name.substr(newFile.name.indexOf('.')),
// 			{type: newFile.type});
// 	if (type==='slogo')
// 		newFile = new File([newFileData],
// 			'logo_mini.svg',//+newFile.name.substr(newFile.name.indexOf('.')),
// 			{type: newFile.type});
// 		  console.log(typeof(newFile.type));
// 	reader.onload = ((event) => {
// 		console.log(event.target.result);
// 		s3Client.putObject(authData.theme, authData.folder+newFile.name, event.target.result, {'Content-type': newFile.type}, function(e) {
// 			if (e) {
// 				return console.log(e)
// 			}
// 			if (type==='favicon') data.images.favicon = newFile.type=='image/svg+xml' ? 'https://'+authData.url+':9000/'+authData.theme+'/'+authData.folder+newFile.name : event.target.result;
// 			if (type==='flogo') data.images.logo = newFile.type=='image/svg+xml' ? 'https://'+authData.url+':9000/'+authData.theme+'/'+authData.folder+newFile.name : event.target.result;
// 			if (type==='slogo') data.images.logo_mini = newFile.type=='image/svg+xml' ? 'https://'+authData.url+':9000/'+authData.theme+'/'+authData.folder+newFile.name : event.target.result;
// 			jsonSave();
// 			loading(false);
// 			console.log("Successfully uploaded the Buffer");
// 			rend();
// 		});
// 	});
// 	reader.readAsBinaryString(newFile);*/
// 	}
  
// }

//   function getData() {
//     return data;
// }

// function getKeysCount(buffer){
//     let i = 0;
//     for (let key in buffer) {
//         i++;
//     }
//     return i;
// }

// function getKeys(buffer){
//     let bufferIn = [];
//     for (let key in buffer)
//         bufferIn.push(key);
//     return bufferIn;
// }

// function shextohex(col)
//   {
//     if (col.length==4) return col[0]+col[1]+col[1]+col[2]+col[2]+col[3]+col[3];
//     if (col.length==7) return col;
// }

// function loading(status) {
// 	document.getElementById("image1").hidden=!status;
// }

// function setPolicy() {
// 	let policy = `
// 	{
// 		"Version": "2012-10-17",
// 		"Statement": [
// 		  {
// 			"Effect": "Allow",
// 			"Principal": {
// 			  "AWS": [
// 				"*"
// 			  ]
// 			},
// 			"Action": [
// 			  "s3:DeleteObject",
// 			  "s3:GetObject",
// 			  "s3:PutObject"
// 			],
// 			"Resource": [
// 			  "arn:aws:s3:::${authData.theme}/*"
// 			]
// 		  }
// 		]
// 	  }
// 	`;
// 	console.log(authData.theme);
// 	if (policySet) s3Client.setBucketPolicy(authData.theme, policy, (err) => {
// 			if (err) throw err	
// 				console.log('Set bucket policy');
// 			if (!err) {
// 				console.log('policy set');
// 				policySet=false;
// 			}
// 		})	
// }

// function creatBucket() {
// 	s3Client.makeBucket(authData.theme, 'us-west-1', function(e) {
// 		if (e) {
// 		  return console.log(e)
// 		}
// 		console.log("Success");
// 		setPolicy();
// 	  })
// }

// function creatBorF(trig, event) {
// 	event.preventDefault();
// 	console.log(trig);	
// 	if (trig === 'no') loginHidden={error: true, general: false, makeBucket: true};
// 	if (trig === 'yes') {
// 		console.log(errName);
// 		if (errName==='NoSuchBucket') creatBucket(authData.theme);
// 		loginHidden={error: true, general: true, makeBucket: false};
// 		authRes=true;
// 	} 
// 	rend();
// }

