// import * as React from "react"
// import Svg, { G, Path } from "react-native-svg"
// const JobIcons = (props) => (
//   <Svg
//     xmlns="http://www.w3.org/2000/svg"
//     width="1rem"
//     height="1rem"
//     viewBox="0 0 50 50"
//     {...props}
//   >
//     <G fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
//       <Path
//         stroke="#fff"
//         d="M31.25 22.917v4.166m2.083-12.5H16.667v-6.25A2.083 2.083 0 0 1 18.75 6.25h12.5a2.083 2.083 0 0 1 2.083 2.083zm2.084 8.334H14.583z"
//       />
//       <Path
//         stroke="#fff"
//         d="M43.75 41.667v-25a2.084 2.084 0 0 0-2.083-2.084H8.333c-1.15 0-2.083.933-2.083 2.084v25c0 1.15.933 2.083 2.083 2.083h33.334c1.15 0 2.083-.933 2.083-2.083"
//       />
//     </G>
//   </Svg>
// )
// export default JobIcons

import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width="1rem"
    height="1rem"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      fill={'#888'}
      d="M19 6.5h-3v-1a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3v1H5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3m-9-1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h-4Zm10 13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5.05h3v1.05a1 1 0 0 0 2 0v-1.05h6v1.05a1 1 0 0 0 2 0v-1.05h3Zm0-7H4v-2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1Z"
    />
  </Svg>
)
export default SvgComponent

