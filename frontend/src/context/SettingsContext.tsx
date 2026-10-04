import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSettings } from '../api';
import type { SiteSettings } from '../types';

const DEFAULT_SETTINGS: SiteSettings & Record<string, string> = {
  hero_title: 'Timeless Elegance, Woven in Silk',
  hero_subtitle: 'Discover beautiful traditional sarees and timeless designs at Bakkiyam Pattu Center, Siruvanthadu.',
  about_text: 'Bakkiyam Pattu Center is a premier traditional saree showroom located in Siruvanthadu, Tamil Nadu. Our collections are focused on authentic handwoven Kanchipuram, Arani, and bridal silk sarees with pure zari tradition.',
  contact_phone_1: '9159808720',
  contact_phone_1_name: 'V. Kannan',
  contact_phone_2: '7871620812',
  contact_phone_2_name: 'V. Kannan',
  contact_phone_3: '9865975616',
  contact_phone_3_name: 'S.K. Veerappan',
  whatsapp_number: '919159808720',
  instagram_url: 'https://www.instagram.com/bhakkiyam_pattu_center?stkn=aW40cHE0MHpmdG13',
  maps_url: 'https://maps.app.goo.gl/b5TtEwr47nMyN39G8?g_st=aw',
  address: 'Meenavar Street, Mottuchulam, Siruvanthadu, Tamil Nadu, India',
};

interface SettingsContextValue {
  settings: SiteSettings & Record<string, string>;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  loading: false,
  refreshSettings: async () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings & Record<string, string>>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshSettings = useCallback(async () => {
    try {
      const data = await getSettings();
      if (data && typeof data === 'object') {
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.warn('[SettingsContext] Failed to fetch settings, using defaults.', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
