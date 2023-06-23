import React, { useState,useEffect } from "react";
import {
  Text,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  Clipboard,
  Dimensions, // Add this import
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Yup from "yup";
import { useFormik } from "formik";
import tw from "twrnc";
import { ToastAndroid } from "react-native";

import Button from "../../../components/button";
import Input from "../../../components/input";
import API_URL, { sendRequest } from "../../../config/api";
import { useIsFocused } from "@react-navigation/native";

const Tokens = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tokens, setTokens] = useState(null);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setTokens(null);
      resetForm()
    }
  }, [isFocused]);


  const fields = [
    {
      icon: <Ionicons name="keypad-outline" size={24} color="silver" />,
      placeholder: "Meter number",
      value: "meter_number",
      type: "default",
      secure: false,
      required: true,
    },
  ];

  const initialValues = fields.reduce((acc, field) => {
    acc[field.value] = "";
    return acc;
  }, {});

  const validationSchema = Yup.object().shape({
    meter_number: Yup.string()
      .length(6, "Meter number should be exactly 6 characters")
      .required("Meter number is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
  });

  const { handleChange, handleBlur, values, errors, touched, resetForm } =
    formik;

  const handleSubmit = async () => {
    try {
      const isValid = await validationSchema.isValid(values);
      if (!isValid) {
        try {
          validationSchema.validateSync(values, { abortEarly: false });
        } catch (errors) {
          const fieldErrors = {};
          errors.inner.forEach((error) => {
            fieldErrors[error.path] = error.message;
          });
          formik.setErrors(fieldErrors);
          return;
        }
      }
      setLoading(true);
      setError("");
      const response = await sendRequest(
        API_URL + `/purchased-tokens/by-meter-number/${values["meter_number"]}`,
        "GET"
      );
      if (response?.data?.status == 200) {
        setLoading(false);
        setTokens(response?.data?.data);
      } else {
        return setError(
          response?.data?.message || "Error occurred while purchasing token"
        );
      }
    } catch (error) {
      setLoading(false);
      return setError(
        error?.response?.data?.message || "An error occurred"
      );
    }
  };

  const isAnyFieldEmpty = fields.some(
    (field) => field.required && !values[field.value]
  );

  const handleCopyToken = (token) => {
    Clipboard.setString(token);
    ToastAndroid.show(`Token '${token}' copied to clipboard`, ToastAndroid.SHORT);
  };

  const windowHeight = Dimensions.get("window").height; // Get the window height

  return (
    <View style={tw`h-[100%] bg-white justify-end items-center`}>
      <SafeAreaView style={tw`h-[85%] w-full bg-white`}>
        <View>
          <Text
            style={[
              styles.textBold,
              tw`text-[#2272C3] font-bold text-xl text-center`,
            ]}
          >
            EUCL Electricity Purchasing System
          </Text>
          <Text style={[styles.text, tw`text-[#b5b4b3] text-center text-xl`]}>
            Get Tokens
          </Text>

          {error.length > 0 && (
            <Text style={[styles.text, tw`mt-4 text-red-500 text-center`]}>
              {error}
            </Text>
          )}

          <View style={tw`mt-8 px-6 py-2`}>
            {fields.map((field, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {}}
                activeOpacity={0.8}
                style={tw`py-2`}
              >
                <Input
                  Icon={field.icon}
                  placeholder={field.placeholder}
                  onChangeText={handleChange(field.value)}
                  onBlur={handleBlur(field.value)}
                  value={values[field.value]}
                  security={field.secure}
                  type={field?.type}
                  borderColor={
                    touched[field.value] && errors[field.value] ? "red" : "gray"
                  }
                />
                {touched[field.value] && errors[field.value] && (
                  <Text style={tw`text-red-500`}>{errors[field.value]}</Text>
                )}
              </TouchableOpacity>
            ))}

            <View style={tw`mt-1`}>
              <Button
                mode={"contained"}
                style={[styles.text, tw`w-full p-2 text-2xl`]}
                onPress={handleSubmit}
                disabled={isAnyFieldEmpty || loading || !formik.isValid}
              >
                {loading ? "Fetching..." : "Fetch"}
              </Button>
            </View>

            {tokens != null && tokens.length > 0 && (
              <ScrollView
                style={{ height: windowHeight * 0.4 }}
                contentContainerStyle={[tw`mt-8`, { paddingBottom: 40 }]}
              >
                <Text style={tw`text-center text-xl text-[#2272C3]`}>
                  Tokens Info
                </Text>
                {tokens.map((info, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleCopyToken(info.token)}
                    activeOpacity={0.8}
                    style={tw`mt-4 bg-gray-100 p-4 rounded-lg`}
                  >
                    <Text style={[styles.text, tw`text-center text-lg`]}>
                      <Text style={tw`font-bold`}>Token:</Text> {info.token}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
            {tokens != null && tokens.length === 0 && (
              <View style={tw`mt-8`}>
                <Text style={tw`text-center text-xl text-[#2272C3]`}>
                  No tokens found
                </Text>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "Poppins-Regular",
  },
  textBold: {
    fontFamily: "Poppins-Bold",
  },
});

export default Tokens;
