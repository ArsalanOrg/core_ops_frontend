import { FormControl, FormLabel, Input } from '@chakra-ui/react'
import Select from 'react-select'

export const CustomInput = ({
  inputName,
  inputText,
  value,
  type,
  _isRequired,
  size,
  placeholder = '',
  handleChange,
  defaultValue = '',
  readOnly = false,
}) => (
  <FormControl id={inputName} isRequired={_isRequired}>
    <FormLabel>{inputText}</FormLabel>
    <Input
      borderColor='gray.500'
      borderRadius='3px'
      type={type}
      name={inputName}
      value={value}
      onChange={handleChange}
      size={size}
      placeholder={placeholder}
      defaultValue={defaultValue}
      readOnly={readOnly}
    />
  </FormControl>
)

export const CustomSelect = ({
  id,
  label,
  value,
  ref,
  options,
  isRequired_,
  placeholder,
  handleChange,
}) => {
  // Compute the selected option based on the current value.
  const selectedOption = options
    ? options.find((option) => option.value === value)
    : null

  return (
    <FormControl id={id} isRequired={isRequired_}>
      <FormLabel>{label}</FormLabel>
      <Select
        isClearable
        name={id}
        value={selectedOption}
        ref={ref}
        placeholder={placeholder}
        onChange={(e) =>
          handleChange({ target: { value: e ? e.value : '', name: id } })
        }
        options={options}
      />
      {/* Hidden input to support form validation if needed */}
      <input
        style={{
          opacity: '0',
          top: '-15px',
          left: '100px',
          position: 'relative',
          width: '1px',
          height: '1px',
          display: 'block',
        }}
        name={id}
        id={id}
        type='text'
        value={value}
        required={isRequired_}
        readOnly
      />
    </FormControl>
  )
}

export const Seperator = ({ bg = 'gray' }) => (
  <div
    style={{
      borderRadius: '3px',
      width: '100%',
      height: '1px',
      background: bg,
    }}
  ></div>
)
