import { signIn as amplifySignIn, signUp as amplifySignUp, confirmSignUp as amplifyConfirmSignUp, getCurrentUser as amplifyGetCurrentUser } from 'aws-amplify/auth';

export async function signIn(username: string, password: string) {
  try {
    const { isSignedIn, nextStep } = await amplifySignIn({
      username,
      password,
      options: {
        authFlowType: "USER_SRP_AUTH"
      }
    });
    return { isSignedIn, nextStep };
  } catch (error: any) {
    throw new Error(error.message || 'Error signing in');
  }
}

export async function signUp(username: string, password: string) {
  try {
    const { isSignUpComplete, userId, nextStep } = await amplifySignUp({
      username,
      password,
      options: {
        userAttributes: {
          email: username
        }
      }
    });
    return { isSignUpComplete, userId, nextStep };
  } catch (error: any) {
    throw new Error(error.message || 'Error signing up');
  }
}

export async function confirmSignUp(username: string, confirmationCode: string) {
  try {
    const { isSignUpComplete } = await amplifyConfirmSignUp({
      username,
      confirmationCode
    });
    return { isSignUpComplete };
  } catch (error: any) {
    throw new Error(error.message || 'Error confirming sign up');
  }
}

export async function getCurrentUser() {
  try {
    const user = await amplifyGetCurrentUser();
    return user;
  } catch (error) {
    return null;
  }
}
/* 
export const register = async (username: string, password: string) => {
    try {
        const user  = await signUp({
            username,
            password,
            options: {
                userAttributes: {
                email: username,
                },
            },
        });
    } catch (error) {
        console.log('error signing up:', error);
    }
}

export const confirmRegistration = async ({ username, code}: { username: string, code: string }) => {
    try {
      await confirmSignUp({
        username,
        confirmationCode: code,
      });
    } catch (error) {
      console.log('error confirming sign up', error);
    }
  };
   */