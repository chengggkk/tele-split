'use client'

import WebApp from '@twa-dev/sdk'

const TelegramUser = () => {
    const id = WebApp.initDataUnsafe.user?.id || 'Unknown ID';
    const username = WebApp.initDataUnsafe.user?.username || 'Unknown User';
    const firstName = WebApp.initDataUnsafe.user?.first_name || 'Unknown First Name';
    const lastName = WebApp.initDataUnsafe.user?.last_name || 'Unknown Last Name';
    const language = WebApp.initDataUnsafe.user?.language_code || 'Unknown Language';
    return (
        <div>
            <p>Telegram User: {id}</p>
            <p>Telegram User: {username}</p>
            <p>First Name: {firstName}</p>
            <p>Last Name: {lastName}</p>
            <p>Language: {language}</p>
        </div>
    );
};

export default TelegramUser;
