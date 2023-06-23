import React, { useState,useEffect } from "react";
import {
  Text,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Octicons } from "@expo/vector-icons";
import * as Yup from "yup";
import { useFormik } from "formik";
import tw from "twrnc";

import Button from "../../../components/button";
import Input from "../../../components/input";
import API_URL, { sendRequest } from "../../../config/api";
import { useIsFocused } from "@react-navigation/native";

const Validate = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tokenData, setTokenData] = useState({});

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setTokenData({});
      resetForm()
    }
  }, [isFocused]);

  const fields = [
    {
      icon: <Octicons name="number" size={24} color="silver" />,
      placeholder: "Token",
      value: "token",
      secure: false,
      type: "number-pad",
      required: true,
    }
  ];

  const initialValues = fields.reduce((acc, field) => {
    acc[field.value] = "";
    return acc;
  }, {});

  const validationSchema = Yup.object().shape({
    token: Yup.string()
      .length(8, "Token should be 8 characters")
      .required("Token is required"),
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
        API_URL + `/purchased-tokens/validate/${values["token"]}`,
        "GET"
      );
      if (response?.data?.status == 200) {
        setLoading(false);
        setTokenData(response?.data?.data);
        resetForm();
      } else {
        return setError(
          response?.data?.message || "Error occurred while validating the token"
        );
      }
    } catch (error) {
      setLoading(false);
      return setError(error?.response?.data?.message || "An error occurred");
    }
  };

  const isAnyFieldEmpty = fields.some(
    (field) => field.required && !values[field.value]
  );

  return (
    <View style={tw`h-[100%] bg-white justify-end items-center`}>
      <SafeAreaView style={tw`h-[85%] w-full bg-white`}>
        <ScrollView>
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
              Validate
            </Text>

            {error.length > 0 && (
              <Text style={[styles.text, tw`mt-4 text-red-500 text-center`]}>
                {error}
              </Text>
            )}

            {success.length > 0 && (
              <Text style={[styles.text, tw`mt-4 text-green-500 text-center`]}>
                {success}
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
                      touched[field.value] && errors[field.value]
                        ? "red"
                        : "gray"
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
                  {loading ? "Validating..." : "Validate"}
                </Button>
              </View>

              {Object.keys(tokenData).length > 0 && (
                <View style={tw`mt-8`}>
                  <Text style={tw`text-center text-xl text-[#2272C3]`}>
                    Token Information
                  </Text>
                  <View style={tw`mt-4 bg-gray-100 p-4 rounded-lg`}>
                    <Text style={[styles.text, tw`text-center text-lg`]}>
                      <Text style={tw`font-bold`}>Token:</Text>{" "}
                      {tokenData.token}
                    </Text>
                  </View>
                  <View style={tw`mt-4 bg-gray-100 p-4 rounded-lg`}>
                    <Text style={[styles.text, tw`text-center text-lg ${tokenData.days < 1 && 'text-red-500'}`]}>
                      <Text style={tw`font-bold`}>Days:</Text>{" "}
                      {tokenData.days > 0 ?`${tokenData.days} days` : "Expired"}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
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

export default Validate;
