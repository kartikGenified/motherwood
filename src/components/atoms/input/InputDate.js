import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import DatePicker from "react-native-date-picker";
import DateIcon from "react-native-vector-icons/MaterialIcons";
import PoppinsTextMedium from "../../electrons/customFonts/PoppinsTextMedium";
import dayjs from "dayjs";

const InputDate = (props) => {
  // Initialize date with the current date
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(false);
  const preventEighteen = props.preventEighteen;
  const { data, title, minDate } = props;
  const required = props.required;
  console.log("date in edit profile", props.value);
  useEffect(() => {
    // Format the current date and send it to the parent component
    const formattedDate = dayjs(date).format("YYYY/MM/DD");
    console.log("date of today", formattedDate);
    setDate(new Date());
    handleInputEnd(new Date(), title);
  }, []);

  const isValidDate = (dateString) => {
    const d = new Date(dateString);
    return d instanceof Date && !isNaN(d);
  };
  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );

  const handleInputEnd = (date, title) => {
    console.log(date, title);
    let tempJsonData = {
      ...props.jsonData,
      value: dayjs(date).format("YYYY/MM/DD"),
    };
    props.handleData(tempJsonData);
  };

  // console.log("JSSSS",props.jsonData)

  return (
    <TouchableOpacity onPress={() => setOpen(true)} style={styles.container}>
      {selected ? (
        <PoppinsTextMedium
          style={styles.text}
          content={dayjs(date).format("YYYY/MM/DD")}
        />
      ) : props.value ? (
        <PoppinsTextMedium
          style={styles.text}
          content={
            data === null
              ? "Please select date"
              : dayjs(props.value).format("YYYY/MM/DD")
          }
        />
      ) : (
        <PoppinsTextMedium
          style={styles.text}
          content={
            data === null
              ? "Please select date"
              : dayjs(date).format("YYYY/MM/DD")
          }
        />
      )}

      <Text style={{ color: "black", marginLeft: "30%" }}>
        {props?.jsonData?.label} {required ? "*" : ""}
      </Text>
      <View style={styles.icon}>
        <DateIcon name="date-range" color="#DDDDDD" size={30} />
      </View>
      <DatePicker
        modal
        open={open}
        date={
          isValidDate(props.value)
            ? new Date(props.value)
            : preventEighteen
            ? eighteenYearsAgo
            : date
        }
        mode="date"
        maximumDate={preventEighteen ? eighteenYearsAgo : new Date()}
        minimumDate={
          minDate && isValidDate(minDate)
            ? new Date(minDate)
            : new Date(1900, 0, 1) // a safe very early date
        }
        onConfirm={(date) => {
          setSelected(true);
          setOpen(false);
          setDate(date);
          handleInputEnd(date, title);
        }}
        onCancel={() => {
          setOpen(false);
          setSelected(false);
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 54,
    width: "86%",
    backgroundColor: "#0000000D",
    borderRadius: 2,
    borderColor: "#DDDDDD",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    margin: 20,
  },
  text: {
    position: "absolute",
    left: 20,
    color: "black",
  },
  icon: {
    position: "absolute",
    right: 10,
  },
});

export default InputDate;
