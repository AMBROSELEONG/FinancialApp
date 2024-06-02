import { View, StatusBar, Image, Text, TouchableOpacity, Animated } from "react-native"
import MainContainer from "../components/MainContainer";
import { SignInCss } from "../objects/commonCss";
import { TextInput, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Welcome from "./Welcome";
import React, { useRef, useEffect } from "react";
import SignUp from "./SignUp";

const SignIn = () => {
    const navigation = useNavigation();
    const theme = {
        roundness: 20, // Set the border radius here
        colors: {
            primary: '#000', // Active outline color
            outline: '#808080', // Outline color
        },
    };

    const Anim = useRef(new Animated.Value(100)).current;
    const Anim1 = useRef(new Animated.Value(110)).current;
    const Anim2 = useRef(new Animated.Value(120)).current;
    const Anim3 = useRef(new Animated.Value(130)).current;
    const Anim4 = useRef(new Animated.Value(140)).current;
    const Anim5 = useRef(new Animated.Value(150)).current;
    const Anim6 = useRef(new Animated.Value(160)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(Anim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(Anim1, {
                toValue: 0,
                duration: 550,
                useNativeDriver: true,
            }),
            Animated.timing(Anim2, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(Anim3, {
                toValue: 0,
                duration: 650,
                useNativeDriver: true,
            }),
            Animated.timing(Anim4, {
                toValue: 0,
                duration: 700,
                useNativeDriver: true,
            }),
            Animated.timing(Anim5, {
                toValue: 0,
                duration: 750,
                useNativeDriver: true,
            }),
            Animated.timing(Anim6, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, [Anim, Anim1, Anim2, Anim3, Anim4, Anim5, Anim6]);

    return (
        <MainContainer>
            <StatusBar backgroundColor="#FFFFFF" />
            <View style={SignInCss.container}>
                <Animated.View style={{ transform: [{ translateY: Anim }] }}>
                    <Image style={SignInCss.Logo} source={require('../assets/Logo.png')} />
                </Animated.View>

                <Animated.View style={{ transform: [{ translateY: Anim1 }] }}>
                    <Text style={SignInCss.Title}>Sign In</Text>
                    <Text style={SignInCss.Content}>Enter your credentials to sign in</Text>
                </Animated.View>

                <Animated.View style={{ transform: [{ translateY: Anim2 }] }}>
                    <TextInput
                        label="Email"
                        mode="outlined"
                        style={SignInCss.Input}
                        placeholder="Please Enter Your Email"
                        theme={theme}
                    />
                    {/* <HelperText type="error" style={SignInCss.InputError}>
                        Email is invalid
                    </HelperText> */}
                </Animated.View>

                <Animated.View style={{ transform: [{ translateY: Anim3 }] }}>
                    <TextInput
                        label="Password"
                        mode="outlined"
                        style={SignInCss.Input}
                        placeholder="Please Enter Your Password"
                        theme={theme}
                    />
                    {/* <HelperText type="error" style={SignInCss.InputError}>
                        Password is invalid
                    </HelperText> */}

                    <Text style={SignInCss.Forgot} onPress={() => navigation.navigate(Welcome as never)}>Forgot Password?</Text>
                </Animated.View>
                <Animated.View style={{ transform: [{ translateY: Anim4 }] }}>
                    <TouchableOpacity style={SignInCss.LoginButton}>
                        <Text style={SignInCss.BtnText}>SIGN IN</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View style={{ transform: [{ translateY: Anim5 }] }}>
                    <View style={SignInCss.Other}>
                        <View style={SignInCss.Line}></View>
                        <Text style={SignInCss.Or}>Or Sign In with</Text>
                        <View style={SignInCss.Line}></View>
                    </View>
                </Animated.View>

                <Animated.View style={{ transform: [{ translateY: Anim6 }] }}>
                    <TouchableOpacity style={SignInCss.Finger}>
                        <Image style={SignInCss.Finger} source={require('../assets/fingerprint.png')} />
                    </TouchableOpacity>
                </Animated.View>

                <Text style={SignInCss.SignUp}>Don't Have an Account? <Text style={{ color: '#3490DE' }} onPress={() => navigation.navigate(SignUp as never)}>Sign Up</Text></Text>

            </View>
        </MainContainer>
    )
}

export default SignIn;