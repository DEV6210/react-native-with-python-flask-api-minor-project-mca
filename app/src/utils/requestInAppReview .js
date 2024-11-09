// requestReview.js
import InAppReview from 'react-native-in-app-review';

export const requestInAppReview = async () => {
    try {
        if (InAppReview.isAvailable()) {
            const result = await InAppReview.RequestInAppReview();
            console.log('In-app review requested:', result);
        } else {
            console.log('In-app review is not available');
        }
    } catch (error) {
        console.error('Error requesting in-app review:', error);
    }
};
