import * as React from "react"
import Svg, { Path } from "react-native-svg"
const PostIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <Path
      fill="currentColor"
      d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h9v2H5v14h14v-9h2v9q0 .825-.587 1.413T19 21zm3-4v-2h8v2zm0-3v-2h8v2zm0-3V9h8v2zm9-2V7h-2V5h2V3h2v2h2v2h-2v2z"
    />
  </Svg>
)
export default PostIcon