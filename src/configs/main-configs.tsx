import { createContext, FC, useContext } from 'react';

interface TextField<R, F extends keyof R = keyof R> {
  type: 'text' | 'number';
  multiline: boolean;
  name: F;
  initialValue: R[F];
  label: string;
  isValidate: boolean;
}

interface CheckboxField<R, F extends keyof R = keyof R> {
  type: 'checkbox';
  name: F;
  initialValue: R[F];
  label: string;
  isValidate: boolean;
}

interface SelectField<R, F extends keyof R = keyof R> {
  type: 'select';
  selectType: 'single' | 'multiple';
  name: F;
  initialValue: R[F];
  label: string;
  options: Array<{ value: string; label: string }>;
  isValidate: boolean;
}

type Fields<R = SedrahNodeData, F extends keyof R = keyof R> = F extends keyof R
  ? TextField<R, F> | SelectField<R, F> | CheckboxField<R, F>
  : never;

interface ConfigContextInterface {
  fields: Array<Fields>;
  initialTree: Array<SedrahNodeData>;
  primaryField: keyof SedrahNodeData;
  secondaryField: keyof SedrahNodeData;
}

// Add new field and its type in this interface
export interface NodeFields {
  name: string;
  username: string;
  birthYear: number;
  color: Array<string>;
  size: string;
  olderThanFifty: boolean;
}

// Main project Config files
const mainConfigs: ConfigContextInterface = {
  fields: [
    {
      name: 'goal',
      initialValue: '',
      multiline: false, // If true, a textarea element will be rendered instead of an input
      type: 'text', // Can be one of 'text' | 'number' | 'checkbox' | 'select'
      label: 'هدف',
      isValidate: true, // Field need to be validated or not
    },
    {
      name: 'priority',
      initialValue: 1,
      multiline: true,
      type: 'number',
      label: 'اولیت',
      isValidate: false,
    },
    {
      name: 'description',
      initialValue: '',
      multiline: true,
      type: 'text',
      label: 'توضیحات',
      isValidate: false,
    },
    {
      name: 'goal_type',
      selectType: 'single', // Can be one of 'multiple' | 'single'
      initialValue: ['how?'], // If select type is 'multiple' should be array of values else strign or number
      type: 'select',
      label: 'نوع هدف',
      options: [
        { value: 'why?', label: 'چرایی' },
        { value: 'what?', label: 'چیستی' },
        { value: 'how?', label: 'چگونگی' },
      ],
      isValidate: true,
    },
    {
      name: 'urgency',
      selectType: 'single', // Can be one of 'multiple' | 'single'
      initialValue: ['1'], // If select type is 'multiple' should be array of values else strign or number
      type: 'select',
      label: 'فوریت',
      options: [
        { value: '1', label: 'بدون فوریت' },
        { value: '2', label: 'در روزهای آینده' },
        { value: '3', label: 'فوری' },
      ],
      isValidate: true,
    },
    {
      name: 'importance',
      selectType: 'single', // Can be one of 'multiple' | 'single'
      initialValue: ['1'], // If select type is 'multiple' should be array of values else strign or number
      type: 'select',
      label: 'اهمیت',
      options: [
        { value: '1', label: 'اهمیت پایین' },
        { value: '2', label: 'مهم' },
        { value: '3', label: 'خیلی مهم' },
      ],
      isValidate: true,
    }
  ],
  initialTree: [
    {
      goal: 'عبد خدا شدن',
      priority: 9,
      description: '',
      goal_type: 'why',
      urgency: '3',
      importance: '3',
    },
  ],
  primaryField: 'name',
  secondaryField: 'priority',
};

const ConfigsContext = createContext(mainConfigs);

export const Configs: FC = ({ children }) => {
  return (
    <ConfigsContext.Provider value={mainConfigs}>
      {children}
    </ConfigsContext.Provider>
  );
};

export const useConfigs = (): ConfigContextInterface => {
  return useContext(ConfigsContext);
};
