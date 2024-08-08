import React from 'react'
import { DisplayValue, DisplayValueProps } from '@shared';

interface AssetApyProps extends DisplayValueProps { }

export const RandomNumber: React.FC<AssetApyProps> = ({ ...props }) => {
  return (
    <DisplayValue {...props} />
  )
}
