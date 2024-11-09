import * as React from "react"
import Svg, { G, Path } from "react-native-svg"
const FeedIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        {...props}
    >
        <G fill="#888">
            <Path
                fillOpacity={0.5}
                d="M12.552 8a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2zm0 9a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2z"
            />
            <Path
                fillOpacity={0.8}
                d="M12.552 5a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2zm0 9a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2z"
            />
            <Path d="M3.448 4.002a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1zm0 8.996a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1z" />
        </G>
    </Svg>
)
export default FeedIcon
