/* eslint-disable no-undef */
import * as Minio from './minio-browser';
import defaultTheme from "../default.theme";

const themeBt = 'themes';

export default class MinioCl {
  constructor(minioConfig) {
    this.config = minioConfig;
    this.reconnectionTimeout = this.config.reconnectionTimeout || 30000;
  }

  static async waitBeforeReconnection(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  async initConnection() {
    try {
      const {
        endpoint,
        port,
        use_ssl: useSsl,
        access_key: accessKey,
        secret_key: secretKey,
      } = this.config;

      this.minio = new Minio.Client({
        endPoint: endpoint,
        useSSL: useSsl,
        port: port,
        accessKey: accessKey,
        secretKey: secretKey,
      });

      const buckets = await this.minio.listBuckets();

      const bucketExist = buckets.filter((bucket) => bucket.name === themeBt)[0];

      // if bucket didn't exist => create it
      if (!bucketExist) {
        await this.createBt(themeBt);
      }

      const policy = await this.getPolicy(themeBt);

      const buckerPolicy = JSON.parse(policy);
      if (buckerPolicy.Statement.length > 1) {
        await this.minio.setBucketPolicy(themeBt, this.constructor.getNecessaryPolicy(themeBt))
          .catch((error) => {
            console.error('Error with setting policy', error);
            throw new Error(error);
          });
        console.log(`Policy for ${themeBt} was created successfully`);
      }

      console.log('Connected to minio successfully');
    } catch (error) {
      console.error('Error occured while connecting to minio: ', error);
      await this.constructor.waitBeforeReconnection(this.reconnectionTimeout);
      await this.initConnection();
    }
  }

  async createBt(themeBt) {
    await this.minio.makeBucket(themeBt, 'us-east-1')
      .catch((errorCreate) => {
        console.error('Error creating bucket.', errorCreate);
        throw new Error(`Error creating bucket. ${errorCreate} ${errorCreate.code}`);
      });
  }

  async getPolicy(themeBt) {
    const policy = await this.minio.getBucketPolicy(themeBt)
      .catch(async (error) => {
        if (error.code === 'NoSuchBucketPolicy') {
          await this.minio.setBucketPolicy(themeBt, this.constructor.getNecessaryPolicy(themeBt));
          console.log(`Policy for ${themeBt} was created successfully`);
          const createdPolicy = await this.minio.getBucketPolicy(themeBt);

          return createdPolicy;
        }
        console.error('Minio getBucketPolicy error: ', error);

        throw new Error(error);
      });
    return policy;
  }

  static getNecessaryPolicy(themeBt) {
    return JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Action: ['s3:DeleteObject', 's3:GetObject', 's3:PutObject'],
          Effect: 'Allow',
          Principal: { AWS: '*' },
          Resource: [`arn:aws:s3:::${themeBt}/*`],
          Sid: '',
        },
      ],
    });
  }

  async uploadImage(imgName, metaData, file, base64) {  // imgName, metaData, file, base64
    const {use_ssl: useSSL, endpoint, port: savedPort, folder} = this.config;

    const fileData = base64.match(/^data:image\/([A-Za-z-+/]+);base64,(.+)$/);
    let fileExtention = ''
    if(!fileData){
      fileExtention = 'ico'
    } else {
      fileExtention = fileData[1];
    }

    if (fileExtention === 'svg') { fileExtention = 'image/svg+xml'; };

    const fName = imgName + '.' + fileExtention;

    let port = ''

    if(savedPort){
      port += `:${savedPort}`
    }

    let url = (useSSL?'https://':'http://')+endpoint +port+'/'+themeBt+'/'+ folder +'/' +fName;
    let sendData={method: 'PUT', headers: {'Content-type': metaData}, body: file}
    const res = await fetch(url, sendData);

    return {
      file: imgName,
      url: res.url
    }
  }

  async getJson() {
    let a = await fetch(`${this.config.use_ssl?'https':'http'}://${this.config.endpoint}${this.config.port?':'+this.config.port:''}/${themeBt}/${this.config.folder}/theme.json`);
    let b = await a.json();
    return b;
  }

  async getJson2() {
    let data, dataS='';
    let prom = await this.minio.getObject(themeBt, this.config.folder+'/theme.json', function(e, dataStream) {
        if (e) console.log(e);
        else {
          try {
            dataStream.on('data', function(chunk) {
              dataS += chunk
            });
            dataStream.on('end', function() {
              data=JSON.parse(dataS);
              console.log(data);
              return data;
            })
            dataStream.on('error', function(e) {
              console.log(e);
              data=(defaultTheme);
            })
          }
          catch(e) {
            console.log('g');
        }}});
  }

  async uploadJson(data) {
    const { folder } = this.config;
    const fileMetaData = {
      'Content-Type': `application/json`,
    };
    await this.minio.putObject(themeBt, folder +'/theme.json', JSON.stringify(data), fileMetaData);
  }
};
