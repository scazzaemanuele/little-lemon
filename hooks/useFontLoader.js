import { useFonts } from "expo-font";

export function useFontLoader() {
  const [fontsLoaded] = useFonts({
    "Markazi-Regular": require("../assets/fonts/markazi/MarkaziText-Regular.ttf"),
    "Markazi-Medium": require("../assets/fonts/markazi/MarkaziText-Medium.ttf"),
    "Markazi-SemiBold": require("../assets/fonts/markazi/MarkaziText-SemiBold.ttf"),
    "Markazi-Bold": require("../assets/fonts/markazi/MarkaziText-Bold.ttf"),
    "Karla-Regular": require("../assets/fonts/karla/Karla-Regular.ttf"),
    "Karla-Medium": require("../assets/fonts/karla/Karla-Medium.ttf"),
    "Karla-SemiBold": require("../assets/fonts/karla/Karla-SemiBold.ttf"),
    "Karla-Bold": require("../assets/fonts/karla/Karla-Bold.ttf"),
    "Karla-ExtraBold": require("../assets/fonts/karla/Karla-ExtraBold.ttf"),
  });

  return [fontsLoaded];
}
