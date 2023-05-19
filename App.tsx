import { StyleSheet, Text, View, TextInput,Button,ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import auth from '@react-native-firebase/auth';

const Dummy = () => {

    const [showInputField, setShowInputField] = useState(false)
    const [otp, setOtp] = useState("")
    const [snapVID, setSnapVID] = useState(null)
    const [snapshotStatus,setSnapShotStatus]=useState(false)

    const onPressDummySignUp = () => {

        auth()
            .createUserWithEmailAndPassword('varun.gggg@example.com', 'SuperSecretPassword!')
            .then((res) => {
                console.log('User account created & signed in!: ', res);
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    console.log('That email address is already in use!');
                }

                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                }

                console.error(error);
            });
    }

    const showCurrentNumber = () => {
        const user = auth().currentUser
        console.log("CURRENT NUMBER: ", user?.phoneNumber)
    }


    const onPressUpdate = async () => {
        var snapshot = await auth().verifyPhoneNumber("+918097559990")
            .on('state_changed', (phoneAuthSnapshot) => {
                console.log("Snapshot state: ", phoneAuthSnapshot.state)
                if(phoneAuthSnapshot.state=="timeout"){
                    setShowInputField(true)
                    setSnapShotStatus(false)
                }
                if(phoneAuthSnapshot.state=="sent"){
                    setSnapShotStatus(true)
                }
            })
        console.log("MAIN SNAPSHOT: ", snapshot)
        //@ts-ignore
        setSnapVID(snapshot)


        
        // const credential = auth.PhoneAuthProvider.credential(snapshot.verificationId, snapshot.code)

        // await auth().currentUser?.updatePhoneNumber(credential)


        // console.log("NUMBER HAS BEEN UPDATED: ", credential)





    }

    const otpSubmit=async()=>{
        //@ts-ignore
        const credential = auth.PhoneAuthProvider.credential(snapVID.verificationId, otp)

        await auth().currentUser?.updatePhoneNumber(credential)


        console.log("NUMBER HAS BEEN UPDATED: ", credential)

    }

    const showUpdatedNumber =async () => {




        const user = auth().currentUser
        console.log("UPDATED NUMBER ", user?.phoneNumber)
    }

    const signOut = () => {
        auth().signOut().then(() => console.log("Signed out"))
    }

    return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text onPress={onPressDummySignUp} style={{ color: "red", fontSize: 40, marginBottom: 10 }}>dummy singup</Text>
            <Text onPress={showCurrentNumber} style={{ color: "red", fontSize: 40, marginBottom: 10 }}>showCurrentNumber</Text>
            <Text onPress={onPressUpdate} style={{ color: "red", fontSize: 40, marginBottom: 10 }}>dummy update</Text>
            {snapshotStatus?
            <ActivityIndicator color={"blue"} size={30}/>
             :showInputField ?
            <View>
                <TextInput onChangeText={setOtp} style={{ height: 40, width: 120, borderWidth: 2, borderColor: "black" }} />
                <Button title='Submit otp' onPress={otpSubmit}/>
                </View>
                : <></>}
            <Text onPress={showUpdatedNumber} style={{ color: "red", fontSize: 40, marginBottom: 10 }}>showUpdatedNumber</Text>
            <Text onPress={signOut} style={{ color: "red", fontSize: 40, marginBottom: 10 }}>Sign Out</Text>
        </View>
    )
}

export default Dummy

const styles = StyleSheet.create({})