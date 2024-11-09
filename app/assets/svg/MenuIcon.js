import * as React from "react"
import Svg, { Path } from "react-native-svg"
const MenuIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      fill="none"
      stroke="#888"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M4 12h16M4 6h16M4 18h16"
    />
  </Svg>
)
export default MenuIcon
