import React,{FunctionComponent} from 'react'
import "./inputbox.css"



export default function CustomInput(props){
  return (
    <div className="textInputWrapper">
      <input {...props} className={`${props.className} textInput`} />
    </div>
  )
}
