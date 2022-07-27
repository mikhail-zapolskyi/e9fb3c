import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from 'axios';

import { Button, FormControl, Input, InputLabel, Switch, Typography, FormControlLabel} from '@material-ui/core';
import "./onboardingForm.css";

const OnboardingForm = ({ user }) => {
     const history = useHistory();
     
     const [isLoggedIn, setIsLoggedIn] = useState(false);
     const [userData, setUserData] = useState({firstName: "", lastName: "", country: "", bio: "", receiveUpdates: false, receiveNotifications: false});
     const [onbordingSteps, setOnboardingSteps] = useState([]);
     const [approveButtonToAction, setApproveButtonToAction] = useState(false);
     const [currentStep, setCurrentStep] = useState(0);
     const [nonModifiedSteps, setNonModifiedSteps] = useState({});
     const [error, setError] = useState("Please fill out all required fields before proceeding");
     
     useEffect(() => {
          if (user?.isFetching) return;

          if (user && user.id) {
               setIsLoggedIn(true);
               getOnboardingSteps(user);
             } else {
               if (isLoggedIn) history.push("/login");
               else history.push("/register");
             }
             // eslint-disable-next-line
     },[user, history, isLoggedIn]);

     const getOnboardingSteps = async (user) => {
          try {
               const { data } = await axios.get("/api/onboarding", user);
               setNonModifiedSteps(data);

               const commbineData = data.steps.flatMap(item => item);
     
               const modifiedData = commbineData.map(item => {
                    const { name } = item;
                    
                    if(name === "firstName"){
                         setUserData({ ...userData, [name]: "" })
                         return { ...item, default: "John" }
                    }
     
                    if(name === "lastName"){
                         return { ...item, default: "Doe" }
                    }
                    
                    if(name === "country"){
                         return { ...item, default: "Canada" }
                    }
     
                    if(name === "bio"){
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

     const testRequiredInputs = () => {
          let result = false;
          const arrToTest = onbordingSteps?.slice(currentStep, currentStep + 4)
               .filter(item => item.required)
               .map(item => userData[item.name] !== "" ? true : false);
                    
          if(arrToTest.length > 0){
               result = arrToTest.every(e => e === true)
          }
                    
          if (!result){
               setApproveButtonToAction(true)
          } else {
               setApproveButtonToAction(false)
          }
     }
     
     useEffect(() => {
          // eslint-disable-next-line
          if (userData, currentStep, onbordingSteps){
               testRequiredInputs()
          }
     });
               
     const updateOnboarding = async (sendData) => {
          try {
               const { data } = await axios.post("/api/onboarding/update", sendData);
               if(data.completedOnboarding === true){
                    setUserData({firstName: "", lastName: "", country: "", bio: "", receiveUpdates: false, receiveNotifications: false})
                    history.go(0)
               }
          } catch (error) {
               setError( error.response.data.message[0]);
               setTimeout(() => {
                    setError("")
               }, 3000);
          }
     }

     const handleInputChange = (e) => {
          e.preventDefault();
          const { name, value } = e.target;
          setUserData({ ...userData, [name]: value });
     }

     const handleSwitchChange = (e) => {
          const { name } = e.target;
          setUserData({ ...userData, [name]: !userData[name] });
     }

     const handleSubmit = (e) => {
          e.preventDefault();
          
          const finalSteps = {steps: []};
          
          nonModifiedSteps.steps.forEach(step => {
               const tempArr = [];
               step.forEach(i => tempArr.push({ name: i.name, value: userData[i.name] }))
               finalSteps.steps.push(tempArr);
          })
          
          updateOnboarding(finalSteps);
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
                                                                 checked={ userData[data.name] }
                                                                 onChange={ handleSwitchChange }
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
                                                            placeholder={ data.default }
                                                            value={ userData[data.name] }
                                                            variant="standard"
                                                            multiline={ data.type === "multiline-text" ? true : false }
                                                            minRows={ data.type === "multiline-text" ? 4 : 1 }
                                                            onChange={ handleInputChange }
                                                       />
                                                  </>
                                             }
                                        </FormControl>
                                   )
                         })
                              : <p>Loading ... </p>
                    }
                    <Typography style={{ color: "#FF3A3A", fontSize: "12px" }}>{ error }</Typography>
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