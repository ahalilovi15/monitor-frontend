import React, {useEffect} from "react";
import {useState} from "react";
import './MyProfile.css';

import {
    changeEmailForUser,
    checkIfEmailExists,
    getUserDetails,
    sendVerificationEmail,
    checkIfEmailVerified,
    regexEmail
} from "./VerifyEmail";
import request from "../../service";
import {showSwalToast} from "../../utils/utils";

function MyProfile() {

    const [showInitialForm, setInitialForm] = React.useState(true);
    const [showMobileForm, setMobileForm] = React.useState(false);
    const status = {
        state: "valid",
        message: "Email is valid!"
    }
    const [correct, setCorrect] = React.useState(status);

    const initialEmailValue = {
        email: ""
    };
    const initialMobileValue = {
        phone: ""
    };
    const [emailValue, setEmailValue] = React.useState(initialEmailValue)
    const [mobileValue, setMobileValue] = React.useState(initialEmailValue)

    const initialFormData = {
        name: "",
        lastname: "",
        email: "",
        phone: "",
        address: ""
    };

    const [formData, updateFormData] = React.useState(initialFormData);

    React.useEffect(() => {
        getUserDetails().then(res => {
            if (res && res.status == 200) {
                updateFormData(res.data)
                const objekat = {
                    email: res.data.email
                };
                const objekatMobitel = {
                    phone: res.data.phone
                };
                setEmailValue(objekat)
                setMobileValue(objekatMobitel)
            }
        })

    }, [])

    const handleChange = (e) => {
        e.preventDefault()
        setEmailValue({
            ...emailValue,
            [e.target.name]: e.target.value.trim()
        });
        console.log(emailValue.email)

    };

    const handleVerify = (e) => {
        e.preventDefault();

        const user = {
            email: formData.email
        }
        checkIfEmailVerified(user).then(r => {
            // console.log(r);
            if (r && r.status === 200) {
                if (r.message === "Email already verified!") {
                    showSwalToast(r.message, 'success');
                } else {
                    sendVerificationEmail(user).then(r => {
                        if (r && r.status === 200) {
                            showSwalToast('Email sent', 'success');
                        }
                    });
                }
            }
        }, err => {
            console.log(err);
        }).catch(
            err => {
                console.log(err);
            }
        );


    }


    const handleChangeEmail = (e) => {
        e.preventDefault()
        const user = {
            email: emailValue
        }
        if (regexEmail(emailValue)) {
            setCorrect({
                state: "valid",
                message: "Email is valid!"
            });


            checkIfEmailExists(user).then(r => {
                if (r === true) {
                    showSwalToast("Email is already in use!");
                } else {
                    changeEmailForUser(user).then(res => {
                        if (res && res.status === 200) {
                            showSwalToast(res.data.message, 'success');
                        }
                    });
                }
            });
        } else {
            setCorrect({
                state: "invalid",
                message: "Enter a valid Email address!"
            });
        }

    }

    //////////////////////////////////////////////////////////////////Mobile Phone///////////////////////////////
    const handleMobileChange = (e) => {
        e.preventDefault()
        setMobileValue({
            ...mobileValue,
            [e.target.name]: e.target.value.trim()
        });
        console.log(mobileValue)

    };
    if (showInitialForm) {
        return (
            <div className="formDiv">
                <form className="form">
                    <h1>Personal Information</h1>

                    <label htmlFor="Name">Name: </label>
                    <input type='text' value={formData.name} disabled/>

                    <label htmlFor="Surname">Surname: </label>
                    <input type='text' value={formData.lastname} disabled/>

                    <label htmlFor="Address">Address: </label>
                    <input type='text' value={formData.address} disabled/>

                    <label htmlFor="Number">Mobile phone: </label>
                    <input type='text' value={formData.phone} disabled/>

                    <label htmlFor="Email">Email: </label>
                    <input type='text' value={formData.email} disabled/>

                    <input className='custom-btn' type="button" value="CHANGE PASSWORD"/>
                    <input className='custom-btn' type="button" value="VERIFY OR CHANGE EMAIL"
                           onClick={() => setInitialForm(false)}/>
                    <input className='custom-btn' type="button" value="VERIFY OR CHANGE MOBILE PHONE"
                           onClick={() => {setMobileForm(true); setInitialForm(false)}}/>
                </form>
            </div>
        );
    }
    else if (showMobileForm) {
        return (
            <div className="formDiv">
                <form className="form">
                    <h1>CHANGE YOUR PHONE NUMBER</h1>

                    <label htmlFor="Number">Mobile phone: </label>
                    <input type='text' name="phone" value={mobileValue} onChange={handleMobileChange}/>


                    <input className='custom-btn' type="button" value="CHANGE NUMBER"/>
                </form>
                <div>
                    <button className="backToProfile" onClick={() => setInitialForm(true)}>Back to profile</button>
                </div>
            </div>
        );
    }
    else
    return (
        <div className="formDiv">
            <form className="form">
                <h1>Email Verification</h1>
                <input className='custom-btn' type="button" value="VERIFY EMAIL" onClick={handleVerify}/>

            </form>
            <form className="form">
                <h1>Change Email</h1>
                <label htmlFor="Email">Email: </label>
                <input type='text' name="email" value={emailValue.email} onChange={handleChange}/>
                <p className={correct.state}>{correct.message}</p>
                <input className='custom-btn' type="button" value="CHANGE EMAIL" onClick={handleChangeEmail}/>
            </form>
            <div>
                <button className="backToProfile" onClick={() => setInitialForm(true)}>Back to profile</button>
            </div>
        </div>


    );
}

export default MyProfile