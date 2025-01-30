import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import 'assets/css/App.css';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthLayout from 'layouts/auth';
import AdminLayout from 'layouts/admin';
import RtlLayout from 'layouts/rtl';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';
import UnauthorizedPage from './Unauthorized';
import './i18n'; // Import the i18n configuration

const accessToken = localStorage.getItem('accessToken');
const initialRoute = accessToken ? '/admin' : '/admin'; // Determine initial route based on access token presence
// const hasPermission = (pathname) => {
//     const userPermissions = JSON.parse(localStorage.getItem('permissions') || '[]');
//     return userPermissions.includes(pathname); // Check if the pathname is part of the user's permissions
//   };

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ChakraProvider theme={theme}>
        <React.StrictMode>
            <ThemeEditorProvider>
                <Suspense fallback={<div>Loading...</div>}>
                    <HashRouter>
                        {/* <Switch>
                            <Route path={`/auth`} component={AuthLayout} />
                            <Route path={`/admin`} render={(props) => (
                                hasPermission(props.location.pathname) ? <AdminLayout {...props} /> : <UnauthorizedPage/>
                            )} />
                            <Route path="/auth/unauthorized" component={UnauthorizedPage} />
                        </Switch> */}
                        <Redirect from="/" to={initialRoute} />
                        <Switch>
                            <Route path={`/auth`} component={AuthLayout} />
                            <Route path={`/admin`} component={AdminLayout} />
                            <Route path={`/rtl`} component={RtlLayout} />
                            <Redirect from='/' to={initialRoute} />
                        </Switch>
                    </HashRouter>
                </Suspense>
            </ThemeEditorProvider>
        </React.StrictMode>
    </ChakraProvider>
);
