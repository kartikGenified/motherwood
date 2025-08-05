import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();
export const pendingNavigations = [];

let isReady = false;

export function setNavigationReady() {
  console.log("navogating to jkasdhjasjdjhas", pendingNavigations)

  isReady = true;
  pendingNavigations.forEach(({ name, params }) => {
    setTimeout(() => {
      navigationRef.navigate(name, params);
      
    }, 8000);
      
  });
  pendingNavigations.length = 0;
}

export function navigate(name, params) {
  console.log("navigate hitted")
  if (isReady && navigationRef.isReady()) {
    console.log("navigation ref is ready", name,params)
    
    setTimeout(() => {
      navigationRef.navigate(name, params);
      
    }, 8000);
      
  } else {
    console.log("navigation ref is not ready", name,params)

    pendingNavigations.push({ name, params });
  }
}
