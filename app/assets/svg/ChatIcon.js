import * as React from "react"
import Svg, { G, Path } from "react-native-svg"
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    {...props}
  >
    <G
      fill="none"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      color="#000"
    >
      <Path d="M13.5 3.034a33 33 0 0 0-3.67.037c-4.184.278-7.516 3.657-7.79 7.9a20 20 0 0 0 0 2.52c.1 1.545.783 2.976 1.588 4.184.467.845.159 1.9-.328 2.823-.35.665-.526.997-.385 1.237.14.24.455.248 1.084.263 1.245.03 2.084-.322 2.75-.813.377-.279.566-.418.696-.434s.387.09.899.3c.46.19.995.307 1.485.34 1.425.094 2.914.094 4.342 0 4.183-.278 7.515-3.658 7.789-7.9q.031-.492.038-.991M8.5 15h7m-7-5H12" />
      <Path d="M16 7.5c.491.506 1.8 2.5 2.5 2.5M21 7.5c-.491.506-1.8 2.5-2.5 2.5m0 0V2" />
    </G>
  </Svg>
)
export default SvgComponent
