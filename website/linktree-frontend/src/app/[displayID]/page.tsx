'use client'

import settings from '../../settings.json';

import { neue } from '../../assets/fonts';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useState, useEffect, Fragment } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Link from '@/components/link';

interface LinkPageParams {
    params: { displayID: string }
}

export interface LinkProps {
    _id: string;
    label: string;
    link: string;
}

export default function LinksPage({ params }: LinkPageParams) {
    // Parameters
    const displayID = params.displayID;
    // Variables
    const [loading, setLoading] = useState(true);
    const [links, setLinks] = useState(new Array<LinkProps>);
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const baseUrl = settings.api.baseUrl;
    // Calling API to find links.
    useEffect(() => {
        // Setting up data.
        const url = baseUrl + `profile/${displayID}`;
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        fetch(url, options)
        .then(response => response.json())
        .then(res => {
            if (res.statusCode == 200) {
                setLinks(res.data.links);
                setUsername(res.data.displayID);
                setName(res.data.name);
            }
            else if (res.statusCode != 404)
                toast.error('An internal error occurred.');
        })
        .catch(err => {
            console.log('There was an error making a registration API call.', err);
            toast.error('An internal error occurred.');
        })
        .finally(() => {
            setLoading(false);
        });
    }, [baseUrl, displayID]);
    return (
        <main className="flex min-h-screen flex-col items-center divMain">
            <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            />
            <div className="divLink flex flex-col items-center">
                {
                    loading &&
                    <FontAwesomeIcon
                        pulse
                        icon={faSpinner}
                        style={{ fontSize: 35 }}
                    />
                }
                {
                    !loading && (links.length < 1) &&
                    (
                        <Fragment>
                            <h1 className={`h1NotFound ${neue.className}`}>
                            {settings.notFound.heading}
                            </h1>
                            <p className={`parNotFound ${neue.className}`}>
                                {settings.notFound.description}
                            </p>
                        </Fragment>
                    )
                }
                {
                    !loading && (links.length > 0)
                        && 
                        <>
                            <h1 className={`h1LinksName ${neue.className}`}>
                                {`${name}'s Links`}
                            </h1>
                            <h2 className={`h2LinksSubtitle ${neue.className}`}>
                                {`@${username}`}
                            </h2>
                            {links.map((link, index) => <Link key={`link${index}`} link={link.link} label={link.label}/>)}
                        </>
                }
            </div>
        </main>
    )
}
