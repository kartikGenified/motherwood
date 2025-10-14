import dayjs from "dayjs";
import React from "react";
import { Image, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  Pagination
} from "react-native-reanimated-carousel";
import Close from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";

const EventModal = (props) => {

  const {selectedEvent, modalVisible, setModalVisible} = props
  const secondaryThemeColor = useSelector(state=>state.apptheme.secondaryThemeColor)
  const ternaryThemeColor = useSelector(state=>state.apptheme.ternaryThemeColor)

 const ref = React.useRef(null);
  const progress = useSharedValue(0);

  const onPressPagination = (index) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };
 

    return (
      <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={{width:'100%',height:'100%', backgroundColor:'rgba(0,0,0,0.5)', alignItems:'center', justifyContent:'center'}}>
        <TouchableOpacity onPress={() => setModalVisible(false)}
        style={{ width:'100%', 
          alignItems:'flex-end',
          paddingRight:20
        }}
          >
          <Close name="close" size={35} color="#ffffff" /> 
        </TouchableOpacity>
        <View style={{width:'90%',  backgroundColor:secondaryThemeColor, borderRadius:20, alignItems:'center', padding:10}}>
        <Carousel
        ref={ref}
        width={300}
        height={300}
        data={selectedEvent?.images}
        loop={false}
        onProgressChange={progress}
        renderItem={({item}) => {
          console.log('imge', item)
          
          return(
          <Image
          style={{height:300, width:'100%', resizeMode: 'contain' }}
          source={{uri:item}}
          />
        )}}
      />
 
      <Pagination.Basic
        progress={progress}
        data={selectedEvent?.images}
        dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 50 }}
        containerStyle={{ gap: 5, marginTop: 10 }}
        onPress={onPressPagination}
      />
          
          <View
          style={{
            backgroundColor:ternaryThemeColor,
            width: '100%',
            borderRadius: 10,
            padding: 10,
          }}
          >
            <PoppinsTextMedium style={{color:'white'}} content={selectedEvent?.title} />
            <PoppinsTextLeftMedium style={{color:'white'}} content={selectedEvent?.description} />
            <PoppinsTextLeftMedium style={{color:'white'}} content={selectedEvent?.created_by_name ? `Created By : ${selectedEvent.created_by_name}` : ""} />
            <PoppinsTextLeftMedium style={{color:'white'}} content={selectedEvent?.start_date ? `Start Date : ${new dayjs(selectedEvent.start_date).format('DD MMM YYYY')}` : ""} />
            <PoppinsTextLeftMedium style={{color:'white'}} content={selectedEvent?.end_date ? `End Date : ${new dayjs(selectedEvent.end_date).format('DD MMM YYYY')}` : ""} />
          </View>
        </View>
      </View>
    </Modal>
    )
  }
const styles = StyleSheet.create({});

export default EventModal;