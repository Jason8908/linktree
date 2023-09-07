'use client'

import settings from '../../settings.json';

import { neue } from '../../assets/fonts';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useState, useEffect, Fragment } from 'react';
import { useCookies } from 'react-cookie';
import jwt_decode from "jwt-decode";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faLink } from "@fortawesome/free-solid-svg-icons";
import Link from '@/components/link';
import EditLink from '@/components/editLink';
import { LinkProps } from '../[displayID]/page';

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [cookies, setCookie, removeCookie] = useCookies(['jwt']);
    const [links, setLinks] = useState(new Array<LinkProps>);
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [editing, setEditing] = useState(false);
    const { push }  = useRouter();
    // Initial mount
    useEffect(() => {
        // Checking for JWT.
        let jwt = cookies.jwt;
        if (!jwt) {
            push('/');
            return;
        }
        // Retrieving link data.
        let token: any;
        try {
            token = jwt_decode(jwt);
        }
        catch {
            removeCookie('jwt');
            push('/');
            return;
        }
        if (!token) {
            removeCookie('jwt');
            push('/');
            return;
        }
        const url = settings.api.baseUrl + `dashboard/${token._id}`;
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt
            }
        }
        // Calling API
        fetch(url, options)
        .then(response => response.json())
        .then(res => {
            if (res.statusCode == 200) {
                setLinks(res.data.links);
                setUsername(res.data.displayID);
                setName(res.data.name);
            }
            else if (res.statusCode == 401) {
                removeCookie('jwt');
                push('/');
                return;
            } 
            else
                toast.error('An internal error occurred.');
        })
        .catch(err => {
            console.log('There was an error making a call to get dashboard info.', err);
            toast.error('An internal error occurred.');
        })
        .finally(() => {
            setLoading(false);
        });
    }, [cookies, push, removeCookie]);
    // Events
    function onClickEdit() {
        setEditing(true);
    }
    function updateLinks(links: Array<LinkProps>) {
        setEditing(false);
        setLinks(links);
    }
    function editLink(link: LinkProps) {
        const newLinks = links.map(l => {
            if (l._id === link._id) {
                console.log('Updated!!');
                const updated = {
                    ...link,
                    link: link.link,
                    label: link.label
                };

                return updated;
            }
      
            return l;
          });
        setLinks(newLinks);
    }
    // Methods
    function copyLink() {
        const baseUrl = (process.env.VERCEL_URL) ? process.env.VERCEL_URL : settings.baseUrl;
        const toCopy = baseUrl + `/${username}`;
        // Copy data to the clipboard.
        navigator.clipboard.writeText(toCopy);
        toast.success('Copied!');
    }
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
                    !loading && username && name
                    &&
                    <>
                        <h1 className={`h1LinksName flex ${neue.className}`}>
                            {`${name}'s Links`}
                            <FontAwesomeIcon
                                className={`iconLink`}
                                icon={faLink}
                                style={{ fontSize: 35 }}
                                onClick={copyLink}
                            />
                        </h1>
                        <h2 className={`h2LinksSubtitle ${neue.className}`}>
                            {`@${username}`}
                        </h2>
                    </>
                }
                {
                    !loading && !editing && username && name 
                    &&
                    <button className={`btnEditSave ${neue.className}`} onClick={onClickEdit}>
                        {settings.dashbaord.edit}
                    </button>
                }
                {
                    !loading && !editing && (links.length > 0)
                        && 
                        <>
                            {links.map((link, index) => <Link key={`link${index}`} link={link.link} label={link.label}/>)}
                        </>
                }
                {
                    !loading && editing
                        && 
                        <EditLink links={links} displayID={username} saveLinks={updateLinks}/>
                }
            </div>
        </main>
    )
}
