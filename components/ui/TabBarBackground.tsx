const {
  withNativeWind: withNativeWind
} = require("nativewind/metro");

// This is a shim for web and Android where the tab bar is generally opaque.
export default undefined;

export function useBottomTabOverflow() {
  return 0;
}