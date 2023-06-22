import React, { useState } from "react";
import {
  Text,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialIcons, Feather, AntDesign } from "@expo/vector-icons";
import * as Yup from "yup";
import { useFormik } from "formik";
import tw from "twrnc";

import Button from "../../../components/button";
import Input from "../../../components/input";
import API_URL, { sendRequest } from "../../../config/api";

const SignUp = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fields = [
    {
      icon: <MaterialIcons name="person-outline" size={24} color="silver" />,
      placeholder: "Firstname",
      value: "firstname",
      secure: false,
      required: true,
    },
    {
      icon: <MaterialIcons name="person-outline" size={24} color="silver" />,
      placeholder: "Lastname",
      value: "lastname",
      secure: false,
      required: true,
    },
    {
      icon: <MaterialIcons name="smartphone" size={24} color="silver" />,
      placeholder: "Phone",
      value: "phone",
      secure: false,
      type: "number-pad",
      required: true,
    },
    {
      icon: <AntDesign name="idcard" size={24} color="silver" />,
      placeholder: "National id",
      value: "nationalId",
      secure: false,
      type: "number-pad",
      required: true,
    },
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
    firstname: Yup.string().required("Firstname is required"),
    lastname: Yup.string().required("Lastname is required"),
    phone: Yup.string()
      .matches(/^\d+$/, "Phone must contain only numerical characters")
      .required("Phone is required")
      .min(10, "Phone must be 10 characters")
      .max(10, "Phone must be 10 characters"),
    nationalId: Yup.string()
      .matches(/^\d+$/, "National id must contain only numerical characters")
      .required("NationalId is required")
      .min(16, "National id must be 16 characters")
      .max(16, "National id must be 16 characters"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be 6 characters"),
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
        API_URL + "/users/voter/register",
        "POST",
        values
      );
      if (response?.data?.status == 201) {
        setLoading(false);
        navigation.navigate("Login");
        resetForm();
      } else {
        return setError(
          response?.data?.message || "Error occurred while registering"
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
              <Text
                style={[styles.text, tw`text-[#b5b4b3] text-center text-xl`]}
              >
                Register
              </Text>
            </View>

            {error.length > 0 && (
              <Text style={tw`mt-4 text-red-500 text-center`}>{error}</Text>
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
                    style={tw`w-full p-[10] mt-4`}
                    onPress={handleSubmit}
                    disabled={isAnyFieldEmpty || loading || !formik.isValid}
                  >
                    {loading ? "Registering..." : "Register"}
                  </Button>

                  <TouchableOpacity
                    onPress={() => navigation.navigate("Login")}
                  >
                    <View style={tw`mt-4`}>
                      <Text
                        style={[
                          styles.text,
                          tw`text-base underline text-gray-500`,
                        ]}
                      >
                        Already have an account? Login
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
export default SignUp;
