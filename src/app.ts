import * as React from 'react'
import { registerElement, NativeScriptProps, WebViewAttributes } from "react-nativescript";
import type { WebViewExt } from "@nota/nativescript-webview-ext";

registerElement('webViewExt', () => require("@nota/nativescript-webview-ext").WebViewExt);

declare global {
    module JSX {
        interface IntrinsicElements {
            /**
             * If determining the GradientAttributes is too much work,
             * you could substitute it for `any` type!
             */
            webViewExt: NativeScriptProps<any, WebViewExt>,
        }
    }
}

/* Controls react-nativescript log verbosity. true: all logs; false: only error logs. */
Object.defineProperty(global, '__DEV__', { value: false })

/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

import * as ReactNativeScript from 'react-nativescript'
import { mainStackNavigator as AppContainer } from './components/Navigator'

ReactNativeScript.start(React.createElement(AppContainer, {}, null))

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
