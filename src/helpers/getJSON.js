let data;

export const getJSONfile = async(minioWrapper) => {

    console.log('kek');
    const dataInp = await minioWrapper.getJson();
    //dataInp.then(res=>console.log(res));
    console.log(dataInp);
    data=dataInp;
    return dataInp;
}

export function getJSONdata() {
    console.log(data);
    return data;
}