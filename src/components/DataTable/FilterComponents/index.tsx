import { Search as SearchIcon } from '@mui/icons-material';
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

export const TextFilter: React.FC<{
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}> = ({ label, value, placeholder, onChange }) => (
  <TextField
    fullWidth
    size="small"
    label={label}
    value={value}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
    InputProps={{
      startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
    }}
  />
);

export const NumberFilter: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ label, value, onChange }) => (
  <TextField
    fullWidth
    size="small"
    label={label}
    type="number"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

export const SelectFilter: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}> = ({ label, value, onChange, options }) => (
  <FormControl fullWidth size="small">
    <InputLabel>{label}</InputLabel>
    <Select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      label={label}
    >
      <MenuItem value="">All</MenuItem>
      {options.map(({ value, label }) => (
        <MenuItem key={value} value={value}>
          {label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export const DateRangeFilter: React.FC<{
  label: string;
  value: { start: Date | null; end: Date | null } | null;
  onChange: (value: { start: Date | null; end: Date | null }) => void;
}> = ({ label, value, onChange }) => (
  <Box display="flex" gap={1}>
    <DateTimePicker
      label={`${label} Start`}
      value={value?.start ? dayjs(value.start) : null}
      onChange={(newValue) => 
        onChange({ 
          start: newValue ? newValue.toDate() : null, 
          end: value?.end || null 
        })
      }
      slotProps={{ textField: { size: 'small', fullWidth: true } }}
      ampm={false}
    />
    <DateTimePicker
      label={`${label} End`}
      value={value?.end ? dayjs(value.end) : null}
      onChange={(newValue) =>
        onChange({
          start: value?.start || null,
          end: newValue ? newValue.toDate() : null
        })
      }
      slotProps={{ textField: { size: 'small', fullWidth: true } }}
      ampm={false}
    />
  </Box>
);

