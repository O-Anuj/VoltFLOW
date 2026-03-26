
export const getFirebaseErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'User already exists. Please sign in';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email or password is incorrect';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/popup-closed-by-user':
      return 'Sign in was canceled.';
    case 'auth/popup-blocked':
      return 'Pop-up was blocked by your browser.';
    case 'auth/cancelled-popup-request':
      return 'Only one pop-up request allowed at one time.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};
