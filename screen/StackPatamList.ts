export type StackParamList = {
    Welcome: undefined;
    SignIn: undefined;
    SignUp: undefined;
    Verify: { length: number; value: string[]; disabled: boolean; onChange: (value: string[]) => void };
};
