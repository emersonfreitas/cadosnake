import { useState, useEffect } from 'react';
import { Language } from '../utils/i18n';

export type Skin = 'green' | 'blue' | 'purple' | 'gold';
export type Scenario = 'dark' | 'forest' | 'desert' | 'ocean';
export type FoodType = 'apple' | 'mouse' | 'gem' | 'star';
export type ControlType = 'swipe' | 'dpad';

export function useSettings() {
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('cadosnake_lang') as Language) || 'pt');
  const [skin, setSkin] = useState<Skin>(() => (localStorage.getItem('cadosnake_skin') as Skin) || 'green');
  const [scenario, setScenario] = useState<Scenario>(() => (localStorage.getItem('cadosnake_scenario') as Scenario) || 'dark');
  const [foodType, setFoodType] = useState<FoodType>(() => (localStorage.getItem('cadosnake_food') as FoodType) || 'apple');
  const [controlType, setControlType] = useState<ControlType>(() => (localStorage.getItem('cadosnake_control') as ControlType) || 'swipe');

  useEffect(() => { localStorage.setItem('cadosnake_lang', language); }, [language]);
  useEffect(() => { localStorage.setItem('cadosnake_skin', skin); }, [skin]);
  useEffect(() => { localStorage.setItem('cadosnake_scenario', scenario); }, [scenario]);
  useEffect(() => { localStorage.setItem('cadosnake_food', foodType); }, [foodType]);
  useEffect(() => { localStorage.setItem('cadosnake_control', controlType); }, [controlType]);

  return { language, setLanguage, skin, setSkin, scenario, setScenario, foodType, setFoodType, controlType, setControlType };
}
