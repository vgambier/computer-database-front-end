import React from 'react';
import { IntlProvider } from 'react-intl';

import { LOCALES } from './locales';

const Provider= ({children, locale}) => (
    <IntlProvider
        locale={locale}
        testComponent={Fragment}
        messages=""
>
}
