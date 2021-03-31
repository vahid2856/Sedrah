import { FC, FormEvent, useState } from 'react';
import { TreeItem } from 'react-sortable-tree';
import { Button, Grid, TextField } from '@material-ui/core';

interface AddNodeFormProps {
  onAddNode: (formValues: TreeItem) => void;
}

type FormErrors = {
  [key in keyof TreeItem]: string;
};

const AddNodeForm: FC<AddNodeFormProps> = (props) => {
  const { onAddNode } = props;
  const [formValues, setFormValues] = useState<TreeItem>({
    title: '',
    subtitle: '',
    age: 1,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
    title: '',
    subtitle: '',
    age: '',
  });

  const handleFieldChange = (
    fieldName: keyof TreeItem,
    fieldValue: TreeItem[keyof TreeItem],
  ) => {
    setFormErrors({ title: '', subtitle: '', age: '' });
    setFormValues((prevState) => ({ ...prevState, [fieldName]: fieldValue }));
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formValues.title !== '') {
      onAddNode(formValues);
      setFormValues({
        title: '',
        subtitle: '',
        age: 1,
      });
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
            label="subtitle"
            variant="outlined"
            size="small"
            error={Boolean(formErrors.subtitle)}
            helperText={formErrors.subtitle}
            value={formValues.subtitle}
            onChange={(e) => handleFieldChange('subtitle', e.target.value)}
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

export default AddNodeForm;
