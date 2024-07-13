import React, { memo, useCallback, useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import {
  NavigationContainer,
  useFocusEffect,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import { Text, BottomSheetFlatList, BottomSheetScrollView, Touchable, View } from '@components';
import AppView from '@utils/AppView';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';

const data: any = [];
[50].map(i =>
  Array(i)
    .fill(i)
    .map((_, index: number) => data.push(`Hi 👋 ${index} !`)),
);

export const ModalViewContent: React.FC = () => (
  <View>
    {[50].map(i =>
      Array(i)
        .fill(i)
        .map((_, index: number) => (
          <Text key={index.toString()} className="text-center">
            {`Hi 👋 ${index} !`}
          </Text>
        )),
    )}
  </View>
);

const Item: React.FC<{ text: string; onItemPress?: () => void }> = (props: {
  text: string;
  onItemPress?: () => void;
}) => {
  const { text, onItemPress } = props;

  return (
    <Touchable onPress={onItemPress} disabled={!onItemPress}>
      <Text className="text-center">{text}</Text>
    </Touchable>
  );
};

export const List = ({
  type,
  onItemPress,
}: {
  type: 'FlatList' | 'ScrollView' | 'SectionList' | 'View';
  onItemPress: () => void;
}) => {
  const contentContainerStyle: StyleProp<ViewStyle> = {
    paddingHorizontal: 16,
    paddingBottom: 16,
    overflow: 'visible',
  };
  switch (type) {
    case 'FlatList':
      return (
        <BottomSheetFlatList
          data={data}
          refreshing={false}
          // onRefresh={() => {}}
          keyExtractor={(_, index) => index.toString()}
          initialNumToRender={5}
          bounces={true}
          windowSize={10}
          maxToRenderPerBatch={5}
          renderItem={({ item }) => <Item text={item} onItemPress={onItemPress} />}
          style={{
            overflow: 'visible',
            flex: 1,
          }}
          keyboardDismissMode="interactive"
          indicatorStyle="black"
          contentContainerStyle={contentContainerStyle}
          focusHook={useFocusEffect}
        />
      );
    case 'ScrollView':
      return (
        <BottomSheetScrollView
          style={{
            overflow: 'visible',
            flex: 1,
          }}
          contentContainerStyle={contentContainerStyle}
          bounces={true}
          focusHook={useFocusEffect}
        >
          {data.map((item: string) => (
            <Item key={item} text={item} onItemPress={onItemPress} />
          ))}
        </BottomSheetScrollView>
      );
    case 'SectionList':
      return (
        <BottomSheetFlatList
          data={data}
          refreshing={false}
          // onRefresh={onRefresh}
          keyExtractor={(_, index) => index.toString()}
          initialNumToRender={5}
          bounces={true}
          windowSize={10}
          maxToRenderPerBatch={5}
          renderItem={({ item }) => <Item text={item} onItemPress={onItemPress} />}
          style={{
            overflow: 'visible',
            flex: 1,
          }}
          keyboardDismissMode="interactive"
          indicatorStyle="black"
          contentContainerStyle={contentContainerStyle}
          focusHook={useFocusEffect}
        />
      );
    default:
      return data.map((item: string) => <Item key={item} text={item} />);
  }
};

const createDummyScreen = ({ nextScreen, type }: any) =>
  memo(() => {
    const { navigate } = useNavigation();

    const handleNavigatePress = useCallback(() => {
      requestAnimationFrame(() => navigate(nextScreen));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <List onItemPress={handleNavigatePress} type={type} />;
  });

const Stack = createNativeStackNavigator();

export const ScreenA = createDummyScreen({
  nextScreen: 'ScrollView Screen',
  type: 'FlatList',
});

export const ScreenB = createDummyScreen({
  nextScreen: 'SectionList Screen',
  type: 'ScrollView',
});

export const ScreenC = createDummyScreen({
  nextScreen: 'View Screen',
  type: 'SectionList',
});

export const ScreenD = createDummyScreen({
  nextScreen: 'FlatList Screen',
  type: 'View',
});

export const Navigator = () => {
  const theme = useTheme();

  const screenOptions = useMemo<NativeStackNavigationOptions>(
    () => ({
      headerShown: true,
      safeAreaInsets: { top: 0 },
      cardStyle: {
        backgroundColor: theme.colors.card,
        overflow: 'visible',
      },
      contentStyle: { backgroundColor: theme.colors.card },
      headerStyle: {
        backgroundColor: theme.colors.card,
        borderBottomColor: theme.colors.black,
        borderBottomWidth: 0.5,
      },
      headerTitleStyle: {
        fontSize: 22,
        color: theme.colors.black,
        fontFamily: AppView.fontFamily,
      },
      headerLeftContainerStyle: { marginLeft: 10 },
    }),
    [theme],
  );

  const screenAOptions = useMemo(() => ({ headerLeft: () => null }), []);
  return (
    <NavigationContainer independent theme={theme as any}>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="FlatList Screen" options={screenAOptions} component={ScreenA} />
        <Stack.Screen name="ScrollView Screen" component={ScreenB} />
        <Stack.Screen name="SectionList Screen" component={ScreenC} />
        <Stack.Screen name="View Screen" component={ScreenD} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
