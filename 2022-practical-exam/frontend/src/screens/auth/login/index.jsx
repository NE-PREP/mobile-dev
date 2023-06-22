import React, { useState } from "react";
import {
  Text,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Yup from "yup";
import { useFormik } from "formik";
import tw from "twrnc";

import Button from "../../../components/button";
import Input from "../../../components/input";
import API_URL, { sendRequest } from "../../../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";

const Login = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fields = [
    {
      icon: <Feather name="mail" size={24} color="silver" />,
      placeholder: "Email",
      value: "email",
      secure: false,
      type: "email-address",
      required: true,
    },
    {
      icon: <Feather name="lock" size={24} color="silver" />,
      placeholder: "Password",
      value: "password",
      secure: true,
      required: true,
    },
  ];

  const initialValues = fields.reduce((acc, field) => {
    acc[field.value] = "";
    return acc;
  }, {});

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
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
        API_URL + "/users/login",
        "POST",
        values
      );
      if (response?.data?.status == 200) {
        setLoading(false);
        const token = response?.data?.data?.access_token;

        // Decode the JWT token
        const decodedToken = jwt_decode(token);
        const role = decodedToken?.role;

        if (role !== "voter") {
          resetForm();
          return setError("You are not authorized to access this app.");
        }
        await AsyncStorage.setItem("token", token);
        navigation.navigate("App");
        resetForm();
      } else {
        return setError(
          response?.data?.message || "Error occurred while logging in"
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
            <View style={tw`w-full`}>
              <Text
                style={[
                  styles.textBold,
                  tw`text-[#2272C3] font-bold text-2xl text-center`,
                ]}
              >
                Welcome to NEC Voting System
              </Text>
              <Text style={[styles.text,tw`text-[#b5b4b3] text-center text-xl`]}>Login</Text>
            </View>

            {error.length > 0 && (
              <Text style={[styles.text,tw`mt-4 text-red-500 text-center`]}>{error}</Text>
            )}
            <View style={tw`mt-8`}>
              <View style={tw`px-6 py-2`}>
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
                      <Text style={tw`text-red-500`}>
                        {errors[field.value]}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}

                <View style={tw`mt-8`}>
                  <Button
                    mode={"contained"}
                    style={[styles.text,tw`w-full p-[10] mt-4 text-2xl`]}
                    onPress={handleSubmit}
                    disabled={isAnyFieldEmpty || loading || !formik.isValid}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>

                  <TouchableOpacity
                    onPress={() => navigation.navigate("Register")}
                  >
                    <View style={tw`mt-4`}>
                      <Text style={[styles.text,tw`text-base underline text-gray-500`]}>
                        Don&rsquo;t have an account? Register
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
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
export default Login;
