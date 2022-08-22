import * as React from 'react'
import { AtInput } from 'taro-ui'

export default function BKInput(props: {
  name: string,
  type: 'text',
  value: string,
  placeholder: string,
  placeholderStyle?: string,
  placeholderClass?: string,
  title: string,
  maxLength: 140,
  cursorSpacing: 50,
  confirmType: "send" | "search" | "next" | "go" | "done",
  cursor?: number,
  selectionStart: -1,
  selectionEnd: -1,
  adjustPosition: true,
  disabled: false,
  border: true,
  editable: true,
  error: false,
  clear: false,
  autoFocus: false,
  focus: false,
  required: false,
  onChange: any,
  onFocus: any,
  onBlur: any,
  onConfirm: any,
  onErrorClick: any,
  onClick: any,
  onKeyBoardHeightChange: any
}){
  const {name,type,value,placeholder,placeholderClass,placeholderStyle,
  title,maxLength,cursorSpacing,cursor,confirmType,selectionStart,selectionEnd,
  adjustPosition,disabled,border,editable,error,clear,autoFocus,focus,required,
  onChange,onFocus,onBlur,onConfirm,onErrorClick,onClick} = props
  React.useEffect(() => {

  },)
  return (
    <AtInput name={name} onChange={onChange} type={type} value={value} placeholder={placeholder}
      placeholderClass={placeholderClass} placeholderStyle={placeholderStyle} title={title}
      cursor={cursor} cursorSpacing={cursorSpacing} confirmType={confirmType} selectionEnd={selectionEnd}
      selectionStart={selectionStart} adjustPosition={adjustPosition} disabled={disabled} border={border}
      editable={editable} error={error} clear={clear} autoFocus={autoFocus} focus={focus} required={required}
      onFocus={onFocus} onBlur={onBlur} onConfirm={onConfirm} onErrorClick={onErrorClick} onClick={onClick}
    ></AtInput>
  )
}