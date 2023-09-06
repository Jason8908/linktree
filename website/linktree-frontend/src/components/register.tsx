'use client';

import settings from '../settings.json';

import { neue } from '../assets/fonts';
import { useState } from 'react';

import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import { toast } from 'react-toastify';

interface RegisterProps {
    handleClick: (event: React.MouseEvent<HTMLLabelElement>) => void
}

export default function Register({handleClick}: RegisterProps) {
    // State variables
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [disableSubmit, setDisabledSubmit] = useState(false);
    const [lblInfo, setLblInfo] = useState("");
    const [usernameInvalid, setUsernameInvalid] = useState(false);
    const [passwordInvalid, setPasswordInvalid] = useState(false);
    const [nameInvalid, setNameInvalid] = useState(false);
    const [loading, setLoading] = useState(false);
    const baseUrl = settings.api.baseUrl;

    function validateForm() {
        let valid = true;
        // Validation fields.
        let infoStr = "";
        let usernameTemp = false;
        let passwordTemp = false;
        let nameTemp = false;
        // Validating form inputs.
        if (!username) {
            valid = false;
            if (!infoStr)
                infoStr = 'Missing required fields.';
            usernameTemp = true;
        }
        if (!password) {
            valid = false;
            if (!infoStr)
                infoStr = 'Missing required fields.';
            passwordTemp = true;
        }
        if (!name) {
            valid = false;
            if (!infoStr)
                infoStr = 'Missing required fields.';
            nameTemp = true;
        }
        // Setting variables
        setLblInfo(infoStr);
        setUsernameInvalid(usernameTemp);
        setPasswordInvalid(passwordTemp);
        setNameInvalid(nameTemp);
        // Returning results.
        return valid;
    }

    function submitForm() {
        // Validating form inputs
        if (!validateForm()) return false;
        setDisabledSubmit(true);
        // Sending POST request to API.
        postRegistration();
    }

    function postRegistration() {
        setLoading(true);
        // Setting up data.
        const url = baseUrl + 'register';
        const body = {
            username: username,
            password: password,
            name: name
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        };
        // Making POST request.
        fetch(url, options)
        .then(response => response.json())
        .then(res => {
            if (res.statusCode == 409)
                toast.error('That username is already taken!');
            else if (!res.data) 
                toast.error('An internal error occurred.');
        })
        .catch(err => {
            console.log('There was an error making a registration API call.', err);
            toast.error('An internal error occurred.');
        })
        .finally(() => {
            setLoading(false);
            setDisabledSubmit(false);
        });
    }

    return (
        <div className="divRegister flex flex-col items-center">
            <h1 className={`${neue.className} h1Register`}>
                {settings.register.heading}
            </h1>
            <br />
            <form action={submitForm} className='formRegister flex-col flex'>
                <input
                    disabled={disableSubmit}
                    className={`inputTxt ${usernameInvalid ? 'invalidInfo' : ''}`}
                    placeholder={settings.register.username}
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <br />
                <input
                    disabled={disableSubmit}
                    className={`inputTxt ${passwordInvalid ? 'invalidInfo' : ''}`}
                    type='password'
                    placeholder={settings.register.password}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <br />
                <input
                    disabled={disableSubmit}
                    className={`inputTxt ${nameInvalid ? 'invalidInfo' : ''}`}
                    placeholder={settings.register.name}
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <br />
                <Button variant="outline-info" className='btnRegister' type="submit" disabled={disableSubmit}>Submit</Button>
                <br />
                <label className='lblSwitchForms text-center' onClick={handleClick}>
                    {settings.register.switchText}
                </label>
                <br />
                <label className='lblInfo'>{lblInfo}</label>
                <br />
                {loading && <FontAwesomeIcon
                    pulse
                    icon={faSpinner}
                    style={{ fontSize: 25 }}
                />}
            </form>
        </div>
    )
}