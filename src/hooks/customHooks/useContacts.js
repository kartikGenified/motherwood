import {useEffect, useState, useCallback} from 'react';
import { useTranslation } from 'react-i18next';
import {PermissionsAndroid, Platform} from 'react-native';
import Contacts from 'react-native-contacts';

/**
 * useContacts hook
 *
 * Options:
 *  - autoLoad: boolean (default true) — automatically load contacts on mount
 *
 * Returns:
 *  - contacts: array
 *  - status: 'unknown' | 'granted' | 'denied' | 'error'
 *  - loading: boolean
 *  - error: Error|null
 *  - refresh: () => Promise<array>
 *  - requestPermission: () => Promise<'granted'|'denied'|'error'>
 *  - loadContacts: () => Promise<array>
 */
export default function useContacts({ autoLoad = true} = {}) {
  const [contacts, setContacts] = useState([]);
  const [status, setStatus] = useState('unknown');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  const requestPermission = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: t('Contacts'),
            message: t('This app needs access to your contacts.'),
            buttonPositive: t('OK'),
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setStatus('granted');
          return 'granted';
        } else {
          setStatus('denied');
          return 'denied';
        }
      } else {
        // Use the library permission helpers on iOS (and works on Android too)
        const current = await Contacts.checkPermission(); // 'authorized' | 'denied' | 'undefined'
        if (current === 'authorized') {
          setStatus('granted');
          return 'granted';
        }
        if (current === 'denied') {
          setStatus('denied');
          return 'denied';
        }
        const req = await Contacts.requestPermission(); // 'authorized' | 'denied'
        const result = req === 'authorized' ? 'granted' : 'denied';
        setStatus(result === 'granted' ? 'granted' : 'denied');
        return result;
      }
    } catch (err) {
      setError(err);
      setStatus('error');
      return 'error';
    }
  }, []);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const perm = await requestPermission();
      if (perm !== 'granted') {
        setLoading(false);
        return [];
      }
      const list = await Contacts.getAllWithoutPhotos();
      
      // Sort contacts by display name
      const sortedList = list.sort((a, b) => {
        const nameA = (a.displayName || '').toLowerCase();
        const nameB = (b.displayName || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
      
      setContacts(sortedList);
      setLoading(false);
      return sortedList;
    } catch (err) {
      setError(err);
      setStatus('error');
      setLoading(false);
      return [];
    }
  }, [requestPermission]);

  useEffect(() => {
    if (autoLoad) {
      loadContacts();
    }
  }, [autoLoad, loadContacts]);

  const refresh = useCallback(() => loadContacts(), [loadContacts]);

  return {
    contacts,
    status,
    loading,
    error,
    refresh,
    requestPermission,
    loadContacts,
  };
}