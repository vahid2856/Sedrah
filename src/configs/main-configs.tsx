import { createContext, FC, useContext } from 'react';

type FieldTypes = 'text' | 'number';

interface Field<R, F extends keyof R = keyof R> {
  name: F;
  initialValue: R[F];
  type: FieldTypes;
  label: string;
  isValidate: boolean;
}

type Fields<R = SedrahNodeData, F extends keyof R = keyof R> = F extends keyof R
  ? Field<R, F>
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
}

// Main project Config files
const mainConfigs: ConfigContextInterface = {
  fields: [
    {
      name: 'name',
      initialValue: '',
      type: 'text',
      label: 'نام',
      isValidate: true,
    },
    {
      name: 'username',
      initialValue: '',
      type: 'text',
      label: 'نام کاربری',
      isValidate: false,
    },
    {
      name: 'birthYear',
      initialValue: 1300,
      type: 'number',
      label: 'تولد',
      isValidate: false,
    },
  ],
  initialTree: [
    {
      name: 'خانه دوست کجاست',
      username: 'عباس کیارستمی',
      birthYear: 1313,
    },
  ],
  primaryField: 'name',
  secondaryField: 'username',
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
