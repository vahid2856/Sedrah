import { createContext, FC, useContext } from 'react';

import { generateID } from '@components/tree';

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
  mainFunctions: MainFunctionsINterface;
  onUpdateNode?: (nodeData?: SedrahNodeData) => void;
}

interface MainFunctionsINterface {
  [func: string]: {
    label: string;
    cb: (selectedNodes: Array<SedrahNodeData>) => void;
  };
}

// Add new field and its type in this interface
export interface NodeFields {
  id: string; // Unique id of node. Never remove this field.
  nodeType: string; // Type of Node. Never remove this field.
  name: string;
  username: string;
  birthYear: number;
  color: Array<string>;
  size: string;
  olderThanFifty: boolean;
}

// Main project callback functions
const mainFunctions: MainFunctionsINterface = {
  test1: {
    label: 'تست یک',
    cb: (selectedNodes) => {
      console.log(selectedNodes);
    },
  },
};

// Main project config files
const mainConfigs: ConfigContextInterface = {
  fields: [
    {
      name: 'name',
      initialValue: '',
      multiline: false, // If true, a textarea element will be rendered instead of an input
      type: 'text', // Can be one of 'text' | 'number' | 'checkbox' | 'select'
      label: 'نام',
      isValidate: true, // Field need to be validated or not
    },
    {
      // Never remove this field.
      name: 'nodeType',
      initialValue: '',
      type: 'select',
      selectType: 'single',
      options: [
        { value: '', label: 'بدون نوع' },
        { value: 'simple', label: 'ساده' },
        { value: 'complex', label: 'پیچیده' },
      ],
      label: 'نوع گره',
      isValidate: false,
    },
    {
      name: 'username',
      initialValue: '',
      multiline: true,
      type: 'text',
      label: 'نام کاربری',
      isValidate: false,
    },
    {
      name: 'birthYear',
      initialValue: 1300,
      multiline: false,
      type: 'number',
      label: 'تولد',
      isValidate: false,
    },
    {
      name: 'color',
      selectType: 'multiple', // Can be one of 'multiple' | 'single'
      initialValue: ['red'], // If select type is 'multiple' should be array of values else strign or number
      type: 'select',
      label: 'رنگ',
      options: [
        { value: 'red', label: 'قرمز' },
        { value: 'blue', label: 'آبی' },
      ],
      isValidate: false,
    },
    {
      name: 'olderThanFifty',
      initialValue: true,
      type: 'checkbox',
      label: 'بیش از پنجاه سال',
      isValidate: false,
    },
    {
      name: 'size',
      initialValue: 'small',
      type: 'select',
      selectType: 'single',
      options: [
        { value: 'small', label: 'کوچک' },
        { value: 'medium', label: 'متوسط' },
        { value: 'large', label: 'بزرگ' },
      ],
      label: 'اندازه',
      isValidate: false,
    },
  ],
  initialTree: [
    {
      id: generateID(),
      nodeType: 'simple',
      name: 'خانه دوست کجاست',
      username: 'عباس کیارستمی',
      birthYear: 1313,
      color: ['red'],
      size: 'small',
      olderThanFifty: true,
    },
  ],
  primaryField: 'name',
  secondaryField: 'username',
  mainFunctions,
  onUpdateNode: (v) => console.log(v), // Callback when node updated
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
