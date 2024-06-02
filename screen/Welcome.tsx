import { View, StatusBar, Image, Text, TouchableOpacity, Animated } from "react-native"
import { WelcomeCss } from "../objects/commonCss";
import MainContainer from "../components/MainContainer";
import React, { useRef, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const Welcome = () => {
    const navigation = useNavigation();
    const Anim = useRef(new Animated.Value(100)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(Anim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, [Anim]);

    return (
        <MainContainer>
            <StatusBar backgroundColor="#FFFFFF" />
            <View style={WelcomeCss.Container}>
                <Animated.View style={{ transform: [{ translateY: Anim }] }}>
                    <Image style={WelcomeCss.Logo} source={require('../assets/Logo.png')} />
                </Animated.View>

                <Animated.View style={{ transform: [{ translateY: Anim }] }}>
                    <TouchableOpacity style={WelcomeCss.Login} onPress={() => navigation.navigate(SignIn as never)}>
                        <Text style={WelcomeCss.BtnText}>LOGIN</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View style={{ transform: [{ translateY: Anim }] }}>
                    <TouchableOpacity style={WelcomeCss.SignUp} onPress={() => navigation.navigate(SignUp as never)}>
                        <Text style={[WelcomeCss.BtnText, { color: '#000' }]}>SIGN UP</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </MainContainer>
    )
}

export default Welcome;