import { Amplify } from 'aws-amplify';

Amplify.configure({
    Auth: {
        Cognito: {
            region: 'eu-west-2',
            userPoolId: 'eu-west-2_gPaJfgA4L',
            userPoolClientId: '4as7mn137kbdtd4a6c0ef7pel',
        }
    }
}); 