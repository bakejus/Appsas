import AppleHealthKit, { HealthInputOptions, HealthKitPermissions } from 'react-native-health';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { initialize, requestPermission, readRecords } from 'react-native-health-connect';
import { TimeRangeFilter } from 'react-native-health-connect/lib/typescript/types/base.types';

const permissions: HealthKitPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.FlightsClimbed,
      AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
    ],
    write: [],
  },
};

const healthData = (date: Date) => {
  const [hasPermissions, setHasPermission] = useState(false);
  const [steps, setSteps] = useState(0);
  const [flights, setFlights] = useState(0);
  const [distance, setDistance] = useState(0);

  // iOS - HealthKit
  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }

    AppleHealthKit.isAvailable((err, isAvailable) => {
      if (err) {
        console.log('Error checking availability');
        return;
      }
      if (!isAvailable) {
        console.log('Apple Health not available');
        return;
      }
      AppleHealthKit.initHealthKit(permissions, (err) => {
        if (err) {
          console.log('Error getting permissions');
          return;
        }
        setHasPermission(true);
      });
    });
  }, []);

  useEffect(() => {
    if (!hasPermissions) {
      return;
    }

    const options: HealthInputOptions = {
      date: date.toISOString(),
      includeManuallyAdded: false,
    };

    AppleHealthKit.getStepCount(options, (err, results) => {
      if (err) {
        console.log('Error getting the steps');
        return;
      }
      setSteps(results.value);
    });

    AppleHealthKit.getFlightsClimbed(options, (err, results) => {
      if (err) {
        console.log('Error getting the steps:', err);
        return;
      }
      setFlights(results.value);
    });

    AppleHealthKit.getDistanceWalkingRunning(options, (err, results) => {
      if (err) {
        console.log('Error getting the steps:', err);
        return;
      }
      setDistance(results.value);
    });
  }, [hasPermissions, date]);

  // Android - Health Connect
  const readSampleData = async () => {
    // initialize the client
    const isInitialized = await initialize();
    if (!isInitialized) {
      return;
    }

    // request permissions
    await requestPermission([
      { accessType: 'read', recordType: 'Steps' },
      { accessType: 'read', recordType: 'Distance' },
      { accessType: 'read', recordType: 'FloorsClimbed' },
    ]);

    const timeRangeFilter: TimeRangeFilter = {
      operator: 'between',
      startTime: new Date(date.setHours(0, 0, 0, 0)).toISOString(),
      endTime: new Date(date.setHours(23, 59, 59, 999)).toISOString(),
    };

    // Steps
    const steps = await readRecords('Steps', { timeRangeFilter });
    if (steps && Array.isArray(steps)) {
      const totalSteps = steps.reduce((sum, record) => {
        return sum + (record.count || 0);
      }, 0);
      setSteps(totalSteps);
    } else {
      // Handle case where stepsResult doesn't have expected structure
      console.log('Unexpected steps result structure:', steps);
      setSteps(0);
    }


    // Distance
    const distance = await readRecords('Distance', { timeRangeFilter });
    if (distance && Array.isArray(distance)) {
      const totalDistance = distance.reduce((sum, record) => {
        return sum + (record.distance.inMeters || 0);
      }, 0);
      setDistance(totalDistance);
    } else {
      // Handle case where stepsResult doesn't have expected structure
      console.log('Unexpected distance result structure:', steps);
      setDistance(0);
    }

    // Floors climbed
    const floorsClimbed = await readRecords('FloorsClimbed', { timeRangeFilter });
    if (floorsClimbed && Array.isArray(floorsClimbed)) {
      const totalfloorsClimbed = floorsClimbed.reduce((sum, record) => {
        return sum + (record.floors || 0);
      }, 0);
      setFlights(totalfloorsClimbed);
    } else {
      // Handle case where stepsResult doesn't have expected structure
      console.log('Unexpected floors result structure:', steps);
      setFlights(0);
    }
  };

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }
    readSampleData();
  }, [date]);

  return {
    steps,
    flights,
    distance,
  };
};

export default healthData;