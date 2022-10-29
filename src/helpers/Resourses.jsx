import React from 'react'
import TextField from '@mui/material/TextField';

const mainKey = 'resources';

export default function Resourses(props) {
    const {resKey, value, callback} = props
  return (
    <TextField value={value} id="outlined-basic" label={resKey} variant="filled" color='primary' onChange={(evt)=>callback(evt, mainKey, resKey)} />
  )
}