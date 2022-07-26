import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from 'axios';

import { Button, FormControl, Input, InputLabel, Switch, Typography, FormControlLabel} from '@material-ui/core';
import "./onboardingForm.css";

const OnboardingForm = ({ user }) => {
     const history = useHistory();
     
     const [isLoggedIn, setIsLoggedIn] = useState(false);
     const [userData, setUserData] = useState({});
     const [onbordingSteps, setOnboardingSteps] = useState([]);
     const [approveButtonToAction, setApproveButtonToAction] = useState(false);
     const [currentStep, setCurrentStep] = useState(0);
     
     // const [error, setError] = useState('');
     // const errorRef = useRef(null);
     
     useEffect(() => {
          if (user?.isFetching) return;

          if (user && user.id) {
               setIsLoggedIn(true);
               setUserData(user);
               getOnboardingSteps(user);
             } else {
               if (isLoggedIn) history.push("/login");
               else history.push("/register");
             }
     },[user, history, isLoggedIn]);

     const getOnboardingSteps = async (user) => {
          try {
               const { data } = await axios.get("/api/onboarding", user);
               const commbineData = data.steps.flatMap(item => item);
     
               const modifiedData = commbineData.map(item => {
                    if(item.name === "firstName"){
                         return { ...item, default: "John" }
                    }
     
                    if(item.name === "lastName"){
                         return { ...item, default: "Doe" }
                    }
                    
                    if(item.name === "country"){
                         return { ...item, default: "Canada" }
                    }
     
                    if(item.name === "bio"){
                         return { ...item, default: "Type text here ..." }
                    }
     
                    return item
               }); 
     
               swapArrayItems(modifiedData, "country", "lastName");
               setOnboardingSteps(modifiedData);
          } catch (error) {
               console.log(error)
          }
     }

     const findIndex = (arr, value) => {
          return arr.findIndex(i => i.name === value);
     }

     const swapArrayItems = (arr, itemToSwap, placeAfterThisItem ) => {
          const swapIndex = findIndex(arr, itemToSwap);
          const afterItem = findIndex(arr, placeAfterThisItem);
          const saveItemToSwap = arr[swapIndex];
          arr.splice(swapIndex, 1);
          arr.splice(afterItem + 1, 0, saveItemToSwap);
     }

     const handleInputChange = (e) => {
          e.preventDefault();
          const { name, value } = e.target;
          setUserData({ ...userData, [name]: value });
     }

     const handleSwitchChange = (e) => {
          const { name } = e.target;
          if(userData[name] === null){
               setUserData({ ...userData, [name]: true });
          } else {
               setUserData({ ...userData, [name]: !userData[name] });
          }
     }

     useEffect(() => {
          if (userData, currentStep, onbordingSteps){
               testRequiredInputs()
          }
     });
     
     const testRequiredInputs = () => {
          let result = false;
          const arrToTest = onbordingSteps?.slice(currentStep, currentStep + 4).filter(item => 
               item.required
          ).map(item => 
               userData[item.name] !== null ? true : false
          );
          
          if(arrToTest.length > 0){
               result = arrToTest.every(e => e === true)
          }

          if (!result){
               setApproveButtonToAction(true)
          } else {
               setApproveButtonToAction(false)
          }
     }
     
     const handleSubmit = (e) => {
          e.preventDefault();
          const updatedUserData = ({ ...userData, completedOnboarding: true});
          console.log(updatedUserData);
          history.push("/home");
     }

     return (
          <div className="formContainer">
               <form className="onboardingForm" onSubmit={ handleSubmit }>
                    { 
                         userData && onbordingSteps 
                              ? onbordingSteps?.slice(currentStep, currentStep + 4).map((data, index) => {
                                   return (
                                        <FormControl required={data.required ? true : false} fullWidth margin="normal" key={ data.name }>
                                             { data.type === "yes-no" ?
                                                  <FormControlLabel
                                                       sx={{ display: 'block' }}
                                                       control={
                                                            <Switch
                                                                 onChange={handleSwitchChange}
                                                                 name={data.name}
                                                                 color="primary"
                                                            />
                                                       }
                                                       label={data.label + `${data.required ? " *" : ""}`}
                                                  />
                                                  : <>
                                                       <InputLabel htmlFor={ data.name } focused={ false }>{ data.label }</InputLabel>
                                                       <Input
                                                            sx={{ width: "100%", fontSize: "14px" }}
                                                            autoFocus={ index === 0 ? true : false }
                                                            id={ data.name }
                                                            name={ data.name }
                                                            value={ userData[data.name] === null ? data.default : userData[data.name] }
                                                            variant="standard"
                                                            multiline={ data.type === "multiline-text" ? true : false }
                                                            minRows={ data.type === "multiline-text" ? 4 : 1 }
                                                            onChange={ handleInputChange }
                                                            // ref={ errorRef }
                                                       />
                                                  </>
                                             }
                                        </FormControl>
                                   )
                         })
                              : <p>Loading ... </p>
                    }
                    { approveButtonToAction 
                         ? <Typography style={{ color: "#FF3A3A", fontSize: "12px" }}>Please fill out all required fields before proceeding</Typography>
                         : false
                    }
                    <div className="btnContainer">
                         { currentStep >= 4
                              ? <Button 
                                   onClick={ () => setCurrentStep(currentStep - 4) } 
                                   variant="contained"
                                   color="primary"
                                   >Back</Button>
                              : false
                         }
                         { currentStep < (onbordingSteps.length - 1) - currentStep
                              ? <Button 
                                   onClick={ () => setCurrentStep(currentStep + 4) } 
                                   disabled={ approveButtonToAction ? true : false }
                                   variant="contained" 
                                   color="primary" 
                                   style={{ gridColumn: "4 / -1"}}>Next</Button>
                              : false
                         }
                         {  currentStep >= (onbordingSteps.length - 1) - currentStep
                              ? <Button 
                                   disabled={ approveButtonToAction ? true : false }
                                   type="submit"
                                   variant="contained" 
                                   color="primary" 
                                   style={{ gridColumn: "4 / -1"}}>Finish</Button>
                              : false
                         }
                    </div>
               </form> 
          </div>
     )
}

export default OnboardingForm;