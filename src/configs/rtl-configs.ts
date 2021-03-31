import { create } from 'jss';
import rtl from 'jss-rtl';
import { jssPreset } from '@material-ui/core/styles';

// TODO: fix this TS issue
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

export default jss;
