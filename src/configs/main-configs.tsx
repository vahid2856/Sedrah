import { createContext, FC, useContext } from 'react';

import { generateID } from '@components/tree';
import jMoment, { Moment } from 'moment-jalaali';

interface TextField<R, F extends keyof R = keyof R> {
  type: 'text' | 'number' | 'color';
  multiline: boolean;
  name: F;
  initialValue: R[F];
  label: string;
  isRequired: boolean;
}

interface CheckboxField<R, F extends keyof R = keyof R> {
  type: 'checkbox';
  name: F;
  initialValue: R[F];
  label: string;
  isRequired: boolean;
}

interface SelectField<R, F extends keyof R = keyof R> {
  type: 'select';
  selectType: 'single' | 'multiple';
  name: F;
  initialValue: R[F];
  label: string;
  options: Array<{ value: string; label: string }>;
  isRequired: boolean;
}

interface DateTimeField<R, F extends keyof R = keyof R> {
  type: 'date' | 'time' | 'dateTime';
  name: F;
  initialValue: R[F];
  label: string;
  isRequired: boolean;
}

type Fields<R = SedrahNodeData, F extends keyof R = keyof R> = F extends keyof R
  ?
      | TextField<R, F>
      | SelectField<R, F>
      | CheckboxField<R, F>
      | DateTimeField<R, F>
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
  permissions: Array<string>;
  size: string;
  olderThanFifty: boolean;
  color: string;
  date: Moment;
  time: Moment;
  dateAndTime: Moment;
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
      type: 'text', // Can be one of 'text' | 'number' | 'checkbox' | 'select' | 'color' | 'date' | 'time' | 'dateTime'
      label: 'نام',
      isRequired: true, // Field need to be validated or not
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
      isRequired: false,
    },
    {
      name: 'username',
      initialValue: '',
      multiline: true,
      type: 'text',
      label: 'نام کاربری',
      isRequired: false,
    },
    {
      name: 'birthYear',
      initialValue: 1300,
      multiline: false,
      type: 'number',
      label: 'تولد',
      isRequired: false,
    },
    {
      name: 'permissions',
      selectType: 'multiple', // Can be one of 'multiple' | 'single'
      initialValue: ['admin'], // If select type is 'multiple' should be array of values else strign or number
      type: 'select',
      label: 'دسترسی‌ها',
      options: [
        { value: 'admin', label: 'ادمین' },
        { value: 'user', label: 'کاربر' },
        { value: 'guest', label: 'مهمان' },
      ],
      isRequired: false,
    },
    {
      name: 'olderThanFifty',
      initialValue: true,
      type: 'checkbox',
      label: 'بیش از پنجاه سال',
      isRequired: false,
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
      isRequired: false,
    },
    {
      name: 'color',
      initialValue: '',
      multiline: false,
      type: 'color',
      label: 'رنگ',
      isRequired: false,
    },
    {
      name: 'date',
      initialValue: jMoment(),
      type: 'date',
      label: 'تاریخ',
      isRequired: false,
    },
    {
      name: 'time',
      initialValue: jMoment(),
      type: 'time',
      label: 'زمان',
      isRequired: false,
    },
    {
      name: 'dateAndTime',
      initialValue: jMoment(),
      type: 'dateTime',
      label: 'تاریخ و زمان',
      isRequired: false,
    },
  ],
  initialTree: [
    {
      id: generateID(),
      nodeType: 'simple',
      name: 'خانه دوست کجاست',
      username: 'عباس کیارستمی',
      birthYear: 1313,
      permissions: ['admin'],
      size: 'small',
      olderThanFifty: true,
      color: '',
      date: jMoment(),
      time: jMoment(),
      dateAndTime: jMoment(),
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
