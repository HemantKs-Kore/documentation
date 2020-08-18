import { FormField } from './form-field.model';

export interface DeflectAppConfig {
    deflectConfiguration: {
        type: 'IVR' | 'phoneNumber'
        IVR: {
            completed: boolean;
        },
        phoneNumber: {
            completed: boolean;
        },
        sipDomainConfigDetails: {
            sipDomainName: string,
            incomingIpAddresses: string[],
            languagePreference: 'en_US',
        },
        phoneNumberConfigDetails: {
            countryCode: string;
            phoneNumber: string;
        }
    },
    virtualAssistant: {
        type: 'voice' | 'chat'
        enabled: boolean,
        voice: {
            completed: boolean;
        },
        chat: {
            completed: boolean;
        }
    },
    handOff: {
        formSubmission: boolean,
        liveAgent: boolean,
        agentDetails?:any,
        formSubmissionType?: string;
        formDetails?: {
            formName: string,
            agentEmail: string,
            payloadFields: FormField[],
        },

        isFormCompleted?: boolean;
        isAgentDetailsCompleted?: boolean

    }
}