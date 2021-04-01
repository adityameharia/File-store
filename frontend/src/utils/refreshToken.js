import setToken from './setToken'
import { auth } from '../utils/firebase'

export const refreshTokenSetup = (res) => {
    // Timing to renew access token
    let refreshTiming = (3600 - 5 * 60) * 1000;
  
    const refreshToken = async () => {
      let token=await auth.currentUser?.getIdToken(/* forceRefresh */ true)
      refreshTiming = (3600 - 5 * 60) * 1000;
      setToken(token)  
      // Setup the other timer after the first one
      setTimeout(refreshToken, refreshTiming);
    };
  
    // Setup first refresh timer
    setTimeout(refreshToken, refreshTiming);
  };