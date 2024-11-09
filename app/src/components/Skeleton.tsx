import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const Skeleton = () => {
  return (
    // linkdin theme background >>> color: e8e6e0
    // facebook theme background >>> color: cbcdd2
    // <View style={styles.SkeletonCard}>
    //   <View style={styles.headers}>
    //     <ShimmerPlaceHolder style={styles.profileIcon} />
    //     <View style={styles.headerContents} >
    //       <ShimmerPlaceHolder style={styles.title1} />
    //       <ShimmerPlaceHolder style={styles.title2} />
    //       <ShimmerPlaceHolder style={styles.title2} />
    //     </View>
    //   </View>

    //   <View style={styles.bio}>
    //     <ShimmerPlaceHolder style={styles.bio1} />
    //     <ShimmerPlaceHolder style={styles.bio1} />
    //   </View>

    //   <ShimmerPlaceHolder style={styles.post} />

    //   <View style={styles.reactions} >
    //     <ShimmerPlaceHolder style={styles.reaction1} />
    //     <ShimmerPlaceHolder style={styles.reaction2} />
    //     <ShimmerPlaceHolder style={styles.reaction3} />
    //   </View>

    //   <View style={styles.bottom} >
    //     <View style={styles.bottomLeft}>
    //       <ShimmerPlaceHolder style={styles.circle} />
    //       <ShimmerPlaceHolder style={styles.circle} />
    //       <ShimmerPlaceHolder style={styles.circle} />
    //     </View>
    //     <ShimmerPlaceHolder style={styles.circle} />
    //   </View>
    // </View>

    <View
      style={{
        // height: ,
        backgroundColor: '#fff',
        marginHorizontal: 8,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#E5E8E7',
        borderRadius: 10,
        padding: 10
      }} >
      <ShimmerPlaceHolder style={{ fontWeight: '500', fontSize: 16, color: '#2D3036', width: '100%' }} />
      <ShimmerPlaceHolder style={{
        backgroundColor: '#F7F8FA',
        marginTop: 5,
        height:100,
        width:"100%"
      }} />

      <View>
        <ShimmerPlaceHolder style={{ fontSize: 10, color: '#888', width: 100, marginTop: 5 }} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  SkeletonCard: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    marginTop: 4,
  },
  // header section
  headers: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginVertical: 15,
    gap: 10,
    alignItems: "center"
  },
  profileIcon: {
    height: 55,
    width: 55,
    backgroundColor: "#EDEDED",
    borderRadius: 99
  },
  headerContents: {
    flex: 1,
    gap: 5
  },
  title1: {
    height: 20,
    width: 199,
    backgroundColor: "#EDEDED",
    borderRadius: 4
  },
  title2: {
    height: 10,
    width: 91,
    backgroundColor: "#EDEDED",
    borderRadius: 4,
  },
  // bio section
  bio: {
    alignItems: "center",
    gap: 6
  },
  bio1: {
    height: 12,
    width: 318,
    backgroundColor: "#EDEDED",
    borderRadius: 4,
  },
  post: {
    height: 213,
    width: "100%",
    backgroundColor: "#EDEDED",
    marginVertical: 15
  },
  //reaction section
  reactions: {
    flexDirection: "row",
    gap: 15,
    marginHorizontal: 15
  },
  reaction1: {
    height: 12,
    width: 66,
    backgroundColor: "#EDEDED",
    borderRadius: 24
  },
  reaction2: {
    height: 12,
    width: 87,
    backgroundColor: "#EDEDED",
    borderRadius: 24
  },
  reaction3: {
    height: 12,
    width: 45,
    backgroundColor: "#EDEDED",
    borderRadius: 24
  },
  // bottom section 
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginVertical: 12
  },
  bottomLeft: {
    flexDirection: "row",
    gap: 10
  },
  circle: {
    height: 40,
    width: 40,
    borderRadius: 999,
    backgroundColor: "#EDEDED"
  }
})
export default Skeleton