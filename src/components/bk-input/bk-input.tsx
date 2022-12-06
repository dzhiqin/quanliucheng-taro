import { toastService } from '@/service/toast-service';
import * as React from 'react'
import { AtInput } from 'taro-ui'

export default function BkInput(props: {
  name: string,
  type: 'text',
  value: string,
  placeholder: string,
  placeholderStyle?: string,
  placeholderClass?: string,
  title: string,
  maxLength: number,
  cursorSpacing?: 50,
  confirmType?: "send" | "search" | "next" | "go" | "done",
  cursor?: number,
  selectionStart?: -1,
  selectionEnd?: -1,
  adjustPosition?: true,
  disabled?: false,
  border?: true,
  editable?: true,
  error?: false,
  clear?: false,
  autoFocus?: false,
  focus?: false,
  required?: false,
  onChange: any,
  onFocus?: any,
  onBlur?: any,
  onConfirm?: any,
  onErrorClick?: any,
  onClick?: any,
  onKeyBoardHeightChange?: any,
  children?: any
}){
  const {name,type,placeholder,placeholderClass,placeholderStyle,
  title,maxLength,cursorSpacing,cursor,confirmType,selectionStart,selectionEnd,
  adjustPosition,disabled,border,editable,error,clear,autoFocus,focus,required,
  onChange,onFocus,onBlur,onConfirm,onErrorClick,onClick} = props
  const handleInputChange = (input) => {
    if(maxLength && input.length > maxLength){
      toastService({title: `${title}最多输入${maxLength}个字符`})
      return
    }
    setValue(input)
    onChange(input)
  }
  const [value,setValue] = React.useState(props.value)
  React.useEffect(() => {
    setValue(props.value)
  },[props.value])
  return (
    <AtInput name={name} onChange={handleInputChange.bind(null)} type={type} value={value} placeholder={placeholder}
      placeholderClass={placeholderClass} placeholderStyle={placeholderStyle} title={title}
      cursor={cursor} cursorSpacing={cursorSpacing} confirmType={confirmType} selectionEnd={selectionEnd}
      selectionStart={selectionStart} adjustPosition={adjustPosition} disabled={disabled} border={border}
      editable={editable} error={error} clear={clear} autoFocus={autoFocus} focus={focus} required={required}
      onFocus={onFocus} onBlur={onBlur} onConfirm={onConfirm} onErrorClick={onErrorClick} onClick={onClick}
    >{props.children}</AtInput>
  )
}