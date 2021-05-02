import { createContext, FC, useContext, ReactNode } from 'react';

import { generateID } from '@components/tree';
import jMoment, { Moment } from 'moment-jalaali';

interface FieldDefaultProperties<R, F extends keyof R = keyof R> {
  name: F;
  initialValue: R[F];
  label: string;
  isRequired: boolean;
  validationFunc?: <T = R[F]>(value?: T) => boolean;
}

interface TextField {
  type: 'text' | 'number' | 'color';
  multiline: boolean;
}

interface CheckboxField {
  type: 'checkbox';
}

interface SelectField {
  type: 'select';
  selectType: 'single' | 'multiple';
  options: Array<{ value: string; label: string }>;
}

interface DateTimeField {
  type: 'date' | 'time' | 'dateTime';
}

type AllFields = TextField | SelectField | CheckboxField | DateTimeField;

export type Fields<
  R = SedrahNodeData,
  F extends keyof R = keyof R
> = F extends keyof R ? FieldDefaultProperties<R, F> & AllFields : never;

interface DefaultFields {
  id: string; // Unique id of node. Never remove this field.
  nodeType: NodeTypes; // Type of Node. Never remove this field.
  name: string; // Primary field. Never remove this field.
}

interface ConfigContextInterface {
  treeNodes: {
    [NodeType in NodeTypes]: {
      nodeView: (node: SedrahNodeData) => ReactNode;
      fields: Array<Fields>;
      onUpdateNode?: (nodeData?: SedrahNodeData) => void;
    };
  };
  initialTree: Array<SedrahNodeData>;
  nodeTypes: Array<{ value: NodeTypes; label: string }>;
  primaryField: keyof SedrahNodeData;
  mainFunctions: MainFunctionsInterface;
  generateNewNode: (type: NodeTypes) => SedrahNodeData;
}

interface MainFunctionsInterface {
  [func: string]: {
    label: string;
    cb: (selectedNodes: Array<SedrahNodeData>) => void;
  };
}

const generateNewNode = (type: NodeTypes): SedrahNodeData => {
  const fields = mainConfigs.treeNodes[type].fields;
  return fields.reduce(
    (res, field) => {
      return {
        ...res,
        [field.name]: field.initialValue,
      };
    },
    { id: generateID(), nodeType: type } as SedrahNodeData,
  );
};

// Deiffernt Node types. Do not remove 'simple'
export type NodeTypes = 'full' | 'simple';

// Add new field and its type in this interface
export interface NodeFields extends DefaultFields {
  username?: string;
  birthYear?: number;
  permissions?: Array<string>;
  size?: string;
  olderThanFifty?: boolean;
  color?: string;
  date?: Moment;
  time?: Moment;
  dateAndTime?: Moment;
}

// Main project callback functions
const mainFunctions: MainFunctionsInterface = {
  test1: {
    label: 'تست یک',
    cb: (selectedNodes) => {
      console.log(selectedNodes);
    },
  },
};

// Main project config files
const mainConfigs: ConfigContextInterface = {
  treeNodes: {
    simple: {
      fields: [
        {
          name: 'name',
          initialValue: '',
          multiline: false, // If true, a textarea element will be rendered instead of an input
          type: 'text', // Can be one of 'text' | 'number' | 'checkbox' | 'select' | 'color' | 'date' | 'time' | 'dateTime'
          label: 'نام',
          isRequired: true, // Field need to be validated or not
        },
      ],
      nodeView: function SimpleNodeView(node) {
        return (
          <div>
            <span>گره ساده - </span>
            <span>{node.name}</span>
          </div>
        );
      },
      onUpdateNode: (v) => console.log(v), // Callback when node updated
    },
    full: {
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
          validationFunc: (v) => Number(v) > 1310,
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
      nodeView: function FullNodeView(node) {
        return <div style={{ color: node.color }}>{node.time?.toString()}</div>;
      },
      onUpdateNode: (v) => console.log(v), // Callback when node updated
    },
  },
  initialTree: [
    {
      id: generateID(),
      nodeType: 'simple',
      name: 'خانه دوست کجاست',
    },
  ],
  nodeTypes: [
    { value: 'simple', label: 'ساده' },
    { value: 'full', label: 'پیچیده' },
  ],
  primaryField: 'name',
  mainFunctions,
  generateNewNode,
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
