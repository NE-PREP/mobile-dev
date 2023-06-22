import React, { useEffect, useState } from "react";
import { loadFonts } from "./src/utils/FontLoader";
import { NavigationContainer } from "@react-navigation/native";
import AppStack from "./src/navigation";
import Spinner from "./src/components/spinner"; // Import the custom spinner component
import { setCustomText } from "react-native-global-props";

const App = () => {
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
  else{
    const customTextProps = {
      style: {
        fontFamily: "Poppins-Italic",
      },
    };
    setCustomText(customTextProps);
  }



  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
};

export default App;
