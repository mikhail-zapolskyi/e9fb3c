import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import { makeStyles } from "@material-ui/core/styles";

import { Button, FormControl, Input, InputLabel, Switch, Typography, FormControlLabel} from '@material-ui/core';
import "./onboardingForm.css";

const useStyles = makeStyles({
     typographyCustom: {
          color: "#FF3A3A",
          fontSize: "12px"
     }
});

const OnboardingForm = ({ user }) => {
     const classes = useStyles();
     const history = useHistory();
     
     const [isLoggedIn, setIsLoggedIn] = useState(false);
     const [userData, setUserData] = useState({firstName: "", lastName: "", country: "", bio: "", receiveUpdates: false, receiveNotifications: false});
     const [onbordingSteps, setOnboardingSteps] = useState([]);
     const [nonModifiedSteps, setNonModifiedSteps] = useState([]);
     const [currentStep, setCurrentStep] = useState(0);
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
               
               setOnboardingSteps(modifiedData);
          } catch (error) {
               console.log(error)
          }
     }
               
     const updateOnboarding = async (sendData) => {
          try {
               const { data } = await axios.post("/api/onboarding", sendData);
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
                              ? onbordingSteps?.slice(currentStep, currentStep + 3).map((data, index) => {
                                   return (
                                        <FormControl required={data.required && true} fullWidth margin="normal" key={ data.name }>
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
                                                       label={data.label + `${data.required && " *" }`}
                                                  />
                                                  : <>
                                                       <InputLabel htmlFor={ data.name } focused={ false } className="label">{ data.label }</InputLabel>
                                                       <Input
                                                            sx={{ width: "100%", fontSize: "14px" }}
                                                            autoFocus={ index === 0 && true}
                                                            id={ data.name }
                                                            name={ data.name }
                                                            placeholder={ data.default }
                                                            value={ userData[data.name] }
                                                            variant="standard"
                                                            multiline={ data.type === "multiline-text" && true }
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
                    <Typography className={ classes.typographyCustom }>{ error }</Typography>
                    <div className="btnContainer">
                         { currentStep >= 3 
                              &&
                               <Button 
                                   onClick={ () => setCurrentStep(currentStep - 3) } 
                                   variant="contained"
                                   color="primary"
                                   type="button"
                                   >Back</Button>
                         }
                         { currentStep < (onbordingSteps.length - 1) - currentStep 
                              &&
                              <Button 
                                   onClick={ () => setCurrentStep(currentStep + 3) } 
                                   variant="contained" 
                                   color="primary"
                                   type="button"
                                   name="Next"
                                   style={{ gridColumn: "4 / -1"}}>Next</Button>               
                         }
                         {  currentStep >= (onbordingSteps.length - 1) - currentStep 
                              && 
                              <Button 
                                   type="submit"
                                   variant="contained" 
                                   color="primary" 
                                   style={{ gridColumn: "4 / -1"}}>Finish</Button>
                         }
                    </div>
               </form> 
          </div>
     )
}

export default OnboardingForm;