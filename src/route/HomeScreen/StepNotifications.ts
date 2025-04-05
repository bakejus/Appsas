import { useEffect } from 'react';
import Alert, { ALERT_TYPE, Toast, AlertNotificationRoot, Dialog } from 'react-native-alert-notification';

export const StepNotifications = (
    stepsCount: number,
    dailyGoal: number,
    notified: boolean,
    setNotified: (val: boolean) => void
  ) => {
    useEffect(() => {

      if (notified) return;
  
      else if (!notified && stepsCount >= dailyGoal / 2) {
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Great job!',
          textBody: `You're more than halfway to your goal (${stepsCount} steps) today! Keep going!`,
          button: 'OK', 
          onHide: () => {
            // this runs when dialog closes
            console.log('Dialog hidden');
          },        
        });
        setNotified(true);
      }

    else if (!notified && stepsCount >= dailyGoal) {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'OMG!',
        textBody: `You've crushed your goal like a pro! (${stepsCount} steps)`,
        button: 'OK', 
        onHide: () => {
          // this runs when dialog closes
          console.log('Dialog hidden');
        },        
      });
      setNotified(true);
    }

     else if (!notified && stepsCount <= 100) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Difficult day?',
        textBody: `You’ve been rooting in bed all day, huh? You’ve got ${stepsCount} steps.`,
        button: 'OK', 
        onHide: () => {
          // this runs when dialog closes
          console.log('Dialog hidden');
        },        
      });
      setNotified(true);
    }
    
    else if (!notified && stepsCount >= 2*dailyGoal ) {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'UNSTOPPABLE',
        textBody: `You must be the hottest one among your friends, because you did ${stepsCount} steps today!`,
        button: 'OK', 
        onHide: () => {
          // this runs when dialog closes
          console.log('Dialog hidden');
        },        
      });
      setNotified(true);
    }

  }, [stepsCount, notified, dailyGoal]);
};
