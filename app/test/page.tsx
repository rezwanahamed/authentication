import React from 'react';
import OtpEmailTemplate from '../_mail/OtpMailTemplate';

const page = () => {
    return (
        <div>
            <OtpEmailTemplate otp='3003214'/>
        </div>
    );
};

export default page;