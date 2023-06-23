import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Purchase from "../screens/app/purchase";


export function AuthNavigation() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="Purchase">

      <Stack.Screen
        name="Purchase"
        component={Purchase}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
