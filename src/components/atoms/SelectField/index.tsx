import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { useFormikContext } from 'formik';
import { CategoryType } from '@/api_type/Category';

type SelectFormProps = {
  label: string;
  name: string;
  options: CategoryType[];
  value: string | number;
};

const SelectField = ({
  label,
  name,
  options,
  value,
}: SelectFormProps) => {
  const { handleChange, errors, touched } = useFormikContext<any>();
  
  const hasError = Boolean(touched[name] && errors[name]);

  return (
    <FormControl fullWidth variant="outlined" error={hasError}>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Select
        label={label}
        name={name}
        value={value}
        onChange={handleChange}
        labelId={name}
        id={name}
      >
        {options.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.categoryName}
          </MenuItem>
        ))}
      </Select>
      {hasError && <FormHelperText>{errors[name] as string}</FormHelperText>}
    </FormControl>
  );
};

export default SelectField;
