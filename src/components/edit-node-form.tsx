import { FC, FormEvent, useState } from 'react';
import { Button, Grid, TextField } from '@material-ui/core';

import { NodeData } from '@components/tree';

interface AddNodeFormProps {
  initialValues: NodeData | null;
  onUpdateNode: (formValues: NodeData) => void;
}

type FormErrors = {
  [key in keyof NodeData]: string;
};

const EditNodeForm: FC<AddNodeFormProps> = (props) => {
  const { initialValues, onUpdateNode } = props;
  const [formValues, setFormValues] = useState<NodeData>({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    age: initialValues?.age || 1,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
    title: '',
    description: '',
    age: '',
  });

  console.log(formValues, initialValues);

  const handleFieldChange = (
    fieldName: keyof NodeData,
    fieldValue: NodeData[keyof NodeData],
  ) => {
    setFormErrors({ title: '', description: '', age: '' });
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
        <Grid item xs={6}>
          <TextField
            type="text"
            required
            label="title"
            variant="outlined"
            size="small"
            error={Boolean(formErrors.title)}
            helperText={formErrors.title}
            value={formValues.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            type="text"
            label="description"
            variant="outlined"
            size="small"
            error={Boolean(formErrors.description)}
            helperText={formErrors.description}
            value={formValues.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            type="number"
            label="age"
            variant="outlined"
            size="small"
            error={Boolean(formErrors.age)}
            helperText={formErrors.age}
            value={formValues.age}
            onChange={(e) => handleFieldChange('age', e.target.value)}
          />
        </Grid>
        <Grid container spacing={2} justify="flex-end">
          <Grid item>
            <Button type="submit" color="primary" variant="contained">
              Save
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default EditNodeForm;
