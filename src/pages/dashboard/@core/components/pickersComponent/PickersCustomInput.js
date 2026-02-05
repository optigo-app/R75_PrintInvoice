// ** React Imports
import { forwardRef } from 'react'

// ** Custom Component Import
// import CustomTextField from 'src/@core/components/mui/text-field'
import CustomTextField from '../../../@core/components/mui/text-field'

const PickersComponent = forwardRef(({ ...props }, ref) => {
  // ** Props
  const { label, readOnly, sx } = props

  return (
    <CustomTextField
      {...props}
      inputRef={ref}
      label={label || ''}
      {...(readOnly && { inputProps: { readOnly: true } })}
      sx={sx}
    />
  )
})

export default PickersComponent;