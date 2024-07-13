import ButtonExample from './Example/Button';
import List from './Example/FlatList/screens';
import ImageExample from './Example/Image';
import InputExample from './Example/Input';
import ModalExample from './Example/Modal';
import TextExample from './Example/Text';

const DrawerScreens = {
  TextExample: {
    label: 'Text',
    component: TextExample,
    iconName: 'text',
  },
  ButtonExample: {
    label: 'Button',
    component: ButtonExample,
    iconName: 'hand-right',
  },
  FlatListExample: {
    label: 'FlatList',
    component: List,
    iconName: 'list',
  },
  ImageExample: {
    label: 'Image',
    component: ImageExample,
    iconName: 'image',
  },
  InputExample: {
    label: 'Input',
    component: InputExample,
    iconName: 'create',
  },
  ModalExample: {
    label: 'Modal',
    component: ModalExample,
    iconName: 'copy',
  },
};

export default DrawerScreens;
