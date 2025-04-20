import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchInstances,
  selectAllInstances,
  selectInstanceById,
  selectInstancesStatus,
  selectLastFetched,
} from '@/store/features/instancesSlice';

const POLLING_INTERVAL = 20000; // 20 seconds

export function useInstances(userId: string | null) {
  const dispatch = useAppDispatch();
  const instances = useAppSelector(selectAllInstances);
  const status = useAppSelector(selectInstancesStatus);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Function to start polling
  const startPolling = (userId: string) => {
    if (pollingRef.current) return; // Don't start if already polling

    pollingRef.current = setInterval(() => {
      dispatch(fetchInstances(userId));
    }, POLLING_INTERVAL);
  };

  // Function to stop polling
  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  useEffect(() => {
    if (!userId) return;

    // Check if we need to start or stop polling based on instance status
    const hasInitializingInstances = instances.some(
      (instance) => instance.instance_status?.toLowerCase() !== "active"
    );

    if (hasInitializingInstances) {
      startPolling(userId);
    } else {
      stopPolling();
    }

    // Cleanup on unmount
    return () => stopPolling();
  }, [dispatch, userId, instances]);

  return { instances, status };
}

export function useInstance(userId: string | null, instanceId: string) {
  const dispatch = useAppDispatch();
  const instance = useAppSelector(state => selectInstanceById(state, instanceId));
  const status = useAppSelector(selectInstancesStatus);
  const instances = useAppSelector(selectAllInstances);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Function to start polling
  const startPolling = (userId: string) => {
    if (pollingRef.current) return; // Don't start if already polling

    pollingRef.current = setInterval(() => {
      dispatch(fetchInstances(userId));
    }, POLLING_INTERVAL);
  };

  // Function to stop polling
  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  useEffect(() => {
    if (!userId || !instanceId) return;

    // Check if we need to start or stop polling based on instance status
    const isInitializing = instance?.instance_status?.toLowerCase() !== "active";

    if (isInitializing) {
      startPolling(userId);
    } else {
      stopPolling();
    }

    // Cleanup on unmount
    return () => stopPolling();
  }, [dispatch, userId, instanceId, instance]);

  return { instance, status };
} 