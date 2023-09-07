'use client';

import { neue } from '@/assets/fonts';
import { Open_Sans } from 'next/font/google';
import { useEffect, useState, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faSpinner, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useCookies } from 'react-cookie';
import settings from '../settings.json';
import { toast } from 'react-toastify';
const sans = Open_Sans({ weight: "600", subsets: ["latin"] });

interface LinkProps {
    _id?: string;
    label: string;
    link: string;
    tempID?: string;
}

interface EditLinkProps {
    displayID: string;
    links: Array<LinkProps>;
    saveLinks: Function;
}

enum LinkField {
    Link,
    Label
}

export default function EditLink({ links, displayID, saveLinks }: EditLinkProps) {
    // State variables
    const [linksArr, setLinks] = useState(links);
    const [loading, setLoading] = useState(false);
    const [cookies] = useCookies(['jwt']);
    // Methods
    function updateLink(value: string, field: LinkField, id: string) {
        let newList = linksArr.map(l => {
            if (l._id == id || l.tempID == id) {
                if (field === LinkField.Label) {
                    return {
                        ...l,
                        label: value
                    }
                }
                else if (field === LinkField.Link) {
                    return {
                        ...l,
                        link: value
                    }
                }
            }
            return l;
        });
        setLinks(newList);
    }
    function deleteLink(id: string) {
        let newList = linksArr.filter(link => !(link._id == id || link.tempID == id));
        setLinks(newList);
    }
    function addLink() {
        let newList = [...linksArr, {label: '', link: '', tempID: Date.now().toString()}];
        setLinks(newList);
    }
    function onClickSave() {
        const url = settings.api.baseUrl + `links/${displayID}`;
        const body = {
            links: linksArr
        };
        const options = {
            method: 'PUT',
            headers: {
                'Authorization': cookies.jwt,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        };
        setLoading(true);
        // Making POST request.
        fetch(url, options)
        .then(response => response.json())
        .then(res => {
            if (res.statusCode != 200) {
                return toast.error('An internal error occurred.');
            }
            saveLinks(res.data);
        })
        .catch(err => {
            console.log('There was an error making a registration API call.', err);
            toast.error('An internal error occurred.');
        })
        .finally(() => {
            setLoading(false);
        });
    }
    return (
        <>
            <button disabled={loading} className={`btnEditSave ${neue.className}`} onClick={onClickSave}>
                {settings.dashbaord.save}
            </button>
            {
                loading && 
                <FontAwesomeIcon
                    pulse
                    icon={faSpinner}
                    style={{ fontSize: 25 }}
                    className={`iconLoading`}
                />
            }
            {
                linksArr.map((link, i) => {
                    return (
                        <div key={`link${i}`} className='flex flex-row justify-items-center divEditLink'>
                            <input
                                disabled={loading}
                                placeholder={settings.dashbaord.labelPlaceholder}
                                className={`txtLabel ${neue.className}`}
                                value={link.label}
                                onChange={e => updateLink(e.target.value, LinkField.Label, (link._id ? link._id : link.tempID!))}
                            />
                            <input
                                disabled={loading}
                                placeholder={settings.dashbaord.linkPlaceholder}
                                className={`txtLink ${neue.className}`}
                                value={link.link}
                                onChange={e => updateLink(e.target.value, LinkField.Link, (link._id ? link._id : link.tempID!))}
                            />
                            <FontAwesomeIcon
                                className={`iconTrash ${loading ? 'disableButton' : ''}`}
                                icon={faTrashCan}
                                style={{ fontSize: 28 }}
                                onClick={() => deleteLink((link._id ? link._id : link.tempID!))}
                            />
                        </div>
                    )
                })
            }
            <FontAwesomeIcon
                className={`iconPlus ${loading ? 'disableButton' : ''}`}
                icon={faPlus}
                style={{ fontSize: 28 }}
                onClick={addLink}
            />
        </>
    )
}