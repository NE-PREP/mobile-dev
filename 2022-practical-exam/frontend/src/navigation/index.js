import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import Register from "../screens/auth/register";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Login from "../screens/auth/login";
import Home from "../screens/app/home";

export default function Navigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function getAuthToken() {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
      }
    }
    getAuthToken();
  }, []);

  if (!isLoggedIn) return <AuthNavigation />;
  return <AppNavigation />;
}

export function AuthNavigation() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="App"
        options={{ headerShown: false }}
        component={AppNavigation}
      />
    </Stack.Navigator>
  );
}

export function AppNavigation() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
            <Stack.Screen
        name="Auth"
        component={AuthNavigation}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
