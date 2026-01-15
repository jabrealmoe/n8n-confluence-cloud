import ForgeUI, {
    AdminPage,
    render,
    Text,
    Form,
    CheckboxGroup,
    Checkbox,
    Button,
    useState,
    useAction,
    useEffect
} from '@forge/ui';
import { storage } from '@forge/api';

const STORAGE_KEY = 'pii-settings-v1';

const App = () => {
    const [settings, setSettings] = useState(null);

    // Load settings on mount
    useEffect(async () => {
        const stored = await storage.get(STORAGE_KEY);
        setSettings(stored || {
            email: true,
            phone: true,
            creditCard: true,
            ssn: true,
            passport: true,
            driversLicense: true
        });
    }, []);

    const [submitResult] = useAction(async (formData) => {
        // Convert array of keys back to object
        const newSettings = {
            email: formData.piiTypes.includes('email'),
            phone: formData.piiTypes.includes('phone'),
            creditCard: formData.piiTypes.includes('creditCard'),
            ssn: formData.piiTypes.includes('ssn'),
            passport: formData.piiTypes.includes('passport'),
            driversLicense: formData.piiTypes.includes('driversLicense')
        };

        await storage.set(STORAGE_KEY, newSettings);
        setSettings(newSettings);
    }, async () => { });

    if (!settings) {
        return <Text>Loading settings...</Text>;
    }

    // Helper to safely check if type is in settings
    const defaultChecked = Object.keys(settings).filter(k => settings[k]);

    return (
        <AdminPage>
            <Text>Use the settings below to control which types of PII are automatically detected and acted upon.</Text>
            <Form onSubmit={submitResult} submitButtonText="Save Configuration">
                <CheckboxGroup name="piiTypes" label="Enabled PII Detectors">
                    <Checkbox defaultChecked={settings.email} value="email" label="Email Addresses" />
                    <Checkbox defaultChecked={settings.phone} value="phone" label="Phone Numbers" />
                    <Checkbox defaultChecked={settings.creditCard} value="creditCard" label="Credit Card Numbers" />
                    <Checkbox defaultChecked={settings.ssn} value="ssn" label="Social Security Numbers (SSN)" />
                    <Checkbox defaultChecked={settings.passport} value="passport" label="Passport Numbers" />
                    <Checkbox defaultChecked={settings.driversLicense} value="driversLicense" label="Driver's Licenses" />
                </CheckboxGroup>
            </Form>
        </AdminPage>
    );
};

export const run = render(
    <App />
);
