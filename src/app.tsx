import { FC } from 'react';
import {
  ThemeProvider,
  StylesProvider,
  createMuiTheme,
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { themeConfigs, rtlConfigs } from '@configs/index';
import Tree from '@components/tree';

const App: FC = () => {
  return (
    <ThemeProvider theme={createMuiTheme(themeConfigs)}>
      <CssBaseline />
      <StylesProvider jss={rtlConfigs}>
        <Tree />
      </StylesProvider>
    </ThemeProvider>
  );
};

export default App;
