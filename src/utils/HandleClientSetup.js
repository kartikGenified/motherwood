//Thanks to Karik for this Setup (The Half Blood Prince)

//clint ID's
export const clientName = "sudama";
export const clientID = 41;
export const clientOfficialName = "MotherWood"
export const baseUrl =  "http://saas-api-dev.genefied.in/"
// "https://saas.genefied.in/" production
// "http://saas-api-dev.genefied.in/" staging
//icons and images
export const appIcon = require("../../assets/images/motherwood_white_logo.png");
export const splash = require("../../assets/gif/Splash-myronew.gif");
export const supplyUrl = "https://supplybeam.genefied.in/api"
export const descriptionImages = [
  // require("../../assets/images/Step1.png"),
  require("../../assets/images/Step2.png"),
  // require("../../assets/images/Step3.png"),
  // require("../../assets/images/Step4.png"),
  // require("../../assets/images/Step5.png")
];

//Change loaderNew Manually By Simply Replacing images

//Registration
export const RegistrationMessage = `Thank you for joining ${clientOfficialName} Loyalty program`;
export const permissionMessage = `To scan the QR code, the ${clientOfficialName} app must have access permissions. Please grant access to the camera`
export const eKyc = true;  // send true if you want to call aadhar gst and pan api else false


//Dashboard
export const needCaimpaign = __DEV__ ? true : true;

export const scannerType = "qr"; //"qr for qr", "bar for bar

// choose from ["points", "scanned", "redeemed", "cashback","coupon", "warranty", "wheel","previous transaction","wheel","shared"]
export const neededHistory = [
  "points",
  "scanned",
  "redeemed",
  "coupon",
  "cashback"
];

export const showEditProfile = true;

export const needWalkedThrough = true

export const needRandomRedeemPoint = true

export const redeemptionItems = ["gift", "cashback","coupon" ]; // choose from -->  ["gift", "cashback","coupon"]
