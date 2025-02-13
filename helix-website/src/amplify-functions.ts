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

  async function pushQueries(instanceId: string, queries: { id: string, content: string }[]) {
    try {
        const response = await fetch('http://your-server:6969/upload-queries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                instance_id: instanceId,
                queries: queries.map((query, index) => ({
                    id: query.id,
                    content: query.content,
                    position: index
                }))
            })
        });

        if (!response.ok) {
            throw new Error('Failed to upload queries');
        }

        const result = await response.json();
        console.log('Queries uploaded successfully:', result);
    } catch (error) {
        console.error('Error uploading queries:', error);
        throw error;
    }
}