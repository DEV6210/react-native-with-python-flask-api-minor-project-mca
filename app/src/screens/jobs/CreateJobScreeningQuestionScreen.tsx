import React, { useState } from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { Color } from '../../../GlobalStyles';

const CreateJobScreeningQuestionScreen = ({ navigation, route }) => {

  const [options, setOptions] = useState(['']);
  const addAnotherOption = () => {
    setOptions([...options, '']); // Add an empty string as a new option
  };
  const removeOption = (indexToRemove) => {
    setOptions(options.filter((_, index) => index !== indexToRemove));
  };
  const handleOptionChange = (text, index) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };

  // Function to handle navigation
  const handleNavigation = () => {
    // Assuming `options` is your state variable
    if (options.some(option => option.trim() !== '')) {
      // Navigate to the next screen with `options` data
      navigation.navigate('FinalJobPostScreen', {
        data:
        {
          screeningQuestions: options,
          ...route.params
        }
      });
    } else {
      // Navigate to the next screen with an empty array
      navigation.navigate('FinalJobPostScreen', {
        data:
        {
          screeningQuestions: [],
          ...route.params
        }
      });
    }
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{
        backgroundColor: "#fff",
        height: 50,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 5,
        elevation: 2

      }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Pressable onPress={() => { navigation.goBack() }} >
            <Icon name="chevron-back-outline" size={24} color={Color.gray950} />
          </Pressable>
          <Text style={{ fontSize: 18, fontWeight: "500" }}>Create Job</Text>
        </View>
        <View style={{ marginRight: 5 }}>
          <TouchableOpacity onPress={() => { handleNavigation() }} style={{
            height: 36, width: 74,
            borderWidth: 1,
            borderColor: '#3777B5', justifyContent: "center", alignItems: "center", borderRadius: 99
          }} >
            <Text style={{ color: "#3777B5", fontWeight: "500" }} >Next</Text>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>

            <ScrollView style={{ flex: 1 }} >
              <View style={{ flexDirection: "column", gap: 5 }}>

                <Text style={{ marginTop: 20, fontWeight: "700", fontSize: 18, marginBottom: 20, marginHorizontal: 5 }} >Screening Questions </Text>


                <View style={{ marginHorizontal: 5, gap: 15 }} >
                  {options.map((option, index) => (
                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <View style={{ width: "100%" }}>
                        <TextInput
                          placeholder={`Option ${index + 1}`}
                          style={styles.textInput}
                          value={option}
                          onChangeText={(text) => handleOptionChange(text, index)}
                        />
                        {
                          index > 0 ?
                            <TouchableOpacity style={{ alignSelf: "flex-end", marginRight: 5 }} onPress={() => removeOption(index)}>
                              <Text style={{ color: '#da3e37', fontWeight: "700" }}>Remove</Text>
                            </TouchableOpacity>
                            : ""
                        }
                      </View>
                    </View>

                  ))}


                  <TouchableOpacity style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#3777B5",
                    height: 36,
                    borderRadius: 99
                  }}
                    onPress={addAnotherOption}
                  >
                    <Icon name="add" size={25} color={"#fff"} />
                    <Text style={{ fontSize: 16, color: "#fff", fontWeight: "500" }} >Add Another</Text>
                  </TouchableOpacity>

                  {/* <TouchableOpacity style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#EAECF0",
                    height: 36,
                    borderRadius: 99
                  }}
                    onPress={() => { navigation.navigate("SettingScreen") }}
                  >
                    <Text style={{ fontSize: 16, color: Color.gray950, fontWeight: "500" }} >Discard Post</Text>
                  </TouchableOpacity> */}

                </View>

              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 10,
    flex: 1,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Color.gray200,
    borderRadius: 4,
    paddingHorizontal: 15
  }
})

export default CreateJobScreeningQuestionScreen