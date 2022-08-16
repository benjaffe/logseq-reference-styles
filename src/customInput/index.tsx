import React,{FunctionComponent} from 'react'
import "./inputbox.css"

interface CustomInputParams {

}

export default function CustomInput(props):FunctionComponent<CustomInputParams>{
  return (
    <div className="textInputWrapper">
      <input {...props} className={`${props.className} textInput`} />
    </div>
  )
}