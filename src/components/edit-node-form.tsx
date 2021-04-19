import { FC, FormEvent, useEffect, useState } from 'react';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { useConfigs } from '@configs/main-configs';

interface AddNodeFormProps {
  initialValues: SedrahNodeData | null;
  onUpdateNode: (formValues: SedrahNodeData) => void;
}

type FormErrors = {
  [key in keyof SedrahNodeData]: string;
};

const EditNodeForm: FC<AddNodeFormProps> = (props) => {
  const { initialValues, onUpdateNode } = props;
  const { fields, generateNewNode } = useConfigs();
  const [formValues, setFormValues] = useState(generateNewNode());
  const [formErrors, setFormErrors] = useState(
    fields.reduce(
      (res, field) => ({ ...res, [field.name]: '' }),
      {} as FormErrors,
    ),
  );

  useEffect(() => {
    if (initialValues) {
      setFormValues(initialValues);
    }
  }, [initialValues]);

  const handleFieldChange = (
    fieldName: keyof SedrahNodeData,
    fieldValue: SedrahNodeData[keyof SedrahNodeData],
  ) => {
    setFormErrors(
      fields.reduce(
        (res, field) => ({ ...res, [field.name]: '' }),
        {} as FormErrors,
      ),
    );
    setFormValues((prevState) => ({ ...prevState, [fieldName]: fieldValue }));
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const withoutError = fields.reduce((isValid, field) => {
      if (field.isValidate) {
        if (formValues[field.name] === '') {
          setFormErrors((prevState) => ({
            ...prevState,
            [field.name]: 'ضروری است',
          }));
          return false;
        }
      }

      return isValid;
    }, true);

    if (withoutError) {
      onUpdateNode(formValues);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} noValidate autoComplete="off">
      <Grid container spacing={2}>
        {fields.map((field) => {
          switch (field.type) {
            case 'number':
            case 'text':
              return (
                <Grid key={field.name} item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    multiline={field.multiline}
                    type={field.type}
                    required={field.isValidate}
                    label={field.label}
                    variant="outlined"
                    size="small"
                    error={Boolean(formErrors[field.name])}
                    helperText={formErrors[field.name]}
                    value={formValues[field.name]}
                    onChange={(e) =>
                      handleFieldChange(field.name, e.target.value)
                    }
                  />
                </Grid>
              );
            case 'checkbox':
              return (
                <Grid key={field.name} item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(formValues[field.name])}
                        onChange={(e) =>
                          handleFieldChange(field.name, e.target.checked)
                        }
                        name={field.name}
                      />
                    }
                    label={field.label}
                  />
                </Grid>
              );
            case 'select':
              return (
                <Grid key={field.name} item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel id="select-label">{field.label}</InputLabel>
                    <Select
                      labelId="select-label"
                      value={formValues[field.name]}
                      onChange={(e) =>
                        handleFieldChange(field.name, e.target.value as string)
                      }
                      multiple={field.selectType === 'multiple'}
                      label={field.label}
                    >
                      {field.options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              );

            default:
              return <>نوع فیلد معتبر نیست!</>;
          }
        })}
        <Grid container spacing={2} justify="flex-end">
          <Grid item>
            <Button type="submit" color="primary" variant="contained">
              ویرایش
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default EditNodeForm;
