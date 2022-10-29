
import React from 'react'
import { ColorPicker } from 'mui-color';

const mainKey = "colors";

// {/* <TextField value={value} id="outlined-basic" label={resKey} variant="filled" color='primary' onChange={(evt)=>callback(evt, mainKey, resKey)} /> */}
export default function Colors(props) {
  const { pKey, sKey, value, callback } = props;
  return (
    <div>
      <ColorPicker
        name={`color-${pKey}-${sKey}`}
        value={value}
        onChange={({hex}) => {
          callback(
          {
            target: {
              value: `#${hex}`
            }
          }, mainKey, pKey, sKey);
          
        }}
      />
    </div>
  );
}
