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
export type NodeTypes = DefaultNodeType | 'project' | 'madreseh' ;

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
  send_message: {
    label: 'ارسال پیام',
    cb: (selectedNodes) => {
      console.log(selectedNodes);
    },
  },
  live_stream: {
    label: 'ایجاد پخش زنده',
    cb: (selectedNodes) => {
      console.log(selectedNodes);
    },
  },
  group_meeting: {
    label: 'ایجاد جلسه گفتگو',
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
          label: 'نام فرد',
          isRequired: true, // Field need to be validated or not
          isSearchable: true
        },
        {
          name: 'element_user',
          initialValue: '',
          multiline: false, // If true, a textarea element will be rendered instead of an input
          type: 'text', // Can be one of 'text' | 'number' | 'checkbox' | 'select' | 'color' | 'date' | 'time' | 'dateTime'
          label: 'نام کاربری در المنت',
          isRequired: true, // Field need to be validated or not
          isSearchable: true
        },
        {
          name: 'tags',
          selectType: 'multiple', // Can be one of 'multiple' | 'single'
          initialValue: ['معارف# '], // If select type is 'multiple' then "initialValue" should be an array of values
          type: 'select',
          label: 'گروه‌ها',
          options: [
            { value: 'فیلم‌سازی# ', label: 'فیلم‌سازی' },
            { value: 'معارف# ', label: 'معارف' },
            { value: 'معماری# ', label: 'معماری' },
             { value: 'منظومه# ', label: 'منظومه' },
          ],
          isRequired: false,
          isSearchable: true
        }
      ],
      nodeView: function SimpleNodeView(node) {
        return (
          <div>
            <span>گروهها - </span>
            <span>{node.tags}</span>
          </div>
        );
      },
      onUpdateNode: (v) => console.log(v), // Callback when node updated
    },
   madreseh:
    {
      fields: [
        {
          name: 'name',
          initialValue: '',
          multiline: false, // If true, a textarea element will be rendered instead of an input
          type: 'text', // Can be one of 'text' | 'number' | 'checkbox' | 'select' | 'color' | 'date' | 'time' | 'dateTime'
          label: 'نام گروه',
          isRequired: true, // Field need to be validated or not
        },
        {
          name: 'element_user',
          initialValue: '',
          multiline: false, // If true, a textarea element will be rendered instead of an input
          type: 'text', // Can be one of 'text' | 'number' | 'checkbox' | 'select' | 'color' | 'date' | 'time' | 'dateTime'
          label: 'نام کاربری در المنت',
          isRequired: true, // Field need to be validated or not
        },
        {
          name: 'admin',
          initialValue: '',
          multiline: false, // If true, a textarea element will be rendered instead of an input
          type: 'text', // Can be one of 'text' | 'number' | 'checkbox' | 'select' | 'color' | 'date' | 'time' | 'dateTime'
          label: 'نام مسئول',
          isRequired: true, // Field need to be validated or not
        },
        {
          name: 'element_user_admin',
          initialValue: '',
          multiline: false, // If true, a textarea element will be rendered instead of an input
          type: 'text', // Can be one of 'text' | 'number' | 'checkbox' | 'select' | 'color' | 'date' | 'time' | 'dateTime'
          label: 'نام کاربری مسئول در المنت',
          isRequired: true, // Field need to be validated or not
        },
        {
          name: 'tags',
          selectType: 'multiple', // Can be one of 'multiple' | 'single'
          initialValue: ['admin'], // If select type is 'multiple' then "initialValue" should be an array of values
          type: 'select',
          label: 'گروه‌ها',
          options: [
            { value: 'فیلم‌سازی# ', label: 'فیلم‌سازی' },
            { value: 'معارف# ', label: 'معارف' },
            { value: 'معماری# ', label: 'معماری' },
          ],
          isRequired: false,
        }
      ],
      nodeView: function MadresehNodeView(node) {
        return (
          <div>
            <span>مسئول - </span>
            <span>{node.admin}</span>
          </div>
        );
      },
      onUpdateNode: (v) => console.log(v), // Callback when node updated
    },
    project: {
      fields: [
        {
          name: 'name',
          initialValue: '',
          multiline: false, // If true, a "textarea" element will be rendered instead of an input
          type: 'text', // Can be one of 'text' | 'number' | 'checkbox' | 'select' | 'color' | 'date' | 'time' | 'dateTime'
          label: 'نام',
          isRequired: true, // Field is required or not
        },
        {
          name: 'element_user',
          initialValue: '',
          multiline: false, // If true, a textarea element will be rendered instead of an input
          type: 'text', // Can be one of 'text' | 'number' | 'checkbox' | 'select' | 'color' | 'date' | 'time' | 'dateTime'
          label: 'نام کاربری در المنت',
          isRequired: true, // Field need to be validated or not
        },
        {
          name: 'priority',
          selectType: 'single', // Can be one of 'multiple' | 'single'
          initialValue: 'reg', // If select type is 'multiple' then "initialValue" should be an array of values
          type: 'select',
          label: 'اولویت',
          options: [
            { value: 'مهم', label: 'مهم' },
            { value: 'عادی', label: 'عادی' },
            { value: 'بسیار مهم', label: 'بسیار مهم' },
          ],
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
          name: 'dateAndTime',
          initialValue: jMoment(),
          type: 'dateTime',
          label: 'مهلت',
          isRequired: false,
        },
      ],
      nodeView: function ProjectNodeView(node) {
        return <div style={{ color: node.color }}><span>پروژه - </span>{node.priority}</div>;
      },
      onUpdateNode: (v) => console.log(v), // Callback when node updated
    },
  },
  initialTree: [
  {"name":"دستیار عربی","element_user":"!CpnaMFWBRQluWOdsBm:quranic.network","id":"!CpnaMFWBRQluWOdsBm:quranic.network","tags":["معارف# "],"nodeType":"simple"},{"name":"1234567","element_user":"!EWKhEruXVJszSEmRcp:quranic.network","id":"!EWKhEruXVJszSEmRcp:quranic.network","tags":["معارف# "],"nodeType":"simple"},{"name":"کیوان","element_user":"!EzvOJBYpFJpHHayYYU:quranic.network","id":"!EzvOJBYpFJpHHayYYU:quranic.network","tags":["معارف# "],"nodeType":"simple"},{"name":"سی","element_user":"!IVVkuStknRKZIJfYDZ:quranic.network","id":"!IVVkuStknRKZIJfYDZ:quranic.network","tags":["معارف# "],"nodeType":"simple"},{"name":"ahmademoon","element_user":"!LfkudOofhvoJUYCFyC:matrix.org","id":"!LfkudOofhvoJUYCFyC:matrix.org","tags":["معارف# "],"nodeType":"simple"},{"name":"احمدی - ناظر فنی","element_user":"!PvmIsaMLiYScDEntAm:quranic.network","id":"!PvmIsaMLiYScDEntAm:quranic.network","tags":["معارف# "],"nodeType":"simple"},{"name":"رسانه","element_user":"!QbkIuZYQzpoQlLcyxd:quranic.network","id":"!QbkIuZYQzpoQlLcyxd:quranic.network","tags":["معارف# "],"nodeType":"simple"},{"name":"mahdi.ahmadi.py","element_user":"!RYqGRbOGnNryPFnwSX:matrix.org","id":"!RYqGRbOGnNryPFnwSX:matrix.org","tags":["معارف# "],"nodeType":"simple"},{"name":"نیازهای نرم افزار","element_user":"!RpJmlelsytNWAzogOE:quranic.network","id":"!RpJmlelsytNWAzogOE:quranic.network","tags":["معارف# "],"nodeType":"simple"},{"name":"test","element_user":"!RrTfPdmqxIqnVdThGY:quranic.network","id":"!RrTfPdmqxIqnVdThGY:quranic.network","tags":["معارف# "],"nodeType":"simple"},{"name":"آموزش _ تحلیل و طراحی","element_user":"!TFRQzzIgaKaCzDhCmv:quranic.network","id":"!TFRQzzIgaKaCzDhCmv:quranic.network","tags":["معارف# "],"nodeType":"simple"},{"name":"salambot","element_user":"!UDYktaOLzDUIjCLBfL:quranic.network","id":"!UDYktaOLzDUIjCLBfL:quranic.network","tags":["معارف# "],"nodeType":"simple"},{"name":"داشبورد مديريت","element_user":"!VpbuAIJrGRTvdMTobB:quranic.network","id":"!VpbuAIJrGRTvdMTobB:quranic.network","tags":["معارف# "],"nodeType":"simple"},{"name":"آموزش نرم‌افزار","element_user":"!XbjdvrvfguVJiqSfkO:ebad.quranic.network","id":"!XbjdvrvfguVJiqSfkO:ebad.quranic.network","tags":["معارف# "],"nodeType":"simple"},{"name":"‌تحلیل و بررسی ایجاد باتها","element_user":"!aOvNTazraJPIFAPqpS:quranic.network","id":"!aOvNTazraJPIFAPqpS:quranic.network","tags":["معارف# "],"nodeType":"simple"},{"name":"smghandi","element_user":"!almjlaWSwuPIdXdSdC:quranic.network","id":"!almjlaWSwuPIdXdSdC:quranic.network","tags":["معارف# "],"nodeType":"simple"},{"name":"مدیریت پروژه","element_user":"!bIrlqoPmNtZIbOCnai:quranic.network","id":"!bIrlqoPmNtZIbOCnai:quranic.network","tags":["معارف# "],"nodeType":"simple"},{"name":"پشتیبانی- ثبت‌نام المنت عباد","element_user":"!cBsHFGXTIVCQKUTxCy:quranic.network","id":"!cBsHFGXTIVCQKUTxCy:quranic.network","tags":["معارف# "],"nodeType":"simple"},{"name":"test","element_user":"!hRnCkDmtPHyscWLSBR:quranic.network","id":"!hRnCkDmtPHyscWLSBR:quranic.network","tags":["معارف# "],"nodeType":"simple"},{"name":"Empty room (was admin)","element_user":"!ipoyjovQubpXhMQfgM:ebad.quranic.network","id":"!ipoyjovQubpXhMQfgM:ebad.quranic.network","tags":["معارف# "],"nodeType":"simple"},{"name":"haghi","element_user":"!iuzgySRZmDQjvxWQHK:quranic.network","id":"!iuzgySRZmDQjvxWQHK:quranic.network","tags":["معارف# "],"nodeType":"simple"},{"name":"درباره کلیت معماری نرم‌افزار","element_user":"!keplMYypLIhxWlLTzA:quranic.network","id":"!keplMYypLIhxWlLTzA:quranic.network","tags":["معارف# "],"nodeType":"simple"},{"name":"دستیار صدا و تصویر","element_user":"!lfFYiGzGOeDecrmqjL:quranic.network","id":"!lfFYiGzGOeDecrmqjL:quranic.network","tags":["معارف# "],"nodeType":"simple"},{"name":"mohammad.zahmatkesh","element_user":"!oesabyzWpsQoRiggrD:ebad.quranic.network","id":"!oesabyzWpsQoRiggrD:ebad.quranic.network","tags":["معارف# "],"nodeType":"simple"},{"name":"me.ahmadi","element_user":"!qjdEYMGqdZRSlzuLcG:quranic.network","id":"!qjdEYMGqdZRSlzuLcG:quranic.network","tags":["معارف# "],"nodeType":"simple"},{"name":"معارف","element_user":"!reBTMrlGehLTzqWkTm:quranic.network","id":"!reBTMrlGehLTzqWkTm:quranic.network","tags":["معارف# "],"nodeType":"simple"},{"name":"طراحی و پیاده سازی داشبورد مدیریتی","element_user":"!vvOUezWTUaCMtTzlhx:quranic.network","id":"!vvOUezWTUaCMtTzlhx:quranic.network","tags":["معارف# "],"nodeType":"simple"},{"name":"دفتر آموزش خواهران","element_user":"!xJtgyHJLWdOYqaJhgN:quranic.network","id":"!xJtgyHJLWdOYqaJhgN:quranic.network","tags":["معارف# "],"nodeType":"simple"},{"name":"3","element_user":"!xTVPXBIeQkRRLdADcV:quranic.network","id":"!xTVPXBIeQkRRLdADcV:quranic.network","tags":["معارف# "],"nodeType":"simple"},{"name":"ایده‌پردازی آموزش نوجوانان","element_user":"!yvPkSbLfJXGcAgSYoX:quranic.network","id":"!yvPkSbLfJXGcAgSYoX:quranic.network","tags":["معارف# "],"nodeType":"simple"},{"name":"vahid_nadarkhani","element_user":"!zMzXEzukzdBXbMQtTy:quranic.network","id":"!zMzXEzukzdBXbMQtTy:quranic.network","tags":["معارف# "],"nodeType":"simple"}
  ],
  nodeTypes: [
    { value: 'simple', label: 'فرد' },
    { value: 'project', label: 'پروژه' },
    { value: 'madreseh', label: 'گروه' }
  ],
  primaryField: 'name',
  mainFunctions,
  generateNewNode,
  appTitle: 'بسم الله الرحمن الرحیم',
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
