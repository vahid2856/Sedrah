import { createContext, FC, useContext, ReactNode } from 'react';

import { generateID } from '@components/tree';
import jMoment, { Moment } from 'moment-jalaali';

interface FieldDefaultProperties<R, F extends keyof R = keyof R> {
  name: F;
  initialValue: R[F];
  label: string;
  isRequired: boolean;
  isSearchable: boolean;
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

type DefaultNodeType = 'simple';

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
  appTitle: string;
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

/* *** DO NOT CHANGE ANYTHING UPPER THAN HERE *** */
/* ***                                        *** */
/* ***                                        *** */
/* ***                                        *** */

// Deiffernt Node types. Do not remove DefaultNodeType
export type NodeTypes = DefaultNodeType | 'full';

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
    label: '?????? ????',
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
          label: '??????',
          isSearchable: true,
          isRequired: true, // Field need to be validated or not
        },
      ],
      nodeView: function SimpleNodeView(node) {
        return (
          <div>
            <span>?????? ???????? - </span>
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
          multiline: false, // If true, a "textarea" element will be rendered instead of an input
          type: 'text', // Can be one of 'text' | 'number' | 'checkbox' | 'select' | 'color' | 'date' | 'time' | 'dateTime'
          label: '??????',
          isSearchable: true,
          isRequired: true, // Field is required or not
        },
        {
          name: 'username',
          initialValue: '',
          multiline: true,
          type: 'text',
          label: '?????? ????????????',
          isSearchable: false,
          isRequired: false,
        },
        {
          name: 'birthYear',
          initialValue: 1300,
          multiline: false,
          type: 'number',
          label: '????????',
          isSearchable: false,
          isRequired: false,
          validationFunc: (v) => Number(v) > 1310,
        },
        {
          name: 'permissions',
          selectType: 'multiple', // Can be one of 'multiple' | 'single'
          initialValue: ['admin'], // If select type is 'multiple' then "initialValue" should be an array of values
          type: 'select',
          label: '???????????????????',
          options: [
            { value: 'admin', label: '??????????' },
            { value: 'user', label: '??????????' },
            { value: 'guest', label: '??????????' },
          ],
          isSearchable: false,
          isRequired: false,
        },
        {
          name: 'olderThanFifty',
          initialValue: true,
          type: 'checkbox',
          label: '?????? ???? ?????????? ??????',
          isSearchable: false,
          isRequired: false,
        },
        {
          name: 'size',
          initialValue: 'small',
          type: 'select',
          selectType: 'single',
          options: [
            { value: 'small', label: '????????' },
            { value: 'medium', label: '??????????' },
            { value: 'large', label: '????????' },
          ],
          label: '????????????',
          isSearchable: false,
          isRequired: false,
        },
        {
          name: 'color',
          initialValue: '',
          multiline: false,
          type: 'color',
          label: '??????',
          isSearchable: false,
          isRequired: false,
        },
        {
          name: 'date',
          initialValue: jMoment(),
          type: 'date',
          label: '??????????',
          isSearchable: false,
          isRequired: false,
        },
        {
          name: 'time',
          initialValue: jMoment(),
          type: 'time',
          label: '????????',
          isSearchable: false,
          isRequired: false,
        },
        {
          name: 'dateAndTime',
          initialValue: jMoment(),
          type: 'dateTime',
          label: '?????????? ?? ????????',
          isSearchable: false,
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
      name: '?????????? ??????',
    },
  ],
  nodeTypes: [
    { value: 'simple', label: '????????' },
    { value: 'full', label: '????????????' },
  ],
  primaryField: 'name',
  mainFunctions,
  generateNewNode,
  appTitle: '????????????????',
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
