import { LogBox } from "react-native";

// Suprimir avisos específicos que não afetam a funcionalidade
LogBox.ignoreLogs([
  "SafeAreaView has been deprecated",
  "VirtualizedLists should never be nested",
]);
