import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit"
import {AuthError, AuthStateType, NewUser, User, UserCredentials} from "./auth-types";
import {AxiosResponse} from "axios";
import {auth_api_login, auth_api_signUp} from "./auth-api";
import {AuthResponseDataType, UserModel} from "../../../models/auth-model";
import {showMessage} from "react-native-flash-message";

//Storage import (AsyncStorage)
import LocalStorage from "../../../config/storage"
import {GlobalConstants} from "../../../config/global-constans";
import I18nContext from "../../../config/i18n-polyglot";
import { setUserConnection } from "../user/user-reducer";
import {closeSignalRConnection, connection} from "../chat/chat-reducer";

export const signUpProcess = createAsyncThunk<any, NewUser, { rejectValue: AuthError }>(
    'auth/signUpProcess', async (newUser: NewUser, thunkAPI: any): Promise<void> => {
        //Delete All signUpErrors purpose of trying again
        // -------------
        thunkAPI.dispatch(clearSignUpError(null))
        //Loading State
        thunkAPI.dispatch(setIsAuthStatusLoading(true))

        const {firstname, lastname, username, password} = newUser
        //Validation Could Happen Here

        // -------------

        try {
            //Server Request Time

            //Async functions and try here
            //Do request and get response Anf Check response

            const signUpRequestBody = {
                "Username": username,
                "Password": password
            }

            const signUpResult = await auth_api_signUp(signUpRequestBody)
            if (signUpResult.status === 200) {
                thunkAPI.dispatch(setSignupSuccess(true))
                showMessage({
                    message: "Welcome",
                    description: I18nContext.polyglot?.t("sign_up_success_message"),
                    type: "success"
                })
            } else {
                //Api response status not 200
                //Error message will handle
                showMessage({
                    message: "Oops!!",
                    description: I18nContext.polyglot?.t("something_went_wrong"),
                    type: "danger"
                })
            }
        } catch (e) {
            // console.log(e)
        }
        thunkAPI.dispatch(setIsAuthStatusLoading(false))

    })

export const loginProcess = createAsyncThunk<any, UserCredentials, { rejectValue: AuthError }>(
    'auth/loginProcess',
    async (userCredentials: UserCredentials, thunkAPI: any) => {
        const {username, password} = userCredentials
        // -------------
        //Validation Could Happen Here

        // -------------

        const loginReqBody = {
            Username: username,
            Password: password
        }

        try {
            thunkAPI.dispatch(setIsAuthStatusLoading(true))
            //Login Request
            const loginResult: AxiosResponse<AuthResponseDataType> = await auth_api_login(loginReqBody)
            //Check If Login Status 200
            if (loginResult.status === 200) {

                switch (loginResult.data.message) {
                    case "UserNotExists":
                        showMessage({
                            message: "Oops!!!",
                            description: I18nContext.polyglot?.t("user_not_exists_message"),
                            type: "danger"
                        })
                        break;
                    case "PasswordIsNotCorrect":
                        showMessage({
                            message: "Oops!!!",
                            description: I18nContext.polyglot?.t("password_is_not_correct_message"),
                            type: "danger"
                        })
                        break;
                    default:
                        //User information must be added on this Object
                        //There is a lot of work to be done
                        loginResult.data.user = {
                            username: username,
                            password:password
                        }
                        //Add updated Token to local storage
                        await LocalStorage.save({
                            key: "authData",
                            data: loginResult.data
                        })

                        //Add user to Redux Global State
                        thunkAPI.dispatch(setUser(loginResult.data.user))
                        thunkAPI.dispatch(setAuthToken(loginResult.data.token))
                        showMessage({
                            message: "Welcome",
                            description: I18nContext.polyglot?.t("welcome_name_message", {name: username}),
                            type: "success"
                        })
                }
            }
            else{
                //Test Purpose
                showMessage({
                    message:"Error",
                    description:`${loginResult.data.message}`
                })
                console.log(loginResult)
            }
        } catch (e) {
            showMessage({
                message: "Oops!",
                description: I18nContext.polyglot?.t("something_went_wrong"),
                type: "danger"
            })
        }
        thunkAPI.dispatch(setIsAuthStatusLoading(false))
    }
)


