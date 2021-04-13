import { FC, FormEvent, useEffect, useState } from 'react';
import { Button, Grid, TextField } from '@material-ui/core';

import { SedrahNodeData } from '@components/tree';

interface AddNodeFormProps {
  initialValues: SedrahNodeData | null;
  onUpdateNode: (formValues: SedrahNodeData) => void;
}

type FormErrors = {
  [key in keyof SedrahNodeData]: string;
};

const EditNodeForm: FC<AddNodeFormProps> = (props) => {
  const { initialValues, onUpdateNode } = props;
  const [formValues, setFormValues] = useState<SedrahNodeData>({
          name : '',
          username: '',
          introducer: '',
          birth_year: '',
          tel: '',
          email: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
          name : '',
          username: '',
          introducer: '',
          birth_year: '',
          tel: '',
          email: ''
  });

  useEffect(() => {
    if (initialValues) {
      setFormValues(initialValues);
    }
  }, [initialValues]);

  const handleFieldChange = (
    fieldName: keyof SedrahNodeData,
    fieldValue: string | number,
  ) => {
    setFormErrors({ name : '',
          username: '',
          introducer: '',
          birth_year: '',
          tel: '',
          email: ''});
    setFormValues((prevState) => ({ ...prevState, [fieldName]: fieldValue }));
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formValues.title !== '') {
      onUpdateNode(formValues);
    } else {
      setFormErrors((prevState) => ({
        ...prevState,
        title: 'title is required',
      }));
    }
  };

  return (
    <form onSubmit={handleFormSubmit} noValidate autoComplete="off">
      <Grid container spacing={2}>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="text"
            required
            label="نام و نام خانوادگی"
            variant="outlined"
            size="small"
            error={Boolean(formErrors.name)}
            helperText={formErrors.name}
            value={formValues.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="text"
            label="نام کاربری درخواستی"
            variant="outlined"
            size="small"
            error={Boolean(formErrors.username)}
            helperText={formErrors.username}
            value={formValues.username}
            onChange={(e) => handleFieldChange('username', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="text"
            label="معرف"
            variant="outlined"
            size="small"
            error={Boolean(formErrors.introducer)}
            helperText={formErrors.introducer}
            value={formValues.introducer}
            onChange={(e) => handleFieldChange('introducer', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="تاریخ تولد"
            variant="outlined"
            size="small"
            error={Boolean(formErrors.birthyear)}
            helperText={formErrors.birthyear}
            value={formValues.birthyear}
            onChange={(e) => handleFieldChange('birthyear', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="tel"
            variant="outlined"
            size="small"
            error={Boolean(formErrors.tel)}
            helperText={formErrors.tel}
            value={formValues.tel}
            onChange={(e) => handleFieldChange('tel', e.target.value)}
          />
        </Grid>
         <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="text"
            label="email"
            variant="outlined"
            size="small"
            error={Boolean(formErrors.email)}
            helperText={formErrors.email}
            value={formValues.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
          />
        </Grid>
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
