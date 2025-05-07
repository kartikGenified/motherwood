import {
  setIsGenuinityOnly,
  setProgram,
  setWorkflow,
} from "../slices/appWorkflowSlice";
import { setApiCallStatus } from "../slices/splashApiCallsSlice";

export const getWorkflowCachedDispatch = async (dispatch, getWorkflowData) => {
  console.log("getWorkflowCachedDispatch", getWorkflowData);
  if (getWorkflowData?.length === 1 && getWorkflowData[0] === "Genuinity") {
    dispatch(setIsGenuinityOnly());
  }
  const removedWorkFlow = getWorkflowData?.body[0]?.program.filter(
    (item, index) => {
      return item !== "Warranty";
    }
  );
  console.log("getWorkflowData", getWorkflowData);
  dispatch(setProgram(removedWorkFlow));
  dispatch(setWorkflow(getWorkflowData?.body[0]?.workflow_id));
  await dispatch(setApiCallStatus("getWorkflowData"));
};
