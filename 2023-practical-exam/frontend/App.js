import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Purchase from "./src/screens/app/purchase";
import { AntDesign, EvilIcons, MaterialIcons} from "@expo/vector-icons";
import Spinner from "./src/components/spinner";
import { loadFonts } from "./src/utils/FontLoader";
import Validate from "./src/screens/app/validate";
import Tokens from "./src/screens/app/tokens";

const Tab = createBottomTabNavigator();

function TabBarIcon({ focused, color, size, route }) {
  const navigation = useNavigation();

  let icon = <></>;
  if (route.name === "Validate") {
    icon = <AntDesign name="check" size={size} color={color} />;
  } else if (route.name === "Purchase") {
    icon = <MaterialIcons name="attach-money" size={size} color={color} />;
  } else if (route.name === "Tokens") {
    icon = <AntDesign name="copy1" size={size} color={color} />;
  }
  
  const onPress = () => {
    // Navigate to the screen
    navigation.navigate(route.name);
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      {icon}
    </TouchableOpacity>
  );
}

function App() {
  const [isFontLoaded, setIsFontLoaded] = useState(false);

  const handleFontsLoad = async () => {
    await loadFonts();
    setIsFontLoaded(true);
  };

  useEffect(() => {
    handleFontsLoad();
  });

  if (!isFontLoaded) {
    return <Spinner />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Purchase"
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "rgba(82, 80, 79,0.7)",
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              size={focused ? 34 : 26}
              route={route}
            />
          ),
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIconStyle: styles.tabBarIcon,
        })}
      >
        <Tab.Screen
          name="Validate"
          component={Validate}
          options={{
            tabBarLabel: "Validate",
          }}
        />
        <Tab.Screen
          name="Purchase"
          component={Purchase}
          options={{
            tabBarLabel: "Purchase",
          }}
        />
        <Tab.Screen
          name="Tokens"
          component={Tokens}
          options={{
            tabBarLabel: "Tokens",
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#2272C3",
    height: 60,
  },
  tabBarLabel: {
    fontFamily: "Poppins-Regular",
  },
  tabBarIcon: {
    marginTop: 6,
  },
});

export default App;
