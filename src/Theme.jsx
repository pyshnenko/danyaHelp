import React, { useState, useEffect } from "react";
import defaultTheme from "./helpers/default.theme";
import TextField from "@mui/material/TextField";
import * as _ from 'lodash';
import "./App.css";
import "./Theme.css";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import Resourses from "./helpers/Resourses";
import Colors from "./helpers/Colors";
import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
// import Button from '@mui/material/Button';
import Images from './helpers/Images';

import TabPanel from './helpers/TabPanel'
import upload from './helpers/upload';
import {getJSONfile, getJSONdata} from './helpers/getJSON';
import { Button } from "@mui/material";

const companyName = "company_name";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const imgAccept = {
  favicon: '.ico',
  logo_mini: 'image/*',
  logo:  'image/*'
}

async function getDefaut({minio, themeInfo}) {
  let aaa;
  await getJSONfile(minio).then((result)=>{aaa=result; console.log(result)});
  console.log(aaa);
  return aaa;
}

function Theme({minio, themeInfo}) {
  let [theme, setTheme] = useState(defaultTheme);
  let bbb = getDefaut({minio, themeInfo});
  console.log(bbb);
  let ccc;
  bbb.then((res)=> {console.log(res); ccc=res;});
  console.log(ccc);
  useEffect(()=>{console.log(ccc)}, [ccc])

  const [value, setValue] = useState(0);

  const [filesList, setFilesList] = useState({
    favicon: {
      metaData: '',
      file: '',
      base64: ''
    },
    logo_mini: {
      metaData: '',
      file: '',
      base64: ''
    },
    logo:  {
      metaData: '',
      file: '',
      base64: ''
    }
  })

  const changeTab = (event, newValue) => {
    setValue(newValue);
  };

  const onChangeTxt = ({ target }, label, subLabel, minorLabel) => {
    const result = _.cloneDeep(theme);

    if (minorLabel) {
      result[label][subLabel][minorLabel] = target.value;
    } else if (subLabel) {
      result[label][subLabel] = target.value;
    } else {
      result[label] = target.value;
    }
    setTheme(result);
  };

  const onImageUpload = (imgName, metaData, file, base64) => {
    const res = _.cloneDeep(filesList);
    res[imgName] = {
      metaData,
      file,
      base64
    }
    
    setFilesList(res);
  }

  const uploadTheme = async () => {
    await upload(minio, themeInfo, theme, filesList)
  }

  return (
    <div className="App">
      <header className="App-header">
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={changeTab}
              aria-label="basic tabs example"
            >
              <Tab label="Company Name" {...a11yProps(0)} />
              <Tab label="Resources" {...a11yProps(1)} />
              <Tab label="Colors" {...a11yProps(2)} />
              <Tab label="Images" {...a11yProps(3)} />
              <Tab label="Upload" {...a11yProps(4)} />
            </Tabs>
          </Box>

          <TabPanel value={value} index={0}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <TextField
                  value={theme[companyName]}
                  id="outlined-basic"
                  label="Company Name"
                  variant="filled"
                  color="primary"
                  onChange={(evt) => onChangeTxt(evt, companyName)}
                />
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value={value} index={1}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                {Object.keys(theme.resources).map((resKey) => {
                  return (
                    <div key={`${resKey}-div`}>
                      <Resourses
                        key={resKey}
                        resKey={resKey}
                        value={theme.resources[resKey]}
                        callback={onChangeTxt}
                      />
                      <br />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value={value} index={2}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                {Object.keys(theme.colors).map((pKey) => {
                  return (
                    <div key={pKey}>
                      <Typography>{pKey}</Typography>
                      {Object.keys(theme.colors[pKey]).map((sKey) => {
                        return (
                          <Colors
                            key={`${pKey}-${sKey}`}
                            pKey={pKey}
                            sKey={sKey}
                            value={theme.colors[pKey][sKey]}
                            callback={onChangeTxt}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value={value} index={3}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                {Object.keys(theme.images).map((imEl) => {
                  return(
                    <div key={imEl}>
                      <Images 
                        accept={imgAccept[imEl]}
                        imgName={imEl}
                        callback={onImageUpload}
                      />
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value={value} index={4}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
               <Button onClick={uploadTheme}> Upload </Button>
              </CardContent>
            </Card>
          </TabPanel>
        </Box>
      </header>
    </div>
  );
}

export default Theme;