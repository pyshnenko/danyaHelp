const upload = async(minioWrapper, themeInfo, themeData, images) => {

    const imagesPromises = Object.keys(images)
        .map(async (imgName) => {
        const {metaData, file, base64} = images[imgName];
        return await minioWrapper.uploadImage(imgName, metaData, file, base64);
    });
    const dataJson = themeData;
    const imgUrlArr = await Promise.all(imagesPromises);
    imgUrlArr.forEach(({file, url}) => {
        dataJson.images[file] = url;
    });
    await minioWrapper.uploadJson(themeData);
}

export default upload;
