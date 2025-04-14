import { c, colors } from "@/theme";
import React, { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> { }

export const Input: React.FC<InputProps> = ({ style, placeholder, type, onChange, value }) => {
  return <input
    style={{
      backgroundColor: colors.backgroundHighlight,
      borderRadius: c.sm.borderRadius,
      paddingInline: c.sm.paddingInline,
      paddingBlock: c.sm.paddingBlock,
      fontSize: c.sm.fontSize,
      ...style
    }} placeholder={placeholder} type={type} onChange={onChange} value={value} />
}