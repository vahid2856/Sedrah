import { FC, FormEvent, useEffect, useState } from 'react';
import { Button, Grid, TextField } from '@material-ui/core';

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
  const { fields } = useConfigs();
  const [formValues, setFormValues] = useState(
    fields.reduce(
      (res, field) => ({ ...res, [field.name]: field.initialValue }),
      {} as SedrahNodeData,
    ),
  );
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
    fieldValue: string | number,
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
        {fields.map((field) => (
          <Grid key={field.name} item xs={12} sm={6}>
            <TextField
              fullWidth
              type={field.type}
              required={field.isValidate}
              label={field.label}
              variant="outlined"
              size="small"
              error={Boolean(formErrors[field.name])}
              helperText={formErrors[field.name]}
              value={formValues[field.name]}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
            />
          </Grid>
        ))}
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