export const initAuth = createAsyncThunk<any, any, { rejectValue: AuthError }>(
    'auth/initAuth',
    async (_: any, thunkAPI: any) => {
        //Check if any auth data in async storage if Token Not expired set User and Do Auth

        try {
            //Get auth data if not expired
            const authData: AuthResponseDataType = await LocalStorage.load({
                key: "authData"
            })

            if(authData){
                thunkAPI.dispatch(loginProcess(authData.user))
            }
            // console.log(authData)
            // // const loginResult: AxiosResponse<AuthResponseDataType> = await auth_api_login(authData.data)
            //
            // //Set auth data to render target screens
            // thunkAPI.dispatch(setUser(authData.user))
            // thunkAPI.dispatch(setAuthToken(authData.token))
            // showMessage({
            //     message: "Welcome",
            //     description: I18nContext.polyglot?.t("welcome_name_message", {name: authData.user.username}),
            //     type: "success"
            // })
        } catch (e) {
            console.log(e)
        }
    })

export const logoutProcess = createAsyncThunk<any, any, { rejectValue: AuthError }>(
    "auth/logoutProcess",
    async (_: any, thunkAPI: any) => {

        try{
            const state = thunkAPI.getState()

            showMessage({
                message:"Oops!!!",
                description:I18nContext.polyglot?.t("log_out_message",{name:state.auth.user.username}),
                type:"warning"
            })
            //Delete user from Global Redux State
            thunkAPI.dispatch(setUser(null))
            thunkAPI.dispatch(setUserConnection(false))
            await connection.stop()
            await connection.off("ReceiveMessage")
            thunkAPI.dispatch(closeSignalRConnection(null))
            //Delete token from Local Storage
            await LocalStorage.remove({
                key: "authData"
            })

        }catch (e) {
            console.log(e)
        }

    }
)

const initialState: AuthStateType= {
    //Form State
    firstname: "",
    lastname: "",
    email: "",
    username:"",
    password: "",
    //signUp Information
    signupHasError: false,
    signupErrorMessage: undefined,
    signupSuccess: false,
    //Login Information
    loginHasError: false,
    loginErrorMessage: undefined,
    //Loader Information
    isAuthStatusLoading: false,
    //Result Information
    user: null
}
export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setIsAuthStatusLoading(state, {payload}: PayloadAction<boolean>) {
            state.isAuthStatusLoading = payload
        },
        clearSignUpForm(state, {payload}: PayloadAction<any>) {
            state.firstname = ""
            state.lastname = ""
            state.email = ""
            state.password = ""
            state.signupSuccess = false
        }
        ,
        clearSignUpError(state, {payload}: PayloadAction<any>) {
            state.signupHasError = false
            state.signupErrorMessage = undefined
        },
        setSignupSuccess(state, {payload}: PayloadAction<boolean>) {
            state.signupSuccess = payload
        },
        setAuthToken(state, {payload}: PayloadAction<string>) {
            GlobalConstants.authToken = payload
        },
        setUser(state, {payload}: PayloadAction<UserModel | null>) {
            state.user = payload
        },
        changeFirstName(state, {payload}: PayloadAction<string>) {
            state.firstname = payload
        },
        changeLastName(state, {payload}: PayloadAction<string>) {
            state.lastname = payload
        },
        changeEmail(state, {payload}: PayloadAction<string>) {
            state.email = payload
        },
        changePassword(state, {payload}: PayloadAction<string>) {
            state.password = payload
        },
        changeUsername(state, {payload}: PayloadAction<string>) {
            state.username = payload
        },
    }
})

export const {
    setUser,
    setSignupSuccess,
    setAuthToken,
    setIsAuthStatusLoading,
    changeFirstName,
    changeLastName,
    changePassword,
    changeEmail,
    changeUsername,
    clearSignUpError,
    clearSignUpForm,
} = authSlice.actions

export default authSlice.reducer
