import { setBannerData } from "../slices/dashboardDataSlice";
import { setApiCallStatus } from "../slices/splashApiCallsSlice";


export const getBannerCachedDispatch=async(dispatch,getBannerData)=>{
  console.log("getBannerCachedDispatch",getBannerData)
    const images = Object.values(getBannerData?.body).map((item) => {
        return item.image[0];
      });

      await dispatch(setBannerData(images));
      await  dispatch(setApiCallStatus("getBannerData"))

}